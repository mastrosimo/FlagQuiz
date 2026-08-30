-- Specchio cloud di src/store/collectionStore.ts (bandiere riconosciute).
create table if not exists public.user_collection (
  user_id uuid primary key references auth.users (id) on delete cascade,
  recognized_codes text[] not null default '{}',
  updated_at timestamptz not null default now()
);

comment on table public.user_collection is 'Specchio cloud dello store collectionStore (codici bandiera riconosciuti).';
