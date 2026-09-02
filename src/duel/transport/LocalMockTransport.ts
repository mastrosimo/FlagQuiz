import type {
  DuelEngineEvent,
  DuelMatchInfo,
  DuelMockControls,
  DuelPlayerId,
  DuelPlayerStats,
  DuelTransport,
} from '../types';
import type { Question } from '../../types';
import { generateMatchCode } from '../codeGenerator';
import { resolveAnswer, buildDuelQuestions } from '../duelEngine';
import { isFastAnswer } from '../../utils/scoring';
import {
  DUEL_QUESTION_COUNT,
  DUEL_TIME_LIMIT_MS,
  DUEL_COUNTDOWN_MS,
  DUEL_ROUND_TRANSITION_MS,
  MOCK_OPPONENT_JOIN_DELAY_MS,
  MOCK_OPPONENT_AUTO_READY_DELAY_MS,
  BOT_AUTO_START_DELAY_MS,
} from '../constants';
import { BOT_DIFFICULTY_CONFIG, BOT_NAME, type BotDifficulty } from '../botDifficulty';

// Nomi in stile "username": volutamente non tradotti, come lo sarebbe il nome
// scelto da un vero avversario una volta collegato Supabase Realtime. Usati
// solo dal flusso "sfida un amico" (simulazione manuale); il flusso "contro
// il computer" usa invece BOT_NAME.
const OPPONENT_NAMES = ['FlagBot', 'QuizRival', 'CPU_42'];

function createEmptyStats(): DuelPlayerStats {
  return { score: 0, correctCount: 0, wrongCount: 0, currentStreak: 0, bestStreak: 0, fastAnswers: 0 };
}

export interface LocalMockTransportOptions {
  /** Presente solo per il flusso "1vs1 contro il computer". */
  bot?: {
    difficulty: BotDifficulty;
  };
}

/**
 * Simulazione locale, esplicita, del "secondo giocatore" e del layer di
 * rete. Non è multiplayer reale: nessun dato lascia il browser. Tutte le
 * decisioni che in produzione spetterebbero al server (quando iniziare un
 * round, quando risolverlo, chi vince) sono qui — esattamente perché sono
 * le stesse decisioni che l'Edge Function/RPC di Supabase Realtime dovrà
 * prendere in futuro: sostituire questa classe con `SupabaseRealtimeTransport`
 * non dovrebbe richiedere alcuna modifica al motore o alla UI, perché
 * entrambi conoscono solo `DuelTransport`/`DuelEngineEvent`.
 */
export class LocalMockTransport implements DuelTransport {
  readonly kind = 'local-mock';

  private listeners = new Set<(event: DuelEngineEvent) => void>();
  private match: DuelMatchInfo | null = null;
  private questions: Question[] = [];

  private localReady = false;
  private opponentReady = false;
  private opponentConnected = false;
  private opponentDisconnectedManually = false;

  private currentIndex = -1;
  private resolvedRoundIndex = -1;
  private answeredThisRound = new Set<DuelPlayerId>();
  private roundTimer: ReturnType<typeof setTimeout> | null = null;
  private opponentAnswerTimer: ReturnType<typeof setTimeout> | null = null;
  private advanceTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingTimers: ReturnType<typeof setTimeout>[] = [];

  private stats: Record<DuelPlayerId, DuelPlayerStats> = {
    local: createEmptyStats(),
    opponent: createEmptyStats(),
  };
  private destroyed = false;

  private localWantsRematch = false;
  private opponentWantsRematch = false;

  readonly simulate: DuelMockControls = {
    opponentJoin: () => this.opponentJoin(),
    opponentSetReady: () => this.setReadyFor('opponent'),
    opponentDisconnect: () => this.opponentDisconnect(),
    opponentReconnect: () => this.opponentReconnect(),
    opponentProposeRematch: () => this.requestRematchFor('opponent'),
    // Stesso effetto di "propone": accettare una rivincita già proposta e
    // proporne una per primi sono, per come è modellato lo stato, la stessa
    // cosa ("questo giocatore vuole rigiocare").
    opponentAcceptRematch: () => this.requestRematchFor('opponent'),
  };

