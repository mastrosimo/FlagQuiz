import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useProfileStore } from '../store/profileStore';
import { CONTINENTS } from '../data/countries';
import { getLevelForXp } from '../data/levels';
import { Card } from '../components/common/Card';
import { LevelProgressBar } from '../components/common/LevelProgressBar';
import { CollectionProgress } from '../components/collection/CollectionProgress';
import { MasteryOverview } from '../components/mastery/MasteryOverview';
import { useCollectionStore } from '../store/collectionStore';
import { useMasteryStore } from '../store/masteryStore';
import { getCollectionSummary } from '../utils/collection';
import { getMasterySummary, MASTERY_LEVEL_META } from '../utils/mastery';
import { useTranslation } from '../i18n/useTranslation';

export function StatsPage() {
  const stats = useProfileStore((state) => state.stats);
  const xp = useProfileStore((state) => state.xp);
  const recognizedCodes = useCollectionStore((state) => state.recognizedCodes);
  const masteryCounts = useMasteryStore((state) => state.counts);
  const { t } = useTranslation();
  const level = getLevelForXp(xp);
  const collection = getCollectionSummary(recognizedCodes);
  const mastery = getMasterySummary(masteryCounts);

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
    { label: t('stats.gamesPlayed'), value: stats.gamesPlayed },
    { label: t('stats.questionsAnswered'), value: stats.questionsAnswered },
    { label: t('stats.correctAnswers'), value: stats.correctAnswers },
    { label: t('stats.accuracy'), value: `${accuracy}%` },
    { label: t('stats.bestScore'), value: stats.bestScore },
    { label: t('stats.bestStreak'), value: stats.bestStreak },
    { label: t('stats.flagsRecognized'), value: `${collection.recognized} / ${collection.total}` },
    { label: t('stats.totalXp'), value: xp },
    { label: t('stats.level'), value: `${level.level} · ${t(level.nameKey)}` },
  ];

  const chartData = stats.recentSessions.map((session, index) => ({
    name: `#${index + 1}`,
    [t('stats.chartAccuracy')]: session.accuracy,
    [t('stats.chartScore')]: session.score,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{t('stats.title')}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-4 text-center">
            <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card className="p-5">
          <LevelProgressBar xp={xp} />
        </Card>
        <Card className="p-5">
          <CollectionProgress recognized={collection.recognized} total={collection.total} compact />
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
          <span aria-hidden="true">🧠</span> {t('mastery.sectionTitle')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(['discovered', 'known', 'expert', 'master'] as const).map((tier) => (
            <div key={tier} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
              <div className="text-xl" aria-hidden="true">{MASTERY_LEVEL_META[tier].icon}</div>
              <p className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">{mastery[tier]}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(MASTERY_LEVEL_META[tier].labelKey)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span>{t('mastery.totalWithAnswers')}</span>
            <span className="font-semibold text-slate-900 dark:text-white">{mastery.withAnswers} / {mastery.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{t('mastery.masteredFlags')}</span>
            <span className="font-semibold text-slate-900 dark:text-white">{mastery.master} / {mastery.total}</span>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">{t('mastery.globalTitle')}</p>
          <MasteryOverview masteredCount={mastery.master} total={mastery.total} compact />
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-slate-900 dark:text-white">
          {t('stats.continentAccuracyHeading')}
        </h2>
        <div className="space-y-3">
          {continentBreakdown.map((entry) => (
            <div key={entry.continent}>
              <div className="mb-1 flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
                <span>{t(`continents.${entry.continent}`)}</span>
                <span className="text-slate-400">
                  {entry.total > 0 ? `${entry.accuracy}% · ${entry.correct}/${entry.total}` : t('stats.noData')}
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
          {t('stats.recentGamesHeading')}
        </h2>
        {chartData.length === 0 ? (
          <p className="py-10 text-center text-slate-400">{t('stats.emptyChart')}</p>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Line type="monotone" dataKey={t('stats.chartAccuracy')} stroke="#4f46e5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey={t('stats.chartScore')} stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
