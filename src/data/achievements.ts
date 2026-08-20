import type { Achievement, ProfileStats } from '../types';
import { COUNTRIES } from './countries';

const countByContinent = (continent: string) =>
  COUNTRIES.filter((country) => country.continent === continent).length;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    title: 'Prima partita',
    description: 'Completa la tua prima partita',
    icon: '🏆',
    check: (stats: ProfileStats) => stats.gamesPlayed >= 1,
  },
  {
    id: 'streak-10',
    title: '10 risposte corrette consecutive',
    description: 'Ottieni una serie di 10 risposte corrette di fila',
    icon: '🔥',
    check: (stats: ProfileStats) => stats.bestStreak >= 10,
  },
  {
    id: 'flags-100',
    title: '100 bandiere riconosciute',
    description: 'Riconosci correttamente 100 bandiere in totale',
    icon: '🚩',
    check: (stats: ProfileStats) => stats.flagsRecognized >= 100,
  },
  {
    id: 'flags-500',
    title: '500 bandiere riconosciute',
    description: 'Riconosci correttamente 500 bandiere in totale',
    icon: '🌍',
    check: (stats: ProfileStats) => stats.flagsRecognized >= 500,
  },
  {
    id: 'precision-90',
    title: '90% di precisione',
    description: 'Raggiungi almeno il 90% di precisione (min. 20 risposte)',
    icon: '🎯',
    check: (stats: ProfileStats) =>
      stats.questionsAnswered >= 20 &&
      stats.correctAnswers / stats.questionsAnswered >= 0.9,
  },
  {
    id: 'continent-europe',
    title: 'Tutte le bandiere europee',
    description: 'Riconosci correttamente tutte le bandiere d\'Europa',
    icon: '🇪🇺',
    check: (stats: ProfileStats) =>
      stats.continentStats.Europe.correct >= countByContinent('Europe'),
  },
  {
    id: 'continent-africa',
    title: 'Tutte le bandiere africane',
    description: 'Riconosci correttamente tutte le bandiere d\'Africa',
    icon: '🌍',
    check: (stats: ProfileStats) =>
      stats.continentStats.Africa.correct >= countByContinent('Africa'),
  },
  {
    id: 'continent-asia',
    title: 'Tutte le bandiere asiatiche',
    description: 'Riconosci correttamente tutte le bandiere d\'Asia',
    icon: '🌏',
    check: (stats: ProfileStats) =>
      stats.continentStats.Asia.correct >= countByContinent('Asia'),
  },
];