  private readonly options: LocalMockTransportOptions;

  constructor(options: LocalMockTransportOptions = {}) {
    this.options = options;
  }

  async createMatch(code?: string): Promise<DuelMatchInfo> {
    this.match = {
      code: code ?? generateMatchCode(),
      questionCount: DUEL_QUESTION_COUNT,
      timeLimitMs: DUEL_TIME_LIMIT_MS,
      createdAt: Date.now(),
      botDifficulty: this.options.bot?.difficulty,
    };
    this.questions = buildDuelQuestions(this.match.code, this.match.questionCount);
    if (this.options.bot) this.autoStartBotMatch();
    return this.match;
  }

  async joinMatch(code: string): Promise<DuelMatchInfo> {
    // Simulazione a singola scheda: non esiste un secondo dispositivo reale da
    // interrogare, quindi il match viene ricostruito localmente dallo stesso
    // codice (deterministico). Con Supabase Realtime questo diventerà una vera
    // lettura della riga `matches` esistente.
    this.match = {
      code,
      questionCount: DUEL_QUESTION_COUNT,
      timeLimitMs: DUEL_TIME_LIMIT_MS,
      createdAt: Date.now(),
    };
    this.questions = buildDuelQuestions(this.match.code, this.match.questionCount);
    return this.match;
  }

  setReady(): void {
    this.setReadyFor('local');
  }

  submitAnswer(questionIndex: number, code: string, timeMs: number): void {
    if (this.destroyed || questionIndex !== this.currentIndex) return;
    if (this.answeredThisRound.has('local')) return; // idempotenza: seconda risposta ignorata
    this.recordAnswer('local', code, timeMs, false);
  }

  proposeRematch(): void {
    // Contro il computer non serve un consenso reciproco: il bot "accetta"
    // sempre, la rivincita parte subito con la stessa difficoltà.
    if (this.options.bot) {
      this.startRematch();
      return;
    }
    this.requestRematchFor('local');
  }

  declineRematch(): void {
    this.localWantsRematch = false;
    this.opponentWantsRematch = false;
    this.emit({ type: 'REMATCH_DECLINED' });
  }

  onEvent(handler: (event: DuelEngineEvent) => void): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  destroy(): void {
    this.destroyed = true;
    this.clearAllTimers();
    this.listeners.clear();
  }

  // --- comandi di simulazione -------------------------------------------------

  private autoStartBotMatch(): void {
    // Stesso percorso di eventi del flusso "sfida un amico" (OPPONENT_JOINED
    // poi PLAYER_READY per entrambi, che fa scattare startCountdown()): qui è
    // solo automatico invece che guidato da click dell'utente/pannello dev —
    // nessuna lobby visibile, nessuna attesa reale.
    this.opponentConnected = true;
    this.track(
      setTimeout(() => {
        this.emit({ type: 'OPPONENT_JOINED', name: BOT_NAME });
        this.setReadyFor('opponent');
        this.setReadyFor('local');
      }, BOT_AUTO_START_DELAY_MS),
    );
  }

  private getBotConfig() {
    return BOT_DIFFICULTY_CONFIG[this.options.bot?.difficulty ?? 'medium'];
  }

  private opponentJoin(): void {
    if (this.opponentConnected) return;
    this.opponentConnected = true;
    const name = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
    this.track(
      setTimeout(() => {
        this.emit({ type: 'OPPONENT_JOINED', name });
        this.track(
          setTimeout(() => this.setReadyFor('opponent'), MOCK_OPPONENT_AUTO_READY_DELAY_MS),
        );
      }, MOCK_OPPONENT_JOIN_DELAY_MS),
    );
  }

  private opponentDisconnect(): void {
    this.opponentDisconnectedManually = true;
    this.clearOpponentAnswerTimer();
    this.emit({ type: 'OPPONENT_DISCONNECTED' });
  }

  private opponentReconnect(): void {
    this.opponentDisconnectedManually = false;
    this.emit({ type: 'OPPONENT_RECONNECTED' });
    // Se il round è ancora aperto e l'avversario non ha risposto, riprende a farlo.
    if (this.currentIndex >= 0 && !this.answeredThisRound.has('opponent')) {
      this.scheduleOpponentAnswer();
    }
  }

