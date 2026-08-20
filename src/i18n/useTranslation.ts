import { useCallback } from 'react';
import type { TranslationKey } from './types';
import { translate } from './translate';
import { useLanguageStore } from './languageStore';

export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale],
  );

  return { t, locale, setLocale };
}
