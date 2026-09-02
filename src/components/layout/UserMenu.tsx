import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { signOut } from '../../services/authService';
import { getShownName } from '../../utils/displayName';
import { useTranslation } from '../../i18n/useTranslation';

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  if (status === 'loading') {
    return <div className="h-10 w-10 sm:w-24" aria-hidden="true" />;
  }

  if (status === 'guest') {
    return (
      <NavLink
        to="/login"
        className="flex h-10 items-center gap-1.5 rounded-full bg-brand-600 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:px-4"
      >
        <span aria-hidden="true">👤</span>
        <span className="hidden sm:inline">{t('auth.header.login')}</span>
      </NavLink>
    );
  }

  const handleLogout = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    setOpen(false);
    navigate('/');
  };

  const email = user?.email ?? '';
  const shownName = getShownName(profile?.displayName, email);
  const initial = shownName.charAt(0).toUpperCase() || '?';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={email}
        title={email}
        className="flex h-10 items-center gap-2 rounded-full bg-slate-100 px-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
        >
          {initial}
        </span>
        <span className="hidden max-w-[8rem] truncate sm:inline">{shownName}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/10 dark:bg-slate-800 dark:ring-white/10"
          >
            <p className="truncate px-3 py-2 text-xs font-medium text-slate-500 sm:hidden dark:text-slate-400">
              {email}
            </p>
            <NavLink
              role="menuitem"
              to="/account"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {t('account.menuLink')}
            </NavLink>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={signingOut}
              className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-danger-600 transition-colors hover:bg-slate-100 disabled:opacity-60 dark:text-danger-500 dark:hover:bg-slate-700"
            >
              {signingOut ? t('auth.header.loggingOut') : t('auth.header.logout')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
