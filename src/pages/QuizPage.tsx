import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { QuizConfig, QuizMode, QuizSessionResult } from '../types';
import { useProfileStore } from '../store/profileStore';
import { buildDailyChallengeConfig } from '../data/modes';
import { getTodayKey } from '../utils/questionGenerator';
import { QuizSetupPage } from './QuizSetupPage';
import { QuizPlayPage } from './QuizPlayPage';
import { DailyChallengeDonePage } from './DailyChallengeDonePage';
import { Button } from '../components/common/Button';

interface QuizNavState {
  presetMode?: QuizMode;
  presetConfig?: QuizConfig;
}

export function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as QuizNavState | null;
  const [config, setConfig] = useState<QuizConfig | null>(navState?.presetConfig ?? null);
  const recordSession = useProfileStore((state) => state.recordSession);
  const completeDailyChallenge = useProfileStore((state) => state.completeDailyChallenge);
  const dailyChallenge = useProfileStore((state) => state.dailyChallenge);

  const handleFinish = (result: QuizSessionResult) => {
    recordSession(result);
    if (result.mode === 'daily') {
      completeDailyChallenge({
        score: result.score,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
      });
    }
    navigate('/results', { state: { result, config } });
  };

  if (navState?.presetMode === 'daily') {
    const alreadyDone = dailyChallenge.completed && dailyChallenge.date === getTodayKey();
    if (alreadyDone) {
      return (
        <DailyChallengeDonePage
          result={dailyChallenge.result}
          onBackHome={() => navigate('/')}
        />
      );
    }
    if (!config) {
      return (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-16 text-center">
          <span className="text-5xl" aria-hidden="true">🌍</span>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
            Sfida del giorno
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            10 bandiere, uguali per tutti oggi. Una sola possibilità: gioca con attenzione!
          </p>
          <Button size="lg" onClick={() => setConfig(buildDailyChallengeConfig())}>
            INIZIA LA SFIDA
          </Button>
        </div>
      );
    }
    return <QuizPlayPage config={config} onFinish={handleFinish} />;
  }

  if (!config) {
    return <QuizSetupPage presetMode={navState?.presetMode} onStart={setConfig} />;
  }

  return <QuizPlayPage config={config} onFinish={handleFinish} />;
}
