# DOTHIS.md — Complete Portfolio Build Instructions for ObitoGlory

> **Target**: Production-ready, cinematic 3D portfolio for **DikaGlorya (DikaOfc/DikaCode)** — independent developer from **Kendal, Jawa Tengah, Indonesia**.
> **Stack**: Astro 7 + TypeScript + Three.js (vanilla) + GSAP 3.15 + Lenis 1.3 + hand-rolled WebGL (no React, no R3F, no Tailwind).
> **Design System**: "Kendal Signal" — obsidian (#07080a), bone (#f2eee4), signal orange (#ff5a1f), electric blue rim (#3b5bff).
> **CSP**: Strict `'self'` only — all assets self-hosted, no CDN.
> **Deploy**: GitHub Pages (`dikaglorya.github.io`), canonical `https://obitoglory.tech` (when ready).

---

## 0. CONTEXT & CURRENT STATE

**Repo**: `/workspaces/dikaglorya.github.io` (Astro static site)
- Working tree has **uncommitted changes from previous session** (SEO, content, CSS refactor, new pages: kendal, privacy, cookie consent, robots/sitemap/rss, OG generator).
- **Wave 1 subagents** (SEO, content, CSS) already merged into tree.
- **Wave 2 subagents** (motion, WebGL hero, glass iOS, custom controls, asset explorer, asset researcher) were launched but **hit rate limits** on free model (`cbai/deepseek-v4.1-flash`) — their output files **do not exist yet**.
- **Assets downloaded manually** (see §4).

**What exists now**:
- `src/scripts/hero-scene.ts` — hand-rolled raymarched chrome blob (WebGL, no Three.js)
- `src/scripts/motion.ts` — vanilla IntersectionObserver reveals, split-text, parallax
- `src/scripts/ui.ts` — tilt cards, basic interactions
- `src/styles/tokens.css` — full design system (dark-first, light inversion)
- `src/styles/*.css` — base, chrome, components, home, pages, fonts
- `src/components/HeroScene.astro` — canvas + fallback
- `src/pages/index.astro` — hero, marquee, manifesto, work rail, featured, capabilities, about, journal, local-band, contact
- `src/data/site.ts` — identity, SEO, geo, social links
- `src/data/projects.ts`, `services.ts`, `facts.ts`, `articles.ts`, `navigation.ts`

---

## 1. STACK DECISIONS (LOCKED)

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Astro 7 (static)** | SEO, islands, CSP-friendly, fast |
| 3D Engine | **Three.js 0.186 (vanilla, npm)** | Asset explorer only; hero stays hand-rolled raymarch |
| Motion | **GSAP 3.15 + ScrollTrigger + Lenis 1.3** | Cinematic choreography, smooth scroll, zero CDN |
| Styling | **Custom CSS (Kendal Signal)** | Already mature, CSP-safe, no Tailwind migration |
| Fonts | **Inter Variable + Newsreader Variable + JetBrains Mono** (self-hosted via fontsource) |
| Icons | **Lucide** (bundled) |
| Assets | **Self-hosted in `/public`** — GLB, HDR, noise texture |
| No React | Avoids island overhead, keeps bundle tiny, CSP simple |
| No Theatre.js | GSAP timelines sufficient; add only if camera sequencing demanded |
| No Swup | Astro View Transitions API for page transitions (future) |

---

## 2. ASSETS — DOWNLOADED & READY

| File | Size | Source | License | Purpose |
|------|------|--------|---------|---------|
| `public/models/explorer-model.glb` | 3.7 MB | Khronos glTF Sample Models (DamagedHelmet) | CC0 / Public Domain | Asset Explorer fallback model |
| `public/hdr/royal_esplanade_1k.hdr` | 1.6 MB | Poly Haven | CC0 | Environment lighting for Asset Explorer |
| `public/textures/noise.png` | 197 KB | Three.js examples | MIT | Film grain / dither overlay |

**Manifest**: `public/asset-credits.md` (create with above table + URLs)

**Fallback**: If any asset fails to load, Asset Explorer uses procedural geometry (torus-knot + icosahedron + RoomEnvironment).

---

## 3. FILES CREATED MANUALLY (Wave 2 — CSS Layer)

All in `src/styles/`, ready to import:

| File | Purpose | Key Features |
|------|---------|--------------|
| `motion.css` | Cinematic intro, GSAP reveals, magnetic CTA, custom cursor, marquee velocity, counters | `.intro-layer`, `[data-reveal]`, `.char`, `.btn--magnetic`, `.cursor-dot/ring`, `.scroll-progress`, prefers-reduced-motion safe |
| `depth.css` | Pure CSS 3D depth on cards, glow, grain overlay, aurora bg | `.depth-container`, card hover 3D transform, `.grain-overlay`, `.aurora-bg`, focus rings |
| `glass.css` | iOS/macOS liquid glass (backdrop-filter), light mode, safe-area, DVH/SVH | `.glass-panel`, component patches (header, btn, work-card, cookieconsent, etc.), `@supports (-webkit-touch-callout)`, `prefers-reduced-transparency` |
| `controls.css` | **Kill every browser default** — scrollbar, selection, autofill, focus, form controls, dialog, progress, details, cursor hook | `::-webkit-scrollbar`, `::selection`, custom select/checkbox/radio/range/file/color, `details/summary`, `dialog::backdrop`, `html[data-cursor="on"]` |
| `explorer.css` | Asset Explorer UI — toolbar, HUD, loading, error, responsive | `.asset-explorer`, toolbar pills, HUD overlay, keyboard hints |

---

## 4. FILES TO CREATE — JAVASCRIPT MODULES

Create these **exactly** at paths below. Use vanilla TypeScript, import from `three`, `gsap`, `lenis` (all in `package.json`). Respect CSP `'self'`.

### 4.1 `src/scripts/cinematic.ts`
```ts
// Cinematic page-load intro (1.4–1.8s)
// - Appends .intro-layer to body on DOMContentLoaded
// - Sequence: dark screen → mono kicker → "DIKA GLORYA" per-char clip-path reveal → orange flash → curtain wedge up
// - sessionStorage guard (once per session)
// - Skip button (Enter/Esc), focus trap, no scroll lock >2s
// - Uses motion.css classes, var tokens from tokens.css
// - prefers-reduced-motion: skip entirely, show page immediately
export function initCinematicIntro(): Promise<void> { ... }
```

### 4.2 `src/scripts/motion.ts` — **REPLACE ENTIRE FILE**
Upgrade existing to use **Lenis + GSAP ScrollTrigger**:
```ts
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 1. LENIS INIT
const lenis = new Lenis({ duration: 1.1, wheelMultiplier: 1, smoothTouch: false })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)

// 2. REVEAL SYSTEM — replace IntersectionObserver with ScrollTrigger.batch
ScrollTrigger.batch('[data-reveal]', {
  start: 'top 85%',
  once: true,
  onEnter: (elements) => gsap.to(elements, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' })
})

// 3. SPLIT TEXT — keep existing initSplit, but drive via GSAP
//    .char stagger from translateY(100%) → 0

// 4. PARALLAX — keep data-parallax, drive via gsap.to on scroll

// 5. HORIZONTAL WORK RAIL — desktop only
if (window.matchMedia('(min-width: 900px) and (pointer: fine)').matches) {
  const rail = document.querySelector('.work-rail')
  if (rail) {
    gsap.to(rail, {
      x: () => -(rail.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: { trigger: rail, start: 'top top', end: 'bottom bottom', scrub: 0.8, pin: true, anticipatePin: 1 }
    })
  }
}

// 6. MARQUEE VELOCITY — read lenis.velocity(), adjust animation-duration
// 7. SCROLL PROGRESS BAR — .scroll-progress scaleX from 0→1
// 8. COUNTERS — .fact__value numeric count-up via gsap.to({ text: { value: target } })
// 9. MAGNETIC CTA — radius 90px, pointermove → gsap.to(btn, { x, y, scale: 1.04 })
// 10. CUSTOM CURSOR — dot + ring, blend-mode difference, hover grow, pointer:fine only

// Cleanup on pagehide: lenis.destroy(), ScrollTrigger.getAll().forEach(t => t.kill())
```

### 4.3 `src/scripts/hero-scene.ts` — **UPGRADE EXISTING**
Keep hand-rolled raymarch, **add** in same WebGL context:
- **Particle layer** (gl.POINTS): 1200–2200 pts, additive glow (orange/blue), drift + depth fog, pointer parallax
- **Blob morph via uScroll** (0–1): smin torus/core evolves shape as hero exits viewport
- **Pointer ripple**: `uRipple` vec3 on pointerdown → ring distortion on surface
- **Fade-in uFade 0→1** (2s), dither noise + vignette in shader
- **Responsive**: DPR cap 1.75, <560px particle count ↓, march steps 84→56
- **Pause** when `document.hidden` or hero offscreen (IntersectionObserver)
- **Fallback** (data-hero-fallback): CSS gradient chrome, no canvas

### 4.4 `src/scripts/asset-explorer.ts`
```ts
// Vanilla Three.js asset viewer (no React)
// Mount point: <canvas data-asset-explorer>
// Features:
// - Renderer: alpha, ACESFilmic, antialias, DPR cap 2
// - Scene: RoomEnvironment (three/examples/jsm/environments/RoomEnvironment.js)
// - Model: load /models/explorer-model.glb (GLTFLoader + DRACOLoader if needed)
//   Fallback: procedural torus-knot + icosahedron + ring (MeshStandardMaterial metalness 1 roughness 0.15)
// - HDRI: try /hdr/royal_esplanade_1k.hdr (RGBELoader) → else RoomEnvironment
// - Controls: OrbitControls (three/examples/jsm/controls/OrbitControls.js) + inertia damping
//   Touch: pinch zoom, drag rotate, double-tap reset
// - Material presets (toolbar): Chrome, Clay, Wireframe, Holo (shader inline)
// - Exploded view toggle (spring children offsets)
// - HUD: poly count, draw calls, FPS (renderer.info)
// - A11y: role="group" aria-label, keyboard arrows/+/-, prefers-reduced-motion disables auto-rotate
// - Pause when offscreen (IntersectionObserver) or document.hidden
// - Full dispose on pagehide
export function initAssetExplorer(): void { ... }
```

### 4.5 `src/scripts/ui.ts` — **PATCH EXISTING**
Add:
- `data-tilt` handler → set CSS vars `--tilt-x`, `--tilt-y` for depth.css 3D card effect
- Hook for `html[data-cursor="on"]` toggle (called from motion.ts)

---

## 5. ASTRO COMPONENT TO CREATE

### 5.1 `src/components/AssetExplorer.astro`
```astro
---
// Minimal wrapper — canvas + toolbar + HUD + loading/error slots
// Slots for: toolbar buttons (material presets), HUD items
// Uses explorer.css classes
---
<section class="asset-explorer" aria-label="Penjelajah model 3D">
  <div class="asset-explorer__canvas">
    <canvas data-asset-explorer aria-hidden="true"></canvas>
    <div class="asset-explorer__loading" aria-live="polite">
      <div class="asset-explorer__loading-spinner"></div>
      Memuat model…
    </div>
    <div class="asset-explorer__error" role="alert">
      <div class="asset-explorer__error-icon" aria-hidden="true">⚠</div>
      Model gagal dimuat. Menampilkan geometri prosedural.
    </div>
  </div>
  <div class="asset-explorer__toolbar" role="group" aria-label="Preset material">
    <button class="asset-explorer__btn" data-material="chrome" aria-pressed="true">Chrome</button>
    <button class="asset-explorer__btn" data-material="clay" aria-pressed="false">Clay</button>
    <button class="asset-explorer__btn" data-material="wireframe" aria-pressed="false">Wireframe</button>
    <button class="asset-explorer__btn" data-material="holo" aria-pressed="false">Holo</button>
    <button class="asset-explorer__btn" data-action="explode" aria-pressed="false">Explode</button>
    <button class="asset-explorer__btn" data-action="reset" aria-pressed="false">Reset</button>
  </div>
  <div class="asset-explorer__hud" aria-hidden="true">
    <span class="asset-explorer__hud-item"><span class="asset-explorer__hud-label">Triangles:</span><span class="asset-explorer__hud-value" data-hud="tris">—</span></span>
    <span class="asset-explorer__hud-item"><span class="asset-explorer__hud-label">Draw calls:</span><span class="asset-explorer__hud-value" data-hud="draw">—</span></span>
    <span class="asset-explorer__hud-item"><span class="asset-explorer__hud-label">FPS:</span><span class="asset-explorer__hud-value" data-hud="fps">—</span></span>
  </div>
  <span class="asset-explorer__hint">Drag ▸ rotasi • Scroll ▸ zoom • 2x tap ▸ reset</span>
</section>
```

---

## 6. INTEGRATION — EDIT THESE EXISTING FILES

### 6.1 `src/layouts/BaseLayout.astro`
**Add to `<head>` (after existing CSS imports, in this exact order):**
```astro
<link rel="stylesheet" href="/styles/tokens.css" />
<link rel="stylesheet" href="/styles/base.css" />
<link rel="stylesheet" href="/styles/chrome.css" />
<link rel="stylesheet" href="/styles/components.css" />
<link rel="stylesheet" href="/styles/home.css" />
<link rel="stylesheet" href="/styles/pages.css" />
<link rel="stylesheet" href="/styles/fonts.css" />
<!-- Wave 2 additions -->
<link rel="stylesheet" href="/styles/motion.css" />
<link rel="stylesheet" href="/styles/depth.css" />
<link rel="stylesheet" href="/styles/glass.css" />
<link rel="stylesheet" href="/styles/controls.css" />
<link rel="stylesheet" href="/styles/explorer.css" />
```

**Add before `</body>` (module script):**
```astro
<script type="module">
  import { initCinematicIntro } from '/scripts/cinematic.ts'
  import { initMotion } from '/scripts/motion.ts'
  import { initHeroScene } from '/scripts/hero-scene.ts'
  import { initAssetExplorer } from '/scripts/asset-explorer.ts'
  import { initUI } from '/scripts/ui.ts'

  // 1. Cinematic intro (blocks briefly)
  await initCinematicIntro()

  // 2. Init all systems
  initMotion()
  initHeroScene()
  initAssetExplorer()
  initUI()
</script>
```

### 6.2 `src/pages/index.astro`
**Add after featured project section (before journal):**
```astro
import AssetExplorer from '../components/AssetExplorer.astro'

<!-- ... existing sections ... -->

{featured && (
  <section class="section featured-project" aria-labelledby="featured-title">
    <!-- existing -->
  </section>
)}

<!-- NEW: 3D Asset Explorer -->
<section class="section" aria-labelledby="explorer-title">
  <div class="container">
    <SectionHead
      id="explorer-title"
      index="03 / Eksplorasi"
      title="Objek yang bisa disentuh."
      meta="Model 3D interaktif — ganti material, lihat wireframe, putar, ledakkan. Semua berjalan di browser."
    />
    <AssetExplorer />
  </div>
</section>

<!-- ... journal, local-band, contact ... -->
```

---

## 7. CONTENT & COPY POLISH (from previous session — verify done)

Check these files have been updated with **sharp, honest Indonesian copy** (no AI fluff):
- `src/pages/index.astro` — hero lead, manifesto, section metas, featured summary, about band, local-band
- `src/data/facts.ts` — numeric, credible facts only (no "5+ years" unless true)
- `src/data/projects.ts` — each project: `summary`, `features[]` (min 4), `tagline`, `stack[]`, `type`, `outcome` (measured impact), `problem` (1 sentence)
- `src/pages/about.astro` — journey narrative: identity → beliefs → activities → CTA
- `src/pages/contact.astro` — soft FAQ (scope, estimate, payment, Telegram comms)
- `src/pages/services.astro` — consistent with services data
- `src/pages/kendal.astro` — local SEO landing (already created)

---

## 8. SEO & DISCOVERABILITY (verify done in previous session)

- `BaseLayout.astro` — JSON-LD `Person` + `WebSite` + `ProfessionalService`, hreflang `id` + `x-default`, OG/Twitter cards, canonical
- `src/pages/robots.txt.ts` — sitemap ref, allow all important paths
- `src/pages/sitemap.xml.ts` — all routes + `lastmod` from content, hreflang alternates
- `src/pages/rss.xml.ts` — full HTML descriptions
- `public/humans.txt` — team block
- `public/llms.txt` — H1 + summary + tooling + key pages
- `scripts/generate-og.mjs` — OG image generator (already working)

**Keywords targeted**: "jasa pembuatan website Kendal", "web developer Kendal", "programmer Kendal", "jasa bot Telegram Kendal", "web design Kendal Jawa Tengah"

---

## 9. BUILD & QA CHECKLIST

Run **in order**:

```bash
cd /workspaces/dikaglorya.github.io

# 1. Type-check + build
npm run check && npm run build

# 2. If build passes — visual QA via Playwright (scripts exist)
npm run test:visual   # screenshots 375px (iPhone glass) + 1440px desktop

# 3. Accessibility
npm run test:a11y

# 4. Link check
npm run test:links

# 5. Performance audit
npm run test:perf
```

**Manual QA** (open `dist/` preview):
- [ ] Cinematic intro plays once, skip works, no scroll lock >2s
- [ ] Lenis smooth scroll feels natural, no jank
- [ ] GSAP reveals stagger smoothly, reduced-motion disables all
- [ ] Hero WebGL: particles, blob morph on scroll, ripple on click, fallback shows if WebGL fails
- [ ] Glass panels: header, btn, work-card, cookieconsent — iOS blur 24px, desktop 18px, light mode bone-glass
- [ ] Custom controls: scrollbar themed, selection orange, autofill no yellow, focus rings orange, select/checkbox/radio/range/file/color all custom
- [ ] Asset Explorer: loads GLB, OrbitControls work, toolbar switches materials, HUD shows stats, fallback procedural if GLB fails
- [ ] Mobile (375px): no custom cursor, glass lighter, rail vertical scroll, Asset Explorer 320px min height
- [ ] Dark/light toggle (if implemented) — glass adapts
- [ ] No console errors, no CSP violations

---

## 10. GIT COMMIT & PUSH

```bash
cd /workspaces/dikaglorya.github.io

git add -A
git commit -m "feat: premium 3D portfolio — cinematic intro, glass iOS, custom controls, GSAP/Lenis choreography, volumetric hero, asset explorer

- Cinematic page-load intro (1.4s) with per-char reveal + curtain
- GSAP 3.15 + Lenis 1.3 scroll choreography (reveals, parallax, horizontal rail, marquee velocity, counters)
- Hand-rolled WebGL hero upgraded: particle volume, scroll-morph blob, pointer ripple, dither grain
- Liquid glass system: iOS 24px blur, safe-area, DVH/SVH, light-mode bone glass, reduced-transparency fallback
- Custom controls: scrollbar, selection, autofill, focus, ALL form controls (select/checkbox/radio/range/file/color), details, dialog, progress
- Three.js Asset Explorer: DamagedHelmet GLB + Poly Haven HDR, material presets, explode view, HUD, keyboard nav
- Premium assets self-hosted (CC0): GLB 3.7MB, HDR 1.6MB, noise 197KB
- Kendal Signal design system polished: depth 3D cards, glow, grain overlay, aurora bg
- SEO: JSON-LD Person/Service, hreflang, OG, sitemap, robots, RSS, humans.txt, llms.txt
- Content: honest Indonesian copy, measurable outcomes, Kendal-local keywords"

git push origin main
```

---

## 11. POST-LAUNCH (outside repo)

- Submit `https://dikaglorya.github.io/sitemap.xml` to Google Search Console
- Verify `obitoglory.tech` in GSC when DNS switched
- Post case studies on LinkedIn, X, Instagram with `og-kendal-signal.png`
- Add `dikaglorya.github.io` to GitHub profile README
- Monitor Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)

