/**
 * Section divider and footer landscape. Both are pure vector, and the footer
 * carries four parallax ridge layers plus a quiet closing line.
 */
import { THEME } from './theme.mjs';
import { glowFilter, lg, n, rg, starField, wrap } from './svg.mjs';

const DIVIDER_WAVE = 'M60,55 C180,20 300,90 420,55 C540,20 660,90 780,55 C900,20 1020,90 1140,55';

export function dividerSvg(mode = 'dark') {
  const p = THEME[mode];
  const defs = `
${lg('divider-line', [[0, p.cyan, 0], [0.16, p.cyan, 0.75], [0.5, p.violet, 0.55], [0.84, p.magenta, 0.7], [1, p.magenta, 0]], { x1: 0, y1: 0, x2: 1200, y2: 0, user: true })}
${lg('divider-wave', [[0, p.cyan, 0], [0.2, p.cyan, 0.9], [0.5, p.blue, 0.5], [0.8, p.magenta, 0.9], [1, p.magenta, 0]], { x1: 0, y1: 0, x2: 1200, y2: 0, user: true })}
${glowFilter('divider-glow', p.cyan, 4, 1.2)}
${glowFilter('divider-core', p.magenta, 3, 1)}`;

  const css = `
.dash { stroke-dasharray: 3 12; animation: dashFlow 5s linear infinite; }
@keyframes dashFlow { to { stroke-dashoffset: -90; } }
.tick { animation: tickPulse 3.6s ease-in-out infinite; }
@keyframes tickPulse { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.8; } }
.core { transform-box: fill-box; transform-origin: center; animation: coreSpin 14s linear infinite; }
@keyframes coreSpin { to { transform: rotate(360deg); } }
`;

  const ticks = Array.from({ length: 15 }, (_, i) => {
    const x = 120 + i * 68;
    const h = i % 2 === 0 ? 12 : 7;
    return `<line class="tick" style="animation-delay:${n(-i * 0.2, 1)}s" x1="${x}" y1="${55 - h / 2}" x2="${x}" y2="${55 + h / 2}" stroke="${p.cyan}" stroke-opacity="0.35" stroke-width="1"/>`;
  }).join('');

  const body = `<g class="anim">
  <line x1="40" y1="55" x2="1160" y2="55" stroke="url(#divider-line)" stroke-width="1.2"/>
  <path d="${DIVIDER_WAVE}" fill="none" stroke="url(#divider-wave)" stroke-width="1.6" filter="url(#divider-glow)" opacity="0.6"/>
  <path class="dash" d="${DIVIDER_WAVE}" fill="none" stroke="${p.cyan}" stroke-width="1.4" opacity="0.55"/>
  ${ticks}
  <g class="core" filter="url(#divider-core)">
    <rect x="592" y="47" width="16" height="16" rx="2" transform="rotate(45 600 55)" fill="${p.bgA}" stroke="${p.cyan}" stroke-width="1.4"/>
    <rect x="597" y="52" width="6" height="6" rx="1" transform="rotate(45 600 55)" fill="${p.magenta}"/>
  </g>
  <circle cx="40" cy="55" r="3" fill="${p.cyan}"/>
  <circle cx="1160" cy="55" r="3" fill="${p.magenta}"/>
  <g class="smil">
    <circle r="3" fill="${p.cyan}">
      <animateMotion dur="6s" repeatCount="indefinite" path="${DIVIDER_WAVE}"/>
      <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite"/>
    </circle>
    <circle r="2" fill="${p.magenta}">
      <animateMotion dur="8s" begin="-3.4s" repeatCount="indefinite" path="${DIVIDER_WAVE}"/>
      <animate attributeName="opacity" values="0;1;1;0" dur="8s" repeatCount="indefinite"/>
    </circle>
    <circle r="2" fill="${p.violet}">
      <animateMotion dur="10s" begin="-6.3s" repeatCount="indefinite" path="${DIVIDER_WAVE}"/>
      <animate attributeName="opacity" values="0;0.9;0.9;0" dur="10s" repeatCount="indefinite"/>
    </circle>
  </g>
</g>`;

  return wrap({
    h: 110,
    title: 'Animated section divider',
    desc: 'A glowing three-dimensional energy wave with travelling light pulses.',
    defs,
    css,
    body,
  });
}

function ridgePath(y, amp, phase, steps = 56) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const x = -100 + (i / steps) * 1400;
    const wave = Math.sin(x / 168 + phase) * amp + Math.sin(x / 71 + phase * 1.8) * amp * 0.34;
    points.push(`${n(x, 1)},${n(y + wave, 1)}`);
  }
  return `M-100,300 L${points.join(' L')} L1300,300 Z`;
}

