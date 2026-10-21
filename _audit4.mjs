import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const BASE = 'http://127.0.0.1:4322/';
const browser = await chromium.launch();

const analyze = (path) => {
  const png = PNG.sync.read(fs.readFileSync(path));
  const { width, height, data } = png;
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    let dark = 0, light = 0, other = 0;
    for (let x = 0; x < width; x += 1) {
      const i = (width * y + x) << 2;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (lum < 60) dark += 1; else if (lum > 190) light += 1; else other += 1;
    }
    rows.push({ y, dark, light, other });
  }
  return { width, height, rows };
};

// 1) Desktop hero at 1440x900: find text rows (dark-on-light or light-on-dark)
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: '/tmp/px-hero.png' });
  const a = analyze('/tmp/px-hero.png');
  // report per-band ink counts
  const band = (y0, y1) => {
    let d = 0, l = 0, o = 0, n = 0;
    for (let y = y0; y < Math.min(y1, a.height); y += 1) { d += a.rows[y].dark; l += a.rows[y].light; o += a.rows[y].other; n += 1; }
    return { band: `${y0}-${y1}`, avgDark: Math.round(d / n), avgLight: Math.round(l / n), avgOther: Math.round(o / n) };
  };
  console.log('HERO BANDS', JSON.stringify([band(60, 200), band(200, 420), band(420, 600), band(600, 830)]));
  // geometric info
  console.log('GEOM', JSON.stringify(await page.evaluate(() => {
    const t = document.querySelector('.hero__title');
    const tr = t.getBoundingClientRect();
    const lines = Array.from(document.querySelectorAll('.hero__line')).map((l) => {
      const r = l.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), text: l.innerText };
    });
    const seamPx = 0.56 * tr.height;
    return { titleTop: Math.round(tr.top), titleH: Math.round(tr.height), seamY: Math.round(tr.top + seamPx), lines, viewportH: innerHeight };
  })));
  await page.close();
}

// 2) Hero at other desktop widths (does seam cut through text?)
for (const [w, h] of [[1920, 1080], [1280, 800], [1024, 768], [901, 700]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log(`GEOM ${w}x${h}`, JSON.stringify(await page.evaluate(() => {
    const t = document.querySelector('.hero__title');
    const tr = t.getBoundingClientRect();
    const lines = Array.from(document.querySelectorAll('.hero__line')).map((l) => {
      const r = l.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
    });
    const seamY = tr.top + 0.56 * tr.height;
    return { titleTop: Math.round(tr.top), titleH: Math.round(tr.height), seamY: Math.round(seamY), lines, linesBelowSeam: lines.map((l) => l.top > seamY) };
  })));
  await page.screenshot({ path: `/tmp/px-hero-${w}.png` });
  await page.close();
}

// 3) Mobile full-page: detect long vertical blank runs using a stitched scroll capture
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const blankPerViewport = [];
  for (let y = 0; y < total; y += 844) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(450);
    const buf = await page.screenshot({ path: `/tmp/vp-${y}.png` });
    const png = PNG.sync.read(buf);
    let inkRows = 0;
    for (let yy = 0; yy < png.height; yy += 2) {
      let ink = 0;
      for (let xx = 0; xx < png.width; xx += 2) {
        const i = (png.width * yy + xx) << 2;
        const lum = 0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2];
        if (lum < 150 || lum > 250) ink += 1; // non-background pixels
      }
      if (ink > 8) inkRows += 1;
    }
    blankPerViewport.push({ y, inkRowsOutOf: Math.ceil(png.height / 2), contentPct: Math.round((inkRows / Math.ceil(png.height / 2)) * 100) });
  }
  console.log('MOBILE VIEWPORTS', JSON.stringify(blankPerViewport));
  // element opacities right now
  console.log('HIDDEN NOW', JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('[data-reveal]')).map((e) => ({ cls: (e.className || '').toString().slice(0, 30), isIn: e.classList.contains('is-in'), op: getComputedStyle(e).opacity, top: Math.round(e.getBoundingClientRect().top + scrollY) })))));
  await page.close();
}

// 4) Footer/dock: enumerate fixed elements and footer children near bottom
{
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    console.log(`FIXED ${w}`, JSON.stringify(await page.evaluate(() => {
      const fixed = [];
      document.querySelectorAll('body *').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' && cs.display !== 'none' && el.getBoundingClientRect().height > 0) {
          const r = el.getBoundingClientRect();
          fixed.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 36), bottom: Math.round(r.bottom), top: Math.round(r.top), bottomCss: cs.bottom, z: cs.zIndex });
        }
      });
      return fixed;
    })));
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(700);
    console.log(`FOOTER LAST ROWS ${w}`, JSON.stringify(await page.evaluate(() => {
      const f = document.querySelector('footer, .site-footer');
      const fr = f.getBoundingClientRect();
      const kids = Array.from(f.querySelectorAll('*')).map((el) => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, cls: (el.className || '').toString().slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom), txt: (el.textContent || '').trim().slice(0, 30) };
      }).filter((k) => k.bottom > 0 && k.top < innerHeight && k.bottom - k.top > 4);
      return { footerBottom: Math.round(fr.bottom), viewport: innerHeight, bottomGap: Math.round(innerHeight - fr.bottom), lastKids: kids.slice(-6) };
    })));
    await page.close();
  }
}

// 5) D) IO miss with wheel scrolling vs jump; also test scroll restoration reload at hash
{
  const page = await browser.newPage({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  // simulate scroll restoration to bottom on reload
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  console.log('AFTER RELOAD AT BOTTOM', JSON.stringify(await page.evaluate(() => ({
    scrollY: Math.round(scrollY),
    missed: Array.from(document.querySelectorAll('[data-reveal]')).filter((e) => !e.classList.contains('is-in')).map((e) => ({ cls: (e.className || '').toString().slice(0, 30), top: Math.round(e.getBoundingClientRect().top), h: Math.round(e.getBoundingClientRect().height), op: getComputedStyle(e).opacity })),
  }))));
  await page.close();
}

await browser.close();
