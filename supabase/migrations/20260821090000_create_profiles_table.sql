-- Profilo pubblico collegato 1:1 a auth.users.
-- auth.users resta la fonte di verità per credenziali/sessione; questa tabella
-- contiene solo i dati "di dominio" che il frontend può leggere via API pubblica.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profilo pubblico 1:1 con auth.users, creato automaticamente alla registrazione.';
