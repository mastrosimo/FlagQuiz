import { useEffect } from 'react';
import { useTranslation } from './useTranslation';

function setMeta(selector: string, attribute: 'content', value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attribute, value);
}

export function useSeoSync() {
  const { t, locale } = useTranslation();

  useEffect(() => {
    const title = t('meta.title');
    const description = t('meta.description');

    document.documentElement.lang = locale;
    document.title = title;

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:locale"]', 'content', locale === 'it' ? 'it_IT' : 'en_US');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
  }, [t, locale]);
}
