import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4322';
const out = path.resolve('.test-output/kendal-signal-interactions');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? `: ${detail}` : ''}`);
};

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await mobile.newPage();
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1600);

const cookieVisible = await page.locator('[data-cookie-consent]').isVisible();
check('cookie banner appears on first visit', cookieVisible);
await page.screenshot({ path: path.join(out, 'cookie-mobile.png') });
await page.locator('[data-cookie-essential]').click();
await page.waitForTimeout(250);
check('cookie banner closes', !(await page.locator('[data-cookie-consent]').isVisible()));
const consent = await page.evaluate(() => localStorage.getItem('og-consent-v1'));
check('consent stored', Boolean(consent && consent.includes('"necessary":true')), consent ?? '');

await page.locator('[data-menu-open]').click();
await page.waitForTimeout(300);
check('mobile menu opens', await page.locator('[data-menu]').evaluate((el) => el.open));
await page.screenshot({ path: path.join(out, 'menu-mobile.png') });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('mobile menu closes with Escape', !(await page.locator('[data-menu]').evaluate((el) => el.open)));

const themeBefore = await page.evaluate(() => document.documentElement.dataset.theme);
await page.locator('.site-header [data-theme-toggle]').click();
await page.waitForTimeout(250);
const themeAfter = await page.evaluate(() => document.documentElement.dataset.theme);
check('theme toggle changes theme', themeBefore !== themeAfter, `${themeBefore} -> ${themeAfter}`);
const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
check('theme persisted', storedTheme === themeAfter, storedTheme ?? '');

await page.locator('[data-spotlight-open]').click();
await page.waitForTimeout(300);
check('spotlight opens', await page.locator('[data-spotlight]').evaluate((el) => el.open));
await page.locator('[data-spotlight-input]').fill('kendal');
await page.waitForTimeout(250);
const visibleResults = await page.locator('[data-search-item]:visible').count();
check('spotlight filters results', visibleResults > 0, `${visibleResults} results`);
await page.screenshot({ path: path.join(out, 'spotlight-mobile.png') });
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

await page.goto(`${base}/contact/`, { waitUntil: 'networkidle' });
await page.locator('.contact-form button[type="submit"]').click();
await page.waitForTimeout(250);
const invalid = await page.locator('.contact-form input:invalid').count();
check('empty contact form is blocked', invalid > 0, `${invalid} invalid fields`);

await page.fill('#name', 'Uji Coba');
await page.fill('#email', 'uji@example.com');
await page.selectOption('#service', 'website');
await page.fill('#message', 'Ini uji formulir otomatis untuk memastikan brief disusun dengan benar.');
await page.locator('.contact-form button[type="submit"]').click();
await page.waitForTimeout(800);
const ready = await page.locator('[data-brief-ready]').isVisible();
check('contact brief panel appears', ready);
const status = await page.locator('[data-brief-copy-status]').textContent();
check('brief status has text', Boolean(status?.trim()), status?.trim() ?? '');

await page.goto(`${base}/projects/`, { waitUntil: 'networkidle' });
await page.locator('[data-filter="Web"]').click();
await page.waitForTimeout(250);
const webCount = await page.locator('[data-project-item]:visible').count();
check('project filter narrows list', webCount > 0 && webCount < 10, `${webCount} visible`);
await page.locator('[data-project-view="grid"]').click();
await page.waitForTimeout(250);
check('project grid view applies', (await page.locator('[data-project-list]').getAttribute('data-view')) === 'grid');
await page.screenshot({ path: path.join(out, 'projects-grid-mobile.png'), fullPage: true });

await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(250);
check('header becomes solid after scroll', (await page.locator('[data-header]').getAttribute('data-scrolled')) !== null);

check('no console errors', errors.length === 0, errors.join(' | ').slice(0, 300));

await mobile.close();
await browser.close();
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(results, null, 2));
if (results.some((item) => !item.ok)) process.exitCode = 1;
