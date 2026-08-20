import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Attiva tema chiaro' : 'Attiva tema scuro'}
      aria-pressed={isDark}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
