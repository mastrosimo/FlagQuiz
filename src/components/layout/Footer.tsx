import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  const links = [
    { to: '/quiz', label: t('footer.quiz') },
    { to: '/learn', label: t('footer.learn') },
    { to: '/stats', label: t('footer.stats') },
    { to: '/achievements', label: t('footer.achievements') },
    { to: '/settings', label: t('footer.settings') },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-lg font-bold text-brand-600 dark:text-brand-400">FlagQuiz</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('footer.tagline')}</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label={t('nav.primaryNav')}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
