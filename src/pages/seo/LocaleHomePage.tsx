import { useEffect } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SUPPORTED_LOCALES, type Locale } from '../../i18n/types';
import { translate } from '../../i18n/translate';
import { useLanguageStore } from '../../i18n/languageStore';
import { CONTINENTS } from '../../data/countries';
import { getContinentPath } from '../../seo/slugs';
import { buildHomeJsonLd } from '../../seo/jsonLd';
import { useSeoMeta } from '../../seo/useSeoMeta';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export function LocaleHomeRoute() {
  const { locale = '' } = useParams();
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) return <Navigate to="/" replace />;
  return <LocaleHomePage locale={locale as Locale} />;
}

function LocaleHomePage({ locale }: { locale: Locale }) {
  const navigate = useNavigate();
  const setLocale = useLanguageStore((state) => state.setLocale);

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  const title = translate(locale, 'meta.title');
  const description = translate(locale, 'meta.description');
  const otherLocale: Locale = locale === 'it' ? 'en' : 'it';

  useSeoMeta({
    locale,
    title,
    description,
    path: `/${locale}`,
    alternatePath: `/${otherLocale}`,
    jsonLd: buildHomeJsonLd(locale),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <section className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white"
        >
          <span aria-hidden="true">🚩</span> FLAGQUIZ
        </motion.h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          {translate(locale, 'seo.homeIntro')}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate('/quiz')} className="px-10 text-xl">
            {translate(locale, 'home.startButton')}
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/learn')}>
            {translate(locale, 'seo.goToLearn')}
          </Button>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-center font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          {translate(locale, 'collection.continentProgressHeading')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CONTINENTS.map((continent) => (
            <Link key={continent} to={getContinentPath(continent, locale)}>
              <Card className="p-4 text-center transition-shadow hover:shadow-md">
                <span className="text-2xl" aria-hidden="true">🌍</span>
                <p className="mt-1 font-display font-bold text-slate-900 dark:text-white">
                  {translate(locale, `continents.${continent}`)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
