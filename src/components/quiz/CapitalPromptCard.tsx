import { motion } from 'framer-motion';

interface CapitalPromptCardProps {
  capital: string;
  questionKey: string | number;
}

/**
 * Equivalente di `FlagCard` per la direzione "Capitale → Paese": stessa
 * cornice/animazione, testo al posto dell'immagine della bandiera.
 */
export function CapitalPromptCard({ capital, questionKey }: CapitalPromptCardProps) {
  return (
    <motion.div
      key={questionKey}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-900/5 sm:max-w-lg dark:bg-slate-900 dark:ring-white/10"
    >
      <div className="flex aspect-[3/2] flex-col items-center justify-center gap-3 bg-slate-100 p-4 dark:bg-slate-800">
        <span className="text-5xl" aria-hidden="true">🏛️</span>
        <span className="text-center font-display text-3xl font-black text-slate-900 dark:text-white">
          {capital}
        </span>
      </div>
    </motion.div>
  );
}
