/**
 * Layout + contrast QA.
 * Checks every page across the responsive ladder for horizontal overflow,
 * clipped-by-header content, undersized tap targets, and text that fails
 * WCAG AA contrast against its painted background.
 */
import { chromium } from 'playwright';

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
  { name: '320', width: 320, height: 740 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

const browser = await chromium.launch();
const issues = [];
let checks = 0;

for (const scheme of ['dark', 'light']) {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: scheme,
      reducedMotion: 'reduce',
    });
    for (const path of pages) {
      const page = await context.newPage();
      await page.goto(baseURL + path, { waitUntil: 'networkidle' });
      checks += 1;
      const result = await page.evaluate(
        ({ pagePath }) => {
          const toLinear = (c) => {
            const v = c / 255;
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          const luminance = ([r, g, b]) =>
            0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
          const ratio = (a, b) => {
            const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
            return (hi + 0.05) / (lo + 0.05);
          };
          const parse = (s) => {
            const m = s.match(/[\d.]+/g);
            return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
          };
          const out = { overflow: null, clipped: [], small: [], contrast: [] };

          if (document.documentElement.scrollWidth > window.innerWidth + 1) {
            out.overflow = `${document.documentElement.scrollWidth} > ${window.innerWidth}`;
            // name the widest offenders
            out.wide = [...document.querySelectorAll('body *')]
              .filter((el) => {
                const r = el.getBoundingClientRect();
                return r.right > window.innerWidth + 1 || r.left < -1;
              })
              .slice(0, 6)
              .map(
                (el) =>
                  `${el.tagName.toLowerCase()}.${String(el.className).split(/\s+/)[0]} ${Math.round(el.getBoundingClientRect().width)}w`,
              );
          }

          const header = document.querySelector('.site-header');
          const headerRect = header?.getBoundingClientRect();
          const visible = (el) => {
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')
              return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          };

          // Interactive targets that are too small to tap.
          const seen = new Set();
          for (const el of document.querySelectorAll('a[href], button, input, select, textarea, summary')) {
            if (!visible(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.height < 24) continue; // inline links inside prose are exempt below
            if (el.closest('p, li, figcaption, .journal-section, .spec, .page-hero__meta') && el.tagName === 'A' && r.height < 44) continue;
            if (r.width < 24 || r.height < 24) {
              const key = `${el.tagName}.${String(el.className).split(/\s+/)[0]}`;
              if (seen.has(key)) continue;
              seen.add(key);
              out.small.push(`${key} ${Math.round(r.width)}x${Math.round(r.height)}`);
            }
          }

          // Above-the-fold content hidden under the fixed header at scroll 0.
          if (headerRect) {
            const first = document.querySelector('main > *');
            if (first && pagePath !== '/' ) {
              const r = first.getBoundingClientRect();
              if (r.top < headerRect.bottom - 1) out.clipped.push(`main>-* starts at ${Math.round(r.top)}`);
            }
          }

          // Contrast for every text-bearing element on a painted ancestor.
          const bgOf = (el) => {
            let node = el;
            while (node && node !== document.documentElement) {
              const cs = getComputedStyle(node);
              const bg = cs.backgroundColor;
              const alpha = bg.startsWith('rgba') ? Number(bg.match(/[\d.]+/g)[3]) : 1;
              if (bg !== 'transparent' && alpha > 0.75) return parse(bg);
              node = node.parentElement;
            }
            return parse(getComputedStyle(document.body).backgroundColor);
          };
          const skip = new Set(['SCRIPT', 'STYLE', 'SVG', 'PATH', 'CIRCLE', 'RECT']);
          for (const el of document.querySelectorAll('main *, footer *, header *')) {
            if (skip.has(el.tagName)) continue;
            const ownText = [...el.childNodes]
              .filter((n) => n.nodeType === 3)
              .map((n) => n.textContent.trim())
              .join('')
              .trim();
            if (!ownText || ownText.length < 2) continue;
            if (!visible(el)) continue;
            const cs = getComputedStyle(el);
            if (cs.textShadow !== 'none') continue;
            const fg = parse(cs.color);
            const bg = bgOf(el);
            const size = parseFloat(cs.fontSize);
            const weight = Number(cs.fontWeight) || 400;
            const large = size >= 24 || (size >= 18.66 && weight >= 700);
            const need = large ? 3 : 4.5;
            const c = ratio(fg, bg);
            if (c < need - 0.02) {
              const key = `${el.tagName.toLowerCase()}.${String(el.className).split(/\s+/)[0]} "${ownText.slice(0, 24)}" ${c.toFixed(2)}<${need}`;
              if (!out.contrast.includes(key)) out.contrast.push(key);
            }
          }
          out.contrast = out.contrast.slice(0, 8);
          return out;
        },
        { pagePath: path },
      );

      const tag = `[${scheme} ${vp.name}] ${path}`;
      if (result.overflow) issues.push(`${tag}: overflow ${result.overflow} :: ${result.wide?.join(', ')}`);
      if (result.small.length) issues.push(`${tag}: small targets ${result.small.join(', ')}`);
      if (result.clipped.length) issues.push(`${tag}: ${result.clipped.join(', ')}`);
      if (result.contrast.length) issues.push(`${tag}: contrast ${result.contrast.join(' | ')}`);
      await page.close();
    }
    await context.close();
  }
}

await browser.close();

console.log(`\n${checks} page renders checked`);
if (!issues.length) {
  console.log('No layout or contrast issues found.');
} else {
  console.log(`${issues.length} issues:\n`);
  for (const issue of issues) console.log(`- ${issue}`);
}
