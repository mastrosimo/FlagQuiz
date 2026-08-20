import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useProfileStore } from '../store/profileStore';
import { CONTINENT_LABELS } from '../data/countries';
import { Card } from '../components/common/Card';
import type { Continent } from '../types';

export function StatsPage() {
  const stats = useProfileStore((state) => state.stats);

  const accuracy = stats.questionsAnswered
    ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
    : 0;

  const continentEntries = (Object.entries(stats.continentStats) as [Continent, { correct: number; total: number }][])
    .filter(([, value]) => value.total > 0)
    .map(([continent, value]) => ({
      continent,
      accuracy: Math.round((value.correct / value.total) * 100),
    }));

  const best = continentEntries.length
    ? continentEntries.reduce((a, b) => (b.accuracy > a.accuracy ? b : a))
    : null;
  const worst = continentEntries.length
    ? continentEntries.reduce((a, b) => (b.accuracy < a.accuracy ? b : a))
    : null;

  const cards = [
    { label: 'Partite giocate', value: stats.gamesPlayed },
    { label: 'Domande risposte', value: stats.questionsAnswered },
    { label: 'Risposte corrette', value: stats.correctAnswers },
    { label: 'Risposte sbagliate', value: stats.wrongAnswers },
    { label: 'Precisione', value: `${accuracy}%` },
    { label: 'Miglior serie', value: stats.bestStreak },
    { label: 'Miglior punteggio', value: stats.bestScore },
    { label: 'Bandiere riconosciute', value: stats.flagsRecognized },
    { label: 'Continente migliore', value: best ? CONTINENT_LABELS[best.continent] : '—' },
    { label: 'Continente peggiore', value: worst ? CONTINENT_LABELS[worst.continent] : '—' },
  ];

  const chartData = stats.recentSessions.map((session, index) => ({
    name: `#${index + 1}`,
    Precisione: session.accuracy,
    Punteggio: session.score,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Statistiche</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.label} className="p-4 text-center">
            <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-5">
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
