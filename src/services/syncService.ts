import { supabase } from '../lib/supabaseClient';
import { useProfileStore } from '../store/profileStore';
import { useCollectionStore } from '../store/collectionStore';
import { useLanguageStore } from '../i18n/languageStore';
import { useSyncStore } from '../store/syncStore';
import { getStoredTheme, setStoredTheme, type Theme } from '../hooks/useTheme';
import { debounce } from '../utils/debounce';
import { hasMeaningfulProgress, mergeProgress, type ProgressSnapshot } from '../utils/mergeProgress';
import type { Locale } from '../i18n/types';
import type { DailyChallengeState, DailyStreak, ProfileStats } from '../types';

const SYNC_META_KEY = 'flagquiz:v1:sync-meta';
const PUSH_DEBOUNCE_MS = 1500;

interface SyncMeta {
  resolvedForUserId: string | null;
}

function readSyncMeta(): SyncMeta {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    if (!raw) return { resolvedForUserId: null };
    return JSON.parse(raw) as SyncMeta;
  } catch {
    return { resolvedForUserId: null };
  }
}

function writeSyncMeta(meta: SyncMeta) {
  localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
}

interface ProgressRow {
  user_id: string;
  xp: number;
  stats: ProfileStats;
  unlocked_achievements: string[];
  sound_enabled: boolean;
  daily_streak: DailyStreak;
  daily_challenge: DailyChallengeState;
  synced_at: string | null;
  updated_at: string;
}

interface CollectionRow {
  user_id: string;
  recognized_codes: string[];
  synced_at: string | null;
  updated_at: string;
}

interface SettingsRow {
  user_id: string;
  locale: Locale;
  theme: Theme;
  synced_at: string | null;
  updated_at: string;
}

interface RemoteState {
  progress: ProgressRow | null;
  collection: CollectionRow | null;
  settings: SettingsRow | null;
}

function localSnapshot(): ProgressSnapshot {
  const profile = useProfileStore.getState();
  return {
    stats: profile.stats,
    xp: profile.xp,
    unlockedAchievements: profile.unlockedAchievements,
    dailyStreak: profile.dailyStreak,
    dailyChallenge: profile.dailyChallenge,
    recognizedCodes: useCollectionStore.getState().recognizedCodes,
  };
}

function remoteSnapshot(remote: RemoteState): ProgressSnapshot {
  return {
    stats: remote.progress?.stats ?? useProfileStore.getState().stats,
    xp: remote.progress?.xp ?? 0,
    unlockedAchievements: remote.progress?.unlocked_achievements ?? [],
    dailyStreak: remote.progress?.daily_streak ?? { current: 0, longest: 0, lastPlayedDate: null },
    dailyChallenge: remote.progress?.daily_challenge ?? { date: null, completed: false, result: null },
    recognizedCodes: remote.collection?.recognized_codes ?? [],
  };
}

function hydrateLocal(snapshot: ProgressSnapshot, settings: SettingsRow | null) {
  useProfileStore.setState({
    stats: snapshot.stats,
    xp: snapshot.xp,
    unlockedAchievements: snapshot.unlockedAchievements,
    dailyStreak: snapshot.dailyStreak,
    dailyChallenge: snapshot.dailyChallenge,
  });
  useCollectionStore.setState({ recognizedCodes: snapshot.recognizedCodes });
  if (settings) {
    useLanguageStore.setState({ locale: settings.locale });
    setStoredTheme(settings.theme);
  }
}

async function fetchRemoteState(userId: string): Promise<RemoteState | null> {
  if (!supabase) return null;
  const [progress, collection, settings] = await Promise.all([
    supabase.from('user_progress').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_collection').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
  ]);
  if (progress.error || collection.error || settings.error) return null;
  return {
    progress: progress.data as ProgressRow | null,
    collection: collection.data as CollectionRow | null,
    settings: settings.data as SettingsRow | null,
  };
}

async function pushProgress(userId: string) {
  if (!supabase) return;
  const profile = useProfileStore.getState();
  const now = new Date().toISOString();
  await supabase.from('user_progress').upsert({
    user_id: userId,
    xp: profile.xp,
    stats: profile.stats,
    unlocked_achievements: profile.unlockedAchievements,
    sound_enabled: profile.soundEnabled,
    daily_streak: profile.dailyStreak,
    daily_challenge: profile.dailyChallenge,
    synced_at: now,
    updated_at: now,
  });
}

async function pushCollection(userId: string) {
  if (!supabase) return;
  const now = new Date().toISOString();
  await supabase.from('user_collection').upsert({
    user_id: userId,
    recognized_codes: useCollectionStore.getState().recognizedCodes,
    synced_at: now,
    updated_at: now,
  });
}

async function pushSettings(userId: string) {
  if (!supabase) return;
  const now = new Date().toISOString();
  await supabase.from('user_settings').upsert({
    user_id: userId,
    locale: useLanguageStore.getState().locale,
    theme: getStoredTheme(),
    synced_at: now,
    updated_at: now,
  });
}

async function pushAll(userId: string) {
  await Promise.all([pushProgress(userId), pushCollection(userId), pushSettings(userId)]);
}

let unsubscribers: Array<() => void> = [];
let watchingUserId: string | null = null;

function markSynced() {
  useSyncStore.getState().setStatus('synced');
  useSyncStore.getState().setLastSyncedAt(Date.now());
}

function markError() {
  useSyncStore.getState().setStatus(navigator.onLine ? 'error' : 'offline');
}

