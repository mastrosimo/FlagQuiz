import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Continent, Country, Difficulty } from '../types';
import { COUNTRIES, CONTINENTS } from '../data/countries';
import { FlagImage } from '../components/quiz/FlagImage';
import { Modal } from '../components/common/Modal';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CollectionProgress } from '../components/collection/CollectionProgress';
import { MasteryBadge } from '../components/mastery/MasteryBadge';
import { MasteryLevelBar } from '../components/mastery/MasteryLevelBar';
import { useCollectionStore } from '../store/collectionStore';
import { useMasteryStore } from '../store/masteryStore';
import { getCollectionSummary } from '../utils/collection';
import { getMasteryLevel, MASTERY_LEVEL_META, type MasteryLevel } from '../utils/mastery';
import { useTranslation } from '../i18n/useTranslation';
import type { TranslationKey } from '../i18n/types';

const DIFFICULTY_KEYS: Record<Difficulty, TranslationKey> = {
  easy: 'difficulty.easy',
  medium: 'difficulty.medium',
  hard: 'difficulty.hard',
};

const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard'];

type CollectionFilter = 'all' | 'recognized' | 'unrecognized';

const COLLECTION_FILTER_KEYS: Record<CollectionFilter, TranslationKey> = {
  all: 'learn.filterAll',
  recognized: 'learn.filterRecognized',
  unrecognized: 'learn.filterUnrecognized',
};

const COLLECTION_FILTER_OPTIONS: CollectionFilter[] = ['all', 'recognized', 'unrecognized'];

type MasteryFilter = 'all' | 'none' | MasteryLevel;

const MASTERY_FILTER_KEYS: Record<MasteryFilter, TranslationKey> = {
  all: 'mastery.filterAll',
  none: 'mastery.filterNone',
  discovered: 'mastery.filterDiscovered',
  known: 'mastery.filterKnown',
  expert: 'mastery.filterExpert',
  master: 'mastery.filterMaster',
};

const MASTERY_FILTER_OPTIONS: MasteryFilter[] = ['all', 'none', 'discovered', 'known', 'expert', 'master'];

