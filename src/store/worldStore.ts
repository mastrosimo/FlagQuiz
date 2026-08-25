import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VisitedEntry } from '../types';

interface VisitedDetails {
  year?: number | null;
  date?: string | null;
  note?: string | null;
}

interface WorldState {
  visited: Record<string, VisitedEntry>;
  wishlist: string[];
  markVisited: (code: string, details?: VisitedDetails) => void;
  updateVisitedDetails: (code: string, details: VisitedDetails) => void;
  unmarkVisited: (code: string) => void;
  toggleWishlist: (code: string) => void;
  resetWorld: () => void;
}

export const useWorldStore = create<WorldState>()(
  persist(
    (set, get) => ({
      visited: {},
      wishlist: [],

      // Un Paese visitato "arriva a destinazione": esce automaticamente
      // dalla wishlist, che resta un elenco di Paesi ancora da visitare.
      markVisited: (code, details = {}) => {
        const previous = get().visited[code];
        set({
          visited: {
            ...get().visited,
            [code]: {
              year: details.year ?? previous?.year ?? null,
              date: details.date ?? previous?.date ?? null,
              note: details.note ?? previous?.note ?? null,
              visitedAt: previous?.visitedAt ?? Date.now(),
            },
          },
          wishlist: get().wishlist.filter((entry) => entry !== code),
        });
      },

      updateVisitedDetails: (code, details) => {
        const previous = get().visited[code];
        if (!previous) return;
        set({
          visited: {
            ...get().visited,
            [code]: {
              ...previous,
              ...details,
            },
          },
        });
      },

      unmarkVisited: (code) => {
        const next = { ...get().visited };
        delete next[code];
        set({ visited: next });
      },

      toggleWishlist: (code) => {
        const current = get().wishlist;
        set({
          wishlist: current.includes(code)
            ? current.filter((entry) => entry !== code)
            : [...current, code],
        });
      },

      resetWorld: () => set({ visited: {}, wishlist: [] }),
    }),
    { name: 'flagquiz:v1:world' },
  ),
);
