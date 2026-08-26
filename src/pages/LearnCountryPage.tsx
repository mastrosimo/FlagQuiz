import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COUNTRY_BY_CODE, COUNTRIES } from '../data/countries';
import { getCountryFacts } from '../data/countryFacts';
import { FLAG_DESCRIPTIONS } from '../data/flagDescriptions';
import { FlagImage } from '../components/quiz/FlagImage';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CuriosityCard } from '../components/learn/CuriosityCard';
import { CountryMiniQuiz } from '../components/learn/CountryMiniQuiz';
import { useLearnStore } from '../store/learnStore';
import { useMissionStore } from '../store/missionStore';
import { shuffle } from '../utils/shuffle';
import { useTranslation } from '../i18n/useTranslation';
import type { TranslationKey } from '../i18n/types';

const DIFFICULTY_KEYS: Record<string, TranslationKey> = {
  easy: 'difficulty.easy',
  medium: 'difficulty.medium',
  hard: 'difficulty.hard',
};

export function LearnCountryPage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const country = COUNTRY_BY_CODE[code.toUpperCase()];

  useEffect(() => {
    if (!country) return;
    useLearnStore.getState().markStudied(country.code);
    useMissionStore.getState().applyStudyEvent(country.code);
  }, [country]);

  if (!country) return <Navigate to="/learn" replace />;

  const facts = getCountryFacts(country.code);

  const handleDiscoverAnother = () => {
    const next = shuffle(COUNTRIES.filter((candidate) => candidate.code !== country.code))[0];
    navigate(`/learn/${next.code}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        to="/learn"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        ← {t('learn.backToHub')}
      </Link>

      <div className="text-center">
        <FlagImage
          code={country.code}
          name={country.name[locale]}
          className="mx-auto aspect-[3/2] w-40 rounded-xl shadow-md"
        />
        <h1 className="mt-4 font-display text-3xl font-black text-slate-900 dark:text-white">
          {country.name[locale]}
        </h1>
        <span className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {t(`continents.${country.continent}`)}
        </span>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('learn.sectionFlagHeading')}
        </h2>
        <Card className="p-5">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {FLAG_DESCRIPTIONS[country.code][locale]}
          </p>
        </Card>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('learn.sectionInfoHeading')}
        </h2>
        <Card className="p-5">
          <dl className="grid grid-cols-2 gap-3 text-left text-sm">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('learn.continent')}</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-100">{t(`continents.${country.continent}`)}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('learn.capital')}</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-100">{country.capital[locale]}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('learn.isoCode')}</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-100">{country.code}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('learn.difficulty')}</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-100">{t(DIFFICULTY_KEYS[country.difficulty])}</dd>
            </div>
          </dl>
        </Card>
      </section>

      {facts.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('learn.sectionFactsHeading')}
          </h2>
          <div className="flex flex-col gap-3">
            {facts.map((fact, index) => (
              <CuriosityCard key={index} fact={fact} index={index} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('learn.sectionQuizHeading')}
        </h2>
        <Card className="p-5">
          <CountryMiniQuiz key={country.code} country={country} />
        </Card>
      </section>

      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-8">
        <Button size="lg" className="w-full" onClick={handleDiscoverAnother}>
          {t('learn.discoverAnotherButton')}
        </Button>
      </motion.div>
    </div>
  );
}
