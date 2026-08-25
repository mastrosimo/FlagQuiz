import type { Continent, VisitedEntry } from '../types';
import { COUNTRIES, CONTINENTS, countByContinent } from '../data/countries';

export interface WorldSummary {
  visited: number;
  total: number;
  ratio: number;
  byContinent: { continent: Continent; visited: number; total: number }[];
}

export function getVisitedSummary(visitedCodes: string[]): WorldSummary {
  const visitedSet = new Set(visitedCodes);
  const total = COUNTRIES.length;
  const visited = COUNTRIES.filter((country) => visitedSet.has(country.code)).length;

  const byContinent = CONTINENTS.map((continent) => ({
    continent,
    visited: COUNTRIES.filter(
      (country) => country.continent === continent && visitedSet.has(country.code),
    ).length,
    total: countByContinent(continent),
  }));

  return {
    visited,
    total,
    ratio: total > 0 ? visited / total : 0,
    byContinent,
  };
}

export interface TimelineEntry {
  code: string;
  year: number | null;
  date: string | null;
  note: string | null;
  // Chiave di ordinamento derivata (ms epoch): usa la data se presente,
  // altrimenti il 1° gennaio dell'anno. Mai una posizione inventata quando
  // mancano entrambi: quelle voci finiscono in `undated`, non ordinate.
  sortValue: number;
}

export interface TravelTimeline {
  dated: TimelineEntry[];
  undated: TimelineEntry[];
}

export function buildTravelTimeline(visited: Record<string, VisitedEntry>): TravelTimeline {
  const dated: TimelineEntry[] = [];
  const undated: TimelineEntry[] = [];

  for (const [code, entry] of Object.entries(visited)) {
    if (entry.date) {
      dated.push({ code, year: entry.year, date: entry.date, note: entry.note, sortValue: new Date(entry.date).getTime() });
    } else if (entry.year) {
      dated.push({ code, year: entry.year, date: entry.date, note: entry.note, sortValue: new Date(entry.year, 0, 1).getTime() });
    } else {
      undated.push({ code, year: null, date: null, note: entry.note, sortValue: 0 });
    }
  }

  dated.sort((a, b) => a.sortValue - b.sortValue);

  return { dated, undated };
}
