import type { Continent, Country } from '../types';
import type { Locale } from '../i18n/types';
import { COUNTRIES } from '../data/countries';
import { FLAG_DESCRIPTIONS } from '../data/flagDescriptions';
import { translate } from '../i18n/translate';
import { getContinentPath, getCountryPath, isoToFlagEmoji } from './slugs';

export const SITE_URL = 'https://flagquiz.eu';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function getCountriesByContinent(continent: Continent): Country[] {
  return COUNTRIES.filter((country) => country.continent === continent);
}

export function getSortedCountriesByContinent(continent: Continent, locale: Locale): Country[] {
  return getCountriesByContinent(continent).sort((a, b) =>
    a.name[locale].localeCompare(b.name[locale], locale),
  );
}

export function getOtherCountries(country: Country, locale: Locale, limit = 8): Country[] {
  return getSortedCountriesByContinent(country.continent, locale)
    .filter((candidate) => candidate.code !== country.code)
    .slice(0, limit);
}

export interface CountryPageMeta {
  title: string;
  description: string;
  path: string;
  alternatePath: string;
  flagEmoji: string;
  flagDescription: string;
}

export function buildCountryPageMeta(country: Country, locale: Locale): CountryPageMeta {
  const otherLocale: Locale = locale === 'it' ? 'en' : 'it';
  const flagEmoji = isoToFlagEmoji(country.code);
  return {
    title: translate(locale, 'seo.countryTitle', { country: country.name[locale], flag: flagEmoji }),
    description: translate(locale, 'seo.countryDescription', {
      country: country.name[locale],
      capital: country.capital[locale],
      continent: translate(locale, `continents.${country.continent}`),
    }),
    path: getCountryPath(country, locale),
    alternatePath: getCountryPath(country, otherLocale),
    flagEmoji,
    flagDescription: FLAG_DESCRIPTIONS[country.code][locale],
  };
}

export interface ContinentPageMeta {
  title: string;
  description: string;
  path: string;
  alternatePath: string;
}

export function buildContinentPageMeta(continent: Continent, locale: Locale): ContinentPageMeta {
  const otherLocale: Locale = locale === 'it' ? 'en' : 'it';
  const continentLabel = translate(locale, `continents.${continent}`);
  const count = getCountriesByContinent(continent).length;
  return {
    title: translate(locale, 'seo.continentTitle', { continent: continentLabel }),
    description: translate(locale, `continentIntros.${continent}`, { count }),
    path: getContinentPath(continent, locale),
    alternatePath: getContinentPath(continent, otherLocale),
  };
}
