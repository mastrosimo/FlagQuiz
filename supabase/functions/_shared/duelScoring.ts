// Copia server-side, portabile (nessuna API browser/Deno-specifica oltre
// export/import standard), della sola logica necessaria per validare una
// risposta 1vs1 senza fidarsi del client: quale Paese e' quello corretto
// per un dato round (stesso seed/ordine del client) e quanti punti vale
// una risposta corretta.
//
// Non e' l'intero motore quiz: qui non servono nomi localizzati, capitali,
// distrattori o l'ordine delle opzioni mostrate (quelli restano puramente
// cosmetici lato client) — solo "qual e' il code giusto per il round i".
//
// Tenere sincronizzato a mano con le fonti originali se cambiano:
// - src/utils/shuffle.ts (seededShuffle)
// - src/utils/scoring.ts (computeAnswerScore, getComboMultiplier)
// - src/data/countries.ts (elenco codici Paese, stesso ordine)

// --- shuffle.ts (copia) -----------------------------------------------------

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const random = mulberry32(hashSeed(seed));
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// --- scoring.ts (copia) ------------------------------------------------------

const BASE_POINTS = 100;
const FAST_ANSWER_MS = 1500;
const FAST_BONUS = 80;
const QUICK_ANSWER_MS = 3000;
const QUICK_BONUS = 40;

const MULTIPLIER_TIERS: { streak: number; multiplier: number }[] = [
  { streak: 10, multiplier: 5 },
  { streak: 5, multiplier: 3 },
  { streak: 3, multiplier: 2 },
  { streak: 0, multiplier: 1 },
];

export function getComboMultiplier(streak: number): number {
  const tier = MULTIPLIER_TIERS.find((entry) => streak >= entry.streak);
  return tier?.multiplier ?? 1;
}

function getSpeedBonus(timeMs: number): number {
  if (timeMs < FAST_ANSWER_MS) return FAST_BONUS;
  if (timeMs < QUICK_ANSWER_MS) return QUICK_BONUS;
  return 0;
}

export function computeAnswerScore(correct: boolean, timeMs: number, streakAfterAnswer: number): number {
  if (!correct) return 0;
  const raw = BASE_POINTS + getSpeedBonus(timeMs);
  return raw * getComboMultiplier(streakAfterAnswer);
}

export function isFastAnswer(timeMs: number): boolean {
  return timeMs < FAST_ANSWER_MS;
}

// --- data/countries.ts (soli codici, stesso ordine del file sorgente) -------

export const COUNTRY_CODES: string[] = [
  'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE',
  'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK',
  'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA', 'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'IN', 'ID',
  'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS',
  'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE', 'DZ', 'AO', 'BJ',
  'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH',
  'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST',
  'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW', 'AG', 'BS', 'BB', 'BZ', 'CA', 'CR',
  'CU', 'DM', 'DO', 'SV', 'GD', 'GT', 'HT', 'HN', 'JM', 'MX', 'NI', 'PA', 'KN', 'LC', 'VC', 'TT', 'US', 'AR', 'BO',
  'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE', 'AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG',
  'WS', 'SB', 'TO', 'TV', 'VU',
];

/** Il codice del Paese "corretto" per il round `questionIndex` di una partita con seed `matchSeed` (oggi: il codice partita) — stesso principio di buildDailyChallenge/buildDuelQuestions lato client, ma senza generare le opzioni (irrilevanti per la validazione). */
export function getCorrectCodeForRound(matchSeed: string, questionCount: number, questionIndex: number): string {
  const pool = seededShuffle(COUNTRY_CODES, matchSeed).slice(0, questionCount);
  return pool[questionIndex];
}