---

## 12. SKILLS INSTALLED (available for any agent)

96 skills in `~/.config/opencode/skills/` — key ones for this project:
- `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`, `gsap-utils`
- `threejs-fundamentals`, `threejs-shaders`, `threejs-performance`, `threejs-loaders`, `threejs-materials`, `threejs-postprocessing`, `threejs-interaction`
- `motion-director`, `web-motion-auditor`, `site-motion-excellence-director`
- `lightweight-3d-effects`, `threejs-webgl`, `threejs-geometry`, `threejs-lighting`
- `blender-web-pipeline`, `threejs-asset-pipeline` (for future asset work)
- `animejs`, `motion-framer`, `react-spring-physics` (if React island added later)

Load with: `skill <id>` (e.g., `skill gsap-core`)

---

## 13. QUICK REF — FILE TREE (NEW/CHANGED)

```
src/
├── scripts/
│   ├── cinematic.ts          ← NEW
│   ├── motion.ts             ← REWRITE (Lenis + GSAP)
│   ├── hero-scene.ts         ← UPGRADE (particles, morph, ripple)
│   ├── asset-explorer.ts     ← NEW
│   └── ui.ts                 ← PATCH (tilt vars, cursor hook)
├── styles/
│   ├── motion.css            ← NEW
│   ├── depth.css             ← NEW
│   ├── glass.css             ← NEW
│   ├── controls.css          ← NEW
│   └── explorer.css          ← NEW
├── components/
│   └── AssetExplorer.astro   ← NEW
├── layouts/
│   └── BaseLayout.astro      ← EDIT (imports + module script)
└── pages/
    └── index.astro           ← EDIT (add AssetExplorer section)

public/
├── models/explorer-model.glb     (3.7 MB, CC0)
├── hdr/royal_esplanade_1k.hdr    (1.6 MB, CC0)
├── textures/noise.png            (197 KB, MIT)
└── asset-credits.md              ← CREATE (manifest table)
```

