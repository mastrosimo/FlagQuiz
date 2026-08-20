import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useProfileStore } from '../store/profileStore';
import { CONTINENT_LABELS, CONTINENTS } from '../data/countries';
import { getLevelForXp } from '../data/levels';
import { Card } from '../components/common/Card';
import { LevelProgressBar } from '../components/common/LevelProgressBar';
import type { Continent } from '../types';

export function StatsPage() {
  const stats = useProfileStore((state) => state.stats);
  const xp = useProfileStore((state) => state.xp);
  const level = getLevelForXp(xp);

  const accuracy = stats.questionsAnswered
    ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
    : 0;

  const continentBreakdown = CONTINENTS.map((continent) => {
    const entry = stats.continentStats[continent];
    return {
      continent,
      correct: entry.correct,
      total: entry.total,
      accuracy: entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0,
    };
  });

  const cards = [
    { label: 'Partite giocate', value: stats.gamesPlayed },
    { label: 'Domande risposte', value: stats.questionsAnswered },
    { label: 'Risposte corrette', value: stats.correctAnswers },
    { label: 'Precisione', value: `${accuracy}%` },
    { label: 'Miglior punteggio', value: stats.bestScore },
    { label: 'Miglior serie', value: stats.bestStreak },
    { label: 'Bandiere riconosciute', value: stats.flagsRecognized },
    { label: 'XP totali', value: xp },
    { label: 'Livello', value: `${level.level} · ${level.name}` },
  ];

  const chartData = stats.recentSessions.map((session, index) => ({
    name: `#${index + 1}`,
    Precisione: session.accuracy,
    Punteggio: session.score,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Statistiche</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-4 text-center">
            <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4 p-5">
        <LevelProgressBar xp={xp} />
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-slate-900 dark:text-white">
          Precisione per continente
        </h2>
        <div className="space-y-3">
          {continentBreakdown.map((entry) => (
            <div key={entry.continent}>
              <div className="mb-1 flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
                <span>{CONTINENT_LABELS[entry.continent as Continent]}</span>
                <span className="text-slate-400">
                  {entry.total > 0 ? `${entry.accuracy}% · ${entry.correct}/${entry.total}` : 'Nessun dato'}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${entry.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-slate-900 dark:text-white">
          Andamento ultime partite
        </h2>
        {chartData.length === 0 ? (
          <p className="py-10 text-center text-slate-400">
            Gioca la tua prima partita per vedere i progressi qui.
          </p>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Line type="monotone" dataKey="Precisione" stroke="#4f46e5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Punteggio" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
