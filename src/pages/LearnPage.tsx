import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Continent } from '../types';
import { COUNTRIES, CONTINENTS, countByContinent } from '../data/countries';
import { FlagImage } from '../components/quiz/FlagImage';
import { Card } from '../components/common/Card';
import { useLearnStore } from '../store/learnStore';
import { shuffle } from '../utils/shuffle';
import { useTranslation } from '../i18n/useTranslation';

export function LearnPage() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeContinent, setActiveContinent] = useState<Continent | null>(null);

  const studiedCodes = useLearnStore((state) => state.studiedCodes);
  const studiedCount = studiedCodes.length;
  const total = COUNTRIES.length;
  const progressPercent = total > 0 ? Math.round((studiedCount / total) * 100) : 0;

  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return COUNTRIES.filter((country) => country.name[locale].toLowerCase().includes(trimmed))
      .sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale))
      .slice(0, 8);
  }, [query, locale]);

  const continentCountries = useMemo(() => {
    if (!activeContinent) return [];
    return COUNTRIES.filter((country) => country.continent === activeContinent).sort((a, b) =>
      a.name[locale].localeCompare(b.name[locale], locale),
    );
  }, [activeContinent, locale]);

  const handleDiscover = () => {
    const random = shuffle(COUNTRIES)[0];
    navigate(`/learn/${random.code}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{t('learn.title')}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{t('learn.subtitle')}</p>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span>{t('learn.studiedHeading')}</span>
          <span className="text-slate-400">{studiedCount} / {total}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDiscover}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-white shadow-lg shadow-brand-600/25"
      >
        <span className="text-2xl" aria-hidden="true">✨</span>
        <span className="font-display text-lg font-extrabold">{t('learn.discoverButton')}</span>
      </motion.button>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('learn.searchHeading')}
        </h2>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('learn.searchPlaceholder')}
          aria-label={t('learn.searchLabel')}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
        {query.trim() !== '' && (
          <div className="mt-3 flex flex-col gap-1.5">
            {searchResults.length === 0 ? (
              <p className="px-2 py-1 text-sm text-slate-400">{t('learn.searchNoResults')}</p>
            ) : (
              searchResults.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => navigate(`/learn/${country.code}`)}
                  className="flex items-center gap-3 rounded-xl bg-white p-2 text-left shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
                >
                  <FlagImage code={country.code} name={country.name[locale]} className="h-8 w-11 shrink-0 rounded" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{country.name[locale]}</span>
                </button>
              ))
            )}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('learn.exploreByContinentHeading')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {CONTINENTS.map((continent) => (
            <button
              key={continent}
              type="button"
              onClick={() => setActiveContinent((current) => (current === continent ? null : continent))}
              aria-pressed={activeContinent === continent}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeContinent === continent
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t(`continents.${continent}`)} · {countByContinent(continent)}
            </button>
          ))}
        </div>

        {activeContinent && (
          <div className="mt-3 flex flex-wrap gap-2">
            {continentCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => navigate(`/learn/${country.code}`)}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-900/5 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-brand-900/40 dark:hover:text-brand-300"
              >
                {country.name[locale]}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
