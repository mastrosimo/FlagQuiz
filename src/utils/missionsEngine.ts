import type { MissionGroup, MissionInstance, PlayerSnapshot, QuizMode, QuizSessionResult } from '../types';
import {
  DAILY_MISSION_COUNT,
  MISSION_DEFINITIONS,
  MISSION_XP_BY_DIFFICULTY,
  type MissionDefinition,
} from '../data/missions';
import { COUNTRIES, COUNTRY_BY_CODE } from '../data/countries';
import { useCollectionStore } from '../store/collectionStore';
import { useMasteryStore } from '../store/masteryStore';
import { useProfileStore } from '../store/profileStore';
import { getMasteredCount } from './mastery';
import { getTodayKey } from './questionGenerator';

// Legge lo snapshot del giocatore dagli store esistenti (nessun nuovo dato
// duplicato): collezione, maestria, XP e Sfida del Giorno restano l'unica
// fonte di verità, qui vengono solo letti.
export function buildPlayerSnapshot(recentModes: QuizMode[]): PlayerSnapshot {
  const profile = useProfileStore.getState();
  const collection = useCollectionStore.getState();
  const mastery = useMasteryStore.getState();

  const recentSessions = profile.stats.recentSessions;
  const averageAccuracy =
    recentSessions.length > 0
      ? recentSessions.reduce((sum, session) => sum + session.accuracy, 0) / recentSessions.length
      : 50;

  const dailyChallengeAvailable = !(
    profile.dailyChallenge.completed && profile.dailyChallenge.date === getTodayKey()
  );

  return {
    xp: profile.xp,
    recognizedCodes: collection.recognizedCodes,
    collectionCount: collection.recognizedCodes.length,
    collectionTotal: COUNTRIES.length,
    masteryCounts: mastery.counts,
    masteredCount: getMasteredCount(mastery.counts),
    averageAccuracy,
    dailyChallengeAvailable,
    recentModes,
  };
}

function resolveInstance(definition: MissionDefinition, snapshot: PlayerSnapshot, dateKey: string): MissionInstance {
  return {
    id: `${definition.id}:${dateKey}`,
    definitionId: definition.id,
    category: definition.category,
    group: definition.group,
    difficulty: definition.difficulty,
    icon: definition.icon,
    titleKey: definition.titleKey,
    descriptionKey: definition.descriptionKey,
    xpReward: MISSION_XP_BY_DIFFICULTY[definition.difficulty],
    target: definition.resolveTarget(snapshot),
    progress: 0,
    completed: false,
    completedAt: null,
    xpAwarded: false,
    params: definition.resolveParams?.(snapshot),
  };
}

function pickFromPool(
  pool: MissionDefinition[],
  snapshot: PlayerSnapshot,
  recentModes: QuizMode[],
  excludeIds: Set<string>,
): MissionDefinition | null {
  const eligible = pool.filter((def) => !excludeIds.has(def.id) && def.isEligible(snapshot));
  if (eligible.length === 0) return null;

  // Nel gruppo modalità, preferisce (senza escludere) le modalità non
  // giocate di recente, per favorire varietà reale nel tempo.
  const preferred = eligible.filter((def) => {
    const mode = def.resolveParams?.(snapshot)?.mode;
    return mode ? !recentModes.includes(mode) : true;
  });
  const candidates = preferred.length > 0 ? preferred : eligible;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Garantisce varietà "per costruzione": una missione da ciascuno dei 3 gruppi
// (progressione / gameplay / modalità). Se un gruppo non ha nulla di idoneo
// (caso limite), ripesca dal resto del pool idoneo per non scendere sotto 3.
export function generateDailyMissions(snapshot: PlayerSnapshot, dateKey: string): MissionInstance[] {
  const groups: MissionGroup[] = ['progression', 'gameplay', 'mode'];
  const excludeIds = new Set<string>();
  const chosenDefinitions: MissionDefinition[] = [];

  for (const group of groups) {
    const groupPool = MISSION_DEFINITIONS.filter((def) => def.group === group);
    const pick = pickFromPool(groupPool, snapshot, snapshot.recentModes, excludeIds);
    if (pick) {
      chosenDefinitions.push(pick);
      excludeIds.add(pick.id);
    }
  }

  while (chosenDefinitions.length < DAILY_MISSION_COUNT) {
    const pick = pickFromPool(MISSION_DEFINITIONS, snapshot, snapshot.recentModes, excludeIds);
    if (!pick) break;
    chosenDefinitions.push(pick);
    excludeIds.add(pick.id);
  }

  return chosenDefinitions.map((def) => resolveInstance(def, snapshot, dateKey));
}

export interface GameEventContext {
  result: QuizSessionResult;
  newlyRecognizedCodes: string[];
  masteryLevelUpCount: number;
}

// Funzione pura: quanto una singola missione avanza in base al risultato di
// UNA partita già completata. Non scrive nulla, non tocca alcuno store —
// stesso principio di src/utils/scoring.ts, riusabile in futuro anche
// server-side per validare le missioni senza duplicare questa logica.
export function evaluateMissionDelta(mission: MissionInstance, ctx: GameEventContext): number {
  if (mission.completed) return 0;
  const { result } = ctx;

  switch (mission.category) {
    case 'collection':
      return ctx.newlyRecognizedCodes.length;
    case 'continent':
      if (!mission.params?.continent) return 0;
      return ctx.newlyRecognizedCodes.filter(
        (code) => COUNTRY_BY_CODE[code]?.continent === mission.params?.continent,
      ).length;
    case 'mastery':
      return ctx.masteryLevelUpCount;
    case 'gameplay-complete':
      return 1;
    case 'gameplay-accuracy': {
      const percent = result.totalQuestions > 0 ? (result.correctCount / result.totalQuestions) * 100 : 0;
      return percent >= mission.target ? mission.target : 0;
    }
    case 'gameplay-combo':
      return Math.max(0, result.bestStreak - mission.progress);
    case 'gameplay-score':
      return Math.max(0, result.score - mission.progress);
    case 'gameplay-correct':
      return result.correctCount;
    case 'mode':
      return mission.params?.mode && result.mode === mission.params.mode ? 1 : 0;
    case 'daily-challenge':
      return result.mode === 'daily' ? 1 : 0;
    case 'study':
      return 0;
    default:
      return 0;
  }
}
