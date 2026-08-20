import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MODES } from '../data/modes';
import { useProfileStore } from '../store/profileStore';
import { getLevelForXp } from '../data/levels';
import { getTodayKey } from '../utils/questionGenerator';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { LevelProgressBar } from '../components/common/LevelProgressBar';

export function HomePage() {
  const navigate = useNavigate();
  const stats = useProfileStore((state) => state.stats);
  const xp = useProfileStore((state) => state.xp);
  const dailyStreak = useProfileStore((state) => state.dailyStreak);
  const dailyChallenge = useProfileStore((state) => state.dailyChallenge);
  const level = getLevelForXp(xp);
  const isNew = stats.gamesPlayed === 0;
  const dailyDoneToday = dailyChallenge.completed && dailyChallenge.date === getTodayKey();

  const statCards = [
    { label: 'Record personale', value: stats.bestScore, icon: '🏆' },
    { label: 'Miglior serie', value: stats.bestStreak, icon: '🔥' },
    { label: 'Livello', value: `${level.level} · ${level.name}`, icon: '⭐' },
    { label: 'XP totali', value: xp, icon: '✨' },
    { label: 'Partite giocate', value: stats.gamesPlayed, icon: '🎮' },
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
          Quanto conosci le bandiere del mondo?
        </motion.p>

        {dailyStreak.current > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-accent-500/15 px-4 py-1.5 font-display text-sm font-bold text-accent-500"
          >
            🔥 STREAK {dailyStreak.current} {dailyStreak.current === 1 ? 'GIORNO' : 'GIORNI'}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
          className="mt-8"
        >
          <Button size="lg" onClick={() => navigate('/quiz')} className="px-12 text-xl">
            INIZIA A GIOCARE
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
            <span className="block font-display text-lg font-extrabold">Sfida del giorno</span>
            <span className="block text-sm text-brand-50/90">
              {dailyDoneToday ? 'Completata — torna domani per una nuova sfida' : '10 bandiere, uguali per tutti oggi. Una sola possibilità.'}
            </span>
          </span>
          {dailyDoneToday && <span className="text-2xl" aria-hidden="true">✅</span>}
        </motion.button>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-center font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          Modalità di gioco
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
              <span className="font-display font-bold text-slate-900 dark:text-white">{mode.label}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{mode.description}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-center font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          Le tue statistiche
        </h2>
        {isNew ? (
          <Card className="mx-auto max-w-md p-6 text-center">
            <p className="text-3xl" aria-hidden="true">👋</p>
            <p className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">
              Non hai ancora giocato
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Inizia la tua prima partita per iniziare a costruire le tue statistiche e sbloccare obiettivi.
            </p>
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
            <Card className="mx-auto mt-4 max-w-md p-5">
              <LevelProgressBar xp={xp} />
            </Card>
          </>
        )}
      </section>
    </div>
  );
}
