/**
 * Interaction QA: search palette, keyboard access, no-JS rendering, reduced
 * motion, and light/dark parity for the header.
 */
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const browser = await chromium.launch();
const issues = [];
const ok = (name) => console.log(`  ok  ${name}`);
const check = (condition, name) => (condition ? ok(name) : issues.push(name));

/* ---------- Search palette ---------------------------------------------- */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });

  await page.keyboard.press('Control+k');
  await page.waitForTimeout(150);
  check(await page.locator('[data-spotlight]').evaluate((d) => d.hasAttribute('open')), 'Ctrl+K opens search');
  check(
    await page.evaluate(() => document.activeElement?.hasAttribute('data-spotlight-input')),
    'search input receives focus',
  );

  await page.locator('[data-spotlight-input]').fill('dikaroute');
  await page.waitForTimeout(100);
  const visible = await page.locator('[data-search-item]:visible').count();
  check(visible >= 1 && visible < 8, `search filters results (${visible} visible)`);

  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(80);
  check(
    (await page.locator('[data-search-item] a.is-active').count()) === 1,
    'arrow key moves the active result',
  );

  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  check(
    await page.locator('[data-spotlight]').evaluate((d) => !d.hasAttribute('open')),
    'Escape closes search',
  );
  check(
    await page.evaluate(() => document.activeElement?.hasAttribute('data-spotlight-open')),
    'focus returns to the search trigger',
  );
  await context.close();
}

/* ---------- Skip link ---------------------------------------------------- */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  // The skip link slides in over 200ms; measure once it has settled.
  await page.waitForTimeout(300);
  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { text: el.textContent?.trim(), top: Math.round(r.top), href: el.getAttribute('href') };
  });
  check(skip?.href === '#main' && skip.top >= 0, 'first Tab reaches the visible skip link');
  await context.close();
}

/* ---------- Reduced motion ---------------------------------------------- */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  const state = await page.evaluate(() => {
    const targets = [...document.querySelectorAll('[data-reveal]')];
    const hidden = targets.filter((el) => getComputedStyle(el).opacity === '0').length;
    return { hidden, total: targets.length, jsClass: document.documentElement.classList.contains('js') };
  });
  check(state.hidden === 0, `reduced motion shows all content (${state.total} reveal targets)`);
  await context.close();
}

/* ---------- No JavaScript ------------------------------------------------ */
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  const state = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const reveal = [...document.querySelectorAll('[data-reveal]')];
    return {
      h1: h1 ? h1.getBoundingClientRect().height > 0 : false,
      hidden: reveal.filter((el) => getComputedStyle(el).opacity === '0').length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
  check(state.h1, 'hero heading renders without JavaScript');
  check(state.hidden === 0, 'reveal content stays visible without JavaScript');
  check(!state.overflow, 'no horizontal overflow without JavaScript');
  await context.close();
}

/* ---------- Header across schemes ---------------------------------------- */
for (const scheme of ['dark', 'light']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  const header = await page.evaluate(() => {
    const nav = document.querySelector('.site-nav');
    const brand = document.querySelector('.brand');
    const hb = document.querySelector('.site-header').getBoundingClientRect();
    const nb = nav.getBoundingClientRect();
    const bb = brand.getBoundingClientRect();
    const center = (r) => Math.round(r.top + r.height / 2);
    return {
      navVisible: nb.width > 0,
      aligned: Math.abs(center(nb) - center(bb)) <= 1 && Math.abs(center(bb) - Math.round(hb.bottom - bb.height / 2 - 0)) <= 40,
      headerH: Math.round(hb.height),
      opaque: getComputedStyle(document.querySelector('.site-header')).backgroundColor,
    };
  });
  check(header.navVisible, `[${scheme}] desktop navigation visible`);
  check(header.aligned, `[${scheme}] nav and brand share a vertical centre`);
  // --header-h is 56px on mobile and 64px from 1024px up (tokens.css).
  check(header.headerH === 64, `[${scheme}] header height ${header.headerH}px`);
  await context.close();
}

await browser.close();

if (issues.length) {
  console.error(`\nInteraction check failed (${issues.length}):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}
console.log('\nInteraction check passed.');
