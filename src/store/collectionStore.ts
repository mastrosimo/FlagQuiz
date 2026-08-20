import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CollectionState {
  recognizedCodes: string[];
  addRecognized: (codes: string[]) => number;
  resetCollection: () => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      recognizedCodes: [],

      addRecognized: (codes: string[]) => {
        const current = get().recognizedCodes;
        const existing = new Set(current);
        const additions = codes.filter((code) => !existing.has(code));
        if (additions.length === 0) return current.length;
        const next = [...current, ...new Set(additions)];
        set({ recognizedCodes: next });
        return next.length;
      },

      resetCollection: () => set({ recognizedCodes: [] }),
    }),
    { name: 'flagquiz:v1:collection' },
  ),
);
