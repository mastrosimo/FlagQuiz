import type { Continent, DailyChallengeState, DailyStreak, ProfileStats } from '../types';
import { CONTINENTS } from '../data/countries';

export interface ProgressSnapshot {
  stats: ProfileStats;
  xp: number;
  unlockedAchievements: string[];
  dailyStreak: DailyStreak;
  dailyChallenge: DailyChallengeState;
  recognizedCodes: string[];
}

// Somma additiva pensata per l'unione one-time guest -> account (Step 7): mai
// distruttiva, ogni campo combina entrambe le fonti senza scartare dati.
// - contatori cumulativi -> somma
// - "best" (streak/score) -> massimo
// - insiemi (achievement, bandiere, sessioni) -> unione
// - stato "puntuale" (daily streak/challenge) -> vince il piu' recente
export function mergeProgress(local: ProgressSnapshot, remote: ProgressSnapshot): ProgressSnapshot {
  const continentStats = mergeContinentStats(local.stats.continentStats, remote.stats.continentStats);

  const stats: ProfileStats = {
    gamesPlayed: local.stats.gamesPlayed + remote.stats.gamesPlayed,
    questionsAnswered: local.stats.questionsAnswered + remote.stats.questionsAnswered,
    correctAnswers: local.stats.correctAnswers + remote.stats.correctAnswers,
    wrongAnswers: local.stats.wrongAnswers + remote.stats.wrongAnswers,
    bestStreak: Math.max(local.stats.bestStreak, remote.stats.bestStreak),
    bestScore: Math.max(local.stats.bestScore, remote.stats.bestScore),
    flagsRecognized: local.stats.flagsRecognized + remote.stats.flagsRecognized,
    fastAnswers: local.stats.fastAnswers + remote.stats.fastAnswers,
    continentStats,
    recentSessions: [...local.stats.recentSessions, ...remote.stats.recentSessions]
      .sort((a, b) => a.date - b.date)
      .slice(-20),
  };

  return {
    stats,
    xp: local.xp + remote.xp,
    unlockedAchievements: Array.from(new Set([...local.unlockedAchievements, ...remote.unlockedAchievements])),
    dailyStreak: mergeDailyStreak(local.dailyStreak, remote.dailyStreak),
    dailyChallenge: mergeDailyChallenge(local.dailyChallenge, remote.dailyChallenge),
    recognizedCodes: Array.from(new Set([...local.recognizedCodes, ...remote.recognizedCodes])),
  };
}

function mergeContinentStats(
  a: Record<Continent, { correct: number; total: number }>,
  b: Record<Continent, { correct: number; total: number }>,
): Record<Continent, { correct: number; total: number }> {
  return Object.fromEntries(
    CONTINENTS.map((continent) => [
      continent,
      {
        correct: (a[continent]?.correct ?? 0) + (b[continent]?.correct ?? 0),
        total: (a[continent]?.total ?? 0) + (b[continent]?.total ?? 0),
      },
    ]),
  ) as Record<Continent, { correct: number; total: number }>;
}

function mergeDailyStreak(local: DailyStreak, remote: DailyStreak): DailyStreak {
  const longest = Math.max(local.longest, remote.longest);
  const mostRecent =
    (local.lastPlayedDate ?? '') >= (remote.lastPlayedDate ?? '') ? local : remote;
  return { current: mostRecent.current, longest, lastPlayedDate: mostRecent.lastPlayedDate };
}

function mergeDailyChallenge(local: DailyChallengeState, remote: DailyChallengeState): DailyChallengeState {
  if (!local.date) return remote;
  if (!remote.date) return local;
  return local.date >= remote.date ? local : remote;
}

export function hasMeaningfulProgress(snapshot: ProgressSnapshot): boolean {
  return snapshot.stats.gamesPlayed > 0 || snapshot.recognizedCodes.length > 0;
}
