import { motion } from 'framer-motion';
import type { QuizSessionResult } from '../../types';
import { getAccuracyJudgmentKey, formatDuration } from '../../utils/scoring';
import { computeSessionXp } from '../../utils/xp';
import { Card } from '../common/Card';
import { ShareButton } from './ShareButton';
import { useTranslation } from '../../i18n/useTranslation';

interface ResultSummaryCardProps {
  result: QuizSessionResult;
}

export function ResultSummaryCard({ result }: ResultSummaryCardProps) {
  const { t } = useTranslation();
  const accuracy = result.totalQuestions
    ? Math.round((result.correctCount / result.totalQuestions) * 100)
    : 0;
  const xpGained = computeSessionXp(result);

  const stats = [
    { label: t('results.correctAnswers'), value: `${result.correctCount} / ${result.totalQuestions}` },
    { label: t('results.accuracy'), value: `${accuracy}%` },
    { label: t('results.bestStreak'), value: `🔥 ${result.bestStreak}` },
    { label: t('results.time'), value: formatDuration(result.durationMs) },
  ];

  const shareText = t('share.text', {
    correct: result.correctCount,
    total: result.totalQuestions,
    streak: result.bestStreak,
    score: result.score,
  });

  return (
    <Card className="mx-auto w-full max-w-lg p-8 text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-sm font-bold uppercase tracking-widest text-brand-500"
      >
        {t('results.completed')}
      </motion.p>
      <motion.p
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.1 }}
        className="mt-2 font-display text-5xl font-black text-slate-900 dark:text-white"
      >
        {result.score} <span className="text-2xl font-semibold text-slate-400">{t('results.points')}</span>
      </motion.p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-accent-500/10 p-3"
      >
        <span aria-hidden="true">⭐</span>
        <span className="font-display font-bold text-accent-500">{t('results.xpGained', { xp: xpGained })}</span>
      </motion.div>

      <p className="mt-6 font-display text-lg font-semibold text-brand-600 dark:text-brand-400">
        {t(getAccuracyJudgmentKey(accuracy))}
      </p>

      <div className="mt-6">
        <ShareButton text={shareText} />
      </div>
    </Card>
  );
}
