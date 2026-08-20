import type { ProfileStats, Achievement } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';

export function getNewlyUnlocked(
  stats: ProfileStats,
  alreadyUnlocked: string[],
): Achievement[] {
  const unlockedSet = new Set(alreadyUnlocked);
  return ACHIEVEMENTS.filter(
    (achievement) => !unlockedSet.has(achievement.id) && achievement.check(stats),
  );
}
