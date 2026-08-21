import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Continent } from '../../types';
import type { Locale } from '../../i18n/types';
import { translate } from '../../i18n/translate';
import { useLanguageStore } from '../../i18n/languageStore';
import { getCountryPath } from '../../seo/slugs';
import { buildContinentPageMeta, getSortedCountriesByContinent } from '../../seo/content';
import { buildContinentJsonLd } from '../../seo/jsonLd';
import { useSeoMeta } from '../../seo/useSeoMeta';
import { useCollectionStore } from '../../store/collectionStore';
import { FlagImage } from '../../components/quiz/FlagImage';
import { Button } from '../../components/common/Button';

interface ContinentPageProps {
  locale: Locale;
  continent: Continent;
}

export function ContinentPage({ locale, continent }: ContinentPageProps) {
  const navigate = useNavigate();
  const setLocale = useLanguageStore((state) => state.setLocale);
  const recognizedCodes = useCollectionStore((state) => state.recognizedCodes);
  const recognizedSet = useMemo(() => new Set(recognizedCodes), [recognizedCodes]);

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  const meta = useMemo(() => buildContinentPageMeta(continent, locale), [continent, locale]);
  const jsonLd = useMemo(() => buildContinentJsonLd(continent, locale), [continent, locale]);
  const countries = useMemo(() => getSortedCountriesByContinent(continent, locale), [continent, locale]);
  const continentLabel = translate(locale, `continents.${continent}`);

  useSeoMeta({
    locale,
    title: meta.title,
    description: meta.description,
    path: meta.path,
    alternatePath: meta.alternatePath,
    jsonLd,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav aria-label={translate(locale, 'seo.breadcrumbHome')} className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to={`/${locale}`} className="hover:text-brand-600 dark:hover:text-brand-400">
          {translate(locale, 'seo.breadcrumbHome')}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{continentLabel}</span>
      </nav>

      <h1 className="text-center font-display text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
        <span aria-hidden="true">🌍</span> {continentLabel}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-300">{meta.description}</p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={() => navigate('/quiz')}>
          {translate(locale, 'seo.goToQuiz')}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate('/learn')}>
          {translate(locale, 'seo.goToLearn')}
        </Button>
      </div>

      <h2 className="mt-10 mb-4 text-center font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {translate(locale, 'seo.continentCountriesHeading')}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {countries.map((country) => {
          const isRecognized = recognizedSet.has(country.code);
          return (
            <Link
              key={country.code}
              to={getCountryPath(country, locale)}
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
              <FlagImage code={country.code} name={country.name[locale]} className="aspect-[3/2] w-full rounded-lg object-cover" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{country.name[locale]}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
