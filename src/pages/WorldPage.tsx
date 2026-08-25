import { useMemo, useState } from 'react';
import type { Country } from '../types';
import { COUNTRIES } from '../data/countries';
import { useCollectionStore } from '../store/collectionStore';
import { useWorldStore } from '../store/worldStore';
import { getVisitedSummary, buildTravelTimeline } from '../utils/world';
import { WorldOverview, type WorldFilter } from '../components/world/WorldOverview';
import { WorldGrid } from '../components/world/WorldGrid';
import { ContinentProgress } from '../components/world/ContinentProgress';
import { TravelTimeline } from '../components/world/TravelTimeline';
import { CountryDetailModal } from '../components/world/CountryDetailModal';
import { useTranslation } from '../i18n/useTranslation';

export function WorldPage() {
  const { t } = useTranslation();
  const recognizedCodes = useCollectionStore((state) => state.recognizedCodes);
  const visited = useWorldStore((state) => state.visited);
  const wishlist = useWorldStore((state) => state.wishlist);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [statusFilter, setStatusFilter] = useState<WorldFilter>('all');

  const knownCodes = useMemo(() => new Set(recognizedCodes), [recognizedCodes]);
  const visitedCodes = useMemo(() => Object.keys(visited), [visited]);
  const visitedCodesSet = useMemo(() => new Set(visitedCodes), [visitedCodes]);
  const wishlistCodes = useMemo(() => new Set(wishlist), [wishlist]);

  const worldSummary = useMemo(() => getVisitedSummary(visitedCodes), [visitedCodes]);
  const timeline = useMemo(() => buildTravelTimeline(visited), [visited]);

  const total = COUNTRIES.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-center font-display text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
        <span aria-hidden="true">🌍</span> {t('world.pageTitle')}
      </h1>
      <p className="mx-auto mt-1 max-w-xl text-center text-slate-500 dark:text-slate-400">{t('world.pageSubtitle')}</p>

      <div className="mt-6">
        <WorldOverview
          knownCount={knownCodes.size}
          visitedCount={worldSummary.visited}
          wishlistCount={wishlistCodes.size}
          total={total}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          {t('world.mapHeading')}
        </h2>
        <WorldGrid
          knownCodes={knownCodes}
          visitedCodes={visitedCodesSet}
          wishlistCodes={wishlistCodes}
          statusFilter={statusFilter}
          onSelect={setSelectedCountry}
        />
      </section>

      <section className="mt-10">
        <ContinentProgress byContinent={worldSummary.byContinent} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          {t('world.timelineSectionHeading')}
        </h2>
        <TravelTimeline dated={timeline.dated} undated={timeline.undated} />
      </section>

      <CountryDetailModal country={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </div>
  );
}
