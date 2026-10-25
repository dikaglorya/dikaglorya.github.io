/**
 * End-to-end interaction checks for the flows a visitor actually uses.
 *
 * Usage: BASE_URL=http://127.0.0.1:4399 node scripts/qa-flows.mjs
 * Requires a built site being served (astro preview or any static server).
 */
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const browser = await chromium.launch();
const issues = [];
const ok = (name) => console.log(`  ok  ${name}`);
const check = (condition, name) => {
  if (condition) ok(name);
  else {
    console.log(`  FAIL ${name}`);
    issues.push(name);
  }
};

/* ---------- Theme toggle ------------------------------------------------- */
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });

  const initial = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    bg: getComputedStyle(document.body).backgroundColor,
    meta: document.querySelector('meta[name="theme-color"]')?.content,
    label: document.querySelector('.theme-btn')?.getAttribute('aria-label'),
  }));
  check(initial.theme === 'dark', 'system dark resolves the dark theme');
  check(initial.bg === 'rgb(7, 8, 10)', `dark background is #07080a (${initial.bg})`);
  check(initial.meta === '#07080a', 'theme-color meta matches the dark theme');
  check(initial.label === 'Aktifkan tema terang', 'toggle names the action');

  await page.locator('.theme-btn').click();
  // The palette cross-fades for 240ms; wait it out before sampling the colour.
  await page.waitForTimeout(350);
  const light = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    bg: getComputedStyle(document.body).backgroundColor,
    meta: document.querySelector('meta[name="theme-color"]')?.content,
    stored: localStorage.getItem('theme'),
    label: document.querySelector('.theme-btn')?.getAttribute('aria-label'),
  }));
  check(light.theme === 'light', 'toggle switches to light');
  check(light.bg === 'rgb(242, 238, 228)', `light background is bone (${light.bg})`);
  check(light.meta === '#f2eee4', 'theme-color meta follows the switch');
  check(light.label === 'Aktifkan tema gelap', 'toggle label flips');
  check(light.stored === 'light', 'choice is stored');

  await page.reload({ waitUntil: 'networkidle' });
  const reloaded = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    bg: getComputedStyle(document.body).backgroundColor,
  }));
  check(reloaded.theme === 'light' && reloaded.bg === 'rgb(242, 238, 228)', 'choice survives reload');

  // No flash: the theme attribute must already be set before any deferred JS.
  const early = await page.evaluate(() => ({
    attr: document.documentElement.getAttribute('data-theme'),
    scheme: getComputedStyle(document.documentElement).colorScheme,
  }));
  check(early.attr === 'light' && early.scheme === 'light', 'document exposes the resolved theme');

  await context.close();
}

/* ---------- Mobile sheet ------------------------------------------------ */
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });

  await page.locator('[data-menu-open]').click();
  await page.waitForTimeout(150);
  const opened = await page.evaluate(() => ({
    open: document.querySelector('[data-menu]')?.hasAttribute('open'),
    locked: document.body.classList.contains('menu-open'),
    focus: document.activeElement?.getAttribute('data-menu-close') !== null,
  }));
  check(opened.open, 'menu button opens the sheet');
  check(opened.locked, 'page scroll is locked while the sheet is open');
  check(opened.focus, 'focus moves to the close button');

  const themeRow = page.locator('[data-menu] .theme-row');
  check(await themeRow.isVisible(), 'theme control is reachable in the mobile sheet');
  await themeRow.click();
  await page.waitForTimeout(80);
  check(
    (await page.evaluate(() => document.documentElement.dataset.theme)) === 'light',
    'mobile theme control switches the theme',
  );

  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  const closed = await page.evaluate(() => ({
    open: document.querySelector('[data-menu]')?.hasAttribute('open'),
    locked: document.body.classList.contains('menu-open'),
    focus: document.activeElement?.hasAttribute('data-menu-open'),
  }));
  check(!closed.open && !closed.locked, 'Escape closes the sheet and unlocks scroll');
  check(closed.focus, 'focus returns to the menu trigger');

  await context.close();
}

