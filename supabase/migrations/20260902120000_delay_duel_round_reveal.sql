-- Quando entrambi i giocatori rispondono prima dello scadere del tempo,
-- advance_duel_match avanzava il round nell'istante stesso in cui vedeva la
-- seconda risposta: per chi rispondeva per ultimo il "reveal" (evidenziazione
-- risposta giusta/sbagliata) sembrava scattare senza nessuna pausa, appena
-- cliccato. Aggiunge un'attesa minima (1.2s, stessa costante concettuale di
-- DUEL_REVEAL_DELAY_MS lato client in src/duel/constants.ts — da tenere
-- allineate manualmente se cambia) tra "hanno risposto entrambi" e
-- l'avanzamento vero e proprio del round. Il ramo "tempo scaduto" resta
-- invariato: se il timer arriva a zero naturalmente non serve altra attesa.
create or replace function public.advance_duel_match(p_code text)
returns public.duel_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match public.duel_matches;
  v_host_score int;
  v_guest_score int;
  v_winner text;
  v_answer_count int;
  v_last_answered_at timestamptz;
begin
  select * into v_match from public.duel_matches where code = p_code for update;
  if v_match.code is null then
    raise exception 'duel_match_not_found';
  end if;

  if v_match.status = 'countdown' and now() >= v_match.countdown_ends_at then
    update public.duel_matches
      set status = 'playing', current_question_index = 0, round_started_at = now(), updated_at = now()
      where code = p_code
      returning * into v_match;
    return v_match;
  end if;

  if v_match.status = 'playing' and v_match.round_started_at is not null then
    select count(*), max(answered_at) into v_answer_count, v_last_answered_at
      from public.duel_answers
      where match_code = v_match.code and question_index = v_match.current_question_index;

    if (
      now() >= v_match.round_started_at + make_interval(secs => v_match.time_limit_ms / 1000.0)
      or (v_answer_count = 2 and now() >= v_last_answered_at + interval '1.2 seconds')
    ) then
      -- Chi non ha ancora risposto a questo round riceve un timeout a 0 punti
      -- (stesso comportamento di forceResolveRound nel mock). Se entrambi
      -- hanno gia' risposto, questa insert e' un no-op e si passa dritti
      -- all'avanzamento: il ritardo "di cortesia" per mostrare il feedback
      -- (DUEL_ROUND_TRANSITION_MS) e' gestito dal client prima di chiamare
      -- questa funzione, non da un vincolo qui.
      insert into public.duel_answers (match_code, user_id, question_index, answer_code, correct, time_ms, points, combo_multiplier, timed_out)
        select v_match.code, dp.user_id, v_match.current_question_index, null, false, v_match.time_limit_ms, 0, 1, true
        from public.duel_players dp
        where dp.match_code = v_match.code
          and not exists (
            select 1 from public.duel_answers da
            where da.match_code = v_match.code
              and da.user_id = dp.user_id
              and da.question_index = v_match.current_question_index
          );

      update public.duel_players set current_streak = 0, wrong_count = wrong_count + 1
        where match_code = v_match.code
          and user_id in (
            select user_id from public.duel_answers
            where match_code = v_match.code and question_index = v_match.current_question_index and timed_out = true
          );

      if v_match.current_question_index + 1 < v_match.question_count then
        update public.duel_matches
          set current_question_index = current_question_index + 1, round_started_at = now(), updated_at = now()
          where code = p_code
          returning * into v_match;
      else
        select score into v_host_score from public.duel_players where match_code = v_match.code and role = 'host';
        select score into v_guest_score from public.duel_players where match_code = v_match.code and role = 'guest';
        v_winner := case when v_host_score = v_guest_score then 'draw' when v_host_score > v_guest_score then 'host' else 'guest' end;
        update public.duel_matches
          set status = 'finished', winner = v_winner, updated_at = now()
          where code = p_code
          returning * into v_match;
      end if;
      return v_match;
    end if;
  end if;

  return v_match;
end;
$$;
