import { chromium } from 'playwright';
const URL = 'http://127.0.0.1:4322/';
const browser = await chromium.launch({ args: ['--no-sandbox'] });

const run = async (label, viewport, opts = {}) => {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const longTasks = [];
  const reflows = [];
  await cdp.send('Performance.enable');
  await page.addInitScript(() => {
    window.__lcp = null; window.__cls = [];
    new PerformanceObserver((l) => { const e = l.getEntries(); const last = e[e.length - 1];
      window.__lcp = { tag: last.element?.tagName, cls: last.element?.className?.toString().slice(0,60), txt: last.element?.textContent?.trim().slice(0,50), size: last.size, t: Math.round(last.startTime) }; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls.push({ v: e.value, src: e.sources?.map(s => s.node?.className?.toString().slice(0,40) || s.node?.tagName) }); }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt = (window.__lt || []).concat([{ d: Math.round(e.duration), t: Math.round(e.startTime) }]); }).observe({ type: 'longtask', buffered: true });
    window.__lt = [];
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(4000);

  // frame cost of the RAF loop
  const frames = await page.evaluate(() => new Promise((res) => {
    const ts = []; let n = 0;
    const tick = (t) => { ts.push(t); if (++n < 60) requestAnimationFrame(tick); else res(ts); };
    requestAnimationFrame(tick);
  })).catch(() => []);
  const deltas = frames.slice(1).map((t, i) => t - frames[i]).sort((a, b) => a - b);
  const med = deltas.length ? deltas[Math.floor(deltas.length / 2)] : -1;

  // forced reflow probe while scrolling

  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 16)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(500);

  const info = await page.evaluate(() => ({
    lcp: window.__lcp, cls: window.__cls.reduce((s, c) => s + c.v, 0),
    clsSrc: window.__cls.slice(0, 4), lt: window.__lt.slice(0, 10),
    ltTotal: window.__lt.reduce((s, t) => s + t.d, 0),
    docH: document.documentElement.scrollHeight,
    scene: document.querySelector('[data-hero-scene]')?.dataset.sceneReady,
    canvasSize: (() => { const c = document.querySelector('[data-hero-canvas]'); return c ? `${c.width}x${c.height}` : null; })(),
  }));
  const metrics = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  console.log(`\n### ${label} ${viewport.width}x${viewport.height}`);
  console.log(`LCP: ${JSON.stringify(info.lcp)}`);
  console.log(`CLS: ${info.cls.toFixed(5)}  shifts:${JSON.stringify(info.clsSrc)}`);
  console.log(`longtasks: ${info.lt.length} shown, total ${info.ltTotal}ms -> ${info.lt.map(t => t.t + '+' + t.d).join(', ')}`);
  console.log(`RAF median dt: ${med.toFixed(1)}ms (~${med > 0 ? (1000 / med).toFixed(0) : '?'}fps)  canvas=${info.canvasSize} sceneReady=${info.scene}`);
  console.log(`LayoutCount=${metrics.LayoutCount} RecalcStyle=${metrics.RecalcStyleCount} LayoutDuration=${metrics.LayoutDuration.toFixed(3)}s ScriptDuration=${metrics.ScriptDuration.toFixed(3)}s TaskDuration=${metrics.TaskDuration.toFixed(3)}s`);
  await ctx.close();
};

await run('mobile', { width: 390, height: 844 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
await run('desktop', { width: 1440, height: 900 });
await browser.close();
