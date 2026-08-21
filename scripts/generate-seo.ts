/**
 * Post-build step: generates static, crawlable HTML pages for the locale-prefixed
 * SEO routes (home, continents, 195 countries × 2 languages) plus sitemap.xml.
 *
 * Runs after `vite build`. Reuses the existing dist/index.html as a template (same
 * built JS/CSS asset references) and the same country database / i18n dictionaries
 * used by the live app — no data duplication.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as flagStrings from 'country-flag-icons/string/3x2';
import { COUNTRIES, CONTINENTS } from '../src/data/countries';
import { translate } from '../src/i18n/translate';
import { SUPPORTED_LOCALES } from '../src/i18n/types';
import type { Locale } from '../src/i18n/types';
import type { Continent, Country } from '../src/types';
import { getContinentPath, getCountryPath } from '../src/seo/slugs';
import {
  absoluteUrl,
  buildCountryPageMeta,
  buildContinentPageMeta,
  getOtherCountries,
  getSortedCountriesByContinent,
} from '../src/seo/content';
import { buildCountryJsonLd, buildContinentJsonLd, buildHomeJsonLd } from '../src/seo/jsonLd';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const TEMPLATE_PATH = join(DIST_DIR, 'index.html');

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface PageMeta {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  alternatePath: string;
  jsonLd: object;
  bodyHtml: string;
}

function otherLocaleOf(locale: Locale): Locale {
  return locale === 'it' ? 'en' : 'it';
}

function renderTemplate(template: string, meta: PageMeta): string {
  const url = absoluteUrl(meta.path);
  const alternateUrl = absoluteUrl(meta.alternatePath);
  const xDefaultUrl = absoluteUrl(meta.locale === 'it' ? meta.alternatePath : meta.path);
  const ogLocale = meta.locale === 'it' ? 'it_IT' : 'en_US';

  let html = template;
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${meta.locale}"`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  );
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  html = html.replace(
    /<link rel="alternate" hreflang="it" href="[^"]*" \/>/,
    `<link rel="alternate" hreflang="it" href="${meta.locale === 'it' ? url : alternateUrl}" />`,
  );
  html = html.replace(
    /<link rel="alternate" hreflang="en" href="[^"]*" \/>/,
    `<link rel="alternate" hreflang="en" href="${meta.locale === 'en' ? url : alternateUrl}" />`,
  );
  html = html.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/,
    `<link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
  );
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(
    /<meta property="og:locale" content="[^"]*" \/>/,
    `<meta property="og:locale" content="${ogLocale}" />`,
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  );

  const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`;
  html = html.replace('</head>', `${jsonLdScript}\n  </head>`);

  html = html.replace('<div id="root"></div>', `<div id="root">${meta.bodyHtml}</div>`);

  return html;
}

function flagSvg(code: string, className: string): string {
  const svg = (flagStrings as Record<string, string | undefined>)[code];
  if (!svg) return '';
  return svg.replace('<svg', `<svg class="${className}"`);
}

function factCard(label: string, value: string): string {
  return `<div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><dt class="text-xs font-medium text-slate-500 dark:text-slate-400">${escapeHtml(label)}</dt><dd class="font-semibold text-slate-800 dark:text-slate-100">${escapeHtml(value)}</dd></div>`;
}

const DIFFICULTY_KEYS = { easy: 'difficulty.easy', medium: 'difficulty.medium', hard: 'difficulty.hard' } as const;

function buildCountryBody(country: Country, locale: Locale): string {
  const meta = buildCountryPageMeta(country, locale);
  const continentLabel = translate(locale, `continents.${country.continent}`);
  const continentPath = getContinentPath(country.continent, locale);
  const otherCountries = getOtherCountries(country, locale);
  const home = translate(locale, 'seo.breadcrumbHome');

  const facts = [
    factCard(translate(locale, 'learn.continent'), continentLabel),
    factCard(translate(locale, 'learn.capital'), country.capital[locale]),
    factCard(translate(locale, 'learn.isoCode'), country.code),
    factCard(translate(locale, 'learn.difficulty'), translate(locale, DIFFICULTY_KEYS[country.difficulty])),
  ].join('');

  const otherLinks = otherCountries
    .map(
      (other) =>
        `<a href="${getCountryPath(other, locale)}" class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">${escapeHtml(other.name[locale])}</a>`,
    )
    .join('');

  return `
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav class="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <a href="/${locale}">${escapeHtml(home)}</a><span>/</span>
        <a href="${continentPath}">${escapeHtml(continentLabel)}</a><span>/</span>
        <span class="font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(country.name[locale])}</span>
      </nav>
      <div class="text-center">
        <div class="mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex aspect-[3/2] items-center justify-center bg-slate-100 p-4 dark:bg-slate-800">
            ${flagSvg(country.code, 'h-full w-full rounded-xl object-cover shadow-md')}
          </div>
        </div>
        <h1 class="mt-5 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">${meta.flagEmoji} ${escapeHtml(country.name[locale])}</h1>
        <p class="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">${escapeHtml(meta.flagDescription)}</p>
      </div>
      <div class="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <h2 class="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(translate(locale, 'seo.factsHeading'))}</h2>
        <dl class="grid grid-cols-2 gap-3 text-left text-sm sm:grid-cols-4">${facts}</dl>
      </div>
      <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="/quiz" class="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">${escapeHtml(translate(locale, 'seo.goToQuiz'))}</a>
        <a href="/learn" class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-white">${escapeHtml(translate(locale, 'seo.goToLearn'))}</a>
      </div>
      <h2 class="mt-10 mb-3 text-center font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(translate(locale, 'seo.otherCountriesHeading'))}</h2>
      <div class="flex flex-wrap justify-center gap-2">${otherLinks}</div>
    </div>`;
}

function buildContinentBody(continent: Continent, locale: Locale): string {
  const meta = buildContinentPageMeta(continent, locale);
  const continentLabel = translate(locale, `continents.${continent}`);
  const countries = getSortedCountriesByContinent(continent, locale);
  const home = translate(locale, 'seo.breadcrumbHome');

  const cards = countries
    .map(
      (country) => `
      <a href="${getCountryPath(country, locale)}" class="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        ${flagSvg(country.code, 'aspect-[3/2] w-full rounded-lg object-cover')}
        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(country.name[locale])}</span>
      </a>`,
    )
    .join('');

  return `
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav class="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <a href="/${locale}">${escapeHtml(home)}</a><span>/</span>
        <span class="font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(continentLabel)}</span>
      </nav>
      <h1 class="text-center font-display text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">🌍 ${escapeHtml(continentLabel)}</h1>
      <p class="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-300">${escapeHtml(meta.description)}</p>
      <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="/quiz" class="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">${escapeHtml(translate(locale, 'seo.goToQuiz'))}</a>
        <a href="/learn" class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-white">${escapeHtml(translate(locale, 'seo.goToLearn'))}</a>
      </div>
      <h2 class="mt-10 mb-4 text-center font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(translate(locale, 'seo.continentCountriesHeading'))}</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">${cards}</div>
    </div>`;
}

function buildHomeBody(locale: Locale): string {
  const intro = translate(locale, 'seo.homeIntro');
  const continentCards = CONTINENTS.map(
    (continent) => `
    <a href="${getContinentPath(continent, locale)}" class="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
      <p class="font-display font-bold text-slate-900 dark:text-white">${escapeHtml(translate(locale, `continents.${continent}`))}</p>
    </a>`,
  ).join('');

  return `
    <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <section class="text-center">
        <h1 class="font-display text-5xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white">🚩 FLAGQUIZ</h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">${escapeHtml(intro)}</p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/quiz" class="rounded-xl bg-brand-600 px-10 py-4 text-xl font-semibold text-white">${escapeHtml(translate(locale, 'home.startButton'))}</a>
          <a href="/learn" class="rounded-xl border border-slate-200 px-8 py-4 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">${escapeHtml(translate(locale, 'seo.goToLearn'))}</a>
        </div>
      </section>
      <section class="mt-14">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">${continentCards}</div>
      </section>
    </div>`;
}

interface SitemapEntry {
  path: string;
  alternates: { locale: Locale; path: string }[];
}

function main() {
  if (!existsSync(TEMPLATE_PATH)) {
    console.error('dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }
  const template = readFileSync(TEMPLATE_PATH, 'utf8');
  const sitemapEntries: SitemapEntry[] = [];

  function writePage(outPath: string, meta: PageMeta) {
    const html = renderTemplate(template, meta);
    const fullDir = join(DIST_DIR, outPath);
    mkdirSync(fullDir, { recursive: true });
    writeFileSync(join(fullDir, 'index.html'), html, 'utf8');
  }

  // Locale homepages
  for (const locale of SUPPORTED_LOCALES) {
    const other = otherLocaleOf(locale);
    const path = `/${locale}`;
    writePage(path, {
      locale,
      title: translate(locale, 'meta.title'),
      description: translate(locale, 'meta.description'),
      path,
      alternatePath: `/${other}`,
      jsonLd: buildHomeJsonLd(locale),
      bodyHtml: buildHomeBody(locale),
    });
    sitemapEntries.push({
      path,
      alternates: [
        { locale, path },
        { locale: other, path: `/${other}` },
      ],
    });
  }

  // Continent pages
  for (const continent of CONTINENTS) {
    for (const locale of SUPPORTED_LOCALES) {
      const other = otherLocaleOf(locale);
      const meta = buildContinentPageMeta(continent, locale);
      writePage(meta.path, {
        locale,
        title: meta.title,
        description: meta.description,
        path: meta.path,
        alternatePath: meta.alternatePath,
        jsonLd: buildContinentJsonLd(continent, locale),
        bodyHtml: buildContinentBody(continent, locale),
      });
      sitemapEntries.push({
        path: meta.path,
        alternates: [
          { locale, path: meta.path },
          { locale: other, path: meta.alternatePath },
        ],
      });
    }
  }

  // Country pages
  for (const country of COUNTRIES) {
    for (const locale of SUPPORTED_LOCALES) {
      const other = otherLocaleOf(locale);
      const meta = buildCountryPageMeta(country, locale);
      writePage(meta.path, {
        locale,
        title: meta.title,
        description: meta.description,
        path: meta.path,
        alternatePath: meta.alternatePath,
        jsonLd: buildCountryJsonLd(country, locale),
        bodyHtml: buildCountryBody(country, locale),
      });
      sitemapEntries.push({
        path: meta.path,
        alternates: [
          { locale, path: meta.path },
          { locale: other, path: meta.alternatePath },
        ],
      });
    }
  }

  // Sitemap: root + one entry per locale for every home/continent/country page,
  // each self-referencing plus pointing to its language alternate.
  const urlEntries: string[] = [];
  urlEntries.push(sitemapXmlUrl('/', [
    { locale: 'it', path: '/it' },
    { locale: 'en', path: '/en' },
  ]));
  for (const entry of sitemapEntries) {
    urlEntries.push(sitemapXmlUrl(entry.path, entry.alternates));
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries.join('\n')}\n</urlset>\n`;
  writeFileSync(join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf8');

  const totalPages = 2 + CONTINENTS.length * 2 + COUNTRIES.length * 2;
  console.log(`✓ Generated ${totalPages} static SEO pages + sitemap.xml (${urlEntries.length} sitemap URLs).`);
}

function sitemapXmlUrl(path: string, alternates: { locale: Locale; path: string }[]): string {
  const links = alternates
    .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${absoluteUrl(alt.path)}" />`)
    .join('\n');
  return `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n${links}\n  </url>`;
}

main();
