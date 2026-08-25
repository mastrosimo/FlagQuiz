import type { Locale, TranslationKey } from '../i18n/types';

export type Continent =
  | 'Europe'
  | 'Asia'
  | 'Africa'
  | 'NorthAmerica'
  | 'SouthAmerica'
  | 'Oceania';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type LocalizedText = Record<Locale, string>;

export interface Country {
  code: string;
  name: LocalizedText;
  continent: Continent;
  capital: LocalizedText;
  difficulty: Difficulty;
  similar?: string[];
}

export type QuizMode =
  | 'classic'
  | 'time'
  | 'fifty'
  | 'all'
  | 'hard'
  | 'survival'
  | 'daily';

/**
 * Cosa viene chiesto in una domanda: 'flag' = riconoscere una bandiera
 * (comportamento esistente), 'capital' = associare Paese e capitale. Stesso
 * motore (`useQuizEngine`, reducer, scoring, timer) per entrambi — il
 * discriminante serve solo a scegliere come vengono generate le domande e
 * come viene renderizzata la UI, non introduce una seconda pipeline di gioco.
 */
export type QuizType = 'flag' | 'capital';

/** Solo per `quizType: 'capital'`. */
export type CapitalDirection = 'country-to-capital' | 'capital-to-country';

export interface QuizConfig {
  mode: QuizMode;
  quizType: QuizType;
  difficulty: Difficulty | 'mixed';
  continent?: Continent;
  questionCount: number;
  timeLimit?: number;
  lives?: number;
  /** Solo per `quizType: 'capital'`: 'mixed' varia la direzione domanda per domanda. */
  direction?: CapitalDirection | 'mixed';
}

export interface Question {
  correct: Country;
  options: Country[];
  /** Presente solo per le domande del Quiz Capitali (`quizType: 'capital'`). */
  direction?: CapitalDirection;
}

export interface AnsweredQuestion {
  question: Question;
  selectedCode: string | null;
  correct: boolean;
  timeMs: number;
  pointsEarned: number;
}

export type QuizStatus = 'idle' | 'answering' | 'feedback' | 'finished';

export interface QuizSessionResult {
  mode: QuizMode;
  quizType: QuizType;
  difficulty: Difficulty | 'mixed';
  continent?: Continent;
  score: number;
  totalQuestions: number;
  correctCount: number;
  bestStreak: number;
  durationMs: number;
  answered: AnsweredQuestion[];
  completedAt: number;
}

export interface AchievementContext {
  stats: ProfileStats;
  collectionCount: number;
  masteredCount: number;
  missionsCompletedCount: number;
  visitedCount: number;
}

export interface Achievement {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: string;
  check: (context: AchievementContext) => boolean;
}

export interface ProfileStats {
  gamesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  bestStreak: number;
  bestScore: number;
  flagsRecognized: number;
  fastAnswers: number;
  continentStats: Record<Continent, { correct: number; total: number }>;
  recentSessions: { date: number; score: number; accuracy: number }[];
}

export interface Level {
  level: number;
  nameKey: TranslationKey;
  minXp: number;
}

export interface DailyStreak {
  current: number;
  longest: number;
  lastPlayedDate: string | null;
}

export interface DailyChallengeState {
  date: string | null;
  completed: boolean;
  result: { score: number; correctCount: number; totalQuestions: number } | null;
}

export type MissionCategory =
  | 'collection'
  | 'continent'
  | 'mastery'
  | 'gameplay-complete'
  | 'gameplay-accuracy'
  | 'gameplay-combo'
  | 'gameplay-score'
  | 'gameplay-correct'
  | 'mode'
  | 'daily-challenge'
  | 'study';

export type MissionGroup = 'progression' | 'gameplay' | 'mode';

export type MissionDifficulty = 'easy' | 'medium' | 'hard';

export interface MissionParams {
  continent?: Continent;
  mode?: QuizMode;
}

// Istanza concreta di una missione assegnata per una giornata: la sola forma
// persistita/mostrata dalla UI. Progettata per mappare 1:1 una futura riga
// della tabella `user_missions` (stesso pattern di user_progress/user_collection).
export interface MissionInstance {
  id: string;
  definitionId: string;
  category: MissionCategory;
  group: MissionGroup;
  difficulty: MissionDifficulty;
  icon: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  xpReward: number;
  target: number;
  progress: number;
  completed: boolean;
  completedAt: number | null;
  xpAwarded: boolean;
  params?: MissionParams;
}

export interface DailyMissionsState {
  dateKey: string;
  missions: MissionInstance[];
  bonusAwarded: boolean;
  studiedCodes: string[];
}

export interface PlayerSnapshot {
  xp: number;
  recognizedCodes: string[];
  collectionCount: number;
  collectionTotal: number;
  masteryCounts: Record<string, number>;
  masteredCount: number;
  averageAccuracy: number;
  dailyChallengeAvailable: boolean;
  recentModes: QuizMode[];
}

// Voce di "Il mio mondo": la presenza del codice Paese come chiave in
// WorldState.visited è ciò che significa "visitato". Anno, data e nota sono
// tutti opzionali per costruzione.
export interface VisitedEntry {
  year: number | null;
  date: string | null;
  note: string | null;
  visitedAt: number;
}
