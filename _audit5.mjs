import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs';
const BASE = 'http://127.0.0.1:4322/';
const browser = await chromium.launch();

// Sample pixels inside the glyph band for contrast. Measure the actual rendered ink vs background per line.
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);

// Where is the hero background lightness vertically? sample background column at x=20 (outside text)
const shot = await page.screenshot({ path: '/tmp/px-seam.png' });
const png = PNG.sync.read(shot);
const lumAt = (x, y) => {
  const i = (png.width * y + x) << 2;
  return Math.round(0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2]);
};
const lineInfo = await page.evaluate(() => {
  const lines = Array.from(document.querySelectorAll('.hero__line'));
  return lines.map((l) => {
    const r = l.getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), text: l.innerText };
  });
});
// find the seam in the background: scan column x=30
let seamY = null;
for (let y = 100; y < 830; y += 1) {
  const a = lumAt(30, y), b = lumAt(30, y + 1);
  if (Math.abs(b - a) > 60) { seamY = y; break; }
}
console.log('BACKGROUND SEAM Y', seamY);
for (const [idx, li] of lineInfo.entries()) {
  // count dark pixels within the line's box vs the box's dominant bg
  let dark = 0, total = 0;
  const bgs = new Map();
  for (let y = li.top + 4; y < li.bottom - 4; y += 2) {
    for (let x = li.left + 4; x < li.right - 4; x += 2) {
      const L = lumAt(x, y); total++;
      bgs.set(Math.round(L / 8) * 8, (bgs.get(Math.round(L / 8) * 8) || 0) + 1);
      if (L < 60 || L > 200) dark++;
    }
  }
  const top = [...bgs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  console.log(`LINE ${idx} "${li.text}" box=${li.top}-${li.bottom} bgHistogram=${JSON.stringify(top)} inkPixels=${dark}/${total} (${Math.round((dark / total) * 100)}%)`);
  // sample 8 x-positions at 3 y within the glyph band
  const samples = [];
  for (let k = 0; k < 5; k++) {
    const y = Math.round(li.top + ((li.bottom - li.top) * (k + 0.5)) / 5);
    samples.push({ y, L: lumAt(li.left + 40, y), Lmid: lumAt(Math.round((li.left + li.right) / 2), y) });
  }
  console.log('  per-row luminance (left,mid):', JSON.stringify(samples));
}
// last line baseline check: does second line sit below seam?
console.log('LINES vs SEAM', JSON.stringify(lineInfo.map((l) => ({ text: l.text, top: l.top, bottom: l.bottom, belowSeam: l.top > (seamY ?? 0) }))));
await page.close();

// Mobile: verify no huge blank by measuring the max ink gap in the full page capture
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // force reveal all first so this measures layout, not reveal state
  const buf = await page.screenshot({ path: '/tmp/px-mobile-full.png', fullPage: true });
  const p = PNG.sync.read(buf);
  const bg = lumAt; // dummy
  const isInk = (x, y) => {
    const i = (p.width * y + x) << 2;
    const r = p.data[i], g = p.data[i + 1], b = p.data[i + 2];
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return L < 150 || L > 248 || Math.abs(r - b) > 25;
  };
  let maxGap = 0, gapStart = 0, cur = 0, curStart = 0;
  const height = p.height;
  for (let y = 0; y < height; y += 1) {
    let ink = 0;
    for (let x = 0; x < p.width; x += 3) if (isInk(x, y)) { ink++; if (ink > 3) break; }
    if (ink <= 3) { if (cur === 0) curStart = y; cur++; if (cur > maxGap) { maxGap = cur; gapStart = curStart; } }
    else cur = 0;
  }
  console.log('MOBILE FULL PAGE', JSON.stringify({ w: p.width, h: p.height, maxBlankRunPx: maxGap, blankStart: gapStart, seePercent: +(100 * (1 - maxGap / height)).toFixed(1) }));
  await page.close();
}

// Count hidden-by-reveal pixels on a cold mobile load with no scrolling (what a fullPage screenshot sees)
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const buf = await page.screenshot({ fullPage: true, path: '/tmp/px-mobile-cold.png' });
  const p = PNG.sync.read(buf);
  const H = p.height;
  let hiddenTop = null, hiddenCount = 0;
  const info = await page.evaluate(() => Array.from(document.querySelectorAll('[data-reveal]')).map((e) => { const r = e.getBoundingClientRect(); return { cls: (e.className || '').toString().slice(0, 26), top: Math.round(r.top + scrollY), h: Math.round(r.height), op: getComputedStyle(e).opacity }; }));
  console.log('COLD MOBILE DATA', JSON.stringify({ screenshotH: H, revealInfo: info }));
  const hiddenPx = info.filter((i) => i.op === '0').reduce((a, b) => a + b.h, 0);
  console.log('hidden px height total (cold, no scroll):', hiddenPx, 'of', H);
  await page.close();
}
await browser.close();
