-- L'Edge Function duel-submit-answer si connette come service_role
-- direttamente (non tramite una funzione SECURITY DEFINER): service_role
-- bypassa le RLS, ma ha comunque bisogno dei GRANT di base sulla tabella,
-- esattamente come authenticated (vedi 20260830140000, stesso problema sulle
-- tabelle profiles/user_progress/ecc.). Senza questi GRANT: 42501
-- "permission denied for table duel_matches" — riscontrato in test reale.
--
-- Le funzioni create_duel_match/join_duel_match/set_duel_ready/
-- advance_duel_match non ne hanno bisogno: sono SECURITY DEFINER, eseguono
-- con i privilegi del proprietario (postgres), non come service_role.

grant select on public.duel_matches to service_role;
grant select, update on public.duel_players to service_role;
grant select, insert on public.duel_answers to service_role;
