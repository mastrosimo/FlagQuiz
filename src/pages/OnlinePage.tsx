import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';

/**
 * Punto di accesso unico a tutto ciò che riguarda le sfide contro un
 * avversario — sostituisce la vecchia `DuelHomePage` (rimossa) e l'icona
 * "🆚" nell'header: la voce "Online" in navbar porta qui. "Gioca contro il
 * computer" è pienamente funzionante (stesso motore 1vs1, 4 difficoltà);
 * "Gioca con un amico" resta visibile ma disabilitato finché Supabase
 * Realtime non è collegato — il flusso a codice (`/1vs1/:code`,
 * `DuelMatchPage`) è già pronto nel codice per quando sarà attivabile.
 */
export function OnlinePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">{t('online.title')}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{t('online.subtitle')}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/1vs1/computer')}
          className="flex w-full items-center gap-4 rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-left text-white shadow-lg shadow-brand-600/25"
        >
          <span className="text-4xl" aria-hidden="true">🤖</span>
          <span className="flex-1">
            <span className="block font-display text-lg font-extrabold">{t('online.vsComputerTitle')}</span>
            <span className="block text-sm text-brand-50/90">{t('online.vsComputerDescription')}</span>
          </span>
        </motion.button>

        <div
          aria-disabled="true"
          className="flex w-full items-center gap-4 rounded-3xl bg-slate-100 p-5 text-left opacity-70 dark:bg-slate-800"
        >
          <span className="text-4xl" aria-hidden="true">👥</span>
          <span className="flex-1">
            <span className="flex items-center gap-2">
              <span className="font-display text-lg font-extrabold text-slate-700 dark:text-slate-200">
                {t('online.vsFriendTitle')}
              </span>
              <span className="rounded-full bg-slate-300 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {t('online.comingSoonBadge')}
              </span>
            </span>
            <span className="block text-sm text-slate-500 dark:text-slate-400">{t('online.vsFriendDescription')}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
