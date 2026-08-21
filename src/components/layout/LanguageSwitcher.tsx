import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SUPPORTED_LOCALES, LOCALE_META } from '../../i18n';
import type { Locale } from '../../i18n/types';
import { useTranslation } from '../../i18n/useTranslation';
import { COUNTRY_BY_SLUG, CONTINENT_BY_SLUG, getContinentPath, getCountryPath } from '../../seo/slugs';

/** For locale-prefixed SEO pages, switching language should navigate to the
 * equivalent page in the other language (translated slug), not just flip the
 * in-app locale while staying on a URL that no longer matches its content. */
function resolveAlternatePath(pathname: string, target: Locale): string | null {
  if (pathname === '/it' || pathname === '/en') return `/${target}`;

  const match = pathname.match(/^\/(it|en)\/(bandiere|flags)\/([^/]+)$/);
  if (!match) return null;
  const [, sourceLocale, , slug] = match;
  const source = sourceLocale as Locale;
  if (source === target) return null;

  const continent = CONTINENT_BY_SLUG[source][slug];
  if (continent) return getContinentPath(continent, target);

  const country = COUNTRY_BY_SLUG[source][slug];
  if (country) return getCountryPath(country, target);

  return null;
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = LOCALE_META[locale];

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const selectLocale = (code: Locale) => {
    const alternatePath = resolveAlternatePath(location.pathname, code);
    setLocale(code);
    if (alternatePath) {
      navigate(alternatePath);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language.label')}
        className="flex h-10 items-center gap-1 rounded-full bg-slate-100 px-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">{current.code.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t('language.label')}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/10 dark:bg-slate-800 dark:ring-white/10"
          >
            {SUPPORTED_LOCALES.map((code) => {
              const meta = LOCALE_META[code];
              const selected = code === locale;
              return (
                <li key={code} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => selectLocale(code)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span aria-hidden="true">{meta.flag}</span>
                    {meta.label}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