/* ---------- Projects finder + Quick Look --------------------------------- */
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/projects/`, { waitUntil: 'networkidle' });

  const before = await page.locator('[data-project-item]:visible').count();
  const category = await page.locator('[data-filter]').nth(1).getAttribute('data-filter');
  await page.locator('[data-filter]').nth(1).click();
  await page.waitForTimeout(80);
  const filtered = await page.locator('[data-project-item]:visible').count();
  const url = new URL(page.url());
  check(filtered > 0 && filtered < before, `category filter narrows the list (${before} -> ${filtered})`);
  check(url.searchParams.get('category') === category, 'filter is written to the URL');
  check(
    (await page.locator('[data-project-count]').textContent())?.includes(String(filtered)),
    'result count is announced',
  );

  await page.locator('[data-project-search]').fill('zzzz-no-such-project');
  await page.waitForTimeout(80);
  check(await page.locator('[data-empty-state]').isVisible(), 'empty state appears for no matches');
  await page.locator('[data-filter-reset]').click();
  await page.waitForTimeout(80);
  check(!(await page.locator('[data-empty-state]').isVisible()), 'reset clears the empty state');
  check((await page.locator('[data-project-search]').inputValue()) === '', 'reset clears the search box');

  await page.locator('[data-project-view="grid"]').click();
  check(
    (await page.locator('[data-project-list]').getAttribute('data-view')) === 'grid',
    'grid view toggles on the list',
  );
  check(
    (await page.locator('[data-project-view="grid"]').getAttribute('aria-pressed')) === 'true',
    'grid toggle is pressed',
  );
  await page.locator('[data-project-view="list"]').click();

  const firstPeek = page.locator('[data-quick-look-open]').first();
  await firstPeek.scrollIntoViewIfNeeded();
  await firstPeek.click();
  await page.waitForTimeout(150);
  check(await page.locator('[data-quick-look]').evaluate((d) => d.open), 'Quick Look opens');
  check(
    await page.evaluate(() => document.activeElement?.hasAttribute('data-quick-look-close')),
    'Quick Look focuses its close button',
  );
  const qlTitle = await page.locator('[data-quick-look-title]').textContent();
  check(Boolean(qlTitle?.trim()), 'Quick Look shows the project name');
  const qlHref = await page.locator('[data-quick-look-link]').getAttribute('href');
  check(/^\/projects\/[^/]+\/$/.test(qlHref ?? ''), 'Quick Look links to the project detail');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(120);
  check(await page.locator('[data-quick-look]').evaluate((d) => !d.open), 'Escape closes Quick Look');
  check(
    await page.evaluate(() => document.activeElement?.hasAttribute('data-quick-look-open')),
    'focus returns to the preview trigger',
  );

  await context.close();
}

/* ---------- Contact brief flow ------------------------------------------ */
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/contact/?service=repairs`, { waitUntil: 'networkidle' });

  check(
    (await page.locator('#service').inputValue()) === 'repairs',
    '?service= preselects the requested service',
  );

  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(120);
  check(
    (await page.locator('[data-form-status]').textContent())?.includes('Lengkapi'),
    'empty submit reports the missing fields instead of sending',
  );

  await page.locator('#name').fill('Uji Coba');
  await page.locator('#email').fill('uji@example.com');
  await page.locator('#message').fill('Landing page untuk jasa servis AC, domain sudah siap.');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(250);

  check(await page.locator('[data-brief-ready]').isVisible(), 'valid submit reveals the brief panel');
  const gmail = await page.locator('[data-brief-gmail]').getAttribute('href');
  const mailto = await page.locator('[data-brief-mailto]').getAttribute('href');
  check(gmail?.includes('mailto') === false && gmail?.includes('to=') === true, 'Gmail link carries the recipient');
  check(gmail?.includes('su=') === true, 'Gmail link carries the subject');
  check(mailto?.startsWith('mailto:') === true && mailto.includes('subject='), 'mailto fallback is valid');
  check(
    await page.evaluate(() => document.activeElement?.hasAttribute('data-brief-ready-title')),
    'focus moves to the ready heading',
  );

  await page.locator('#message').fill('Perubahan kebutuhan.');
  await page.waitForTimeout(80);
  check(await page.locator('[data-brief-ready]').isHidden(), 'editing the form hides the stale panel');

  await context.close();
}

/* ---------- Journal reading tools --------------------------------------- */
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/journal/small-static-portfolio-architecture/`, {
    waitUntil: 'networkidle',
  });

  const tocTargets = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.journal-toc a')).map((link) =>
      Boolean(document.getElementById(link.hash.slice(1))),
    ),
  );
  check(tocTargets.length > 0 && tocTargets.every(Boolean), 'every table-of-contents link resolves');

  await page.locator('.journal-toc a').first().click();
  await page.waitForTimeout(300);
  const headingTop = await page.evaluate(() => {
    const heading = document.querySelector('.journal-section h2');
    return heading?.getBoundingClientRect().top ?? -1;
  });
  const headerHeight = await page.evaluate(() =>
    Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')),
  );
  check(headingTop >= headerHeight, 'anchor target clears the fixed header');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(250);
  check(
    (await page.locator('[data-reading-status]').textContent())?.length > 0,
    'reading progress reports a status',
  );

  const copy = page.locator('[data-copy-code]').first();
  await copy.scrollIntoViewIfNeeded();
  await copy.click();
  await page.waitForTimeout(150);
  check((await copy.textContent()) === 'Tersalin', 'copy-code button confirms the copy');

  await context.close();
}

/* ---------- Theme invariants -------------------------------------------- */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  for (const theme of ['dark', 'light']) {
    const page = await context.newPage();
    await page.emulateMedia({ colorScheme: theme });
    const expected = theme === 'dark'
      ? { background: 'rgb(7, 8, 10)', meta: '#07080a' }
      : { background: 'rgb(242, 238, 228)', meta: '#f2eee4' };
    for (const path of ['/', '/projects/', '/contact/', '/about/']) {
      await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
      const actual = await page.evaluate(() => ({
        theme: document.documentElement.dataset.theme,
        background: getComputedStyle(document.body).backgroundColor,
        meta: document.querySelector('meta[data-theme-color]')?.content,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      check(actual.theme === theme, `[${theme}] ${path}: theme resolves correctly`);
      check(actual.background === expected.background, `[${theme}] ${path}: palette background matches`);
      check(actual.meta === expected.meta, `[${theme}] ${path}: browser theme-color matches`);
      check(actual.overflow <= 1, `[${theme}] ${path}: no horizontal overflow`);
    }
    await page.close();
  }
  await context.close();
}

await browser.close();

if (issues.length) {
  console.error(`\nInteraction flows failed: ${issues.length} issue(s).`);
  process.exit(1);
}
console.log('\nInteraction flows passed.');
