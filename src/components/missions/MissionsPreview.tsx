import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMissionStore } from '../../store/missionStore';
import { useTranslation } from '../../i18n/useTranslation';

export function MissionsPreview() {
  const navigate = useNavigate();
  const ensureFreshDay = useMissionStore((state) => state.ensureFreshDay);
  const today = useMissionStore((state) => state.today);
  const { t } = useTranslation();

  useEffect(() => {
    ensureFreshDay();
  }, [ensureFreshDay]);

  const missions = today?.missions ?? [];
  const completedCount = missions.filter((mission) => mission.completed).length;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/missions')}
      className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-display font-bold text-slate-900 dark:text-white">
          <span aria-hidden="true">📋</span>
          {t('missions.pageTitle')}
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t('missions.completedCount', { completed: completedCount, total: missions.length })}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {missions.map((mission) => (
          <div key={mission.id} className="flex flex-1 items-center gap-2">
            <span className={`text-lg ${mission.completed ? '' : 'opacity-60 grayscale'}`} aria-hidden="true">
              {mission.completed ? '✅' : mission.icon}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full ${mission.completed ? 'bg-success-500' : 'bg-gradient-to-r from-brand-500 to-accent-500'}`}
                style={{ width: `${Math.round((Math.min(mission.progress, mission.target) / mission.target) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <span className="self-end text-xs font-semibold text-brand-600 dark:text-brand-400">
        {t('missions.viewAll')} →
      </span>
    </motion.button>
  );
}
