/**
 * Structural + semantics + metadata audit of the built site.
 * Checks: duplicate class definitions across stylesheets, orphaned custom
 * properties in live CSS, meta/OG/canonical correctness, sitemap/robots.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const issues = [];
const note = (m) => issues.push(m);

/* ---------- 1. Duplicate selectors across live stylesheets ---------- */
const liveFiles = ['tokens.css', 'base.css', 'chrome.css', 'components.css', 'pages.css', 'detail.css', 'content.css', 'fonts.css'];
const selectorOwner = new Map();
for (const f of liveFiles) {
  let css;
  try {
    css = await readFile(path.join(root, 'src/styles', f), 'utf8');
  } catch {
    continue;
  }
  // crude: top-level class selectors anywhere (media queries included)
  const matches = [...css.matchAll(/^([^{}@/][^{}]*)\{/gm)];
  for (const m of matches) {
    const sel = m[1].trim();
    if (!sel.startsWith('.')) continue;
    // only the first class token, to flag component-level duplication
    const key = (sel.match(/^\.[a-z][a-z0-9_-]*/i) || [])[0];
    if (!key) continue;
    if (!selectorOwner.has(key)) selectorOwner.set(key, new Set());
    selectorOwner.get(key).add(f);
  }
}
const dupes = [...selectorOwner.entries()]
  .filter(([, files]) => files.size > 2)
  .map(([sel, files]) => `${sel} defined across ${[...files].join(', ')}`);
console.log(`Selectors defined in 3+ live stylesheets: ${dupes.length}`);
if (dupes.length) console.log(dupes.slice(0, 12).map((d) => '  ' + d).join('\n'));

/* ---------- 2. Orphan custom properties in live CSS ---------- */
const defined = new Set();
const used = new Set();
for (const f of liveFiles) {
  const css = await readFile(path.join(root, 'src/styles', f), 'utf8').catch(() => '');
  for (const m of css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)) defined.add(m[1]);
  for (const m of css.matchAll(/var\((--[a-z0-9-]+)/g)) used.add(m[1]);
}
// component-inline vars are declared on elements; allow a known list
const elementVars = new Set(['--reveal-delay', '--progress', '--i']);
const orphans = [...used].filter((v) => !defined.has(v) && !elementVars.has(v));
console.log(`\nUndefined custom properties referenced in live CSS: ${orphans.length}`);
if (orphans.length) console.log('  ' + orphans.join(', '));

/* ---------- 3. Unused tokens ---------- */
const unusedTokens = [...defined].filter((v) => !used.has(v));
console.log(`\nDefined-but-unused tokens: ${unusedTokens.length}`);
if (unusedTokens.length) console.log('  ' + unusedTokens.slice(0, 25).join(', '));

/* ---------- 4. Metadata on every built page ---------- */
const dist = path.join(root, 'dist');
const walk = async (dir) => {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
};
const files = (await walk(dist)).filter((f) => f.endsWith('.html'));
const titles = new Map();
const descs = new Map();
for (const f of files) {
  const html = await readFile(f, 'utf8');
  const rel = '/' + path.relative(dist, f).replace(/index\.html$/, '');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  const ogImage = (html.match(/<meta property="og:image" content="([^"]*)"/) || [])[1] || '';
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!noindex) {
    if (!title) note(`${rel}: missing title`);
    if (!desc) note(`${rel}: missing description`);
    if (!canonical) note(`${rel}: missing canonical`);
    if (!ogImage) note(`${rel}: missing og:image`);
    if (canonical && !canonical.startsWith('https://dikaglorya.github.io')) note(`${rel}: canonical origin wrong (${canonical})`);
    titles.set(title, (titles.get(title) || 0) + 1);
    descs.set(desc, (descs.get(desc) || 0) + 1);
  }
  // lang + viewport
  if (!/<html lang="[a-z-]+"/.test(html)) note(`${rel}: missing lang`);
  if (!/name="viewport" content="[^"]*width=device-width/.test(html)) note(`${rel}: viewport missing device-width`);
}
const dupTitles = [...titles].filter(([, c]) => c > 1);
const dupDescs = [...descs].filter(([, c]) => c > 1);
console.log(`\nPages: ${files.length}. Duplicate titles: ${dupTitles.length}, duplicate descriptions: ${dupDescs.length}`);
if (dupTitles.length) console.log('  ' + dupTitles.map(([t, c]) => `${c}x "${t.slice(0, 50)}"`).join('\n  '));
if (dupDescs.length) console.log('  ' + dupDescs.map(([t, c]) => `${c}x "${t.slice(0, 50)}"`).join('\n  '));

console.log(`\nMetadata/semantic issues: ${issues.length}`);
issues.slice(0, 20).forEach((i) => console.log('  - ' + i));
