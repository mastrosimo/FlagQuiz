import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SUPPORTED_LOCALES, type Locale } from './types';

function detectBrowserLocale(): Locale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const lang of languages) {
    const primary = lang?.slice(0, 2).toLowerCase();
    if ((SUPPORTED_LOCALES as readonly string[]).includes(primary)) {
      return primary as Locale;
    }
  }
  return 'en';
}

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: detectBrowserLocale(),
      setLocale: (locale: Locale) => set({ locale }),
    }),
    { name: 'flagquiz:v1:language' },
  ),
);
