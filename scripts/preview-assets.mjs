#!/usr/bin/env node
/**
 * Render-tests every SVG in /assets with headless Chromium and writes a PNG
 * to /preview. A second frame is captured to prove the motion actually runs.
 *
 * Run: npm run preview:assets
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'assets');
const PREVIEW = path.join(ROOT, 'preview');
fs.mkdirSync(PREVIEW, { recursive: true });

const files = fs.readdirSync(ASSETS).filter((file) => file.endsWith('.svg')).sort();
if (files.length === 0) {
  console.error('No SVGs in assets/. Run npm run build:assets first.');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const failures = [];

for (const file of files) {
  const source = fs.readFileSync(path.join(ASSETS, file), 'utf8');
  const viewBox = source.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!viewBox) {
    failures.push(`${file}: no viewBox`);
    continue;
  }
  const height = Number(viewBox[2]);
  await page.setViewportSize({ width: 1200, height });
  await page.goto(pathToFileURL(path.join(ASSETS, file)).href, { waitUntil: 'load' });

  const hasSvg = await page.evaluate(() => Boolean(document.querySelector('svg')));
  if (!hasSvg) failures.push(`${file}: browser did not render an SVG root`);

  await page.waitForTimeout(2600);
  const png = path.join(PREVIEW, file.replace(/\.svg$/, '.png'));
  const shot = await page.screenshot({ omitBackground: true });
  const background = file.includes('light') ? '#ffffff' : '#0d1117';
  await sharp(shot).flatten({ background }).png().toFile(png);
  const first = fs.readFileSync(png);

  await page.waitForTimeout(900);
  const secondBuffer = await page.screenshot({ omitBackground: true });
  const firstHash = crypto.createHash('sha1').update(first).digest('hex');
  const secondHash = crypto.createHash('sha1').update(secondBuffer).digest('hex');
  if (firstHash === secondHash) failures.push(`${file}: frames are identical; animation may not be running`);
}

await browser.close();

for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(`\nRendered ${files.length} SVGs into preview/. ${failures.length ? `${failures.length} issue(s).` : 'All frames animate.'}`);
if (failures.length) process.exit(1);
