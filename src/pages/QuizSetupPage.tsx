import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Continent, Difficulty, QuizConfig, QuizMode } from '../types';
import { MODES, QUESTION_COUNT_OPTIONS, buildQuizConfig } from '../data/modes';
import { CONTINENTS, CONTINENT_LABELS } from '../data/countries';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

interface QuizSetupPageProps {
  presetMode?: QuizMode;
  onStart: (config: QuizConfig) => void;
}

const DIFFICULTY_OPTIONS: { id: Difficulty | 'mixed'; label: string }[] = [
  { id: 'mixed', label: 'Mista' },
  { id: 'easy', label: 'Facile' },
  { id: 'medium', label: 'Media' },
  { id: 'hard', label: 'Difficile' },
];

export function QuizSetupPage({ presetMode, onStart }: QuizSetupPageProps) {
  const [mode, setMode] = useState<QuizMode>(presetMode ?? 'classic');
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>('mixed');
  const [continent, setContinent] = useState<Continent | undefined>(undefined);
  const [questionCount, setQuestionCount] = useState(20);

  const activeMode = useMemo(() => MODES.find((m) => m.id === mode)!, [mode]);

  const handleStart = () => {
    const config = buildQuizConfig({ mode, difficulty, continent, questionCount });
    onStart(config);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
        Configura la tua partita
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Scegli modalità, difficoltà e numero di domande, poi premi Inizia.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          1. Modalità
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MODES.map((modeInfo) => (
            <motion.button
              key={modeInfo.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode(modeInfo.id)}
              aria-pressed={mode === modeInfo.id}
              className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                mode === modeInfo.id
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
                  : 'border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">{modeInfo.icon}</span>
              <span>
                <span className="block font-display font-bold text-slate-900 dark:text-white">{modeInfo.label}</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">{modeInfo.description}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {activeMode.showDifficulty && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            2. Difficoltà
          </h2>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDifficulty(option.id)}
                aria-pressed={difficulty === option.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  difficulty === option.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Continente (opzionale)
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setContinent(undefined)}
            aria-pressed={continent === undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              continent === undefined
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Tutti i continenti
          </button>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setContinent(c)}
              aria-pressed={continent === c}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                continent === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {CONTINENT_LABELS[c]}
            </button>
          ))}
        </div>
      </section>

      {activeMode.showQuestionCount && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            3. Numero di domande
          </h2>
          <div className="flex flex-wrap gap-2">
            {QUESTION_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                aria-pressed={questionCount === count}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  questionCount === count
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </section>
      )}

      <Card className="mt-10 flex flex-col items-center gap-4 p-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pronto? Premi il pulsante per iniziare subito.
        </p>
        <Button size="lg" onClick={handleStart} className="w-full sm:w-auto">
          INIZIA
        </Button>
      </Card>
    </div>
  );
}
