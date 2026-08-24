import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMissionStore } from '../../store/missionStore';
import { MISSION_DAILY_BONUS_XP } from '../../data/missions';
import { useSound } from '../../hooks/useSound';
import { useTranslation } from '../../i18n/useTranslation';

export function MissionCompleteToast() {
  const lastCompleted = useMissionStore((state) => state.lastCompleted);
  const lastBonusAwarded = useMissionStore((state) => state.lastBonusAwarded);
  const clearLastCompleted = useMissionStore((state) => state.clearLastCompleted);
  const { playUnlock } = useSound();
  const { t } = useTranslation();

  useEffect(() => {
    if (lastCompleted.length === 0) return;
    playUnlock();
    const timeout = setTimeout(clearLastCompleted, 4500);
    return () => clearTimeout(timeout);
  }, [lastCompleted]);

  const items = [
    ...lastCompleted.map((mission) => ({
      key: mission.id,
      icon: mission.icon,
      title: t('missions.toastTitle'),
      subtitle: `${t(mission.titleKey)} · ${t('missions.xpValue', { xp: mission.xpReward })}`,
    })),
    ...(lastBonusAwarded
      ? [
          {
            key: 'bonus',
            icon: '🎁',
            title: t('missions.bonusLabel'),
            subtitle: t('missions.xpValue', { xp: MISSION_DAILY_BONUS_XP }),
          },
        ]
      : []),
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22, delay: index * 0.08 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent-500 to-brand-500 px-5 py-3 text-white shadow-xl"
            role="status"
          >
            <span className="text-2xl" aria-hidden="true">{item.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-90">{item.title}</p>
              <p className="font-display font-bold">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
