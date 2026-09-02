import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { buildDuelQuestions } from '../duelEngine';
import { generateMatchCode } from '../codeGenerator';
import { DUEL_QUESTION_COUNT, DUEL_ROUND_TRANSITION_MS, DUEL_TIME_LIMIT_MS } from '../constants';
import type {
  DuelAnswerRecord,
  DuelEngineEvent,
  DuelMatchInfo,
  DuelPlayerId,
  DuelPlayerStats,
  DuelTransport,
} from '../types';

type DuelRole = 'host' | 'guest';

interface DuelMatchRow {
  code: string;
  status: 'waiting' | 'countdown' | 'playing' | 'finished';
  question_count: number;
  time_limit_ms: number;
  created_by: string;
  joined_by: string | null;
  current_question_index: number;
  round_started_at: string | null;
  countdown_ends_at: string | null;
  winner: 'host' | 'guest' | 'draw' | null;
  created_at: string;
}

interface DuelPlayerRow {
  match_code: string;
  user_id: string;
  role: DuelRole;
  display_name: string;
  ready: boolean;
  score: number;
  correct_count: number;
  wrong_count: number;
  current_streak: number;
  best_streak: number;
  fast_answers: number;
}

interface DuelAnswerRow {
  match_code: string;
  user_id: string;
  question_index: number;
  answer_code: string | null;
  correct: boolean;
  time_ms: number;
  points: number;
  combo_multiplier: number;
  timed_out: boolean;
}

const PRESENCE_DISCONNECT_GRACE_MS = 5000;
const ROUND_TICK_INTERVAL_MS = 500;

/**
 * Transport reale su Supabase: Postgres (via funzioni SECURITY DEFINER, mai
 * scritture dirette) e' l'unica fonte di verita', Realtime (postgres_changes)
 * la porta ai client. Ogni riga/evento viene tradotto in un DuelEngineEvent
 * esistente — il reducer e i componenti UI non sanno che non e' piu' il
 * mock. Vedi il piano in supabase/migrations/20260830150000_*.sql per la
 * spiegazione di ogni funzione richiamata qui.
 */
export class SupabaseRealtimeTransport implements DuelTransport {
  readonly kind = 'supabase-realtime';

  private listeners = new Set<(event: DuelEngineEvent) => void>();
  private channel: RealtimeChannel | null = null;
  private localRole: DuelRole | null = null;
  private code: string | null = null;
  private destroyed = false;

  private opponentPresent = false;
  private opponentDisconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private roundTickInterval: ReturnType<typeof setInterval> | null = null;
  private resolvedRoundIndex = -1;
  private lastRoundResolvedAt: number | null = null;
  // Dedup per handleMatchChange: la stessa riga puo' arrivare sia da un
  // evento postgres_changes reale sia dalla risposta diretta della RPC del
  // round-tick (vedi startRoundTick) — senza questi guard, ogni tick da
  // 500ms durante un round gia' in corso ri-emetterebbe COUNTDOWN_STARTED/
  // ROUND_STARTED/MATCH_FINISHED da capo con gli stessi valori.
  private lastCountdownEndsAtMs: number | null = null;
  private lastRoundStartedAtMs: number | null = null;
  private lastKnownQuestionIndex = -1;
  private matchFinishedEmitted = false;
  private localWantsRematch = false;
  private opponentWantsRematch = false;
  private pendingEvents: DuelEngineEvent[] = [];
  private readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  // Un tab in background (schermo bloccato, cambio app su mobile) puo' far
  // rallentare o sospendere del tutto i timer JS e la connessione realtime
  // per qualche secondo — osservato in un test dal vivo: un giocatore e'
  // rimasto bloccato sull'ultima domanda mentre l'altro e' arrivato
  // regolarmente alla schermata finale (stessa partita, stessi dati corretti
  // lato server, quindi non un problema di advance_duel_match). Al ritorno
  // in primo piano ricontrolliamo subito lo stato reale invece di aspettare
  // che l'intervallo da 500ms o il canale si riallineino da soli.
  private readonly handleVisibilityChange = (): void => {
    if (document.visibilityState !== 'visible' || !this.code || this.destroyed) return;
    void this.hydrateExistingPlayers(this.code);
    void this.hydrateMatch(this.code);
  };

