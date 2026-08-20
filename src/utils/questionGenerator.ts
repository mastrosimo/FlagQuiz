import type { Country, Question } from '../types';
import { COUNTRIES, COUNTRY_BY_CODE } from '../data/countries';
import { seededShuffle, shuffle } from './shuffle';

const OPTIONS_PER_QUESTION = 4;

function buildDistractors(correct: Country, pool: Country[]): Country[] {
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

  if (correct.similar?.length) {
    const similarCountries = correct.similar
      .map((code) => COUNTRY_BY_CODE[code])
      .filter((country): country is Country => Boolean(country));
    addFrom(similarCountries);
  }

  addFrom(pool.filter((country) => country.continent === correct.continent));
  addFrom(pool.filter((country) => country.difficulty === correct.difficulty));
  addFrom(COUNTRIES);

  return distractors.slice(0, OPTIONS_PER_QUESTION - 1);
}

export function buildQuestion(correct: Country, pool: Country[]): Question {
  const distractors = buildDistractors(correct, pool);
  const options = shuffle([correct, ...distractors]);
  return { correct, options };
}

export function getFilteredPool(
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
  continent?: Country['continent'],
): Country[] {
  let pool = COUNTRIES;
  if (continent) pool = pool.filter((country) => country.continent === continent);
  if (difficulty !== 'mixed') pool = pool.filter((country) => country.difficulty === difficulty);
  return pool;
}

export function buildQuestionSet(
  pool: Country[],
  questionCount: number,
): Question[] {
  const usedCodes = new Set<string>();
  const available = shuffle(pool);
  const questions: Question[] = [];

  for (const country of available) {
    if (questions.length >= questionCount) break;
    if (usedCodes.has(country.code)) continue;
    usedCodes.add(country.code);
    questions.push(buildQuestion(country, pool.length >= OPTIONS_PER_QUESTION ? pool : COUNTRIES));
  }

  return questions;
}

export function buildDailyChallenge(dateKey: string, count = 10): Question[] {
  const dailyPool = seededShuffle(COUNTRIES, dateKey).slice(0, count);
  return dailyPool.map((country) => buildQuestion(country, COUNTRIES));
}

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
