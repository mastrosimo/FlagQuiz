import type { CapitalDirection, Country, Question } from '../types';
import { COUNTRIES } from '../data/countries';
import { shuffle } from './shuffle';

const OPTIONS_PER_QUESTION = 4;

/**
 * Distrattori per il Quiz Capitali. Stessa struttura a cascata di
 * `buildDistractors` (questionGenerator.ts), ma con priorità diversa: niente
 * `correct.similar` (è la somiglianza *visiva* tra bandiere, non pertinente
 * qui) — si preferisce invece la stessa difficoltà (capitali di notorietà
 * comparabile), poi lo stesso continente, poi qualunque Paese come fallback.
 */
function buildCapitalDistractors(correct: Country, pool: Country[]): Country[] {
  const distractors: Country[] = [];
  const usedCodes = new Set([correct.code]);

  const addFrom = (candidates: Country[]) => {
    for (const candidate of shuffle(candidates)) {
      if (distractors.length >= OPTIONS_PER_QUESTION - 1) break;
      if (usedCodes.has(candidate.code)) continue;
      distractors.push(candidate);
      usedCodes.add(candidate.code);
    }
  };

  addFrom(pool.filter((country) => country.difficulty === correct.difficulty));
  addFrom(pool.filter((country) => country.continent === correct.continent));
  addFrom(COUNTRIES);

  return distractors.slice(0, OPTIONS_PER_QUESTION - 1);
}

function resolveDirection(direction: CapitalDirection | 'mixed'): CapitalDirection {
  if (direction === 'mixed') return Math.random() < 0.5 ? 'country-to-capital' : 'capital-to-country';
  return direction;
}

export function buildCapitalQuestion(
  correct: Country,
  pool: Country[],
  direction: CapitalDirection | 'mixed',
): Question {
  const distractors = buildCapitalDistractors(correct, pool);
  const options = shuffle([correct, ...distractors]);
  return { correct, options, direction: resolveDirection(direction) };
}

export function buildCapitalQuestionSet(
  pool: Country[],
  questionCount: number,
  direction: CapitalDirection | 'mixed',
): Question[] {
  const usedCodes = new Set<string>();
  const available = shuffle(pool);
  const questions: Question[] = [];

  for (const country of available) {
    if (questions.length >= questionCount) break;
    if (usedCodes.has(country.code)) continue;
    usedCodes.add(country.code);
    questions.push(
      buildCapitalQuestion(country, pool.length >= OPTIONS_PER_QUESTION ? pool : COUNTRIES, direction),
    );
  }

  return questions;
}
