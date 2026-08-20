import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type {
  AnsweredQuestion,
  Question,
  QuizConfig,
  QuizSessionResult,
  QuizStatus,
} from '../types';
import { buildQuestionSet, getFilteredPool } from '../utils/questionGenerator';
import { computeAnswerScore } from '../utils/scoring';

interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  lives: number | null;
  answered: AnsweredQuestion[];
  status: QuizStatus;
  selectedCode: string | null;
  lastCorrect: boolean | null;
  timeRemaining: number | null;
  questionStartedAt: number;
  startedAt: number;
}

type Action =
  | { type: 'ANSWER'; code: string; timeMs: number }
  | { type: 'NEXT' }
  | { type: 'TICK' };

function isSessionOver(state: QuizState): boolean {
  if (state.lives !== null && state.lives <= 0) return true;
  if (state.timeRemaining !== null && state.timeRemaining <= 0) return true;
  return state.currentIndex >= state.questions.length - 1;
}

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'ANSWER': {
      if (state.status !== 'answering') return state;
      const question = state.questions[state.currentIndex];
      const correct = question.correct.code === action.code;
      const streak = correct ? state.streak + 1 : 0;
      const points = computeAnswerScore(correct, action.timeMs, streak);
      const lives = state.lives !== null && !correct ? state.lives - 1 : state.lives;

      const answeredQuestion: AnsweredQuestion = {
        question,
        selectedCode: action.code,
        correct,
        timeMs: action.timeMs,
        pointsEarned: points,
      };

      const nextState: QuizState = {
        ...state,
        status: 'feedback',
        selectedCode: action.code,
        lastCorrect: correct,
        score: state.score + points,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        lives,
        answered: [...state.answered, answeredQuestion],
      };

      return isSessionOver(nextState) ? { ...nextState, status: 'finished' } : nextState;
    }
    case 'NEXT': {
      if (state.status !== 'feedback') return state;
      if (isSessionOver(state)) return { ...state, status: 'finished' };
      return {
        ...state,
        status: 'answering',
        currentIndex: state.currentIndex + 1,
        selectedCode: null,
        lastCorrect: null,
        questionStartedAt: Date.now(),
      };
    }
    case 'TICK': {
      if (state.timeRemaining === null || state.status === 'finished') return state;
      const timeRemaining = state.timeRemaining - 1;
      if (timeRemaining <= 0) {
        return { ...state, timeRemaining: 0, status: 'finished' };
      }
      return { ...state, timeRemaining };
    }
    default:
      return state;
  }
}

function buildInitialState(questions: Question[], config: QuizConfig): QuizState {
  const now = Date.now();
  return {
    questions,
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    lives: config.lives ?? null,
    answered: [],
    status: questions.length > 0 ? 'answering' : 'finished',
    selectedCode: null,
    lastCorrect: null,
    timeRemaining: config.timeLimit ?? null,
    questionStartedAt: now,
    startedAt: now,
  };
}

export function useQuizEngine(config: QuizConfig) {
  const questions = useMemo(() => {
    const pool = getFilteredPool(config.difficulty, config.continent);
    const targetCount =
      config.mode === 'all' || config.mode === 'time' || config.mode === 'lives'
        ? pool.length
        : config.questionCount;
    return buildQuestionSet(pool, targetCount);
  }, []);

  const [state, dispatch] = useReducer(reducer, undefined, () =>
    buildInitialState(questions, config),
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (config.timeLimit == null) return;
    if (state.status === 'finished') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [config.timeLimit, state.status]);

  const answer = useCallback(
    (code: string) => {
      const timeMs = Date.now() - state.questionStartedAt;
      dispatch({ type: 'ANSWER', code, timeMs });
    },
    [state.questionStartedAt],
  );

  const next = useCallback(() => dispatch({ type: 'NEXT' }), []);

  const currentQuestion = state.questions[state.currentIndex] ?? null;

  const result: QuizSessionResult | null =
    state.status === 'finished'
      ? {
          mode: config.mode,
          difficulty: config.difficulty,
          continent: config.continent,
          score: state.score,
          totalQuestions: state.answered.length,
          correctCount: state.answered.filter((entry) => entry.correct).length,
          bestStreak: state.bestStreak,
          durationMs: Date.now() - state.startedAt,
          answered: state.answered,
          completedAt: Date.now(),
        }
      : null;

  return {
    state,
    currentQuestion,
    questionNumber: state.currentIndex + 1,
    totalQuestions: state.questions.length,
    answer,
    next,
    result,
  };
}
