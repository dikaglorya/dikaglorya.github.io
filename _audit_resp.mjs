import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://127.0.0.1:4322';
const pages = [
  ['home', '/'],
  ['about', '/about/'],
  ['projects', '/projects/'],
  ['project-detail', '/projects/dikaroute/'],
  ['journal', '/journal/'],
  ['article', '/journal/small-static-portfolio-architecture/'],
  ['services', '/services/'],
  ['contact', '/contact/'],
  ['404', '/nonexistent-page/'],
];
const widths = [320, 360, 390, 414, 768, 834, 1024, 1280, 1440, 1920];
const heightFor = (w) => (w < 480 ? 800 : w < 1024 ? 1080 : 900);

const browser = await chromium.launch();
const out = [];

for (const [name, path] of pages) {
  for (const w of widths) {
    const h = heightFor(w);
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 900 });
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    // scroll through
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 300));
    });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const vw = window.innerWidth;
      const doc = document.documentElement;
      const res = {
        vw,
        scrollW: Math.max(doc.scrollWidth, document.body.scrollWidth),
        docH: Math.max(doc.scrollHeight, document.body.scrollHeight),
        offenders: [],
        fixedObs: [],
        tall: [],
        clipped: [],
        imgRatio: [],
        smallTargets: [],
        tinyFonts: [],
        zeroAreaLinks: [],
      };
      const sel = (el) => {
        if (!el || !el.tagName) return '?';
        let s = el.tagName.toLowerCase();
        if (el.id) s += '#' + el.id;
        if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.');
        return s;
      };
      const visible = (el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
        const rc = el.getBoundingClientRect();
        return rc.width > 0 && rc.height > 0;
      };
      const all = Array.from(document.querySelectorAll('body *'));
      // horizontal overflow offenders
      for (const el of all) {
        if (!visible(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed') continue;
        const rc = el.getBoundingClientRect();
        const right = rc.right + window.scrollX;
        const left = rc.left + window.scrollX;
        // element larger than viewport or sticking past right edge
        const past = rc.right > vw + 1;
        if (past) {
          // only report if parent does not also overflow (report outermost offender)
          const p = el.parentElement;
          const prc = p ? p.getBoundingClientRect() : null;
          if (!prc || prc.right <= vw + 1 || prc.width <= rc.width + 1) {
            res.offenders.push({ sel: sel(el), left: Math.round(left), right: Math.round(right), width: Math.round(rc.width), overflowPx: Math.round(rc.right - vw), text: (el.textContent || '').trim().slice(0, 40) });
          }
        }
      }
      res.offenders = res.offenders.slice(0, 12);
      // fixed elements
      for (const el of all) {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed' || !visible(el)) continue;
        const rc = el.getBoundingClientRect();
        res.fixedObs.push({ sel: sel(el), top: Math.round(rc.top), bottom: Math.round(rc.bottom), left: Math.round(rc.left), right: Math.round(rc.right), h: Math.round(rc.height), coversPct: +((rc.width * rc.height) / (vw * window.innerHeight) * 100).toFixed(1) });
      }
      // tall content bands: direct children of main/sections with height > 1.4 viewport and low text density
      for (const el of Array.from(document.querySelectorAll('main > *, main section, main > section > *, body > .container > *'))) {
        if (!visible(el)) continue;
        const rc = el.getBoundingClientRect();
        const txt = (el.innerText || '').trim();
        if (rc.height > window.innerHeight * 1.4) {
          const chars = txt.length;
          if (chars < 400 || rc.height > window.innerHeight * 2.4) {
            res.tall.push({ sel: sel(el), h: Math.round(rc.height), vh: window.innerHeight, ratio: +(rc.height / window.innerHeight).toFixed(2), chars });
          }
        }
      }
      res.tall = res.tall.slice(0, 8);
      // clipped text: overflow hidden and scrollHeight > clientHeight by >4px, or scrollWidth > clientWidth
      for (const el of all) {
        const cs = getComputedStyle(el);
        if (!visible(el)) continue;
        if (el.children.length > 2) continue;
        const oy = cs.overflowY, ox = cs.overflowX;
        if ((oy === 'hidden' || oy === 'clip') && el.scrollHeight - el.clientHeight > 4 && el.clientHeight > 0) {
          res.clipped.push({ sel: sel(el), kind: 'Y', client: el.clientHeight, scroll: el.scrollHeight, text: (el.textContent || '').trim().slice(0, 50) });
        } else if ((ox === 'hidden' || ox === 'clip') && el.scrollWidth - el.clientWidth > 4 && el.clientWidth > 0 && (el.tagName === 'SPAN' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'P' || el.tagName === 'A' || el.tagName === 'LI')) {
          res.clipped.push({ sel: sel(el), kind: 'X', client: el.clientWidth, scroll: el.scrollWidth, text: (el.textContent || '').trim().slice(0, 50) });
        }
      }
      res.clipped = res.clipped.slice(0, 14);
      // image aspect ratio distortion
      for (const img of document.querySelectorAll('img')) {
        if (!img.complete || !img.naturalWidth) continue;
        const rc = img.getBoundingClientRect();
        if (rc.width < 2 || rc.height < 2) continue;
        const nat = img.naturalWidth / img.naturalHeight;
        const shown = rc.width / rc.height;
        const fit = getComputedStyle(img).objectFit;
        if (fit === 'cover' || fit === 'contain') continue;
        if (Math.abs(shown / nat - 1) > 0.06) {
          res.imgRatio.push({ src: img.currentSrc.split('/').pop(), nat: +nat.toFixed(2), shown: +shown.toFixed(2), w: Math.round(rc.width), h: Math.round(rc.height) });
        }
      }
      // touch targets
      const seen = new Set();
      for (const el of document.querySelectorAll('a, button, [role=button], input, select, textarea, summary')) {
        if (!visible(el)) continue;
        const rc = el.getBoundingClientRect();
        if (rc.width < 24 || rc.height < 24) {
          const key = sel(el) + Math.round(rc.width) + 'x' + Math.round(rc.height);
          if (seen.has(key)) continue;
          seen.add(key);
          res.smallTargets.push({ sel: sel(el), w: Math.round(rc.width), h: Math.round(rc.height), text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), name: el.getAttribute('aria-label') || '' });
        }
      }
      res.smallTargets = res.smallTargets.slice(0, 12);
      // tiny font sizes
      for (const el of all) {
        if (!visible(el) || el.children.length > 0) continue;
        const t = (el.textContent || '').trim();
        if (!t) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 11) res.tinyFonts.push({ sel: sel(el), fs, text: t.slice(0, 30) });
      }
      res.tinyFonts = res.tinyFonts.slice(0, 8);
      return res;
    });
    out.push({ name, path, w, h, ...r });
    await page.close();
  }
  process.stderr.write(`done ${name}\n`);
}

