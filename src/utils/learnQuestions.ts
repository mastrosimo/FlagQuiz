import type { Country } from '../types';
import { COUNTRIES, CONTINENTS } from '../data/countries';
import { buildQuestion } from './questionGenerator';
import { shuffle } from './shuffle';

export type LearnQuestionType = 'capital' | 'continent' | 'flag' | 'description';

export interface LearnQuestionOption {
  /** Codice Paese per capital/flag/description, id Continente per continent. */
  key: string;
  correct: boolean;
}

export interface LearnQuestion {
  type: LearnQuestionType;
  options: LearnQuestionOption[];
}

function toCountryOptions(country: Country): LearnQuestionOption[] {
  const question = buildQuestion(country, COUNTRIES);
  return shuffle(
    question.options.map((option) => ({ key: option.code, correct: option.code === country.code })),
  );
}

function buildContinentOptions(country: Country): LearnQuestionOption[] {
  const wrong = shuffle(CONTINENTS.filter((continent) => continent !== country.continent)).slice(0, 3);
  return shuffle(
    [country.continent, ...wrong].map((continent) => ({
      key: continent,
      correct: continent === country.continent,
    })),
  );
}

function buildDescriptionOptions(country: Country): LearnQuestionOption[] {
  const distractors = shuffle(COUNTRIES.filter((candidate) => candidate.code !== country.code)).slice(0, 3);
  return shuffle(
    [country, ...distractors].map((candidate) => ({
      key: candidate.code,
      correct: candidate.code === country.code,
    })),
  );
}

/** Le 4 mini-domande didattiche per un Paese: capitale, continente, bandiera, descrizione della bandiera. */
export function buildCountryLearnQuiz(country: Country): LearnQuestion[] {
  return [
    { type: 'capital', options: toCountryOptions(country) },
    { type: 'continent', options: buildContinentOptions(country) },
    { type: 'flag', options: toCountryOptions(country) },
    { type: 'description', options: buildDescriptionOptions(country) },
  ];
}
