import { useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useCollectionStore } from '../store/collectionStore';
import { useMasteryStore } from '../store/masteryStore';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useTranslation } from '../i18n/useTranslation';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const soundEnabled = useProfileStore((state) => state.soundEnabled);
  const setSoundEnabled = useProfileStore((state) => state.setSoundEnabled);
  const resetProgress = useProfileStore((state) => state.resetProgress);
  const resetCollection = useCollectionStore((state) => state.resetCollection);
  const resetMastery = useMasteryStore((state) => state.resetMastery);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{t('settings.title')}</h1>

      <Card className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
        <div className="flex items-center justify-between p-5">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{t('settings.darkModeLabel')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.darkModeDescription')}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'dark'}
            onClick={toggleTheme}
            className={`relative h-7 w-12 rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-600' : 'bg-slate-300'}`}
          >
            <span
              className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-5">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{t('settings.soundLabel')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.soundDescription')}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative h-7 w-12 rounded-full transition-colors ${soundEnabled ? 'bg-brand-600' : 'bg-slate-300'}`}
          >
            <span
              className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{t('settings.resetTitle')}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.resetDescription')}</p>
        <Button variant="danger" className="mt-4" onClick={() => setConfirmOpen(true)}>
          {t('settings.resetButton')}
        </Button>
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{t('settings.confirmTitle')}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('settings.confirmDescription')}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            {t('settings.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              resetProgress();
              resetCollection();
              resetMastery();
              setConfirmOpen(false);
            }}
          >
            {t('settings.confirmButton')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
