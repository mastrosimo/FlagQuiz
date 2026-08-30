import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useProfileStore } from '../../store/profileStore';
import { getLevelForXp } from '../../data/levels';
import { LevelProgressBar } from '../common/LevelProgressBar';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { useTranslation } from '../../i18n/useTranslation';

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const xp = useProfileStore((state) => state.xp);
  const level = getLevelForXp(xp);
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/online', label: t('nav.online') },
    { to: '/world', label: t('nav.world') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/stats', label: t('nav.stats') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-brand-600 dark:text-brand-400">
          <span aria-hidden="true">🚩</span>
          FlagQuiz
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label={t('nav.primaryNav')}>
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink
            to="/achievements"
            title={t('nav.achievementsTooltip')}
            className="hidden w-40 flex-col gap-1 rounded-2xl bg-slate-100 px-3 py-1.5 transition-colors hover:bg-slate-200 sm:flex dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <span className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span className="text-accent-500">⭐ {xp} XP</span>
              <span>Lv.{level.level}</span>
            </span>
            <LevelProgressBar xp={xp} compact hideLabel />
          </NavLink>
          <NavLink
            to="/missions"
            title={t('nav.missions')}
            aria-label={t('nav.missions')}
            className={({ isActive }) =>
              `flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`
            }
          >
            <span aria-hidden="true">🎯</span>
          </NavLink>
          <SyncStatusIndicator />
          <UserMenu />
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl md:hidden dark:bg-slate-800"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 md:hidden dark:border-slate-800"
            aria-label={t('nav.mobileNav')}
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex flex-col gap-1 rounded-2xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
                <span className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <span className="text-accent-500">⭐ {xp} XP</span>
                  <span>Lv.{level.level} {t(level.nameKey)}</span>
                </span>
                <LevelProgressBar xp={xp} compact hideLabel />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
