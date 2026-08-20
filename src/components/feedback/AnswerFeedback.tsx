import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

interface AnswerFeedbackProps {
  visible: boolean;
  correct: boolean;
  correctName: string;
  pointsEarned: number;
}

export function AnswerFeedback({ visible, correct, correctName, pointsEarned }: AnswerFeedbackProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl px-5 py-3 font-semibold shadow-md ${
            correct
              ? 'bg-success-500/10 text-success-600 dark:text-success-500'
              : 'bg-danger-500/10 text-danger-600 dark:text-danger-500'
          }`}
          role="status"
        >
          <span>{correct ? t('quizPlay.correct') : t('quizPlay.wrong', { name: correctName })}</span>
          {correct && pointsEarned > 0 && <span>+{pointsEarned}</span>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
