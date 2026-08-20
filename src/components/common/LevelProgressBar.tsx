import { getLevelForXp, getXpProgress } from '../../data/levels';
import { useTranslation } from '../../i18n/useTranslation';

interface LevelProgressBarProps {
  xp: number;
  compact?: boolean;
  hideLabel?: boolean;
}

export function LevelProgressBar({ xp, compact = false, hideLabel = false }: LevelProgressBarProps) {
  const { t } = useTranslation();
  const level = getLevelForXp(xp);
  const progress = getXpProgress(xp);
  const isMaxLevel = progress.needed === 0;

  return (
    <div>
      {!hideLabel && (
        <div className={`flex items-center justify-between ${compact ? 'text-xs' : 'text-sm'} font-semibold text-slate-600 dark:text-slate-300`}>
          <span>{t('levelProgress.levelLabel', { level: level.level, name: t(level.nameKey) })}</span>
          <span className="text-slate-400">
            {isMaxLevel
              ? t('levelProgress.max')
              : t('levelProgress.xpProgress', { current: progress.current, needed: progress.needed })}
          </span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${compact ? 'h-1.5' : 'h-2.5'} ${hideLabel ? '' : 'mt-1.5'}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-[width] duration-500"
          style={{ width: `${progress.ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
