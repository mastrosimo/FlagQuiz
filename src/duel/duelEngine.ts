import type { Question } from '../types';
import { buildDailyChallenge } from '../utils/questionGenerator';
import { computeAnswerScore, getComboMultiplier, isFastAnswer } from '../utils/scoring';
import type {
  DuelAnswerRecord,
  DuelEngineEvent,
  DuelMatchInfo,
  DuelPlayerId,
  DuelPlayerState,
  DuelState,
} from './types';

/**
 * Stesso principio di `buildDailyChallenge`: un seed testuale produce sempre
 * lo stesso ordine di bandiere (Fisher-Yates seedato, vedi `utils/shuffle`).
 * Usare il codice partita come seed garantisce che i due giocatori derivino
 * localmente le stesse identiche 10 domande senza scambiarsele in rete —
 * esattamente il meccanismo già collaudato dalla Sfida del Giorno, qui
 * riapplicato a un seed "match" invece che a un seed "data".
 */
export function buildDuelQuestions(seed: string, count: number): Question[] {
  return buildDailyChallenge(seed, count);
}

/**
 * Logica di validazione/punteggio di una risposta. Non dipende da React né
 * dal transport: è la stessa funzione che, quando il transport locale verrà
 * sostituito da Supabase Realtime, dovrà girare lato Edge Function per
 * ricalcolare la risposta corretta e il punteggio senza fidarsi del client.
 * Riusa `computeAnswerScore`/`getComboMultiplier` del motore quiz esistente:
 * nessuna seconda formula di scoring.
 */
export function resolveAnswer(
  question: Question,
  code: string | null,
  timeMs: number,
  streakBefore: number,
  timedOut: boolean,
): DuelAnswerRecord {
  const correct = !timedOut && code !== null && question.correct.code === code;
  const streakAfter = correct ? streakBefore + 1 : 0;
  const points = computeAnswerScore(correct, timeMs, streakAfter);
  return {
    code,
    correct,
    timeMs,
    points,
    comboMultiplier: getComboMultiplier(streakAfter),
    timedOut,
  };
}

function createPlayer(id: DuelPlayerId, name: string, connected: boolean, questionCount: number): DuelPlayerState {
  return {
    id,
    name,
    connected,
    ready: false,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    fastAnswers: 0,
    answers: new Array(questionCount).fill(null),
    wantsRematch: false,
  };
}

export function createInitialDuelState(
  match: DuelMatchInfo,
  questions: Question[],
  localName: string,
): DuelState {
  return {
    phase: 'lobby',
    opponentDisconnected: false,
    match,
    questions,
    currentQuestionIndex: -1,
    roundStartedAt: null,
    countdownEndsAt: null,
    players: {
      local: createPlayer('local', localName, true, questions.length),
      opponent: createPlayer('opponent', '', false, questions.length),
    },
    winnerId: null,
  };
}

function applyAnswer(player: DuelPlayerState, questionIndex: number, record: DuelAnswerRecord): DuelPlayerState {
  const answers = [...player.answers];
  answers[questionIndex] = record;
  const currentStreak = record.correct ? player.currentStreak + 1 : 0;
  return {
    ...player,
    answers,
    score: player.score + record.points,
    correctCount: player.correctCount + (record.correct ? 1 : 0),
    wrongCount: player.wrongCount + (record.correct ? 0 : 1),
    currentStreak,
    bestStreak: Math.max(player.bestStreak, currentStreak),
    fastAnswers: player.fastAnswers + (record.correct && isFastAnswer(record.timeMs) ? 1 : 0),
  };
}

export function duelReducer(state: DuelState, event: DuelEngineEvent): DuelState {
  switch (event.type) {
    case 'OPPONENT_JOINED':
      return {
        ...state,
        players: {
          ...state.players,
          opponent: { ...state.players.opponent, connected: true, name: event.name },
        },
      };

    case 'PLAYER_READY':
      return {
        ...state,
        players: {
          ...state.players,
          [event.playerId]: { ...state.players[event.playerId], ready: true },
        },
      };

    case 'COUNTDOWN_STARTED':
      return { ...state, phase: 'countdown', countdownEndsAt: event.endsAt };

    case 'ROUND_STARTED':
      return {
        ...state,
        phase: 'playing',
        currentQuestionIndex: event.questionIndex,
        roundStartedAt: event.roundStartedAt,
      };

    case 'ANSWER_RESULT':
      return {
        ...state,
        players: {
          ...state.players,
          [event.playerId]: applyAnswer(state.players[event.playerId], state.currentQuestionIndex, event.record),
        },
      };

    case 'ROUND_RESOLVED':
      return { ...state, phase: 'question-transition' };

    case 'MATCH_FINISHED':
      return { ...state, phase: 'finished', winnerId: event.winnerId };

    case 'OPPONENT_DISCONNECTED':
      return {
        ...state,
        opponentDisconnected: true,
        players: { ...state.players, opponent: { ...state.players.opponent, connected: false } },
      };

    case 'OPPONENT_RECONNECTED':
      return {
        ...state,
        opponentDisconnected: false,
        players: { ...state.players, opponent: { ...state.players.opponent, connected: true } },
      };

    case 'REMATCH_PROPOSED':
      return {
        ...state,
        phase: 'rematch',
        players: {
          ...state.players,
          [event.playerId]: { ...state.players[event.playerId], wantsRematch: true },
        },
      };

    case 'REMATCH_DECLINED':
      return {
        ...state,
        players: {
          local: { ...state.players.local, wantsRematch: false },
          opponent: { ...state.players.opponent, wantsRematch: false },
        },
      };

    case 'REMATCH_STARTED': {
      // Solo lo stato di gioco riparte da zero: l'avversario è già
      // connesso (non serve ripassare per la lobby), quindi la sua identità
      // va preservata anziché azzerata dai default di createInitialDuelState.
      const fresh = createInitialDuelState(event.match, event.questions, state.players.local.name);
      return {
        ...fresh,
        players: {
          ...fresh.players,
          opponent: { ...fresh.players.opponent, name: state.players.opponent.name, connected: true },
        },
      };
    }

    default:
      return state;
  }
}
