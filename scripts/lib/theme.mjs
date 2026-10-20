/**
 * Shared palette and type stacks for the profile README artwork.
 * Both modes carry the same semantic keys so every scene is generated twice.
 */
export const W = 1200;

export const SANS = "'Segoe UI', Ubuntu, 'Helvetica Neue', Arial, sans-serif";
export const MONO = "'Courier New', 'DejaVu Sans Mono', monospace";

export const THEME = {
  dark: {
    bgA: '#0a0f1f',
    bgB: '#0d1117',
    bgC: '#111b33',
    panel: '#0c1425',
    panelSoft: '#101a2e',
    ink: '#e6edf3',
    muted: '#93a1bd',
    faint: '#5b6a88',
    cyan: '#00f5ff',
    blue: '#38bdf8',
    violet: '#7c3aed',
    magenta: '#ff2bd6',
    lime: '#a3ff12',
    amber: '#fbbf24',
    line: '#233252',
    lineSoft: '#182440',
    glow: '#00f5ff',
    shadow: '#000000',
    grid: '#00f5ff',
    card: '#0b1322',
    cardEdge: '#2a3b5f',
    topFace: '#16223c',
    leftFace: '#0a1120',
    rightFace: '#101a2e',
    star: '#bfefff',
    ridge: '#00f5ff',
  },
  light: {
    bgA: '#ffffff',
    bgB: '#eef2ff',
    bgC: '#e3e9ff',
    panel: '#ffffff',
    panelSoft: '#f6f8ff',
    ink: '#1f2328',
    muted: '#57606a',
    faint: '#7b8494',
    cyan: '#0891b2',
    blue: '#0969da',
    violet: '#8250df',
    magenta: '#d1242f',
    lime: '#4d7c0f',
    amber: '#b45309',
    line: '#c7d2fe',
    lineSoft: '#dbe3ff',
    glow: '#0969da',
    shadow: '#22305a',
    grid: '#0969da',
    card: '#ffffff',
    cardEdge: '#d0d7de',
    topFace: '#eef2ff',
    leftFace: '#cbd5f5',
    rightFace: '#dde5ff',
    star: '#8250df',
    ridge: '#0969da',
  },
};

/** Reduced motion is handled in one place, at the end of every stylesheet. */
export const REDUCED_MOTION = `
@media (prefers-reduced-motion: reduce) {
  .anim, .anim * { animation: none !important; }
  .smil { display: none !important; }
  .orb-motion { display: none !important; }
  .orb-static { display: block !important; }
  .sub-b, .sub-c { opacity: 0 !important; }
  .sub-a { opacity: 1 !important; }
  .count:not(.count-final) { display: none !important; }
  .count-final { opacity: 1 !important; }
  .cf-first { opacity: 1 !important; }
  .tile, .tile-shadow, .bar-clip, .footer-fade, .thanks { animation: none !important; }
}
`;

export const BASE_CSS = () => `
text { font-family: ${SANS}; }
.mono { font-family: ${MONO}; }
.eyebrow { letter-spacing: 3.4px; }
`;