  async createMatch(code?: string): Promise<DuelMatchInfo> {
    if (!supabase) throw new Error('supabase_not_configured');
    const matchCode = code ?? generateMatchCode();
    const { data, error } = await supabase.rpc('create_duel_match', {
      p_code: matchCode,
      p_question_count: DUEL_QUESTION_COUNT,
      p_time_limit_ms: DUEL_TIME_LIMIT_MS,
    });
    if (error || !data) throw new Error(error?.message ?? 'duel_create_failed');
    this.localRole = 'host';
    return this.afterConnect(data as DuelMatchRow);
  }

  async joinMatch(code: string): Promise<DuelMatchInfo> {
    if (!supabase) throw new Error('supabase_not_configured');
    const { data, error } = await supabase.rpc('join_duel_match', { p_code: code });
    if (error || !data) throw new Error(error?.message ?? 'duel_join_failed');
    this.localRole = 'guest';
    return this.afterConnect(data as DuelMatchRow);
  }

  setReady(): void {
    if (!supabase || !this.code) return;
    supabase.rpc('set_duel_ready', { p_code: this.code }).then(
      (res) => {
        if (res.error) console.error('[duel] set_duel_ready fallita:', res.error);
      },
      (err) => console.error('[duel] set_duel_ready eccezione:', err),
    );
  }

  // Il terzo parametro (timeMs), calcolato dal chiamante col proprio
  // orologio locale, non viene inoltrato: il tempo autoritativo lo calcola
  // l'Edge Function dal round_started_at del database, mai da un valore
  // fornito dal client.
  //
  // La risposta della funzione contiene gia' la riga completa e
  // autoritativa: la applico subito con handleAnswerInsert invece di
  // aspettare il giro di Realtime che comunque arrivera' (handleAnswerInsert
  // e' gia' scritto per tollerare una riga ripetuta). Senza questo, la
  // propria risposta rimane pending finche' non torna dal canale realtime —
  // se quel giro tarda anche solo oltre la finestra minima di reveal, il
  // giocatore non vede mai evidenziata in rosso la propria scelta sbagliata.
  submitAnswer(questionIndex: number, code: string): void {
    if (!supabase || !this.code) return;
    supabase.functions
      .invoke('duel-submit-answer', { body: { code: this.code, questionIndex, answerCode: code } })
      .then(({ data, error }) => {
        if (error) {
          console.error('[duel] duel-submit-answer fallita:', error);
          return;
        }
        const answer = (data as { answer?: DuelAnswerRow } | null)?.answer;
        if (answer) this.handleAnswerInsert(answer);
      });
  }

  proposeRematch(): void {
    if (!this.channel || this.localWantsRematch) return;
    this.localWantsRematch = true;
    void this.channel.send({ type: 'broadcast', event: 'rematch_proposed', payload: { role: this.localRole } });
    this.emit({ type: 'REMATCH_PROPOSED', playerId: 'local' });
    if (this.opponentWantsRematch) void this.startRematch();
  }

  declineRematch(): void {
    this.localWantsRematch = false;
    this.opponentWantsRematch = false;
    void this.channel?.send({ type: 'broadcast', event: 'rematch_declined', payload: {} });
    this.emit({ type: 'REMATCH_DECLINED' });
  }

  onEvent(handler: (event: DuelEngineEvent) => void): () => void {
    this.listeners.add(handler);
    // hydrateExistingPlayers (in subscribe(), eseguito dentro createMatch/
    // joinMatch) puo' emettere eventi PRIMA che useDuelSession abbia potuto
    // registrare questo handler: senza il buffer andrebbero persi per
    // sempre (es. "l'avversario era gia' in lobby quando sono entrato").
    if (this.pendingEvents.length > 0) {
      const queued = this.pendingEvents;
      this.pendingEvents = [];
      queued.forEach((event) => handler(event));
    }
    return () => this.listeners.delete(handler);
  }

  destroy(): void {
    this.destroyed = true;
    this.listeners.clear();
    this.clearRoundTick();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    if (this.opponentDisconnectTimer) clearTimeout(this.opponentDisconnectTimer);
    if (this.channel) void supabase?.removeChannel(this.channel);
    this.channel = null;
  }

  // --- setup ------------------------------------------------------------

  private async afterConnect(match: DuelMatchRow): Promise<DuelMatchInfo> {
    this.code = match.code;
    await this.subscribe(match.code);
    return {
      code: match.code,
      questionCount: match.question_count,
      timeLimitMs: match.time_limit_ms,
      createdAt: new Date(match.created_at).getTime(),
    };
  }

