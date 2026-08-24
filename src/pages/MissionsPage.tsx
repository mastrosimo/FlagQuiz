import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMissionStore } from '../store/missionStore';
import { MISSION_DAILY_BONUS_XP } from '../data/missions';
import { MissionCard } from '../components/missions/MissionCard';
import { Card } from '../components/common/Card';
import { useMidnightCountdown } from '../hooks/useMidnightCountdown';
import { useTranslation } from '../i18n/useTranslation';

export function MissionsPage() {
  const ensureFreshDay = useMissionStore((state) => state.ensureFreshDay);
  const today = useMissionStore((state) => state.today);
  const { t } = useTranslation();
  const resetIn = useMidnightCountdown();

  useEffect(() => {
    ensureFreshDay();
  }, [ensureFreshDay]);

  const missions = today?.missions ?? [];
  const completedCount = missions.filter((mission) => mission.completed).length;
  const allComplete = missions.length > 0 && completedCount === missions.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('missions.pageTitle')}
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{t('missions.pageSubtitle')}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          ⏳ {t('missions.resetIn', { time: resetIn })}
        </span>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <p className="font-display font-bold text-slate-900 dark:text-white">
            {t('missions.todayHeading')}
          </p>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t('missions.completedCount', { completed: completedCount, total: missions.length })}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            initial={false}
            animate={{ width: missions.length > 0 ? `${(completedCount / missions.length) * 100}%` : '0%' }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          />
        </div>
      </Card>

      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-3xl bg-gradient-to-r from-brand-600 to-accent-500 p-5 text-center text-white shadow-lg"
        >
          <p className="text-2xl" aria-hidden="true">🎉</p>
          <p className="mt-1 font-display font-bold">{t('missions.allCompleteBanner')}</p>
          <p className="mt-1 text-sm text-white/90">{t('missions.bonusEarned', { xp: MISSION_DAILY_BONUS_XP })}</p>
        </motion.div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MissionCard mission={mission} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
