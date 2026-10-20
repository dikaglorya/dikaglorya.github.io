/**
 * Hero banner: 3D wireframe icosahedron, perspective floor, parallax stars,
 * orbiting tech orbs and a typed name lockup. Rendered for both color modes.
 */
import { THEME } from './theme.mjs';
import { glowFilter, gridFloor, lg, n, rg, softFilter, starField, wrap } from './svg.mjs';

const TECHS = ['TS', 'React', 'Node', 'Py', 'Docker'];
const VALUES = [92, 86, 78, 64, 52, 37];

const ICOSA_FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

function icosahedron({ cx, cy, r, frames, dur, p }) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];
  const verts = raw.map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return [x / len, y / len, z / len];
  });
  const edgePairs = new Set();
  for (const [a, b, c] of ICOSA_FACES) {
    [[a, b], [b, c], [a, c]].forEach(([u, v]) => edgePairs.add(u < v ? `${u}-${v}` : `${v}-${u}`));
  }
  const edges = [...edgePairs].map((pair) => pair.split('-').map(Number));

  let markup = '';
  let staticFrame = '';
  for (let f = 0; f < frames; f += 1) {
    const a = (f / frames) * Math.PI * 2;
    const tilt = 0.38 + Math.sin(a * 2) * 0.24;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const pts = verts.map(([x, y, z]) => {
      const x1 = x * ca + z * sa;
      const z1 = -x * sa + z * ca;
      const y1 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      const scale = 3.4 / (3.4 - z2);
      return {
        x: n(cx + x1 * scale * r, 1),
        y: n(cy - y1 * scale * r, 1),
        z: z2,
        s: scale,
      };
    });

    const faceParts = [];
    for (const face of ICOSA_FACES) {
      const [p1, p2, p3] = face.map((i) => pts[i]);
      const ux = p2.x - p1.x;
      const uy = p2.y - p1.y;
      const vx = p3.x - p1.x;
      const vy = p3.y - p1.y;
      if (ux * vy - uy * vx > 0) continue;
      faceParts.push(`M${p1.x},${p1.y}L${p2.x},${p2.y}L${p3.x},${p3.y}Z`);
    }
    const edgePath = edges
      .map(([u, v]) => `M${pts[u].x},${pts[u].y}L${pts[v].x},${pts[v].y}`)
      .join('');
    const dotPath = pts
      .map((pt) => {
        const s = n(1.5 * pt.s, 1);
        return `M${n(pt.x - s, 1)},${pt.y}a${s},${s} 0 1,0 ${n(s * 2, 1)},0a${s},${s} 0 1,0 ${n(-s * 2, 1)},0`;
      })
      .join('');
    const delay = n((f * dur) / frames, 3);
    const inner = `<path d="${faceParts.join('')}" fill="url(#ico-face)" fill-opacity="0.16" fill-rule="nonzero"/>
<path d="${edgePath}" fill="none" stroke="url(#ico-edge)" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round"/>
<path d="${dotPath}" fill="${p.cyan}" opacity="0.9"/>`;
    if (f === 0) staticFrame = inner;
    markup += `<g class="cf-frame" opacity="0">
${inner}
<animate attributeName="opacity" values="1;0" keyTimes="0;0.014" calcMode="discrete" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</g>`;
  }
  return { frames: markup, staticFrame };
}

function orbSet({ path, dur, orbs, front = false, p }) {
  return orbs
    .map(({ label, color, delay }) => `<g class="orb-motion">
  <animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" path="${path}"/>
  <g class="orb-scale${front ? ' orb-front' : ''}" style="animation-delay:${delay}s">
    <circle r="25" fill="${p.panel}" fill-opacity="0.92" stroke="${color}" stroke-width="1.4" filter="url(#orb-glow)"/>
    <circle r="19" fill="none" stroke="${color}" stroke-opacity="0.22"/>
    <text class="mono" x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="10.5" letter-spacing="0.4" fill="${p.ink}">${label}</text>
  </g>
</g>`)
    .join('');
}

