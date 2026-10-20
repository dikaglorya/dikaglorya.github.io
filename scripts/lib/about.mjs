/**
 * About scene: a floating 3D terminal with a soft extrusion, a blurred rear
 * pane for depth, typed code lines and a blinking prompt cursor.
 */
import { THEME } from './theme.mjs';
import { dropFilter, glowFilter, isoCube, lg, rg, softFilter, wrap } from './svg.mjs';

function codeLine(id, x, y, width, delay) {
  return {
    defs: `<clipPath id="${id}"><rect class="line-reveal" style="animation-delay:${delay}s" x="${x}" y="${y - 17}" width="${width}" height="27"/></clipPath>`,
  };
}

function svgAbout(mode) {
  const p = THEME[mode];
  const delay = [0.2, 0.45, 0.7, 0.95, 1.2, 1.45];
  const lines = [
    { y: 154, w: 520, parts: `<text x="342" y="154" font-size="16" fill="${p.lime}">$</text><text x="362" y="154" font-size="16" fill="${p.ink}">whoami</text>` },
    { y: 182, w: 520, parts: `<text x="342" y="182" font-size="16" fill="${p.cyan}">&gt;</text><text x="362" y="182" font-size="16" fill="${p.muted}">full-stack developer — kendal, id</text>` },
    { y: 218, w: 520, parts: `<text x="342" y="218" font-size="16" fill="${p.lime}">$</text><text x="362" y="218" font-size="16" fill="${p.ink}">cat focus.txt</text>` },
    { y: 246, w: 520, parts: `<text x="342" y="246" font-size="16" fill="${p.cyan}">&gt;</text><text x="362" y="246" font-size="16" fill="${p.muted}">developer tools · telegram bots · web apps</text>` },
    { y: 282, w: 520, parts: `<text x="342" y="282" font-size="16" fill="${p.lime}">$</text><text x="362" y="282" font-size="16" fill="${p.ink}">echo "open to collaboration"</text>` },
    { y: 310, w: 520, parts: `<text x="342" y="310" font-size="16" fill="${p.cyan}">&gt;</text><text x="362" y="310" font-size="16" fill="${p.lime}">available for selected projects</text>` },
  ];
  const defs = `
${lg('card-face', [[0, p.panelSoft], [0.5, p.card], [1, p.panel]], { x1: 0, y1: 0, x2: 0, y2: 1 })}
${lg('card-edge', [[0, p.cardEdge, 0.9], [0.6, p.line, 0.2], [1, p.cyan, 0.45]], { x1: 0, y1: 0, x2: 1, y2: 1 })}
${rg('about-aura-a', [[0, p.violet, mode === 'dark' ? 0.35 : 0.18], [1, p.violet, 0]])}
${rg('about-aura-b', [[0, p.cyan, mode === 'dark' ? 0.22 : 0.14], [1, p.cyan, 0]])}
${rg('scan-glow', [[0, p.cyan, 0], [0.5, p.cyan, 0.12], [1, p.cyan, 0]])}
${glowFilter('about-glow', p.cyan, 6, 1)}
${glowFilter('cube-glow', p.violet, 4, 1.2)}
${softFilter('about-blur', 14)}
${dropFilter('card-shadow', p.shadow, { dy: 26, std: 24, opacity: mode === 'dark' ? 0.7 : 0.35 })}
<clipPath id="card-clip"><rect x="300" y="66" width="600" height="288" rx="22"/></clipPath>
<clipPath id="cube-clip"><rect x="0" y="0" width="1200" height="430"/></clipPath>
${lines.map((line, i) => codeLine(`line-${i}`, 342, line.y, line.w, delay[i]).defs).join('\n')}`;

  const css = `
.line-reveal { transform-box: fill-box; transform-origin: left center; animation: typeLine 0.55s steps(18) both; }
@keyframes typeLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.caret { animation: caret 1.05s steps(1, end) infinite; }
@keyframes caret { 0%, 48% { opacity: 1; } 49%, 100% { opacity: 0; } }
.card-float { animation: cardFloat 8s ease-in-out infinite; }
@keyframes cardFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-9px) rotate(0.35deg); } }
.back-float { animation: backFloat 11s ease-in-out infinite; }
@keyframes backFloat { 0%, 100% { transform: translateY(5px) rotate(0deg); } 50% { transform: translateY(-6px) rotate(-0.5deg); } }
.cube-a { animation: cubeFloat 9s ease-in-out infinite; }
.cube-b { animation: cubeFloat 12s ease-in-out -4s infinite; }
@keyframes cubeFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
.scan { animation: scan 7s ease-in-out infinite; }
@keyframes scan { 0%, 100% { transform: translateY(0); opacity: 0; } 12% { opacity: 0.55; } 65% { opacity: 0.55; } 80% { transform: translateY(200px); opacity: 0; } }
`;
  const lineMarkup = lines
    .map((line, i) => `<g clip-path="url(#line-${i})" class="mono">${line.parts}</g>`)
    .join('\n');

  const body = `<g class="anim">
  <ellipse cx="290" cy="210" rx="300" ry="190" fill="url(#about-aura-a)"/>
  <ellipse cx="920" cy="260" rx="290" ry="180" fill="url(#about-aura-b)"/>
  <ellipse cx="600" cy="397" rx="290" ry="24" fill="${p.shadow}" opacity="${mode === 'dark' ? 0.55 : 0.2}" filter="url(#about-blur)"/>

  <g class="back-float" opacity="${mode === 'dark' ? 0.52 : 0.55}" filter="url(#about-blur)">
    <g transform="rotate(2.4 600 210)">
      <rect x="320" y="78" width="580" height="276" rx="22" fill="${p.panel}" stroke="${p.cardEdge}" stroke-opacity="0.35"/>
    </g>
  </g>

  <g class="cube-a">${isoCube(222, 150, 30, { top: p.violet, left: p.leftFace, right: p.rightFace, edge: p.violet, opacity: 0.8 })}</g>
  <g class="cube-b">${isoCube(982, 312, 22, { top: p.cyan, left: p.leftFace, right: p.rightFace, edge: p.cyan, opacity: 0.65 })}</g>

  <g class="card-float" transform="rotate(-1.4 600 210)">
    <rect x="306" y="80" width="600" height="288" rx="22" fill="${p.leftFace}" opacity="0.9"/>
    <rect x="300" y="66" width="600" height="288" rx="22" fill="url(#card-face)" stroke="url(#card-edge)" stroke-width="1.4" filter="url(#card-shadow)"/>
    <g clip-path="url(#card-clip)">
      <rect x="300" y="66" width="600" height="46" fill="${p.topFace}" opacity="0.72"/>
      <line x1="300" y1="112" x2="900" y2="112" stroke="${p.line}" stroke-opacity="0.75"/>
      <circle cx="328" cy="89" r="5.4" fill="${p.magenta}"/>
      <circle cx="348" cy="89" r="5.4" fill="${p.amber}"/>
      <circle cx="368" cy="89" r="5.4" fill="${p.lime}"/>
      <text class="mono" x="600" y="94" text-anchor="middle" font-size="12" letter-spacing="0.8" fill="${p.muted}">dika@kendal: ~/profile</text>
      <text class="mono" x="872" y="94" text-anchor="end" font-size="11" fill="${p.lime}">● main</text>

      <line x1="322" y1="132" x2="322" y2="334" stroke="${p.cyan}" stroke-opacity="0.25"/>
      ${lineMarkup}

      <g class="mono">
        <text x="342" y="334" font-size="16" fill="${p.lime}">$</text>
        <rect class="caret" x="362" y="320" width="9" height="17" rx="1.5" fill="${p.cyan}" opacity="0.9"/>
      </g>

      <rect class="scan" x="300" y="118" width="600" height="16" fill="url(#scan-glow)" opacity="0"/>
      <rect x="300" y="66" width="600" height="288" rx="22" fill="none" stroke="${p.ink}" stroke-opacity="0.04"/>
    </g>
  </g>

</g>`;

  return wrap({
    h: 430,
    title: 'About Dika Glorya — floating terminal',
    desc: 'A perspective-tilted 3D terminal card with typed command lines, a blinking cursor and floating wireframe cubes.',
    defs,
    css,
    body,
  });
}

export function buildAbout() {
  return {
    'about-3d-dark.svg': svgAbout('dark'),
    'about-3d-light.svg': svgAbout('light'),
  };
}
