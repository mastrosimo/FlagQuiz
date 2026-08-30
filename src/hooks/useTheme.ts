import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'flagquiz:v1:theme';
// Nome dell'evento con cui syncService avvisa le istanze di useTheme montate
// che il valore in localStorage e' cambiato dall'esterno (es. dopo un pull dal
// cloud), cosi' anche il loro stato React locale si aggiorna. useTheme non e'
// uno store condiviso (ogni componente ne tiene una copia locale in useState),
// quindi senza questo evento un componente gia' montato non se ne accorgerebbe.
const EXTERNAL_CHANGE_EVENT = 'flagquiz:theme-hydrated';
// Dispatched ad ogni cambio (locale o esterno): syncService lo ascolta per
// decidere quando rilanciare un push delle impostazioni.
export const THEME_CHANGED_EVENT = 'flagquiz:theme-changed';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
    window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
  }, [theme]);

  useEffect(() => {
    const handleExternalChange = () => setTheme(getInitialTheme());
    window.addEventListener(EXTERNAL_CHANGE_EVENT, handleExternalChange);
    return () => window.removeEventListener(EXTERNAL_CHANGE_EVENT, handleExternalChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}

// Usati solo da syncService: leggere/scrivere il tema da fuori a React senza
// duplicare la logica di storage/DOM gia' presente in useTheme.
export function getStoredTheme(): Theme {
  return getInitialTheme();
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
  window.dispatchEvent(new Event(EXTERNAL_CHANGE_EVENT));
}
