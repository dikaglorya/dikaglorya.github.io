/**
 * Landscape / short-viewport audit.
 * Android phones in landscape are ~360-430px tall, which breaks assumptions
 * about vertical space: sticky headers, sticky TOC, full-height heroes.
 */
import { chromium } from 'playwright';
const base = 'http://127.0.0.1:4321';
const pages = ['/', '/projects/', '/journal/small-static-portfolio-architecture/', '/contact/', '/faq/', '/about/'];
const vps = [
  { name: 'land-640x360', w: 640, h: 360 },
  { name: 'land-740x360', w: 740, h: 360 },
  { name: 'land-844x390', w: 844, h: 390 },
  { name: 'land-932x430', w: 932, h: 430 },
  { name: 'short-1024x600', w: 1024, h: 600 },
];
const b = await chromium.launch();
for (const vp of vps) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, colorScheme: 'dark', isMobile: vp.w < 1000, hasTouch: vp.w < 1000 });
  const p = await ctx.newPage();
  for (const path of pages) {
    await p.goto(base + path, { waitUntil: 'networkidle' });
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += Math.round(vp.h * 0.7)) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(12); }
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(150);
    const res = await p.evaluate(() => {
      const out = [];
      const de = document.documentElement;
      if (de.scrollWidth > de.clientWidth + 1) out.push(`doc-overflow ${de.scrollWidth}>${de.clientWidth}`);
      // sticky elements taller than viewport
      for (const el of document.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        if (cs.position !== 'sticky' && cs.position !== 'fixed') continue;
        const r = el.getBoundingClientRect();
        // A sticky box is only a problem if its own box cannot fit between the
        // sticky offset and the bottom of the viewport AND it cannot scroll
        // internally to reveal the rest.
        const selfScrolls = /auto|scroll/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1;
        if (r.height > innerHeight - r.top && !selfScrolls) {
          const cls = (el.className || '').toString().split(' ').filter(Boolean)[0];
          out.push(`${cs.position} clipped: ${el.tagName.toLowerCase()}.${cls} ${Math.round(r.height)}px at top ${Math.round(r.top)} in ${innerHeight}px`);
        }
      }
      // header eating the screen
      const hd = document.querySelector('.site-header');
      if (hd) {
        const hr = hd.getBoundingClientRect().height;
        if (hr / innerHeight > 0.2) out.push(`header ${Math.round(hr)}px = ${Math.round((hr / innerHeight) * 100)}% of viewport height`);
      }
      // content escaping vertically behind header at top
      const main = document.querySelector('#main');
      const h1 = document.querySelector('h1');
      if (hd && h1 && main.contains(h1)) {
        const hb = hd.getBoundingClientRect().bottom;
        const t = h1.getBoundingClientRect().top;
        if (t < hb - 1) out.push(`h1 under header: top=${Math.round(t)} < ${Math.round(hb)}`);
      }
      // mobile menu usability in landscape
      return out;
    });
    console.log(`${vp.name} ${path}: ${res.length ? res.join(' | ') : 'clean'}`);
  }
  // landscape menu open
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const menu = await p.evaluate(() => {
    const t = document.querySelector('[data-menu-open]');
    return t ? { visible: t.getBoundingClientRect().height > 0, h: Math.round(t.getBoundingClientRect().height) } : null;
  });
  if (menu?.visible) {
    await p.locator('[data-menu-open]').click();
    await p.waitForTimeout(400);
    const open = await p.evaluate(() => {
      const sheet = document.querySelector('[data-mobile-menu], .mobile-menu, dialog[open]');
      if (!sheet) return 'no sheet found';
      const r = sheet.getBoundingClientRect();
      const cs = getComputedStyle(sheet);
      const items = [...sheet.querySelectorAll('a,button')].map((a) => {
        const ar = a.getBoundingClientRect();
        return { h: Math.round(ar.height), inView: ar.top >= -1 && ar.bottom <= innerHeight + 1, txt: a.textContent.trim().slice(0, 14) };
      });
      const unreachable = items.filter((i) => !i.inView);
      return {
        box: `${Math.round(r.width)}x${Math.round(r.height)} at ${Math.round(r.top)}`,
        overflowY: cs.overflowY,
        scrollable: sheet.scrollHeight > sheet.clientHeight,
        items: items.length,
        unreachable: unreachable.length,
        small: items.filter((i) => i.h < 44).length,
      };
    });
    console.log(`  ${vp.name} menu open:`, JSON.stringify(open));
  }
  await ctx.close();
}
await b.close();
