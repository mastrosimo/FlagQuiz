import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { QuizConfig, QuizSessionResult } from '../types';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { useSound } from '../hooks/useSound';
import { FlagCard } from '../components/quiz/FlagCard';
import { AnswerButton, type AnswerButtonStatus } from '../components/quiz/AnswerButton';
import { ProgressBar } from '../components/quiz/ProgressBar';
import { ScoreBar } from '../components/quiz/ScoreBar';
import { Timer } from '../components/quiz/Timer';
import { LivesIndicator } from '../components/quiz/LivesIndicator';
import { AnswerFeedback } from '../components/feedback/AnswerFeedback';

const LETTERS = ['A', 'B', 'C', 'D'];
const NEXT_DELAY_MS = 1600;

interface QuizPlayPageProps {
  config: QuizConfig;
  onFinish: (result: QuizSessionResult) => void;
}

export function QuizPlayPage({ config, onFinish }: QuizPlayPageProps) {
  const { state, currentQuestion, questionNumber, totalQuestions, answer, next, result } =
    useQuizEngine(config);
  const { playCorrect, playWrong, playComplete } = useSound();
  const finishedRef = useRef(false);

  useEffect(() => {
    if (state.status !== 'feedback') return;
    const timeout = setTimeout(next, NEXT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [state.status, state.currentIndex, next]);

  useEffect(() => {
    if (state.status !== 'feedback') return;
    if (state.lastCorrect) playCorrect();
    else playWrong();
  }, [state.selectedCode]);

  useEffect(() => {
    if (result && !finishedRef.current) {
      finishedRef.current = true;
      playComplete();
      onFinish(result);
    }
  }, [result]);

  if (!currentQuestion || result) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
        Preparazione del quiz…
      </div>
    );
  }

  const getStatus = (code: string): AnswerButtonStatus => {
    if (state.status !== 'feedback') return 'idle';
    const isCorrectOption = code === currentQuestion.correct.code;
    const isSelected = code === state.selectedCode;
    if (isSelected && isCorrectOption) return 'selected-correct';
    if (isSelected && !isCorrectOption) return 'selected-wrong';
    if (isCorrectOption) return 'correct-unselected';
    return 'muted';
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <ProgressBar current={questionNumber} total={totalQuestions} />
        <div className="flex items-center gap-2">
          {config.timeLimit != null && state.timeRemaining != null && (
            <Timer secondsRemaining={state.timeRemaining} />
          )}
          {config.lives != null && state.lives != null && (
            <LivesIndicator lives={state.lives} maxLives={config.lives} />
          )}
        </div>
      </div>

      <ScoreBar score={state.score} streak={state.streak} bestStreak={state.bestStreak} />

      <p className="mt-8 text-center text-lg font-semibold text-slate-700 dark:text-slate-200">
        Quale Paese rappresenta questa bandiera?
      </p>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          <FlagCard
            key={currentQuestion.correct.code}
            questionKey={currentQuestion.correct.code}
            code={currentQuestion.correct.code}
            name={currentQuestion.correct.name}
          />
        </AnimatePresence>
      </div>

      <div className="mt-6 min-h-[52px]">
        <AnswerFeedback
          visible={state.status === 'feedback'}
          correct={Boolean(state.lastCorrect)}
          correctName={currentQuestion.correct.name}
          pointsEarned={state.answered[state.answered.length - 1]?.pointsEarned ?? 0}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {currentQuestion.options.map((option, index) => (
          <AnswerButton
            key={option.code}
            letter={LETTERS[index]}
            label={option.name}
            status={getStatus(option.code)}
            disabled={state.status !== 'answering'}
            onClick={() => answer(option.code)}
          />
        ))}
      </div>
    </div>
  );
}
