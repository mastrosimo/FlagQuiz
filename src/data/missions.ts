import type {
  Continent,
  MissionCategory,
  MissionDifficulty,
  MissionGroup,
  MissionParams,
  PlayerSnapshot,
  QuizMode,
} from '../types';
import type { TranslationKey } from '../i18n/types';
import { COUNTRIES, CONTINENTS, countByContinent } from './countries';

export const MISSION_XP_BY_DIFFICULTY: Record<MissionDifficulty, number> = {
  easy: 50,
  medium: 75,
  hard: 100,
};

export const MISSION_DAILY_BONUS_XP = 50;
export const DAILY_MISSION_COUNT = 3;

export interface MissionDefinition {
  id: string;
  category: MissionCategory;
  group: MissionGroup;
  difficulty: MissionDifficulty;
  icon: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  isEligible: (snapshot: PlayerSnapshot) => boolean;
  resolveTarget: (snapshot: PlayerSnapshot) => number;
  resolveParams?: (snapshot: PlayerSnapshot) => MissionParams | undefined;
}

// Continente con il maggior numero di bandiere ancora da riconoscere per
// quello specifico giocatore — evita di proporre "Europa" a chi ha già
// completato l'Europa ma non l'Oceania.
function pickContinentWithMostRemaining(snapshot: PlayerSnapshot): { continent: Continent; remaining: number } | null {
  const recognizedSet = new Set(snapshot.recognizedCodes);
  let best: { continent: Continent; remaining: number } | null = null;
  for (const continent of CONTINENTS) {
    const total = countByContinent(continent);
    const recognized = COUNTRIES.filter((c) => c.continent === continent && recognizedSet.has(c.code)).length;
    const remaining = total - recognized;
    if (!best || remaining > best.remaining) best = { continent, remaining };
  }
  return best;
}

function clampTarget(preferred: number, min: number, max: number): number {
  return Math.max(min, Math.min(preferred, max));
}

// Tier 0/1/2 (principiante/intermedio/avanzato): combina livello XP,
// avanzamento collezione e precisione media recente. Formula semplice e
// dichiarata, non un punteggio "magico" — vedi proposta §5.
function getPlayerTier(snapshot: PlayerSnapshot): 0 | 1 | 2 {
  const collectionRatio = snapshot.collectionTotal > 0 ? snapshot.collectionCount / snapshot.collectionTotal : 0;
  const xpFactor = Math.min(3, snapshot.xp / 1000);
  const accuracyFactor = snapshot.averageAccuracy / 100;
  const score = xpFactor + collectionRatio * 3 + accuracyFactor * 3;
  if (score < 2.5) return 0;
  if (score < 5.5) return 1;
  return 2;
}

const MODE_ICON: Record<QuizMode, string> = {
  classic: '📝',
  time: '⏱️',
  fifty: '5️⃣',
  all: '🌍',
  hard: '🧠',
  survival: '💀',
  daily: '⚔️',
};

function modeDefinition(
  mode: Exclude<QuizMode, 'daily'>,
  difficulty: MissionDifficulty,
  titleKey: TranslationKey,
  descriptionKey: TranslationKey,
): MissionDefinition {
  return {
    id: `mode-${mode}`,
    category: 'mode',
    group: 'mode',
    difficulty,
    icon: MODE_ICON[mode],
    titleKey,
    descriptionKey,
    isEligible: () => true,
    resolveTarget: () => 1,
    resolveParams: () => ({ mode }),
  };
}