export function LearnPage() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState<Continent | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>('all');
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>('all');
  const [selected, setSelected] = useState<Country | null>(null);

  const recognizedCodes = useCollectionStore((state) => state.recognizedCodes);
  const recognizedSet = useMemo(() => new Set(recognizedCodes), [recognizedCodes]);
  const collection = useMemo(() => getCollectionSummary(recognizedCodes), [recognizedCodes]);
  const isComplete = collection.recognized >= collection.total;
  const masteryCounts = useMasteryStore((state) => state.counts);

  const filtered = useMemo(() => {
    return COUNTRIES.filter((country) => {
      const matchesQuery = country.name[locale].toLowerCase().includes(query.trim().toLowerCase());
      const matchesContinent = !continent || country.continent === continent;
      const matchesDifficulty = !difficulty || country.difficulty === difficulty;
      const isRecognized = recognizedSet.has(country.code);
      const matchesCollection =
        collectionFilter === 'all' ||
        (collectionFilter === 'recognized' ? isRecognized : !isRecognized);
      const masteryLevel = getMasteryLevel(masteryCounts[country.code] ?? 0);
      const matchesMastery =
        masteryFilter === 'all' ||
        (masteryFilter === 'none' ? masteryLevel === null : masteryLevel === masteryFilter);
      return matchesQuery && matchesContinent && matchesDifficulty && matchesCollection && matchesMastery;
    }).sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
  }, [query, continent, difficulty, collectionFilter, masteryFilter, recognizedSet, masteryCounts, locale]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{t('learn.title')}</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{t('learn.subtitle')}</p>

      {isComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl bg-gradient-to-r from-brand-600 to-accent-500 p-6 text-center text-white shadow-lg"
        >
          <p className="text-3xl" aria-hidden="true">🎉</p>
          <p className="mt-1 font-display text-xl font-extrabold">{t('collection.completeTitle')}</p>
          <p className="mt-1 text-sm text-white/90">{t('collection.completeSubtitle')}</p>
          <p className="mt-2 font-display text-lg font-bold">
            {collection.recognized} / {collection.total} · 100%
          </p>
        </motion.div>
      ) : (
        <Card className="mt-6 p-5">
          <CollectionProgress recognized={collection.recognized} total={collection.total} />
        </Card>
      )}

      <Card className="mt-4 p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('collection.continentProgressHeading')}
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          {collection.byContinent.map((entry) => (
            <div key={entry.continent}>
              <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                <span>{t(`continents.${entry.continent}`)}</span>
                <span className="text-slate-400">{entry.recognized} / {entry.total}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${entry.total > 0 ? (entry.recognized / entry.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('learn.searchPlaceholder')}
          aria-label={t('learn.searchLabel')}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none sm:max-w-xs dark:border-slate-700 dark:bg-slate-800"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setContinent(undefined)}
            aria-pressed={continent === undefined}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              continent === undefined
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t('learn.allContinents')}
          </button>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setContinent(c)}
              aria-pressed={continent === c}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                continent === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t(`continents.${c}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDifficulty(undefined)}
          aria-pressed={difficulty === undefined}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            difficulty === undefined
              ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {t('difficulty.all')}
        </button>
        {DIFFICULTY_OPTIONS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            aria-pressed={difficulty === d}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              difficulty === d
                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t(DIFFICULTY_KEYS[d])}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {COLLECTION_FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setCollectionFilter(f)}
            aria-pressed={collectionFilter === f}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              collectionFilter === f
                ? 'bg-accent-500 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t(COLLECTION_FILTER_KEYS[f])}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {MASTERY_FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setMasteryFilter(f)}
            aria-pressed={masteryFilter === f}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              masteryFilter === f
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t(MASTERY_FILTER_KEYS[f])}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs font-medium text-slate-400">{t('learn.flagsCount', { count: filtered.length })}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((country) => {
          const isRecognized = recognizedSet.has(country.code);
          const masteryLevel = getMasteryLevel(masteryCounts[country.code] ?? 0);
          return (
            <motion.button
              key={country.code}
              type="button"
              layout
              whileHover={{ y: -3 }}
              onClick={() => setSelected(country)}
              className={`relative flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 transition-shadow hover:shadow-md dark:bg-slate-900 ${
                isRecognized ? 'ring-2 ring-success-500/50' : 'ring-slate-900/5 dark:ring-white/10'
              }`}
            >
              {isRecognized && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-success-500 text-[10px] font-bold text-white shadow"
                >
                  ✓
                </span>
              )}
              {masteryLevel && (
                <span
                  aria-hidden="true"
                  title={t(MASTERY_LEVEL_META[masteryLevel].labelKey)}
                  className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10"
                >
                  {MASTERY_LEVEL_META[masteryLevel].icon}
                </span>
              )}
              <FlagImage code={country.code} name={country.name[locale]} className="aspect-[3/2] w-full rounded-lg object-cover" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{country.name[locale]}</span>
            </motion.button>
          );
        })}
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <div className="text-center">
            <FlagImage
              code={selected.code}
              name={selected.name[locale]}
              className="mx-auto aspect-[3/2] w-48 rounded-xl object-cover shadow-md"
            />
            <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
              {selected.name[locale]}
            </h2>

            {recognizedSet.has(selected.code) ? (
              <>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success-500/10 px-3 py-1 text-sm font-semibold text-success-600 dark:text-success-500">
                  <span aria-hidden="true">✓</span> {t('learn.recognizedBadge')}
                </p>
                <div className="mt-3 flex flex-col items-center">
                  {(() => {
                    const level = getMasteryLevel(masteryCounts[selected.code] ?? 0);
                    return level ? <MasteryBadge level={level} /> : null;
                  })()}
                  <div className="mt-2 w-full max-w-xs">
                    <MasteryLevelBar count={masteryCounts[selected.code] ?? 0} />
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-2">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <span aria-hidden="true">○</span> {t('learn.notRecognizedYet')}
                </p>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t('learn.playToAddDescription')}</p>
                <Button size="md" className="mt-3" onClick={() => navigate('/quiz')}>
                  {t('learn.playNow')}
                </Button>
              </div>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-3 text-left text-sm">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('learn.continent')}</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">
                  {t(`continents.${selected.continent}`)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('learn.capital')}</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{selected.capital[locale]}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('learn.isoCode')}</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{selected.code}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('learn.difficulty')}</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">
                  {t(DIFFICULTY_KEYS[selected.difficulty])}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
