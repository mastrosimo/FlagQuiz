import type { TranslationKey } from '../i18n/types';

export type BotDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export const BOT_DIFFICULTY_ORDER: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];

export interface BotBehaviorConfig {
  /** Probabilità che il bot risponda correttamente. */
  accuracy: number;
  minDelayMs: number;
  maxDelayMs: number;
}

/**
 * Unica fonte di verità per quanto è "bravo" e "veloce" il computer.
 * Sostituisce le vecchie costanti fisse MOCK_OPPONENT_* (usate anche dal
 * flusso "sfida un amico", che ora ricade sul livello 'medium' di default).
 */
export const BOT_DIFFICULTY_CONFIG: Record<BotDifficulty, BotBehaviorConfig> = {
  easy: { accuracy: 0.45, minDelayMs: 2600, maxDelayMs: 6000 },
  medium: { accuracy: 0.65, minDelayMs: 1600, maxDelayMs: 4200 },
  hard: { accuracy: 0.82, minDelayMs: 900, maxDelayMs: 3000 },
  expert: { accuracy: 0.93, minDelayMs: 500, maxDelayMs: 1800 },
};

export const BOT_DIFFICULTY_ICON: Record<BotDifficulty, string> = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴',
  expert: '💀',
};

export const BOT_DIFFICULTY_LABEL_KEY: Record<BotDifficulty, TranslationKey> = {
  easy: 'duel.bot.difficultyEasyLabel',
  medium: 'duel.bot.difficultyMediumLabel',
  hard: 'duel.bot.difficultyHardLabel',
  expert: 'duel.bot.difficultyExpertLabel',
};

export const BOT_DIFFICULTY_DESCRIPTION_KEY: Record<BotDifficulty, TranslationKey> = {
  easy: 'duel.bot.difficultyEasyDescription',
  medium: 'duel.bot.difficultyMediumDescription',
  hard: 'duel.bot.difficultyHardDescription',
  expert: 'duel.bot.difficultyExpertDescription',
};

export function isBotDifficulty(value: string | undefined): value is BotDifficulty {
  return value != null && (BOT_DIFFICULTY_ORDER as string[]).includes(value);
}

// Nome interno del bot: come per gli altri nomi del transport, volutamente
// non tradotto qui (il transport non ha accesso a `t()`) — la UI mostra
// invece `t('duel.bot.opponentName')` quando `match.botDifficulty` è impostato.
export const BOT_NAME = 'Computer';
