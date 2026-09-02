// Edge Function: unica scrittura autoritativa per una risposta 1vs1.
//
// Stesso pattern di supabase/functions/delete-account: un client scoped al
// JWT del chiamante serve solo per identificarlo in modo sicuro (mai per
// scrivere), un client service_role fa l'unica scrittura fidata. Il client
// non puo' mai dichiarare da solo "la mia risposta e' corretta" o "ho
// risposto in X ms": correttezza e tempo sono ricalcolati qui, il secondo
// usando l'orologio del database (round_started_at), mai quello del
// browser del chiamante.
//
// Deploy: `supabase functions deploy duel-submit-answer` (vedi
// supabase/README.md). SUPABASE_URL/ANON_KEY/SERVICE_ROLE_KEY iniettate
// automaticamente da Supabase, come per delete-account.
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { computeAnswerScore, getComboMultiplier, getCorrectCodeForRound, isFastAnswer } from '../_shared/duelScoring.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

interface SubmitAnswerBody {
  code?: string;
  questionIndex?: number;
  answerCode?: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ error: 'unauthorized' }, 401);

  let body: SubmitAnswerBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'invalid_body' }, 400);
  }
  const { code, questionIndex, answerCode } = body;
  if (!code || typeof questionIndex !== 'number') {
    return jsonResponse({ error: 'invalid_body' }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Solo per identificare CHI chiama: mai usato per scrivere.
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: callerData, error: callerError } = await callerClient.auth.getUser();
  if (callerError || !callerData.user) return jsonResponse({ error: 'unauthorized' }, 401);
  const userId = callerData.user.id;

  // service_role: unico client che scrive duel_answers/duel_players in
  // questa funzione. Bypassa RLS di proposito, esattamente come in
  // delete-account — e' l'intero motivo per cui questa logica vive in
  // un'Edge Function e non in un semplice UPDATE dal client.
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: match, error: matchError } = await adminClient
    .from('duel_matches')
    .select('code, status, question_count, time_limit_ms, created_by, joined_by, current_question_index, round_started_at')
    .eq('code', code)
    .maybeSingle();
  if (matchError || !match) return jsonResponse({ error: 'match_not_found' }, 404);
  if (userId !== match.created_by && userId !== match.joined_by) {
    return jsonResponse({ error: 'not_a_participant' }, 403);
  }
  if (match.status !== 'playing' || questionIndex !== match.current_question_index) {
    // Round gia' avanzato (es. race con l'altro client): non un errore
    // fatale, il client deve semplicemente ignorare e aspettare l'evento
    // realtime aggiornato.
    return jsonResponse({ error: 'stale_round' }, 409);
  }

  // Idempotenza: una seconda chiamata per lo stesso round restituisce il
  // risultato gia' registrato invece di ricalcolare (evita doppio conteggio
  // su retry di rete).
  const { data: existingAnswer } = await adminClient
    .from('duel_answers')
    .select('*')
    .eq('match_code', code)
    .eq('user_id', userId)
    .eq('question_index', questionIndex)
    .maybeSingle();
  if (existingAnswer) return jsonResponse({ answer: existingAnswer }, 200);

  const { data: player, error: playerError } = await adminClient
    .from('duel_players')
    .select('current_streak, best_streak, score, correct_count, wrong_count, fast_answers')
    .eq('match_code', code)
    .eq('user_id', userId)
    .maybeSingle();
  if (playerError || !player) return jsonResponse({ error: 'player_not_found' }, 404);

  // Tempo di risposta calcolato dall'orologio del database (round_started_at
  // e' scritto solo da advance_duel_match), mai da un valore inviato dal
  // client: elimina il cheat sull'orologio locale.
  const roundStartedAtMs = match.round_started_at ? new Date(match.round_started_at).getTime() : Date.now();
  const timeMs = Math.max(0, Date.now() - roundStartedAtMs);

  const correctCode = getCorrectCodeForRound(match.code, match.question_count, questionIndex);
  const correct = Boolean(answerCode) && answerCode === correctCode;
  const streakAfter = correct ? player.current_streak + 1 : 0;
  const points = computeAnswerScore(correct, timeMs, streakAfter);

  const { data: insertedAnswer, error: insertError } = await adminClient
    .from('duel_answers')
    .insert({
      match_code: code,
      user_id: userId,
      question_index: questionIndex,
      answer_code: answerCode ?? null,
      correct,
      time_ms: timeMs,
      points,
      combo_multiplier: getComboMultiplier(streakAfter),
      timed_out: false,
    })
    .select()
    .single();
  if (insertError) return jsonResponse({ error: 'insert_failed' }, 500);

  const { error: updateError } = await adminClient
    .from('duel_players')
    .update({
      score: player.score + points,
      correct_count: player.correct_count + (correct ? 1 : 0),
      wrong_count: player.wrong_count + (correct ? 0 : 1),
      current_streak: streakAfter,
      best_streak: Math.max(player.best_streak, streakAfter),
      fast_answers: player.fast_answers + (correct && isFastAnswer(timeMs) ? 1 : 0),
    })
    .eq('match_code', code)
    .eq('user_id', userId);
  if (updateError) return jsonResponse({ error: 'update_failed' }, 500);

  return jsonResponse({ answer: insertedAnswer }, 200);
});
