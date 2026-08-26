import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Country } from '../../types';
import { COUNTRY_BY_CODE } from '../../data/countries';
import { FLAG_DESCRIPTIONS } from '../../data/flagDescriptions';
import { FlagImage } from '../quiz/FlagImage';
import { AnswerButton, type AnswerButtonStatus } from '../quiz/AnswerButton';
import { Button } from '../common/Button';
import { buildCountryLearnQuiz, type LearnQuestion, type LearnQuestionType } from '../../utils/learnQuestions';
import { useTranslation } from '../../i18n/useTranslation';
import type { TranslationKey } from '../../i18n/types';

const QUESTION_HEADING_KEY: Record<LearnQuestionType, TranslationKey> = {
  capital: 'learnQuiz.questionCapital',
  continent: 'learnQuiz.questionContinent',
  flag: 'learnQuiz.questionFlag',
  description: 'learnQuiz.questionDescription',
};

const FLAG_STATUS_CLASSES: Record<AnswerButtonStatus, string> = {
  idle: 'border-slate-200 hover:border-brand-400 dark:border-slate-700',
  'selected-correct': 'border-success-500 ring-2 ring-success-500/40',
  'selected-wrong': 'border-danger-500 ring-2 ring-danger-500/40',
  'correct-unselected': 'border-success-500 ring-2 ring-success-500/40',
  muted: 'border-slate-200 opacity-50 dark:border-slate-700',
};

interface CountryMiniQuizProps {
  country: Country;
}

export function CountryMiniQuiz({ country }: CountryMiniQuizProps) {
  const { t, locale } = useTranslation();
  const questions = useMemo<LearnQuestion[]>(() => buildCountryLearnQuiz(country), [country]);
  const [index, setIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const finished = index >= questions.length;

  const optionLabel = (type: LearnQuestionType, key: string): string => {
    if (type === 'continent') return t(`continents.${key}` as TranslationKey);
    const option = COUNTRY_BY_CODE[key];
    if (!option) return key;
    if (type === 'capital') return option.capital[locale];
    if (type === 'description') return FLAG_DESCRIPTIONS[key][locale];
    return option.name[locale];
  };

  const handleSelect = (key: string, isCorrect: boolean) => {
    if (selectedKey !== null) return;
    setSelectedKey(key);
    if (isCorrect) setCorrectCount((count) => count + 1);
  };

  const handleNext = () => {
    setSelectedKey(null);
    setIndex((current) => current + 1);
  };

  const getStatus = (key: string, correct: boolean): AnswerButtonStatus => {
    if (selectedKey === null) return 'idle';
    if (key === selectedKey) return correct ? 'selected-correct' : 'selected-wrong';
    if (correct) return 'correct-unselected';
    return 'muted';
  };

  if (finished) {
    return (
      <div className="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-800">
        <p className="text-3xl" aria-hidden="true">{correctCount === questions.length ? '🎉' : '👍'}</p>
        <p className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">
          {t('learnQuiz.resultLabel', { correct: correctCount, total: questions.length })}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {index + 1} / {questions.length}
      </p>
      <h3 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
        {t(QUESTION_HEADING_KEY[question.type], { country: country.name[locale] })}
      </h3>

      {question.type === 'flag' ? (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <motion.button
              key={option.key}
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={selectedKey !== null}
              onClick={() => handleSelect(option.key, option.correct)}
              className={`overflow-hidden rounded-xl border-2 bg-white p-1.5 transition-colors disabled:cursor-not-allowed dark:bg-slate-800 ${FLAG_STATUS_CLASSES[getStatus(option.key, option.correct)]}`}
            >
              <FlagImage code={option.key} name={optionLabel('flag', option.key)} className="aspect-[3/2] w-full rounded-lg" />
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {question.options.map((option, optionIndex) => (
            <AnswerButton
              key={option.key}
              letter={String.fromCharCode(65 + optionIndex)}
              label={optionLabel(question.type, option.key)}
              status={getStatus(option.key, option.correct)}
              disabled={selectedKey !== null}
              onClick={() => handleSelect(option.key, option.correct)}
            />
          ))}
        </div>
      )}

      {selectedKey !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-end">
          <Button size="md" onClick={handleNext}>
            {isLast ? t('learnQuiz.seeResultButton') : t('learnQuiz.nextButton')}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
