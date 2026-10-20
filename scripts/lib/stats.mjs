/**
 * Stats scene: an isometric 3D bar chart. Bars rise out of a glowing floor
 * plate, percentages step-count upward, and the tops carry a neon bloom.
 */
import { THEME } from './theme.mjs';
import { lg, n, rg, softFilter } from './svg.mjs';

const DATA = [
  { key: 'ts', label: 'TypeScript', value: 92, dark: '#38bdf8', light: '#0969da' },
  { key: 'js', label: 'JavaScript', value: 86, dark: '#f7df1e', light: '#a16207' },
  { key: 'py', label: 'Python', value: 78, dark: '#22d3ee', light: '#0891b2' },
  { key: 'sql', label: 'SQL', value: 64, dark: '#a78bfa', light: '#8250df' },
  { key: 'sh', label: 'Shell', value: 52, dark: '#a3ff12', light: '#4d7c0f' },
  { key: 'go', label: 'Go', value: 37, dark: '#ff2bd6', light: '#d1242f' },
];

const BASE_Y = 350;
const HALF_W = 47;
const TOP_H = 18;

function counter(x, y, value, color, delay) {
  const steps = [0, 0.25, 0.45, 0.65, 0.82, 1].map((t, i) => ({
    i,
    label: `${Math.round(value * t)}%`,
  }));
  return `<g class="mono">
${steps.slice(0, 5).map((step) => `<text class="count" style="animation-delay:${n(delay + step.i * 0.34, 2)}s" x="${x}" y="${y}" text-anchor="middle" font-size="15" font-weight="700" fill="${color}">${step.label}</text>`).join('\n')}
<text class="count count-final" style="animation-delay:${n(delay + 1.7, 2)}s" x="${x}" y="${y}" text-anchor="middle" font-size="16" font-weight="700" fill="${color}">${value}%</text>
</g>`;
}

function bar(item, index, mode, p) {
  const color = mode === 'dark' ? item.dark : item.light;
  const x = 232 + index * 148;
  const h = 40 + (item.value / 100) * 155;
  const top = n(BASE_Y - h, 1);
  const delay = n(0.25 + index * 0.07, 2);
  const clipBottom = BASE_Y + 20;
  const clipTop = top - 34;
  return `<g>
  <ellipse cx="${x + 8}" cy="${BASE_Y + 13}" rx="62" ry="16" fill="${p.shadow}" opacity="${mode === 'dark' ? 0.5 : 0.18}" filter="url(#stats-soft)"/>
  <clipPath id="bar-clip-${item.key}">
    <rect class="bar-clip" style="animation-delay:${delay}s" x="${x - 54}" y="${clipTop}" width="108" height="${n(clipBottom - clipTop, 1)}"/>
  </clipPath>
  <g clip-path="url(#bar-clip-${item.key})">
    <ellipse cx="${x}" cy="${top}" rx="44" ry="12" fill="${color}" opacity="0.5" filter="url(#bar-bloom)"/>
    <path d="M${x - HALF_W},${top} L${x},${top + TOP_H} L${x},${BASE_Y + TOP_H} L${x - HALF_W},${BASE_Y} Z" fill="url(#bar-${item.key})"/>
    <path d="M${x + HALF_W},${top} L${x},${top + TOP_H} L${x},${BASE_Y + TOP_H} L${x + HALF_W},${BASE_Y} Z" fill="url(#bar-${item.key})" opacity="0.55"/>
    <path d="M${x},${top - TOP_H} L${x + HALF_W},${top} L${x},${top + TOP_H} L${x - HALF_W},${top} Z" fill="${color}" fill-opacity="0.92"/>
    <path d="M${x},${top - TOP_H} L${x + HALF_W},${top} L${x},${top + TOP_H} L${x - HALF_W},${top} Z" fill="none" stroke="${p.ink}" stroke-opacity="0.3" stroke-width="0.8"/>
    <path d="M${x - HALF_W},${top} L${x},${top + TOP_H} L${x},${BASE_Y + TOP_H} L${x - HALF_W},${BASE_Y} Z" fill="none" stroke="${color}" stroke-opacity="0.5" stroke-width="0.9"/>
    <path d="M${x + HALF_W},${top} L${x},${top + TOP_H} L${x},${BASE_Y + TOP_H} L${x + HALF_W},${BASE_Y} Z" fill="none" stroke="${color}" stroke-opacity="0.35" stroke-width="0.9"/>
  </g>
  ${counter(x, top - 28, item.value, color, delay + 0.1)}
</g>`;
}

