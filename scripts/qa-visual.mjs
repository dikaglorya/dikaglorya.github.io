import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const theme = process.env.THEME ?? 'dark';
const out = path.resolve(`.test-output/kendal-signal-${theme}`);
fs.mkdirSync(out, { recursive: true });

const routes = ['/', '/projects/', '/projects/dikaroute/', '/services/', '/about/', '/contact/', '/journal/', '/kendal/', '/privacy/'];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const findings = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: theme });
  await context.addInitScript((chosenTheme) => {
    try {
      localStorage.setItem('theme', chosenTheme);
      localStorage.setItem(
        'og-consent-v1',
        JSON.stringify({
          necessary: true,
          preferences: true,
          analytics: false,
          marketing: false,
          updatedAt: '2026-10-25T00:00:00.000Z',
        }),
      );
    } catch {
      /* ignore */
    }
  }, theme);
  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failed = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    page.on('requestfailed', (request) => failed.push(`${request.url()} ${request.failure()?.errorText}`));

    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const overflow = Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth;
      const h1 = document.querySelector('h1');
      const header = document.querySelector('[data-header]');
      const canvas = document.querySelector('[data-hero-canvas]');
      return {
        title: document.title,
        h1: h1?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) ?? '',
        overflow,
        height: doc.scrollHeight,
        headerHeight: header?.getBoundingClientRect().height ?? 0,
        canvas: canvas ? { width: canvas.width, height: canvas.height } : null,
        revealCount: document.querySelectorAll('[data-reveal]').length,
        inCount: document.querySelectorAll('[data-reveal].is-in').length,
      };
    });

    const name = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replaceAll('/', '-');
    await page.screenshot({ path: path.join(out, `${name}-${viewport.name}.png`), fullPage: true });
    findings.push({ route, viewport: viewport.name, status: response?.status(), ...metrics, consoleErrors, failed });
    await page.close();
  }
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(findings, null, 2));
for (const item of findings) {
  const flags = [];
  if (item.overflow > 1) flags.push(`overflow:${item.overflow}px`);
  if (item.consoleErrors.length) flags.push(`console:${item.consoleErrors.length}`);
  if (item.failed.length) flags.push(`failed:${item.failed.length}`);
  console.log(`${item.viewport.padEnd(8)} ${item.route.padEnd(26)} ${item.status} h=${item.height} ${flags.join(' ') || 'ok'}`);
}
console.log('report:', path.join(out, 'report.json'));
