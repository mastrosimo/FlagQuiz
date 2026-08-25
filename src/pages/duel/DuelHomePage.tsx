import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleCreate}>
          {t('duel.home.createButton')}
        </Button>
      </div>

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
