/**
 * Skills scene: nine extruded isometric tiles. Icons are inline vectors, the
 * hover is a staggered float and each ground shadow breathes in sync.
 */
import { THEME } from './theme.mjs';
import { glowFilter, isoCube, lg, n, rg, softFilter } from './svg.mjs';

const STACK = [
  { key: 'js', label: 'JavaScript', color: '#f7df1e', x: 240, y: 245, delay: -0.2 },
  { key: 'ts', label: 'TypeScript', color: '#3178c6', x: 440, y: 245, delay: -1.1 },
  { key: 'py', label: 'Python', color: '#38bdf8', x: 640, y: 245, delay: -2.0 },
  { key: 'react', label: 'React', color: '#61dafb', x: 840, y: 245, delay: -2.9 },
  { key: 'node', label: 'Node.js', color: '#5fbf5a', x: 1040, y: 245, delay: -3.8 },
  { key: 'docker', label: 'Docker', color: '#2496ed', x: 340, y: 378, delay: -0.6 },
  { key: 'git', label: 'Git', color: '#f05032', x: 540, y: 378, delay: -1.6 },
  { key: 'sql', label: 'SQL', color: '#a78bfa', x: 740, y: 378, delay: -2.5 },
  { key: 'linux', label: 'Linux', color: '#f6c453', x: 940, y: 378, delay: -3.4 },
];

const HALF_W = 96;
const HALF_H = 48;
const DEPTH = 24;

function icon(kind, color) {
  switch (kind) {
    case 'js':
    case 'ts': {
      const text = kind.toUpperCase();
      const bg = kind === 'js' ? '#f7df1e' : '#3178c6';
      const fg = kind === 'js' ? '#111318' : '#ffffff';
      return `<g>
  <rect x="-14" y="-14" width="28" height="28" rx="5" fill="${bg}"/>
  <text x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="800" fill="${fg}">${text}</text>
</g>`;
    }
    case 'py':
      return `<g fill="none" stroke-width="3.2" stroke-linecap="round">
  <path d="M-10,-2 v-5 a4,4 0 0 1 4,-4 h7 a4,4 0 0 1 4,4 v3 a4,4 0 0 1 -4,4 h-6 a4,4 0 0 0 -4,4 v4" stroke="#3776ab"/>
  <path d="M10,2 v5 a4,4 0 0 1 -4,4 h-7 a4,4 0 0 1 -4,-4 v-3 a4,4 0 0 1 4,-4 h6 a4,4 0 0 0 4,-4 v-4" stroke="#ffd43b"/>
  <circle cx="-4.5" cy="-7" r="1.5" fill="#e6edf3" stroke="none"/>
  <circle cx="4.5" cy="7" r="1.5" fill="#1f2328" stroke="none"/>
</g>`;
    case 'react':
      return `<g fill="none" stroke="${color}" stroke-width="1.8">
  <ellipse rx="15" ry="5.6"/>
  <ellipse rx="15" ry="5.6" transform="rotate(60)"/>
  <ellipse rx="15" ry="5.6" transform="rotate(120)"/>
  <circle r="2.4" fill="${color}" stroke="none"/>
</g>`;
    case 'node':
      return `<g>
  <path d="M0,-14 L12.2,-7 L12.2,7 L0,14 L-12.2,7 L-12.2,-7 Z" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-width="1.8"/>
  <path d="M-4.5,-3.5 h9 v7 h-9 z" fill="none" stroke="${color}" stroke-width="1.6"/>
  <circle cx="6" cy="6" r="2" fill="${color}"/>
</g>`;
    case 'docker':
      return `<g>
  <path d="M-14,4 h26 a8,8 0 0 1 -8,8 h-9 a9,9 0 0 1 -9,-8z" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1.7"/>
  <rect x="-11" y="-2" width="6" height="5" rx="1" fill="${color}"/>
  <rect x="-4" y="-2" width="6" height="5" rx="1" fill="${color}"/>
  <rect x="3" y="-2" width="6" height="5" rx="1" fill="${color}"/>
  <rect x="-4" y="-8" width="6" height="5" rx="1" fill="${color}"/>
  <path d="M13,1 c3,-2 5,0 6,1" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round"/>
</g>`;
    case 'git':
      return `<g fill="none" stroke="${color}" stroke-width="2">
  <circle cx="-8" cy="8" r="3.2" fill="${color}"/>
  <circle cx="8" cy="-8" r="3.2" fill="${color}"/>
  <circle cx="8" cy="8" r="3.2" fill="${color}"/>
  <path d="M-8,5 V-2 a5,5 0 0 1 5,-5 h8"/>
  <path d="M8,-5 V5"/>
</g>`;
    case 'sql':
      return `<g fill="none" stroke="${color}" stroke-width="1.8">
  <ellipse cx="0" cy="-9" rx="11" ry="4"/>
  <path d="M-11,-9 V8 a11,4 0 0 0 22,0 V-9"/>
  <path d="M-11,0 a11,4 0 0 0 22,0"/>
  <path d="M-11,8 a11,4 0 0 0 22,0"/>
</g>`;
    case 'linux':
      return `<g>
  <ellipse cx="0" cy="1" rx="10" ry="13" fill="#1f2328" stroke="${color}" stroke-width="1.2"/>
  <ellipse cx="0" cy="4" rx="6.2" ry="8" fill="#f8fafc"/>
  <circle cx="-4" cy="-6" r="2.2" fill="#f8fafc"/>
  <circle cx="4" cy="-6" r="2.2" fill="#f8fafc"/>
  <circle cx="-4" cy="-6" r="0.9" fill="#1f2328"/>
  <circle cx="4" cy="-6" r="0.9" fill="#1f2328"/>
  <path d="M-4,-2 L0,0 L4,-2 Z" fill="${color}"/>
  <path d="M-5,13 l-4,3 M5,13 l4,3" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
</g>`;
    default:
      return '';
  }
}

