import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const output = path.join(process.cwd(), '.test-output', 'screenshots');
await mkdir(output, { recursive: true });

const pages = [
  { name: 'home', path: '/' },
  { name: 'projects', path: '/projects/' },
  { name: 'project-dikaroute', path: '/projects/dikaroute/' },
  { name: 'journal', path: '/journal/' },
  {
    name: 'journal-article',
    path: '/journal/small-static-portfolio-architecture/',
  },
  {
    name: 'journal-contact-article',
    path: '/journal/static-contact-form-mailto-handoff/',
  },
  { name: 'about', path: '/about/' },
  { name: 'services', path: '/services/' },
  { name: 'contact', path: '/contact/' },
  { name: '404', path: '/404.html' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small', width: 320, height: 740 },
];

const issues = [];
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'no-preference',
  });

  for (const pageInfo of pages) {
    const page = await context.newPage();
    const consoleErrors = [];
    const badResponses = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) {
        badResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto(`${baseURL}${pageInfo.path}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // Scroll through the page so lazy content settles before the full-page screenshot.
    await page.evaluate(async () => {
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      const step = Math.max(320, window.innerHeight * 0.75);
      const height = document.body.scrollHeight;
      for (let y = 0; y < height; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = previous;
    });
    await page.waitForTimeout(900);

    const metrics = await page.evaluate(() => {
      const bodyStyle = getComputedStyle(document.body);
      const h1 = document.querySelector('h1');
      const h1Style = h1 ? getComputedStyle(h1) : null;
      return {
        title: document.title,
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyBackground: bodyStyle.backgroundColor,
        bodyColor: bodyStyle.color,
        bodyFont: bodyStyle.fontFamily,
        h1Text: h1?.textContent?.trim().replace(/\s+/g, ' ') ?? '',
        h1Font: h1Style?.fontFamily ?? '',
        h1Size: h1Style?.fontSize ?? '',
        h1Color: h1Style?.color ?? '',
      };
    });

    if (metrics.scrollWidth > metrics.innerWidth + 1) {
      issues.push(
        `${pageInfo.name} @ ${viewport.name}: horizontal overflow (${metrics.scrollWidth}px > ${metrics.innerWidth}px)`,
      );
    }

    if (metrics.bodyBackground !== 'rgb(8, 9, 11)') {
      issues.push(
        `${pageInfo.name} @ ${viewport.name}: unexpected body background ${metrics.bodyBackground}`,
      );
    }

    if (!metrics.h1Text) {
      issues.push(`${pageInfo.name} @ ${viewport.name}: missing h1`);
    }

    for (const error of consoleErrors) {
      issues.push(`${pageInfo.name} @ ${viewport.name}: console error: ${error}`);
    }

    for (const response of badResponses) {
      issues.push(`${pageInfo.name} @ ${viewport.name}: bad response: ${response}`);
    }

    await page.screenshot({
      path: path.join(output, `${pageInfo.name}-${viewport.name}.png`),
      fullPage: true,
    });

    console.log(
      `${pageInfo.name.padEnd(18)} ${viewport.name.padEnd(8)} ${metrics.h1Size.padEnd(8)} ${metrics.title}`,
    );

    await page.close();
  }

  await context.close();
}

// Mobile menu behavior.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  const opener = page.locator('[data-menu-open]');
  await opener.click();
  await page.waitForTimeout(250);
  const isOpen = await page.locator('[data-menu]').evaluate((dialog) => dialog.hasAttribute('open'));
  if (!isOpen) issues.push('mobile menu: did not open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const closed = await page.locator('[data-menu]').evaluate((dialog) => !dialog.hasAttribute('open'));
  if (!closed) issues.push('mobile menu: did not close with Escape');
  const focused = await opener.evaluate((element) => element === document.activeElement);
  if (!focused) issues.push('mobile menu: focus did not return to the opener');
  await context.close();
}

// Project filters.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/projects/`, { waitUntil: 'networkidle' });
  await page.locator('button[data-filter="Web"]').click();
  await page.waitForTimeout(100);
  const webCount = await page.locator('[data-project-item]:visible').count();
  const webPressed = await page
    .locator('button[data-filter="Web"]')
    .getAttribute('aria-pressed');
  if (webCount !== 3) issues.push(`project filter: Web shows ${webCount} projects, expected 3`);
  if (webPressed !== 'true') issues.push('project filter: Web aria-pressed is not true');
  const countText = await page.locator('[data-project-count]').textContent();
  if (!countText?.includes('3')) {
    issues.push(`project filter: count text did not update (got "${countText}")`);
  }
  await page.locator('button[data-filter="all"]').first().click();
  await page.waitForTimeout(100);
  const allCount = await page.locator('[data-project-item]:visible').count();
  if (allCount !== 10) issues.push(`project filter: All shows ${allCount} projects, expected 10`);
  await context.close();
}

// Contact page selection and copy.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const page = await context.newPage();
  await page.goto(`${baseURL}/contact/?service=bot`, { waitUntil: 'networkidle' });
  const selected = await page.locator('#service').inputValue();
  if (selected !== 'bot') issues.push(`contact: query service not selected (got "${selected}")`);
  await page.locator('[data-copy-email]').click();
  await page.waitForTimeout(150);
  const copyStatus = await page.locator('[data-copy-status]').textContent();
  if (!copyStatus?.includes('copied')) {
    issues.push(`contact: copy email did not report success (got "${copyStatus}")`);
  }
  await context.close();
}

await browser.close();

if (issues.length) {
  console.error(`Visual check failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Visual check passed. Screenshots in ${path.relative(process.cwd(), output)}.`);
