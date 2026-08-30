import { useAuthStore } from '../../store/authStore';
import { useSyncStore } from '../../store/syncStore';
import { useTranslation } from '../../i18n/useTranslation';

const DOT_CLASSES: Record<string, string> = {
  syncing: 'bg-accent-500 animate-pulse',
  synced: 'bg-success-500',
  error: 'bg-danger-500',
  offline: 'bg-slate-400',
};

// Indicatore discreto (un punto colorato) accanto a UserMenu: non introduce
// nuovo testo permanente nell'header, solo un aria-label/title per chi lo
// controlla attivamente o usa uno screen reader.
export function SyncStatusIndicator() {
  const { t } = useTranslation();
  const authStatus = useAuthStore((state) => state.status);
  const syncStatus = useSyncStore((state) => state.status);

  if (authStatus !== 'authenticated') return null;
  if (syncStatus === 'idle' || syncStatus === 'awaiting-merge-decision') return null;

  const label = t(`sync.status.${syncStatus}` as `sync.status.${'syncing' | 'synced' | 'error' | 'offline'}`);

  return (
    <span
      role="status"
      title={label}
      aria-label={label}
      className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_CLASSES[syncStatus]}`}
    />
  );
}
