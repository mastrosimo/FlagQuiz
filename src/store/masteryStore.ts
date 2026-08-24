import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMasteryLevel, type MasteryLevel } from '../utils/mastery';

export interface MasteryLevelUpEvent {
  code: string;
  level: MasteryLevel;
}

interface MasteryState {
  counts: Record<string, number>;
  lastLevelUps: MasteryLevelUpEvent[];
  recordCorrectAnswers: (codes: string[]) => void;
  clearLastLevelUps: () => void;
  resetMastery: () => void;
}

export const useMasteryStore = create<MasteryState>()(
  persist(
    (set, get) => ({
      counts: {},
      lastLevelUps: [],

      recordCorrectAnswers: (codes: string[]) => {
        if (codes.length === 0) return;
        const counts = { ...get().counts };
        const levelUps: MasteryLevelUpEvent[] = [];

        for (const code of codes) {
          const previous = counts[code] ?? 0;
          const next = previous + 1;
          counts[code] = next;

          const previousLevel = getMasteryLevel(previous);
          const newLevel = getMasteryLevel(next);
          if (newLevel && newLevel !== previousLevel) {
            levelUps.push({ code, level: newLevel });
          }
        }

        set({ counts, lastLevelUps: levelUps });
      },

      clearLastLevelUps: () => set({ lastLevelUps: [] }),
      resetMastery: () => set({ counts: {}, lastLevelUps: [] }),
    }),
    { name: 'flagquiz:v1:mastery' },
  ),
);
