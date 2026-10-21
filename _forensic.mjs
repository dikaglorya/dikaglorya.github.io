import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4322/';
const browser = await chromium.launch();

async function mk(w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', m => logs.push({ t: 'console', type: m.type(), text: m.text() }));
  page.on('pageerror', e => logs.push({ t: 'pageerror', text: e.message, stack: (e.stack || '').split('\n').slice(0, 4).join(' | ') }));
  page.on('requestfailed', r => logs.push({ t: 'requestfailed', url: r.url(), err: r.failure()?.errorText }));
  page.on('response', r => { if (r.status() >= 400) logs.push({ t: 'http', status: r.status(), url: r.url() }); });
  return { ctx, page, logs };
}

// ---- 1) Hero H1 over time @1440x900 light ----
{
  const { ctx, page, logs } = await mk(1440, 900, { colorScheme: 'light' });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const samples = [];
  const t0 = Date.now();
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100);
    const s = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const hero = document.querySelector('.hero') || document.querySelector('main > section');
      if (!h1) return { missing: true };
      const cs = getComputedStyle(h1);
      const anims = h1.getAnimations ? h1.getAnimations().map(a => ({ name: a.animationName, state: a.playState, t: a.currentTime })) : [];
      const hr = hero?.getBoundingClientRect();
      const r = h1.getBoundingClientRect();
      const chain = [];
      let el = h1;
      while (el && el !== document.documentElement) {
        const c = getComputedStyle(el);
        chain.push({ tag: el.tagName + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''), op: c.opacity, vis: c.visibility, tr: c.transform, clip: c.clipPath, disp: c.display, ov: c.overflow, filter: c.filter, anim: c.animationName + ' ' + c.animationDuration });
        el = el.parentElement;
      }
      return { text: h1.textContent.trim().slice(0, 40), rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }, hero: hr && { y: Math.round(hr.y), h: Math.round(hr.height) }, opacity: cs.opacity, vis: cs.visibility, transform: cs.transform, clip: cs.clipPath, color: cs.color, fontSize: cs.fontSize, anims, chain, htmlClass: document.documentElement.className, bodyClass: document.body.className, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches };
    });
    samples.push({ ms: Date.now() - t0, ...s });
  }
  // print condensed: only show changes
  let prev = '';
  for (const s of samples) {
    const key = JSON.stringify([s.rect, s.opacity, s.vis, s.transform, s.clip, s.anims?.map(a => a.state), s.missing]);
    if (key !== prev) { console.log('HERO', s.ms, JSON.stringify(s)); prev = key; }
  }
  console.log('HERO-FINAL-CHAIN', JSON.stringify(samples.at(-1).chain, null, 1));
  console.log('HERO-LOGS', JSON.stringify(logs.filter(l => l.t !== 'console' || l.type === 'error'), null, 1));
  await page.screenshot({ path: '/tmp/f-hero-1440.png' });
  await ctx.close();
}

// ---- 2) Mobile full page bands ----
{
  const { ctx, page, logs } = await mk(390, 844, { isMobile: true, hasTouch: true, colorScheme: 'light' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const dump = async (label) => {
    const d = await page.evaluate(() => {
      const out = { scrollH: document.documentElement.scrollHeight, scrollY: window.scrollY, sections: [] };
      document.querySelectorAll('main > section, main > div, footer, header').forEach((el, i) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        out.sections.push({ i, cls: (el.className || '').toString().slice(0, 70), y: Math.round(r.y + window.scrollY), h: Math.round(r.height), op: cs.opacity, vis: cs.visibility, disp: cs.display, pos: cs.position, clip: cs.clipPath, transform: cs.transform.slice(0, 50), ov: cs.overflow, children: el.children.length });
      });
      return out;
    });
    console.log(`\n=== MOBILE ${label} === scrollH=${d.scrollH} scrollY=${d.scrollY}`);
    for (const s of d.sections) console.log(JSON.stringify(s));
    return d;
  };
  await dump('initial');
  await page.screenshot({ path: '/tmp/f-mobile-full-initial.png', fullPage: true });
  // scroll stepwise
  for (const y of [400, 1200, 2400, 3600, 4800, 6000, 8000]) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await page.waitForTimeout(700);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await dump('after-scroll');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/f-mobile-full-after.png', fullPage: true });
  console.log('MOBILE-LOGS', JSON.stringify(logs.slice(0, 30), null, 1));
  await ctx.close();
}

await browser.close();
