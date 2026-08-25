import { motion } from 'framer-motion';
import { FlagImage } from './FlagImage';

interface FlagCardProps {
  code: string;
  name: string;
  questionKey: string | number;
}

export function FlagCard({ code, name, questionKey }: FlagCardProps) {
  return (
    <motion.div
      key={questionKey}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-900/5 sm:max-w-lg dark:bg-slate-900 dark:ring-white/10"
    >
      <div className="flex aspect-[3/2] items-center justify-center bg-slate-100 p-4 dark:bg-slate-800">
        <FlagImage code={code} name={name} className="h-full w-full rounded-xl shadow-md" />
      </div>
    </motion.div>
  );
}
