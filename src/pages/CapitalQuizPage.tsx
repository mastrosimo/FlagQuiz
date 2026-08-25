import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { QuizConfig, QuizMode, QuizSessionResult } from '../types';
import { QuizSetupPage } from './QuizSetupPage';
import { QuizPlayPage } from './QuizPlayPage';

interface CapitalQuizNavState {
  presetMode?: QuizMode;
  presetConfig?: QuizConfig;
}

/**
 * Orchestratore del Quiz Capitali. Deliberatamente separato da `QuizPage`
 * (che gestisce il Flag Quiz): quest'ultimo, a fine partita, chiama insieme
 * `recordSession`, `addRecognized`, `recordCorrectAnswers`, `applyGameResult`
 * e `checkAchievements` — cioè proprio i sistemi (statistiche bandiere,
 * collezione, maestria, missioni, achievement) che per questa prima versione
 * delle Capitali non devono essere toccati. Qui `handleFinish` si limita a
 * passare il risultato alla pagina risultati: l'XP mostrato viene calcolato
 * da `computeSessionXp` (funzione pura, la stessa del Flag Quiz) solo per la
 * visualizzazione, senza alcuna scrittura su `profileStore` o altri store.
 */
export function CapitalQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as CapitalQuizNavState | null;
  const [config, setConfig] = useState<QuizConfig | null>(navState?.presetConfig ?? null);

  const handleFinish = (result: QuizSessionResult) => {
    navigate('/results', { state: { result, config } });
  };

  if (!config) {
    return <QuizSetupPage quizType="capital" presetMode={navState?.presetMode} onStart={setConfig} />;
  }

  return <QuizPlayPage config={config} onFinish={handleFinish} />;
}
