/**
 * Master audit: renders the real build at every target viewport and reports
 * overflow, console errors, failed requests, touch-target sizes, and reveals.
 *
 *   node scripts/audit-master.mjs [--base http://127.0.0.1:4321] [--shots dir]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const BASE = arg('--base', 'http://127.0.0.1:4321');
const SHOTS = arg('--shots', '/tmp/master-shots');
// /404.html, not /404/: the built file is dist/404.html, so requesting the
// directory returns a 404 status and logs a console error that is not a defect.
const PAGES = (arg('--pages', '/,/projects/,/projects/dikaroute/,/about/,/services/,/contact/,/journal/,/404.html') || '')
  .split(',')
  .filter(Boolean);

const VIEWPORTS = [
  { w: 320, h: 720, name: '320' },
  { w: 360, h: 800, name: '360' },
  { w: 375, h: 812, name: '375' },
  { w: 390, h: 844, name: '390', touch: true },
  { w: 414, h: 896, name: '414' },
  { w: 430, h: 932, name: '430' },
  { w: 480, h: 900, name: '480' },
  { w: 768, h: 1024, name: '768' },
  { w: 1024, h: 768, name: '1024' },
  { w: 1280, h: 800, name: '1280' },
  { w: 1440, h: 900, name: '1440' },
  { w: 1920, h: 1080, name: '1920' },
  { w: 2560, h: 1440, name: '2560' },
];

await mkdir(SHOTS, { recursive: true });

const browser = await chromium.launch();

const report = { base: BASE, pages: {}, timestamp: new Date().toISOString(), totals: {} };
let overflowTotal = 0;
let consoleTotal = 0;
let failedTotal = 0;

for (const pagePath of PAGES) {
  const pageKey = pagePath || '/';
  report.pages[pageKey] = { viewports: {}, console: [], failed: [] };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 1,
      isMobile: Boolean(vp.touch),
      hasTouch: Boolean(vp.touch),
      colorScheme: 'dark',
      reducedMotion: 'no-preference',
    });
    const page = await ctx.newPage();
    const consoleErrors = [];
    const failed = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300));
    });
    page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR ${err.message}`.slice(0, 300)));
    page.on('requestfailed', (r) => failed.push(`${r.url().slice(0, 160)} ${r.failure()?.errorText}`));

    const url = `${BASE}${pagePath}`;
    let status = 0;
    try {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      status = res?.status() ?? 0;
      await page.waitForTimeout(500);
    } catch (e) {
      consoleErrors.push(`GOTO ${e.message}`);
    }

    const metrics = await page
      .evaluate(() => {
        const de = document.documentElement;
        const scrollW = de.scrollWidth;
        const clientW = de.clientWidth;
        const vw = window.innerWidth;

        // Elements whose box exceeds the viewport on the right or left.
        const offenders = [];
        const all = document.querySelectorAll('body *');
        for (const el of all) {
          const style = getComputedStyle(el);
          if (style.position === 'fixed') continue;
          if (style.display === 'none' || style.visibility === 'hidden') continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          const isDeco = el.closest('[aria-hidden="true"]');
          if (r.right > clientW + 1 || r.left < -1) {
            if (!isDeco) {
              offenders.push({
                sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
                  ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
                  : ''),
                left: Math.round(r.left),
                right: Math.round(r.right),
                w: Math.round(r.width),
              });
            }
          }
        }

        // Small touch targets inside interactive elements. Only meaningful when
        // the emulated device is actually touch: desktop nav pills are 34px by
        // design for mouse pointers and grow to 44px under (pointer: coarse).
        const small = [];
        const coarse = matchMedia('(pointer: coarse)').matches;
        const interactive = document.querySelectorAll(
          'a[href], button, input, select, textarea, [role="button"]',
        );
        for (const el of interactive) {
          if (!coarse) break;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (el.closest('main a') && el.closest('p, li, dd') && el.tagName === 'A') {
            // inline text links are exempt: they get extra spacing instead
            continue;
          }
          if (r.height < 44 || r.width < 24) {
            small.push({
              t: el.tagName.toLowerCase(),
              label: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 32),
              w: Math.round(r.width),
              h: Math.round(r.height),
            });
          }
        }

        // Content hidden by reveal animations.
        const hidden = [...document.querySelectorAll('[data-reveal]')].filter((el) => {
          const s = getComputedStyle(el);
          return parseFloat(s.opacity) < 0.05 && !el.classList.contains('is-in');
        }).length;

        return {
          scrollW,
          clientW,
          vw,
          overflow: scrollW > clientW + 1,
          overflowPx: Math.max(0, scrollW - clientW),
          offenders: offenders.slice(0, 6),
          small: small.slice(0, 8),
          smallCount: small.length,
          revealsHidden: hidden,
          title: document.title.slice(0, 70),
          h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 80),
        };
      })
      .catch((e) => ({ error: String(e) }));

    if (metrics.overflow) overflowTotal++;
    consoleTotal += consoleErrors.length;
    failedTotal += failed.length;

    report.pages[pageKey].viewports[vp.name] = {
      status,
      ...metrics,
      consoleErrors: [...new Set(consoleErrors)].slice(0, 5),
      failed: [...new Set(failed)].slice(0, 5),
    };

    if (pagePath === '/' || pagePath === '/projects/') {
      await page
        .screenshot({ path: path.join(SHOTS, `${pageKey.replace(/\//g, '_') || 'home'}-${vp.name}.png`), fullPage: false })
        .catch(() => {});
    }

    await ctx.close();
  }
}

report.totals = { overflowTotal, consoleTotal, failedTotal, viewports: VIEWPORTS.length * PAGES.length };
await browser.close();

const out = path.join(SHOTS, 'audit.json');
const { writeFile } = await import('node:fs/promises');
await writeFile(out, JSON.stringify(report, null, 2));

// Console summary
console.log(`\n=== MASTER AUDIT ${BASE} ===`);
console.log(`viewports tested: ${report.totals.viewports}`);
for (const [p, data] of Object.entries(report.pages)) {
  for (const [vpName, m] of Object.entries(data.viewports)) {
    const flags = [];
    if (m.overflow) flags.push(`OVERFLOW +${m.overflowPx}px`);
    if (m.smallCount) flags.push(`touch<44:${m.smallCount}`);
    if (m.consoleErrors?.length) flags.push(`console:${m.consoleErrors.length}`);
    if (m.failed?.length) flags.push(`failed:${m.failed.length}`);
    if (m.offenders?.length && m.overflow) flags.push(JSON.stringify(m.offenders.slice(0, 2)));
    if (flags.length) console.log(`${p.padEnd(24)} ${vpName.padStart(5)}  ${flags.join('  ')}`);
  }
}
console.log(`\nTOTAL: overflow=${overflowTotal} console=${consoleTotal} failedRequests=${failedTotal}`);
console.log(`JSON: ${out}`);
