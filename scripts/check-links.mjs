import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const dist = path.join(root, 'dist');
// Canonical origin this build was generated for. Kept in sync with astro.config.mjs.
const expectedOrigin = process.env.SITE_URL ?? 'https://dikaglorya.github.io';

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
};

const isExternal = (href) =>
  /^(https?:)?\/\//i.test(href) ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('data:') ||
  href.startsWith('javascript:');

const resolvePageFile = async (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (!clean || clean === '/') return path.join(dist, 'index.html');

  const withoutLeading = clean.replace(/^\/+/, '');
  const asFile = path.join(dist, withoutLeading);
  const candidates = [];

  if (clean.endsWith('/')) {
    candidates.push(path.join(asFile, 'index.html'));
  } else {
    candidates.push(asFile);
    candidates.push(`${asFile}.html`);
    candidates.push(path.join(asFile, 'index.html'));
  }

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
};

const extractIds = (html) => {
  const ids = new Set();
  for (const match of html.matchAll(/\sid="([^"]+)"/g)) ids.add(match[1]);
  return ids;
};

const pageIds = new Map();
const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  pageIds.set(file, extractIds(await readFile(file, 'utf8')));
}

const errors = [];
const checked = new Set();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const pagePath = `/${path.relative(dist, file).replaceAll('\\', '/')}`;
  const refs = new Set();

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    refs.add(match[1]);
  }

  for (const match of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) refs.add(url);
    }
  }

  for (const ref of refs) {
    if (!ref || isExternal(ref)) continue;

    const [pathPart, hashPart = ''] = ref.split('#');
    const normalizedPath = pathPart || pagePath;

    if (normalizedPath.startsWith('#')) {
      const id = normalizedPath.slice(1);
      if (id && !pageIds.get(file)?.has(id)) {
        errors.push(`${pagePath}: missing same-page anchor "#${id}"`);
      }
      continue;
    }

    const key = `${file} -> ${ref}`;
    if (checked.has(key)) continue;
    checked.add(key);

    const targetFile = await resolvePageFile(normalizedPath);
    if (!targetFile) {
      errors.push(`${pagePath}: broken link "${ref}"`);
      continue;
    }

    if (hashPart) {
      const ids = pageIds.get(targetFile);
      if (!ids) {
        errors.push(`${pagePath}: anchor target is not an HTML file "${ref}"`);
      } else if (!ids.has(hashPart)) {
        errors.push(`${pagePath}: missing anchor "#${hashPart}" in "${ref}"`);
      }
    }
  }

  const meta = new Map();
  for (const match of html.matchAll(/<meta\b[^>]*>/g)) {
    const tag = match[0];
    const name = tag.match(/\b(?:property|name)="([^"]+)"/)?.[1];
    const content = tag.match(/\bcontent="([^"]*)"/)?.[1];
    if (name && content) meta.set(name, content);
  }

  for (const name of ['og:image', 'twitter:image']) {
    const content = meta.get(name);
    if (!content) continue;

    const imageURL = new URL(content, expectedOrigin);
    const imageFile = await resolvePageFile(imageURL.pathname);
    const key = `${pagePath} ${name} ${content}`;

    if (!imageFile) {
      if (!checked.has(key)) {
        errors.push(`${pagePath}: missing ${name} asset "${content}"`);
        checked.add(key);
      }
      continue;
    }

    if (/\.svg$/i.test(imageURL.pathname) && !checked.has(key)) {
      errors.push(`${pagePath}: ${name} must be a raster image, got "${content}"`);
      checked.add(key);
    }

    if (name !== 'og:image' || checked.has(key)) continue;

    const expectedType = meta.get('og:image:type');
    const expectedWidth = Number(meta.get('og:image:width'));
    const expectedHeight = Number(meta.get('og:image:height'));
    const actual = await sharp(imageFile).metadata();
    const actualType = actual.format === 'jpg' ? 'image/jpeg' : `image/${actual.format}`;

    if (expectedType && expectedType !== actualType) {
      errors.push(
        `${pagePath}: og:image:type says "${expectedType}" but asset is "${actualType}"`,
      );
    }

    if (expectedWidth && actual.width !== expectedWidth) {
      errors.push(
        `${pagePath}: og:image:width says ${expectedWidth} but asset is ${actual.width}px wide`,
      );
    }

    if (expectedHeight && actual.height !== expectedHeight) {
      errors.push(
        `${pagePath}: og:image:height says ${expectedHeight} but asset is ${actual.height}px tall`,
      );
    }
  }
}

const sitemapFile = path.join(dist, 'sitemap.xml');
try {
  const sitemap = await readFile(sitemapFile, 'utf8');
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(match[1]);
    if (url.origin !== expectedOrigin) {
      errors.push(`sitemap: unexpected origin ${url.origin}`);
      continue;
    }
    const file = await resolvePageFile(url.pathname);
    if (!file) errors.push(`sitemap: missing page ${url.pathname}`);
  }
} catch {
  errors.push('sitemap.xml is missing');
}

if (errors.length) {
  console.error(`Link check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Link check passed: ${htmlFiles.length} HTML files, ${checked.size} internal references.`);
