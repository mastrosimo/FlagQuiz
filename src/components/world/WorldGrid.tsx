import { motion } from 'framer-motion';
import type { Country } from '../../types';
import { COUNTRIES, CONTINENTS } from '../../data/countries';
import { FlagImage } from '../quiz/FlagImage';
import { Card } from '../common/Card';
import { useTranslation } from '../../i18n/useTranslation';
import type { WorldFilter } from './WorldOverview';

interface WorldGridProps {
  knownCodes: Set<string>;
  visitedCodes: Set<string>;
  wishlistCodes: Set<string>;
  statusFilter: WorldFilter;
  onSelect: (country: Country) => void;
}

type TileState = 'visited' | 'wishlist' | 'known' | 'undiscovered';

function getTileState(code: string, visited: Set<string>, wishlist: Set<string>, known: Set<string>): TileState {
  if (visited.has(code)) return 'visited';
  if (wishlist.has(code)) return 'wishlist';
  if (known.has(code)) return 'known';
  return 'undiscovered';
}

function matchesFilter(
  code: string,
  filter: WorldFilter,
  known: Set<string>,
  visited: Set<string>,
  wishlist: Set<string>,
): boolean {
  switch (filter) {
    case 'known':
      return known.has(code);
    case 'visited':
      return visited.has(code);
    case 'wishlist':
      return wishlist.has(code);
    default:
      return true;
  }
}

const TILE_RING: Record<TileState, string> = {
  visited: 'ring-2 ring-success-500/60',
  wishlist: 'ring-2 ring-accent-500/60',
  known: 'ring-1 ring-slate-900/5 dark:ring-white/10',
  undiscovered: 'ring-1 ring-slate-900/5 dark:ring-white/10 opacity-40 grayscale',
};

const TILE_BADGE: Partial<Record<TileState, string>> = {
  visited: '📍',
  wishlist: '⭐',
};

export function WorldGrid({ knownCodes, visitedCodes, wishlistCodes, statusFilter, onSelect }: WorldGridProps) {
  const { t, locale } = useTranslation();

  const continentSections = CONTINENTS.map((continent) => ({
    continent,
    countries: COUNTRIES.filter(
      (country) =>
        country.continent === continent &&
        matchesFilter(country.code, statusFilter, knownCodes, visitedCodes, wishlistCodes),
    ),
  })).filter((section) => section.countries.length > 0);

  const isEmpty = continentSections.length === 0;
  const emptyTitleKey = statusFilter === 'wishlist' ? 'world.wishlistEmptyTitle' : 'world.filterEmptyTitle';
  const emptyDescriptionKey =
    statusFilter === 'wishlist' ? 'world.wishlistEmptyDescription' : 'world.filterEmptyDescription';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success-500" aria-hidden="true" /> {t('world.legendVisited')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-500" aria-hidden="true" /> {t('world.legendWishlist')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" aria-hidden="true" /> {t('world.legendKnown')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200 opacity-60 dark:bg-slate-700" aria-hidden="true" />{' '}
          {t('world.legendUndiscovered')}
        </span>
      </div>

      {isEmpty ? (
        <Card className="p-6 text-center">
          <p className="text-3xl" aria-hidden="true">{statusFilter === 'wishlist' ? '⭐' : '🔍'}</p>
          <p className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">{t(emptyTitleKey)}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t(emptyDescriptionKey)}</p>
        </Card>
      ) : (
        continentSections.map(({ continent, countries }) => (
          <div key={continent}>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t(`continents.${continent}`)}
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {countries.map((country) => {
                const state = getTileState(country.code, visitedCodes, wishlistCodes, knownCodes);
                const badge = TILE_BADGE[state];
                return (
                  <motion.button
                    key={country.code}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelect(country)}
                    className="relative flex flex-col items-center gap-1"
                  >
                    <span
                      className={`relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-slate-900 ${TILE_RING[state]}`}
                    >
                      <FlagImage code={country.code} name={country.name[locale]} className="h-full w-full" />
                      {badge && (
                        <span
                          aria-hidden="true"
                          className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] leading-none shadow ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10"
                        >
                          {badge}
                        </span>
                      )}
                    </span>
                    <span className="w-full truncate text-center text-[10px] font-medium text-slate-600 dark:text-slate-300">
                      {country.name[locale]}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
