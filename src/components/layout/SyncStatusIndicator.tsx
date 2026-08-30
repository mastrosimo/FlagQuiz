import { useAuthStore } from '../../store/authStore';
import { useSyncStore } from '../../store/syncStore';
import { useTranslation } from '../../i18n/useTranslation';

// Indicatore silenzioso: invisibile quando la sync funziona (syncing/synced/
// offline non sono errori transitori da segnalare), compare solo quando c'e'
// un errore reale da notare.
export function SyncStatusIndicator() {
  const { t } = useTranslation();
  const authStatus = useAuthStore((state) => state.status);
  const syncStatus = useSyncStore((state) => state.status);

  if (authStatus !== 'authenticated' || syncStatus !== 'error') return null;

  const label = t('sync.status.error');

  return (
    <span role="status" title={label} aria-label={label} className="h-2.5 w-2.5 shrink-0 rounded-full bg-danger-500" />
  );
}
