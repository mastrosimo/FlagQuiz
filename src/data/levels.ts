import type { Level } from '../types';

export const LEVELS: Level[] = [
  { level: 1, name: 'Principiante', minXp: 0 },
  { level: 2, name: 'Esploratore', minXp: 150 },
  { level: 3, name: 'Viaggiatore', minXp: 400 },
  { level: 4, name: 'Conoscitore', minXp: 800 },
  { level: 5, name: 'Esperto', minXp: 1500 },
  { level: 6, name: 'Maestro', minXp: 2600 },
  { level: 7, name: 'Enciclopedico', minXp: 4200 },
];

export function getLevelForXp(xp: number): Level {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  return current;
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevelForXp(xp);
  const next = LEVELS.find((level) => level.level === current.level + 1);
  return next ?? null;
}

export function getXpProgress(xp: number): { current: number; needed: number; ratio: number } {
  const current = getLevelForXp(xp);
  const next = getNextLevel(xp);
  if (!next) return { current: xp - current.minXp, needed: 0, ratio: 1 };
  const span = next.minXp - current.minXp;
  const progress = xp - current.minXp;
  return { current: progress, needed: span, ratio: Math.min(1, progress / span) };
}
