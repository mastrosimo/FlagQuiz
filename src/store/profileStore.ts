import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Achievement,
  Continent,
  DailyChallengeState,
  DailyStreak,
  ProfileStats,
  QuizSessionResult,
} from '../types';
import { CONTINENTS } from '../data/countries';
import { getNewlyUnlocked } from '../utils/achievementsEngine';
import { computeSessionXp } from '../utils/xp';
import { isFastAnswer } from '../utils/scoring';
import { getTodayKey } from '../utils/questionGenerator';

function emptyContinentStats(): Record<Continent, { correct: number; total: number }> {
  return Object.fromEntries(
    CONTINENTS.map((continent) => [continent, { correct: 0, total: 0 }]),
  ) as Record<Continent, { correct: number; total: number }>;
}

function emptyStats(): ProfileStats {
  return {
    gamesPlayed: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    bestStreak: 0,
    bestScore: 0,
    flagsRecognized: 0,
    fastAnswers: 0,
    continentStats: emptyContinentStats(),
    recentSessions: [],
  };
}

function emptyDailyStreak(): DailyStreak {
  return { current: 0, longest: 0, lastPlayedDate: null };
}

function emptyDailyChallenge(): DailyChallengeState {
  return { date: null, completed: false, result: null };
}

function yesterdayKey(todayKey: string): string {
  const date = new Date(`${todayKey}T00:00:00`);
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updateDailyStreak(previous: DailyStreak): DailyStreak {
  const today = getTodayKey();
  if (previous.lastPlayedDate === today) return previous;
  const current = previous.lastPlayedDate === yesterdayKey(today) ? previous.current + 1 : 1;
  return { current, longest: Math.max(previous.longest, current), lastPlayedDate: today };
}

interface ProfileState {
  stats: ProfileStats;
  xp: number;
  unlockedAchievements: string[];
  soundEnabled: boolean;
  lastUnlocked: Achievement[];
  dailyStreak: DailyStreak;
  dailyChallenge: DailyChallengeState;
  recordSession: (result: QuizSessionResult) => void;
  completeDailyChallenge: (result: { score: number; correctCount: number; totalQuestions: number }) => void;
  clearLastUnlocked: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetProgress: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      stats: emptyStats(),
      xp: 0,
      unlockedAchievements: [],
      soundEnabled: true,
      lastUnlocked: [],
      dailyStreak: emptyDailyStreak(),
      dailyChallenge: emptyDailyChallenge(),

      recordSession: (result: QuizSessionResult) => {
        const previous = get().stats;
        const continentStats = { ...previous.continentStats };

        for (const answered of result.answered) {
          const continent = answered.question.correct.continent;
          const entry = continentStats[continent];
          continentStats[continent] = {
            correct: entry.correct + (answered.correct ? 1 : 0),
            total: entry.total + 1,
          };
        }

        const fastAnswersGained = result.answered.filter(
          (entry) => entry.correct && isFastAnswer(entry.timeMs),
        ).length;

        const nextStats: ProfileStats = {
          gamesPlayed: previous.gamesPlayed + 1,
          questionsAnswered: previous.questionsAnswered + result.totalQuestions,
          correctAnswers: previous.correctAnswers + result.correctCount,
          wrongAnswers:
            previous.wrongAnswers + (result.totalQuestions - result.correctCount),
          bestStreak: Math.max(previous.bestStreak, result.bestStreak),
          bestScore: Math.max(previous.bestScore, result.score),
          flagsRecognized: previous.flagsRecognized + result.correctCount,
          fastAnswers: previous.fastAnswers + fastAnswersGained,
          continentStats,
          recentSessions: [
            ...previous.recentSessions,
            {
              date: result.completedAt,
              score: result.score,
              accuracy: result.totalQuestions
                ? Math.round((result.correctCount / result.totalQuestions) * 100)
                : 0,
            },
          ].slice(-20),
        };

        const xpGained = computeSessionXp(result);
        const nextXp = get().xp + xpGained;
        const newlyUnlocked = getNewlyUnlocked(nextStats, get().unlockedAchievements);

        set({
          stats: nextStats,
          xp: nextXp,
          unlockedAchievements: [
            ...get().unlockedAchievements,
            ...newlyUnlocked.map((achievement) => achievement.id),
          ],
          lastUnlocked: newlyUnlocked,
          dailyStreak: updateDailyStreak(get().dailyStreak),
        });
      },

      completeDailyChallenge: (result) => {
        set({
          dailyChallenge: { date: getTodayKey(), completed: true, result },
        });
      },

      clearLastUnlocked: () => set({ lastUnlocked: [] }),
      setSoundEnabled: (enabled: boolean) => set({ soundEnabled: enabled }),
      resetProgress: () =>
        set({
          stats: emptyStats(),
          xp: 0,
          unlockedAchievements: [],
          lastUnlocked: [],
          dailyStreak: emptyDailyStreak(),
          dailyChallenge: emptyDailyChallenge(),
        }),
    }),
    {
      name: 'flagquiz:v1:profile',
      version: 2,
      migrate: (persisted) => {
        const state = persisted as Partial<ProfileState> & { stats?: Partial<ProfileStats> };
        return {
          ...state,
          stats: { ...emptyStats(), ...state.stats },
          dailyStreak: state.dailyStreak ?? emptyDailyStreak(),
          dailyChallenge: state.dailyChallenge ?? emptyDailyChallenge(),
        } as ProfileState;
      },
    },
  ),
);
