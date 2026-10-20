#!/usr/bin/env node
/**
 * Generates every profile README asset into /assets, then validates the result.
 * The output is deterministic: palettes, copy and geometry all live in lib/.
 *
 * Run: npm run build:assets
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildHero } from './lib/hero.mjs';
import { buildAbout } from './lib/about.mjs';
import { buildSkills } from './lib/skills.mjs';
import { buildStats } from './lib/stats.mjs';
import { buildDivider, buildFooter } from './lib/scenes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets');
fs.mkdirSync(OUT, { recursive: true });

const files = {
  ...buildHero(),
  ...buildAbout(),
  ...buildSkills(),
  ...buildStats(),
  ...buildDivider(),
  ...buildFooter(),
};

const MAX_BYTES = 500 * 1024;
const errors = [];
const rows = [];

for (const [name, contents] of Object.entries(files)) {
  const file = path.join(OUT, name);
  fs.writeFileSync(file, contents, 'utf8');
  const bytes = Buffer.byteLength(contents, 'utf8');
  const sizeKb = (bytes / 1024).toFixed(1);

  if (bytes > MAX_BYTES) errors.push(`${name}: ${sizeKb} KB exceeds the 500 KB ceiling`);
  if (!contents.includes('viewBox="0 0 1200')) errors.push(`${name}: missing a 1200-wide viewBox`);
  if (!contents.includes('width="100%"')) errors.push(`${name}: missing width="100%"`);
  if (/<script[\s>]/i.test(contents)) errors.push(`${name}: contains a script element`);
  if (/<foreignObject[\s>]/i.test(contents)) errors.push(`${name}: contains foreignObject`);
  if (/(?:href|src)="https?:/i.test(contents)) errors.push(`${name}: contains an external resource URL`);
  if (/url\((['"]?)https?:/i.test(contents)) errors.push(`${name}: contains an external CSS URL`);

  const xml = spawnSync('xmllint', ['--noout', file], { encoding: 'utf8' });
  if (xml.status !== 0) {
    errors.push(`${name}: xmllint failed — ${(xml.stderr || '').trim().split('\n')[0]}`);
  }

  const animated = (contents.match(/animation:|<animate|<animateTransform|<animateMotion/g) || []).length;
  const circles = (contents.match(/<circle/g) || []).length;
  rows.push({ name, sizeKb, animated, circles });
}

const width = Math.max(...rows.map((row) => row.name.length));
console.log('asset'.padEnd(width), 'size', 'anim', 'circles');
for (const row of rows) {
  console.log(
    row.name.padEnd(width),
    `${row.sizeKb.padStart(6)}K`,
    String(row.animated).padStart(4),
    String(row.circles).padStart(7),
  );
}

if (errors.length) {
  console.error('\nValidation failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`\n${rows.length} SVGs written to assets/. All XML valid, all under ${MAX_BYTES / 1024} KB.`);