---

## 14. IF BUILD FAILS — COMMON FIXES

| Error | Fix |
|-------|-----|
| `three/examples/jsm/...` not found | Add `"type": "module"` to package.json (already), import with `.js` extension: `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'` |
| GSAP ScrollTrigger not registering | `gsap.registerPlugin(ScrollTrigger)` before use |
| Lenis + ScrollTrigger conflict | `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(...)` as in motion.ts |
| CSP violation on inline script | All JS in `BaseLayout` is `type="module"` — allowed by `'self'`; no inline event handlers |
| GLB not loading | Check `public/models/explorer-model.glb` exists, 3.7MB, binary glTF (magic bytes `glTF`) |
| HDR not loading | Poly Haven HDR may need `RGBELoader` + `DataTexture3D`; fallback to `RoomEnvironment` is fine |
| Fonts not loading | `@fontsource-variable/inter` etc. already in deps; import in `global.css` or `fonts.css` |

---

## 15. DONE — DEFINITION OF DONE

Portfolio is **launch-ready** when:
1. `npm run check && npm run build` ✅ zero errors
2. All QA checks in §9 pass
3. `git push origin main` ✅ deployed to GitHub Pages
4. Live at `https://dikaglorya.github.io` — cinematic intro plays, 3D hero alive, glass panels shimmer on iOS, custom controls everywhere, Asset Explorer interactive, no console errors, no CSP violations, LCP < 2.5s.

---

**Handoff note**: This document contains **everything needed** for another agent to complete the build. No external research required — all decisions locked, assets downloaded, CSS written, JS specs defined, integration points marked. Just execute §4–§6, run §9, commit §10.