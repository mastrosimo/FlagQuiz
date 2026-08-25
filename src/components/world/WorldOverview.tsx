import { Card } from '../common/Card';
import { useTranslation } from '../../i18n/useTranslation';

interface WorldOverviewProps {
  knownCount: number;
  visitedCount: number;
  toVisitCount: number;
  total: number;
}

export function WorldOverview({ knownCount, visitedCount, toVisitCount, total }: WorldOverviewProps) {
  const { t } = useTranslation();

  const stats = [
    { icon: '🌐', label: t('world.knownLabel'), value: `${knownCount} / ${total}` },
    { icon: '✈️', label: t('world.visitedLabel'), value: `${visitedCount} / ${total}` },
    { icon: '🧭', label: t('world.toVisitLabel'), value: toVisitCount },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-5 text-center">
          <div className="text-2xl" aria-hidden="true">{stat.icon}</div>
          <p className="mt-1 font-display text-xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
