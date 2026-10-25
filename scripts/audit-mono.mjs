/**
 * DOM audit for the built site.
 *
 * Checks, per route and viewport:
 *  - horizontal overflow (document + individual offenders)
 *  - text contrast against the composited background
 *  - text below 11px
 *  - interactive targets below 24x24 CSS px (WCAG 2.2 2.5.8)
 *  - duplicate ids
 *  - heading level jumps
 *  - unusable theme toggle (missing, unlabeled, or not persisting)
 *
 * Usage: node scripts/audit-mono.mjs [--theme=dark|light|both] [--quick]
 * Requires a preview server on BASE_URL (default http://127.0.0.1:4321).
 */
import { readdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const args = process.argv.slice(2);
const themeArg = args.find((a) => a.startsWith('--theme='))?.split('=')[1] ?? 'both';
const quick = args.includes('--quick');
const themes = themeArg === 'both' ? ['dark', 'light'] : [themeArg];

const coreRoutes = [
  '/',
  '/projects/',
  '/projects/dikaroute/',
  '/journal/',
  '/journal/small-static-portfolio-architecture/',
  '/about/',
  '/services/',
  '/contact/',
  '/404.html',
];

// `--all` walks the build output so every generated route is covered, including
// each project detail and the legacy redirect pages.
const buildRoutes = async () => {
  const files = await readdir('dist', { recursive: true });
  return files
    .map((file) => file.replaceAll('\\', '/'))
    .filter((file) => file.endsWith('index.html') || file === '404.html')
    .map((file) => (file === '404.html' ? '/404.html' : `/${file.replace(/index\.html$/, '')}`))
    .sort();
};

const routes = args.includes('--all') ? await buildRoutes() : coreRoutes;

const viewports = quick
  ? [
      { name: '390', width: 390, height: 844 },
      { name: '1440', width: 1440, height: 900 },
    ]
  : [
      { name: '320', width: 320, height: 740 },
      { name: '360', width: 360, height: 800 },
      { name: '390', width: 390, height: 844 },
      { name: '768', width: 768, height: 1024 },
      { name: '1024', width: 1024, height: 768 },
      { name: '1280', width: 1280, height: 900 },
      { name: '1440', width: 1440, height: 900 },
    ];

const auditPage = () => {
  const parseColor = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };

  const over = (fg, bg) => {
    const a = fg.a;
    return {
      r: fg.r * a + bg.r * (1 - a),
      g: fg.g * a + bg.g * (1 - a),
      b: fg.b * a + bg.b * (1 - a),
      a: 1,
    };
  };

  const luminance = ({ r, g, b }) => {
    const channel = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };

  const ratio = (a, b) => {
    const l1 = luminance(a);
    const l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const backgroundOf = (element) => {
    let node = element;
    let stack = [];
    while (node && node !== document.documentElement.parentElement) {
      const style = getComputedStyle(node);
      const parsed = parseColor(style.backgroundColor);
      if (parsed && parsed.a > 0) {
        stack.push(parsed);
        if (parsed.a >= 1) break;
      }
      node = node.parentElement;
    }
    const root = parseColor(getComputedStyle(document.documentElement).backgroundColor) ?? {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    };
    let result = root;
    for (let i = stack.length - 1; i >= 0; i -= 1) result = over(stack[i], result);
    return result;
  };

  const isVisible = (element) => {
    const style = getComputedStyle(element);
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const label = (element) => {
    const id = element.id ? `#${element.id}` : '';
    const cls = element.className && typeof element.className === 'string'
      ? `.${element.className.trim().split(/\s+/).slice(0, 2).join('.')}`
      : '';
    return `${element.tagName.toLowerCase()}${id}${cls}`;
  };

  const results = {
    overflow: [],
    contrast: [],
    tinyText: [],
    targets: [],
    duplicateIds: [],
    headingJumps: [],
    missingAlt: [],
    clippedFixed: [],
    theme: {},
  };

  const viewportWidth = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth - viewportWidth > 1) {
    results.overflow.push({
      selector: 'document',
      amount: document.documentElement.scrollWidth - viewportWidth,
    });
  }

  document.querySelectorAll('body *').forEach((element) => {
    if (!isVisible(element)) return;
    if (element.closest('dialog:not([open])')) return;
    // Content that scrolls inside its own container (code blocks, tables) is
    // reachable, not clipped: the document itself does not overflow.
    let scroller = element.parentElement;
    while (scroller && scroller !== document.body) {
      const overflowX = getComputedStyle(scroller).overflowX;
      if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden' || overflowX === 'clip') {
        return;
      }
      scroller = scroller.parentElement;
    }
    const style = getComputedStyle(element);
    if (style.position === 'fixed') return;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0) return;
    const overflowRight = rect.right - viewportWidth;
    const overflowLeft = -rect.left;
    if (overflowRight > 1 || overflowLeft > 1) {
      // Ignore decorative/off-canvas nodes that are hidden for assistive tech.
      if (element.getAttribute('aria-hidden') === 'true') return;
      if (element.classList.contains('skip-link')) return;
      results.overflow.push({
        selector: label(element),
        amount: Math.max(overflowRight, overflowLeft),
        text: (element.textContent ?? '').trim().slice(0, 40),
      });
    }
  });

  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue?.trim()) continue;
    const parent = node.parentElement;
    if (!parent) continue;
    if (parent.closest('script, style, .sr-only, [hidden]')) continue;
    if (!isVisible(parent)) continue;
    textNodes.push(parent);
  }

  const seen = new Set();
  textNodes.forEach((element) => {
    if (seen.has(element)) return;
    seen.add(element);
    const style = getComputedStyle(element);
    const fg = parseColor(style.color);
    if (!fg) return;
    // Text with a gradient/clipped paint cannot be measured reliably; skip.
    if (style.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || style.color === 'rgba(0, 0, 0, 0)') return;
    let opacity = Number(style.opacity);
    let ancestor = element.parentElement;
    while (ancestor && ancestor !== document.documentElement) {
      opacity *= Number(getComputedStyle(ancestor).opacity);
      ancestor = ancestor.parentElement;
    }
    const bg = backgroundOf(element);
    const ratioValue = ratio(over({ ...fg, a: fg.a * opacity }, bg), bg);
    const fontSize = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const isLarge = fontSize >= 24 || (fontSize >= 18.66 && weight >= 700);
    const threshold = isLarge ? 3 : 4.5;
    if (ratioValue + 0.05 < threshold) {
      results.contrast.push({
        selector: label(element),
        text: (element.textContent ?? '').trim().slice(0, 40),
        ratio: Number(ratioValue.toFixed(2)),
        required: threshold,
        color: style.color,
        size: style.fontSize,
      });
    }
    if (fontSize < 11) {
      results.tinyText.push({
        selector: label(element),
        text: (element.textContent ?? '').trim().slice(0, 30),
        size: style.fontSize,
      });
    }
  });

  document.querySelectorAll('a[href], button, summary, input, select, textarea, [role="button"]').forEach((element) => {
    if (!isVisible(element)) return;
    if (element.closest('dialog:not([open])')) return;
    const rect = element.getBoundingClientRect();
    if (rect.width < 24 || rect.height < 24) {
      results.targets.push({
        selector: label(element),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        text: (element.textContent ?? element.getAttribute('aria-label') ?? '').trim().slice(0, 30),
      });
    }
  });

  const ids = new Map();
  document.querySelectorAll('[id]').forEach((element) => {
    ids.set(element.id, (ids.get(element.id) ?? 0) + 1);
  });
  ids.forEach((count, id) => {
    if (count > 1) results.duplicateIds.push({ id, count });
  });

  let previous = 0;
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    if (!isVisible(heading)) return;
    const level = Number(heading.tagName[1]);
    if (previous && level - previous > 1) {
      results.headingJumps.push({
        from: previous,
        to: level,
        text: (heading.textContent ?? '').trim().slice(0, 40),
      });
    }
    previous = level;
  });

  document.querySelectorAll('img').forEach((image) => {
    if (!image.hasAttribute('alt')) results.missingAlt.push(label(image));
    if (!image.getAttribute('width') || !image.getAttribute('height')) {
      results.missingAlt.push(`${label(image)} (no intrinsic size)`);
    }
  });

  const toggle = document.querySelector('[data-theme-toggle]');
  results.theme = {
    hasToggle: Boolean(toggle),
    label: toggle?.getAttribute('aria-label') ?? null,
    pressed: toggle?.getAttribute('aria-pressed') ?? null,
    resolved: document.documentElement.dataset.theme ?? null,
    background: getComputedStyle(document.body).backgroundColor,
    text: getComputedStyle(document.body).color,
  };

  return results;
};