  private async subscribe(code: string): Promise<void> {
    if (!supabase) return;
    const channel = supabase
      .channel(`duel:${code}`, { config: { presence: { key: this.userId } } })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'duel_matches', filter: `code=eq.${code}` },
        (payload) => this.handleMatchChange(payload.new as DuelMatchRow),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'duel_players', filter: `match_code=eq.${code}` },
        (payload) => this.handlePlayerChange(payload.new as DuelPlayerRow),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'duel_answers', filter: `match_code=eq.${code}` },
        (payload) => this.handleAnswerInsert(payload.new as DuelAnswerRow),
      )
      .on('broadcast', { event: 'rematch_proposed' }, ({ payload }) => this.handleRematchProposed(payload.role))
      .on('broadcast', { event: 'rematch_declined' }, () => this.handleRematchDeclined())
      .on('broadcast', { event: 'rematch_started' }, ({ payload }) => void this.handleRematchStarted(payload?.code))
      .on('presence', { event: 'sync' }, () => this.handlePresenceSync(channel))
      .on('presence', { event: 'join' }, () => this.handlePresenceSync(channel))
      .on('presence', { event: 'leave' }, () => this.handlePresenceSync(channel));

    this.channel = channel;

    await new Promise<void>((resolve) => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          void channel.track({ role: this.localRole });
          resolve();
        }
      });
    });

    await this.hydrateExistingPlayers(code);
    const alreadyFinished = await this.hydrateMatch(code);
    if (!alreadyFinished) this.startRoundTick();
  }

  // Al momento dell'iscrizione, l'altro giocatore potrebbe essere gia'
  // presente in duel_players (es. il guest che entra vede l'host gia' li'):
  // senza questo fetch iniziale, quell'informazione non arriverebbe mai via
  // evento live (l'INSERT dell'host e' avvenuto prima che ci iscrivessimo).
  private async hydrateExistingPlayers(code: string): Promise<void> {
    if (!supabase) return;
    const { data } = await supabase.from('duel_players').select('*').eq('match_code', code);
    (data as DuelPlayerRow[] | null)?.forEach((row) => this.handlePlayerChange(row));
  }

  // Stesso principio di hydrateExistingPlayers, ma per lo stato della
  // partita: senza questo, un refresh o una riconnessione mostrerebbero
  // sempre la lobby (fase iniziale di default) anche se la partita e' gia'
  // in corso o finita — lo stato reale arriverebbe solo tramite un futuro
  // evento live, che pero' potrebbe non arrivare mai piu' se la partita e'
  // gia' conclusa.
  private async hydrateMatch(code: string): Promise<boolean> {
    if (!supabase) return false;
    const { data } = await supabase
      .from('duel_matches')
      .select('code, status, question_count, time_limit_ms, created_by, joined_by, current_question_index, round_started_at, countdown_ends_at, winner, created_at')
      .eq('code', code)
      .maybeSingle();
    if (!data) return false;
    this.handleMatchChange(data as DuelMatchRow);
    return (data as DuelMatchRow).status === 'finished';
  }

  // --- mapping realtime -> eventi motore ----------------------------------

  private handlePlayerChange(row: DuelPlayerRow | undefined): void {
    if (!row || this.destroyed) return;
    const playerId: DuelPlayerId = row.user_id === this.userId ? 'local' : 'opponent';
    const stats: DuelPlayerStats = {
      score: row.score,
      correctCount: row.correct_count,
      wrongCount: row.wrong_count,
      currentStreak: row.current_streak,
      bestStreak: row.best_streak,
      fastAnswers: row.fast_answers,
    };
    // Unica fonte di verita' per punteggio/streak/contatori, per entrambi i
    // giocatori: sovrascrive sempre con i valori reali del database, sia
    // dall'hydrate iniziale (risolve il caso reload a meta' partita) sia da
    // ogni evento live (ogni risposta aggiorna questa riga).
    this.emit({ type: 'PLAYER_STATS_SYNCED', playerId, stats });

    // La propria riga arriva qui sia dall'hydrate iniziale (es. dopo un
    // refresh, ready gia' true da prima) sia dall'evento live scatenato
    // dalla stessa chiamata a set_duel_ready: e' l'UNICO punto che riflette
    // "pronto" per il giocatore locale, setReady() stessa non lo emette mai
    // in modo ottimistico (si affida solo al dato reale del database).
    if (playerId === 'local') {
      if (row.ready) this.emit({ type: 'PLAYER_READY', playerId: 'local' });
      return;
    }
    if (!this.opponentPresent) {
      this.opponentPresent = true;
      this.emit({ type: 'OPPONENT_JOINED', name: row.display_name });
    }
    if (row.ready) this.emit({ type: 'PLAYER_READY', playerId: 'opponent' });
  }

  private handleMatchChange(row: DuelMatchRow | undefined): void {
    if (!row || this.destroyed) return;
    if (row.status === 'countdown' && row.countdown_ends_at) {
      const endsAt = new Date(row.countdown_ends_at).getTime();
      if (endsAt !== this.lastCountdownEndsAtMs) {
        this.lastCountdownEndsAtMs = endsAt;
        this.emit({ type: 'COUNTDOWN_STARTED', endsAt });
      }
    }
    if (
      row.status === 'playing' &&
      row.round_started_at &&
      row.current_question_index >= 0 &&
      new Date(row.round_started_at).getTime() !== this.lastRoundStartedAtMs
    ) {
      const questionIndex = row.current_question_index;
      const roundStartedAt = new Date(row.round_started_at).getTime();
      this.lastRoundStartedAtMs = roundStartedAt;
      const previousIndex = this.lastKnownQuestionIndex;
      this.lastKnownQuestionIndex = questionIndex;

      const emitRoundStarted = () => {
        this.resolvedRoundIndex = -1;
        this.emit({ type: 'ROUND_STARTED', questionIndex, roundStartedAt });
      };

      // maybeResolveRound (la propria verifica "hanno risposto entrambi?")
      // e il tick lato server che avanza la partita corrono in parallelo:
      // se si e' l'ultimo a rispondere, il tick di un altro client puo'
      // vincere la corsa e far arrivare qui il round GIA' avanzato prima
      // che la propria maybeResolveRound abbia anche solo emesso
      // ROUND_RESOLVED — osservato in un test dal vivo come evidenziazione
      // rosso/verde mancante in modo intermittente, perche' il reducer
      // saltava dritto da 'playing' a 'playing' (round successivo) senza
      // mai passare da 'question-transition'. Se il round precedente non
      // risulta ancora risolto, lo forziamo qui: garantisce che il reveal
      // non salti mai, indipendentemente da quale controllo vince la corsa.
      if (previousIndex >= 0 && previousIndex !== questionIndex && previousIndex !== this.resolvedRoundIndex) {
        this.resolvedRoundIndex = previousIndex;
        this.lastRoundResolvedAt = Date.now();
        this.emit({ type: 'ROUND_RESOLVED', questionIndex: previousIndex });
      }

      // Garantiamo comunque una durata minima di reveal (stessa costante
      // usata dal mock) prima di mostrare il round successivo, sia nel caso
      // normale (resolve gia' avvenuto) sia in quello appena forzato sopra.
      const elapsedSinceResolve = this.lastRoundResolvedAt ? Date.now() - this.lastRoundResolvedAt : Infinity;
      if (previousIndex >= 0 && elapsedSinceResolve < DUEL_ROUND_TRANSITION_MS) {
        setTimeout(emitRoundStarted, DUEL_ROUND_TRANSITION_MS - elapsedSinceResolve);
      } else {
        emitRoundStarted();
      }
    }
    if (row.status === 'finished' && row.winner && !this.matchFinishedEmitted) {
      this.matchFinishedEmitted = true;
      this.clearRoundTick();
      const winnerId: DuelPlayerId | 'draw' = row.winner === 'draw' ? 'draw' : row.winner === this.localRole ? 'local' : 'opponent';
      const emitFinished = () => this.emit({ type: 'MATCH_FINISHED', winnerId });

      // Stessa corsa del blocco 'playing' sopra, ma sull'ULTIMO round: la
      // partita puo' passare a 'finished' prima che la propria
      // maybeResolveRound abbia rivelato l'esito dell'ultima risposta,
      // saltando dritti alla schermata finale senza mai mostrare
      // l'evidenziazione rosso/verde di quel round.
      const lastIndex = this.lastKnownQuestionIndex;
      if (lastIndex >= 0 && lastIndex !== this.resolvedRoundIndex) {
        this.resolvedRoundIndex = lastIndex;
        this.lastRoundResolvedAt = Date.now();
        this.emit({ type: 'ROUND_RESOLVED', questionIndex: lastIndex });
      }

      const elapsedSinceResolve = this.lastRoundResolvedAt ? Date.now() - this.lastRoundResolvedAt : Infinity;
      if (elapsedSinceResolve < DUEL_ROUND_TRANSITION_MS) {
        setTimeout(emitFinished, DUEL_ROUND_TRANSITION_MS - elapsedSinceResolve);
      } else {
        emitFinished();
      }
    }
  }

  private handleAnswerInsert(row: DuelAnswerRow | undefined): void {
    if (!row || this.destroyed) return;
    const playerId: DuelPlayerId = row.user_id === this.userId ? 'local' : 'opponent';
    const record: DuelAnswerRecord = {
      code: row.answer_code,
      correct: row.correct,
      timeMs: row.time_ms,
      points: row.points,
      comboMultiplier: row.combo_multiplier,
      timedOut: row.timed_out,
    };
    this.emit({ type: 'ANSWER_RESULT', playerId, questionIndex: row.question_index, record });

    if (row.question_index !== this.resolvedRoundIndex) {
      void this.maybeResolveRound(row.question_index);
    }
  }

  private async maybeResolveRound(questionIndex: number): Promise<void> {
    if (!supabase || !this.code) return;
    const { count } = await supabase
      .from('duel_answers')
      .select('*', { count: 'exact', head: true })
      .eq('match_code', this.code)
      .eq('question_index', questionIndex);
    if (count === 2 && this.resolvedRoundIndex !== questionIndex) {
      this.resolvedRoundIndex = questionIndex;
      this.lastRoundResolvedAt = Date.now();
      this.emit({ type: 'ROUND_RESOLVED', questionIndex });
    }
  }

  private handleRematchProposed(role: DuelRole | undefined): void {
    if (!role || role === this.localRole) return;
    this.opponentWantsRematch = true;
    this.emit({ type: 'REMATCH_PROPOSED', playerId: 'opponent' });
    if (this.localWantsRematch) void this.startRematch();
  }

  private handleRematchDeclined(): void {
    this.localWantsRematch = false;
    this.opponentWantsRematch = false;
    this.emit({ type: 'REMATCH_DECLINED' });
  }

  // Il guest non crea mai la partita (create_duel_match richiede un
  // creatore), ma deve comunque unirsi a quella nuova per avere una propria
  // riga duel_players: senza questo ascoltatore restava bloccato per sempre
  // sulla schermata "in attesa", perche' nessun codice esisteva prima per
  // reagire al broadcast "rematch_started" (bug reale osservato in un test
  // dal vivo — il commento su startRematch parlava gia' di "entrambi i
  // client si ri-agganciano", ma il codice per il lato guest non c'era mai
  // stato scritto).
  private async handleRematchStarted(code: string | undefined): Promise<void> {
    if (!code || !supabase || this.localRole === 'host' || this.destroyed) return;
    const { data, error } = await supabase.rpc('join_duel_match', { p_code: code });
    if (error || !data) {
      console.error('[duel] join_duel_match (rivincita) fallita:', error);
      return;
    }
    await this.reconnectTo(data as DuelMatchRow);
  }

  // Solo l'host crea davvero la nuova partita (create_duel_match richiede un
  // creatore) e trasmette il nuovo codice: il guest si riaggancia tramite
  // handleRematchStarted sopra, stesso principio del cambio URL gia' gestito
  // da DuelMatchPage quando cambia state.match.code.
  private async startRematch(): Promise<void> {
    if (!supabase || this.localRole !== 'host') return;
    this.localWantsRematch = false;
    this.opponentWantsRematch = false;
    const newCode = generateMatchCode();
    const { data, error } = await supabase.rpc('create_duel_match', {
      p_code: newCode,
      p_question_count: DUEL_QUESTION_COUNT,
      p_time_limit_ms: DUEL_TIME_LIMIT_MS,
    });
    if (error || !data) {
      console.error('[duel] create_duel_match (rivincita) fallita:', error);
      return;
    }
    // Atteso (non "void"): il canale attuale viene rimosso dentro
    // reconnectTo() subito dopo — senza aspettare che il broadcast sia
    // davvero stato inviato, la rimozione del canale potrebbe vincere la
    // corsa e il guest non riceverebbe mai il nuovo codice.
    await this.channel?.send({ type: 'broadcast', event: 'rematch_started', payload: { code: newCode } });
    await this.reconnectTo(data as DuelMatchRow);
  }

  private async reconnectTo(match: DuelMatchRow): Promise<void> {
    if (this.channel) await supabase?.removeChannel(this.channel);
    this.opponentPresent = false;
    this.resolvedRoundIndex = -1;
    this.lastRoundResolvedAt = null;
    this.lastCountdownEndsAtMs = null;
    this.lastRoundStartedAtMs = null;
    this.lastKnownQuestionIndex = -1;
    this.matchFinishedEmitted = false;
    // Reset anche qui (non solo in startRematch, che gira solo sull'host):
    // e' l'unico punto attraversato da entrambi i lati di una rivincita, e
    // senza questo il lato guest arriverebbe alla nuova partita con
    // localWantsRematch ancora true dalla precedente, bloccando in silenzio
    // una eventuale rivincita successiva (proposeRematch la ignorerebbe).
    this.localWantsRematch = false;
    this.opponentWantsRematch = false;
    this.code = match.code;
    await this.subscribe(match.code);
    const questions = buildDuelQuestions(match.code, match.question_count);
    this.emit({
      type: 'REMATCH_STARTED',
      match: {
        code: match.code,
        questionCount: match.question_count,
        timeLimitMs: match.time_limit_ms,
        createdAt: new Date(match.created_at).getTime(),
      },
      questions,
    });
  }

  // --- presence (disconnessione reale) ------------------------------------

  private handlePresenceSync(channel: RealtimeChannel): void {
    const state = channel.presenceState();
    const present = Object.keys(state).some((key) => key !== this.userId);
    if (present) {
      if (this.opponentDisconnectTimer) {
        clearTimeout(this.opponentDisconnectTimer);
        this.opponentDisconnectTimer = null;
        this.emit({ type: 'OPPONENT_RECONNECTED' });
      }
    } else if (this.opponentPresent && !this.opponentDisconnectTimer) {
      // Tolleranza prima di considerarlo disconnesso davvero: un refresh
      // veloce della pagina non deve mostrare l'overlay.
      this.opponentDisconnectTimer = setTimeout(() => {
        this.opponentDisconnectTimer = null;
        this.emit({ type: 'OPPONENT_DISCONNECTED' });
      }, PRESENCE_DISCONNECT_GRACE_MS);
    }
  }

  // --- avanzamento round (tick idempotente lato server) -------------------

  // Errori loggati (non silenziosi): un tick fallisce ogni 500ms per tutta
  // la partita se qualcosa non va (es. un permesso mancante) — senza log
  // sarebbe invisibile fino a un blocco totale della partita.
  //
  // La riga restituita da advance_duel_match viene applicata subito con
  // handleMatchChange, non solo affidata al postgres_changes che arrivera'
  // di conseguenza: sono io stesso ad aver appena causato quella scrittura,
  // quindi ho gia' in mano il risultato autoritativo senza dover aspettare
  // un giro di Realtime — se quell'evento dovesse arrivare in ritardo o
  // perdersi (visto in un test dal vivo: partita bloccata sull'ultima
  // domanda a 0s), il client resterebbe altrimenti bloccato all'infinito
  // pur avendo gia' ricevuto la risposta corretta dalla RPC stessa.
  // handleMatchChange e' gia' scritto per essere idempotente su una riga
  // ripetuta (es. stesso "playing" gia' visto), quindi non c'e' rischio di
  // doppio avanzamento nel combinare le due fonti.
  private startRoundTick(): void {
    this.clearRoundTick();
    this.roundTickInterval = setInterval(() => {
      if (!supabase || !this.code || this.destroyed) return;
      supabase.rpc('advance_duel_match', { p_code: this.code }).then(
        (res) => {
          if (res.error) {
            console.error('[duel] advance_duel_match fallita:', res.error);
            return;
          }
          if (res.data) this.handleMatchChange(res.data as DuelMatchRow);
        },
        (err) => console.error('[duel] advance_duel_match eccezione:', err),
      );
    }, ROUND_TICK_INTERVAL_MS);
  }

  private clearRoundTick(): void {
    if (this.roundTickInterval) clearInterval(this.roundTickInterval);
    this.roundTickInterval = null;
  }

  private emit(event: DuelEngineEvent): void {
    if (this.destroyed) return;
    if (this.listeners.size === 0) {
      this.pendingEvents.push(event);
      return;
    }
    this.listeners.forEach((handler) => handler(event));
  }
}