function tile(tech, p, mode) {
  const { x: cx, y: cy, color } = tech;
  const shadowY = cy + HALF_H + DEPTH + 6;
  return `<g class="tile-shadow" style="animation-delay:${tech.delay}s">
  <ellipse cx="${cx}" cy="${shadowY}" rx="${n(HALF_W * 0.72)}" ry="13" fill="${color}" opacity="${mode === 'dark' ? 0.1 : 0.08}" filter="url(#tile-soft)"/>
  <ellipse cx="${cx}" cy="${shadowY}" rx="${n(HALF_W * 0.78)}" ry="17" fill="${p.shadow}" opacity="${mode === 'dark' ? 0.55 : 0.22}" filter="url(#tile-soft)"/>
</g>
<g class="tile" style="animation-delay:${tech.delay}s">
  <path d="M${cx - HALF_W},${cy} L${cx},${cy + HALF_H} L${cx},${cy + HALF_H + DEPTH} L${cx - HALF_W},${cy + DEPTH} Z" fill="${p.leftFace}" stroke="${p.lineSoft}" stroke-width="0.8"/>
  <path d="M${cx + HALF_W},${cy} L${cx},${cy + HALF_H} L${cx},${cy + HALF_H + DEPTH} L${cx + HALF_W},${cy + DEPTH} Z" fill="${p.rightFace}" stroke="${p.lineSoft}" stroke-width="0.8"/>
  <path d="M${cx},${cy - HALF_H} L${cx + HALF_W},${cy} L${cx},${cy + HALF_H} L${cx - HALF_W},${cy} Z" fill="url(#tile-${tech.key})" stroke="${color}" stroke-opacity="0.65" stroke-width="1.3"/>
  <path d="M${cx},${cy - HALF_H + 10} L${cx + HALF_W - 18},${cy} L${cx},${cy + HALF_H - 10} L${cx - HALF_W + 18},${cy} Z" fill="none" stroke="${color}" stroke-opacity="0.22" stroke-width="0.9"/>
  <path d="M${cx - HALF_W + 8},${cy + 3} L${cx},${cy + HALF_H + 3}" stroke="${color}" stroke-opacity="0.5" stroke-width="1.2"/>
  <g transform="translate(${cx} ${cy - 12})" filter="url(#icon-glow)">${icon(tech.key, color)}</g>
  <text x="${cx}" y="${cy + 26}" text-anchor="middle" font-size="12.5" font-weight="600" letter-spacing="0.3" fill="${mode === 'dark' ? '#07101f' : p.ink}">${tech.label}</text>
</g>`;
}

