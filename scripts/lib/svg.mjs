/**
 * SVG primitives shared by every scene: wrappers, gradients, filters,
 * deterministic star fields and the synthwave perspective floor.
 */
import { REDUCED_MOTION, BASE_CSS } from './theme.mjs';

export const n = (value, digits = 2) => {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? 0 : rounded;
};

export const esc = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function wrap({ w = 1200, h, title, desc, defs = '', css = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="svg-title svg-desc">
<title id="svg-title">${esc(title)}</title>
<desc id="svg-desc">${esc(desc)}</desc>
<defs>
${defs}
</defs>
<style><![CDATA[
${BASE_CSS()}
${css}
${REDUCED_MOTION}
]]></style>
${body}
</svg>
`;
}

export const stops = (items, indent = '    ') =>
  items
    .map(([offset, color, opacity]) => {
      const op = opacity === undefined ? '' : ` stop-opacity="${opacity}"`;
      return `${indent}<stop offset="${offset}" stop-color="${color}"${op}/>`;
    })
    .join('\n');

export function lg(id, items, { x1 = 0, y1 = 0, x2 = 0, y2 = 1, user = false } = {}) {
  const units = user ? ' gradientUnits="userSpaceOnUse"' : '';
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${units}>
${stops(items)}
  </linearGradient>`;
}

export function rg(id, items, { cx = '50%', cy = '50%', r = '60%', user = false } = {}) {
  const units = user ? ' gradientUnits="userSpaceOnUse"' : '';
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${units}>
${stops(items)}
  </radialGradient>`;
}

export function glowFilter(id, color, std = 5, extra = 1.8) {
  return `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="${std}" result="blur"/>
    <feFlood flood-color="${color}" flood-opacity="${extra}" result="tint"/>
    <feComposite in="tint" in2="blur" operator="in" result="glow"/>
    <feMerge>
      <feMergeNode in="glow"/>
      <feMergeNode in="glow"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>`;
}

export function softFilter(id, std = 12) {
  return `<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="${std}"/>
  </filter>`;
}

export function dropFilter(id, color, { dx = 0, dy = 18, std = 16, opacity = 0.55 } = {}) {
  return `<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${std}" flood-color="${color}" flood-opacity="${opacity}"/>
  </filter>`;
}

/** Deterministic PRNG so a build never jitters the composition. */
export function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function starGeometry({ count, h, seed, color, minR, maxR, minO, maxO, twinkle, w = 1200 }) {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const x = n(rand() * w, 1);
    const y = n(rand() * h, 1);
    const r = n(minR + rand() * (maxR - minR), 2);
    const o = n(minO + rand() * (maxO - minO), 2);
    if (twinkle && i % 4 === 0) {
      out.push(`<circle class="twinkle" style="animation-delay:${n(-rand() * 12, 2)}s" cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`);
    } else {
      out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`);
    }
  }
  return `<g id="stars-${seed}">\n${out.join('\n')}\n</g>`;
}

/** A 1200px tile repeated once; translate by -1200 for a seamless drift. */
export function starField({ seed, count, h, color, minR = 0.6, maxR = 1.8, minO = 0.25, maxO = 0.9, twinkle = true }) {
  return {
    defs: starGeometry({ count, h, seed, color, minR, maxR, minO, maxO, twinkle }),
    body: `<g>
  <use href="#stars-${seed}"/>
  <use href="#stars-${seed}" x="1200"/>
</g>`,
  };
}

export function gridFloor({
  horizon = 325,
  bottom = 420,
  color,
  glowColor,
  w = 1200,
  verticalCount = 22,
  horizontalCount = 9,
}) {
  const lines = [];
  const left = -1800;
  const right = 3000;
  const step = (right - left) / verticalCount;
  for (let i = 0; i <= verticalCount; i += 1) {
    const x = n(left + step * i, 1);
    lines.push(`<path d="M600,${horizon} L${x},${bottom}" stroke="url(#grid-fade)" stroke-width="1" opacity="0.55"/>`);
  }
  const rows = [];
  for (let i = 1; i <= horizontalCount; i += 1) {
    const t = i / horizontalCount;
    const y = n(horizon + (bottom - horizon) * Math.pow(t, 2.15), 2);
    rows.push(`<path d="M0,${y} H${w}" stroke="url(#grid-fade)" stroke-width="1" opacity="${n(0.18 + t * 0.5, 2)}"/>`);
  }
  return {
    defs: `<clipPath id="floor-clip"><rect x="0" y="${horizon}" width="${w}" height="${bottom - horizon}"/></clipPath>
${lg('grid-fade', [[0, color, 0], [0.32, color, 0.5], [1, color, 0.95]], { x1: 0, y1: horizon, x2: 0, y2: bottom, user: true })}`,
    body: `<g clip-path="url(#floor-clip)">
  <g class="grid-flow">${lines.join('')}</g>
  <g class="grid-rows">${rows.join('')}</g>
</g>
<rect x="0" y="${horizon - 3}" width="${w}" height="7" fill="${glowColor}" opacity="0.12" filter="url(#floor-glow)"/>
<rect x="0" y="${horizon}" width="${w}" height="1.4" fill="${glowColor}" opacity="0.62"/>`,
  };
}

export function isoCube(cx, cy, size, { top, left, right, edge, opacity = 1 }) {
  const s = size;
  return `<g opacity="${opacity}">
  <path d="M${cx},${cy - s} L${cx + s},${cy} L${cx},${cy + s} L${cx - s},${cy} Z" fill="${top}"/>
  <path d="M${cx - s},${cy} L${cx},${cy + s} L${cx},${cy + s * 1.85} L${cx - s},${cy + s * 0.85} Z" fill="${left}"/>
  <path d="M${cx + s},${cy} L${cx},${cy + s} L${cx},${cy + s * 1.85} L${cx + s},${cy + s * 0.85} Z" fill="${right}"/>
  <path d="M${cx},${cy - s} L${cx + s},${cy} L${cx},${cy + s} L${cx - s},${cy} Z M${cx - s},${cy} L${cx},${cy + s} L${cx},${cy + s * 1.85} L${cx - s},${cy + s * 0.85} Z M${cx + s},${cy} L${cx},${cy + s} L${cx},${cy + s * 1.85} L${cx + s},${cy + s * 0.85} Z" fill="none" stroke="${edge}" stroke-width="0.8" stroke-linejoin="round"/>
</g>`;
}

