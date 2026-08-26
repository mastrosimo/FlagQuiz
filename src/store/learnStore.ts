import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LearnState {
  studiedCodes: string[];
  markStudied: (code: string) => void;
  resetLearn: () => void;
}

// Persistente e mai azzerato: "ho letto la scheda di questo Paese", diverso
// dallo `studiedCodes` giornaliero di missionStore (che serve solo a far
// avanzare la missione "Studia N bandiere" e si resetta ogni giorno) e
// indipendente da Collezione/Maestria, che dipendono solo dal Quiz reale.
export const useLearnStore = create<LearnState>()(
  persist(
    (set, get) => ({
      studiedCodes: [],

      markStudied: (code: string) => {
        if (get().studiedCodes.includes(code)) return;
        set({ studiedCodes: [...get().studiedCodes, code] });
      },

      resetLearn: () => set({ studiedCodes: [] }),
    }),
    { name: 'flagquiz:v1:learn' },
  ),
);
