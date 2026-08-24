import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyMissionsState, MissionInstance, QuizMode, QuizSessionResult } from '../types';
import { MISSION_DAILY_BONUS_XP } from '../data/missions';
import { buildPlayerSnapshot, evaluateMissionDelta, generateDailyMissions } from '../utils/missionsEngine';
import { getTodayKey } from '../utils/questionGenerator';
import { useProfileStore } from './profileStore';

const RECENT_MODES_LIMIT = 8;

interface ApplyGameResultInput {
  result: QuizSessionResult;
  newlyRecognizedCodes: string[];
  masteryLevelUpCount: number;
}

interface MissionState {
  today: DailyMissionsState | null;
  recentModes: QuizMode[];
  totalCompleted: number;
  lastCompleted: MissionInstance[];
  lastBonusAwarded: boolean;
  ensureFreshDay: () => void;
  applyGameResult: (input: ApplyGameResultInput) => void;
  applyStudyEvent: (code: string) => void;
  clearLastCompleted: () => void;
  resetMissions: () => void;
}

// Applica il completamento (flag xpAwarded + accredito XP) ad una missione
// che ha appena raggiunto il target. Unico punto che "fa entrare" XP dalle
// Missioni nel profilo — stesso principio del canale unico descritto nella
// proposta tecnica.
function finalizeMission(mission: MissionInstance): { mission: MissionInstance; xpAwarded: number } {
  if (mission.xpAwarded) return { mission, xpAwarded: 0 };
  const updated: MissionInstance = { ...mission, xpAwarded: true };
  return { mission: updated, xpAwarded: updated.xpReward };
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      today: null,
      recentModes: [],
      totalCompleted: 0,
      lastCompleted: [],
      lastBonusAwarded: false,

      ensureFreshDay: () => {
        const dateKey = getTodayKey();
        const state = get();
        if (state.today && state.today.dateKey === dateKey) return;
        const snapshot = buildPlayerSnapshot(state.recentModes);
        const missions = generateDailyMissions(snapshot, dateKey);
        set({ today: { dateKey, missions, bonusAwarded: false, studiedCodes: [] } });
      },

      applyGameResult: ({ result, newlyRecognizedCodes, masteryLevelUpCount }) => {
        get().ensureFreshDay();
        const state = get();
        if (!state.today) return;

        let totalXp = 0;
        const newlyCompleted: MissionInstance[] = [];
        const ctx = { result, newlyRecognizedCodes, masteryLevelUpCount };

        const missions = state.today.missions.map((mission) => {
          if (mission.completed) return mission;
          const delta = evaluateMissionDelta(mission, ctx);
          if (delta <= 0) return mission;

          const progress = Math.min(mission.target, mission.progress + delta);
          const completed = progress >= mission.target;
          let updated: MissionInstance = { ...mission, progress, completed, completedAt: completed ? Date.now() : null };

          if (completed) {
            const finalized = finalizeMission(updated);
            updated = finalized.mission;
            totalXp += finalized.xpAwarded;
            newlyCompleted.push(updated);
          }
          return updated;
        });

        const allCompleted = missions.every((mission) => mission.completed);
        let bonusAwarded = state.today.bonusAwarded;
        let bonusJustAwarded = false;
        if (allCompleted && !bonusAwarded) {
          bonusAwarded = true;
          bonusJustAwarded = true;
          totalXp += MISSION_DAILY_BONUS_XP;
        }

        const recentModes = [...state.recentModes, result.mode].slice(-RECENT_MODES_LIMIT);

        set({
          today: { ...state.today, missions, bonusAwarded },
          recentModes,
          totalCompleted: state.totalCompleted + newlyCompleted.length,
          lastCompleted: newlyCompleted,
          lastBonusAwarded: bonusJustAwarded,
        });

        if (totalXp > 0) useProfileStore.getState().addXp(totalXp);
      },

      applyStudyEvent: (code: string) => {
        get().ensureFreshDay();
        const state = get();
        if (!state.today) return;
        if (state.today.studiedCodes.includes(code)) return;

        const studiedCodes = [...state.today.studiedCodes, code];
        const studyMission = state.today.missions.find((mission) => mission.category === 'study' && !mission.completed);

        if (!studyMission) {
          set({ today: { ...state.today, studiedCodes } });
          return;
        }

        const progress = Math.min(studyMission.target, studyMission.progress + 1);
        const completed = progress >= studyMission.target;
        let updatedMission: MissionInstance = {
          ...studyMission,
          progress,
          completed,
          completedAt: completed ? Date.now() : null,
        };

        let totalXp = 0;
        const newlyCompleted: MissionInstance[] = [];
        if (completed) {
          const finalized = finalizeMission(updatedMission);
          updatedMission = finalized.mission;
          totalXp += finalized.xpAwarded;
          newlyCompleted.push(updatedMission);
        }

        const missions = state.today.missions.map((mission) => (mission.id === updatedMission.id ? updatedMission : mission));
        const allCompleted = missions.every((mission) => mission.completed);
        let bonusAwarded = state.today.bonusAwarded;
        let bonusJustAwarded = false;
        if (allCompleted && !bonusAwarded) {
          bonusAwarded = true;
          bonusJustAwarded = true;
          totalXp += MISSION_DAILY_BONUS_XP;
        }

        set({
          today: { ...state.today, missions, studiedCodes, bonusAwarded },
          totalCompleted: state.totalCompleted + newlyCompleted.length,
          lastCompleted: newlyCompleted,
          lastBonusAwarded: bonusJustAwarded,
        });

        if (totalXp > 0) useProfileStore.getState().addXp(totalXp);
      },

      clearLastCompleted: () => set({ lastCompleted: [], lastBonusAwarded: false }),
      resetMissions: () => set({ today: null, recentModes: [], totalCompleted: 0, lastCompleted: [], lastBonusAwarded: false }),
    }),
    { name: 'flagquiz:v1:missions' },
  ),
);
