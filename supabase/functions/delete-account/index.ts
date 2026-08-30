// Edge Function: elimina l'account dell'utente che chiama la funzione.
//
// La service_role key non deve MAI essere usata nel frontend: questa funzione
// gira lato server (Deno, ambiente Supabase Edge Functions) ed e' l'unico
// punto del progetto in cui la service_role key viene utilizzata, per poter
// chiamare auth.admin.deleteUser (operazione non concessa alla anon key).
//
// Deploy: `supabase functions deploy delete-account` (vedi supabase/README.md).
// Le variabili SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY
// sono iniettate automaticamente da Supabase in ogni Edge Function: non vanno
// configurate manualmente e non finiscono mai nel bundle del frontend.
import { createClient } from 'jsr:@supabase/supabase-js@2';

// supabase-js invoca la funzione da browser: senza questi header la richiesta
// di preflight OPTIONS viene bloccata dal CORS del browser prima ancora che
// la POST reale (con l'Authorization del chiamante) possa partire.
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Client con il JWT del chiamante: serve solo per identificare in modo
  // sicuro CHI sta chiamando (non puo' essere usato per cancellare altri utenti).
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: callerData, error: callerError } = await callerClient.auth.getUser();
  if (callerError || !callerData.user) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  // Client con service_role: usato SOLO qui, server-side, per la singola
  // operazione admin necessaria. Le righe in profiles/user_progress/
  // user_collection/user_settings vengono rimosse automaticamente dalle
  // foreign key "on delete cascade" verso auth.users.
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(callerData.user.id);

  if (deleteError) {
    return jsonResponse({ error: deleteError.message }, 500);
  }

  return jsonResponse({ success: true }, 200);
});
