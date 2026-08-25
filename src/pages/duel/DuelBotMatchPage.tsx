import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DuelSessionProvider, useDuelSession } from '../../duel/useDuelSession';
import { generateMatchCode } from '../../duel/codeGenerator';
import { isBotDifficulty } from '../../duel/botDifficulty';
import { DuelMockBanner } from '../../components/duel/DuelMockBanner';
import { DuelCountdown } from '../../components/duel/DuelCountdown';
import { DuelPlayView } from '../../components/duel/DuelPlayView';
import { DuelResultView } from '../../components/duel/DuelResultView';
import { DuelDisconnectedOverlay } from '../../components/duel/DuelDisconnectedOverlay';
import { useTranslation } from '../../i18n/useTranslation';

function DuelBotMatchContent() {
  const { state } = useDuelSession();
  const { t } = useTranslation();

  return (
    <>
      {/* Nessuna lobby: la fase 'lobby' dura solo l'istante in cui il bot si
          "connette" e si autopronuncia pronto (vedi LocalMockTransport.autoStartBotMatch). */}
      {state.phase === 'lobby' && (
        <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
          {t('duel.bot.preparingMatch')}
        </div>
      )}
      {state.phase === 'countdown' && <DuelCountdown />}
      {(state.phase === 'playing' || state.phase === 'question-transition') && <DuelPlayView />}
      {(state.phase === 'finished' || state.phase === 'rematch') && <DuelResultView />}
      {state.opponentDisconnected && <DuelDisconnectedOverlay />}
    </>
  );
}

export function DuelBotMatchPage() {
  const { difficulty: rawDifficulty } = useParams<{ difficulty: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Un solo codice partita generato per l'intera vita di questa pagina: la
  // rivincita ne genera uno nuovo internamente (vedi LocalMockTransport),
  // ma l'URL resta ancorato alla difficoltà, non al codice.
  const code = useMemo(() => generateMatchCode(), []);

  if (!isBotDifficulty(rawDifficulty)) {
    navigate('/1vs1/computer', { replace: true });
    return null;
  }

  return (
    <div className="px-4 pt-6">
      <DuelMockBanner />
      <DuelSessionProvider intent="create" code={code} localPlayerName={t('duel.lobby.youLabel')} botDifficulty={rawDifficulty}>
        <DuelBotMatchContent />
      </DuelSessionProvider>
    </div>
  );
}
