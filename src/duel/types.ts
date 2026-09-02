import type { Question } from '../types';
import type { BotDifficulty } from './botDifficulty';

export type DuelPhase =
  | 'lobby'
  | 'countdown'
  | 'playing'
  | 'question-transition'
  | 'finished'
  | 'rematch';

export type DuelTransportKind = 'local-mock' | 'supabase-realtime';

export type DuelPlayerId = 'local' | 'opponent';

export interface DuelAnswerRecord {
  code: string | null;
  correct: boolean;
  timeMs: number;
  points: number;
  comboMultiplier: number;
  timedOut: boolean;
}

export interface DuelPlayerState {
  id: DuelPlayerId;
  name: string;
  connected: boolean;
  ready: boolean;
  score: number;
  correctCount: number;
  wrongCount: number;
  currentStreak: number;
  bestStreak: number;
  fastAnswers: number;
  answers: (DuelAnswerRecord | null)[];
  wantsRematch: boolean;
}

/** Statistiche cumulative di un giocatore, sganciate dallo storico per-round (`answers`). */
export type DuelPlayerStats = Pick<
  DuelPlayerState,
  'score' | 'correctCount' | 'wrongCount' | 'currentStreak' | 'bestStreak' | 'fastAnswers'
>;

export interface DuelMatchInfo {
  code: string;
  questionCount: number;
  timeLimitMs: number;
  createdAt: number;
  /** Presente solo per le partite "contro il computer"; assente tra due persone. */
  botDifficulty?: BotDifficulty;
}

export interface DuelState {
  phase: DuelPhase;
  match: DuelMatchInfo;
  questions: Question[];
  currentQuestionIndex: number;
  roundStartedAt: number | null;
  countdownEndsAt: number | null;
  players: Record<DuelPlayerId, DuelPlayerState>;
  winnerId: DuelPlayerId | 'draw' | null;
  /**
   * Overlay indipendente dalla fase di gioco sottostante (non un valore di
   * `phase`): un evento qualunque che arriva mentre l'avversario è
   * disconnesso (es. il timeout di un round) non deve poter "sovrascrivere"
   * silenziosamente lo stato di disconnessione facendo sparire l'avviso.
   */
  opponentDisconnected: boolean;
}

/**
 * Eventi che il transport recapita al motore. Modellano esattamente ciò che,
 * con Supabase Realtime, arriverebbe come evento broadcast o come esito di
 * una RPC server-authoritative — il reducer non sa (e non deve sapere) se la
 * fonte è il mock locale o la rete.
 */
export type DuelEngineEvent =
  | { type: 'OPPONENT_JOINED'; name: string }
  | { type: 'PLAYER_READY'; playerId: DuelPlayerId }
  | { type: 'COUNTDOWN_STARTED'; endsAt: number }
  | { type: 'ROUND_STARTED'; questionIndex: number; roundStartedAt: number }
  // questionIndex e' la domanda a cui la risposta appartiene realmente, non
  // necessariamente quella corrente: con un transport in rete l'evento di
  // un round puo' arrivare dopo che il client e' gia' passato al successivo
  // (latenza), e senza questo campo il reducer lo scriverebbe per errore
  // nello slot della domanda nuova (vedi duelReducer).
  | { type: 'ANSWER_RESULT'; playerId: DuelPlayerId; questionIndex: number; record: DuelAnswerRecord }
  // Unica fonte di verita' per punteggio/streak/contatori: SOVRASCRIVE (non
  // incrementa) le statistiche del giocatore indicato. ANSWER_RESULT si
  // limita a registrare la risposta nello storico (answers[]) — separare i
  // due eventi evita sia il doppio conteggio sia il disallineamento quando
  // un client si connette/ricarica a meta' partita (vedi
  // hydrateExistingPlayers in SupabaseRealtimeTransport).
  | { type: 'PLAYER_STATS_SYNCED'; playerId: DuelPlayerId; stats: DuelPlayerStats }
  // Stesso motivo di ANSWER_RESULT: il controllo "entrambi hanno risposto"
  // e' asincrono (una query di rete) — se nel frattempo il server e' gia'
  // passato al round successivo, questa conferma tardiva non deve rimettere
  // la fase su "in attesa esito" per la domanda nuova.
  | { type: 'ROUND_RESOLVED'; questionIndex: number }
  | { type: 'MATCH_FINISHED'; winnerId: DuelPlayerId | 'draw' }
  | { type: 'OPPONENT_DISCONNECTED' }
  | { type: 'OPPONENT_RECONNECTED' }
  | { type: 'REMATCH_PROPOSED'; playerId: DuelPlayerId }
  | { type: 'REMATCH_DECLINED' }
  | { type: 'REMATCH_STARTED'; match: DuelMatchInfo; questions: Question[] };

/** Comandi inviati dalla UI verso il transport (mai direttamente allo stato). */
export interface DuelTransport {
  readonly kind: DuelTransportKind;
  createMatch(code?: string): Promise<DuelMatchInfo>;
  joinMatch(code: string): Promise<DuelMatchInfo>;
  setReady(): void;
  submitAnswer(questionIndex: number, code: string, timeMs: number): void;
  proposeRematch(): void;
  declineRematch(): void;
  onEvent(handler: (event: DuelEngineEvent) => void): () => void;
  destroy(): void;
  /** Presenti solo nel transport mock: assenti nella futura implementazione Supabase Realtime. */
  simulate?: DuelMockControls;
}

export interface DuelMockControls {
  opponentJoin(): void;
  opponentSetReady(): void;
  opponentDisconnect(): void;
  opponentReconnect(): void;
  opponentProposeRematch(): void;
  opponentAcceptRematch(): void;
}
