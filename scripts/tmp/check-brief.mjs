import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseURL = 'http://127.0.0.1:4321';
const outDir = '/tmp/opencode/brief-shots';
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = {};

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await context.newPage();
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text().slice(0, 300));
});
page.on('pageerror', (error) => errors.push(error.message.slice(0, 300)));

await page.goto(`${baseURL}/contact/`, { waitUntil: 'networkidle' });
results.desktopOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth - window.innerWidth,
);

await page.fill('#name', 'Dika Glorya');
await page.fill('#email', 'dika@example.com');
await page.selectOption('#service', 'website');
await page.selectOption('#budget', 'Rp1jt sampai Rp3jt');
await page.fill(
  '#message',
  'Butuh landing page untuk jasa servis AC.\nDomain sudah siap, target rilis bulan depan.',
);

await page.click('button[type="submit"]');
await page.waitForSelector('[data-brief-ready]:not([hidden])', { timeout: 5000 });
await page.waitForTimeout(500);

results.readyTitle = await page.locator('[data-brief-ready-title]').textContent();
results.readyStatus = await page.locator('[data-brief-copy-status]').textContent();
results.gmailHref = await page.locator('[data-brief-gmail]').getAttribute('href');
results.mailtoHref = await page.locator('[data-brief-mailto]').getAttribute('href');
results.focused = await page.evaluate(() => document.activeElement?.getAttribute('data-brief-ready-title') !== null);
await page.screenshot({ path: `${outDir}/contact-filled.png`, fullPage: true });
await page.locator('[data-brief-ready]').screenshot({ path: `${outDir}/ready-panel.png` });

results.clipboard = await page.evaluate(async () => {
  try {
    const items = await navigator.clipboard.read();
    const item = items[0];
    const html = item.types.includes('text/html')
      ? await (await item.getType('text/html')).text()
      : null;
    const text = item.types.includes('text/plain')
      ? await (await item.getType('text/plain')).text()
      : null;
    return {
      types: item.types,
      htmlLength: html?.length ?? 0,
      hasName: html?.includes('Dika Glorya') ?? false,
      hasMessage: html?.includes('servis AC') ?? false,
      hasTable: html?.includes('<table') ?? false,
      hasInlineStyle: html?.includes('style="') ?? false,
      textStart: text?.slice(0, 150) ?? null,
    };
  } catch (error) {
    return { error: String(error) };
  }
});

for (const width of [768, 390, 320]) {
  const mobile = await browser.newContext({
    viewport: { width, height: 844 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const p = await mobile.newPage();
  const mobileErrors = [];
  p.on('console', (msg) => {
    if (msg.type() === 'error') mobileErrors.push(msg.text().slice(0, 300));
  });
  p.on('pageerror', (error) => mobileErrors.push(error.message.slice(0, 300)));
  await p.goto(`${baseURL}/contact/`, { waitUntil: 'networkidle' });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await p.fill('#name', 'Dika Glorya');
  await p.fill('#email', 'dika@example.com');
  await p.selectOption('#service', 'website');
  await p.fill('#message', 'Butuh landing page untuk jasa servis AC.');
  await p.click('button[type="submit"]');
  await p.waitForSelector('[data-brief-ready]:not([hidden])', { timeout: 5000 });
  await p.waitForTimeout(300);
  await p.locator('[data-brief-ready]').screenshot({
    path: `${outDir}/ready-panel-${width}.png`,
  });
  results[`overflow${width}`] = overflow;
  results[`errors${width}`] = mobileErrors;
  await mobile.close();
}

results.consoleErrors = errors;
await fs.writeFile(`${outDir}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

await browser.close();
