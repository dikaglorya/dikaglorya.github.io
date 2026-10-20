import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const axePath = path.join(process.cwd(), 'node_modules/axe-core/axe.min.js');
const axeURL = new URL('/__test__/axe.min.js', baseURL).href;
const axeSource = await readFile(axePath);

const pages = [
  '/',
  '/projects/',
  '/projects/dikaroute/',
  '/journal/',
  '/journal/small-static-portfolio-architecture/',
  '/journal/static-contact-form-mailto-handoff/',
  '/about/',
  '/services/',
  '/contact/',
  '/404.html',
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small', width: 320, height: 740 },
];

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'reduce',
  });

  for (const pagePath of pages) {
    const page = await context.newPage();
    await page.route(axeURL, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: axeSource,
      }),
    );
    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));

    await page.goto(`${baseURL}${pagePath}`, { waitUntil: 'networkidle' });
    await page.addScriptTag({ url: axeURL });

    const results = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      });
    });

    for (const violation of results.violations) {
      issues.push({
        page: pagePath,
        viewport: viewport.name,
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => ({
          target: node.target.join(' '),
          summary: node.failureSummary,
        })),
      });
    }

    for (const error of consoleErrors) {
      issues.push({
        page: pagePath,
        viewport: viewport.name,
        id: 'console-error',
        impact: 'serious',
        help: error,
        nodes: [],
      });
    }

    await page.close();
  }

  await context.close();
}

await browser.close();

if (issues.length) {
  console.error(`Accessibility check failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`\n[${issue.viewport}] ${issue.page} / ${issue.id} (${issue.impact})`);
    console.error(issue.help);
    for (const node of issue.nodes) {
      console.error(`- ${node.target}`);
      if (node.summary) console.error(`  ${node.summary.replaceAll('\n', '\n  ')}`);
    }
  }
  process.exit(1);
}

console.log(`Accessibility check passed: ${pages.length} pages at ${viewports.length} viewports.`);
