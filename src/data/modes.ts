import type { Continent, Difficulty, QuizConfig, QuizMode } from '../types';

export interface ModeInfo {
  id: QuizMode;
  label: string;
  description: string;
  icon: string;
  showQuestionCount: boolean;
  showDifficulty: boolean;
}

export const MODES: ModeInfo[] = [
  {
    id: 'classic',
    label: 'Quiz classico',
    description: '20 domande, nessun limite di tempo',
    icon: '📝',
    showQuestionCount: true,
    showDifficulty: true,
  },
  {
    id: 'time',
    label: 'Modalità tempo',
    description: '60 secondi per totalizzare più punti possibile',
    icon: '⏱️',
    showQuestionCount: false,
    showDifficulty: true,
  },
  {
    id: 'fifty',
    label: '50 bandiere',
    description: '50 domande consecutive',
    icon: '5️⃣',
    showQuestionCount: false,
    showDifficulty: true,
  },
  {
    id: 'all',
    label: 'Tutte le bandiere',
    description: 'Ogni bandiera del database, senza ripetizioni',
    icon: '🌍',
    showQuestionCount: false,
    showDifficulty: false,
  },
  {
    id: 'hard',
    label: 'Paesi difficili',
    description: 'Le bandiere più difficili da riconoscere',
    icon: '🧠',
    showQuestionCount: true,
    showDifficulty: false,
  },
  {
    id: 'survival',
    label: 'Sopravvivenza',
    description: 'Hai 3 vite. Ogni errore ne costa una. Quanto riesci a resistere?',
    icon: '💀',
    showQuestionCount: false,
    showDifficulty: true,
  },
];

export const QUESTION_COUNT_OPTIONS = [10, 15, 20, 30];

export function buildQuizConfig(params: {
  mode: QuizMode;
  difficulty: Difficulty | 'mixed';
  continent?: Continent;
  questionCount: number;
}): QuizConfig {
  const { mode, difficulty, continent, questionCount } = params;
  switch (mode) {
    case 'time':
      return { mode, difficulty, continent, questionCount, timeLimit: 60 };
    case 'fifty':
      return { mode, difficulty, continent, questionCount: 50 };
    case 'all':
      return { mode, difficulty: 'mixed', continent, questionCount };
    case 'hard':
      return { mode, difficulty: 'hard', continent, questionCount };
    case 'survival':
      return { mode, difficulty, continent, questionCount, lives: 3 };
    default:
      return { mode, difficulty, continent, questionCount };
  }
}

export const DAILY_CHALLENGE_QUESTION_COUNT = 10;

export function buildDailyChallengeConfig(): QuizConfig {
  return { mode: 'daily', difficulty: 'mixed', questionCount: DAILY_CHALLENGE_QUESTION_COUNT };
}
