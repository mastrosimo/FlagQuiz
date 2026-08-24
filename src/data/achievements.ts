import type { Achievement, AchievementContext } from '../types';
import { COUNTRIES, countByContinent } from './countries';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    titleKey: 'achievements.firstGameTitle',
    descriptionKey: 'achievements.firstGameDescription',
    icon: '🏆',
    check: ({ stats }: AchievementContext) => stats.gamesPlayed >= 1,
  },
  {
    id: 'streak-10',
    titleKey: 'achievements.streak10Title',
    descriptionKey: 'achievements.streak10Description',
    icon: '🔥',
    check: ({ stats }: AchievementContext) => stats.bestStreak >= 10,
  },
  {
    id: 'precision-90',
    titleKey: 'achievements.precision90Title',
    descriptionKey: 'achievements.precision90Description',
    icon: '🎯',
    check: ({ stats }: AchievementContext) =>
      stats.questionsAnswered >= 20 &&
      stats.correctAnswers / stats.questionsAnswered >= 0.9,
  },
  {
    id: 'fast-10',
    titleKey: 'achievements.fast10Title',
    descriptionKey: 'achievements.fast10Description',
    icon: '⚡',
    check: ({ stats }: AchievementContext) => stats.fastAnswers >= 10,
  },
  {
    id: 'continent-europe',
    titleKey: 'achievements.continentEuropeTitle',
    descriptionKey: 'achievements.continentEuropeDescription',
    icon: '🇪🇺',
    check: ({ stats }: AchievementContext) =>
      stats.continentStats.Europe.correct >= countByContinent('Europe'),
  },
  {
    id: 'continent-africa',
    titleKey: 'achievements.continentAfricaTitle',
    descriptionKey: 'achievements.continentAfricaDescription',
    icon: '🌍',
    check: ({ stats }: AchievementContext) =>
      stats.continentStats.Africa.correct >= countByContinent('Africa'),
  },
  {
    id: 'continent-asia',
    titleKey: 'achievements.continentAsiaTitle',
    descriptionKey: 'achievements.continentAsiaDescription',
    icon: '🌏',
    check: ({ stats }: AchievementContext) =>
      stats.continentStats.Asia.correct >= countByContinent('Asia'),
  },
  {
    id: 'collection-first',
    titleKey: 'achievements.collectionFirstTitle',
    descriptionKey: 'achievements.collectionFirstDescription',
    icon: '🌍',
    check: ({ collectionCount }: AchievementContext) => collectionCount >= 1,
  },
  {
    id: 'collection-25',
    titleKey: 'achievements.collection25Title',
    descriptionKey: 'achievements.collection25Description',
    icon: '🌎',
    check: ({ collectionCount }: AchievementContext) => collectionCount >= 25,
  },
  {
    id: 'collection-50',
    titleKey: 'achievements.flags50Title',
    descriptionKey: 'achievements.flags50Description',
    icon: '🌎',
    check: ({ collectionCount }: AchievementContext) => collectionCount >= 50,
  },
  {
    id: 'collection-100',
    titleKey: 'achievements.flags100Title',
    descriptionKey: 'achievements.flags100Description',
    icon: '🌍',
    check: ({ collectionCount }: AchievementContext) => collectionCount >= 100,
  },
  {
    id: 'collection-complete',
    titleKey: 'achievements.collectionCompleteTitle',
    descriptionKey: 'achievements.collectionCompleteDescription',
    icon: '🏆',
    check: ({ collectionCount }: AchievementContext) => collectionCount >= COUNTRIES.length,
  },
  {
    id: 'mastery-first',
    titleKey: 'achievements.masteryFirstTitle',
    descriptionKey: 'achievements.masteryFirstDescription',
    icon: '🧠',
    check: ({ masteredCount }: AchievementContext) => masteredCount >= 1,
  },
  {
    id: 'mastery-10',
    titleKey: 'achievements.mastery10Title',
    descriptionKey: 'achievements.mastery10Description',
    icon: '🧠',
    check: ({ masteredCount }: AchievementContext) => masteredCount >= 10,
  },
  {
    id: 'mastery-50',
    titleKey: 'achievements.mastery50Title',
    descriptionKey: 'achievements.mastery50Description',
    icon: '🧠',
    check: ({ masteredCount }: AchievementContext) => masteredCount >= 50,
  },
  {
    id: 'mastery-complete',
    titleKey: 'achievements.masteryCompleteTitle',
    descriptionKey: 'achievements.masteryCompleteDescription',
    icon: '💎',
    check: ({ masteredCount }: AchievementContext) => masteredCount >= COUNTRIES.length,
  },
];