// Full page screenshots for home + contact at 390/768/1440
for (const [name, path] of [['home', '/'], ['contact', '/contact/']]) {
  for (const w of [390, 768, 1440]) {
    const h = heightFor(w);
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `/tmp/audit-${name}-${w}.png`, fullPage: true });
    await page.close();
  }
}
await browser.close();
fs.writeFileSync('/tmp/audit-resp.json', JSON.stringify(out, null, 1));
// compact summary
for (const r of out) {
  const bits = [];
  if (r.scrollW > r.vw) bits.push(`OVERFLOW +${r.scrollW - r.vw}px [${r.offenders.map((o) => `${o.sel}(${o.overflowPx})`).join(', ')}]`);
  if (r.clipped.length) bits.push(`CLIP ${r.clipped.map((c) => `${c.sel}:${c.kind}${c.client}<${c.scroll}`).join(', ')}`);
  if (r.imgRatio.length) bits.push(`IMGR ${r.imgRatio.map((i) => `${i.src}:${i.shown}/${i.nat}`).join(', ')}`);
  if (r.smallTargets.length) bits.push(`SMALL ${r.smallTargets.map((t) => `${t.sel}${t.w}x${t.h}`).join(', ')}`);
  if (r.tall.length) bits.push(`TALL ${r.tall.map((t) => `${t.sel}=${t.ratio}vh/${t.chars}c`).join(', ')}`);
  console.log(`${r.name}@${r.w}: ${bits.length ? bits.join(' | ') : 'ok'}${r.fixedObs.length ? ' [fixed:' + r.fixedObs.length + ']' : ''}`);
}