function svgSkills(mode) {
  const p = THEME[mode];
  const defs = `
${rg('skills-aura', [[0, p.violet, mode === 'dark' ? 0.3 : 0.13], [0.55, p.blue, 0.08], [1, p.bgB, 0]])}
${glowFilter('icon-glow', p.cyan, 3, 0.7)}
${softFilter('tile-soft', 10)}
${STACK.map((tech) => lg(`tile-${tech.key}`, [
    [0, tech.color, mode === 'dark' ? 0.48 : 0.3],
    [0.55, tech.color, mode === 'dark' ? 0.2 : 0.14],
    [1, p.topFace, 0.96],
  ], { x1: 0, y1: 0, x2: 0, y2: 1 })).join('\n')}
<filter id="beam-fade" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur stdDeviation="8"/>
</filter>`;

  const css = `
.tile { animation: tileFloat 5.4s ease-in-out infinite; }
@keyframes tileFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
.tile-shadow { transform-box: fill-box; transform-origin: center; animation: shadowBreathe 5.4s ease-in-out infinite; }
@keyframes shadowBreathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(0.82); opacity: 0.45; } }
.beam { animation: beam 6s ease-in-out infinite; }
@keyframes beam { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.28; } }
.cube-a { animation: cubeFloat 10s ease-in-out infinite; }
.cube-b { animation: cubeFloat 13s ease-in-out -5s infinite; }
@keyframes cubeFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
`;

  const beams = [240, 440, 640, 840, 1040]
    .map((x, i) => `<rect class="beam" style="animation-delay:${n(-i * 0.7, 1)}s" x="${x - 42}" y="120" width="84" height="150" fill="url(#beam-grad)" filter="url(#beam-fade)"/>`)
    .join('');

  const body = `<g class="anim">
  <ellipse cx="600" cy="250" rx="560" ry="260" fill="url(#skills-aura)"/>
  ${beams}

  <g class="mono" text-anchor="middle" font-size="10.5" letter-spacing="3" fill="${p.muted}">
    <text x="600" y="48">09 MODULES · ONE STACK</text>
    <line x1="430" y1="68" x2="560" y2="68" stroke="${p.line}" stroke-opacity="0.8"/>
    <line x1="640" y1="68" x2="770" y2="68" stroke="${p.line}" stroke-opacity="0.8"/>
    <path d="M600,62 l5,6 -5,6 -5,-6 Z" fill="${p.cyan}" opacity="0.8"/>
  </g>

  <g class="cube-a">${isoCube(104, 360, 24, { top: p.violet, left: p.leftFace, right: p.rightFace, edge: p.violet, opacity: 0.5 })}</g>
  <g class="cube-b">${isoCube(1108, 168, 18, { top: p.cyan, left: p.leftFace, right: p.rightFace, edge: p.cyan, opacity: 0.45 })}</g>

  ${STACK.slice(0, 5).map((tech) => tile(tech, p, mode)).join('\n')}
  ${STACK.slice(5).map((tech) => tile(tech, p, mode)).join('\n')}

</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1200 520" role="img" aria-labelledby="svg-title svg-desc">
<title id="svg-title">Dika Glorya — 3D tech stack</title>
<desc id="svg-desc">Nine isometric tech tiles for JavaScript, TypeScript, Python, React, Node.js, Docker, Git, SQL and Linux, floating above soft ground shadows.</desc>
<defs>
${defs}
${lg('beam-grad', [[0, p.cyan, 0], [0.55, p.cyan, 0.22], [1, p.cyan, 0]], { x1: 0, y1: 0, x2: 0, y2: 1 })}
</defs>
<style><![CDATA[
text { font-family: 'Segoe UI', Ubuntu, 'Helvetica Neue', Arial, sans-serif; }
.mono { font-family: 'Courier New', 'DejaVu Sans Mono', monospace; }
${css}
@media (prefers-reduced-motion: reduce) {
  .tile, .tile-shadow, .beam, .cube-a, .cube-b { animation: none !important; }
}
]]></style>
${body}
</svg>
`;
}

export function buildSkills() {
  return {
    'skills-3d-dark.svg': svgSkills('dark'),
    'skills-3d-light.svg': svgSkills('light'),
  };
}
