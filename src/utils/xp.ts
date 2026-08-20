import type { QuizSessionResult } from '../types';

export const XP_PER_CORRECT_ANSWER = 10;
export const XP_COMPLETION_BONUS = 50;

export function computeSessionXp(result: QuizSessionResult): number {
  let xp = result.correctCount * XP_PER_CORRECT_ANSWER + XP_COMPLETION_BONUS;
  if (result.bestStreak >= 10) xp += 80;
  else if (result.bestStreak >= 5) xp += 30;
  return xp;
}
