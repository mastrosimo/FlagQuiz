import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '../data/achievements';
import { useProfileStore } from '../store/profileStore';
import { Card } from '../components/common/Card';

export function AchievementsPage() {
  const unlockedAchievements = useProfileStore((state) => state.unlockedAchievements);
  const unlockedSet = new Set(unlockedAchievements);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Obiettivi</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        {unlockedAchievements.length} / {ACHIEVEMENTS.length} sbloccati
      </p>
      <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACHIEVEMENTS.map((achievement, index) => {
          const unlocked = unlockedSet.has(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card
                className={`relative flex items-center gap-4 overflow-hidden p-5 ${
                  unlocked
                    ? 'ring-2 ring-accent-500/40'
                    : ''
                }`}
              >
                {unlocked && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent" />
                )}
                <span className={`relative text-3xl ${unlocked ? '' : 'opacity-30 grayscale'}`} aria-hidden="true">
                  {achievement.icon}
                </span>
                <div className="relative flex-1">
                  <p className={`font-display font-bold ${unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {achievement.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{achievement.description}</p>
                  <p className={`mt-1 text-xs font-semibold ${unlocked ? 'text-success-600 dark:text-success-500' : 'text-slate-400'}`}>
                    {unlocked ? '✓ Sbloccato' : '🔒 Bloccato'}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
