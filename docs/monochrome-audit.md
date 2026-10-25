# Monochrome redesign and audit — 22 October 2026

Scope: the Astro site in this repository (`src/`), built to `dist/` and served at
`https://dikaglorya.github.io`. The second site referenced in older notes
(`dikaofc.devs.li`) has no source in this workspace and was not touched.

## What changed

### Design system

- One source of palette truth in `src/styles/tokens.css`: semantic tokens
  (`--background`, `--foreground`, `--surface`, `--surface-secondary`,
  `--surface-elevated`, `--text-primary|secondary|muted`, `--border`,
  `--separator`, `--focus-ring`, `--interactive*`, `--status-*`) plus the
  legacy aliases the older stylesheets already use, mapped onto them.
- Dark palette: page `#111111`, raised `#181818` / `#202020`, text
  `#F5F5F5` / `#A1A1A1` / `#939393`, border `#303030`, separator `#252525.
  Light palette: `#FFFFFF`, `#F7F7F7`, text `#171717` / `#5C5C5C` / `#666666`,
  border `#E5E5E5`, separator `#EFEFEF`.
- Control borders use a stronger token (`#666666` dark / `#8A8A8A` light) so
  input and button boundaries clear WCAG 1.4.11's 3:1 against their surfaces.
- Removed every shadow, gradient, backdrop blur and translucent material from
  the interface. Surfaces separate by a 1px border or one tonal step.
- Radii reduced to a 2/4/6/8/10/12px scale; pills remain fully rounded.
- Headings reduced to weight 620 with a tighter fluid scale; body copy stays at
  15–16px with 1.6 line height.
- The traffic-light dots in the request diagram, the portrait, and the brief
  email are all neutral now; semantics are carried by labels and icons.
- Deleted `global.css` (1,908 lines) and `app-pages-misc.css` (405 lines), both
  unimported legacy stylesheets that referenced tokens that no longer existed.

### Theme engine

- `:root` is dark; a light palette applies via `prefers-color-scheme: light`
  unless `[data-theme='dark']` is set, and `[data-theme='light']` always wins.
- Theme is resolved by a small inline `<head>` script before first paint; it
  reads the stored `theme` key, otherwise the OS preference. No flash in the
  dark-system/stored-light and light-system/stored-dark cases (verified).
- An icon button in the header (≥560px) and a labelled row in the mobile sheet
  (`[data-theme-toggle]`) switch the theme, update `aria-label`,
  `meta[name=theme-color]`, and store the choice. While no explicit choice is
  stored, the page follows later OS theme changes.
- All colours resolve through tokens; both themes share one stylesheet.

### Components and pages

- Header: opaque bar with a hairline that appears on scroll, flat nav capsule,
  flat icon buttons, no blur/shadow.
- Dialogs (search, mobile sheet, Quick Look): opaque elevated surface, 1px
  border, neutral scrim, reduced-motion-safe entrance.
- Cards, project rows, journal cards, stack tiles, spec tables, process steps
  and service rows: flat surface + border; hover is a tonal wash, not a lift.
- Buttons: secondary = hairline outline; primary = filled ink; no glow, no
  scale transforms; focus is a 2px outline in both themes.
- Form controls: solid fill, 3:1 border, visible focus outline, SVG chevron.
- The HTML brief generated for email is monochrome, shadow-free and uses the
  same neutral hierarchy.
- Legacy redirect pages use neutral system colours with a dark-mode media
  query instead of the old hardcoded dark/blue palette.

## Verification executed

All commands were run against the production build in this workspace.

| Command | Result |
| --- | --- |
| `npm run check` | 0 errors, 0 warnings (118 files; 22 hints come from older scratch scripts) |
| `npm run build` | 29 pages |
| `npm run test:status` | 16/16 pass |
| `npm run test:links` | 29 HTML files, 561 internal references, all resolve |
| `node scripts/a11y.mjs` | 10 pages × 3 viewports × 2 themes, axe WCAG 2.0/2.1/2.2 AA clean |
| `node scripts/audit-mono.mjs --theme=both` | 126 page/theme/viewport combinations, 0 findings (overflow, contrast, <11px text, <24px targets, duplicate ids, heading jumps, console errors) |
| `node scripts/qa-interactions.mjs` | search palette, keyboard order, no-JS rendering, reduced motion, header parity: pass |
| `node scripts/qa-flows.mjs` | theme toggle/persistence, mobile sheet focus + Escape, filters/URL state/empty state/grid, Quick Look, contact brief, journal TOC/progress/copy, monochrome invariants: pass |
| `npm audit --audit-level=high` | 0 high/critical; 2 moderate in the dev-only `satori → fflate` chain |

