import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { QuizConfig, QuizMode, QuizSessionResult } from '../types';
import { useProfileStore } from '../store/profileStore';
import { useCollectionStore } from '../store/collectionStore';
import { useMasteryStore } from '../store/masteryStore';
import { useMissionStore } from '../store/missionStore';
import { getMasteredCount } from '../utils/mastery';
import { buildDailyChallengeConfig } from '../data/modes';
import { getTodayKey } from '../utils/questionGenerator';
import { QuizSetupPage } from './QuizSetupPage';
import { QuizPlayPage } from './QuizPlayPage';
import { DailyChallengeDonePage } from './DailyChallengeDonePage';
import { Button } from '../components/common/Button';
import { useTranslation } from '../i18n/useTranslation';

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
  const checkAchievements = useProfileStore((state) => state.checkAchievements);
  const completeDailyChallenge = useProfileStore((state) => state.completeDailyChallenge);
  const dailyChallenge = useProfileStore((state) => state.dailyChallenge);
  const addRecognized = useCollectionStore((state) => state.addRecognized);
  const { t } = useTranslation();

  const handleFinish = (result: QuizSessionResult) => {
    recordSession(result);
    const recognizedCodes = result.answered
      .filter((answered) => answered.correct)
      .map((answered) => answered.question.correct.code);
    const alreadyRecognized = new Set(useCollectionStore.getState().recognizedCodes);
    const newlyRecognizedCodes = recognizedCodes.filter((code) => !alreadyRecognized.has(code));
    const collectionCount = addRecognized(recognizedCodes);
    useMasteryStore.getState().recordCorrectAnswers(recognizedCodes);
    const masteryLevelUpCount = useMasteryStore.getState().lastLevelUps.length;
    const masteredCount = getMasteredCount(useMasteryStore.getState().counts);
    useMissionStore.getState().applyGameResult({
      result,
      newlyRecognizedCodes,
      masteryLevelUpCount,
    });
    const missionsCompletedCount = useMissionStore.getState().totalCompleted;
    checkAchievements(collectionCount, masteredCount, missionsCompletedCount);
    if (result.mode === 'daily') {
      completeDailyChallenge({
        score: result.score,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
      });
    }
    navigate('/results', { state: { result, config } });
  };

  const isDaily = navState?.presetMode === 'daily' || config?.mode === 'daily';

  if (isDaily) {
    // Il gate deve valere per qualunque percorso porti a una config 'daily'
    // (non solo arrivando dalla card Home con presetMode), incluso "Rigioca"
    // sulla pagina risultati che passa un presetConfig già risolto: altrimenti
    // si potrebbe ripetere la sfida più volte lo stesso giorno sovrascrivendo
    // il risultato salvato.
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
            {t('dailyChallenge.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{t('dailyChallenge.intro')}</p>
          <Button size="lg" onClick={() => setConfig(buildDailyChallengeConfig())}>
            {t('dailyChallenge.startButton')}
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
