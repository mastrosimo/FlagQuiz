import { motion } from 'framer-motion';
import type { QuizSessionResult } from '../../types';
import { getAccuracyJudgment, formatDuration } from '../../utils/scoring';
import { Card } from '../common/Card';

interface ResultSummaryCardProps {
  result: QuizSessionResult;
}

export function ResultSummaryCard({ result }: ResultSummaryCardProps) {
  const accuracy = result.totalQuestions
    ? Math.round((result.correctCount / result.totalQuestions) * 100)
    : 0;

  const stats = [
    { label: 'Risposte corrette', value: `${result.correctCount} / ${result.totalQuestions}` },
    { label: 'Precisione', value: `${accuracy}%` },
    { label: 'Serie migliore', value: `${result.bestStreak}` },
    { label: 'Tempo', value: formatDuration(result.durationMs) },
  ];

  return (
    <Card className="mx-auto w-full max-w-lg p-8 text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-sm font-bold uppercase tracking-widest text-brand-500"
      >
        Quiz completato
      </motion.p>
      <motion.p
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.1 }}
        className="mt-2 font-display text-5xl font-black text-slate-900 dark:text-white"
      >
        {result.score} <span className="text-2xl font-semibold text-slate-400">punti</span>
      </motion.p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 font-display text-lg font-semibold text-brand-600 dark:text-brand-400">
        {getAccuracyJudgment(accuracy)}
      </p>
    </Card>
  );
}
