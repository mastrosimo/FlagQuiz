import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MODES } from '../data/modes';
import { useProfileStore } from '../store/profileStore';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export function HomePage() {
  const navigate = useNavigate();
  const stats = useProfileStore((state) => state.stats);

  const accuracy = stats.questionsAnswered
    ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
    : 0;

  const statCards = [
    { label: 'Partite giocate', value: stats.gamesPlayed, icon: '🎮' },
    { label: 'Risposte corrette', value: stats.correctAnswers, icon: '✅' },
    { label: 'Precisione', value: `${accuracy}%`, icon: '🎯' },
    { label: 'Miglior punteggio', value: stats.bestScore, icon: '🏆' },
    { label: 'Miglior serie', value: stats.bestStreak, icon: '🔥' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <section className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white"
        >
          <span aria-hidden="true">🚩</span> FlagQuiz
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-3 max-w-xl text-lg text-slate-500 dark:text-slate-400"
        >
          Quanto conosci le bandiere del mondo?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
          className="mt-8"
        >
          <Button size="lg" onClick={() => navigate('/quiz')} className="px-12 text-xl">
            INIZIA QUIZ
          </Button>
        </motion.div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-center font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          Modalità disponibili
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.filter((mode) => mode.id !== 'lives').map((mode) => (
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <div className="text-2xl" aria-hidden="true">{stat.icon}</div>
              <p className="mt-1 font-display text-xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
