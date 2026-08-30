-- synced_at distingue una riga "vuota" (creata dal trigger handle_new_user alla
-- registrazione, mai sincronizzata da un client) da una riga che ha gia'
-- ricevuto almeno un push reale. Il frontend (src/services/syncService.ts) usa
-- questo segnale per decidere se proporre il merge guest -> account (Step 7):
-- se synced_at e' null, l'account e' "nuovo" e non c'e' nulla da confrontare.
alter table public.user_progress add column if not exists synced_at timestamptz;
alter table public.user_collection add column if not exists synced_at timestamptz;
alter table public.user_settings add column if not exists synced_at timestamptz;
