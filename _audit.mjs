import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4322/';
const browser = await chromium.launch();

const probeHero = async (page, label) => {
  return page.evaluate((label) => {
    const title = document.querySelector('.hero__title');
    const lines = Array.from(document.querySelectorAll('.hero__title .line'));
    const spans = Array.from(document.querySelectorAll('.hero__title .line > span'));
    const heroBody = Array.from(document.querySelectorAll('.hero__body > *'));
    const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
    const notIn = reveals.filter((el) => !el.classList.contains('is-in'));
    return {
      label,
      motion: document.documentElement.dataset.motion,
      titleClass: title?.className,
      lineOut: lines.map((l) => ({
        isIn: l.classList.contains('is-in'),
        overflow: getComputedStyle(l).overflow,
        h: Math.round(l.getBoundingClientRect().height),
      })),
      spanStyle: spans.map((s) => {
        const cs = getComputedStyle(s);
        const r = s.getBoundingClientRect();
        return { op: cs.opacity, tr: cs.transform, top: Math.round(r.top), h: Math.round(r.height) };
      }),
      heroBody: heroBody.map((el) => {
        const cs = getComputedStyle(el);
        return { cls: el.className, op: cs.opacity, anim: cs.animationName, h: Math.round(el.getBoundingClientRect().height) };
      }),
      revealCount: reveals.length,
      revealNotIn: notIn.length,
      revealNotInFirst: notIn.slice(0, 8).map((el) => `${el.tagName}.${el.className}`.slice(0, 60)),
    };
  }, label);
};

// --- A) desktop hero after load ---
for (const wait of [0, 300, 1500]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: wait === 0 ? 'commit' : 'load' });
  await page.waitForTimeout(wait);
  console.log(JSON.stringify(await probeHero(page, `desktop wait=${wait}`), null, 1));
  if (wait === 1500) {
    await page.screenshot({ path: '/tmp/a-desktop.png' });
  }
  await page.close();
}

// click title bounding / computed width check for zero-height
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const line = document.querySelector('.hero__title .line');
    return { line: line?.outerHTML, rect: line?.getBoundingClientRect().toJSON() };
  });
  console.log('LINE HTML', JSON.stringify(info));
  await page.close();
}

// --- B) mobile full-page height ---
for (const [name, w, h] of [['mobile', 390, 844], ['tablet', 768, 1024]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => {
    const de = document.documentElement;
    const body = document.body;
    const out = {
      scrollHeight: de.scrollHeight,
      bodyScrollHeight: body.scrollHeight,
      clientHeight: de.clientHeight,
      innerHeight: window.innerHeight,
      bodyOverflow: getComputedStyle(body).overflow,
      htmlOverflow: getComputedStyle(de).overflow,
      htmlHeight: getComputedStyle(de).height,
    };
    // find tallest children
    const kids = Array.from(document.body.children).map((el) => ({
      tag: el.tagName,
      cls: (el.className || '').toString().slice(0, 40),
      h: Math.round(el.getBoundingClientRect().height),
      top: Math.round(el.getBoundingClientRect().top),
    }));
    out.kids = kids;
    // largest element
    const all = Array.from(document.querySelectorAll('body *'));
    let max = { h: 0 };
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.height > max.h) max = { h: Math.round(r.height), tag: el.tagName, cls: (el.className || '').toString().slice(0, 60) };
    }
    out.max = max;
    // blank scan: find elements with opacity 0 or visibility hidden
    out.hiddenCount = all.filter((el) => { const cs = getComputedStyle(el); return cs.opacity === '0' || cs.visibility === 'hidden'; }).length;
    return out;
  });
  console.log(name, JSON.stringify(m));
  await page.screenshot({ path: `/tmp/b-${name}.png`, fullPage: true });
  await page.close();
}

// --- C) dock overlap with footer ---
for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1200);
  const d = await page.evaluate(() => {
    const dock = document.querySelector('.app-dock');
    const footer = document.querySelector('footer, .footer');
    const main = document.querySelector('main');
    const dr = dock?.getBoundingClientRect();
    const fr = footer?.getBoundingClientRect();
    const last = document.querySelector('.footer__bottom, .footer__legal') || footer?.lastElementChild;
    const lr = last?.getBoundingClientRect();
    // hit test center of dock
    const cx = dr.left + dr.width / 2;
    const cy = dr.top + dr.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    return {
      dock: dr && { top: Math.round(dr.top), bottom: Math.round(dr.bottom), h: Math.round(dr.height), pos: getComputedStyle(dock).position },
      footer: fr && { top: Math.round(fr.top), bottom: Math.round(fr.bottom) },
      lastRow: lr && { top: Math.round(lr.top), bottom: Math.round(lr.bottom), text: last.textContent?.trim().slice(0, 60) },
      overlapPx: lr && dr ? Math.max(0, Math.round(lr.bottom - dr.top)) : null,
      hitUnderDock: hit ? `${hit.tagName}.${(hit.className || '').toString().slice(0, 40)}` : null,
      paddingBottom: footer ? getComputedStyle(footer).paddingBottom : null,
      mainPadBottom: main ? getComputedStyle(main).paddingBottom : null,
      bodyPadBottom: getComputedStyle(document.body).paddingBottom,
    };
  });
  console.log('DOCK', name, JSON.stringify(d));
  await page.screenshot({ path: `/tmp/c-${name}.png` });
  await page.close();
}

// --- D) IntersectionObserver miss: tall sections taller than viewport, threshold 0.12 ---
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const tall = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const needs = r.height * 0.12; // visible px to satisfy threshold
      out.push({ cls: (el.className || '').toString().slice(0, 34), h: Math.round(r.height), needVisiblePx: Math.round(Math.min(needs, r.height)), isIn: el.classList.contains('is-in') });
    });
    return out;
  });
  console.log('REVEAL TARGETS (mobile)', JSON.stringify(tall));
  // Jump straight to bottom and back, instant, then check
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(600);
  const missed = await page.evaluate(() => Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => !el.classList.contains('is-in')).map((el) => ({ cls: (el.className || '').toString().slice(0, 44), h: Math.round(el.getBoundingClientRect().height), op: getComputedStyle(el).opacity })));
  console.log('MISSED AFTER FAST SCROLL TO BOTTOM', JSON.stringify(missed));
  await page.close();
}

// reduced motion & no-JS checks
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  console.log('REDUCED', JSON.stringify(await probeHero(page, 'reduced')));
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const s = document.querySelector('.hero__title .line > span');
    return s ? { op: getComputedStyle(s).opacity, tr: getComputedStyle(s).transform, motion: document.documentElement.dataset.motion } : null;
  });
  console.log('NO-JS hero span', JSON.stringify(r));
  await ctx.close();
}

await browser.close();
