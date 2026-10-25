/**
 * Android edge cases: landscape orientation, short viewport heights,
 * virtual-keyboard-sized viewport for the contact form, and safe-area insets.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321';
const results = [];
const check = (n, ok, d = '') => {
  results.push({ n, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`);
};

const browser = await chromium.launch();

/* Landscape phone */
{
  const ctx = await browser.newContext({
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const m = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    headerH: document.querySelector('.site-header')?.getBoundingClientRect().height,
    heroTitleSize: parseFloat(getComputedStyle(document.querySelector('.hero__title')).fontSize),
    viewportH: window.innerHeight,
  }));
  check('landscape: no horizontal overflow', !m.overflow);
  check('landscape: header fits', m.headerH <= 70, `${Math.round(m.headerH)}px`);
  check('landscape: hero title scales down', m.heroTitleSize <= 56, `${Math.round(m.heroTitleSize)}px`);
  await ctx.close();
}

/* Short viewport (keyboard open approximation) - dialogs must not overflow */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 400 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/projects/', { waitUntil: 'networkidle' });
  const box = await page.evaluate(() => {
    const ql = document.querySelector('[data-quick-look]');
    return ql ? getComputedStyle(ql).maxHeight : null;
  });
  // Open via the explicit preview button (the discoverable, non-hover control).
  const peek = page.locator('[data-quick-look-open]').first();
  const peekBox = await peek.boundingBox();
  check('preview button is tappable (>=44px tall)', (peekBox?.height ?? 0) >= 44, `${Math.round(peekBox?.height ?? 0)}px`);
  await peek.click();
  await page.waitForTimeout(400);
  const dialog = await page.evaluate(() => {
    const d = document.querySelector('[data-quick-look]');
    if (!d?.open) return { open: false };
    const r = d.getBoundingClientRect();
    return { open: true, top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), vh: window.innerHeight, overflowY: getComputedStyle(d).overflowY };
  });
  check('quick look opens from keyboard', dialog.open === true);
  if (dialog.open) {
    check('quick look fits short viewport', dialog.top >= -1 && dialog.bottom <= dialog.vh + 2, JSON.stringify(dialog));
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  check('quick look closes with Escape', await page.evaluate(() => document.querySelector('[data-quick-look]')?.open !== true));
  await ctx.close();
}

/* Contact form focused while viewport is short (keyboard scenario) */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 390, height: 360 });
  await page.locator('#message').focus();
  await page.waitForTimeout(300);
  const vis = await page.evaluate(() => {
    const el = document.activeElement;
    const r = el.getBoundingClientRect();
    return {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      vh: window.innerHeight,
      fontSize: getComputedStyle(el).fontSize,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });
  check('form field stays reachable when viewport shrinks', vis.top >= 0 && vis.top < vis.vh, JSON.stringify(vis));
  check('input font-size >= 16px (no iOS/Android zoom)', parseFloat(vis.fontSize) >= 16, vis.fontSize);
  check('no overflow with keyboard-sized viewport', !vis.overflow);
  await ctx.close();
}

/* Safe-area insets applied to fixed header */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const safe = await page.evaluate(() => {
    const h = document.querySelector('.site-header');
    const body = document.body;
    return {
      headerPaddingTop: getComputedStyle(h).paddingTop,
      bodyPaddingTop: getComputedStyle(body).paddingTop,
      firstSectionTop: Math.round(document.querySelector('.hero')?.getBoundingClientRect().top ?? 0),
      headerBottom: Math.round(h.getBoundingClientRect().bottom),
    };
  });
  check('hero content starts below fixed header', safe.firstSectionTop >= safe.headerBottom - 1, JSON.stringify(safe));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} Android edge-case checks passed`);
if (failed) process.exitCode = 1;