Layout checks: 320, 360, 390, 768, 1024, 1280 and 1440px wide, both themes.
No horizontal document overflow, no text below 11px, no target below
24×24 CSS px, no duplicate ids, no heading-level jumps, no console errors.

Theme checks: system dark, system light, stored dark over light system, stored
light over dark system, reload persistence, and mobile-sheet toggle. Background,
text, border and `theme-color` follow the active theme.

Monochrome checks: a computed-style sweep over `/`, `/projects/`, `/contact/`
and `/about/` in both themes finds no `box-shadow`, `backdrop-filter` or
gradient background. A pixel-chroma sample of the captured screenshots shows
0.3–1.8% average chroma (anti-aliasing and the small semantic status dots).

## Performance (lab)

Environment: local `astro preview`, headless Chromium, mobile emulation
390×844, 4× CPU slowdown, Slow 4G (1.6 Mbit down / 750 Kbit up, 150ms RTT).
Numbers are lab measurements, not real-user data.

| Route | FCP before → after | LCP before → after | CLS | TBT before → after |
| --- | --- | --- | --- | --- |
| `/` | 892 → 964ms | 1000 → 1052ms | 0 | 374 → 250ms |
| `/projects/` | 704 → 764ms | 704 → 764ms | 0 | 94 → 128ms |
| `/projects/dikaroute/` | 920 → 692ms | 920 → 692ms | 0 | 243 → 120ms |
| `/journal/` | 688 → 772ms | 688 → 772ms | 0 | 85 → 115ms |
| `/journal/small-static-portfolio-architecture/` | 744 → 664ms | 744 → 664ms | 0 | 111 → 40ms |
| `/about/` | 624 → 648ms | 624 → 648ms | 0 | 58 → 64ms |
| `/services/` | 764 → 880ms | 764 → 880ms | 0 | 143 → 192ms |
| `/contact/` | 936 → 792ms | 936 → 792ms | 0 | 186 → 133ms |

The spread on repeat runs is roughly ±100ms; no route regressed beyond that.
LCP stays under 1.7s on every route, CLS is 0. Home TBT (250ms) is above the
200ms budget used for this pass; INP itself was not instrumented. CSS grew from
46.6KB to 52.2KB raw (9.9KB gzipped) because of the theme and status layers;
per-page transfer stayed at the same 47–92KB bracket.

## Remaining risks and limitations

- No visual review by the agent: screenshots were captured under
  `.test-output/mono/` (gitignored) but the session cannot display images.
  Geometry, computed colour, contrast and chroma were checked numerically; a
  human should still look at the pages once.
- Another editing session was active in this same working tree during the pass
  (a status-registry subsystem landed mid-pass). It is included in the verified
  build, but the working tree should be reviewed as one diff before committing.
- GitHub Pages serves the meta CSP from the build; HTTP-only controls such as
  `frame-ancestors`, HSTS and `X-Content-Type-Options` cannot be set there.
  This is unchanged from before the pass.
- `npm audit` reports 2 moderate advisories in `fflate` via the dev-only
  `satori` asset generator; the suggested fix is a breaking satori downgrade, so
  it was not applied. The Pages workflow's gate is `--audit-level=high`.
- Root-level `_audit*.mjs`, `_probe*.mjs`, `scripts/tmp*` diagnostics from
  earlier sessions were removed before release; the reusable QA harness now
  lives in `scripts/`.
- The old `assets/` and `preview/` directories are not part of the Astro build
  and were not restyled. `assets/` stays because the README embeds those SVGs;
  the generated `preview/` PNGs were removed.
