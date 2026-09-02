import { motion } from 'framer-motion';

export type AnswerButtonStatus = 'idle' | 'selected-pending' | 'selected-correct' | 'selected-wrong' | 'correct-unselected' | 'muted';

interface AnswerButtonProps {
  letter: string;
  label: string;
  status: AnswerButtonStatus;
  disabled: boolean;
  onClick: () => void;
}

const STATUS_CLASSES: Record<AnswerButtonStatus, string> = {
  idle: 'border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700',
  'selected-pending': 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-400',
  'selected-correct': 'border-success-500 bg-success-500/10 text-success-600 dark:text-success-500',
  'selected-wrong': 'border-danger-500 bg-danger-500/10 text-danger-600 dark:text-danger-500',
  'correct-unselected': 'border-success-500 bg-success-500/10 text-success-600 dark:text-success-500',
  muted: 'border-slate-200 bg-white opacity-50 dark:border-slate-700 dark:bg-slate-800',
};

export function AnswerButton({ letter, label, status, disabled, onClick }: AnswerButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      animate={status === 'selected-wrong' ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-base font-semibold text-slate-800 shadow-sm transition-colors disabled:cursor-not-allowed dark:text-slate-100 ${STATUS_CLASSES[status]}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
        {letter}
      </span>
      <span className="flex-1">{label}</span>
      {status === 'selected-correct' || status === 'correct-unselected' ? (
        <span aria-hidden="true">✅</span>
      ) : null}
      {status === 'selected-wrong' ? <span aria-hidden="true">❌</span> : null}
    </motion.button>
  );
}
