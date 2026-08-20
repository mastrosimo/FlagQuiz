import type { Continent } from '../types';
import { COUNTRIES, CONTINENTS, countByContinent } from '../data/countries';

export interface CollectionSummary {
  recognized: number;
  total: number;
  ratio: number;
  byContinent: { continent: Continent; recognized: number; total: number }[];
}

export function getCollectionSummary(recognizedCodes: string[]): CollectionSummary {
  const recognizedSet = new Set(recognizedCodes);
  const total = COUNTRIES.length;
  const recognized = COUNTRIES.filter((country) => recognizedSet.has(country.code)).length;

  const byContinent = CONTINENTS.map((continent) => ({
    continent,
    recognized: COUNTRIES.filter(
      (country) => country.continent === continent && recognizedSet.has(country.code),
    ).length,
    total: countByContinent(continent),
  }));

  return {
    recognized,
    total,
    ratio: total > 0 ? recognized / total : 0,
    byContinent,
  };
}