function staticOrbs(p) {
  const items = [
    ['TS', p.cyan, 360, 236],
    ['React', p.blue, 842, 250],
    ['Node', p.lime, 458, 360],
    ['Py', p.violet, 728, 352],
  ];
  return `<g class="orb-static">
${items.map(([label, color, x, y]) => `<g transform="translate(${x} ${y})" opacity="0.85">
  <circle r="22" fill="${p.panel}" stroke="${color}" stroke-width="1.2"/>
  <text class="mono" x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="${p.ink}">${label}</text>
</g>`).join('\n')}
</g>`;
}

function svgHero(mode) {
  const p = THEME[mode];
  const grid = gridFloor({ horizon: 325, bottom: 420, color: p.grid, glowColor: p.cyan });
  const far = starField({ seed: 11, count: 54, h: 330, color: p.star, minR: 0.4, maxR: 1.1, minO: 0.18, maxO: 0.55 });
  const mid = starField({ seed: 22, count: 30, h: 300, color: p.star, minR: 0.7, maxR: 1.6, minO: 0.3, maxO: 0.75 });
  const near = starField({ seed: 33, count: 12, h: 240, color: p.star, minR: 1.1, maxR: 2.1, minO: 0.4, maxO: 0.9 });

  const defs = `
${lg('hero-bg', [[0, p.bgA], [0.55, p.bgB], [1, p.bgC]], { x1: 0, y1: 0, x2: 0.7, y2: 1 })}
${rg('hero-aura', [[0, p.violet, mode === 'dark' ? 0.38 : 0.16], [0.5, p.blue, 0.1], [1, p.bgB, 0]])}
${rg('hero-floor', [[0, p.cyan, mode === 'dark' ? 0.22 : 0.12], [1, p.bgB, 0]])}
${lg('title-grad', [[0, p.cyan], [0.48, p.ink], [0.72, p.blue], [1, p.magenta]], { x1: 260, y1: 0, x2: 940, y2: 0, user: true })}
${lg('line-grad', [[0, p.cyan, 0], [0.25, p.cyan, 0.7], [0.5, p.violet, 0.2], [0.75, p.magenta, 0.7], [1, p.magenta, 0]], { x1: 0, y1: 0, x2: 1200, y2: 0, user: true })}
${lg('ico-face', [[0, p.cyan], [0.55, p.violet], [1, p.magenta]], { x1: 470, y1: 190, x2: 730, y2: 380, user: true })}
${lg('ico-edge', [[0, p.cyan], [0.5, p.blue], [1, p.magenta]], { x1: 460, y1: 0, x2: 750, y2: 0, user: true })}
${rg('core', [[0, '#ffffff', 0.95], [0.35, p.cyan, 0.75], [1, p.cyan, 0]])}
${glowFilter('title-glow', p.cyan, 7, 1.1)}
${glowFilter('orb-glow', p.cyan, 3.5, 1.4)}
${glowFilter('floor-glow', p.cyan, 3, 0.7)}
${softFilter('soft-blur', 9)}
${grid.defs}
${far.defs}
${mid.defs}
${near.defs}
<g id="title-word"><text x="600" y="122" text-anchor="middle" font-size="88" font-weight="800" letter-spacing="-2.5">Dika Glorya</text></g>
<clipPath id="title-clip"><rect class="reveal" x="205" y="42" width="790" height="98"/></clipPath>
<clipPath id="shine-clip"><rect x="205" y="42" width="790" height="98"/></clipPath>`;

  const orbitBack = 'M350,285 A250,88 0 1,1 850,285 A250,88 0 1,1 350,285';
  const orbitFront = 'M395,285 A205,68 0 1,1 805,285 A205,68 0 1,1 395,285';

  const css = `
.reveal { transform-box: fill-box; transform-origin: left center; animation: reveal 1s steps(20) 0.2s both; }
@keyframes reveal { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.shine { animation: shine 7.5s ease-in-out 2s infinite; }
@keyframes shine { 0%, 62% { transform: translateX(-260px); opacity: 0; } 68% { opacity: 0.55; } 88%, 100% { transform: translateX(260px); opacity: 0; } }
.cube-static { display: none; }
@media (prefers-reduced-motion: reduce) {
  .cube-frames { display: none !important; }
  .cube-static { display: block !important; }
}
.ring-a { transform-box: fill-box; transform-origin: center; animation: ringSpin 26s linear infinite; }
.ring-b { transform-box: fill-box; transform-origin: center; animation: ringSpin 18s linear infinite reverse; }
@keyframes ringSpin { to { transform: rotate(360deg); } }
.orb-scale { transform-box: fill-box; transform-origin: center; animation: orbDepth 22s linear infinite; }
.orb-front { animation-duration: 18s; }
@keyframes orbDepth {
  0% { transform: scale(0.78); opacity: 0.7; }
  25% { transform: scale(0.64); opacity: 0.58; }
  50% { transform: scale(0.84); opacity: 0.72; }
  75% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(0.78); opacity: 0.7; }
}
.orb-static { display: none; }
.sub { opacity: 0; }
.sub-a { animation: subCycle 12s ease-in-out infinite; }
.sub-b { animation: subCycle 12s ease-in-out 4s infinite; }
.sub-c { animation: subCycle 12s ease-in-out 8s infinite; }
@keyframes subCycle {
  0% { opacity: 0; transform: translateY(7px); }
  1.2% { opacity: 1; transform: translateY(0); }
  31.5% { opacity: 1; transform: translateY(0); }
  33.2% { opacity: 0; transform: translateY(-6px); }
  100% { opacity: 0; transform: translateY(-6px); }
}
.grid-flow path { stroke-dasharray: 2 9; animation: dash 2.6s linear infinite; }
@keyframes dash { to { stroke-dashoffset: -33; } }
.grid-rows { animation: rowsPulse 4.5s ease-in-out infinite; }
@keyframes rowsPulse { 0%,100% { opacity: 0.55; } 50% { opacity: 0.9; } }
.stars-far { animation: starDrift 90s linear infinite; }
.stars-mid { animation: starDrift 58s linear infinite; }
.stars-near { animation: starDrift 34s linear infinite; }
@keyframes starDrift { to { transform: translateX(-1200px); } }
.twinkle { animation: twinkle 5.5s ease-in-out infinite; }
@keyframes twinkle { 0%,100% { opacity: 0.18; } 50% { opacity: 0.95; } }
.blink { animation: blink 1.2s steps(1, end) infinite; }
@keyframes blink { 0%, 49% { opacity: 0.9; } 50%, 100% { opacity: 0; } }
.dust { animation: dust 14s linear infinite; }
@keyframes dust { 0% { transform: translate(0,0); opacity: 0; } 12% { opacity: 0.8; } 80% { opacity: 0.3; } 100% { transform: translate(-70px,-130px); opacity: 0; } }
`;
  const cube = icosahedron({ cx: 600, cy: 285, r: 92, frames: 72, dur: 4.8, p });
  const extrude = mode === 'dark' ? [0.18, 0.24, 0.28] : [0.06, 0.09, 0.12];

  const dust = Array.from({ length: 9 }, (_, i) => {
    const x = 220 + ((i * 97) % 760);
    const y = 170 + ((i * 53) % 210);
    return `<circle class="dust" style="animation-delay:${n(-i * 1.6, 1)}s" cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.5}" fill="${i % 2 ? p.cyan : p.violet}" opacity="0.5"/>`;
  }).join('');

  const body = `<g class="anim">
  <rect width="1200" height="420" fill="url(#hero-bg)"/>
  <ellipse cx="600" cy="200" rx="560" ry="230" fill="url(#hero-aura)"/>
  <g class="stars-far">${far.body}</g>
  <g class="stars-mid">${mid.body}</g>
  <g class="stars-near">${near.body}</g>
  ${dust}

  <ellipse cx="600" cy="392" rx="420" ry="32" fill="url(#hero-floor)"/>
  ${grid.body}
  <g class="smil">
    <path d="M-80,120 L120,60" stroke="${p.star}" stroke-width="1" opacity="0.5">
      <animate attributeName="opacity" values="0;0.8;0" dur="7s" repeatCount="indefinite"/>
    </path>
  </g>

  <g class="smil">${orbSet({ path: orbitBack, dur: 22, front: false, p, orbs: [
    { label: 'TS', color: p.cyan, delay: -2 },
    { label: 'Node', color: p.lime, delay: -9 },
    { label: 'Py', color: p.violet, delay: -15 },
  ] })}</g>
  ${staticOrbs(p)}

  <g class="float">
    <ellipse class="ring-a" cx="600" cy="285" rx="224" ry="70" fill="none" stroke="${p.cyan}" stroke-opacity="0.28" stroke-width="1" stroke-dasharray="3 10"/>
    <ellipse class="ring-b" cx="600" cy="285" rx="176" ry="112" fill="none" stroke="${p.violet}" stroke-opacity="0.32" stroke-width="1" stroke-dasharray="20 14"/>
    <circle cx="600" cy="285" r="19" fill="url(#core)" opacity="0.9"/>
    <g filter="url(#soft-blur)" opacity="${mode === 'dark' ? 0.55 : 0.32}">
      <circle cx="600" cy="285" r="46" fill="none" stroke="${p.cyan}" stroke-width="8"/>
    </g>
    <g class="cube-frames">${cube.frames}</g>
    <g class="cube-static">${cube.staticFrame}</g>
    <circle cx="600" cy="285" r="6" fill="${p.cyan}" opacity="0.9"/>
  </g>

  <g class="smil">${orbSet({ path: orbitFront, dur: 18, front: true, p, orbs: [
    { label: 'React', color: p.blue, delay: -4 },
    { label: 'Docker', color: p.blue, delay: -11 },
  ] })}</g>

  <g clip-path="url(#title-clip)">
    <use href="#title-word" y="10" fill="${p.violet}" opacity="${extrude[0]}"/>
    <use href="#title-word" y="7" fill="${p.violet}" opacity="${extrude[1]}"/>
    <use href="#title-word" y="4" fill="${p.blue}" opacity="${extrude[2]}"/>
    <use href="#title-word" fill="url(#title-grad)"${mode === 'dark' ? ' filter="url(#title-glow)"' : ''}/>
    ${mode === 'dark' ? `<g clip-path="url(#shine-clip)">
      <rect class="shine" x="430" y="34" width="110" height="110" fill="#ffffff" opacity="0" transform="rotate(18 485 89)"/>
    </g>` : ''}
  </g>

  <g class="mono" text-anchor="middle" font-size="11" letter-spacing="2.6" fill="${p.muted}">
    <circle cx="405" cy="30" r="3" fill="${p.lime}"/>
    <text x="600" y="34">OPEN FOR SELECTED PROJECTS · KENDAL, ID</text>
    <circle cx="795" cy="30" r="3" fill="${p.lime}"/>
  </g>

  <line x1="405" y1="151" x2="795" y2="151" stroke="url(#line-grad)" stroke-width="1.4"/>
  <g class="mono" text-anchor="middle" font-size="18" letter-spacing="2.2" fill="${p.ink}">
    <text class="sub sub-a" x="600" y="183">&lt; Full-Stack Developer /&gt;</text>
    <text class="sub sub-b" x="600" y="183">&lt; Open Source Enthusiast /&gt;</text>
    <text class="sub sub-c" x="600" y="183">&lt; Problem Solver /&gt;</text>
  </g>
  <rect class="blink" x="594" y="192" width="12" height="3" rx="1.5" fill="${p.cyan}" opacity="0.9"/>

  <g class="smil" opacity="0.7">
    <circle r="2.4" fill="${p.cyan}">
      <animateMotion dur="9s" repeatCount="indefinite" path="M140,330 C300,280 460,370 600,315 C760,255 930,340 1090,300"/>
    </circle>
    <circle r="1.8" fill="${p.magenta}">
      <animateMotion dur="12s" begin="-4s" repeatCount="indefinite" path="M1080,340 C900,300 760,380 620,330 C480,280 300,350 120,310"/>
    </circle>
  </g>

</g>`;

  const html = wrap({
    h: 420,
    title: 'Dika Glorya — full-stack developer',
    desc: 'Animated 3D hero with a rotating wireframe icosahedron, a synthwave perspective grid, parallax stars and orbiting technology orbs.',
    defs,
    css,
    body,
  });
  return html;
}

export function buildHero() {
  return {
    'hero-dark.svg': svgHero('dark'),
    'hero-light.svg': svgHero('light'),
  };
}

export { VALUES, TECHS };
