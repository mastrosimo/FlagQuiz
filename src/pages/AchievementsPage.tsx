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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = unlockedSet.has(achievement.id);
          return (
            <Card
              key={achievement.id}
              className={`flex items-center gap-4 p-5 transition-opacity ${unlocked ? '' : 'opacity-60 grayscale'}`}
            >
              <span className="text-3xl" aria-hidden="true">{achievement.icon}</span>
              <div>
                <p className="font-display font-bold text-slate-900 dark:text-white">{achievement.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{achievement.description}</p>
                <p className={`mt-1 text-xs font-semibold ${unlocked ? 'text-success-600 dark:text-success-500' : 'text-slate-400'}`}>
                  {unlocked ? 'Sbloccato' : 'Bloccato'}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