export const MISSION_DEFINITIONS: MissionDefinition[] = [
  // ---------- Gruppo: progressione (collezione + maestria) ----------
  {
    id: 'collection-new-flags',
    category: 'collection',
    group: 'progression',
    difficulty: 'easy',
    icon: '🎯',
    titleKey: 'missions.def.collectionNewFlagsTitle',
    descriptionKey: 'missions.def.collectionNewFlagsDescription',
    isEligible: (s) => s.collectionTotal - s.collectionCount >= 3,
    resolveTarget: (s) => clampTarget(5, 3, s.collectionTotal - s.collectionCount),
  },
  {
    id: 'collection-continent',
    category: 'continent',
    group: 'progression',
    difficulty: 'easy',
    icon: '🌍',
    titleKey: 'missions.def.collectionContinentTitle',
    descriptionKey: 'missions.def.collectionContinentDescription',
    isEligible: (s) => (pickContinentWithMostRemaining(s)?.remaining ?? 0) >= 3,
    resolveTarget: (s) => clampTarget(5, 3, pickContinentWithMostRemaining(s)?.remaining ?? 0),
    resolveParams: (s) => {
      const best = pickContinentWithMostRemaining(s);
      return best ? { continent: best.continent } : undefined;
    },
  },
  {
    id: 'mastery-advance',
    category: 'mastery',
    group: 'progression',
    difficulty: 'medium',
    icon: '🧠',
    titleKey: 'missions.def.masteryAdvanceTitle',
    descriptionKey: 'missions.def.masteryAdvanceDescription',
    isEligible: (s) => s.collectionTotal - s.masteredCount >= 1,
    resolveTarget: (s) => {
      const tier = getPlayerTier(s);
      const remaining = s.collectionTotal - s.masteredCount;
      return clampTarget([2, 3, 4][tier], 1, remaining);
    },
  },

  // ---------- Gruppo: gameplay ----------
  {
    id: 'gameplay-complete',
    category: 'gameplay-complete',
    group: 'gameplay',
    difficulty: 'easy',
    icon: '🎮',
    titleKey: 'missions.def.gameplayCompleteTitle',
    descriptionKey: 'missions.def.gameplayCompleteDescription',
    isEligible: () => true,
    resolveTarget: () => 1,
  },
  {
    id: 'gameplay-accuracy',
    category: 'gameplay-accuracy',
    group: 'gameplay',
    difficulty: 'medium',
    icon: '🏆',
    titleKey: 'missions.def.gameplayAccuracyTitle',
    descriptionKey: 'missions.def.gameplayAccuracyDescription',
    isEligible: () => true,
    resolveTarget: (s) => [70, 80, 90][getPlayerTier(s)],
  },
  {
    id: 'gameplay-combo',
    category: 'gameplay-combo',
    group: 'gameplay',
    difficulty: 'medium',
    icon: '🔥',
    titleKey: 'missions.def.gameplayComboTitle',
    descriptionKey: 'missions.def.gameplayComboDescription',
    isEligible: () => true,
    resolveTarget: (s) => [3, 5, 10][getPlayerTier(s)],
  },
  {
    id: 'gameplay-score',
    category: 'gameplay-score',
    group: 'gameplay',
    difficulty: 'hard',
    icon: '💯',
    titleKey: 'missions.def.gameplayScoreTitle',
    descriptionKey: 'missions.def.gameplayScoreDescription',
    isEligible: () => true,
    resolveTarget: (s) => [300, 600, 1000][getPlayerTier(s)],
  },
  {
    id: 'gameplay-correct',
    category: 'gameplay-correct',
    group: 'gameplay',
    difficulty: 'easy',
    icon: '✅',
    titleKey: 'missions.def.gameplayCorrectTitle',
    descriptionKey: 'missions.def.gameplayCorrectDescription',
    isEligible: () => true,
    resolveTarget: (s) => [10, 15, 25][getPlayerTier(s)],
  },
  {
    id: 'daily-challenge',
    category: 'daily-challenge',
    group: 'gameplay',
    difficulty: 'medium',
    icon: '⚔️',
    titleKey: 'missions.def.dailyChallengeTitle',
    descriptionKey: 'missions.def.dailyChallengeDescription',
    isEligible: (s) => s.dailyChallengeAvailable,
    resolveTarget: () => 1,
  },
  {
    id: 'study-flags',
    category: 'study',
    group: 'gameplay',
    difficulty: 'easy',
    icon: '📚',
    titleKey: 'missions.def.studyFlagsTitle',
    descriptionKey: 'missions.def.studyFlagsDescription',
    isEligible: () => true,
    resolveTarget: (s) => [5, 8, 10][getPlayerTier(s)],
  },

  // ---------- Gruppo: modalità ----------
  modeDefinition('classic', 'easy', 'missions.def.modeClassicTitle', 'missions.def.modeClassicDescription'),
  modeDefinition('time', 'easy', 'missions.def.modeTimeTitle', 'missions.def.modeTimeDescription'),
  modeDefinition('fifty', 'easy', 'missions.def.modeFiftyTitle', 'missions.def.modeFiftyDescription'),
  modeDefinition('all', 'medium', 'missions.def.modeAllTitle', 'missions.def.modeAllDescription'),
  modeDefinition('hard', 'medium', 'missions.def.modeHardTitle', 'missions.def.modeHardDescription'),
  modeDefinition('survival', 'medium', 'missions.def.modeSurvivalTitle', 'missions.def.modeSurvivalDescription'),
];

export { pickContinentWithMostRemaining, clampTarget, getPlayerTier };
