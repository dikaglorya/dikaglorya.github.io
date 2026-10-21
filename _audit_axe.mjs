import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4322';
const axeSource = await readFile(path.join(process.cwd(), 'node_modules/axe-core/axe.min.js'), 'utf8');
const pages = ['/', '/about/', '/projects/', '/journal/', '/services/', '/contact/', '/404.html'];

const schemes = [
  { name: 'dark', vp: { width: 1440, height: 900 } },
  { name: 'light', vp: { width: 1440, height: 900 } },
  { name: 'mobile-dark', vp: { width: 390, height: 844 } },
  { name: 'mobile-light', vp: { width: 390, height: 844 } },
];

const browser = await chromium.launch();
const summary = [];
const details = [];
for (const s of schemes) {
  for (const p of pages) {
    const ctx = await browser.newContext({ viewport: s.vp, colorScheme: s.name.includes('light') ? 'light' : 'dark' });
    const page = await ctx.newPage();
    await page.route('**/__test__/axe.min.js', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: axeSource }));
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    // force scroll to trigger reveal animations
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); } window.scrollTo(0, 0); });
    await page.waitForTimeout(500);
    await page.addScriptTag({ url: '/__test__/axe.min.js' });
    const res = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    });
    const counts = res.violations.map((v) => `${v.id}:${v.nodes.length}`);
    summary.push({ scheme: s.name, page: p, count: res.violations.length, nodes: res.violations.reduce((a, v) => a + v.nodes.length, 0), ids: counts.join(' ') });
    for (const v of res.violations) {
      for (const n of v.nodes) {
        details.push({ scheme: s.name, page: p, id: v.id, impact: v.impact, help: v.help, target: n.target.join(' '), html: n.html.slice(0, 220), msg: n.any?.map((a) => a.message).join(' | ') || n.all?.map((a) => a.message).join(' | '), data: JSON.stringify(n.any?.map((a) => a.data)).slice(0, 600) });
      }
    }
    await ctx.close();
  }
}
console.log(JSON.stringify(summary, null, 1));
console.log('DETAILS');
for (const d of details) console.log(JSON.stringify(d));
await browser.close();
