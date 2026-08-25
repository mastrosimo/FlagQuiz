import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DuelMockControls } from './DuelMockControls';
import { useDuelSession } from '../../duel/useDuelSession';
import type { DuelAnswerRecord, DuelPlayerState } from '../../duel/types';
import { BOT_DIFFICULTY_LABEL_KEY } from '../../duel/botDifficulty';
import { useTranslation } from '../../i18n/useTranslation';

function averageTimeMs(player: DuelPlayerState): number {
  const answered = player.answers.filter((entry): entry is DuelAnswerRecord => entry != null);
  if (!answered.length) return 0;
  return Math.round(answered.reduce((sum, entry) => sum + entry.timeMs, 0) / answered.length);
}

export function DuelResultView() {
  const { state, proposeRematch, declineRematch, mockControls } = useDuelSession();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { local, opponent } = state.players;

  const outcomeKey =
    state.winnerId === 'local' ? 'duel.result.victory' : state.winnerId === 'opponent' ? 'duel.result.defeat' : 'duel.result.draw';
  const botDifficulty = state.match.botDifficulty;
  const opponentDisplayName = botDifficulty ? t('duel.bot.opponentName') : opponent.name || t('duel.result.opponentColumn');

  const rows: { label: string; you: string; opponent: string }[] = [
    { label: t('duel.result.scoreLabel'), you: String(local.score), opponent: String(opponent.score) },
    { label: t('duel.result.correctLabel'), you: String(local.correctCount), opponent: String(opponent.correctCount) },
    { label: t('duel.result.wrongLabel'), you: String(local.wrongCount), opponent: String(opponent.wrongCount) },
    {
      label: t('duel.result.avgTimeLabel'),
      you: `${(averageTimeMs(local) / 1000).toFixed(1)}s`,
      opponent: `${(averageTimeMs(opponent) / 1000).toFixed(1)}s`,
    },
    { label: t('duel.result.bestComboLabel'), you: `🔥 ${local.bestStreak}`, opponent: `🔥 ${opponent.bestStreak}` },
    { label: t('duel.result.fastAnswersLabel'), you: String(local.fastAnswers), opponent: String(opponent.fastAnswers) },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <Card className="p-8 text-center">
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          className="font-display text-4xl font-black text-slate-900 dark:text-white"
        >
          {t(outcomeKey)}
        </motion.p>

        {botDifficulty && (
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t('duel.bot.resultDifficultyLabel', { difficulty: t(BOT_DIFFICULTY_LABEL_KEY[botDifficulty]) })}
          </p>
        )}

        <p className="mt-6 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          {t('duel.result.comparisonTitle')}
        </p>
        <div className="overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800">
          <div className="grid grid-cols-3 gap-1 bg-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            <span></span>
            <span>{t('duel.result.youColumn')}</span>
            <span>{opponentDisplayName}</span>
          </div>
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-1 border-t border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
              <span className="text-left font-medium text-slate-500 dark:text-slate-400">{row.label}</span>
              <span className="font-bold text-slate-900 dark:text-white">{row.you}</span>
              <span className="font-bold text-slate-900 dark:text-white">{row.opponent}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          {opponent.wantsRematch && !local.wantsRematch ? (
            <>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {t('duel.result.rematchProposedByOpponent')}
              </p>
              <div className="flex gap-3">
                <Button onClick={proposeRematch}>{t('duel.result.acceptRematch')}</Button>
                <Button variant="secondary" onClick={declineRematch}>
                  {t('duel.result.declineRematch')}
                </Button>
              </div>
            </>
          ) : local.wantsRematch ? (
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('duel.result.rematchWaiting')}</p>
          ) : (
            <Button onClick={proposeRematch}>{t('duel.result.rematchButton')}</Button>
          )}

          {botDifficulty && (
            <Button variant="ghost" onClick={() => navigate('/1vs1/computer')}>
              {t('duel.bot.changeDifficultyButton')}
            </Button>
          )}

          <Button variant="ghost" onClick={() => navigate('/1vs1')}>
            {t('duel.result.backToHome')}
          </Button>
        </div>
      </Card>

      {mockControls && <DuelMockControls controls={mockControls} showRematch />}
    </div>
  );
}
