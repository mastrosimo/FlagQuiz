-- Hardening dei trigger di registrazione/sincronizzazione profilo, senza
-- toccare RLS ne' i dati esistenti. Corregge due bug concreti individuati
-- staticamente nel codice (non un blanket try/catch generico):
--
-- 1. profiles.email era NOT NULL: in qualunque momento in cui auth.users.email
--    fosse null (alcuni flussi di provider lo permettono), l'insert/update su
--    profiles falliva e Postgres annullava l'INTERA transazione su
--    auth.users, perche' questi sono trigger AFTER nella stessa transazione.
--    GoTrue restituiva cosi' gli errori generici "Database error saving/
--    creating/updating user". Fix: la colonna diventa nullable.
--    Nota: UNIQUE su una colonna nullable resta corretto in Postgres — piu'
--    righe con email NULL sono ammesse (NULL non e' mai uguale a NULL), solo
--    le email NON nulle devono restare univoche, esattamente come prima.
-- 2. Nessuno dei due insert/update era idempotente: un retry o un doppio
--    innesco sulla stessa riga falliva per violazione di chiave invece di
--    essere un no-op sicuro.
--
-- Come ultima rete di sicurezza (non sostituisce i due fix sopra, li
-- completa): un errore davvero imprevisto in queste funzioni non blocca piu'
-- la creazione/aggiornamento dell'utente in auth.users, ma viene loggato con
-- RAISE WARNING — visibile nei Postgres Logs del progetto — invece di essere
-- nascosto in silenzio. Se in un caso limite non ancora noto la riga specchio
-- in public.* non venisse creata, l'utente puo' comunque accedere e il
-- warning nei log permette di individuare e riparare quel caso specifico.
--
-- Nessuna policy RLS viene toccata (non tocchiamo la migration 090006).
-- Nessun dato esistente viene modificato o eliminato: l'unica modifica
-- strutturale e' rendere nullable profiles.email, operazione di sola
-- metadata che non riscrive le righe esistenti.

alter table public.profiles alter column email drop not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
    on conflict (id) do nothing;
  insert into public.user_progress (user_id) values (new.id)
    on conflict (user_id) do nothing;
  insert into public.user_collection (user_id) values (new.id)
    on conflict (user_id) do nothing;
  insert into public.user_settings (user_id) values (new.id)
    on conflict (user_id) do nothing;
  return new;
exception
  when others then
    raise warning 'handle_new_user: creazione riga profilo fallita per utente % (email=%): %', new.id, new.email, sqlerrm;
    return new;
end;
$$;

create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
exception
  when others then
    raise warning 'sync_profile_email: aggiornamento email fallito per utente % (email=%): %', new.id, new.email, sqlerrm;
    return new;
end;
$$;
