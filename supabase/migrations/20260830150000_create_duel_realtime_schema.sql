-- Schema per il 1vs1 online reale ("sfida un amico"), server-authoritative:
-- il client puo' solo creare una partita, unirsi, segnalarsi pronto e
-- proporre la propria risposta — mai scrivere direttamente punteggio,
-- correttezza, timing di round o vincitore. Quei valori sono scritti solo
-- da funzioni SECURITY DEFINER (questo file) o dall'Edge Function
-- duel-submit-answer (service_role), mai da una UPDATE diretta del client.
--
-- "Vs Computer" (LocalMockTransport) non usa nulla di questo schema: resta
-- una simulazione locale, invariata.
--
-- Ogni istruzione qui e' scritta per essere sicura da rieseguire da capo
-- (create table/policy solo se mancante, alter publication solo se non gia'
-- membro): se un'esecuzione precedente si e' fermata a meta', rilanciare
-- l'intero file la completa senza errori e senza toccare dati o oggetti gia'
-- creati correttamente — stesso principio delle altre migration del
-- progetto (create table if not exists, create or replace function).

create table if not exists public.duel_matches (
  code text primary key,
  status text not null default 'waiting' check (status in ('waiting', 'countdown', 'playing', 'finished')),
  question_count int not null default 10,
  time_limit_ms int not null default 8000,
  created_by uuid not null references auth.users (id) on delete cascade,
  joined_by uuid references auth.users (id) on delete cascade,
  current_question_index int not null default -1,
  round_started_at timestamptz,
  countdown_ends_at timestamptz,
  winner text check (winner in ('host', 'guest', 'draw')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.duel_matches is
  'Una partita 1vs1 online. code e'' lo stesso codice a 6 caratteri generato dal client (codeGenerator.ts) e usato anche come seed delle domande (buildDuelQuestions) — vedi nota su questo compromesso nel commento finale.';

create table if not exists public.duel_players (
  match_code text not null references public.duel_matches (code) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('host', 'guest')),
  -- Snapshot del nome al momento dell'ingresso in partita, non una FK live
  -- su profiles: il client non puo' leggere il profilo di un altro utente
  -- (RLS profiles_select_own, migration 090006, limita alla propria riga).
  -- Popolato da create_duel_match/join_duel_match, che bypassano quella RLS
  -- in quanto SECURITY DEFINER. Se il nome dell'avversario cambia (non puo':
  -- e' bloccabile una sola volta, migration 20260830130000) durante una
  -- partita, qui resta quello del momento dell'ingresso — comportamento
  -- accettabile e coerente col resto dell'app.
  display_name text not null,
  ready boolean not null default false,
  score int not null default 0,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  current_streak int not null default 0,
  best_streak int not null default 0,
  fast_answers int not null default 0,
  primary key (match_code, user_id)
);

create table if not exists public.duel_answers (
  match_code text not null references public.duel_matches (code) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_index int not null,
  answer_code text,
  correct boolean not null,
  time_ms int not null,
  points int not null,
  combo_multiplier numeric not null,
  timed_out boolean not null default false,
  answered_at timestamptz not null default now(),
  primary key (match_code, user_id, question_index)
);

alter table public.duel_matches enable row level security;
alter table public.duel_players enable row level security;
alter table public.duel_answers enable row level security;

-- duel_matches: leggibile da chiunque sia autenticato (serve per verificare
-- un codice prima di entrare: nessun dato sensibile in questa tabella,
-- solo config/stato). Creabile solo per se stessi. Nessuna UPDATE policy:
-- ogni transizione di stato passa da join_duel_match/advance_duel_match o
-- dall'Edge Function (service_role, bypassa RLS di proposito).
drop policy if exists "duel_matches_select_authenticated" on public.duel_matches;
create policy "duel_matches_select_authenticated"
  on public.duel_matches for select
  to authenticated
  using (true);

drop policy if exists "duel_matches_insert_own" on public.duel_matches;
create policy "duel_matches_insert_own"
  on public.duel_matches for insert
  to authenticated
  with check (created_by = auth.uid());

-- duel_players/duel_answers: leggibili solo dai due partecipanti della
-- partita a cui la riga appartiene.
drop policy if exists "duel_players_select_participants" on public.duel_players;
create policy "duel_players_select_participants"
  on public.duel_players for select
  to authenticated
  using (
    exists (
      select 1 from public.duel_matches m
      where m.code = duel_players.match_code
        and auth.uid() in (m.created_by, m.joined_by)
    )
  );

drop policy if exists "duel_answers_select_participants" on public.duel_answers;
create policy "duel_answers_select_participants"
  on public.duel_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.duel_matches m
      where m.code = duel_answers.match_code
        and auth.uid() in (m.created_by, m.joined_by)
    )
  );

