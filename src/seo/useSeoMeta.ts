import { useEffect } from 'react';
import type { Locale } from '../i18n/types';
import { absoluteUrl } from './content';

export interface SeoMetaInput {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  alternatePath: string;
  jsonLd: object;
}

function setMetaContent(selector: string, value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', value);
}

function upsertLink(rel: string, hreflang: string | null, href: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(data: object) {
  let el = document.querySelector('script#seo-jsonld') as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = 'seo-jsonld';
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** Applies full page-level SEO (title, description, canonical, hreflang, OG, JSON-LD) for the
 * locale-prefixed content pages (home/continent/country). These pages own their meta entirely —
 * see useSeoSync, which skips these routes to avoid overwriting this. */
export function useSeoMeta({ locale, title, description, path, alternatePath, jsonLd }: SeoMetaInput) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = title;

    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', absoluteUrl(path));
    setMetaContent('meta[property="og:locale"]', locale === 'it' ? 'it_IT' : 'en_US');
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);

    upsertLink('canonical', null, absoluteUrl(path));
    upsertLink('alternate', locale, absoluteUrl(path));
    upsertLink('alternate', locale === 'it' ? 'en' : 'it', absoluteUrl(alternatePath));
    upsertLink('alternate', 'x-default', absoluteUrl(locale === 'it' ? alternatePath : path));

    upsertJsonLd(jsonLd);
  }, [locale, title, description, path, alternatePath, jsonLd]);
}
