/**
 * Route-level performance budget harness.
 * Measures what a visitor downloads before scrolling, then reports lazy-loaded
 * work separately. Aggregate build bytes are informational: Astro emits
 * route-specific and on-demand chunks, so summing every chunk is not a
 * meaningful first-load budget.
 *
 * Usage: npm run build && npm run preview (another shell), then npm run test:perf
 * Env: BASE_URL (default http://127.0.0.1:4321), PERF_JSON (optional output)
 */
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
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
const BUDGET = {
  lcp: 2500,
  cls: 0.02,
  ttfb: 800,
  initialTransferPerPage: 420 * 1024,
  initialRequestsPerPage: 14,
  initialCssPerPage: 60 * 1024,
  initialJsPerPage: 180 * 1024,
  htmlPerPage: 32 * 1024,
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

  const totals = { transfer: 0, requests: 0, css: 0, js: 0, byType: {} };
  const responseTasks = [];
  page.on('response', (response) => {
    const task = (async () => {
      const type = response.request().resourceType();
      const size = (await response.request().sizes().catch(() => null))?.responseBodySize ?? 0;
      totals.requests += 1;
      totals.transfer += size;
      totals.byType[type] = (totals.byType[type] ?? 0) + size;
      if (type === 'stylesheet') totals.css += size;
      if (type === 'script') totals.js += size;
    })();
    responseTasks.push(task);
  });
  const flushResponses = async () => { await Promise.all(responseTasks.slice()); };

  await page.addInitScript(() => {
    window.__perf = { lcp: 0, lcpElement: '', lcpClass: '', lcpText: '', cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const element = entry.element;
        window.__perf.lcp = entry.startTime;
        window.__perf.lcpElement = element?.tagName?.toLowerCase() ?? '';
        window.__perf.lcpClass = typeof element?.className === 'string' ? element.className : '';
        window.__perf.lcpText = element?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 100) ?? '';
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perf.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  const started = Date.now();
  const response = await page.goto(`${baseURL}${pageInfo.path}`, { waitUntil: 'load', timeout: 60000 });
  const ttfb = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav ? nav.responseStart - nav.requestStart : 0;
  });
  const htmlBytes = response ? ((await response.request().sizes().catch(() => null))?.responseBodySize ?? 0) : 0;

  // Let critical, idle-loaded scripts and fonts settle before defining startup.
  await page.waitForTimeout(1200);
  await flushResponses();
  const startup = { ...totals, byType: { ...totals.byType } };

  // Exercise lazy regions. Their bytes are reported separately from startup.
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 400));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  await flushResponses();

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
    lcpClass: metrics.lcpClass,
    lcpText: metrics.lcpText,
    cls: Number(metrics.cls.toFixed(4)),
    htmlBytes,
    startup: {
      requests: startup.requests,
      transferBytes: startup.transfer,
      cssBytes: startup.css,
      jsBytes: startup.js,
    },
    afterScroll: {
      requests: totals.requests,
      transferBytes: totals.transfer,
      cssBytes: totals.css,
      jsBytes: totals.js,
    },
    wallMs: Date.now() - started,
  });
  await context.close();
}
await browser.close();

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
  if (result.lcp > BUDGET.lcp) failures.push(`${where}: LCP ${result.lcp}ms > ${BUDGET.lcp}ms (${result.lcpElement}.${result.lcpClass})`);
  if (result.cls > BUDGET.cls) failures.push(`${where}: CLS ${result.cls} > ${BUDGET.cls}`);
  if (result.ttfb > BUDGET.ttfb) failures.push(`${where}: TTFB ${result.ttfb}ms > ${BUDGET.ttfb}ms`);
  if (result.startup.transferBytes > BUDGET.initialTransferPerPage)
    failures.push(`${where}: startup transfer ${Math.round(result.startup.transferBytes / 1024)}KB > ${BUDGET.initialTransferPerPage / 1024}KB`);
  if (result.startup.requests > BUDGET.initialRequestsPerPage)
    failures.push(`${where}: ${result.startup.requests} startup requests > ${BUDGET.initialRequestsPerPage}`);
  if (result.startup.cssBytes > BUDGET.initialCssPerPage)
    failures.push(`${where}: startup CSS ${result.startup.cssBytes}B > ${BUDGET.initialCssPerPage}B`);
  if (result.startup.jsBytes > BUDGET.initialJsPerPage)
    failures.push(`${where}: startup JS ${result.startup.jsBytes}B > ${BUDGET.initialJsPerPage}B`);
  if (result.htmlBytes > BUDGET.htmlPerPage)
    failures.push(`${where}: HTML ${result.htmlBytes}B > ${BUDGET.htmlPerPage}B`);
}

const summary = {
  profile: `slow-4g / cpu-${CPU_SLOWDOWN}x`,
  budget: BUDGET,
  assets: { aggregateCssInformationalBytes: cssBytes, aggregateJsInformationalBytes: jsBytes },
  pages: results,
};
if (process.env.PERF_JSON) await writeFile(process.env.PERF_JSON, `${JSON.stringify(summary, null, 2)}\n`);

console.log(`profile: ${summary.profile}`);
console.log(`build chunks (informational): CSS ${(cssBytes / 1024).toFixed(1)}KB · JS ${(jsBytes / 1024).toFixed(1)}KB`);
console.table(results.map((r) => ({
  page: r.page,
  ttfb: r.ttfb,
  fcp: r.fcp,
  lcp: r.lcp,
  lcpEl: `${r.lcpElement}.${r.lcpClass}`,
  cls: r.cls,
  startupKB: Math.round(r.startup.transferBytes / 1024),
  startupJSKB: Math.round(r.startup.jsBytes / 1024),
  afterScrollJSKB: Math.round(r.afterScroll.jsBytes / 1024),
})));
if (failures.length) {
  console.error(`\n${failures.length} budget failure(s):`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log('\nroute-level performance budgets: passed');
