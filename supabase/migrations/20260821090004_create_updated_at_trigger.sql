-- Aggiorna automaticamente updated_at ad ogni UPDATE, cosi' il client non deve
-- ricordarsi di farlo (ed e' affidabile per il last-write-wins nella sync futura).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.user_collection
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();
