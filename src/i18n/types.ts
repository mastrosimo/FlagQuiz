export const SUPPORTED_LOCALES = ['it', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export interface LocaleMeta {
  code: Locale;
  flag: string;
  label: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  it: { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  en: { code: 'en', flag: '🇬🇧', label: 'English' },
};

export interface Translations {
  meta: {
    title: string;
    description: string;
  };
  seo: {
    countryTitle: string;
    countryDescription: string;
    continentTitle: string;
    breadcrumbHome: string;
    breadcrumbLearn: string;
    factsHeading: string;
    otherCountriesHeading: string;
    continentCountriesHeading: string;
    goToQuiz: string;
    goToLearn: string;
    backToContinent: string;
    homeIntro: string;
  };
  nav: {
    home: string;
    quiz: string;
    learn: string;
    stats: string;
    achievementsTooltip: string;
    openMenu: string;
    closeMenu: string;
    primaryNav: string;
    mobileNav: string;
  };
  footer: {
    tagline: string;
    quiz: string;
    learn: string;
    stats: string;
    achievements: string;
    settings: string;
  };
  theme: {
    toggleToDark: string;
    toggleToLight: string;
  };
  language: {
    label: string;
  };
  home: {
    subtitle: string;
    startButton: string;
    streakOne: string;
    streakOther: string;
    dailyChallengeTitle: string;
    dailyChallengeDescription: string;
    dailyChallengeDone: string;
    modesHeading: string;
    statsHeading: string;
    newUserTitle: string;
    newUserDescription: string;
    statBestScore: string;
    statBestStreak: string;
    statLevel: string;
    statXp: string;
    statGames: string;
  };
  quizSetup: {
    title: string;
    subtitle: string;
    stepMode: string;
    stepDifficulty: string;
    stepContinent: string;
    stepQuestionCount: string;
    allContinents: string;
    readyText: string;
    startButton: string;
  };
  quizPlay: {
    question: string;
    preparing: string;
    questionProgress: string;
    correct: string;
    wrong: string;
    bestLabel: string;
    flagAlt: string;
  };
  dailyChallenge: {
    title: string;
    intro: string;
    startButton: string;
    doneTitle: string;
    doneSubtitle: string;
    points: string;
    correct: string;
    accuracy: string;
    backHome: string;
  };
  results: {
    completed: string;
    points: string;
    correctAnswers: string;
    accuracy: string;
    bestStreak: string;
    time: string;
    xpGained: string;
    replay: string;
    backHome: string;
    judgmentMaster: string;
    judgmentGreat: string;
    judgmentGood: string;
    judgmentOk: string;
    judgmentBad: string;
  };
  share: {
    button: string;
    copied: string;
    text: string;
  };
  modes: {
    classicLabel: string;
    classicDescription: string;
    timeLabel: string;
    timeDescription: string;
    fiftyLabel: string;
    fiftyDescription: string;
    allLabel: string;
    allDescription: string;
    hardLabel: string;
    hardDescription: string;
    survivalLabel: string;
    survivalDescription: string;
  };
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
    mixed: string;
    all: string;
  };
  continents: {
    Europe: string;
    Asia: string;
    Africa: string;
    NorthAmerica: string;
    SouthAmerica: string;
    Oceania: string;
  };
  continentIntros: {
    Europe: string;
    Asia: string;
    Africa: string;
    NorthAmerica: string;
    SouthAmerica: string;
    Oceania: string;
  };
  learn: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchLabel: string;
    allContinents: string;
    flagsCount: string;
    continent: string;
    capital: string;
    isoCode: string;
    difficulty: string;
    filterAll: string;
    filterRecognized: string;
    filterUnrecognized: string;
    recognizedBadge: string;
    notRecognizedYet: string;
    playToAddDescription: string;
    playNow: string;
  };
  collection: {
    title: string;
    percentComplete: string;
    completeTitle: string;
    completeSubtitle: string;
    continentProgressHeading: string;
  };
  mastery: {
    levelDiscovered: string;
    levelKnown: string;
    levelExpert: string;
    levelMaster: string;
    sectionTitle: string;
    globalTitle: string;
    percentComplete: string;
    totalWithAnswers: string;
    masteredFlags: string;
    remainingToNext: string;
    completedLabel: string;
    filterAll: string;
    filterNone: string;
    filterDiscovered: string;
    filterKnown: string;
    filterExpert: string;
    filterMaster: string;
    levelUpTitle: string;
    levelUpMasterTitle: string;
    levelUpAnswersCount: string;
    homeSubtitle: string;
  };
  stats: {
    title: string;
    gamesPlayed: string;
    questionsAnswered: string;
    correctAnswers: string;
    accuracy: string;
    bestScore: string;
    bestStreak: string;
    flagsRecognized: string;
    totalXp: string;
    level: string;
    continentAccuracyHeading: string;
    noData: string;
    recentGamesHeading: string;
    emptyChart: string;
    chartAccuracy: string;
    chartScore: string;
  };
  achievements: {
    title: string;
    unlockedCount: string;
    unlocked: string;
    locked: string;
    toastLabel: string;
    firstGameTitle: string;
    firstGameDescription: string;
    streak10Title: string;
    streak10Description: string;
    flags50Title: string;
    flags50Description: string;
    flags100Title: string;
    flags100Description: string;
    collectionFirstTitle: string;
    collectionFirstDescription: string;
    collection25Title: string;
    collection25Description: string;
    collectionCompleteTitle: string;
    collectionCompleteDescription: string;
    precision90Title: string;
    precision90Description: string;
    fast10Title: string;
    fast10Description: string;
    continentEuropeTitle: string;
    continentEuropeDescription: string;
    continentAfricaTitle: string;
    continentAfricaDescription: string;
    continentAsiaTitle: string;
    continentAsiaDescription: string;
    masteryFirstTitle: string;
    masteryFirstDescription: string;
    mastery10Title: string;
    mastery10Description: string;
    mastery50Title: string;
    mastery50Description: string;
    masteryCompleteTitle: string;
    masteryCompleteDescription: string;
  };
  levels: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
    level6: string;
    level7: string;
  };
  levelProgress: {
    levelLabel: string;
    max: string;
    xpProgress: string;
  };
  lives: {
    remaining: string;
  };
  settings: {
    title: string;
    darkModeLabel: string;
    darkModeDescription: string;
    soundLabel: string;
    soundDescription: string;
    resetTitle: string;
    resetDescription: string;
    resetButton: string;
    confirmTitle: string;
    confirmDescription: string;
    cancel: string;
    confirmButton: string;
  };
  a11y: {
    loading: string;
  };
}

export type DotPaths<T> = {
  [K in Extract<keyof T, string>]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`;
}[Extract<keyof T, string>];

export type TranslationKey = DotPaths<Translations>;
