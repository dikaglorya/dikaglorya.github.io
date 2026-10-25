/**
 * Form + feedback audit: drives the contact brief form and the copy-email
 * control, verifying real state transitions and honest success/failure text.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });

/* Empty submit must not claim success */
await page.locator('[data-contact-form] button[type="submit"]').click();
await page.waitForTimeout(300);
const afterEmpty = await page.evaluate(() => ({
  status: document.querySelector('[data-form-status]')?.textContent?.trim(),
  readyHidden: document.querySelector('[data-brief-ready]')?.hidden,
  invalid: document.querySelectorAll('[data-contact-form] :invalid').length,
}));
check('empty submit does not claim success', !/siap|dibuat|berhasil/i.test(afterEmpty.status ?? '') || afterEmpty.readyHidden, JSON.stringify(afterEmpty));
check('empty submit flags invalid fields', afterEmpty.invalid >= 3, `${afterEmpty.invalid} invalid`);

/* Fill and submit */
await page.fill('#name', 'Budi');
await page.fill('#email', 'budi@example.com');
await page.selectOption('#service', { index: 1 });
await page.fill('#message', 'Landing page untuk jasa servis AC, domain sudah siap.');
await page.locator('[data-contact-form] button[type="submit"]').click();
await page.waitForTimeout(600);

const afterFill = await page.evaluate(() => {
  const ready = document.querySelector('[data-brief-ready]');
  const gmail = document.querySelector('[data-brief-gmail]');
  const mailto = document.querySelector('[data-brief-mailto]');
  return {
    readyVisible: ready && !ready.hidden,
    status: document.querySelector('[data-form-status]')?.textContent?.trim(),
    copyStatus: document.querySelector('[data-brief-copy-status]')?.textContent?.trim(),
    gmail: gmail?.getAttribute('href')?.slice(0, 90),
    mailto: mailto?.getAttribute('href')?.slice(0, 60),
    focused: document.activeElement?.hasAttribute('data-brief-ready-title'),
  };
});
check('valid submit reveals brief panel', afterFill.readyVisible === true);
check('success message is honest', /salin|clipboard|brief/i.test(afterFill.status || afterFill.copyStatus || ''), (afterFill.status || afterFill.copyStatus)?.slice(0, 80));
check('Gmail link built with recipient', /mail.google.com/.test(afterFill.gmail ?? '') && /dikasukasukaa/.test(afterFill.gmail ?? ''), afterFill.gmail);
check('mailto fallback built', /mailto:/.test(afterFill.mailto ?? ''), afterFill.mailto);
check('focus moves to brief heading', afterFill.focused === true);

/* Clipboard content sanity */
const clip = await page.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR:' + e.message));
check('brief copied to clipboard', clip.includes('Budi') && clip.includes('budi@example.com'), clip.slice(0, 60).replace(/\n/g, ' '));

/* Copy email button */
await page.locator('[data-copy-email]').click();
await page.waitForTimeout(400);
const copyStatus = await page.evaluate(() => document.querySelector('[data-copy-status]')?.textContent?.trim());
check('copy email gives feedback', Boolean(copyStatus), copyStatus?.slice(0, 80));
const clip2 = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
check('email actually in clipboard', clip2.includes('@'), clip2.slice(0, 40));

/* Service deep-link from project page */
await page.goto(BASE + '/projects/dikaroute/', { waitUntil: 'networkidle' });
const cta = await page.evaluate(() => document.querySelector('.project-hero__actions a.btn--primary')?.getAttribute('href'));
check('project page CTA links contact with service', /\/contact\/\?service=/.test(cta ?? ''), cta);
await page.goto(BASE + cta, { waitUntil: 'networkidle' });
const preselected = await page.evaluate(() => document.querySelector('#service')?.value);
check('service preselects from query', Boolean(preselected), preselected);

check('no page errors during flow', errors.length === 0, errors.join('; '));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} form checks passed`);
if (failed.length) process.exitCode = 1;
