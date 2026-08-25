import { useTranslation } from '../../i18n/useTranslation';

export type WorldFilter = 'all' | 'known' | 'visited' | 'wishlist';

interface WorldOverviewProps {
  knownCount: number;
  visitedCount: number;
  wishlistCount: number;
  total: number;
  activeFilter: WorldFilter;
  onFilterChange: (filter: WorldFilter) => void;
}

export function WorldOverview({
  knownCount,
  visitedCount,
  wishlistCount,
  total,
  activeFilter,
  onFilterChange,
}: WorldOverviewProps) {
  const { t } = useTranslation();

  const stats: { filter: WorldFilter; icon: string; label: string; value: string | number }[] = [
    { filter: 'all', icon: '🌍', label: t('world.filterAll'), value: total },
    { filter: 'known', icon: '🌐', label: t('world.knownLabel'), value: `${knownCount} / ${total}` },
    { filter: 'visited', icon: '✈️', label: t('world.visitedLabel'), value: `${visitedCount} / ${total}` },
    { filter: 'wishlist', icon: '⭐', label: t('world.wishlistLabel'), value: wishlistCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const isActive = activeFilter === stat.filter;
        return (
          <button
            key={stat.filter}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(stat.filter)}
            className={`rounded-3xl p-5 text-center shadow-sm ring-1 transition-colors ${
              isActive
                ? 'bg-brand-600 ring-brand-600'
                : 'bg-white ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800'
            }`}
          >
            <div className="text-2xl" aria-hidden="true">{stat.icon}</div>
            <p
              className={`mt-1 font-display text-xl font-extrabold ${
                isActive ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
            >
              {stat.value}
            </p>
            <p className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
              {stat.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}
