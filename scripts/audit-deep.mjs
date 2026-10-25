/**
 * Deep responsive audit.
 * Every page x every required viewport x both colour schemes.
 *
 * Checks:
 *  - document / body horizontal overflow
 *  - elements escaping the viewport (ignoring intentional scroll containers)
 *  - content clipped behind the fixed header
 *  - overlaps between visible text blocks (ignoring closed <details>)
 *  - undersized tap targets on touch viewports
 *  - text under 11px
 *  - long unbreakable strings
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const pages = [
  '/',
  '/projects/',
  '/projects/dikaroute/',
  '/journal/',
  '/journal/small-static-portfolio-architecture/',
  '/about/',
  '/services/',
  '/contact/',
  '/404.html',
];
const viewports = [
  { name: '320', width: 320, height: 640, touch: true },
  { name: '360', width: 360, height: 740, touch: true },
  { name: '375', width: 375, height: 667, touch: true },
  { name: '390', width: 390, height: 844, touch: true },
  { name: '414', width: 414, height: 896, touch: true },
  { name: '430', width: 430, height: 932, touch: true },
  { name: '768', width: 768, height: 1024, touch: true },
  { name: '1024', width: 1024, height: 768, touch: false },
  { name: '1280', width: 1280, height: 800, touch: false },
  { name: '1440', width: 1440, height: 900, touch: false },
  { name: '1920', width: 1920, height: 1080, touch: false },
  { name: '2560', width: 2560, height: 1440, touch: false },
];

const schemes = process.env.SCHEME ? [process.env.SCHEME] : ['dark', 'light'];
const onlyVp = process.env.VP ? process.env.VP.split(',') : null;

const browser = await chromium.launch();
const report = [];
let checks = 0;

for (const scheme of schemes) {
  for (const vp of viewports) {
    if (onlyVp && !onlyVp.includes(vp.name)) continue;
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: scheme,
      deviceScaleFactor: 1,
      isMobile: vp.touch,
      hasTouch: vp.touch,
    });
    for (const path of pages) {
      const page = await context.newPage();
      await page.goto(baseURL + path, { waitUntil: 'networkidle' });
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += Math.round(vp.height * 0.8)) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(25);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(220);
      checks += 1;

      const result = await page.evaluate(
        ({ vpWidth, vpHeight, isTouch }) => {
          const issues = [];
          const de = document.documentElement;
          const add = (kind, detail) => issues.push({ kind, detail });

          if (de.scrollWidth > de.clientWidth + 1) {
            add('doc-overflow', `scrollWidth ${de.scrollWidth} > clientWidth ${de.clientWidth}`);
          }

          const describe = (el) => {
            const cls = (el.className || '').toString().trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.');
            const txt = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 34);
            return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${txt ? ` "${txt}"` : ''}`;
          };

          // An element is "rendered" only if no ancestor hides/clips it away.
          const rendered = (el) => {
            let n = el;
            while (n && n !== document.documentElement) {
              if (n.tagName === 'DETAILS' && !n.open) {
                // <summary> is still rendered when closed
                if (!(el.tagName === 'SUMMARY' || el.closest('summary'))) return false;
              }
              if (n.hasAttribute && n.hasAttribute('hidden')) return false;
              if (n.tagName === 'DIALOG' && !n.open) return false;
              const cs = getComputedStyle(n);
              if (cs.display === 'none' || cs.visibility === 'hidden') return false;
              n = n.parentElement;
            }
            const cs = getComputedStyle(el);
            if (parseFloat(cs.opacity) === 0) return false;
            return true;
          };

          // Does any ancestor scroll/clip horizontally? Then escaping is by design.
          const inScrollBox = (el) => {
            let n = el.parentElement;
            while (n && n !== document.documentElement) {
              const cs = getComputedStyle(n);
              if (/auto|scroll|hidden|clip/.test(cs.overflowX)) return true;
              n = n.parentElement;
            }
            return false;
          };

          const all = [...document.querySelectorAll('body *')].filter(rendered);

          // 1. Escape the viewport
          for (const el of all) {
            const cs = getComputedStyle(el);
            if (cs.position === 'fixed') continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            if (inScrollBox(el)) continue;
            if (r.right > vpWidth + 1.5) add('escapes-right', `${describe(el)} right=${Math.round(r.right)}`);
            else if (r.left < -1.5) add('escapes-left', `${describe(el)} left=${Math.round(r.left)}`);
          }

          // 2. Clipped by the fixed header at scroll top
          const header = document.querySelector('.site-header');
          const main = document.querySelector('#main');
          if (header && main) {
            const headerBottom = header.getBoundingClientRect().bottom;
            const first = main.querySelector('h1, .page-hero, .hero, section');
            if (first) {
              const fb = first.getBoundingClientRect();
              if (fb.top < headerBottom - 1 && fb.height > 0) {
                add('under-header', `${describe(first)} top=${Math.round(fb.top)} < ${Math.round(headerBottom)}`);
              }
            }
          }

          // 3. Text overlaps
          const textEls = all.filter((el) => {
            if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'CIRCLE', 'RECT', 'LINE', 'BR'].includes(el.tagName)) return false;
            const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
            if (!hasText) return false;
            const r = el.getBoundingClientRect();
            return r.width > 2 && r.height > 2;
          });
          const rects = textEls.map((el) => ({ el, r: el.getBoundingClientRect() }));
          for (let i = 0; i < rects.length; i += 1) {
            for (let j = i + 1; j < rects.length; j += 1) {
              const a = rects[i];
              const b = rects[j];
              if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
              const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
              const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
              if (ox > 6 && oy > 6) {
                const overlap = ox * oy;
                const smaller = Math.min(a.r.width * a.r.height, b.r.width * b.r.height);
                if (overlap > smaller * 0.18) add('overlap', `${describe(a.el)} <> ${describe(b.el)}`);
              }
            }
          }

          // 4. Tap targets
          if (isTouch) {
            for (const el of all) {
              if (!el.matches('a[href], button, [role=button], summary, input, select, textarea')) continue;
              if (el.closest('.skip-link') || el.classList.contains('skip-link')) continue;
              const cs = getComputedStyle(el);
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              if (cs.display === 'inline' && el.closest('p, li')) continue;
              if (r.height < 44 || r.width < 24) add('tap-target', `${describe(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
            }
          }

          // 5. Tiny text
          for (const el of textEls) {
            const fs = parseFloat(getComputedStyle(el).fontSize);
            if (fs && fs < 11) add('tiny-text', `${describe(el)} ${fs}px`);
          }

          // 6. Long unbreakable strings
          for (const el of textEls) {
            const cs = getComputedStyle(el);
            if (/anywhere|break-word|break-all/.test(cs.overflowWrap + cs.wordBreak)) continue;
            if (el.scrollWidth > el.clientWidth + 2 && cs.overflowX === 'visible') {
              add('text-overflow', `${describe(el)} ${el.scrollWidth}>${el.clientWidth}`);
            }
          }

          const pick = (sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const cs = getComputedStyle(el);
            return { fs: Math.round(parseFloat(cs.fontSize) * 10) / 10, w: Math.round(el.getBoundingClientRect().width) };
          };

          return {
            issues,
            type: { h1: pick('h1'), h2: pick('h2'), body: pick('p'), nav: pick('.site-nav__link') },
            headerH: header ? Math.round(header.getBoundingClientRect().height) : null,
            containerW: document.querySelector('.container') ? Math.round(document.querySelector('.container').getBoundingClientRect().width) : null,
            docW: de.scrollWidth,
            bodyH: document.body.scrollHeight,
          };
        },
        { vpWidth: vp.width, vpHeight: vp.height, isTouch: vp.touch },
      );

      report.push({ scheme, vp: vp.name, path, ...result });
      if (process.env.PROGRESS) console.error(`  ${report.length}/${schemes.length * viewports.length * pages.length} ${scheme} ${vp.name} ${path} issues=${result.issues.length}`);
      await page.close();
    }
    await context.close();
  }
}

await browser.close();

const flat = report.flatMap((r) => r.issues.map((i) => ({ ...i, vp: r.vp, scheme: r.scheme, path: r.path })));
const byKind = {};
for (const i of flat) byKind[i.kind] = (byKind[i.kind] ?? 0) + 1;

console.log(`\n${checks} page renders checked`);
console.log('Issue counts by kind:', JSON.stringify(byKind));

if (flat.length) {
  console.log('\n--- issues (deduped by kind+detail+page) ---');
  const seen = new Set();
  for (const i of flat) {
    const key = `${i.kind}|${i.detail}|${i.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const vps = [...new Set(flat.filter((x) => `${x.kind}|${x.detail}|${x.path}` === key).map((x) => x.vp))];
    console.log(`[${i.kind}] ${i.path} @${vps.join(',')} :: ${i.detail}`);
  }
}

console.log('\n--- scale (dark, homepage) ---');
const scale = {};
for (const r of report) {
  if (r.scheme !== 'dark' || r.path !== '/') continue;
  scale[r.vp] = { h1: r.type.h1?.fs, h2: r.type.h2?.fs, body: r.type.body?.fs, headerH: r.headerH, containerW: r.containerW };
}
console.table(scale);

fs.writeFileSync('/tmp/audit-deep.json', JSON.stringify(report, null, 1));
console.log('report -> /tmp/audit-deep.json');
if (flat.length) process.exitCode = 1;
