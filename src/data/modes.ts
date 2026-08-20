import type { Continent, Difficulty, QuizConfig, QuizMode } from '../types';
import type { TranslationKey } from '../i18n/types';

export interface ModeInfo {
  id: QuizMode;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: string;
  showQuestionCount: boolean;
  showDifficulty: boolean;
}

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
    id: 'fifty',
    labelKey: 'modes.fiftyLabel',
    descriptionKey: 'modes.fiftyDescription',
    icon: '5️⃣',
    showQuestionCount: false,
    showDifficulty: true,
  },
  {
    id: 'all',
    labelKey: 'modes.allLabel',
    descriptionKey: 'modes.allDescription',
    icon: '🌍',
    showQuestionCount: false,
    showDifficulty: false,
  },
  {
    id: 'hard',
    labelKey: 'modes.hardLabel',
    descriptionKey: 'modes.hardDescription',
    icon: '🧠',
    showQuestionCount: true,
    showDifficulty: false,
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
