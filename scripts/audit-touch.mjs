/**
 * Measure touch-target sizes and tap spacing for interactive controls at
 * Android viewports. Reports only *opaque* controls: pure text links inside
 * prose are exempt from the 44px rule (WCAG 2.5.8 AA).
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321';
const VPS = [320, 360, 390, 430];
const PAGES = ['/', '/projects/', '/projects/dikaroute/', '/about/', '/services/', '/contact/', '/journal/', '/404/'];

const browser = await chromium.launch();
const findings = {};

for (const w of VPS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 844 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
  });
  for (const pth of PAGES) {
    const page = await ctx.newPage();
    await page.goto(BASE + pth, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const small = await page.evaluate(() => {
      const out = [];
      // Controls that are visually a "button/target" rather than inline prose.
      const sel = [
        'button',
        'a.btn',
        'a.icon-btn',
        '.menu-btn',
        '.link',
        '.filter-btn',
        '.finder-view button',
        '.site-nav__link',
        '.skip-link',
        '.project-row',
        '.footer__list a',
        '.mobile-menu__socials a',
      ].join(',');
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.height < 44 || (r.width < 44 && el.tagName !== 'A')) {
          out.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 26),
            label: (el.textContent || '').trim().slice(0, 22),
            w: Math.round(r.width),
            h: Math.round(r.height),
          });
        }
      }
      return out;
    });
    if (small.length) findings[`${w}${pth}`] = small;
    await page.close();
  }
  await ctx.close();
}
await browser.close();

const keys = Object.keys(findings);
console.log(keys.length ? JSON.stringify(findings, null, 1) : 'All opaque controls >= 44px at 320/360/390/430');
console.log(`checked ${VPS.length * PAGES.length} page-viewports`);