-- Nessuna UPDATE policy su duel_players per il ruolo authenticated: senza
-- una policy che la conceda, RLS nega di default qualunque UPDATE diretta
-- del client (anche sul proprio "ready"). L'unico modo di cambiare questa
-- tabella e' passare da set_duel_ready/advance_duel_match (sotto) o
-- dall'Edge Function con service_role — tutte funzioni SECURITY DEFINER di
-- proprieta' di "postgres", che su Supabase bypassano RLS di default (stesso
-- meccanismo gia' usato da handle_new_user per scrivere su profiles
-- nonostante RLS). Niente trigger di protezione necessario: non esiste
-- proprio un percorso client-side da proteggere.

-- Crea la partita (host) e la riga giocatore corrispondente in un solo
-- passaggio: piu' semplice di una insert diretta su duel_matches seguita da
-- una seconda insert su duel_players con permessi separati.
-- Stesso fallback usato lato client in UserMenu.tsx (display_name, altrimenti
-- la parte prima della @ dell'email): qui gira server-side, con accesso
-- diretto ad auth.users.email che un client non ha mai.
create or replace function public.get_display_name_or_fallback(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_email text;
begin
  select display_name into v_name from public.profiles where id = p_user_id;
  if v_name is not null and btrim(v_name) <> '' then
    return v_name;
  end if;
  select email into v_email from auth.users where id = p_user_id;
  return coalesce(split_part(v_email, '@', 1), 'Player');
end;
$$;

create or replace function public.create_duel_match(
  p_code text,
  p_question_count int default 10,
  p_time_limit_ms int default 8000
)
returns public.duel_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match public.duel_matches;
begin
  insert into public.duel_matches (code, created_by, question_count, time_limit_ms)
    values (p_code, auth.uid(), p_question_count, p_time_limit_ms)
    returning * into v_match;

  insert into public.duel_players (match_code, user_id, role, display_name)
    values (p_code, auth.uid(), 'host', public.get_display_name_or_fallback(auth.uid()));

  return v_match;
end;
$$;

-- Unione atomica: risolve la race di due join simultanei sullo stesso
-- codice (solo una UPDATE puo' vincere la condizione joined_by is null).
-- Idempotente per chi e' gia' partecipante (host o guest): un refresh della
-- pagina a meta' partita perde location.state (l'intent create/join scelto
-- da DuelMatchPage) e ripete sempre un joinMatch — senza questo controllo
-- fallirebbe per entrambi (l'host non puo' unirsi alla propria partita, il
-- guest e' gia' iscritto), rompendo la riconnessione dopo un refresh.
create or replace function public.join_duel_match(p_code text)
returns public.duel_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match public.duel_matches;
begin
  select * into v_match from public.duel_matches
    where code = p_code and auth.uid() in (created_by, joined_by);
  if v_match.code is not null then
    return v_match;
  end if;

  update public.duel_matches
    set joined_by = auth.uid(), updated_at = now()
    where code = p_code
      and joined_by is null
      and created_by <> auth.uid()
      and status = 'waiting'
    returning * into v_match;

  if v_match.code is null then
    raise exception 'duel_match_not_joinable';
  end if;

  insert into public.duel_players (match_code, user_id, role, display_name)
    values (p_code, auth.uid(), 'guest', public.get_display_name_or_fallback(auth.uid()));

  return v_match;
end;
$$;

-- Segna pronto il chiamante; se anche l'altro giocatore lo e' gia', avvia
-- il countdown. Un solo ingresso pubblico per evitare che il client debba
-- fare due chiamate separate (update + controllo incrociato).
create or replace function public.set_duel_ready(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ready_count int;
begin
  update public.duel_players
    set ready = true
    where match_code = p_code and user_id = auth.uid();

  select count(*) into v_ready_count
    from public.duel_players
    where match_code = p_code and ready = true;

  if v_ready_count = 2 then
    update public.duel_matches
      set status = 'countdown', countdown_ends_at = now() + interval '3 seconds', updated_at = now()
      where code = p_code and status = 'waiting';
  end if;
end;
$$;

-- Tick idempotente: avanza la partita SOLO se il tempo reale (now(), non
-- quello del client) e' effettivamente scaduto. Chiamata dal timer locale
-- di entrambi i client (stessa UX di oggi, vedi LocalMockTransport): se uno
-- dei due smette di chiamarla, basta l'altro perche' la partita avanzi
-- comunque.
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

  if v_match.status = 'playing' and v_match.round_started_at is not null and (
       now() >= v_match.round_started_at + make_interval(secs => v_match.time_limit_ms / 1000.0)
       or (
         select count(*) from public.duel_answers
         where match_code = v_match.code and question_index = v_match.current_question_index
       ) = 2
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

  return v_match;
end;
$$;

grant select, insert on public.duel_matches to authenticated;
grant select on public.duel_players to authenticated;
grant select on public.duel_answers to authenticated;

-- Helper interno: mai eseguibile direttamente da un client (permetterebbe di
-- scoprire nome/email di un utente arbitrario passando un uuid a caso).
-- Chiamabile solo da altre funzioni SECURITY DEFINER di proprieta' dello
-- stesso owner (create_duel_match/join_duel_match sopra).
revoke execute on function public.get_display_name_or_fallback(uuid) from public, authenticated;

revoke execute on function public.create_duel_match(text, int, int) from public;
revoke execute on function public.join_duel_match(text) from public;
revoke execute on function public.set_duel_ready(text) from public;
revoke execute on function public.advance_duel_match(text) from public;
grant execute on function public.create_duel_match(text, int, int) to authenticated;
grant execute on function public.join_duel_match(text) to authenticated;
grant execute on function public.set_duel_ready(text) to authenticated;
grant execute on function public.advance_duel_match(text) to authenticated;

-- Senza questo, i client non ricevono alcun evento realtime: una tabella e'
-- "visibile" a supabase.channel(...).on('postgres_changes', ...) solo se
-- aggiunta esplicitamente alla pubblicazione (il Table Editor lo fa da solo
-- per le tabelle create li'; via SQL va fatto a mano, stesso motivo per cui
-- servivano i GRANT nella migration 20260830140000). "alter publication ...
-- add table" non e' idempotente di suo (errore se gia' membro): il blocco
-- DO sotto lo rende sicuro da rieseguire.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'duel_matches'
  ) then
    alter publication supabase_realtime add table public.duel_matches;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'duel_players'
  ) then
    alter publication supabase_realtime add table public.duel_players;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'duel_answers'
  ) then
    alter publication supabase_realtime add table public.duel_answers;
  end if;
end $$;

-- Nota sul seed delle domande: duel_matches.code e' anche il seed passato a
-- buildDuelQuestions (client) e alla copia condivisa in
-- supabase/functions/_shared/duelScoring.ts (Edge Function) — entrambi i
-- lati derivano indipendentemente le stesse 10 bandiere, senza scambiarsele
-- in rete, stesso principio della Sfida del Giorno. Compromesso dichiarato:
-- il codice e' noto a entrambi i giocatori fin dall'inizio, quindi in teoria
-- le bandiere sono calcolabili in anticipo — non e' una regressione (stessa
-- proprieta' gia' presente nella Sfida del Giorno), solo un limite noto.
