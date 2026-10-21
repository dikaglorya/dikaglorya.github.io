import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

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
    colorScheme: 'dark',
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
        heroTitleVisible: (() => {
          const title = document.querySelector('.hero__title');
          if (!title) return null;
          return Array.from(title.querySelectorAll('.line > span')).every(
            (span) => Number.parseFloat(getComputedStyle(span).opacity) > 0.5,
          );
        })(),
        heroScene: (() => {
          const root = document.querySelector('[data-hero-scene]');
          const canvas = root?.querySelector('canvas');
          const fallback = root?.querySelector('.hero__scene-fallback');
          return root && canvas
            ? {
                ready: root.dataset.sceneReady === 'true',
                initialized: root.dataset.initialized === 'true',
                threeRequested: performance
                  .getEntriesByType('resource')
                  .some((entry) => entry.name.includes('three.module')),
                fallbackOpacity: fallback ? getComputedStyle(fallback).opacity : '0',
                width: canvas.width,
                height: canvas.height,
              }
            : null;
        })(),
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
    if (pageInfo.path === '/' && metrics.heroTitleVisible === false) {
      issues.push(`${pageInfo.name} @ ${viewport.name}: hero headline is visually hidden`);
    }

    if (pageInfo.path === '/') {
      if (viewport.name === 'desktop') {
        if (!metrics.heroScene?.ready || metrics.heroScene.width === 0 || metrics.heroScene.height === 0) {
          issues.push(`${pageInfo.name} @ ${viewport.name}: 3D hero scene did not initialize`);
        }
        if (!metrics.heroScene?.threeRequested) {
          issues.push(`${pageInfo.name} @ ${viewport.name}: Three.js chunk was not requested for desktop hero`);
        }
        if (metrics.heroScene?.ready) {
          const canvasImage = await page.locator('[data-hero-canvas]').screenshot();
          const { data, info } = await sharp(canvasImage).removeAlpha().raw().toBuffer({ resolveWithObject: true });
          let brightPixels = 0;
          for (let index = 0; index < data.length; index += 3) {
            const high = Math.max(data[index], data[index + 1], data[index + 2]);
            const low = Math.min(data[index], data[index + 1], data[index + 2]);
            // The hero scene is intentionally monochrome, so measure lit
            // neutral pixels instead of chromatic ones.
            if (high > 45 && high - low <= 24) brightPixels += 1;
          }
          if (brightPixels < 500) {
            issues.push(`${pageInfo.name} @ ${viewport.name}: 3D hero canvas appears blank (${info.width}x${info.height})`);
          }
        }
      } else {
        if (metrics.heroScene?.initialized || metrics.heroScene?.threeRequested || metrics.heroScene?.fallbackOpacity === '0') {
          issues.push(`${pageInfo.name} @ ${viewport.name}: lightweight hero fallback is not active`);
        }
      }
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
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  const opener = page.locator('[data-menu-open]');
  await opener.click();
  await page.waitForTimeout(250);
  const isOpen = await page.locator('[data-menu]').evaluate((dialog) => dialog.hasAttribute('open'));
  if (!isOpen) issues.push('mobile menu: did not open');
  const expanded = await opener.getAttribute('aria-expanded');
  if (expanded !== 'true') issues.push('mobile menu: opener aria-expanded is not true while open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const closed = await page.locator('[data-menu]').evaluate((dialog) => !dialog.hasAttribute('open'));
  if (!closed) issues.push('mobile menu: did not close with Escape');
  const collapsed = await opener.getAttribute('aria-expanded');
  if (collapsed !== 'false') issues.push('mobile menu: opener aria-expanded is not false when closed');
  const focused = await opener.evaluate((element) => element === document.activeElement);
  if (!focused) issues.push('mobile menu: focus did not return to the opener');
  await context.close();
}

// Project filters.
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
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

  await page.locator('[data-project-search]').fill('DikaRoute');
  const searchCount = await page.locator('[data-project-item]:visible').count();
  if (searchCount !== 2) issues.push(`project search: DikaRoute shows ${searchCount} projects, expected 2`);
  await page.locator('[data-project-search]').fill('');

  await page.locator('[data-project-view="grid"]').click();
  const view = await page.locator('[data-project-list]').getAttribute('data-view');
  const gridPressed = await page.locator('[data-project-view="grid"]').getAttribute('aria-pressed');
  if (view !== 'grid' || gridPressed !== 'true') issues.push('project view: grid toggle did not activate');

  const firstProject = page.locator('[data-project-item]').first();
  await firstProject.focus();
  await page.keyboard.press('Space');
  const quickLookTitle = await page.locator('[data-quick-look-title]').textContent();
  if (!quickLookTitle?.includes('DikaRoute')) issues.push(`Quick Look: unexpected title "${quickLookTitle}"`);
  await page.keyboard.press('Escape');
  const quickLookClosed = await page.locator('[data-quick-look]').evaluate((dialog) => !dialog.hasAttribute('open'));
  if (!quickLookClosed) issues.push('Quick Look: Escape did not close preview');
  await context.close();
}

// Contact page selection and copy.
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const page = await context.newPage();
  await page.goto(`${baseURL}/contact/?service=bot`, { waitUntil: 'networkidle' });
  const selected = await page.locator('#service').inputValue();
  if (selected !== 'bot') issues.push(`contact: query service not selected (got "${selected}")`);
  await page.locator('[data-copy-email]').click();
  await page.waitForTimeout(150);
  const copyStatus = await page.locator('[data-copy-status]').textContent();
  if (!copyStatus?.includes('disalin')) {
    issues.push(`contact: copy email did not report success (got "${copyStatus}")`);
  }
  await context.close();
}

// System light preference should switch the shared shell without overflow.
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  const appearance = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  if (appearance.background !== 'rgb(242, 242, 244)') {
    issues.push(`light appearance: unexpected body background ${appearance.background}`);
  }
  if (appearance.scrollWidth > appearance.innerWidth + 1) {
    issues.push('light appearance: horizontal overflow at 390px');
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
