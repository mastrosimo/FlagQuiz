import { useTranslation } from '../../i18n/useTranslation';

interface CollectionProgressProps {
  recognized: number;
  total: number;
  compact?: boolean;
}

export function CollectionProgress({ recognized, total, compact = false }: CollectionProgressProps) {
  const { t } = useTranslation();
  const ratio = total > 0 ? Math.min(1, recognized / total) : 0;
  const percent = Math.round(ratio * 100);

  return (
    <div>
      <div className={`flex items-center justify-between ${compact ? 'text-sm' : 'text-base'}`}>
        <span className="flex items-center gap-1.5 font-display font-bold text-slate-900 dark:text-white">
          <span aria-hidden="true">🌍</span>
          {recognized} / {total}
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t('collection.percentComplete', { percent })}
        </span>
      </div>
      {!compact && (
        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          {t('stats.flagsRecognized')}
        </p>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${compact ? 'mt-1.5 h-1.5' : 'mt-2 h-2.5'}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
