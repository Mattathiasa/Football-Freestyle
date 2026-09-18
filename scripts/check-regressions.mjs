#!/usr/bin/env node
/**
 * Regression guard for the Football-Freestyle security and build fixes.
 *
 * The site was originally generated from an AI Studio template; if it is ever
 * regenerated, or if a fix gets reverted, this script will fail loudly with a
 * list of what slipped. Run via `npm run check`.
 *
 * Exits 0 when every invariant holds.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (p) => existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : '';
const missing = (p) => !existsSync(join(root, p));

const failures = [];
const ok = (name, cond, detail = '') => {
  if (cond) {
    console.log('  ok  ' + name);
  } else {
    failures.push(name + (detail ? ` — ${detail}` : ''));
    console.log(' FAIL ' + name + (detail ? ` — ${detail}` : ''));
  }
};

console.log('Football-Freestyle regression guard');
console.log('');

// ── Build-time Tailwind instead of the Play CDN ───────────────────────────
const html = read('index.html');
ok('index.html has no cdn.tailwindcss.com',
  !html.includes('cdn.tailwindcss.com'));
ok('index.html has no esm.sh import',
  !html.includes('esm.sh'));
ok('index.html has no importmap',
  !html.includes('importmap'));
ok('tailwind.config.cjs present',
  !missing('tailwind.config.cjs'));

// ── No API key injected into the client build ─────────────────────────────
const vite = read('vite.config.ts');
ok('vite.config.ts does not define API/KEY from env',
  !/define\s*:\s*\{[\s\S]*?(API_KEY|GEMINI|process\.env)/.test(vite));
ok('vite dev server bound to loopback',
  vite.includes('127.0.0.1'));
ok('vite base is the Pages subpath',
  vite.includes("base: '/Football-Freestyle/'"));

// ── No committed cloud credential URLs in source ──────────────────────────
const srcFiles = (p) => {
  if (missing(p)) return [];
  const walk = (dir) => {
    const out = [];
    for (const f of existsSync(dir) ? readdirSync(dir) : []) {
      const full = join(dir, f);
      if (f === 'node_modules' || f === 'dist') continue;
      const st = existsSync(full) ? statSync(full) : null;
      if (!st) continue;
      if (st.isDirectory()) out.push(...walk(full));
      else if (/\.(tsx|ts|js|css|html)$/.test(f)) out.push(full);
    }
    return out;
  };
  return walk(join(root, p));
};
let leak = '';
for (const f of srcFiles('.')) {
  const s = readFileSync(f, 'utf8');
  if (/dropbox(\.com|usercontent)|dl\.dropbox/i.test(s)) leak = f;
  const keyMatch = s.match(/"?[A-Z0-9_]{12,}"?\s*[:=]\s*["'](AIza[a-zA-Z0-9_-]{20,}|sk-[A-Za-z0-9]{20,})/);
  if (keyMatch) leak = f + ' (key-like literal)';
}
ok('no Dropbox URLs or key-like literals in source', !leak, leak);

// ── CSP + SEO metas present ───────────────────────────────────────────────
ok('CSP meta present in index.html', /Content-Security-Policy/.test(html));
ok('CSP meta does not ship frame-ancestors (ignored + logs errors)',
  !/frame-ancestors/.test(html));
ok('description meta present', /name="description"/.test(html));
ok('open graph / twitter metas present',
  /property="og:title"/.test(html) && /name="twitter:card"/.test(html));

// ── Deploy surface ────────────────────────────────────────────────────────
ok('public/robots.txt present', !missing('public/robots.txt'));
ok('public/favicon.svg present', !missing('public/favicon.svg'));
ok('.github/workflows/deploy.yml present', !missing('.github/workflows/deploy.yml'));

// ── Dead architecture that presented fake analytics ───────────────────────
ok('no dead PlayerBio component', missing('components/PlayerBio.tsx'));
ok('no dead PerformanceDashboard component', missing('components/PerformanceDashboard.tsx'));
ok('no dead Pitch component', missing('components/Pitch.tsx'));
ok('no dead StatsBar component', missing('components/StatsBar.tsx'));
ok('no charts/ directory', missing('components/charts'));
ok('no orphaned performance-dashboard.css', missing('styles/performance-dashboard.css'));

// ── Content honesty ───────────────────────────────────────────────────────
const constants = read('constants.tsx');
ok('no fabricated 150+ video count', !constants.includes('150+'));
ok('no duplicate video titles',
  !(() => {
    const titles = [...constants.matchAll(/"title": "([^"]+)"/g)].map((m) => m[1]);
    return titles.some((t) => titles.filter((x) => x === t).length > 1);
  })());

console.log('');
if (failures.length) {
  console.error(`Guard failed: ${failures.length} invariant(s) broken`);
  process.exit(1);
} else {
  console.log('All invariants hold.');
}