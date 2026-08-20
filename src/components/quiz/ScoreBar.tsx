import { motion, AnimatePresence } from 'framer-motion';
import { getComboMultiplier } from '../../utils/scoring';

interface ScoreBarProps {
  score: number;
  streak: number;
  bestStreak: number;
}

export function ScoreBar({ score, streak, bestStreak }: ScoreBarProps) {
  const multiplier = getComboMultiplier(streak);

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-display font-bold text-brand-600 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:text-brand-400 dark:ring-white/10">
        <span aria-hidden="true">🏆</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={score}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs font-medium text-slate-400">punti</span>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 font-semibold shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
        <span aria-hidden="true">🔥</span>
        <span className={streak > 0 ? 'text-accent-500' : 'text-slate-400'}>{streak}</span>
        <AnimatePresence mode="wait">
          {multiplier > 1 && (
            <motion.span
              key={multiplier}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="rounded-full bg-accent-500/15 px-2 py-0.5 text-xs font-black text-accent-500"
            >
              x{multiplier}
            </motion.span>
          )}
        </AnimatePresence>
        <span className="hidden text-xs font-medium text-slate-400 sm:inline">best {bestStreak}</span>
      </div>
    </div>
  );
}
