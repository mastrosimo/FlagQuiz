import type { Continent, Country } from '../types';
import type { Locale } from '../i18n/types';
import { translate } from '../i18n/translate';
import { absoluteUrl, buildCountryPageMeta, buildContinentPageMeta } from './content';
import { getContinentPath } from './slugs';

const WEBSITE_ID = `${absoluteUrl('/')}#website`;

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'FlagQuiz',
    url: absoluteUrl('/'),
  };
}

function breadcrumbList(items: { name: string; path?: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function buildHomeJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      {
        '@type': 'WebPage',
        url: absoluteUrl(`/${locale}`),
        name: translate(locale, 'meta.title'),
        description: translate(locale, 'meta.description'),
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
      },
    ],
  };
}

export function buildContinentJsonLd(continent: Continent, locale: Locale) {
  const meta = buildContinentPageMeta(continent, locale);
  const continentLabel = translate(locale, `continents.${continent}`);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      {
        '@type': 'WebPage',
        url: absoluteUrl(meta.path),
        name: meta.title,
        description: meta.description,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
      },
      breadcrumbList([
        { name: translate(locale, 'seo.breadcrumbHome'), path: `/${locale}` },
        { name: continentLabel, path: meta.path },
      ]),
    ],
  };
}

export function buildCountryJsonLd(country: Country, locale: Locale) {
  const meta = buildCountryPageMeta(country, locale);
  const continentLabel = translate(locale, `continents.${country.continent}`);
  const continentPath = getContinentPath(country.continent, locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      {
        '@type': 'WebPage',
        url: absoluteUrl(meta.path),
        name: meta.title,
        description: meta.description,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
      },
      breadcrumbList([
        { name: translate(locale, 'seo.breadcrumbHome'), path: `/${locale}` },
        { name: continentLabel, path: continentPath },
        { name: country.name[locale], path: meta.path },
      ]),
    ],
  };
}
