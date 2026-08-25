import { motion, AnimatePresence } from 'framer-motion';
import { useDuelSession } from '../../duel/useDuelSession';
import { useRemainingSeconds } from '../../duel/useCountdown';
import { useTranslation } from '../../i18n/useTranslation';

export function DuelCountdown() {
  const { state } = useDuelSession();
  const { t } = useTranslation();
  const secondsRemaining = useRemainingSeconds(state.countdownEndsAt);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2">
      {state.match.botDifficulty && (
        <p className="font-display text-lg font-bold text-slate-700 dark:text-slate-200">
          {t('duel.bot.vsComputerLabel')}
        </p>
      )}
      <p className="font-display text-sm font-bold uppercase tracking-widest text-slate-400">
        {t('duel.countdown.title')}
      </p>
      <AnimatePresence mode="wait">
        <motion.p
          key={secondsRemaining}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="font-display text-8xl font-black text-brand-600 dark:text-brand-400"
        >
          {secondsRemaining > 0 ? secondsRemaining : t('duel.countdown.go')}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
