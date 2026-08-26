import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodayKey } from '../utils/questionGenerator';

interface LearnState {
  studiedCodes: string[];
  /** Codice Paese -> dateKey dell'ultimo mini-quiz completato (qualsiasi punteggio). */
  dailyQuiz: Record<string, string>;
  markStudied: (code: string) => void;
  hasCompletedQuizToday: (code: string) => boolean;
  completeQuiz: (code: string, correctCount: number, total: number) => void;
  resetLearn: () => void;
}

// Persistente e mai azzerato: "ho completato il mini-quiz con 4/4" per questo
// Paese, diverso dallo `studiedCodes` giornaliero di missionStore (che serve
// solo a far avanzare la missione "Studia N bandiere", si resetta ogni giorno
// e scatta alla sola apertura della scheda) e indipendente da
// Collezione/Maestria, che dipendono solo dal Quiz reale.
// `dailyQuiz` limita invece il mini-quiz a un tentativo al giorno per Paese,
// a prescindere dal punteggio ottenuto.
export const useLearnStore = create<LearnState>()(
  persist(
    (set, get) => ({
      studiedCodes: [],
      dailyQuiz: {},

      markStudied: (code: string) => {
        if (get().studiedCodes.includes(code)) return;
        set({ studiedCodes: [...get().studiedCodes, code] });
      },

      hasCompletedQuizToday: (code: string) => get().dailyQuiz[code] === getTodayKey(),

      completeQuiz: (code: string, correctCount: number, total: number) => {
        set({ dailyQuiz: { ...get().dailyQuiz, [code]: getTodayKey() } });
        if (correctCount === total) get().markStudied(code);
      },

      resetLearn: () => set({ studiedCodes: [], dailyQuiz: {} }),
    }),
    { name: 'flagquiz:v1:learn' },
  ),
);
