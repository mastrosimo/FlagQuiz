import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMasteryStore } from '../../store/masteryStore';
import { MASTERY_LEVEL_META } from '../../utils/mastery';
import { COUNTRY_BY_CODE } from '../../data/countries';
import { useSound } from '../../hooks/useSound';
import { useTranslation } from '../../i18n/useTranslation';

export function MasteryLevelUpToast() {
  const lastLevelUps = useMasteryStore((state) => state.lastLevelUps);
  const clearLastLevelUps = useMasteryStore((state) => state.clearLastLevelUps);
  const { playUnlock } = useSound();
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (lastLevelUps.length === 0) return;
    playUnlock();
    const timeout = setTimeout(clearLastLevelUps, 4500);
    return () => clearTimeout(timeout);
  }, [lastLevelUps]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {lastLevelUps.map((event, index) => {
          const country = COUNTRY_BY_CODE[event.code];
          if (!country) return null;
          const meta = MASTERY_LEVEL_META[event.level];
          const isMaster = event.level === 'master';

          return (
            <motion.div
              key={`${event.code}-${event.level}`}
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22, delay: index * 0.08 }}
              className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-white shadow-xl"
              role="status"
            >
              <span className="text-2xl" aria-hidden="true">{meta.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
                  {isMaster ? t('mastery.levelUpMasterTitle') : t('mastery.levelUpTitle')}
                </p>
                <p className="font-display font-bold">
                  {country.name[locale]} · {t(meta.labelKey)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