function svgStats(mode) {
  const p = THEME[mode];
  const floor = 'M600,226 L1120,350 L600,474 L80,350 Z';
  const floorLines = [];
  for (let i = 1; i <= 7; i += 1) {
    const t = i / 8;
    const sx = 600 - 520 * t;
    const sy = 226 + 124 * t;
    floorLines.push(`<path d="M${n(sx, 1)},${n(sy, 1)} l520,124" stroke="${p.grid}" stroke-opacity="0.16" stroke-width="1"/>`);
    floorLines.push(`<path d="M${n(1200 - sx, 1)},${n(sy, 1)} l-520,124" stroke="${p.grid}" stroke-opacity="0.16" stroke-width="1"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1200 470" role="img" aria-labelledby="svg-title svg-desc">
<title id="svg-title">Dika Glorya — language fingerprint</title>
<desc id="svg-desc">An isometric 3D bar chart with six glowing bars growing from a perspective floor plate, showing animated percentage counters.</desc>
<defs>
${rg('stats-aura', [[0, p.violet, mode === 'dark' ? 0.3 : 0.12], [0.5, p.cyan, 0.07], [1, p.bgB, 0]])}
${lg('stats-floor', [[0, p.cyan, mode === 'dark' ? 0.18 : 0.1], [0.55, p.violet, 0.06], [1, p.bgB, 0]])}
${lg('floor-edge', [[0, p.cyan, 0], [0.2, p.cyan, 0.55], [0.5, p.violet, 0.35], [0.8, p.magenta, 0.45], [1, p.magenta, 0]], { x1: 80, y1: 350, x2: 1120, y2: 350, user: true })}
<filter id="bar-bloom" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
${softFilter('stats-soft', 9)}
<clipPath id="stats-floor-clip"><path d="${floor}"/></clipPath>
${DATA.map((item) => {
    const color = mode === 'dark' ? item.dark : item.light;
    return lg(`bar-${item.key}`, [[0, color, 0.88], [0.6, color, 0.45], [1, p.line, 0.55]], { x1: 0, y1: 0, x2: 0, y2: 1 });
  }).join('\n')}
</defs>
<style><![CDATA[
text { font-family: 'Segoe UI', Ubuntu, 'Helvetica Neue', Arial, sans-serif; }
.mono { font-family: 'Courier New', 'DejaVu Sans Mono', monospace; }
.bar-clip { transform-box: fill-box; transform-origin: center bottom; animation: growBar 7s cubic-bezier(0.16, 0.84, 0.24, 1) infinite; }
@keyframes growBar { 0% { transform: scaleY(0); } 28% { transform: scaleY(1); } 92% { transform: scaleY(1); } 100% { transform: scaleY(0); } }
.count { opacity: 0; animation: countStep 7s linear infinite; }
.count-final { animation: countFinal 7s linear infinite; }
@keyframes countStep { 0%, 4.4% { opacity: 1; } 4.5%, 100% { opacity: 0; } }
@keyframes countFinal { 0%, 23% { opacity: 0; } 24%, 92% { opacity: 1; } 93%, 100% { opacity: 0; } }
.floor-pulse { animation: floorPulse 5s ease-in-out infinite; }
@keyframes floorPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
.spark { animation: spark 3.2s ease-in-out infinite; }
@keyframes spark { 0%, 100% { opacity: 0.15; transform: translateY(0); } 50% { opacity: 0.9; transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) {
  .bar-clip, .count, .count-final, .floor-pulse, .spark { animation: none !important; }
  .count:not(.count-final) { display: none !important; }
  .count-final { opacity: 1 !important; }
}
]]></style>
<g class="anim">
  <ellipse cx="600" cy="280" rx="560" ry="240" fill="url(#stats-aura)"/>

  <g class="mono" font-size="10.5" letter-spacing="3" fill="${p.muted}">
    <text x="80" y="48">// STACK SIGNAL</text>
    <text x="1120" y="48" text-anchor="end" fill="${p.faint}">ILLUSTRATIVE SNAPSHOT</text>
  </g>
  <text x="80" y="88" font-size="30" font-weight="700" letter-spacing="-0.6" fill="${p.ink}">Language fingerprint</text>
  <line x1="80" y1="108" x2="220" y2="108" stroke="${p.cyan}" stroke-width="2" opacity="0.8"/>

  <path d="${floor}" fill="url(#stats-floor)" stroke="url(#floor-edge)" stroke-width="1.4"/>
  <g clip-path="url(#stats-floor-clip)" opacity="0.8">${floorLines.join('')}</g>
  <path class="floor-pulse" d="${floor}" fill="none" stroke="${p.cyan}" stroke-opacity="0.4" stroke-width="1"/>

  ${[0, 1, 2, 3, 4, 5].map((i) => {
    const x = 232 + i * 148;
    return `<path d="M${x},${BASE_Y + 8} l0,14" stroke="${p.line}" stroke-opacity="0.6"/>`;
  }).join('')}

  ${DATA.map((item, i) => bar(item, i, mode, p)).join('\n')}

  ${DATA.map((item, i) => {
    const color = mode === 'dark' ? item.dark : item.light;
    const x = 232 + i * 148;
    return `<g class="mono">
    <circle cx="${x - 24}" cy="410" r="3.2" fill="${color}"/>
    <text x="${x - 15}" y="414" font-size="11" letter-spacing="0.2" fill="${p.muted}">${item.label}</text>
  </g>`;
  }).join('\n')}

  <g class="spark" style="animation-delay:-1.2s"><circle cx="186" cy="176" r="2.4" fill="${p.cyan}"/></g>
  <g class="spark" style="animation-delay:-2.4s"><circle cx="1042" cy="212" r="2" fill="${p.magenta}"/></g>
  <g class="spark" style="animation-delay:-0.6s"><circle cx="892" cy="150" r="1.6" fill="${p.lime}"/></g>

  <g class="mono" font-size="9.5" letter-spacing="2" fill="${p.faint}">
    <text x="80" y="448">SAMPLE DATA · LIVE CARDS BELOW</text>
    <text x="1120" y="448" text-anchor="end">06 LANGUAGES · 3D PROJECTION</text>
  </g>
</g>
</svg>
`;
}

export function buildStats() {
  return {
    'stats-3d-dark.svg': svgStats('dark'),
    'stats-3d-light.svg': svgStats('light'),
  };
}
