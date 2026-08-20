import type { Locale, TranslationKey, Translations } from './types';
import { it } from './it';
import { en } from './en';

export const DICTIONARIES: Record<Locale, Translations> = { it, en };

function getPath(dict: Translations, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((node, segment) => {
    if (node && typeof node === 'object' && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : undefined;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, token: string) =>
    token in params ? String(params[token]) : match,
  );
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const value = getPath(DICTIONARIES[locale], key) ?? getPath(DICTIONARIES.en, key) ?? key;
  return interpolate(value, params);
}
