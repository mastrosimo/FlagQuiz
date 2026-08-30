-- Alla registrazione di un nuovo utente (auth.users), crea automaticamente le
-- righe corrispondenti in profiles/user_progress/user_collection/user_settings
-- con i valori di default, cosi' il frontend puo' sempre assumere che esistano.
-- security definer + search_path fisso: necessario per poter scrivere su
-- public.* da un trigger su auth.users, senza esporre la funzione a injection.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  insert into public.user_progress (user_id) values (new.id);
  insert into public.user_collection (user_id) values (new.id);
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
