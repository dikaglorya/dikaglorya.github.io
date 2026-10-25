/**
 * Contrast audit: walk every text node in the rendered page under both colour
 * schemes and compute WCAG contrast against its effective background.
 * Handles translucent layers by compositing down to the opaque root.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321';
const PAGES = ['/', '/projects/', '/projects/dikaroute/', '/about/', '/services/', '/contact/', '/journal/'];

const SCHEMES = ['dark', 'light'];
const browser = await chromium.launch();
let failures = [];

for (const scheme of SCHEMES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
  for (const pth of PAGES) {
    const page = await ctx.newPage();
    await page.goto(BASE + pth, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    // Reveal everything so hidden text is measured too.
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in')));
    await page.waitForTimeout(200);
    const rows = await page.evaluate(() => {
      const parse = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(/[,/ ]+/).filter(Boolean).map(Number);
        return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
      };
      const lum = ({ r, g, b }) => {
        const f = (v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const over = (fg, bg) => ({
        r: fg.r * fg.a + bg.r * (1 - fg.a),
        g: fg.g * fg.a + bg.g * (1 - fg.a),
        b: fg.b * fg.a + bg.b * (1 - fg.a),
        a: 1,
      });
      const bgOf = (el) => {
        let acc = null;
        let node = el;
        const stack = [];
        while (node && node !== document.documentElement) {
          const c = parse(getComputedStyle(node).backgroundColor);
          if (c && c.a > 0) stack.push(c);
          if (c && c.a >= 0.999) break;
          node = node.parentElement;
        }
        const root = parse(getComputedStyle(document.body).backgroundColor) || { r: 0, g: 0, b: 0, a: 1 };
        acc = over(root, { r: 255, g: 255, b: 255, a: 1 });
        for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc);
        return acc;
      };
      const out = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      while (walker.nextNode()) {
        const t = walker.currentNode;
        const text = t.textContent.trim();
        if (!text) continue;
        const el = t.parentElement;
        if (!el || seen.has(el)) continue;
        const style = getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none') continue;
        if (parseFloat(style.opacity) < 0.15) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        // skip sr-only
        if (r.width <= 2 && r.height <= 2) continue;
        seen.add(el);
        const fg = parse(style.color);
        if (!fg) continue;
        const bg = bgOf(el);
        const composited = over(fg, bg);
        const L1 = lum(composited);
        const L2 = lum(bg);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const size = parseFloat(style.fontSize);
        const bold = parseInt(style.fontWeight, 10) >= 700;
        const large = size >= 24 || (bold && size >= 18.66);
        const need = large ? 3 : 4.5;
        if (ratio < need) {
          out.push({
            text: text.slice(0, 40),
            cls: (el.className || '').toString().slice(0, 30),
            ratio: Math.round(ratio * 100) / 100,
            need,
            size: Math.round(size),
          });
        }
      }
      return out;
    });
    if (rows.length) failures.push({ scheme, page: pth, rows: rows.slice(0, 8) });
    await page.close();
  }
  await ctx.close();
}
await browser.close();

if (!failures.length) console.log('PASS: all measured text clears WCAG AA contrast in both schemes');
else {
  console.log(`FAIL: ${failures.length} page/scheme combos with low contrast`);
  for (const f of failures) console.log(`\n[${f.scheme}] ${f.page}\n` + f.rows.map((r) => `  ${r.ratio}:1 (need ${r.need}, ${r.size}px) .${r.cls} "${r.text}"`).join('\n'));
}