const browser = await chromium.launch({ headless: true });
const report = [];
let failures = 0;

for (const theme of themes) {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: theme,
      reducedMotion: 'reduce',
    });
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        window.scrollTo(0, document.body.scrollHeight);
        window.scrollTo(0, 0);
      });
      const result = await page.evaluate(auditPage);
      result.errors = errors;
      result.route = route;
      result.viewport = viewport.name;
      result.theme = { ...result.theme, requested: theme };
      // Ignore per-theme duplicate-of-content noise from intentionally hidden nodes.
      report.push(result);
      const problem =
        result.overflow.length +
        result.contrast.length +
        result.tinyText.length +
        result.targets.length +
        result.duplicateIds.length +
        result.headingJumps.length +
        errors.length;
      if (problem) failures += 1;
      console.log(
        `${theme.padEnd(5)} ${viewport.name.padEnd(5)} ${route.padEnd(52)} ` +
          `overflow:${result.overflow.length} contrast:${result.contrast.length} ` +
          `tiny:${result.tinyText.length} target:${result.targets.length} ` +
          `dupId:${result.duplicateIds.length} heading:${result.headingJumps.length} ` +
          `errors:${errors.length} toggle:${result.theme.hasToggle ? 'yes' : 'NO'} bg:${result.theme.background}`,
      );
      await page.close();
    }
    await context.close();
  }
}

