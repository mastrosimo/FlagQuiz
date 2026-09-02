export const DUEL_QUESTION_COUNT = 10;
export const DUEL_TIME_LIMIT_MS = 15000;

// Solo per il flusso "sfida un amico" (simulazione manuale di ingresso/pronto):
// il comportamento risposta/velocità del bot vero e proprio è invece in
// `botDifficulty.ts` (BOT_DIFFICULTY_CONFIG), usato per entrambi i flussi.
export const MOCK_OPPONENT_JOIN_DELAY_MS = 700;
export const MOCK_OPPONENT_AUTO_READY_DELAY_MS = 1100;
export const DUEL_ROUND_TRANSITION_MS = 1500;
// Pausa tra "entrambi hanno risposto" e la comparsa dell'esito (giusto/
// sbagliato): senza questa attesa, chi risponde per ultimo vede il reveal
// scattare nell'istante stesso del click. Si applica solo quando entrambi
// rispondono prima dello scadere del tempo — non al timeout naturale, che
// ha gia' la sua pausa nel countdown. Stessa costante concettuale lato
// server in supabase/migrations/20260902120000_delay_duel_round_reveal.sql
// (da tenere allineate manualmente se cambia).
export const DUEL_REVEAL_DELAY_MS = 1200;
export const DUEL_COUNTDOWN_MS = 3000;

// Ritardo minimo prima che il computer "entri" nella partita contro il
// computer: solo per dare un attimo di transizione naturale, non è una vera
// attesa (a differenza della lobby del flusso "sfida un amico").
export const BOT_AUTO_START_DELAY_MS = 350;
