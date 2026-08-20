import type { TranslationKey } from '../i18n/types';

export const BASE_POINTS = 100;
export const FAST_ANSWER_MS = 1500;
export const FAST_BONUS = 80;
export const QUICK_ANSWER_MS = 3000;
export const QUICK_BONUS = 40;

const MULTIPLIER_TIERS: { streak: number; multiplier: number }[] = [
  { streak: 10, multiplier: 5 },
  { streak: 5, multiplier: 3 },
  { streak: 3, multiplier: 2 },
  { streak: 0, multiplier: 1 },
];

export function getComboMultiplier(streak: number): number {
  const tier = MULTIPLIER_TIERS.find((entry) => streak >= entry.streak);
  return tier?.multiplier ?? 1;
}

function getSpeedBonus(timeMs: number): number {
  if (timeMs < FAST_ANSWER_MS) return FAST_BONUS;
  if (timeMs < QUICK_ANSWER_MS) return QUICK_BONUS;
  return 0;
}

export function computeAnswerScore(
  correct: boolean,
  timeMs: number,
  streakAfterAnswer: number,
): number {
  if (!correct) return 0;
  const raw = BASE_POINTS + getSpeedBonus(timeMs);
  return raw * getComboMultiplier(streakAfterAnswer);
}

export function isFastAnswer(timeMs: number): boolean {
  return timeMs < FAST_ANSWER_MS;
}

export function getAccuracyJudgmentKey(accuracyPercent: number): TranslationKey {
  if (accuracyPercent >= 95) return 'results.judgmentMaster';
  if (accuracyPercent >= 80) return 'results.judgmentGreat';
  if (accuracyPercent >= 60) return 'results.judgmentGood';
  if (accuracyPercent >= 40) return 'results.judgmentOk';
  return 'results.judgmentBad';
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