  private setReadyFor(playerId: DuelPlayerId): void {
    if (playerId === 'local') this.localReady = true;
    else this.opponentReady = true;
    this.emit({ type: 'PLAYER_READY', playerId });
    if (this.localReady && this.opponentReady) this.startCountdown();
  }

  // --- flusso di partita --------------------------------------------------

  private startCountdown(): void {
    const endsAt = Date.now() + DUEL_COUNTDOWN_MS;
    this.emit({ type: 'COUNTDOWN_STARTED', endsAt });
    this.track(setTimeout(() => this.startRound(0), DUEL_COUNTDOWN_MS));
  }

  private startRound(index: number): void {
    if (this.destroyed || !this.match) return;
    this.currentIndex = index;
    this.answeredThisRound = new Set();
    const roundStartedAt = Date.now();
    this.emit({ type: 'ROUND_STARTED', questionIndex: index, roundStartedAt });

    this.roundTimer = setTimeout(() => this.forceResolveRound(), this.match.timeLimitMs);
    if (!this.opponentDisconnectedManually) this.scheduleOpponentAnswer();
  }

  private scheduleOpponentAnswer(): void {
    this.clearOpponentAnswerTimer();
    if (!this.match) return;
    const { minDelayMs, maxDelayMs } = this.getBotConfig();
    const maxDelay = Math.min(maxDelayMs, this.match.timeLimitMs - 300);
    const delay = minDelayMs + Math.random() * Math.max(200, maxDelay - minDelayMs);
    this.opponentAnswerTimer = setTimeout(() => this.answerAsOpponent(), delay);
    this.track(this.opponentAnswerTimer);
  }

  private answerAsOpponent(): void {
    if (this.answeredThisRound.has('opponent')) return;
    const question = this.questions[this.currentIndex];
    if (!question) return;
    const willBeCorrect = Math.random() < this.getBotConfig().accuracy;
    const wrongOptions = question.options.filter((option) => option.code !== question.correct.code);
    const code = willBeCorrect
      ? question.correct.code
      : (wrongOptions[Math.floor(Math.random() * wrongOptions.length)]?.code ?? question.correct.code);
    const timeMs = Date.now() - (this.roundStartedAtSafe() ?? Date.now());
    this.recordAnswer('opponent', code, timeMs, false);
  }

  private recordAnswer(playerId: DuelPlayerId, code: string | null, timeMs: number, timedOut: boolean): void {
    if (this.answeredThisRound.has(playerId)) return;
    const question = this.questions[this.currentIndex];
    if (!question) return;
    const prev = this.stats[playerId];
    const record = resolveAnswer(question, code, timeMs, prev.currentStreak, timedOut);
    const currentStreak = record.correct ? prev.currentStreak + 1 : 0;
    this.stats[playerId] = {
      score: prev.score + record.points,
      correctCount: prev.correctCount + (record.correct ? 1 : 0),
      wrongCount: prev.wrongCount + (record.correct ? 0 : 1),
      currentStreak,
      bestStreak: Math.max(prev.bestStreak, currentStreak),
      fastAnswers: prev.fastAnswers + (record.correct && isFastAnswer(record.timeMs) ? 1 : 0),
    };
    this.answeredThisRound.add(playerId);
    this.emit({ type: 'ANSWER_RESULT', playerId, questionIndex: this.currentIndex, record });
    this.emit({ type: 'PLAYER_STATS_SYNCED', playerId, stats: this.stats[playerId] });

    if (playerId === 'local') this.clearRoundTimer(); // il timer del round resta solo per forzare l'avversario/timeout
    if (this.answeredThisRound.size === 2) this.resolveRound();
  }

  private forceResolveRound(): void {
    const question = this.questions[this.currentIndex];
    if (!question) return;
    (['local', 'opponent'] as DuelPlayerId[]).forEach((playerId) => {
      if (!this.answeredThisRound.has(playerId)) {
        this.recordAnswer(playerId, null, this.match?.timeLimitMs ?? DUEL_TIME_LIMIT_MS, true);
      }
    });
    this.resolveRound();
  }

