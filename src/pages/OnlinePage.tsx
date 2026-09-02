import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import { FormField } from '../components/auth/FormField';
import { useTranslation } from '../i18n/useTranslation';
import { useAuthStore } from '../store/authStore';
import { generateMatchCode, isValidMatchCode, normalizeMatchCode } from '../duel/codeGenerator';

/**
 * Punto di accesso unico a tutto ciò che riguarda le sfide contro un
 * avversario — sostituisce la vecchia `DuelHomePage` (rimossa) e l'icona
 * "🆚" nell'header: la voce "Online" in navbar porta qui. "Gioca contro il
 * computer" è pienamente funzionante (stesso motore 1vs1, 4 difficoltà) ed è
 * accessibile anche in modalità ospite. "Gioca con un amico" usa il
 * transport reale su Supabase Realtime (`/1vs1/:code`, `DuelMatchPage`,
 * protetta da login in App.tsx) — richiede un account, come deciso per le
 * RLS del 1vs1 online.
 */
export function OnlinePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const authStatus = useAuthStore((state) => state.status);

  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState(false);

  const goToLogin = () => navigate('/login', { state: { from: '/online' } });

  const handleCreate = () => {
    if (authStatus !== 'authenticated') {
      goToLogin();
      return;
    }
    const code = generateMatchCode();
    navigate(`/1vs1/${code}`, { state: { intent: 'create' } });
  };

  const handleJoin = (event: FormEvent) => {
    event.preventDefault();
    if (authStatus !== 'authenticated') {
      goToLogin();
      return;
    }
    const code = normalizeMatchCode(joinCode);
    if (!isValidMatchCode(code)) {
      setJoinError(true);
      return;
    }
    setJoinError(false);
    navigate(`/1vs1/${code}`, { state: { intent: 'join' } });
  };

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

        <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
          <div className="flex items-center gap-4">
            <span className="text-4xl" aria-hidden="true">👥</span>
            <span className="flex-1">
              <span className="block font-display text-lg font-extrabold text-slate-700 dark:text-slate-200">
                {t('online.vsFriendTitle')}
              </span>
              <span className="block text-sm text-slate-500 dark:text-slate-400">{t('online.vsFriendDescription')}</span>
            </span>
          </div>

          {authStatus !== 'authenticated' && (
            <p className="mt-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
              {t('duel.home.requiresLogin')}
            </p>
          )}

          <Button onClick={handleCreate} className="mt-4 w-full">
            {t('duel.home.createButton')}
          </Button>

          <form onSubmit={handleJoin} className="mt-4 flex items-end gap-2">
            <div className="flex-1">
              <FormField
                id="online-join-code"
                label={t('duel.home.joinTitle')}
                placeholder={t('duel.home.codePlaceholder')}
                value={joinCode}
                onChange={(event) => {
                  setJoinCode(event.target.value);
                  setJoinError(false);
                }}
                error={joinError ? t('duel.home.invalidCode') : undefined}
                maxLength={6}
              />
            </div>
            <Button type="submit" variant="secondary">
              {t('duel.home.joinButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
