import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../i18n/useTranslation';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('theme.toggleToLight') : t('theme.toggleToDark')}
      aria-pressed={isDark}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