  private resolveRound(): void {
    // Guardia di idempotenza: `forceResolveRound` registra le risposte mancanti
    // tramite `recordAnswer`, che a sua volta chiama già `resolveRound()` non
    // appena entrambi i giocatori risultano aver risposto — senza questo guard
    // la chiamata esplicita a fine `forceResolveRound` la eseguirebbe una
    // seconda volta, facendo avanzare lo stato di due round invece di uno.
    if (this.resolvedRoundIndex === this.currentIndex) return;
    this.resolvedRoundIndex = this.currentIndex;
    this.clearRoundTimer();
    this.clearOpponentAnswerTimer();
    this.emit({ type: 'ROUND_RESOLVED', questionIndex: this.currentIndex });
    this.advanceTimer = setTimeout(() => {
      const nextIndex = this.currentIndex + 1;
      if (this.match && nextIndex < this.match.questionCount) {
        this.startRound(nextIndex);
      } else {
        this.finishMatch();
      }
    }, DUEL_ROUND_TRANSITION_MS);
    this.track(this.advanceTimer);
  }

  private finishMatch(): void {
    const winnerId =
      this.stats.local.score === this.stats.opponent.score
        ? 'draw'
        : this.stats.local.score > this.stats.opponent.score
          ? 'local'
          : 'opponent';
    this.emit({ type: 'MATCH_FINISHED', winnerId });
  }

  private requestRematchFor(playerId: DuelPlayerId): void {
    if (playerId === 'local') this.localWantsRematch = true;
    else this.opponentWantsRematch = true;
    this.emit({ type: 'REMATCH_PROPOSED', playerId });
    if (this.localWantsRematch && this.opponentWantsRematch) {
      this.localWantsRematch = false;
      this.opponentWantsRematch = false;
      this.startRematch();
    }
  }

  private startRematch(): void {
    if (!this.match) return;
    const match: DuelMatchInfo = {
      code: generateMatchCode(),
      questionCount: this.match.questionCount,
      timeLimitMs: this.match.timeLimitMs,
      createdAt: Date.now(),
      botDifficulty: this.match.botDifficulty,
    };
    this.match = match;
    this.questions = buildDuelQuestions(match.code, match.questionCount);
    this.currentIndex = -1;
    this.answeredThisRound = new Set();
    this.stats = { local: createEmptyStats(), opponent: createEmptyStats() };
    this.localReady = false;
    this.opponentReady = false;
    this.emit({ type: 'REMATCH_STARTED', match, questions: this.questions });
    (['local', 'opponent'] as DuelPlayerId[]).forEach((playerId) =>
      this.emit({ type: 'PLAYER_STATS_SYNCED', playerId, stats: this.stats[playerId] }),
    );
    // Entrambi hanno già acconsentito: si passa rapidamente da lobby a pronti.
    this.track(setTimeout(() => this.setReadyFor('local'), 200));
    this.track(setTimeout(() => this.setReadyFor('opponent'), 500));
  }

  // --- utility --------------------------------------------------------------

  private roundStartedAtRef = 0;
  private roundStartedAtSafe(): number | null {
    return this.roundStartedAtRef || null;
  }

  private emit(event: DuelEngineEvent): void {
    if (event.type === 'ROUND_STARTED') this.roundStartedAtRef = event.roundStartedAt;
    if (this.destroyed) return;
    this.listeners.forEach((handler) => handler(event));
  }

  private track(timer: ReturnType<typeof setTimeout>): void {
    this.pendingTimers.push(timer);
  }

  private clearRoundTimer(): void {
    if (this.roundTimer) clearTimeout(this.roundTimer);
    this.roundTimer = null;
  }

  private clearOpponentAnswerTimer(): void {
    if (this.opponentAnswerTimer) clearTimeout(this.opponentAnswerTimer);
    this.opponentAnswerTimer = null;
  }

  private clearAllTimers(): void {
    this.clearRoundTimer();
    this.clearOpponentAnswerTimer();
    if (this.advanceTimer) clearTimeout(this.advanceTimer);
    this.pendingTimers.forEach((timer) => clearTimeout(timer));
    this.pendingTimers = [];
  }
}
