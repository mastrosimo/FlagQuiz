import { FlagCard } from '../quiz/FlagCard';
import { AnswerButton, type AnswerButtonStatus } from '../quiz/AnswerButton';
import { ProgressBar } from '../quiz/ProgressBar';
import { ScoreBar } from '../quiz/ScoreBar';
import { Timer } from '../quiz/Timer';
import { AnswerFeedback } from '../../components/feedback/AnswerFeedback';
import { DuelOpponentStatus } from './DuelOpponentStatus';
import { DuelMockControls } from './DuelMockControls';
import { useDuelSession } from '../../duel/useDuelSession';
import { useRemainingSeconds } from '../../duel/useCountdown';
import { useTranslation } from '../../i18n/useTranslation';
import type { DuelAnswerRecord } from '../../duel/types';

const LETTERS = ['A', 'B', 'C', 'D'];

// Punteggio/streak "in mostra" derivati SOLO dallo storico delle risposte
// gia' rivelate (answers[0..revealedCount-1]), non dai contatori cumulativi
// di stato (local.score/opponent.score, aggiornati da PLAYER_STATS_SYNCED).
// Motivo: quel sync arriva da un canale realtime indipendente dal cambio di
// fase round — se arriva anche solo un attimo dopo che si e' gia' tornati a
// 'playing' per il round successivo, un fix basato su "aggiorna solo fuori
// da playing" lo perderebbe per sempre (verificato: il punteggio reale
// dell'avversario restava disallineato per l'intera partita). Ricalcolare
// dallo storico locale, sempre popolato in ordine corretto da ANSWER_RESULT,
// non ha questo problema: e' una derivazione pura, mai una sincronizzazione.
function deriveRevealedStats(answers: (DuelAnswerRecord | null)[], revealedCount: number) {
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  for (let i = 0; i < revealedCount; i++) {
    const answer = answers[i];
    if (!answer) continue;
    score += answer.points;
    streak = answer.correct ? streak + 1 : 0;
    bestStreak = Math.max(bestStreak, streak);
  }
  return { score, streak, bestStreak };
}

export function DuelPlayView() {
  const { state, submitAnswer, mockControls } = useDuelSession();
  const { t, locale } = useTranslation();

  const currentQuestion = state.questions[state.currentQuestionIndex] ?? null;
  const roundEndsAt =
    state.roundStartedAt != null ? state.roundStartedAt + state.match.timeLimitMs : null;
  const secondsRemaining = useRemainingSeconds(roundEndsAt);

  const { local, opponent } = state.players;

  // Durante 'playing' il round corrente non e' ancora rivelato: si conta
  // solo fino al round precedente. In ogni altra fase (transizione, finito)
  // il round corrente e' gia' risolto e va incluso.
  const revealedCount = state.phase === 'playing' ? state.currentQuestionIndex : state.currentQuestionIndex + 1;
  const displayedLocal = deriveRevealedStats(local.answers, revealedCount);
  const displayedOpponent = deriveRevealedStats(opponent.answers, revealedCount);

  if (!currentQuestion) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
        {t('quizPlay.preparing')}
      </div>
    );
  }

  const opponentDisplayName = state.match.botDifficulty
    ? t('duel.bot.opponentName')
    : opponent.name || t('duel.play.opponentScoreLabel');
  const localAnswer = local.answers[state.currentQuestionIndex];
  const opponentAnswer = opponent.answers[state.currentQuestionIndex];
  const showFeedback = state.phase === 'question-transition';

  const getStatus = (code: string): AnswerButtonStatus => {
    const isSelected = code === localAnswer?.code;
    if (!showFeedback) return isSelected ? 'selected-pending' : 'idle';
    const isCorrectOption = code === currentQuestion.correct.code;
    if (isSelected && isCorrectOption) return 'selected-correct';
    if (isSelected && !isCorrectOption) return 'selected-wrong';
    if (isCorrectOption) return 'correct-unselected';
    return 'muted';
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <ProgressBar current={state.currentQuestionIndex + 1} total={state.match.questionCount} />
        <Timer secondsRemaining={secondsRemaining} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            {t('duel.play.youScoreLabel')}
          </p>
          <ScoreBar
            score={displayedLocal.score}
            streak={displayedLocal.streak}
            bestStreak={displayedLocal.bestStreak}
          />
        </div>
        <div>
          <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            {opponentDisplayName}
          </p>
          <ScoreBar
            score={displayedOpponent.score}
            streak={displayedOpponent.streak}
            bestStreak={displayedOpponent.bestStreak}
          />
        </div>
      </div>

      <div className="relative mt-6">
        <FlagCard
          key={currentQuestion.correct.code}
          questionKey={currentQuestion.correct.code}
          code={currentQuestion.correct.code}
          name={currentQuestion.correct.name[locale]}
        />
      </div>

      {!showFeedback && <DuelOpponentStatus answered={Boolean(opponentAnswer)} youAnswered={Boolean(localAnswer)} />}

      <div className="mt-3 min-h-[52px]">
        <AnswerFeedback
          visible={showFeedback}
          correct={Boolean(localAnswer?.correct)}
          correctName={currentQuestion.correct.name[locale]}
          pointsEarned={localAnswer?.points ?? 0}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {currentQuestion.options.map((option, index) => (
          <AnswerButton
            key={option.code}
            letter={LETTERS[index]}
            label={option.name[locale]}
            status={getStatus(option.code)}
            disabled={Boolean(localAnswer) || showFeedback}
            onClick={() => submitAnswer(option.code)}
          />
        ))}
      </div>

      {mockControls && <DuelMockControls controls={mockControls} />}
    </div>
  );
}
