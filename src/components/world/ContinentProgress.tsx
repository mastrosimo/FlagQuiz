import { Card } from '../common/Card';
import type { WorldSummary } from '../../utils/world';
import { useTranslation } from '../../i18n/useTranslation';

interface ContinentProgressProps {
  byContinent: WorldSummary['byContinent'];
}

export function ContinentProgress({ byContinent }: ContinentProgressProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {t('world.continentsHeading')}
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {byContinent.map((entry) => (
          <div key={entry.continent}>
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
              <span>{t(`continents.${entry.continent}`)}</span>
              <span className="text-slate-400">
                {entry.visited} / {entry.total}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${entry.total > 0 ? (entry.visited / entry.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
