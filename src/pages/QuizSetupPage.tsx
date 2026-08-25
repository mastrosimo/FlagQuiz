import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { CapitalDirection, Continent, Difficulty, QuizConfig, QuizMode, QuizType } from '../types';
import { MODES, QUESTION_COUNT_OPTIONS, buildQuizConfig } from '../data/modes';
import { CAPITAL_MODES, CAPITAL_DIRECTION_OPTIONS, buildCapitalQuizConfig } from '../data/capitalModes';
import { CONTINENTS } from '../data/countries';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useTranslation } from '../i18n/useTranslation';
import type { TranslationKey } from '../i18n/types';

interface QuizSetupPageProps {
  /** 'flag' (default) = quiz bandiere esistente; 'capital' = Quiz Capitali. */
  quizType?: QuizType;
  presetMode?: QuizMode;
  onStart: (config: QuizConfig) => void;
}

const DIFFICULTY_KEYS: { id: Difficulty | 'mixed'; key: TranslationKey }[] = [
  { id: 'mixed', key: 'difficulty.mixed' },
  { id: 'easy', key: 'difficulty.easy' },
  { id: 'medium', key: 'difficulty.medium' },
  { id: 'hard', key: 'difficulty.hard' },
];

export function QuizSetupPage({ quizType = 'flag', presetMode, onStart }: QuizSetupPageProps) {
  const { t } = useTranslation();
  const modes = quizType === 'capital' ? CAPITAL_MODES : MODES;
  const [mode, setMode] = useState<QuizMode>(presetMode ?? modes[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>('mixed');
  const [continent, setContinent] = useState<Continent | undefined>(undefined);
  const [questionCount, setQuestionCount] = useState(20);
  const [direction, setDirection] = useState<CapitalDirection | 'mixed'>('mixed');

  const activeMode = useMemo(() => modes.find((m) => m.id === mode) ?? modes[0], [mode, modes]);

  const handleStart = () => {
    const config =
      quizType === 'capital'
        ? buildCapitalQuizConfig({ mode, difficulty, continent, questionCount, direction })
        : buildQuizConfig({ mode, difficulty, continent, questionCount });
    onStart(config);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
        {t('quizSetup.title')}
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{t('quizSetup.subtitle')}</p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('quizSetup.stepMode')}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {modes.map((modeInfo) => (
            <motion.button
              key={modeInfo.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode(modeInfo.id)}
              aria-pressed={mode === modeInfo.id}
              className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                mode === modeInfo.id
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
                  : 'border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">{modeInfo.icon}</span>
              <span>
                <span className="block font-display font-bold text-slate-900 dark:text-white">
                  {t(modeInfo.labelKey)}
                </span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  {t(modeInfo.descriptionKey)}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {quizType === 'capital' && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('capitals.setup.stepDirection')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {CAPITAL_DIRECTION_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDirection(option.id)}
                aria-pressed={direction === option.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  direction === option.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </section>
      )}

      {activeMode.showDifficulty && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('quizSetup.stepDifficulty')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_KEYS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDifficulty(option.id)}
                aria-pressed={difficulty === option.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  difficulty === option.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {t(option.key)}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('quizSetup.stepContinent')}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setContinent(undefined)}
            aria-pressed={continent === undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              continent === undefined
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t('quizSetup.allContinents')}
          </button>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setContinent(c)}
              aria-pressed={continent === c}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                continent === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {t(`continents.${c}`)}
            </button>
          ))}
        </div>
      </section>

      {activeMode.showQuestionCount && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t(quizType === 'capital' ? 'capitals.setup.stepCount' : 'quizSetup.stepQuestionCount')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {QUESTION_COUNT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setQuestionCount(option.value)}
                aria-pressed={questionCount === option.value}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  questionCount === option.value
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {option.isAll ? t('quizSetup.allOption') : option.value}
              </button>
            ))}
          </div>
        </section>
      )}

      <Card className="mt-10 flex flex-col items-center gap-4 p-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('quizSetup.readyText')}</p>
        <Button size="lg" onClick={handleStart} className="w-full sm:w-auto">
          {t('quizSetup.startButton')}
        </Button>
      </Card>
    </div>
  );
}
