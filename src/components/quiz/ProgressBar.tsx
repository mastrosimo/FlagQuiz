import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useTranslation();
  const ratio = total > 0 ? Math.min(1, current / total) : 0;

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>{t('quizPlay.questionProgress', { current, total })}</span>
        <span>{Math.round(ratio * 100)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
          initial={{ width: 0 }}
          animate={{ width: `${ratio * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
