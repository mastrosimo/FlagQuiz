import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { QuizConfig, QuizSessionResult } from '../types';
import { ResultSummaryCard } from '../components/feedback/ResultSummaryCard';
import { Button } from '../components/common/Button';

interface ResultsNavState {
  result?: QuizSessionResult;
  config?: QuizConfig;
}

export function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, config } = (location.state as ResultsNavState | null) ?? {};

  useEffect(() => {
    if (!result) navigate('/quiz', { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <ResultSummaryCard result={result} />
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          size="lg"
          onClick={() => navigate('/quiz', { state: { presetConfig: config } })}
        >
          RIGIOCA
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate('/')}>
          TORNA ALLA HOME
        </Button>
      </div>
    </div>
  );
}
