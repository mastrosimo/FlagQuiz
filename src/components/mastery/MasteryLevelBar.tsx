import { getMasteryProgress, MASTERY_LEVEL_META } from '../../utils/mastery';
import { useTranslation } from '../../i18n/useTranslation';

interface MasteryLevelBarProps {
  count: number;
}

export function MasteryLevelBar({ count }: MasteryLevelBarProps) {
  const { t } = useTranslation();
  const progress = getMasteryProgress(count);

  if (!progress.level) return null;

  return (
    <div className="mt-4 text-left">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {progress.count} / {progress.target}
        </span>
        {!progress.completed && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('mastery.remainingToNext', {
              count: progress.remaining,
              level: progress.next ? t(MASTERY_LEVEL_META[progress.next].labelKey) : '',
            })}
          </span>
        )}
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-[width] duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      {progress.completed && (
        <p className="mt-1.5 text-xs font-semibold text-accent-500">{t('mastery.completedLabel')}</p>
      )}
    </div>
  );
}
