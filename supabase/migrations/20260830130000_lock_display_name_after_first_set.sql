-- Il nome visualizzato puo' essere impostato una sola volta: dopo il primo
-- salvataggio valido (non vuoto), diventa definitivo. Il vincolo e' applicato
-- qui, lato database, tramite trigger BEFORE UPDATE — non solo nascondendo il
-- pulsante lato frontend — cosi' resta valido anche se qualcuno chiama la
-- REST API di Supabase direttamente, bypassando l'interfaccia.

alter table public.profiles
  add column if not exists display_name_locked boolean not null default false;

comment on column public.profiles.display_name_locked is
  'true dopo il primo salvataggio non vuoto di display_name: da quel momento display_name non e'' piu'' modificabile. Gestito esclusivamente dal trigger protect_display_name, mai scritto direttamente dal client.';

create or replace function public.protect_display_name()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Il client non puo' mai decidere il valore di display_name_locked: viene
  -- sempre ricalcolato qui, qualunque cosa arrivi nella riga NEW.
  if old.display_name_locked then
    if new.display_name is distinct from old.display_name then
      raise exception 'display_name is locked and cannot be changed';
    end if;
    new.display_name_locked := true;
  elsif new.display_name is not null and btrim(new.display_name) <> '' then
    new.display_name := btrim(new.display_name);
    new.display_name_locked := true;
  else
    new.display_name_locked := false;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_display_name_trigger on public.profiles;

create trigger protect_display_name_trigger
  before update on public.profiles
  for each row execute function public.protect_display_name();
