import { chromium } from 'playwright';
const BASE = process.env.BASE || 'https://dikaofc.devs.li/';
const browser = await chromium.launch();
for (const [label, url] of [['LIVE', 'https://dikaofc.devs.li/'], ['LOCAL', 'http://127.0.0.1:4322/']]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('requestfailed', r => errs.push('failed: ' + r.url() + ' ' + r.failure()?.errorText));
  page.on('response', r => { if (r.status() >= 400) errs.push('HTTP ' + r.status() + ' ' + r.url()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const hdr = document.querySelector('.site-header');
    const inner = document.querySelector('.site-header__inner');
    const wm = document.querySelector('.wordmark');
    const nav = document.querySelector('.site-nav__link');
    const hero = document.querySelector('.hero');
    const h1 = document.querySelector('h1');
    const hr = hero.getBoundingClientRect();
    const h1r = h1.getBoundingClientRect();
    const hb = hdr.getBoundingClientRect();
    return {
      shellHeight: cs.getPropertyValue('--shell-height').trim() || '(undefined)',
      headerHeightVar: cs.getPropertyValue('--header-height').trim() || '(undefined)',
      headerRect: [Math.round(hb.x), Math.round(hb.y), Math.round(hb.width), Math.round(hb.height)],
      headerCssHeight: getComputedStyle(hdr).height,
      innerRect: (() => { const r = inner.getBoundingClientRect(); return [Math.round(r.y), Math.round(r.height)]; })(),
      innerH: getComputedStyle(inner).height,
      wordmarkCenterY: Math.round(wm.getBoundingClientRect().y + wm.getBoundingClientRect().height / 2),
      headerCenterY: Math.round(hb.y + hb.height / 2),
      navLinkCenterY: Math.round(nav.getBoundingClientRect().y + nav.getBoundingClientRect().height / 2),
      bodyPadTop: getComputedStyle(document.body).paddingTop,
      heroTop: Math.round(hr.y),
      heroHeaderOverlap: Math.max(0, Math.round(hb.bottom - hb.y + 0) - Math.max(0, Math.round(hr.y - hb.y))),
      heroClippedByHeader: Math.round(hb.bottom) - Math.round(hr.y),
      h1: { y: Math.round(h1r.y), h: Math.round(h1r.height), op: getComputedStyle(h1).opacity },
      headerZ: getComputedStyle(hdr).zIndex,
      dockZ: getComputedStyle(document.querySelector('.app-dock')).zIndex,
      dupText: [...inner.querySelectorAll('.menu-bar__page, .site-nav__link')].filter(e => e.textContent.trim() === 'Beranda' && e.getBoundingClientRect().width > 0).map(e => e.className + '@' + Math.round(e.getBoundingClientRect().x)),
    };
  });
  console.log(`\n##### ${label} ${url}`);
  console.log(JSON.stringify(m, null, 1));
  console.log('ERRORS:', errs.length ? JSON.stringify(errs.slice(0, 12), null, 1) : 'none');
  await page.screenshot({ path: `/tmp/cmp-${label}-light.png` });
  await ctx.close();
}
await browser.close();
