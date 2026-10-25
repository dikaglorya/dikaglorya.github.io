/**
 * Lighthouse-style performance measurement using the Chrome DevTools Protocol
 * through Playwright. Reports LCP, CLS, TBT, transfer weight, and request count
 * under mobile emulation (CPU throttled 4x, slow 4G network conditions).
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321';
const PAGES = (process.argv[3] ?? '/,/projects/').split(',');

const browser = await chromium.launch();

for (const pth of PAGES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  let transferred = 0;
  let requests = 0;
  page.on('response', async (res) => {
    requests++;
    try {
      const h = await res.allHeaders();
      const len = Number(h['content-length'] ?? 0);
      if (len) transferred += len;
    } catch {}
  });

  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, tbt: 0, longTasks: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__perf.lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        window.__perf.longTasks++;
        window.__perf.tbt += Math.max(0, e.duration - 50);
      }
    }).observe({ type: 'longtask', buffered: true });
  });

  const navStart = Date.now();
  await page.goto(BASE + pth, { waitUntil: 'load', timeout: 60000 });
  // Let lazy work and LCP settle, then scroll once to trigger reveals.
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  const wall = Date.now() - navStart;

  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find((p) => p.name === 'first-contentful-paint')?.startTime ?? 0;
    return {
      ...window.__perf,
      fcp,
      domContentLoaded: nav?.domContentLoadedEventEnd ?? 0,
      loadEvent: nav?.loadEventEnd ?? 0,
      jsHeapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null,
    };
  });

  // Count script/style bytes served for this page
  const assets = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .filter((r) => ['script', 'css', 'img', 'font', 'fetch'].includes(r.initiatorType))
      .map((r) => ({ name: r.name.split('/').pop(), type: r.initiatorType, size: r.transferSize, dur: Math.round(r.duration) }))
      .sort((a, b) => b.size - a.size),
  );

  console.log(`\n=== ${pth} (mobile, 4x CPU, slow 4G) ===`);
  console.log(`FCP: ${Math.round(perf.fcp)}ms   LCP: ${Math.round(perf.lcp)}ms   CLS: ${perf.cls.toFixed(4)}`);
  console.log(`TBT (approx): ${Math.round(perf.tbt)}ms over ${perf.longTasks} long tasks`);
  console.log(`DOMContentLoaded: ${Math.round(perf.domContentLoaded)}ms   Load: ${Math.round(perf.loadEvent)}ms`);
  console.log(`Requests: ${requests}   Transferred: ${(transferred / 1024).toFixed(0)} KB   JS heap: ${perf.jsHeapMB} MB`);
  console.log(`Largest assets: ${assets.slice(0, 5).map((a) => `${a.name}(${(a.size / 1024).toFixed(0)}KB)`).join(', ')}`);
  console.log(`Total wall clock incl. settle time: ${wall}ms`);

  await ctx.close();
}

await browser.close();
