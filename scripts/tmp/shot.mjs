import { chromium } from 'playwright';
import path from 'node:path';
const out = path.join(process.cwd(), '.test-output', 'closeups');
const b = await chromium.launch();
for (const w of [1280, 1440, 1920, 2560]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1000 }, colorScheme: 'dark' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const el = p.locator('.featured').first();
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  await el.screenshot({ path: path.join(out, `feat-${w}.png`) });
  const m = await el.evaluate((n) => {
    const r = n.getBoundingClientRect();
    const dg = n.querySelector('.featured__diagram').getBoundingClientRect();
    const d = n.querySelector('.route-diagram');
    const dr = d.getBoundingClientRect();
    const flow = n.querySelector('.route-diagram__flow');
    return { w: r.width, diagramW: dg.width, rdW: dr.width, flowScroll: flow.scrollWidth, flowClient: flow.clientWidth, rdScroll: d.scrollWidth, rdClient: d.clientWidth, docScroll: document.documentElement.scrollWidth, inner: innerWidth };
  });
  console.log(w, JSON.stringify(m));
  await ctx.close();
}
await b.close();
