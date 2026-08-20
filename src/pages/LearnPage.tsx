import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Continent, Country, Difficulty } from '../types';
import { COUNTRIES, CONTINENTS } from '../data/countries';
import { FlagImage } from '../components/quiz/FlagImage';
import { Modal } from '../components/common/Modal';
import { useTranslation } from '../i18n/useTranslation';
import type { TranslationKey } from '../i18n/types';

const DIFFICULTY_KEYS: Record<Difficulty, TranslationKey> = {
  easy: 'difficulty.easy',
  medium: 'difficulty.medium',
  hard: 'difficulty.hard',
};

const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard'];

export function LearnPage() {
  const { t, locale } = useTranslation();
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState<Continent | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);
  const [selected, setSelected] = useState<Country | null>(null);

  const filtered = useMemo(() => {
    return COUNTRIES.filter((country) => {
      const matchesQuery = country.name[locale].toLowerCase().includes(query.trim().toLowerCase());
      const matchesContinent = !continent || country.continent === continent;
      const matchesDifficulty = !difficulty || country.difficulty === difficulty;
      return matchesQuery && matchesContinent && matchesDifficulty;
    }).sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
  }, [query, continent, difficulty, locale]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{t('learn.title')}</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{t('learn.subtitle')}</p>

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

      <p className="mt-3 text-xs font-medium text-slate-400">{t('learn.flagsCount', { count: filtered.length })}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((country) => (
          <motion.button
            key={country.code}
            type="button"
            layout
            whileHover={{ y: -3 }}
            onClick={() => setSelected(country)}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          >
            <FlagImage code={country.code} name={country.name[locale]} className="aspect-[3/2] w-full rounded-lg object-cover" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{country.name[locale]}</span>
          </motion.button>
        ))}
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
