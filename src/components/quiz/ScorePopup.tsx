import { AnimatePresence, motion } from 'framer-motion';

interface ScorePopupProps {
  points: number | null;
  popupKey: number;
}

export function ScorePopup({ points, popupKey }: ScorePopupProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center">
      <AnimatePresence>
        {points != null && points > 0 && (
          <motion.span
            key={popupKey}
            initial={{ opacity: 0, y: 8, scale: 0.7 }}
            animate={{ opacity: 1, y: -28, scale: 1.15 }}
            exit={{ opacity: 0, y: -44 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-display text-3xl font-black text-accent-500 drop-shadow-sm"
          >
            +{points}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
