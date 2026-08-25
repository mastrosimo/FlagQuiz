import type { DuelMockControls as DuelMockControlsType } from '../../duel/types';
import { useTranslation } from '../../i18n/useTranslation';

interface DuelMockControlsProps {
  controls: DuelMockControlsType;
  showJoin?: boolean;
  showRematch?: boolean;
}

/**
 * Pannello di test, deliberatamente marcato come "simulazione": scompare da
 * solo quando `mockControls` è null, cioè quando il transport non è più
 * `LocalMockTransport` (nessuna modifica da fare altrove).
 */
export function DuelMockControls({ controls, showJoin, showRematch }: DuelMockControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mt-4 max-w-md rounded-2xl border-2 border-dashed border-slate-300 p-3 dark:border-slate-600">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">{t('duel.mock.panelTitle')}</p>
      <div className="flex flex-wrap gap-2">
        {showJoin && (
          <button
            type="button"
            onClick={controls.opponentJoin}
            className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {t('duel.mock.opponentJoin')}
          </button>
        )}
        <button
          type="button"
          onClick={controls.opponentSetReady}
          className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          {t('duel.mock.opponentReadyButton')}
        </button>
        <button
          type="button"
          onClick={controls.opponentDisconnect}
          className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          {t('duel.mock.opponentDisconnectButton')}
        </button>
        <button
          type="button"
          onClick={controls.opponentReconnect}
          className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          {t('duel.mock.opponentReconnectButton')}
        </button>
        {showRematch && (
          <>
            <button
              type="button"
              onClick={controls.opponentProposeRematch}
              className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {t('duel.mock.opponentProposeRematchButton')}
            </button>
            <button
              type="button"
              onClick={controls.opponentAcceptRematch}
              className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {t('duel.mock.opponentAcceptRematchButton')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
