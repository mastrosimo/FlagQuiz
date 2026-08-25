import type { CapitalDirection, Continent, Difficulty, QuizConfig, QuizMode } from '../types';
import type { TranslationKey } from '../i18n/types';
import type { ModeInfo } from './modes';

/**
 * Sottoinsieme delle modalità bandiere che ha senso per le capitali (vedi
 * piano): Sopravvivenza e Sfida del Giorno restano fuori per questa prima
 * versione — la prima perché non richiesta, la seconda perché legata a una
 * gate/persistenza dedicata in `profileStore` che non va toccata ora.
 */
export const CAPITAL_MODES: ModeInfo[] = [
  {
    id: 'classic',
    labelKey: 'modes.classicLabel',
    descriptionKey: 'capitals.modes.classicDescription',
    icon: '📝',
    showQuestionCount: true,
    showDifficulty: true,
  },
  {
    id: 'time',
    labelKey: 'modes.timeLabel',
    descriptionKey: 'capitals.modes.timeDescription',
    icon: '⏱️',
    showQuestionCount: false,
    showDifficulty: true,
  },
  {
    id: 'fifty',
    labelKey: 'capitals.modes.fiftyLabel',
    descriptionKey: 'capitals.modes.fiftyDescription',
    icon: '5️⃣',
    showQuestionCount: false,
    showDifficulty: true,
  },
  {
    id: 'all',
    labelKey: 'capitals.modes.allLabel',
    descriptionKey: 'capitals.modes.allDescription',
    icon: '🌍',
    showQuestionCount: false,
    showDifficulty: false,
  },
  {
    id: 'hard',
    labelKey: 'modes.hardLabel',
    descriptionKey: 'capitals.modes.hardDescription',
    icon: '🧠',
    showQuestionCount: true,
    showDifficulty: false,
  },
];

export const CAPITAL_DIRECTION_OPTIONS: { id: CapitalDirection | 'mixed'; labelKey: TranslationKey }[] = [
  { id: 'mixed', labelKey: 'capitals.direction.mixed' },
  { id: 'country-to-capital', labelKey: 'capitals.direction.countryToCapital' },
  { id: 'capital-to-country', labelKey: 'capitals.direction.capitalToCountry' },
];

export function buildCapitalQuizConfig(params: {
  mode: QuizMode;
  difficulty: Difficulty | 'mixed';
  continent?: Continent;
  questionCount: number;
  direction: CapitalDirection | 'mixed';
}): QuizConfig {
  const { mode, difficulty, continent, questionCount, direction } = params;
  const quizType = 'capital' as const;
  switch (mode) {
    case 'time':
      return { mode, quizType, direction, difficulty, continent, questionCount, timeLimit: 60 };
    case 'fifty':
      return { mode, quizType, direction, difficulty, continent, questionCount: 50 };
    case 'all':
      return { mode, quizType, direction, difficulty: 'mixed', continent, questionCount };
    case 'hard':
      return { mode, quizType, direction, difficulty: 'hard', continent, questionCount };
    default:
      return { mode, quizType, direction, difficulty, continent, questionCount };
  }
}
