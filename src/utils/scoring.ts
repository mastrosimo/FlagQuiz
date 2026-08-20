export const BASE_POINTS = 100;
export const SPEED_BONUS = 50;
export const SPEED_THRESHOLD_MS = 3000;

const STREAK_BONUSES: Record<number, number> = {
  2: 20,
  3: 50,
  5: 150,
};

export function getStreakBonus(streakAfterAnswer: number): number {
  return STREAK_BONUSES[streakAfterAnswer] ?? 0;
}

export function computeAnswerScore(
  correct: boolean,
  timeMs: number,
  streakAfterAnswer: number,
): number {
  if (!correct) return 0;
  let points = BASE_POINTS;
  if (timeMs < SPEED_THRESHOLD_MS) points += SPEED_BONUS;
  points += getStreakBonus(streakAfterAnswer);
  return points;
}

export function getAccuracyJudgment(accuracyPercent: number): string {
  if (accuracyPercent >= 95) return 'Sei un maestro delle bandiere!';
  if (accuracyPercent >= 80) return 'Ottima conoscenza!';
  if (accuracyPercent >= 60) return 'Conosci abbastanza bene il mondo!';
  if (accuracyPercent >= 40) return 'Buon inizio!';
  return 'Devi ancora allenarti!';
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
