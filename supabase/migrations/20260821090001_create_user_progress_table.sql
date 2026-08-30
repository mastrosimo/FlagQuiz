-- Specchio cloud di src/store/profileStore.ts (stats, xp, achievement, streak, sfida del giorno).
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  xp integer not null default 0,
  stats jsonb not null default '{}'::jsonb,
  unlocked_achievements text[] not null default '{}',
  sound_enabled boolean not null default true,
  daily_streak jsonb not null default '{"current":0,"longest":0,"lastPlayedDate":null}'::jsonb,
  daily_challenge jsonb not null default '{"date":null,"completed":false,"result":null}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.user_progress is 'Specchio cloud dello store profileStore (stats/xp/achievement/streak/daily challenge).';
