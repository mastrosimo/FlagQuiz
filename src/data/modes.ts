import type { Continent, Difficulty, QuizConfig, QuizMode } from '../types';
import type { TranslationKey } from '../i18n/types';
import { COUNTRIES } from './countries';

export interface ModeInfo {
  id: QuizMode;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: string;
  showQuestionCount: boolean;
  showDifficulty: boolean;
}

/**
 * Solo 3 modalità restano scelte esplicitamente dall'utente: Classica (ora
 * unificata — numero di bandiere e difficoltà si scelgono liberamente, senza
 * più le vecchie card separate "50 Bandiere"/"Tutte"/"Paesi Difficili"),
 * Tempo e Sopravvivenza (uniche a cambiare davvero la meccanica di gioco).
 * Vedi `buildQuizConfig` per come "classica" continua a produrre
 * internamente gli stessi tag `mode` di prima quando la combinazione conta o
 * difficoltà coincide con una vecchia modalità — serve solo a non rompere le
 * missioni "gioca la modalità X", che restano invariate.
 */
export const MODES: ModeInfo[] = [
  {
    id: 'classic',
    labelKey: 'modes.classicLabel',
    descriptionKey: 'modes.classicDescription',
    icon: '📝',
    showQuestionCount: true,
    showDifficulty: true,
  },
  {
    id: 'time',
    labelKey: 'modes.timeLabel',
    descriptionKey: 'modes.timeDescription',
    icon: '⏱️',
    showQuestionCount: false,
    showDifficulty: true,
  },
  {
    id: 'survival',
    labelKey: 'modes.survivalLabel',
    descriptionKey: 'modes.survivalDescription',
    icon: '💀',
    showQuestionCount: false,
    showDifficulty: true,
  },
];

/**
 * Presentazione per la scelta del numero di bandiere/domande: numeri tondi
 * più un'opzione "Tutto" che comunica meglio l'idea di completare l'intero
 * database rispetto a scrivere "195". Il valore numerico reale (195) resta
 * quello usato internamente per generare le domande — cambia solo l'etichetta.
 */
export interface QuestionCountOption {
  value: number;
  isAll: boolean;
}

export const QUESTION_COUNT_OPTIONS: QuestionCountOption[] = [
  { value: 10, isAll: false },
  { value: 20, isAll: false },
  { value: 30, isAll: false },
  { value: 50, isAll: false },
  { value: 100, isAll: false },
  { value: COUNTRIES.length, isAll: true },
];

/**
 * Le vecchie modalità "50 Bandiere"/"Tutte"/"Paesi Difficili" non sono più
 * scelte esplicite in UI, ma il loro tag `mode` deve poter comparire ancora
 * in `QuizSessionResult.mode`: `missionsEngine.ts` confronta esattamente
 * quel valore con `mission.params.mode` per le missioni "gioca la modalità
 * X" (definite in `data/missions.ts`, non toccato). Questa funzione deduce
 * il tag corretto dalla combinazione scelta dall'utente, così le missioni
 * restano tutte raggiungibili senza che l'utente debba più "sapere" che
 * esistevano come modalità separate.
 */
function inferClassicModeTag(difficulty: Difficulty | 'mixed', questionCount: number): QuizMode {
  if (difficulty === 'hard') return 'hard';
  if (questionCount >= COUNTRIES.length) return 'all';
  if (questionCount === 50) return 'fifty';
  return 'classic';
}

export function buildQuizConfig(params: {
  mode: QuizMode;
  difficulty: Difficulty | 'mixed';
  continent?: Continent;
  questionCount: number;
}): QuizConfig {
  const { mode, difficulty, continent, questionCount } = params;
  const quizType = 'flag' as const;
  switch (mode) {
    case 'time':
      return { mode, quizType, difficulty, continent, questionCount, timeLimit: 60 };
    case 'survival':
      return { mode, quizType, difficulty, continent, questionCount, lives: 3 };
    default:
      return {
        mode: inferClassicModeTag(difficulty, questionCount),
        quizType,
        difficulty,
        continent,
        questionCount,
      };
  }
}

export const DAILY_CHALLENGE_QUESTION_COUNT = 10;

export function buildDailyChallengeConfig(): QuizConfig {
  return { mode: 'daily', quizType: 'flag', difficulty: 'mixed', questionCount: DAILY_CHALLENGE_QUESTION_COUNT };
}
