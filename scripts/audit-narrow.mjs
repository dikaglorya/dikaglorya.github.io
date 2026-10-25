/**
 * Narrow-viewport interaction pass: menu and spotlight at 320px, where the
 * sheet has the least room to work with.
 */
import { chromium } from 'playwright';
const B = 'http://127.0.0.1:4321';
const b = await chromium.launch();
const issues = [];
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!ok) issues.push(name);
};

for (const w of [320, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 640 }, isMobile: true, hasTouch: true, colorScheme: 'dark' });
  const p = await ctx.newPage();
  await p.goto(B + '/', { waitUntil: 'networkidle' });

  // header + trigger
  const hdr = await p.evaluate(() => {
    const h = document.querySelector('.site-header').getBoundingClientRect();
    const t = document.querySelector('[data-menu-open]').getBoundingClientRect();
    return { h: Math.round(h.height), trigger: [Math.round(t.width), Math.round(t.height)], overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  check(`[${w}] header 56px`, hdr.h === 56, `${hdr.h}px`);
  check(`[${w}] menu trigger >= 44px`, hdr.trigger[0] >= 44 && hdr.trigger[1] >= 44, hdr.trigger.join('x'));
  check(`[${w}] no overflow at rest`, !hdr.overflow);

  // open menu
  await p.locator('[data-menu-open]').click();
  await p.waitForTimeout(400);
  const sheet = await p.evaluate(() => {
    const s = document.querySelector('[data-mobile-menu]') || document.querySelector('.mobile-sheet') || document.querySelector('dialog[open]');
    if (!s) return { missing: true };
    const r = s.getBoundingClientRect();
    const links = [...s.querySelectorAll('a,button')].filter((e) => e.getBoundingClientRect().height > 0);
    const rects = links.map((e) => e.getBoundingClientRect());
    let overlaps = 0;
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], c = rects[j];
        const ox = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        const oy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        if (ox > 2 && oy > 2) overlaps += 1;
      }
    return {
      w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left),
      overflowRight: Math.round(r.right - innerWidth),
      links: links.length,
      smallLinks: rects.filter((x) => x.height < 44).length,
      widestLink: Math.round(Math.max(...rects.map((x) => x.right))),
      overlaps,
      scrollable: s.scrollHeight > s.clientHeight,
      docOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  check(`[${w}] menu sheet fits width`, !sheet.missing && sheet.overflowRight <= 1, JSON.stringify(sheet));
  check(`[${w}] menu links >= 44px tall`, sheet.smallLinks === 0, `${sheet.smallLinks} small`);
  check(`[${w}] menu links do not overlap`, sheet.overlaps === 0, `${sheet.overlaps}`);
  check(`[${w}] menu causes no page overflow`, !sheet.docOverflow);

  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);

  // spotlight at 320
  await p.locator('[data-spotlight-open], [data-search-open]').first().click();
  await p.waitForTimeout(400);
  const spot = await p.evaluate(() => {
    const d = document.querySelector('[data-spotlight]');
    if (!d) return { missing: true };
    const r = d.getBoundingClientRect();
    const input = d.querySelector('input');
    const ir = input?.getBoundingClientRect();
    const items = [...d.querySelectorAll('[data-search-item]')].filter((e) => e.getBoundingClientRect().height > 0);
    return {
      box: [Math.round(r.width), Math.round(r.height)],
      overflowRight: Math.round(r.right - innerWidth),
      overflowBottom: Math.round(r.bottom - innerHeight),
      inputH: ir ? Math.round(ir.height) : null,
      inputW: ir ? Math.round(ir.width) : null,
      items: items.length,
      itemH: items.length ? Math.round(items[0].getBoundingClientRect().height) : null,
      docOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  check(`[${w}] spotlight fits width`, !spot.missing && spot.overflowRight <= 1, JSON.stringify(spot));
  check(`[${w}] spotlight input >= 44px`, spot.inputH >= 44, `${spot.inputH}px`);
  check(`[${w}] spotlight results >= 44px`, !spot.itemH || spot.itemH >= 44, `${spot.itemH}px`);
  check(`[${w}] spotlight causes no overflow`, !spot.docOverflow);

  await ctx.close();
}
await b.close();
console.log(issues.length ? `\n${issues.length} issue(s)` : '\nAll narrow-viewport interaction checks passed.');
