import { create } from 'zustand';
import type { ProgressSnapshot } from '../utils/mergeProgress';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline' | 'awaiting-merge-decision';

export interface PendingMerge {
  userId: string;
  local: ProgressSnapshot;
  remote: ProgressSnapshot;
}

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  pendingMerge: PendingMerge | null;
  setStatus: (status: SyncStatus) => void;
  setLastSyncedAt: (timestamp: number) => void;
  setPendingMerge: (merge: PendingMerge | null) => void;
}

// Store volatile (nessun persist): riflette lo stato corrente della sync,
// usato dal MergeDialog e dal SyncStatusIndicator (Step 7/9).
export const useSyncStore = create<SyncState>()((set) => ({
  status: 'idle',
  lastSyncedAt: null,
  pendingMerge: null,
  setStatus: (status) => set({ status }),
  setLastSyncedAt: (timestamp) => set({ lastSyncedAt: timestamp }),
  setPendingMerge: (merge) => set({ pendingMerge: merge }),
}));
