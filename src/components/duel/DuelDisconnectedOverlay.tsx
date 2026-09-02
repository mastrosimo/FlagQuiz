import { motion } from 'framer-motion';
import { useDuelSession } from '../../duel/useDuelSession';
import { useTranslation } from '../../i18n/useTranslation';

export function DuelDisconnectedOverlay() {
  const { t } = useTranslation();
  const { mockControls } = useDuelSession();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-slate-900/80 px-6 text-center backdrop-blur-sm"
    >
      <span className="text-4xl" aria-hidden="true">📡</span>
      <p className="font-display text-xl font-bold text-white">{t('duel.disconnected.title')}</p>
      {mockControls && (
        <button
          type="button"
          onClick={mockControls.opponentReconnect}
          className="mt-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
        >
          {t('duel.disconnected.reconnectButton')}
        </button>
      )}
    </motion.div>
  );
}