export function footerSvg(mode) {
  const p = THEME[mode];
  const stars = starField({ seed: 77, count: 34, h: 190, color: p.star, minR: 0.4, maxR: 1.4, minO: 0.2, maxO: 0.75 });
  const layers = [
    { y: 196, amp: 22, phase: 0.4, fill: mode === 'dark' ? '#111c35' : '#e8edff', edge: p.blue, op: 0.75, klass: 'layer-a' },
    { y: 218, amp: 30, phase: 2.1, fill: mode === 'dark' ? '#0e172b' : '#dfe6ff', edge: p.violet, op: 0.65, klass: 'layer-b' },
    { y: 242, amp: 22, phase: 4.2, fill: mode === 'dark' ? '#0b1322' : '#d2dcff', edge: p.cyan, op: 0.75, klass: 'layer-c' },
    { y: 268, amp: 15, phase: 1.1, fill: mode === 'dark' ? '#080e1a' : '#c4d0fb', edge: p.magenta, op: 0.55, klass: 'layer-d' },
  ];

  const defs = `
${rg('footer-aura', [[0, p.violet, mode === 'dark' ? 0.34 : 0.14], [0.55, p.blue, 0.08], [1, p.bgB, 0]])}
${lg('thanks-grad', [[0, p.cyan], [0.5, p.ink], [1, p.violet]], { x1: 380, y1: 0, x2: 820, y2: 0, user: true })}
${lg('ridge-front', [[0, p.cyan, 0], [0.25, p.cyan, 0.55], [0.6, p.violet, 0.35], [1, p.magenta, 0.55]], { x1: 0, y1: 0, x2: 1200, y2: 0, user: true })}
${glowFilter('footer-glow', p.cyan, 4, 1)}
${stars.defs}`;

  const css = `
.thanks { animation: thanks 6.5s ease-in-out infinite; }
@keyframes thanks { 0%, 100% { opacity: 0.68; transform: translateY(1px); } 50% { opacity: 1; transform: translateY(-3px); } }
.layer-a { animation: driftA 19s ease-in-out infinite; }
.layer-b { animation: driftB 24s ease-in-out -4s infinite; }
.layer-c { animation: driftC 15s ease-in-out -7s infinite; }
.layer-d { animation: driftD 29s ease-in-out -2s infinite; }
@keyframes driftA { 0%, 100% { transform: translateX(-16px); } 50% { transform: translateX(16px); } }
@keyframes driftB { 0%, 100% { transform: translateX(20px); } 50% { transform: translateX(-20px); } }
@keyframes driftC { 0%, 100% { transform: translateX(-26px); } 50% { transform: translateX(10px); } }
@keyframes driftD { 0%, 100% { transform: translateX(12px); } 50% { transform: translateX(-18px); } }
.stars-far { animation: starDrift 120s linear infinite; }
@keyframes starDrift { to { transform: translateX(-1200px); } }
.twinkle { animation: twinkle 7s ease-in-out infinite; }
@keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.8; } }
.spark { animation: spark 4.2s ease-in-out infinite; }
@keyframes spark { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.9; } }
`;

  const body = `<g class="anim">
  <ellipse cx="600" cy="210" rx="620" ry="230" fill="url(#footer-aura)"/>
  <g class="stars-far" opacity="${mode === 'dark' ? 0.8 : 0.45}">${stars.body}</g>

  <g class="mono" text-anchor="middle" font-size="9.5" letter-spacing="3" fill="${p.muted}">
    <text x="600" y="34">EOF · THANKS FOR SCROLLING</text>
  </g>

  <text class="thanks" x="600" y="122" text-anchor="middle" font-size="36" font-weight="700" letter-spacing="-0.8" fill="url(#thanks-grad)">Thanks for visiting</text>
  <text x="600" y="150" text-anchor="middle" font-size="15" fill="${p.muted}">Build something useful. Then ship it.</text>

  ${layers.map((layer) => `<g class="${layer.klass}">
    <path d="${ridgePath(layer.y, layer.amp, layer.phase)}" fill="${layer.fill}" opacity="${layer.op}"/>
    <path d="${ridgePath(layer.y, layer.amp, layer.phase)}" fill="none" stroke="${layer.edge}" stroke-opacity="0.35" stroke-width="1.1"/>
  </g>`).join('\n')}

  <path d="${ridgePath(286, 12, 3.2)}" fill="none" stroke="url(#ridge-front)" stroke-width="1.6" filter="url(#footer-glow)" opacity="0.7"/>

  <g class="spark" style="animation-delay:-1.4s"><circle cx="214" cy="182" r="2.2" fill="${p.cyan}"/></g>
  <g class="spark" style="animation-delay:-2.9s"><circle cx="954" cy="166" r="1.8" fill="${p.magenta}"/></g>
  <g class="spark" style="animation-delay:-0.7s"><circle cx="736" cy="196" r="1.5" fill="${p.lime}"/></g>

  <g class="mono" text-anchor="middle" font-size="9" letter-spacing="2.4" fill="${p.muted}" opacity="0.9">
    <text x="600" y="286">© 2026 DIKA GLORYA · KENDAL, ID</text>
  </g>
</g>`;

  return wrap({
    h: 300,
    title: 'Footer — thanks for visiting',
    desc: 'Layered parallax mountain ridges with a closing thank-you message.',
    defs,
    css,
    body,
  });
}

export function buildDivider() {
  const dark = dividerSvg('dark');
  return {
    'divider.svg': dark,
    'divider-dark.svg': dark,
    'divider-light.svg': dividerSvg('light'),
  };
}

export function buildFooter() {
  return {
    'footer-dark.svg': footerSvg('dark'),
    'footer-light.svg': footerSvg('light'),
  };
}
