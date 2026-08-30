# Setup Supabase — FlagQuiz

Questa cartella contiene lo schema del database (SQL) e l'unica Edge Function
del progetto. Il collegamento reale del frontend richiede solo le variabili
d'ambiente (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`): nessun file in
`src/` va modificato per andare in produzione.

## 1. Creare il progetto

1. Vai su https://supabase.com e crea un account/organizzazione (azione da fare tu:
   richiede le tue credenziali, non posso farlo per te).
2. Crea un nuovo progetto (regione consigliata: la più vicina agli utenti target,
   es. `eu-central-1`).
3. Salva la password del database che ti viene mostrata una sola volta.

## 2. Applicare le migration

Le migration in `migrations/` sono numerate e vanno applicate **in ordine** (il
prefisso `YYYYMMDDHHMMSS` garantisce l'ordine corretto, dalla `090000` alla
`090008`). Due modi equivalenti, su un progetto nuovo/vuoto:

### Opzione A — Dashboard (nessun tool da installare)

Supabase Dashboard → **SQL Editor** → incolla ed esegui il contenuto di ogni file
in `migrations/`, uno alla volta, nell'ordine numerico indicato dal nome file.

### Opzione B — Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref <il-tuo-project-ref>
supabase db push
```

`--project-ref` si trova in Dashboard → Project Settings → General.

## 3. Recuperare le chiavi API

Dashboard → Project Settings → API:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

⚠️ La **service_role key** NON va mai copiata nel frontend, in `.env`, né in
nessun file che finisce nel bundle Vite. Nel progetto viene usata in un unico
punto, lato server: l'Edge Function `delete-account` (vedi sezione 5), dove
Supabase la inietta automaticamente — non va copiata manualmente da nessuna parte.

## 4. Variabili d'ambiente

Copia `.env.example` nella root del progetto come `.env.local` (già escluso da
git tramite `.gitignore`) e compila i due valori. In produzione (Vercel), aggiungi
le stesse due variabili nelle Environment Variables del progetto.

## 5. Deploy dell'Edge Function `delete-account`

Necessaria per far funzionare "Elimina account" in `/account`: cancellare un
utente da `auth.users` richiede la service_role key, che può girare solo
server-side.

```bash
supabase functions deploy delete-account
```

Nessun secret da configurare a mano: `SUPABASE_URL`, `SUPABASE_ANON_KEY` e
`SUPABASE_SERVICE_ROLE_KEY` sono iniettate automaticamente da Supabase in ogni
Edge Function.

## 6. Configurazione Auth — Redirect URL (obbligatoria)

Supabase Auth rifiuta qualsiasi `redirectTo`/`emailRedirectTo` non presente
nell'allowlist: senza questo passaggio, i link nelle email di conferma
registrazione, reset password e cambio email **non funzionano** (l'utente
finisce sulla Site URL di default invece che sulla pagina corretta).

Dashboard → **Authentication → URL Configuration**:

- **Site URL**: l'URL di produzione, es. `https://flagquiz.eu`
- **Redirect URLs**, aggiungi entrambe le righe (produzione + sviluppo locale):
  - `https://flagquiz.eu/**`
  - `http://localhost:5173/**`

Il frontend usa questi redirect (già nel codice, nessuna modifica da fare):
`/` (conferma registrazione), `/reset-password` (recupero password), `/account`
(conferma cambio email) — tutti coperti dal pattern `/**` sopra.

## Struttura dello schema creato

| Tabella | Chiave | Scopo | Store frontend collegato |
|---|---|---|---|
| `profiles` | `id` → `auth.users.id` | email (specchio, sync automatico), display name | `accountService` |
| `user_progress` | `user_id` → `auth.users.id` | stats, xp, achievement, streak, sfida del giorno | `profileStore` |
| `user_collection` | `user_id` → `auth.users.id` | bandiere riconosciute | `collectionStore` |
| `user_settings` | `user_id` → `auth.users.id` | lingua, tema | `languageStore`, `useTheme` |

`user_progress`/`user_collection`/`user_settings` hanno anche una colonna
`synced_at`: `null` finché il client non ha mai pushato dati (riga "vuota"
creata solo dal trigger di registrazione), valorizzata ad ogni push reale.
`syncService.ts` la usa per distinguere un account nuovo da uno con progressi
cloud già esistenti (vedi Step 7 — merge guest → account).

Tutte le tabelle hanno **Row Level Security** attiva con policy `auth.uid() =
id/user_id`: un utente autenticato può leggere/scrivere esclusivamente le proprie
righe. Le righe di un nuovo utente vengono create automaticamente da un trigger
(`handle_new_user`) al momento della registrazione — il client non deve mai
crearle manualmente. Un secondo trigger (`sync_profile_email`) mantiene
`profiles.email` allineata se l'utente cambia email da `/account`.

Nessun indice oltre a quelli automatici sulle chiavi primarie è necessario: ogni
query del frontend filtra per `id`/`user_id` (già indicizzati dalla PK).
