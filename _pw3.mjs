import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const fonts = []; const all = [];
cdp.on('Network.responseReceived', e => {
  all.push(e.response.url.split('/').pop());
  if (e.response.url.includes('.woff2')) fonts.push({ f: e.response.url.split('/').pop(), t: Math.round(e.timestamp * 1000), prio: e.response.priority });
});
cdp.on('Network.requestWillBeSent', e => { if (e.request.url.includes('.woff2')) fonts.push({ req: e.request.url.split('/').pop(), t: Math.round(e.timestamp * 1000), prio: e.request.initialPriority }); });
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
await page.goto('http://127.0.0.1:4322/', { waitUntil: 'load' });
await page.waitForTimeout(5000);
const t0 = fonts.filter(f => f.req)[0]?.t || 0;
console.log('=== fonts (mobile 3G-ish, 4x CPU) ===');
fonts.filter(f => f.req || true).forEach(f => console.log(` ${f.req ? 'REQ ' : 'RESP'} ${(f.req || f.f).slice(0, 38).padEnd(38)} t=+${f.t - t0}ms prio=${f.prio}`));
const res = await page.evaluate(() => ({
  fontCount: document.fonts.size,
  loaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style}`),
  lcp: performance.getEntriesByType('largest-contentful-paint').map(e => Math.round(e.startTime)),
  fcp: performance.getEntriesByName('first-contentful-paint').map(e => Math.round(e.startTime)),
  cls: performance.getEntriesByType('layout-shift').filter(e => !e.hadRecentInput).reduce((s, e) => s + e.value, 0),
}));
console.log('\nfonts declared:', res.fontCount, '\nloaded:', res.loaded.join(' | '));
console.log('FCP', res.fcp, 'LCP', res.lcp, 'CLS', res.cls.toFixed(5));
await ctx.close(); await browser.close();
