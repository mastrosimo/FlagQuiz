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

export interface QuizConfig {
  mode: QuizMode;
  difficulty: Difficulty | 'mixed';
  continent?: Continent;
  questionCount: number;
  timeLimit?: number;
  lives?: number;
}

export interface Question {
  correct: Country;
  options: Country[];
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
