import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MODES } from '../data/modes';
import { useProfileStore } from '../store/profileStore';
import { getLevelForXp } from '../data/levels';
import { getTodayKey } from '../utils/questionGenerator';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { LevelProgressBar } from '../components/common/LevelProgressBar';
import { CollectionProgress } from '../components/collection/CollectionProgress';
import { MasteryOverview } from '../components/mastery/MasteryOverview';
import { MissionsPreview } from '../components/missions/MissionsPreview';
import { useCollectionStore } from '../store/collectionStore';
import { useMasteryStore } from '../store/masteryStore';
import { getCollectionSummary } from '../utils/collection';
import { getMasteredCount } from '../utils/mastery';
import { useTranslation } from '../i18n/useTranslation';

export function HomePage() {
  const navigate = useNavigate();
  const stats = useProfileStore((state) => state.stats);
  const xp = useProfileStore((state) => state.xp);
  const dailyStreak = useProfileStore((state) => state.dailyStreak);
  const dailyChallenge = useProfileStore((state) => state.dailyChallenge);
  const recognizedCodes = useCollectionStore((state) => state.recognizedCodes);
  const masteryCounts = useMasteryStore((state) => state.counts);
  const { t } = useTranslation();
  const level = getLevelForXp(xp);
  const isNew = stats.gamesPlayed === 0;
  const collection = getCollectionSummary(recognizedCodes);
  const masteredCount = getMasteredCount(masteryCounts);
  const dailyDoneToday = dailyChallenge.completed && dailyChallenge.date === getTodayKey();

  const statCards = [
    { label: t('home.statBestScore'), value: stats.bestScore, icon: '🏆' },
    { label: t('home.statBestStreak'), value: stats.bestStreak, icon: '🔥' },
    { label: t('home.statLevel'), value: `${level.level} · ${t(level.nameKey)}`, icon: '⭐' },
    { label: t('home.statXp'), value: xp, icon: '✨' },
    { label: t('home.statGames'), value: stats.gamesPlayed, icon: '🎮' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <section className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white"
        >
          <span aria-hidden="true">🚩</span> FLAGQUIZ
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-3 max-w-xl text-lg text-slate-500 dark:text-slate-400"
        >
          {t('home.subtitle')}
        </motion.p>

        {dailyStreak.current > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-accent-500/15 px-4 py-1.5 font-display text-sm font-bold text-accent-500"
          >
            {t(dailyStreak.current === 1 ? 'home.streakOne' : 'home.streakOther', { count: dailyStreak.current })}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
          className="mt-8"
        >
          <Button size="lg" onClick={() => navigate('/quiz')} className="px-12 text-xl">
            {t('home.startButton')}
          </Button>
        </motion.div>
      </section>

      <section className="mt-12">
        <motion.button
          type="button"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/quiz', { state: { presetMode: 'daily' } })}
          className="mx-auto flex w-full max-w-2xl items-center gap-4 rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-left text-white shadow-lg shadow-brand-600/25"
        >
          <span className="text-4xl" aria-hidden="true">🌍</span>
          <span className="flex-1">
            <span className="block font-display text-lg font-extrabold">{t('home.dailyChallengeTitle')}</span>
            <span className="block text-sm text-brand-50/90">
              {dailyDoneToday ? t('home.dailyChallengeDone') : t('home.dailyChallengeDescription')}
            </span>
          </span>
          {dailyDoneToday && <span className="text-2xl" aria-hidden="true">✅</span>}
        </motion.button>
      </section>

      <section className="mt-4">
        <MissionsPreview />
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-center font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          {t('home.modesHeading')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((mode) => (
            <motion.button
              key={mode.id}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/quiz', { state: { presetMode: mode.id } })}
              className="flex flex-col items-start gap-2 rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
            >
              <span className="text-3xl" aria-hidden="true">{mode.icon}</span>
              <span className="font-display font-bold text-slate-900 dark:text-white">{t(mode.labelKey)}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{t(mode.descriptionKey)}</span>
            </motion.button>
          ))}
          <motion.button
            type="button"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/capitals')}
            className="flex flex-col items-start gap-2 rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
          >
            <span className="text-3xl" aria-hidden="true">🏛️</span>
            <span className="font-display font-bold text-slate-900 dark:text-white">{t('capitals.home.title')}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{t('capitals.home.description')}</span>
          </motion.button>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-center font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          {t('home.statsHeading')}
        </h2>
        {isNew ? (
          <Card className="mx-auto max-w-md p-6 text-center">
            <p className="text-3xl" aria-hidden="true">👋</p>
            <p className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">
              {t('home.newUserTitle')}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('home.newUserDescription')}</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {statCards.map((stat) => (
                <Card key={stat.label} className="p-4 text-center">
                  <div className="text-2xl" aria-hidden="true">{stat.icon}</div>
                  <p className="mt-1 font-display text-xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                </Card>
              ))}
            </div>
            <div className="mx-auto mt-4 grid max-w-4xl gap-3 sm:grid-cols-3">
              <Card className="p-5">
                <LevelProgressBar xp={xp} />
              </Card>
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/learn')}
                className="rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
              >
                <CollectionProgress recognized={collection.recognized} total={collection.total} />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/learn')}
                className="rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
              >
                <MasteryOverview masteredCount={masteredCount} total={collection.total} />
              </motion.button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
