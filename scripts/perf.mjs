/**
 * Performance budget harness.
 *
 * Measures the built site on a local preview server under a simulated
 * "Slow 4G + mid-tier CPU" profile, then asserts a small budget so regressions
 * fail the run instead of being noticed months later.
 *
 * Usage:
 *   npm run build && npm run preview   # in another shell
 *   npm run test:perf
 *
 * Env:
 *   BASE_URL  preview origin (default http://127.0.0.1:4321)
 *   PERF_JSON write raw results to this path (optional)
 */
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';

// Slow 4G: 1.6 Mbit/s down, 750 Kbit/s up, 150 ms RTT. CPU throttled 4x.
const NETWORK = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};
const CPU_SLOWDOWN = 4;

const pages = [
  { name: 'home', path: '/' },
  { name: 'projects', path: '/projects/' },
  { name: 'project-dikaroute', path: '/projects/dikaroute/' },
  { name: 'journal', path: '/journal/' },
  { name: 'journal-article', path: '/journal/small-static-portfolio-architecture/' },
  { name: 'about', path: '/about/' },
  { name: 'services', path: '/services/' },
  { name: 'contact', path: '/contact/' },
];

// Budgets are deliberately generous: they catch regressions, not perfection.
const BUDGET = {
  lcp: 2500,
  cls: 0.02,
  ttfb: 800,
  transferPerPage: 420 * 1024,
  requestsPerPage: 14,
  htmlBytes: 32 * 1024,
  cssBytes: 60 * 1024,
  jsBytes: 16 * 1024,
};

const browser = await chromium.launch({ headless: true });
const results = [];

for (const pageInfo of pages) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', NETWORK);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });

  let transferred = 0;
  let requests = 0;
  const byType = {};
  page.on('response', async (response) => {
    requests += 1;
    const request = response.request();
    const type = request.resourceType();
    const sizes = await response.request().sizes().catch(() => null);
    const bytes = sizes?.responseBodySize ?? 0;
    transferred += bytes;
    byType[type] = (byType[type] ?? 0) + bytes;
  });

  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, lcpElement: '' };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        window.__perf.lcp = last.startTime;
        window.__perf.lcpElement = last.element?.tagName?.toLowerCase() ?? '';
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perf.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  const started = Date.now();
  const response = await page.goto(`${baseURL}${pageInfo.path}`, {
    waitUntil: 'load',
    timeout: 60000,
  });
  const ttfb = response ? await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav ? nav.responseStart - nav.requestStart : 0;
  }) : 0;

  // Give late layout shifts and lazy images a chance to settle.
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 400));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);

  const metrics = await page.evaluate(() => window.__perf);
  const fcp = await page.evaluate(() => {
    const entry = performance.getEntriesByName('first-contentful-paint')[0];
    return entry ? entry.startTime : 0;
  });

  results.push({
    page: pageInfo.name,
    path: pageInfo.path,
    status: response?.status() ?? 0,
    ttfb: Math.round(ttfb),
    fcp: Math.round(fcp),
    lcp: Math.round(metrics.lcp),
    lcpElement: metrics.lcpElement,
    cls: Number(metrics.cls.toFixed(4)),
    requests,
    transferKB: Math.round(transferred / 1024),
    byTypeKB: Object.fromEntries(
      Object.entries(byType).map(([key, value]) => [key, Math.round(value / 1024)]),
    ),
    wallMs: Date.now() - started,
  });

  await context.close();
}

await browser.close();

// Static asset sizes straight from the build output.
const { readdir, stat } = await import('node:fs/promises');
const path = await import('node:path');
const assetDir = path.join(process.cwd(), 'dist', '_astro');
let cssBytes = 0;
let jsBytes = 0;
for (const file of await readdir(assetDir).catch(() => [])) {
  const size = (await stat(path.join(assetDir, file))).size;
  if (file.endsWith('.css')) cssBytes += size;
  if (file.endsWith('.js')) jsBytes += size;
}

const failures = [];
for (const result of results) {
  const where = `${result.page} (${result.path})`;
  if (result.status !== 200) failures.push(`${where}: HTTP ${result.status}`);
  if (result.lcp > BUDGET.lcp) failures.push(`${where}: LCP ${result.lcp}ms > ${BUDGET.lcp}ms`);
  if (result.cls > BUDGET.cls) failures.push(`${where}: CLS ${result.cls} > ${BUDGET.cls}`);
  if (result.ttfb > BUDGET.ttfb) failures.push(`${where}: TTFB ${result.ttfb}ms > ${BUDGET.ttfb}ms`);
  if (result.transferKB > BUDGET.transferPerPage / 1024)
    failures.push(`${where}: ${result.transferKB}KB > ${BUDGET.transferPerPage / 1024}KB`);
  if (result.requests > BUDGET.requestsPerPage)
    failures.push(`${where}: ${result.requests} requests > ${BUDGET.requestsPerPage}`);
}
if (cssBytes > BUDGET.cssBytes) failures.push(`CSS ${cssBytes}B > ${BUDGET.cssBytes}B`);
if (jsBytes > BUDGET.jsBytes) failures.push(`JS ${jsBytes}B > ${BUDGET.jsBytes}B`);

const summary = {
  profile: `slow-4g / cpu-${CPU_SLOWDOWN}x`,
  budget: BUDGET,
  assets: { cssBytes, jsBytes },
  pages: results,
};

if (process.env.PERF_JSON) {
  await writeFile(process.env.PERF_JSON, `${JSON.stringify(summary, null, 2)}\n`);
}

console.log(`profile: ${summary.profile}`);
console.log(`css ${(cssBytes / 1024).toFixed(1)}KB · js ${(jsBytes / 1024).toFixed(1)}KB`);
console.table(
  results.map((r) => ({
    page: r.page,
    ttfb: r.ttfb,
    fcp: r.fcp,
    lcp: r.lcp,
    lcpEl: r.lcpElement,
    cls: r.cls,
    req: r.requests,
    kb: r.transferKB,
  })),
);

if (failures.length) {
  console.error(`\n${failures.length} budget failure(s):`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log('\nperformance budget: passed');
