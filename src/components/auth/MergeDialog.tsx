import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n/useTranslation';
import { useSyncStore } from '../../store/syncStore';
import { resolveMerge } from '../../services/syncService';
import type { ProgressSnapshot } from '../../utils/mergeProgress';

function SummaryList({ snapshot }: { snapshot: ProgressSnapshot }) {
  const { t } = useTranslation();
  return (
    <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
      <li>{t('sync.mergeDialog.gamesPlayed', { count: snapshot.stats.gamesPlayed })}</li>
      <li>{t('sync.mergeDialog.flagsRecognized', { count: snapshot.recognizedCodes.length })}</li>
      <li>{t('sync.mergeDialog.xp', { count: snapshot.xp })}</li>
      <li>{t('sync.mergeDialog.achievements', { count: snapshot.unlockedAchievements.length })}</li>
    </ul>
  );
}

export function MergeDialog() {
  const { t } = useTranslation();
  const pendingMerge = useSyncStore((state) => state.pendingMerge);
  const [working, setWorking] = useState(false);

  if (!pendingMerge) return null;

  const handleDecision = async (decision: 'merge' | 'skip') => {
    setWorking(true);
    await resolveMerge(decision);
    setWorking(false);
  };

  return (
    <Modal open={Boolean(pendingMerge)} onClose={() => {}}>
      <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{t('sync.mergeDialog.title')}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('sync.mergeDialog.description')}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('sync.mergeDialog.localSummaryTitle')}
          </p>
          <SummaryList snapshot={pendingMerge.local} />
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('sync.mergeDialog.cloudSummaryTitle')}
          </p>
          <SummaryList snapshot={pendingMerge.remote} />
        </div>
      </div>

      {working ? (
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{t('sync.mergeDialog.working')}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => handleDecision('skip')}>
            {t('sync.mergeDialog.skipButton')}
          </Button>
          <Button onClick={() => handleDecision('merge')}>{t('sync.mergeDialog.mergeButton')}</Button>
        </div>
      )}
    </Modal>
  );
}
