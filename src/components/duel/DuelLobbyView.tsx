import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DuelCodeDisplay } from './DuelCodeDisplay';
import { DuelMockControls } from './DuelMockControls';
import { useDuelSession } from '../../duel/useDuelSession';
import { useTranslation } from '../../i18n/useTranslation';

function PlayerRow({
  label,
  connected,
  ready,
  notConnectedText,
  notReadyText,
}: {
  label: string;
  connected: boolean;
  ready: boolean;
  notConnectedText: string;
  notReadyText: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
      <span className="min-w-0 truncate font-semibold text-slate-700 dark:text-slate-200" title={label}>
        {label}
      </span>
      {!connected ? (
        <span className="shrink-0 text-xs font-medium text-slate-400">{notConnectedText}</span>
      ) : ready ? (
        <span className="shrink-0 text-xs font-bold text-success-600 dark:text-success-500">{t('duel.lobby.readyDone')}</span>
      ) : (
        <span className="shrink-0 text-xs font-medium text-slate-400">{notReadyText}</span>
      )}
    </div>
  );
}

export function DuelLobbyView() {
  const { state, ready, mockControls } = useDuelSession();
  const { t } = useTranslation();
  const { local, opponent } = state.players;

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6">
      <Card className="p-6">
        <DuelCodeDisplay code={state.match.code} />

        <div className="mt-5 flex flex-col gap-2">
          <PlayerRow
            label={t('duel.lobby.youLabel')}
            connected
            ready={local.ready}
            notConnectedText=""
            notReadyText={t('duel.lobby.notReadyYet')}
          />
          <PlayerRow
            label={opponent.name || t('duel.lobby.opponentLabel')}
            connected={opponent.connected}
            ready={opponent.ready}
            notConnectedText={t('duel.lobby.opponentNotConnected')}
            notReadyText={t('duel.lobby.opponentNotReady')}
          />
        </div>

        {!opponent.connected ? (
          <p className="mt-5 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            {t('duel.lobby.waitingOpponent')}
          </p>
        ) : (
          <div className="mt-5 flex justify-center">
            <Button onClick={ready} disabled={local.ready} size="lg">
              {local.ready ? t('duel.lobby.readyDone') : t('duel.lobby.readyButton')}
            </Button>
          </div>
        )}
      </Card>

      {mockControls && <DuelMockControls controls={mockControls} showJoin={!opponent.connected} />}
    </div>
  );
}
