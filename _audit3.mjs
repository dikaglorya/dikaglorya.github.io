import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:4322';
const pages = [['home','/'],['about','/about/'],['projects','/projects/'],['project-detail','/projects/dikaroute/'],['journal','/journal/'],['article','/journal/small-static-portfolio-architecture/'],['services','/services/'],['contact','/contact/'],['404','/nonexistent-page/']];
const widths = [320,360,390,414,768,834,1024,1280,1440,1920];
const heights = [640,800,900,1080];
const browser = await chromium.launch();
const results = [];
for (const [name, path] of pages) {
  for (const w of widths) {
    for (const h of heights) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(150);
      const r = await page.evaluate(async () => {
        const vh = innerHeight, vw = innerWidth;
        const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const rc = el.getBoundingClientRect(); return rc.width > 0 && rc.height > 0; };
        const sel = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.'); return s; };
        const dock = document.querySelector('.app-dock');
        const hdr = document.querySelector('.site-header');
        const dockRc = dock ? dock.getBoundingClientRect() : null;
        const hdrRc = hdr ? hdr.getBoundingClientRect() : null;
        const hits = { underHeader: [], underDock: [] };
        // check elements whose box intersects the bottom dock band while dock is fixed
        const els = [...document.querySelectorAll('main a, main button, main h1, main h2, main p, main li, footer a, footer p, .btn')];
        for (const el of els) {
          if (!vis(el)) continue;
          const rc = el.getBoundingClientRect();
          if (dockRc && rc.bottom > dockRc.top && rc.top < dockRc.bottom) hits.underDock.push(sel(el));
          if (hdrRc && rc.top < hdrRc.bottom && rc.bottom > hdrRc.top) hits.underHeader.push(sel(el));
        }
        // scroll to absolute bottom, check footer last line visibility above dock
        scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((r) => setTimeout(r, 250));
        const footer = document.querySelector('.site-footer');
        const fRc = footer ? footer.getBoundingClientRect() : { top: 0, bottom: 0 };
        const lastP = footer ? footer.querySelector('.footer__bottom') : null;
        const lpRc = lastP ? lastP.getBoundingClientRect() : null;
        const dRc = dock ? dock.getBoundingClientRect() : null;
        const footerBottomCovered = dRc && lpRc ? Math.round(lpRc.bottom - dRc.top) : null;
        // body padding-bottom = dock-h?
        const bodyPadB = getComputedStyle(document.body).paddingBottom;
        // sticky obstructions in article
        const stickies = [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'sticky' && vis(e)).map((e) => sel(e));
        // check smallest content band height in main sections
        const bands = [...document.querySelectorAll('main > *')].map((s) => { const rc = s.getBoundingClientRect(); return { sel: sel(s), h: Math.round(rc.height), txt: (s.innerText || '').trim().length }; });
        return { vh, vw, dockH: dRc ? Math.round(dRc.height) : null, dockBottom: dRc ? Math.round(dRc.bottom) : null, hdrH: hdrRc ? Math.round(hdrRc.height) : null, bodyPadB, underDock: hits.underDock.slice(0, 6), underHeader: hits.underHeader.slice(0, 4), footerBottomCovered, stickies, bands, docH: document.documentElement.scrollHeight };
      });
      // touch targets + tiny text
      const t = await page.evaluate(() => {
        const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const rc = el.getBoundingClientRect(); return rc.width > 0 && rc.height > 0; };
        const small = [];
        const seen = new Set();
        for (const el of document.querySelectorAll('a, button, input, select, textarea, summary')) {
          if (!vis(el)) continue;
          const rc = el.getBoundingClientRect();
          const lbl = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 28);
          const k = el.tagName + '|' + Math.round(rc.width) + 'x' + Math.round(rc.height) + '|' + lbl;
          if (seen.has(k)) continue; seen.add(k);
          if (rc.width < 44 || rc.height < 44) small.push({ tag: el.tagName, cls: el.className && typeof el.className === 'string' ? el.className.split(/\s+/)[0] : '', w: Math.round(rc.width), h: Math.round(rc.height), lbl });
        }
        // text that wraps mid-word / orphan check: measure lines vs scrollWidth
        return { small };
      });
      results.push({ name, w, h, ...r, ...t });
      await page.close();
    }
  }
  process.stderr.write(`done ${name}\n`);
}
await browser.close();
import fs from 'node:fs';
fs.writeFileSync('/tmp/audit3.json', JSON.stringify(results, null, 1));
