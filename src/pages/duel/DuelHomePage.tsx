import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DuelMockBanner } from '../../components/duel/DuelMockBanner';
import { generateMatchCode, isValidMatchCode, normalizeMatchCode } from '../../duel/codeGenerator';
import { useTranslation } from '../../i18n/useTranslation';

export function DuelHomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState(false);

  const handleCreate = () => {
    const code = generateMatchCode();
    navigate(`/1vs1/${code}`, { state: { intent: 'create' } });
  };

  const handleJoin = () => {
    const code = normalizeMatchCode(codeInput);
    if (!isValidMatchCode(code)) {
      setError(true);
      return;
    }
    navigate(`/1vs1/${code}`, { state: { intent: 'join' } });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <DuelMockBanner />
      <div className="text-center">
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">{t('duel.home.title')}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{t('duel.home.subtitle')}</p>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
          {t('duel.home.vsComputerSection')}
        </h2>
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/1vs1/computer')}
          className="flex w-full items-center gap-4 rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-left text-white shadow-lg shadow-brand-600/25"
        >
          <span className="text-4xl" aria-hidden="true">🖥️</span>
          <span className="flex-1">
            <span className="block font-display text-lg font-extrabold">{t('duel.bot.homeCardTitle')}</span>
            <span className="block text-sm text-brand-50/90">{t('duel.bot.homeCardDescription')}</span>
          </span>
        </motion.button>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
          {t('duel.home.vsFriendSection')}
        </h2>
        <div className="flex justify-center">
          <Button size="lg" onClick={handleCreate}>
            {t('duel.home.createButton')}
          </Button>
        </div>
      </section>

      <Card className="mt-8 p-5">
        <p className="mb-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
          {t('duel.home.joinTitle')}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={codeInput}
            onChange={(event) => {
              setCodeInput(event.target.value.toUpperCase());
              setError(false);
            }}
            placeholder={t('duel.home.codePlaceholder')}
            maxLength={6}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center font-display text-lg tracking-widest text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <Button onClick={handleJoin}>{t('duel.home.joinButton')}</Button>
        </div>
        {error && <p className="mt-2 text-center text-xs font-medium text-danger-500">{t('duel.home.invalidCode')}</p>}
      </Card>
    </div>
  );
}
