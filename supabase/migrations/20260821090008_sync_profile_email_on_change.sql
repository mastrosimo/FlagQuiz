-- Bug fix: profiles.email veniva scritto solo alla registrazione (dal trigger
-- handle_new_user) e non era mai piu' aggiornato. Dopo un cambio email riuscito
-- (src/services/authService.ts -> updateEmail, supabase.auth.updateUser) la
-- riga in auth.users si aggiorna ma profiles.email restava quella vecchia:
-- una vera fonte di disallineamento, anche se oggi il frontend non legge mai
-- profiles.email (usa sempre auth.users.email dalla sessione). Teniamola
-- comunque corretta per chi consulta la tabella direttamente (dashboard/query).
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
end;
$$;

create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.sync_profile_email();
