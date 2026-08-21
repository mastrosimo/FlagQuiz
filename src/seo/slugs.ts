import type { Continent, Country } from '../types';
import type { Locale } from '../i18n/types';
import { COUNTRIES } from '../data/countries';

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const CONTINENT_SLUGS: Record<Locale, Record<Continent, string>> = {
  it: {
    Europe: 'europa',
    Asia: 'asia',
    Africa: 'africa',
    NorthAmerica: 'america-del-nord',
    SouthAmerica: 'america-del-sud',
    Oceania: 'oceania',
  },
  en: {
    Europe: 'europe',
    Asia: 'asia',
    Africa: 'africa',
    NorthAmerica: 'north-america',
    SouthAmerica: 'south-america',
    Oceania: 'oceania',
  },
};

export const COUNTRY_PATH_SEGMENT: Record<Locale, string> = {
  it: 'bandiere',
  en: 'flags',
};

export function getCountrySlug(country: Country, locale: Locale): string {
  return slugify(country.name[locale]);
}

function buildCountrySlugMap(locale: Locale): Record<string, Country> {
  const map: Record<string, Country> = {};
  for (const country of COUNTRIES) {
    map[getCountrySlug(country, locale)] = country;
  }
  return map;
}

function buildContinentSlugMap(locale: Locale): Record<string, Continent> {
  const map: Record<string, Continent> = {};
  for (const continent of Object.keys(CONTINENT_SLUGS[locale]) as Continent[]) {
    map[CONTINENT_SLUGS[locale][continent]] = continent;
  }
  return map;
}

export const COUNTRY_BY_SLUG: Record<Locale, Record<string, Country>> = {
  it: buildCountrySlugMap('it'),
  en: buildCountrySlugMap('en'),
};

export const CONTINENT_BY_SLUG: Record<Locale, Record<string, Continent>> = {
  it: buildContinentSlugMap('it'),
  en: buildContinentSlugMap('en'),
};

export function getCountryPath(country: Country, locale: Locale): string {
  return `/${locale}/${COUNTRY_PATH_SEGMENT[locale]}/${getCountrySlug(country, locale)}`;
}

export function getContinentPath(continent: Continent, locale: Locale): string {
  return `/${locale}/${COUNTRY_PATH_SEGMENT[locale]}/${CONTINENT_SLUGS[locale][continent]}`;
}

/** Regional-indicator emoji flag built from a two-letter ISO code (e.g. "IT" -> 🇮🇹). */
export function isoToFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