function startWatchingLocalChanges(userId: string) {
  stopWatchingLocalChanges();
  watchingUserId = userId;

  const runPush = (push: (id: string) => Promise<void>) => {
    useSyncStore.getState().setStatus('syncing');
    push(userId)
      .then(markSynced)
      .catch(markError);
  };

  const debouncedProgress = debounce(() => runPush(pushProgress), PUSH_DEBOUNCE_MS);
  const debouncedCollection = debounce(() => runPush(pushCollection), PUSH_DEBOUNCE_MS);
  const debouncedSettings = debounce(() => runPush(pushSettings), PUSH_DEBOUNCE_MS);

  unsubscribers.push(useProfileStore.subscribe(debouncedProgress));
  unsubscribers.push(useCollectionStore.subscribe(debouncedCollection));
  unsubscribers.push(useLanguageStore.subscribe(debouncedSettings));

  const handleThemeChanged = () => debouncedSettings();
  window.addEventListener('flagquiz:theme-changed', handleThemeChanged);
  unsubscribers.push(() => window.removeEventListener('flagquiz:theme-changed', handleThemeChanged));

  const handleOnline = () => {
    // Al ritorno online, se una sync era in errore/offline, ritenta subito
    // pushando lo stato locale corrente (snapshot completo, non serve un
    // journal di operazioni: vedi nota in pullIfRemoteIsNewer).
    if (useSyncStore.getState().status === 'offline' || useSyncStore.getState().status === 'error') {
      runPush(pushProgress);
      runPush(pushCollection);
      runPush(pushSettings);
    }
  };
  window.addEventListener('online', handleOnline);
  unsubscribers.push(() => window.removeEventListener('online', handleOnline));

  const handleFocus = () => void pullIfRemoteIsNewer(userId);
  window.addEventListener('focus', handleFocus);
  unsubscribers.push(() => window.removeEventListener('focus', handleFocus));
}

function stopWatchingLocalChanges() {
  unsubscribers.forEach((unsubscribe) => unsubscribe());
  unsubscribers = [];
  watchingUserId = null;
}

// Step 8 - multi-dispositivo: al ritorno in focus, se un altro dispositivo ha
// pushato dati piu' recenti di quelli locali, li scarica. Non tocca nulla se
// c'e' un push locale in corso o se non ci sono novita' (evita di sovrascrivere
// modifiche locali non ancora inviate).
async function pullIfRemoteIsNewer(userId: string) {
  if (!navigator.onLine) return;
  const remote = await fetchRemoteState(userId);
  if (!remote) return;

  const lastSyncedAt = useSyncStore.getState().lastSyncedAt;
  const remoteUpdatedAt = [remote.progress?.updated_at, remote.collection?.updated_at, remote.settings?.updated_at]
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .reduce((max, value) => Math.max(max, value), 0);

  if (!lastSyncedAt || remoteUpdatedAt <= lastSyncedAt) return;

  hydrateLocal(remoteSnapshot(remote), remote.settings);
  markSynced();
}

// Chiamata da SyncProvider quando authStore passa a 'authenticated'.
export async function handleSignIn(userId: string): Promise<void> {
  if (!supabase) return;
  useSyncStore.getState().setStatus('syncing');

  const remote = await fetchRemoteState(userId);
  if (!remote) {
    markError();
    return;
  }

  const meta = readSyncMeta();
  const local = localSnapshot();

  if (meta.resolvedForUserId === userId) {
    // Gia' risolto in precedenza su questo dispositivo per questo account:
    // il cloud e' la fonte di verita' corrente, nessun nuovo prompt.
    if (remote.progress?.synced_at) hydrateLocal(remoteSnapshot(remote), remote.settings);
    else await pushAll(userId);
    startWatchingLocalChanges(userId);
    markSynced();
    return;
  }

  if (hasMeaningfulProgress(local)) {
    // Richiede una decisione dell'utente: vedi resolveMerge (Step 7).
    useSyncStore.getState().setPendingMerge({ userId, local, remote: remoteSnapshot(remote) });
    useSyncStore.getState().setStatus('awaiting-merge-decision');
    return;
  }

  if (remote.progress?.synced_at) hydrateLocal(remoteSnapshot(remote), remote.settings);
  else await pushAll(userId);

  writeSyncMeta({ resolvedForUserId: userId });
  startWatchingLocalChanges(userId);
  markSynced();
}

// Step 7 - guest -> account: applica la decisione dell'utente sul dialog di
// merge. Operazione idempotente e one-time: dopo la risoluzione, resolvedForUserId
// viene marcato e questa funzione non verra' piu' invocata per lo stesso account
// su questo dispositivo (ne' un refresh ne' un nuovo login la ripropongono).
export async function resolveMerge(decision: 'merge' | 'skip'): Promise<void> {
  const pending = useSyncStore.getState().pendingMerge;
  if (!pending) return;
  const { userId, local, remote } = pending;

  useSyncStore.getState().setStatus('syncing');
  useSyncStore.getState().setPendingMerge(null);

  if (decision === 'merge') {
    const merged = mergeProgress(local, remote);
    hydrateLocal(merged, null);
    await pushAll(userId);
  } else {
    // 'skip': il cloud vince sempre, anche se e' ancora vuoto (account nuovo).
    hydrateLocal(remote, null);
    await pushAll(userId);
  }

  writeSyncMeta({ resolvedForUserId: userId });
  startWatchingLocalChanges(userId);
  markSynced();
}

// Chiamata da SyncProvider quando authStore torna a 'guest' (logout o sessione scaduta).
export function handleSignOut(): void {
  stopWatchingLocalChanges();
  useSyncStore.getState().setStatus('idle');
  useSyncStore.getState().setPendingMerge(null);
}

export function isWatching(userId: string): boolean {
  return watchingUserId === userId;
}
