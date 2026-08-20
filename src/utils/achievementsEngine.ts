import type { AchievementContext, Achievement } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';

export function getNewlyUnlocked(
  context: AchievementContext,
  alreadyUnlocked: string[],
): Achievement[] {
  const unlockedSet = new Set(alreadyUnlocked);
  return ACHIEVEMENTS.filter(
    (achievement) => !unlockedSet.has(achievement.id) && achievement.check(context),
  );
}
