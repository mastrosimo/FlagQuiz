import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useProfileStore } from '../../store/profileStore';
import { getLevelForXp } from '../../data/levels';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/learn', label: 'Impara' },
  { to: '/stats', label: 'Statistiche' },
];

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

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-brand-600 dark:text-brand-400">
          <span aria-hidden="true">🚩</span>
          FlagQuiz
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigazione principale">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            to="/achievements"
            title="Vedi i tuoi obiettivi"
            className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 sm:flex dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <span className="text-accent-500">⭐ {xp} XP</span>
            <span className="h-3 w-px bg-slate-300 dark:bg-slate-600" />
            <span>Lv.{level.level} {level.name}</span>
          </NavLink>
          <ThemeToggle />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl md:hidden dark:bg-slate-800"
            aria-label="Apri menu"
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
            aria-label="Navigazione mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
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
              <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="text-accent-500">⭐ {xp} XP</span>
                <span className="h-3 w-px bg-slate-300 dark:bg-slate-600" />
                <span>Lv.{level.level} {level.name}</span>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
