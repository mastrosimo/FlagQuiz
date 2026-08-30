-- RLS: ogni utente autenticato puo' leggere/scrivere esclusivamente le proprie
-- righe (auth.uid() = id/user_id). Nessun accesso e' concesso di default:
-- l'unico modo per bypassare RLS e' la service_role key, che non va MAI usata
-- nel frontend (solo, eventualmente, in funzioni server-side/edge future).

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_collection enable row level security;
alter table public.user_settings enable row level security;

-- profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- niente insert/delete policy su profiles: la riga viene creata dal trigger
-- handle_new_user (security definer) e rimossa in cascata alla cancellazione
-- dell'utente in auth.users; il client non deve mai poterla creare o cancellare
-- direttamente.

-- user_progress
create policy "user_progress_select_own"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "user_progress_insert_own"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "user_progress_update_own"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_collection
create policy "user_collection_select_own"
  on public.user_collection for select
  using (auth.uid() = user_id);

create policy "user_collection_insert_own"
  on public.user_collection for insert
  with check (auth.uid() = user_id);

create policy "user_collection_update_own"
  on public.user_collection for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_settings
create policy "user_settings_select_own"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "user_settings_insert_own"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "user_settings_update_own"
  on public.user_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
