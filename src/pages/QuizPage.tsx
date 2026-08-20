import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { QuizConfig, QuizMode, QuizSessionResult } from '../types';
import { useProfileStore } from '../store/profileStore';
import { QuizSetupPage } from './QuizSetupPage';
import { QuizPlayPage } from './QuizPlayPage';

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

  const handleFinish = (result: QuizSessionResult) => {
    recordSession(result);
    navigate('/results', { state: { result, config } });
  };

  if (!config) {
    return <QuizSetupPage presetMode={navState?.presetMode} onStart={setConfig} />;
  }

  return <QuizPlayPage config={config} onFinish={handleFinish} />;
}
