import { motion, AnimatePresence } from 'framer-motion';

interface ScoreBarProps {
  score: number;
  streak: number;
  bestStreak: number;
}

export function ScoreBar({ score, streak, bestStreak }: ScoreBarProps) {
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

      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
        <span aria-hidden="true">🔥</span>
        <span className={streak > 0 ? 'text-accent-500' : 'text-slate-400'}>{streak}</span>
        <span className="text-xs font-medium text-slate-400">serie · best {bestStreak}</span>
      </div>
    </div>
  );
}
