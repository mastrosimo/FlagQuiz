import { useTranslation } from '../../i18n/useTranslation';

/**
 * Etichetta visibile sulle schermate 1vs1 solo in sviluppo: rende esplicito
 * che il transport è oggi una simulazione locale, non multiplayer online
 * reale. Nascosta in produzione con lo stesso criterio di `DuelMockControls`
 * (`import.meta.env.DEV`), perché è un dettaglio implementativo interno, non
 * un'informazione per l'utente finale.
 */
export function DuelMockBanner() {
  const { t } = useTranslation();

  if (!import.meta.env.DEV) return null;

  return (
    <div className="mx-auto mb-4 flex max-w-2xl items-center gap-2 rounded-2xl border-2 border-dashed border-accent-500/40 bg-accent-500/10 px-4 py-2 text-xs font-semibold text-accent-600 dark:text-accent-400">
      <span aria-hidden="true">🧪</span>
      <span>{t('duel.mockBanner')}</span>
    </div>
  );
}
