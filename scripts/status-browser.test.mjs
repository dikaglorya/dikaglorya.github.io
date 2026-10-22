import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const browser = await chromium.launch({ headless: true });

try {
  for (const colorScheme of ['dark', 'light']) {
    const context = await browser.newContext({
      colorScheme,
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
    const availability = page.locator('.status-indicator[data-status="available"]:visible').first();
    assert.equal(await availability.isVisible(), true, `${colorScheme}: availability indicator is visible`);
    assert.equal(await availability.getAttribute('data-variant'), 'success');
    assert.match(await availability.locator('.status-indicator__label').innerText(), /Terbuka untuk proyek pilihan/);
    assert.equal(await availability.locator('svg').getAttribute('aria-hidden'), 'true');

    const actualSuccessColor = await availability.evaluate((element) => getComputedStyle(element).color);
    const expectedSuccessColor = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--status-success)';
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    assert.equal(actualSuccessColor, expectedSuccessColor, `${colorScheme}: indicator uses the theme token`);

    await page.goto(`${baseURL}/contact/`, { waitUntil: 'networkidle' });
    const formStatus = page.locator('[data-form-status]');
    await page.getByRole('button', { name: 'Siapkan brief email' }).click();
    await formStatus.waitFor({ state: 'visible' });
    assert.match(await formStatus.innerText(), /Lengkapi kolom wajib/);
    assert.equal(await formStatus.getAttribute('data-status'), 'error');
    assert.equal(await formStatus.getAttribute('data-status-variant'), 'danger');
    assert.equal(await formStatus.getAttribute('role'), 'status');
    assert.equal(await formStatus.getAttribute('aria-live'), 'polite');

    const actualDangerColor = await formStatus.evaluate((element) => getComputedStyle(element).color);
    const expectedDangerColor = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--status-danger)';
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    assert.equal(actualDangerColor, expectedDangerColor, `${colorScheme}: form error uses the theme danger token`);

    await context.close();
  }

  console.log('Status browser checks passed: dark/light availability tokens, decorative icon, and accessible live form error.');
} finally {
  await browser.close();
}
