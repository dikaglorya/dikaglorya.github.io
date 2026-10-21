import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'https://dikaofc.devs.li';
const pages = ['/', '/about/', '/projects/', '/journal/', '/services/', '/contact/'];
const outDir = '/tmp/audit2';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const report = {};

const probe = () => {
  const g = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return {
      cls: (el.className || '').toString().slice(0, 60), tag: el.tagName.toLowerCase(),
      x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height),
      fs: c.fontSize, lh: c.lineHeight, fw: c.fontWeight, ls: c.letterSpacing, ff: c.fontFamily.slice(0, 40),
      color: c.color, bg: c.backgroundColor, pos: c.position, disp: c.display, op: c.opacity, tv: c.transform,
      txt: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50),
    };
  };
  const q = (s) => g(document.querySelector(s));
  const qa = (s) => [...document.querySelectorAll(s)].map(g).filter(Boolean);
  const de = document.documentElement;
  return {
    scrollW: de.scrollWidth, clientW: de.clientWidth, h: document.body.scrollHeight,
    header: q('.site-header'), inner: q('.site-header__inner'), word: q('.wordmark'),
    pageLabel: q('.menu-bar__page'), nav: q('.site-nav'), navLinks: qa('.site-nav__link'),
    hActions: q('.header-actions'), hContact: q('.header-contact'), spot: q('.spotlight-trigger'),
    clock: q('.menu-bar__clock'), toggle: q('.menu-toggle'), dock: q('.app-dock'),
    dockItems: qa('.dock-item'), dockLabels: qa('.dock-item__label'), dockActive: qa('.dock-item__active'),
    hero: q('.hero'), heroGrid: q('.hero__grid'), heroVisual: q('.hero__visual'), heroBody: q('.hero__body'),
    h1: q('h1'), eyebrow: q('.hero__eyebrow'), copy: q('.hero__copy'), actions: q('.hero__actions'),
    meta: q('.hero__meta'), portrait: q('.hero__portrait'), canvas: q('canvas'),
    identity: q('.identity-strip'), stripSpan: qa('.identity-strip__row > span'),
    container: q('.container'), firstSection: q('.section'), pageHero: q('.page-hero'),
    h2s: qa('h2'), h3s: qa('h3'), sectionHeads: qa('.section-head'),
    cards: qa('.featured, .project-row, .journal-card, .capability, .stack-group, .service-row, .contact-form-wrap, .process-step'),
    footer: q('.site-footer'), btns: qa('.btn'),
    foldText: [...document.querySelectorAll('#main *')].filter((el) => {
      const b = el.getBoundingClientRect();
      return b.top < innerHeight && b.bottom > 0 && el.children.length === 0 && (el.textContent || '').trim().length > 1;
    }).slice(0, 24).map((el) => { const b = el.getBoundingClientRect(); return `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}@${Math.round(b.top)} "${(el.textContent || '').trim().slice(0, 40)}"`; }),
    positions: [...document.querySelectorAll('body > *, #main > *, footer > *, header > *')].map(g).filter(Boolean),
  };
};

for (const scheme of ['dark', 'light']) {
  for (const vp of [{ n: 'desk', w: 1440, h: 900 }, { n: 'mob', w: 390, h: 844 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, colorScheme: scheme, deviceScaleFactor: 1 });
    for (const p of pages) {
      const page = await ctx.newPage();
      await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(400);
      const H = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < H; y += Math.floor(vp.h * 0.65)) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(140); }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(900);
      const key = `${scheme}-${vp.n}-${p.replace(/\//g, '_') || 'home'}`;
      await page.screenshot({ path: `${outDir}/${key}.png` });
      await page.screenshot({ path: `${outDir}/${key}-full.png`, fullPage: true });
      report[key] = await page.evaluate(probe);
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 1));
console.log('ok', Object.keys(report).length);
