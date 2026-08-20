import type { Achievement, ProfileStats } from '../types';
import { COUNTRIES } from './countries';

const countByContinent = (continent: string) =>
  COUNTRIES.filter((country) => country.continent === continent).length;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    titleKey: 'achievements.firstGameTitle',
    descriptionKey: 'achievements.firstGameDescription',
    icon: '🏆',
    check: (stats: ProfileStats) => stats.gamesPlayed >= 1,
  },
  {
    id: 'streak-10',
    titleKey: 'achievements.streak10Title',
    descriptionKey: 'achievements.streak10Description',
    icon: '🔥',
    check: (stats: ProfileStats) => stats.bestStreak >= 10,
  },
  {
    id: 'flags-50',
    titleKey: 'achievements.flags50Title',
    descriptionKey: 'achievements.flags50Description',
    icon: '🌍',
    check: (stats: ProfileStats) => stats.flagsRecognized >= 50,
  },
  {
    id: 'flags-100',
    titleKey: 'achievements.flags100Title',
    descriptionKey: 'achievements.flags100Description',
    icon: '🚩',
    check: (stats: ProfileStats) => stats.flagsRecognized >= 100,
  },
  {
    id: 'flags-500',
    titleKey: 'achievements.flags500Title',
    descriptionKey: 'achievements.flags500Description',
    icon: '🌐',
    check: (stats: ProfileStats) => stats.flagsRecognized >= 500,
  },
  {
    id: 'precision-90',
    titleKey: 'achievements.precision90Title',
    descriptionKey: 'achievements.precision90Description',
    icon: '🎯',
    check: (stats: ProfileStats) =>
      stats.questionsAnswered >= 20 &&
      stats.correctAnswers / stats.questionsAnswered >= 0.9,
  },
  {
    id: 'fast-10',
    titleKey: 'achievements.fast10Title',
    descriptionKey: 'achievements.fast10Description',
    icon: '⚡',
    check: (stats: ProfileStats) => stats.fastAnswers >= 10,
  },
  {
    id: 'continent-europe',
    titleKey: 'achievements.continentEuropeTitle',
    descriptionKey: 'achievements.continentEuropeDescription',
    icon: '🇪🇺',
    check: (stats: ProfileStats) =>
      stats.continentStats.Europe.correct >= countByContinent('Europe'),
  },
  {
    id: 'continent-africa',
    titleKey: 'achievements.continentAfricaTitle',
    descriptionKey: 'achievements.continentAfricaDescription',
    icon: '🌍',
    check: (stats: ProfileStats) =>
      stats.continentStats.Africa.correct >= countByContinent('Africa'),
  },
  {
    id: 'continent-asia',
    titleKey: 'achievements.continentAsiaTitle',
    descriptionKey: 'achievements.continentAsiaDescription',
    icon: '🌏',
    check: (stats: ProfileStats) =>
      stats.continentStats.Asia.correct >= countByContinent('Asia'),
  },
];
