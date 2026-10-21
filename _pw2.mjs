import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__lt = []; window.__lcp = []; window.__cls = [];
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt.push({ d: Math.round(e.duration), t: Math.round(e.startTime), s: (e.attribution || []).map(a => a.containerSrc || a.name).join(',') }); }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp.push({ t: Math.round(e.startTime), el: e.element?.tagName + '.' + (e.element?.className || '') }); }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls.push({ v: +e.value.toFixed(4), n: e.sources?.[0]?.node?.className?.toString().slice(0, 40) }); }).observe({ type: 'layout-shift', buffered: true });
});
// CPU throttle 4x to mirror Lighthouse mobile
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.goto('http://127.0.0.1:4322/', { waitUntil: 'load' });
await page.waitForTimeout(6000);
const r = await page.evaluate(() => ({ lt: window.__lt, lcp: window.__lcp, cls: window.__cls, fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ':' + f.weight), docFonts: document.fonts.size }));
console.log('CPU 4x, mobile 390x844');
console.log('longtasks:', r.lt.length, 'total', r.lt.reduce((s, t) => s + t.d, 0) + 'ms');
r.lt.sort((a, b) => b.d - a.d).slice(0, 6).forEach(t => console.log(`  +${t.d}ms @${t.t}ms src=${t.s}`));
console.log('LCP entries:', JSON.stringify(r.lcp));
console.log('CLS:', r.cls.reduce((s, c) => s + c.v, 0).toFixed(4), JSON.stringify(r.cls.slice(0, 5)));
console.log('fonts loaded:', r.docFonts, r.fonts.join(' | '));

// Programmatic entry-point durations for our own scripts
const perf = await page.evaluate(() => performance.getEntriesByType('resource').map(e => `${e.name.split('/').pop()} d=${Math.round(e.duration)}`));
console.log('resources:', perf.join(' '));
await ctx.close(); await browser.close();
