/**
 * Interaction audit: drives the real UI and asserts observable state.
 * Covers mobile menu, spotlight palette, project filtering, keyboard focus,
 * theme scheme, and reduced-motion behaviour.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

const browser = await chromium.launch();

/* ---------------- Mobile menu (touch) ---------------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const trigger = page.locator('[data-menu-open]');
  check('menu trigger visible on mobile', await trigger.isVisible());
  check('desktop nav hidden on mobile', !(await page.locator('.site-nav').isVisible()));

  await trigger.click();
  await page.waitForTimeout(350);
  const menuOpen = await page.evaluate(() => document.querySelector('[data-menu]')?.open === true);
  check('mobile menu opens', menuOpen);
  check('body scroll locked while menu open', await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden'));
  check('focus moved into menu', await page.evaluate(() => {
    const m = document.querySelector('[data-menu]');
    return m?.contains(document.activeElement);
  }));

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('Escape closes menu', await page.evaluate(() => document.querySelector('[data-menu]')?.open !== true));
  check('focus returns to trigger', await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-open')));
  check('body scroll restored', await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden'));

  // navigate via a menu link
  await trigger.click();
  await page.waitForTimeout(300);
  await page.locator('.mobile-menu__link', { hasText: 'Proyek' }).first().click();
  await page.waitForTimeout(800);
  check('menu link navigates', page.url().includes('/projects/'), page.url());
  check('menu closed after navigation', await page.evaluate(() => document.querySelector('[data-menu]')?.open !== true));
  await ctx.close();
}

/* ---------------- Spotlight palette (keyboard) ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);
  check('Ctrl+K opens spotlight', await page.evaluate(() => document.querySelector('[data-spotlight]')?.open === true));
  check('spotlight input focused', await page.evaluate(() => document.activeElement?.hasAttribute('data-spotlight-input')));

  await page.keyboard.type('dikaroute');
  await page.waitForTimeout(200);
  const visible = await page.evaluate(() => [...document.querySelectorAll('[data-search-item]')].filter((i) => !i.hidden).length);
  check('search filters results', visible > 0 && visible < 20, `${visible} results`);

  await page.fill('[data-spotlight-input]', 'zzzznotfound');
  await page.waitForTimeout(200);
  check('no-results state shows', await page.evaluate(() => document.querySelector('[data-spotlight-empty]')?.hidden === false));
  check('no-results announces', await page.evaluate(() => {
    const el = document.querySelector('[data-spotlight-empty]');
    return el?.textContent?.includes('Tidak ada');
  }));

  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  check('Escape closes spotlight', await page.evaluate(() => document.querySelector('[data-spotlight]')?.open !== true));
  check('focus returns to search button', await page.evaluate(() => document.activeElement?.hasAttribute('data-spotlight-open')));
  await ctx.close();
}

/* ---------------- Project filtering ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/projects/', { waitUntil: 'networkidle' });
  const total = await page.evaluate(() => [...document.querySelectorAll('[data-project-item]')].length);
  check('projects listed', total > 0, `${total} rows`);

  await page.locator('[data-filter="Web"]').first().click();
  await page.waitForTimeout(250);
  const shown = await page.evaluate(() => [...document.querySelectorAll('[data-project-item]')].filter((i) => !i.hidden).length);
  check('category filter narrows list', shown > 0 && shown < total, `${shown}/${total}`);
  check('filter updates URL', page.url().includes('category='), page.url());
  check('filter button pressed state', await page.evaluate(() => document.querySelector('[data-filter="Web"]')?.getAttribute('aria-pressed') === 'true'));

  await page.locator('[data-project-search]').fill('zzzz');
  await page.waitForTimeout(250);
  check('empty state appears', await page.evaluate(() => document.querySelector('[data-empty-state]')?.hidden === false));
  await ctx.close();
}

/* ---------------- Keyboard focus visibility ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  // The skip link animates in over --dur-2; sample after the transition settles.
  await page.waitForTimeout(350);
  const first = await page.evaluate(() => {
    const a = document.activeElement;
    const s = getComputedStyle(a);
    return { cls: a?.className, isSkip: a?.classList?.contains('skip-link'), outline: s.outlineStyle, boxShadow: s.boxShadow };
  });
  check('first Tab hits skip link', first.isSkip, JSON.stringify(first.cls));

  // Tab to a nav link and check visible focus ring
  for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
  await page.waitForTimeout(100);
  const ring = await page.evaluate(() => {
    const a = document.activeElement;
    const s = getComputedStyle(a);
    return { tag: a?.tagName, outline: s.outlineStyle, width: s.outlineWidth, shadow: s.boxShadow };
  });
  check('keyboard focus has visible indicator', ring.outline !== 'none' || ring.shadow !== 'none', JSON.stringify(ring));
  await ctx.close();
}

/* ---------------- Reduced motion ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const rm = await page.evaluate(() => {
    const reveals = [...document.querySelectorAll('[data-reveal]')];
    const hidden = reveals.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.9).length;
    return { hidden, total: reveals.length, jsClass: document.documentElement.classList.contains('js') };
  });
  check('reduced motion shows all content immediately', rm.hidden === 0, `${rm.hidden}/${rm.total} hidden`);
  await ctx.close();
}

/* ---------------- Heading structure ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const headings = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1]));
  const h1s = headings.filter((h) => h === 1).length;
  let jumps = 0;
  for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i - 1] > 1) jumps++;
  check('exactly one h1', h1s === 1, `${h1s}`);
  check('no heading level jumps', jumps === 0, `${jumps} jumps`);
  await ctx.close();
}

/* ---------------- JS-disabled content fallback ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const noJs = await page.evaluate(() => {
    const reveals = [...document.querySelectorAll('[data-reveal]')];
    const hidden = reveals.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.9).length;
    return { hidden, total: reveals.length, h1: document.querySelector('h1')?.textContent?.trim() };
  });
  check('content visible without JavaScript', noJs.hidden === 0, `${noJs.hidden}/${noJs.total} hidden`);
  check('h1 renders without JS', Boolean(noJs.h1), noJs.h1);
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} interaction checks passed`);
if (failed.length) process.exitCode = 1;
