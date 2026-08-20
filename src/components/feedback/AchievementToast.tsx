import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProfileStore } from '../../store/profileStore';
import { useSound } from '../../hooks/useSound';

export function AchievementToast() {
  const lastUnlocked = useProfileStore((state) => state.lastUnlocked);
  const clearLastUnlocked = useProfileStore((state) => state.clearLastUnlocked);
  const { playUnlock } = useSound();

  useEffect(() => {
    if (lastUnlocked.length === 0) return;
    playUnlock();
    const timeout = setTimeout(clearLastUnlocked, 4500);
    return () => clearTimeout(timeout);
  }, [lastUnlocked]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {lastUnlocked.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-400 px-5 py-3 text-white shadow-xl"
            role="status"
          >
            <span className="text-2xl" aria-hidden="true">{achievement.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Obiettivo sbloccato</p>
              <p className="font-display font-bold">{achievement.title}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
