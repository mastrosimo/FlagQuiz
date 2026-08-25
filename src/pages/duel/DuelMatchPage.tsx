import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DuelSessionProvider, useDuelSession } from '../../duel/useDuelSession';
import { isValidMatchCode, normalizeMatchCode } from '../../duel/codeGenerator';
import { DuelMockBanner } from '../../components/duel/DuelMockBanner';
import { DuelLobbyView } from '../../components/duel/DuelLobbyView';
import { DuelCountdown } from '../../components/duel/DuelCountdown';
import { DuelPlayView } from '../../components/duel/DuelPlayView';
import { DuelResultView } from '../../components/duel/DuelResultView';
import { DuelDisconnectedOverlay } from '../../components/duel/DuelDisconnectedOverlay';
import { useTranslation } from '../../i18n/useTranslation';

interface DuelNavState {
  intent?: 'create' | 'join';
}

function DuelMatchContent() {
  const { state } = useDuelSession();
  const navigate = useNavigate();
  const params = useParams<{ code: string }>();

  // Dopo una rivincita il transport genera un nuovo codice partita: si
  // aggiorna l'URL di conseguenza così il link resta condivisibile. La
  // sessione (già inizializzata) non viene ricreata: vedi il commento
  // sull'effetto a deps vuote in useDuelSession.
  useEffect(() => {
    if (params.code && state.match.code !== params.code) {
      navigate(`/1vs1/${state.match.code}`, { replace: true });
    }
  }, [state.match.code, params.code, navigate]);

  return (
    <>
      {state.phase === 'lobby' && <DuelLobbyView />}
      {state.phase === 'countdown' && <DuelCountdown />}
      {(state.phase === 'playing' || state.phase === 'question-transition') && <DuelPlayView />}
      {(state.phase === 'finished' || state.phase === 'rematch') && <DuelResultView />}
      {state.opponentDisconnected && <DuelDisconnectedOverlay />}
    </>
  );
}

export function DuelMatchPage() {
  const { code: rawCode } = useParams<{ code: string }>();
  const location = useLocation();
  const { t } = useTranslation();
  const intent = (location.state as DuelNavState | null)?.intent === 'create' ? 'create' : 'join';
  const code = normalizeMatchCode(rawCode ?? '');

  if (!isValidMatchCode(code)) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-slate-500 dark:text-slate-400">{t('duel.home.invalidCode')}</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <DuelMockBanner />
      <DuelSessionProvider intent={intent} code={code} localPlayerName={t('duel.lobby.youLabel')}>
        <DuelMatchContent />
      </DuelSessionProvider>
    </div>
  );
}
