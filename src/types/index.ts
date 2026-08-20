export type Continent =
  | 'Europe'
  | 'Asia'
  | 'Africa'
  | 'NorthAmerica'
  | 'SouthAmerica'
  | 'Oceania';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Country {
  code: string;
  name: string;
  continent: Continent;
  capital: string;
  difficulty: Difficulty;
  similar?: string[];
}

export type QuizMode =
  | 'classic'
  | 'time'
  | 'fifty'
  | 'all'
  | 'hard'
  | 'lives';

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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (stats: ProfileStats) => boolean;
}

export interface ProfileStats {
  gamesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  bestStreak: number;
  bestScore: number;
  flagsRecognized: number;
  continentStats: Record<Continent, { correct: number; total: number }>;
  recentSessions: { date: number; score: number; accuracy: number }[];
}

export interface Level {
  level: number;
  name: string;
  minXp: number;
}
