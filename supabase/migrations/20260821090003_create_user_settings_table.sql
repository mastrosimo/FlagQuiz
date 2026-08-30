-- Specchio cloud di src/i18n/languageStore.ts + src/hooks/useTheme.ts (preferenze cross-device).
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  locale text not null default 'en' check (locale in ('it', 'en')),
  theme text not null default 'light' check (theme in ('light', 'dark')),
  updated_at timestamptz not null default now()
);

comment on table public.user_settings is 'Specchio cloud delle preferenze lingua/tema.';
