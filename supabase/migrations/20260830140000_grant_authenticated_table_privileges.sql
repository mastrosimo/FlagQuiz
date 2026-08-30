-- profiles/user_progress/user_collection/user_settings sono state create con
-- SQL puro (SQL Editor), non con il wizard "New table" del Table Editor: solo
-- quest'ultimo aggiunge automaticamente le GRANT per i ruoli anon/authenticated.
-- Le policy RLS (migration 20260821090006) sono corrette e restano invariate,
-- ma RLS restringe le RIGHE solo *dopo* che il ruolo ha gia' il privilegio di
-- base sulla TABELLA: senza queste GRANT, Postgres nega l'accesso prima
-- ancora di valutare le policy — da qui l'errore osservato in produzione:
-- 42501 "permission denied for table user_progress" (e, allo stesso modo,
-- sulle altre tre tabelle non appena il client le legge/scrive direttamente).
--
-- Il trigger handle_new_user (090005) non risente di questo problema perche'
-- e' security definer: esegue con i privilegi del proprietario della
-- funzione, bypassando sia RLS sia le GRANT del chiamante.
--
-- Concesso solo ad authenticated, mai ad anon: gli utenti guest non devono
-- poter leggere/scrivere queste tabelle. Solo le operazioni gia' coperte da
-- una policy RLS esistente vengono concesse (nessun DELETE: non esiste una
-- policy di delete su queste tabelle, quindi resterebbe comunque bloccato).

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.user_progress to authenticated;
grant select, insert, update on public.user_collection to authenticated;
grant select, insert, update on public.user_settings to authenticated;
