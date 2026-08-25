import { useEffect, useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Country } from '../../types';
import type { Locale } from '../../i18n/types';
import { translate } from '../../i18n/translate';
import { useLanguageStore } from '../../i18n/languageStore';
import { COUNTRY_BY_SLUG, CONTINENT_BY_SLUG, getContinentPath, getCountryPath } from '../../seo/slugs';
import { buildCountryPageMeta, getOtherCountries } from '../../seo/content';
import { buildCountryJsonLd } from '../../seo/jsonLd';
import { useSeoMeta } from '../../seo/useSeoMeta';
import { useCollectionStore } from '../../store/collectionStore';
import { useMasteryStore } from '../../store/masteryStore';
import { getMasteryLevel } from '../../utils/mastery';
import { FlagImage } from '../../components/quiz/FlagImage';
import { MasteryBadge } from '../../components/mastery/MasteryBadge';
import { MasteryLevelBar } from '../../components/mastery/MasteryLevelBar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ContinentPage } from './ContinentPage';

const DIFFICULTY_KEYS = {
  easy: 'difficulty.easy',
  medium: 'difficulty.medium',
  hard: 'difficulty.hard',
} as const;

interface CountrySlugPageProps {
  locale: Locale;
}

/** Resolves /:locale/bandiere|flags/:slug to either a country page or a continent page. */
export function CountrySlugPage({ locale }: CountrySlugPageProps) {
  const { slug = '' } = useParams();
  const continent = CONTINENT_BY_SLUG[locale][slug];
  if (continent) return <ContinentPage locale={locale} continent={continent} />;

  const country = COUNTRY_BY_SLUG[locale][slug];
  if (!country) return <Navigate to={`/${locale}`} replace />;

  return <CountryPageContent locale={locale} country={country} />;
}

function CountryPageContent({ locale, country }: { locale: Locale; country: Country }) {
  const navigate = useNavigate();
  const setLocale = useLanguageStore((state) => state.setLocale);
  const recognizedCodes = useCollectionStore((state) => state.recognizedCodes);
  const masteryCounts = useMasteryStore((state) => state.counts);

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  const meta = useMemo(() => buildCountryPageMeta(country, locale), [country, locale]);
  const jsonLd = useMemo(() => buildCountryJsonLd(country, locale), [country, locale]);
  const otherCountries = useMemo(() => getOtherCountries(country, locale), [country, locale]);
  const isRecognized = recognizedCodes.includes(country.code);

  useSeoMeta({
    locale,
    title: meta.title,
    description: meta.description,
    path: meta.path,
    alternatePath: meta.alternatePath,
    jsonLd,
  });

  const continentLabel = translate(locale, `continents.${country.continent}`);
  const continentPath = getContinentPath(country.continent, locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav aria-label={translate(locale, 'seo.breadcrumbHome')} className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to={`/${locale}`} className="hover:text-brand-600 dark:hover:text-brand-400">
          {translate(locale, 'seo.breadcrumbHome')}
        </Link>
        <span aria-hidden="true">/</span>
        <Link to={continentPath} className="hover:text-brand-600 dark:hover:text-brand-400">
          {continentLabel}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{country.name[locale]}</span>
      </nav>

      <div className="text-center">
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div className="flex aspect-[3/2] items-center justify-center bg-slate-100 p-4 dark:bg-slate-800">
            <FlagImage code={country.code} name={country.name[locale]} className="h-full w-full rounded-xl shadow-md" />
          </div>
        </div>

        <h1 className="mt-5 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
          <span aria-hidden="true">{meta.flagEmoji}</span> {country.name[locale]}
        </h1>

        {isRecognized ? (
          <>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success-500/10 px-3 py-1 text-sm font-semibold text-success-600 dark:text-success-500">
              <span aria-hidden="true">✓</span> {translate(locale, 'learn.recognizedBadge')}
            </p>
            <div className="mt-3 flex flex-col items-center">
              {(() => {
                const level = getMasteryLevel(masteryCounts[country.code] ?? 0);
                return level ? <MasteryBadge level={level} /> : null;
              })()}
              <div className="mt-2 w-full max-w-xs">
                <MasteryLevelBar count={masteryCounts[country.code] ?? 0} />
              </div>
            </div>
          </>
        ) : (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <span aria-hidden="true">○</span> {translate(locale, 'learn.notRecognizedYet')}
          </p>
        )}

        <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">{meta.flagDescription}</p>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {translate(locale, 'seo.factsHeading')}
        </h2>
        <dl className="grid grid-cols-2 gap-3 text-left text-sm sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{translate(locale, 'learn.continent')}</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-100">{continentLabel}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{translate(locale, 'learn.capital')}</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-100">{country.capital[locale]}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{translate(locale, 'learn.isoCode')}</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-100">{country.code}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{translate(locale, 'learn.difficulty')}</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-100">
              {translate(locale, DIFFICULTY_KEYS[country.difficulty])}
            </dd>
          </div>
        </dl>
      </Card>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={() => navigate('/quiz')}>
          {translate(locale, 'seo.goToQuiz')}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate('/learn')}>
          {translate(locale, 'seo.goToLearn')}
        </Button>
      </div>

      {otherCountries.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-center font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {translate(locale, 'seo.otherCountriesHeading')}
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {otherCountries.map((other) => (
              <Link
                key={other.code}
                to={getCountryPath(other, locale)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-brand-100 hover:text-brand-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-brand-900/40 dark:hover:text-brand-300"
              >
                {other.name[locale]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