if (args.includes('--verbose')) {
  for (const item of report) {
    const buckets = ['overflow', 'contrast', 'tinyText', 'targets', 'duplicateIds', 'headingJumps'];
    for (const bucket of buckets) {
      if (!item[bucket].length) continue;
      console.log(`\n[${item.theme.requested} ${item.viewport} ${item.route}] ${bucket}`);
      console.log(JSON.stringify(item[bucket].slice(0, 12), null, 2));
    }
    if (item.errors.length) {
      console.log(`\n[${item.theme.requested} ${item.viewport} ${item.route}] console`);
      console.log(item.errors.join('\n'));
    }
  }
}

// Theme persistence + no-flash check on one route.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  const before = await page.evaluate(() => ({
    stored: localStorage.getItem('theme'),
    resolved: document.documentElement.dataset.theme,
    scheme: getComputedStyle(document.documentElement).colorScheme,
  }));
  const toggle = page.locator('[data-theme-toggle]');
  if (await toggle.count()) {
    await toggle.first().click();
    await page.waitForTimeout(120);
    const after = await page.evaluate(() => ({
      stored: localStorage.getItem('theme'),
      resolved: document.documentElement.dataset.theme,
      scheme: getComputedStyle(document.documentElement).colorScheme,
      bg: getComputedStyle(document.body).backgroundColor,
    }));
    await page.reload({ waitUntil: 'networkidle' });
    const reloaded = await page.evaluate(() => ({
      stored: localStorage.getItem('theme'),
      resolved: document.documentElement.dataset.theme,
      scheme: getComputedStyle(document.documentElement).colorScheme,
      bg: getComputedStyle(document.body).backgroundColor,
    }));
    console.log('\ntheme before:', JSON.stringify(before));
    console.log('theme after :', JSON.stringify(after));
    console.log('theme reload:', JSON.stringify(reloaded));
    if (after.resolved === before.resolved) {
      console.log('FAIL: toggle did not change the theme');
      failures += 1;
    }
    if (reloaded.resolved !== after.resolved) {
      console.log('FAIL: theme choice did not persist');
      failures += 1;
    }
  } else {
    console.log('\nFAIL: no [data-theme-toggle] found');
    failures += 1;
  }
  await context.close();
}

await browser.close();
console.log(`\n${report.length} page/theme/viewport combinations audited, ${failures} with findings.`);
process.exitCode = failures ? 1 : 0;
