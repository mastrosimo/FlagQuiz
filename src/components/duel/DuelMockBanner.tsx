import { useTranslation } from '../../i18n/useTranslation';

/**
 * Etichetta sempre visibile sulle schermate 1vs1: rende esplicito che il
 * transport è oggi una simulazione locale, non multiplayer online reale.
 */
export function DuelMockBanner() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto mb-4 flex max-w-2xl items-center gap-2 rounded-2xl border-2 border-dashed border-accent-500/40 bg-accent-500/10 px-4 py-2 text-xs font-semibold text-accent-600 dark:text-accent-400">
      <span aria-hidden="true">🧪</span>
      <span>{t('duel.mockBanner')}</span>
    </div>
  );
}
