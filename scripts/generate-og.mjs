import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="72%" cy="42%" r="60%">
      <stop offset="0" stop-color="#1a1d2a"/>
      <stop offset="0.55" stop-color="#0b0c10"/>
      <stop offset="1" stop-color="#07080a"/>
    </radialGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f2eee4"/>
      <stop offset="0.3" stop-color="#3b5bff"/>
      <stop offset="0.62" stop-color="#14151b"/>
      <stop offset="0.86" stop-color="#ff5a1f"/>
      <stop offset="1" stop-color="#f2eee4"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="26"/></filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity="0.5" stroke="#f2eee4" stroke-opacity="0.08" stroke-width="1">
    <path d="M0 500h1200M0 540h1200M0 580h1200"/>
    <path d="M80 0v630M160 0v630M240 0v630M320 0v630M400 0v630M480 0v630M560 0v630M640 0v630M720 0v630M800 0v630M880 0v630M960 0v630M1040 0v630M1120 0v630"/>
  </g>
  <ellipse cx="930" cy="330" rx="210" ry="120" fill="#ff5a1f" opacity="0.18" filter="url(#blur)"/>
  <g transform="translate(900 315) rotate(-18)">
    <ellipse cx="0" cy="0" rx="185" ry="74" fill="none" stroke="url(#chrome)" stroke-width="54"/>
    <ellipse cx="0" cy="0" rx="185" ry="74" fill="none" stroke="#07080a" stroke-opacity="0.25" stroke-width="2"/>
    <circle cx="0" cy="0" r="92" fill="url(#chrome)"/>
    <circle cx="-26" cy="-28" r="22" fill="#f2eee4" opacity="0.65"/>
  </g>
  <g fill="#f2eee4" font-family="Georgia, 'Times New Roman', serif">
    <text x="76" y="250" font-size="34" letter-spacing="6" font-family="Arial, sans-serif" fill="#ff5a1f">INDEPENDENT DEVELOPER · KENDAL</text>
    <text x="72" y="390" font-size="150" letter-spacing="-8">DIKA</text>
    <text x="72" y="520" font-size="150" font-style="italic" letter-spacing="-6" fill="#ff5a1f">GLORYA</text>
  </g>
  <text x="80" y="580" font-family="Arial, sans-serif" font-size="22" letter-spacing="3" fill="#b9b3a6">WEBSITE · BOT · TOOLS · AUTOMATION · OBITOGLORY</text>
  <text x="1120" y="580" text-anchor="end" font-family="Arial, sans-serif" font-size="20" letter-spacing="2" fill="#8c877b">6°55′S 110°12′E</text>
</svg>`;

const out = path.join(root, 'public/og-kendal-signal.png');
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote', out);
