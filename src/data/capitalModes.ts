import type { CapitalDirection, Continent, Difficulty, QuizConfig, QuizMode } from '../types';
import type { TranslationKey } from '../i18n/types';
import type { ModeInfo } from './modes';

/**
 * Come per le bandiere (`data/modes.ts`), "50"/"Tutte"/"Difficili" non sono
 * più modalità separate ma combinazioni di numero-domande e difficoltà nello
 * stesso flusso "classica". A differenza delle bandiere non serve preservare
 * un tag `mode` legacy: i risultati del Quiz Capitali non alimentano
 * `missionsEngine`/`profileStore` (v1 volutamente isolata dalla
 * progressione), quindi qui `mode` resta sempre 'classic' o 'time' senza
 * alcun downstream da mantenere compatibile.
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
  if (mode === 'time') {
    return { mode, quizType, direction, difficulty, continent, questionCount, timeLimit: 60 };
  }
  return { mode: 'classic', quizType, direction, difficulty, continent, questionCount };
}
