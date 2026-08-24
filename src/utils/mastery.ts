import type { TranslationKey } from '../i18n/types';
import { COUNTRIES } from '../data/countries';

export type MasteryLevel = 'discovered' | 'known' | 'expert' | 'master';

const LEVEL_ORDER: MasteryLevel[] = ['discovered', 'known', 'expert', 'master'];

export const MASTERY_THRESHOLDS: Record<MasteryLevel, number> = {
  discovered: 1,
  known: 5,
  expert: 15,
  master: 30,
};

export const MASTERY_LEVEL_META: Record<MasteryLevel, { icon: string; labelKey: TranslationKey }> = {
  discovered: { icon: '🥉', labelKey: 'mastery.levelDiscovered' },
  known: { icon: '🥈', labelKey: 'mastery.levelKnown' },
  expert: { icon: '🥇', labelKey: 'mastery.levelExpert' },
  master: { icon: '💎', labelKey: 'mastery.levelMaster' },
};

export function getMasteryLevel(count: number): MasteryLevel | null {
  let level: MasteryLevel | null = null;
  for (const candidate of LEVEL_ORDER) {
    if (count >= MASTERY_THRESHOLDS[candidate]) level = candidate;
  }
  return level;
}

export interface MasteryProgress {
  level: MasteryLevel | null;
  next: MasteryLevel | null;
  count: number;
  target: number;
  remaining: number;
  percent: number;
  completed: boolean;
}

// Il target mostrato e' sempre la soglia del prossimo livello (o quella di
// Maestro, se gia' raggiunto): riflette gli esempi "7/15", "15/30", "30/30".
export function getMasteryProgress(count: number): MasteryProgress {
  const level = getMasteryLevel(count);
  const currentIndex = level ? LEVEL_ORDER.indexOf(level) : -1;
  const next = LEVEL_ORDER[currentIndex + 1] ?? null;
  const target = next ? MASTERY_THRESHOLDS[next] : MASTERY_THRESHOLDS.master;
  const cappedCount = Math.min(count, target);

  return {
    level,
    next,
    count,
    target,
    remaining: Math.max(0, target - count),
    percent: target > 0 ? Math.round((cappedCount / target) * 100) : 0,
    completed: level === 'master',
  };
}

export interface MasterySummary {
  discovered: number;
  known: number;
  expert: number;
  master: number;
  withAnswers: number;
  total: number;
}

// Ogni bandiera contribuisce a UN solo livello (quello corrente), non in modo
// cumulativo: discovered+known+expert+master deve sempre sommare a withAnswers.
export function getMasterySummary(counts: Record<string, number>): MasterySummary {
  const summary: MasterySummary = {
    discovered: 0,
    known: 0,
    expert: 0,
    master: 0,
    withAnswers: 0,
    total: COUNTRIES.length,
  };

  for (const country of COUNTRIES) {
    const level = getMasteryLevel(counts[country.code] ?? 0);
    if (!level) continue;
    summary.withAnswers += 1;
    summary[level] += 1;
  }

  return summary;
}

export function getMasteredCount(counts: Record<string, number>): number {
  return getMasterySummary(counts).master;
}
