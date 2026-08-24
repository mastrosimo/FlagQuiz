import { motion } from 'framer-motion';
import type { MissionInstance } from '../../types';
import { Card } from '../common/Card';
import { getMissionDescriptionParams } from '../../utils/missionDisplay';
import { useTranslation } from '../../i18n/useTranslation';

interface MissionCardProps {
  mission: MissionInstance;
}

export function MissionCard({ mission }: MissionCardProps) {
  const { t } = useTranslation();
  const percent = Math.round((Math.min(mission.progress, mission.target) / mission.target) * 100);
  const progressLabel =
    mission.category === 'gameplay-accuracy'
      ? `${Math.min(mission.progress, mission.target)}%`
      : `${Math.min(mission.progress, mission.target)} / ${mission.target}`;

  return (
    <Card
      className={`relative overflow-hidden p-5 ${mission.completed ? 'ring-2 ring-success-500/40' : ''}`}
    >
      {mission.completed && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-success-500/5 to-transparent" />
      )}
      <div className="relative flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">{mission.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display font-bold text-slate-900 dark:text-white">{t(mission.titleKey)}</p>
            <span className="shrink-0 text-xs font-bold text-accent-500">{t('missions.xpValue', { xp: mission.xpReward })}</span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {t(mission.descriptionKey, getMissionDescriptionParams(mission, t))}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={false}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.4 }}
                className={`h-full rounded-full ${mission.completed ? 'bg-success-500' : 'bg-gradient-to-r from-brand-500 to-accent-500'}`}
              />
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
              {progressLabel}
            </span>
          </div>

          {mission.completed && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-success-600 dark:text-success-500">
              <span aria-hidden="true">✓</span> {t('missions.completedBadge')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
