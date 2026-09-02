import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DuelSessionProvider, useDuelSession } from '../../duel/useDuelSession';
import { isValidMatchCode, normalizeMatchCode } from '../../duel/codeGenerator';
import { DuelLobbyView } from '../../components/duel/DuelLobbyView';
import { DuelCountdown } from '../../components/duel/DuelCountdown';
import { DuelPlayView } from '../../components/duel/DuelPlayView';
import { DuelResultView } from '../../components/duel/DuelResultView';
import { DuelDisconnectedOverlay } from '../../components/duel/DuelDisconnectedOverlay';
import { useAuthStore } from '../../store/authStore';
import { getShownName } from '../../utils/displayName';
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

// Wrappata da ProtectedRoute in App.tsx (/1vs1/:code): user e' garantito
// non nullo qui, il guard sotto e' solo per il type narrowing di TypeScript.
export function DuelMatchPage() {
  const { code: rawCode } = useParams<{ code: string }>();
  const location = useLocation();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const intent = (location.state as DuelNavState | null)?.intent === 'create' ? 'create' : 'join';
  const code = normalizeMatchCode(rawCode ?? '');

  if (!isValidMatchCode(code)) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-slate-500 dark:text-slate-400">{t('duel.home.invalidCode')}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-4 pt-6">
      <DuelSessionProvider
        intent={intent}
        code={code}
        localPlayerName={getShownName(profile?.displayName, user.email)}
        transportKind="supabase-realtime"
        userId={user.id}
        renderError={() => (
          <div className="mx-auto max-w-md px-4 py-16 text-center">
            <p className="text-slate-500 dark:text-slate-400">{t('duel.home.joinFailed')}</p>
          </div>
        )}
      >
        <DuelMatchContent />
      </DuelSessionProvider>
    </div>
  );
}
