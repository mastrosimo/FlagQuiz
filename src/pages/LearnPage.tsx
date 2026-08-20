import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Continent, Country, Difficulty } from '../types';
import { COUNTRIES, CONTINENTS, CONTINENT_LABELS } from '../data/countries';
import { FlagImage } from '../components/quiz/FlagImage';
import { Modal } from '../components/common/Modal';

const DIFFICULTY_LABELS: Record<Country['difficulty'], string> = {
  easy: 'Facile',
  medium: 'Media',
  hard: 'Difficile',
};

const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard'];

export function LearnPage() {
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState<Continent | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);
  const [selected, setSelected] = useState<Country | null>(null);

  const filtered = useMemo(() => {
    return COUNTRIES.filter((country) => {
      const matchesQuery = country.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesContinent = !continent || country.continent === continent;
      const matchesDifficulty = !difficulty || country.difficulty === difficulty;
      return matchesQuery && matchesContinent && matchesDifficulty;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, continent, difficulty]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Impara le bandiere</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Esplora, cerca e scopri tutte le bandiere del database.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cerca un Paese…"
          aria-label="Cerca un Paese"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none sm:max-w-xs dark:border-slate-700 dark:bg-slate-800"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setContinent(undefined)}
            aria-pressed={continent === undefined}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              continent === undefined
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Tutti
          </button>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setContinent(c)}
              aria-pressed={continent === c}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                continent === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {CONTINENT_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDifficulty(undefined)}
          aria-pressed={difficulty === undefined}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            difficulty === undefined
              ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Tutte le difficoltà
        </button>
        {DIFFICULTY_OPTIONS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            aria-pressed={difficulty === d}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              difficulty === d
                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs font-medium text-slate-400">{filtered.length} bandiere</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((country) => (
          <motion.button
            key={country.code}
            type="button"
            layout
            whileHover={{ y: -3 }}
            onClick={() => setSelected(country)}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          >
            <FlagImage code={country.code} name={country.name} className="aspect-[3/2] w-full rounded-lg object-cover" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{country.name}</span>
          </motion.button>
        ))}
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <div className="text-center">
            <FlagImage
              code={selected.code}
              name={selected.name}
              className="mx-auto aspect-[3/2] w-48 rounded-xl object-cover shadow-md"
            />
            <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">{selected.name}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-left text-sm">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Continente</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{CONTINENT_LABELS[selected.continent]}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Capitale</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{selected.capital}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Codice ISO</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{selected.code}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Difficoltà</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{DIFFICULTY_LABELS[selected.difficulty]}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
