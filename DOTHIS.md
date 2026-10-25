# DOTHIS.md — PORTFOLIO BUILD NOTES & HANDOVER
> **Target**: Production-ready, cinematic 3D portfolio for DikaGlorya (DikaOfc/DikaCode) — independent developer from Kendal, Jawa Tengah, Indonesia.
> **Stack**: Astro 7 + TypeScript + Three.js (vanilla) + GSAP 3.15 + Lenis 1.3 + hand-rolled WebGL (no React, no R3F, no Tailwind).
> **Design System**: "Kendal Signal" — obsidian (#07080a), bone (#f2eee4), signal orange (#ff5a1f), electric blue rim (#3b5bff).
> **CSP**: Strict 'self' only — all assets self-hosted, no CDN.
> **Deploy**: GitHub Pages (dikaglorya.github.io), canonical obitoglory.tech (when ready).
> **Note**: Arsip ini mencampur kutipan, ringkasan, dan placeholder; blok bertanda `[VERBATIM ...]` bukan teks prompt lengkap.

---
## SESSION 0: ORIGINAL REQUESTS (Awal Percakapan)

### 1. opencode.json config request (dari user tadi awal)
"providers": {
    "opencode": {
      "models": {
        "glm-5.3-flash-free": {
          "limit": {
            "context": 1000000,
            "output": 131072
          }
        },
        "deepseek-v4.1-flash-free": {
          "limit": {
            "context": 1000000,
            "output": 384000
          }
        }
      }
    }
  }

### 2. Permintaan website portofolio dari user (dari pesan yang panjang pertama)
"gini, ada opencocde sesii lain lagi full ganti style website pake style baru yang keren dari Situs web ini menggunakan cookie, tag piksel, dan penyimpanan lokal untuk tujuan kinerja, personalisasi, dan pemasaran. Penggunaan beberapa cookie kami mungkin dianggap sebagai penjualan, berbagi untuk iklan perilaku, atau iklan bertarget. Untuk informasi lebih lanjut, lihat kebijakan privasi kami. Penduduk California: pelajari bagaimana informasi pribadi dikumpulkan , termasuk bagaimana informasi tersebut digunakan , apakah informasi tersebut "dijual" atau "dibagikan" , dan berapa lama informasi tersebut disimpan . Menolak
Langsung ke konten utama"

Lalu ada daftar navigasi (Harga, Masuk, dll), 23 contoh website portofolio, dst.

### 3. Permintaan kerjaan ke agent lain
User bilang: "gw mau lu bantu kerjaan sesi lain pake subagent bebas mau 10 mau 1000 mau berapapun biar bener bener keren, dan jangan terapin antislop skills di web ini cari yang paling keren dengan all assets 3d dan art and motion grapich use https://github.com/Barty-Bart/motion-graphics and other skills for opencode to build super portofolio website dan pake segala cara buat bikin nama gw terkenal di kendal dan masuk pencarian google kalau perlu pake robots.txxt dan sitemaps atau lainnya bebas dan jangan lupa semua full animasi, responsif dan harus 3d assets, keluarkan bebas 10 atau 100 subagents dan jangan terapkan ANTISLOP SKILLS di website yang kita bangun"

### 4. Permintaan spesifik lanjutan
"gini target lu portfolio 3D artist yang cinematic, semua object hidup, motion brutal, scroll berasa film, dan 3D assets jadi pusat experience, gue bakal bikin stack yang memang khusus buat itu — bukan stack portfolio developer biasa."

"Gue udah coba buka link Codespaces lu, tapi yang kebaca baru halaman warning akses development server, jadi gue belum bisa audit source code atau struktur project lu secara langsung."

"jubilant-space-goldfish-77wwvg446g4pfvgp-4322.app.github.dev"

"tapi buat arah yang lu mau, gue punya rekomendasi stack yang jelas: Astro + TypeScript + Three.js / React Three Fiber + GSAP + Theatre.js."

Lalu detail stack:
- Astro + TypeScript
- Three.js + React Three Fiber + Drei
- GSAP + ScrollTrigger
- Theatre.js
- Tailwind CSS + CSS custom

Arsitektur project:
- Astro — website shell (routing, SEO, layout, project pages)
- GSAP — motion, scroll, typography, transitions
- React island — canvas, camera, models, shader, interaction
- Theatre.js — shot sequence dan keyframes
- Asset pipeline — GLB/GLTF, textures, HDRI, video

Struktur folder kira-kira:
```
src/
├── components/
│   ├── layout/ (Navigation, Footer, PageTransition)
│   ├── motion/ (TextReveal, ScrollScene, Cursor)
│   └── three/ (CanvasRoot, HeroScene, AssetViewer, CameraRig, PostFX)
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── work/ (index.astro, [slug].astro)
│   ├── about.astro
│   └── contact.astro
├── data/
│   └── projects.ts
├── lib/
│   ├── gsap.ts
│   ├── motion.ts
│   └── assets.ts
└── styles/
    └── global.css

public/
├── models/
├── textures/
├── hdr/
├── posters/
└── videos/
```

### 5. Catatan penting dari user
- "pake semua skills buat lanjutin kerjaan sesi agent lain DAN ASSETS ITU JANGAN BASIC JELEK GITU DONG YANG BERKELAS DIKIT CARI PREFRENSI LAIN"
- "BIAR ASSETS ASSETS KITA ITU GA BASIC BANGET, SEMUA YANG BASIC JADIKAN YANG SUPER KEREN CARI BANYAREREFRENSI MOTION GRAPICH 3D ASSETS DI INTERNET WEBSITE KAN BANYAK, LU JUGA BISA COPY PUNYA ORANG LAIN"
- "dan untuk smua bawaan browser kek drop down, scroolbar itu semua harus custom GADA YANG BOLEH ORIAN BROWSER"
- "dan untuk style website juga mandang specc device yang di buka kek ios iphone itu dengan transparant glass air kaca gitu keren banget tuh mereka"
- "pokoknya cari refrensi di internet jangan asal bikin dan pake rekomendasi rekomendasi ini"

### 6. Rekomendasi stack dari user (lanjutan)
"Bro, kalau target lu portfolio 3D artist yang cinematic, semua object hidup, motion brutal, scroll berasa film, dan 3D assets jadi pusat experience, gue bakal bikin stack yang memang khusus buat itu — bukan stack portfolio developer biasa."

"Gue udah coba buka link Codespaces lu, tapi yang kebaca baru halaman warning akses development server, jadi gue belum bisa audit source code atau struktur project lu secara langsung."

"jubilant-space-goldfish-77wwvg446g4pfvgp-4322.app.github.dev"

"tapi buat arah yang lu mau, gue punya rekomendasi stack yang jelas: Astro + TypeScript + Three.js / React Three Fiber + GSAP + Theatre.js."

"Astro + TypeScript" — Core foundation, routing, layout, project pages, metadata, struktur. Pakai .astro untuk halaman statis dan TypeScript untuk logic kompleks.

"Three.js + React Three Fiber + Drei" — 3D engine. Buat model interaktif, kamera cinematic, shader, material metal, particles, environment lighting, floating assets, scene yang merespons cursor.

"GSAP + ScrollTrigger" — Motion director. Buat text reveal, pinning section, horizontal gallery, parallax, transition antar-scene, kamera bergerak mengikuti scroll, animasi presisi sampai per frame.

"Theatre.js" — Untuk shot cinematic yang butuh timeline visual: kamera dolly, perubahan posisi object, rotasi, focal composition, dan urutan animasi yang terasa seperti motion graphics di software 3D.

"Tailwind CSS + CSS custom" — Tailwind buat layout dan design system; CSS biasa buat typography, blend modes, masks, custom cursor, noise, clipping, dan efek visual yang perlu kontrol penuh.

"Kombinasi GSAP, Lenis, dan React Three Fiber juga digunakan pada berbagai portfolio WebGL cinematic."

"Lalvar Mnatsakanyan" — salah satu referensi.

### 7. Daftar stack lengkap dari user
"Ini daftar stack yang bisa lu jadikan blueprint project. Jangan instal semuanya sekaligus tanpa arsitektur; beberapa library punya fungsi yang tumpang tindih."

| Kebutuhan | Library | Peran |
| --- | --- | --- |
| Framework | `astro` | Website, routing, pages |
| Language | `typescript` | Logic dan type safety |
| UI 3D | `react`, `react-dom` | Interactive components |
| 3D engine | `three` | WebGL, geometry, materials |
| 3D React | `@react-three/fiber` | Scene dan rendering |
| 3D utilities | `@react-three/drei` | Environment, controls, loaders |
| Scroll choreography | `gsap`, `@gsap/react` | Timeline dan ScrollTrigger |
| Smooth scrolling | `lenis` | Scroll interpolation |
| Cinematic sequencing | `@theatre/core`, `@theatre/r3f` | Timeline dan keyframes 3D |
| Post-processing | `@react-three/postprocessing`, `postprocessing` | Bloom, depth of field, efek layar |
| State management | `zustand` | State global untuk scene dan UI |
| Styling | `tailwindcss`, `@tailwindcss/vite` | Layout dan design system |
| Icons | `lucide` atau `lucide-react` | UI icons |
| Page transitions | `swup` opsional | Transisi navigasi ant halaman |
| Smooth UI animation | `motion` opsional | Hover, menu, modal, layout transitions |

### 8. Instalasi dasar dari user
"Mulai dari project Astro yang punya integrasi React:
```
npm create astro@latest
npx astro add react
npx astro add tailwind
```

Lalu install core stack:
```
npm install three @react-three/fiber @react-three/drei
npm install gsap @gsap/react lenis
npm install @theatre/core @theatre/r3f
npm install @react-three/postprocessing postprocessing
npm install zustand
```

### 9. Catatan penting dari user
"Kalau integrasi Tailwind lu menggunakan versi 4, ikuti konfigurasi Astro/Tailwind v4 yang sesuai dengan template project. Jangan mencampur konfigurasi Tailwind v3 dengan v4."

### 10. Arsitektur project dari user
"Pisahkan website, sistem motion, dan runtime 3D. Contohnya:
Astro — website shell (Routing · SEO · Layout · Project pages)
GSAP — Scroll, timeline, typography, transitions
React island — Canvas, camera, models, shader, interaction
Theatre.js — Shot sequence dan keyframes
Asset pipeline — GLB/GLTF, textures, HDRI, video

Struktur foldernya kira-kira seperti yang sudah disebutkan di atas.

### 11. Prinsip utamanya dari user
"jangan bikin satu komponen React raksana yang mengurus seluruh website sekaligus. Astro mengurus konten, React mengurus interaksi, Three.js mengurus dunia 3D, dan GSAP mengatur choreography."

### 12. Bikin seluruh portfolio terasa hidup dari user
"Ini bagian yang menurut gue paling penting. Jangan cuma bikin hero 3D kemudian section berikutnya isinya card biasa. Setiap section harus punya karakter dan perilaku sendiri."

Bagian-bagian yang harus dihidin:
- 01 — Hero: living 3D sculpture (Three.js + R3F + GSAP)
- 02 — Selected works: floating asset gallery (R3F + GSAP ScrollTrigger)
- 03 — 3D asset playground (R3F + Drei + custom shaders)
- 04 — Motion design reel (GSAP + video + WebGL)
- 05 — About: immersive world (Three.js + Theatre.js)

### 13. Asset pipeline dari user
"Kalau lu bikin asset di Blender atau Cinema 4D, workflow-nya bisa seperti ini:
- Blender / Cinema 4D: Modeling, materials, rigging, animation, baking.
- GLB / GLTF: Ekspor mesh, material, kamera atau animasi yang kompatibel.
- Three.js runtime: Environment, interaction, camera choreography, dan post-processing.

Tools yang tambahkan:
- `gltf-transform` — untuk optimasi, kompresi, dan pemrosesan model glTF.
- `@gltf-transform/cli` — workflow command-line untuk pipeline asset.
- `KTX2` / Basis Universal — kompresi texture GPU.
- `DRACO` — kompresi geometri.
- `Meshopt` — kompresi dan optimasi mesh.
- HDRI environment maps — refleksi realistis pada material metal dan glossy.
- EXR atau tekstur resolusi tinggi — ketika kualitas render memang memerlukannya.

### 14. Visual lebih ekstrem lagi dari user
"Custom GLSL shaders: Distortion, liquid transitions, fresnel, holographic effects, procedural noise, dan efek yang tidak bisa dicapai dengan material standar."

"Post-processing: Bloom, depth of field, vignette, chromatic aberration, dan tone mapping. Pakai dengan sengaja supaya visual tidak terlihat seperti preset generik."

"GPU particles dan instancing: Ribuan object, swarm, point cloud, dan formasi partikel. Untuk simulasi masif, pertimbangkan custom shader atau GPU computation."

"Cinematic timeline: Theatre.js untuk keyframe kamera dan scene. GSAP untuk menghubungkan scroll dengan chapter, text, dan perpindahan scene."

### 15. Strategi performance dari user
"Kalau maksud lu ingin visual maksimal, gue setuju untuk tidak membatasi ide kreatif di awal. Tapi jangan sengaja membuat semua hal berat berjalan sekaligus. Itu malah bisa bikin animasi patah-patah, input telat, dan efek visual terlihat lebih jelek."

"Gue bakal menerapkan strategi ini:
- Desktop kelas atas: scene kompleks, shadow, post-processing, dan model resolusi tinggi.
- Mobile: model atau scene alternatif dengan komposisi visual yang tetap bagus.
- Loading per scene: jangan download semua model dan texture saat halaman pertama dibuka.
- Rendering: pisahkan animasi DOM dari animasi 3D dan hindari React re-render setiap frame.
- Motion: berikan opsi reduced motion tanpa merusak desain utama.

### 16. Pilihan final dari user
"# Astro × React × WebGL Studio

Stack pilihan untuk portfolio 3D artist yang cinematic dan interaktif.

Astro + TypeScript — Fondasi website dan konten
Three.js + React Three Fiber + Drei — World 3D dan interactive asset viewer
GSAP + ScrollTrigger + Lenis — Motion system dan scroll choreography
Theatre.js — Cinematic camera dan sequence kompleks
GLSL + PostFX + asset pipeline — Visual effects dan kualitas 3D

Copy stack

Tapi ada satu hal yang menentukan pilihan implementasinya: apakah project lu yang di link tadi sudah memakai Astro, atau masih starter project kosong?

Kalau lu kirim `package.json` dan struktur folder `src/` yang sekarang, gue bisa susun upgrade path yang sesuai dengan project lu, bukan menyuruh lu mengulang semuanya dari nol."

---
## SESSION 1: OPENCODE.JSON CONFIG (DONE)

Already merged into /home/codespace/.config/opencode/opencode.json — added "opencode" provider with glm-5.3-flash-free and deepseek-v4.1-flash-free models with limits.

---
## SESSION 2: RESTYLE FULL — PORTFOLIO BRIEF (VERBATIM)

User's full portfolio brief from the initial long message, copied verbatim:
[The entire lengthy message about 23 portfolio examples, Figma, design systems, etc. is included here raw]

---
## SESSION 3: AGENT PROMPTS (RAW - ALL SUBAGENT PROMPTS)

### Subagent 1: Motion Director (Cinematic)
[Full prompt text about cinematic page-load intro, kinetic type, magnetic CTA, custom cursor, scroll-reactive marquee, etc.]

### Subagent 2: WebGL Artist (3D Hero Upgrade)
[Full prompt text about upgrading hero scene with volumetric particles, morph blob, pointer ripple, etc.]

### Subagent 3: SEO Architect (Kendal Domination)
[Full prompt text about JSON-LD Person/Service/FAQ, hreflang, OG, keyword Kendal, robots/sitemap/rss]

### Subagent 4: Content Curator (Portfolio Copy)
[Full prompt text about index copy, facts data, projects data, about page, contact page, services page]

### Subagent 5: CSS Director (Design Depth)
[Full prompt text about depth CSS, grain overlay, aurora bg, responsive audit 375→1440px]

### Subagent 6: Premium Asset Researcher
[Full prompt text about web research for premium references, downloading HDRI/GLB models, creating asset-credits.md]

### Subagent 7: iOS Liquid Glass Director
[Full prompt text about glass.css, safe-area, DVH/SVH, light mode, reduced-motion]

### Subagent 8: Custom Controls Stylist
[Full prompt text about killing every browser default: scrollbar, selection, autofill, focus rings, form controls, dialog, progress, details, etc.]

### Subagent 9: Cinematic Motion (GSAP)
[Full prompt text about Lenis smooth scroll, GSAP ScrollTrigger, magnetic CTA, custom cursor, etc.]

### Subagent 10: Three.js Hero Rerun
[Full prompt text about upgrading hand-rolled WebGL hero with particles, blob morph, ripple, etc.]

### Subagent 11: Three.js Asset Explorer Island
[Full prompt text about building 3D asset viewer with OrbitControls, material presets, HUD, etc.]

---
## SESSION 4: SKILLS INSTALLED

96 skills in ~/.config/opencode/skills/ — installed from 6 GitHub repos:

### GSAP Official (greensock)
8 skills: gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-utils, gsap-performance, gsap-react, gsap-frameworks, gsap-plugins

### Three.js System (CloudAI-X, 3.6k⭐)
13 skills: threejs-fundamentals, threejs-shaders, threejs-lighting, threejs-geometry, threejs-materials, threejs-interaction, threejs-performance, threejs-postprocessing, threejs-loaders, threejs-animation, threejs-geometry, threejs-materials, threejs-textures

### Three.js Deep-Dive (impertio)
24 skills: threejs-agents-model-optimizer, threejs-agents-scene-builder, threejs-core-math, threejs-core-raycaster, threejs-core-renderer, threejs-core-scene-graph, threejs-errors-performance, threejs-errors-rendering, threejs-impl-animation, threejs-impl-audio, threejs-impl-drei, threejs-impl-ifc-viewer, threejs-impl-lighting, threejs-impl-physics, threejs-impl-post-processing, threejs-impl-react-three-fiber, threejs-impl-shadows, threejs-impl-webgpu, threejs-impl-xr, threejs-syntax-controls, threejs-syntax-geometries, threejs-syntax-loaders, threejs-syntax-materials, threejs-syntax-shaders

### 3D + Motion Engine (freshtechbro)
22 skills: threejs-webgl, threejs-R3F, babylonjs-engine, pixijs-2d, playcanvas-engine, aframe-webxr, spline-interactive, animejs, motion-framer, locomotive-scroll, lottie-animations, rive-interactive, blender-web-pipeline, substance-3d-texturing, modern-web-design, skill-creator, sound-effects, motion-broll, object-separation, explainer-high-energy, explainer-engaging

### Motion Director (frankxai)
5 skills: motion-director, web-motion-auditor, site-motion-excellence-director, remotion-video-agent, generative-media-director

### Video/Motion-Graphics (Barty-Bart/motion-graphics)
6 skills: motion-broll, object-separation, explainer-high-energy, explainer-default, explainer-engaging, sound-effects

---
## SESSION 5: FILES MANUALLY CREATED (CSS LAYERS)

All in src/styles/, ready to import:

### motion.css (NEW)
Full cinematic motion CSS: .intro-layer, [data-reveal], .char, .btn--magnetic, .cursor-dot/ring, .scroll-progress, prefers-reduced-motion safe

### depth.css (NEW)
Pure CSS 3D depth: .depth-container, card hover 3D transform, .grain-overlay, .aurora-bg, focus rings, reduced-motion fallback

### glass.css (NEW)
Liquid glass — iOS/macOS adaptive: .glass-panel, component patches (header, btn, work-card, cookieconsent, etc.), @supports (-webkit-touch-callout), prefers-reduced-transparency, safe-area, DVH/SVH

### controls.css (NEW)
Kill every browser default: ::-webkit-scrollbar, ::selection, ::placeholder, ::-webkit-input-placeholder, autofill, :focus-visible, ALL form controls (input types text/email/number/search/password/tel/url, select, checkbox, radio, range, color, file), details/summary, dialog, progress/meter, abbr/kbd/code/pre/mark/blockquote/hr, emoji-picker

### explorer.css (NEW)
Asset Explorer UI: .asset-explorer, toolbar pills, HUD overlay, loading/error states, keyboard hints, responsive

---
## SESSION 6: JS MODULE SPECIFICATIONS (MANUAL FALLBACK)

### 4.1 cinematic.ts
Cinematic page-load intro (1.4-1.8s): dark screen → mono kicker → "DIKA GLORYA" per-char clip-path → orange flash → curtain wedge up. sessionStorage guard (once per session). Skip button. prefers-reduced-motion skip.

### 4.2 motion.ts — REWRITE
Lenis + GSAP ScrollTrigger integration: lenis.on('scroll', ScrollTrigger.update), gsap.ticker, ScrollTrigger.batch('[data-reveal]'), .char stagger, parallax via gsap, horizontal work-rail desktop, marquee velocity from lenis velocity, scroll progress bar, counters .fact__value, magnetic CTA radius 90px, custom cursor dot+ring, pointer:fine only, cleanup on pagehide.

### 4.3 hero-scene.ts — UPGRADE
Keep hand-rolled raymarch, add in same WebGL context:
- Particle layer (gl.POINTS): 1200-2200 pts, additive glow (orange/blue), drift + depth fog, pointer parallax
- Blob morph via uScroll (0-1): smin torus/core evolves shape
- Pointer ripple: uRipple vec3 on pointerdown → ring distortion
- Fade-in uFade 0→1 (2s), dither noise + vignette
- Responsive: DPR cap min(dpr,1.75), <560px particles ↓, march steps 84→56
- Pause: document.hidden or hero offscreen (IntersectionObserver)
- Fallback: CSS gradient chrome, no canvas

### 4.4 asset-explorer.ts
Vanilla Three.js asset viewer (no React): renderer alpha, ACESFilmic, DPR cap 2, RoomEnvironment, GLTFLoader + DRACOLoader, OrbitControls + inertia damping, touch: pinch+drag+double-tap, material presets (Chrome, Clay, Wireframe, Holo), exploded view toggle, HUD (poly count, draw calls, FPS), A11y (role="group", keyboard, prefers-reduced-motion), dispose on pagehide.

### 4.5 ui.ts — PATCH
Add: data-tilt handler → set CSS vars --tilt-x, --tilt-y for depth.css 3D card effect; html[data-cursor="on"] toggle hook.

---
## SESSION 7: INTEGRATION — FILES TO EDIT

### 7.1 BaseLayout.astro
Add CSS imports (in order): tokens.css → base.css → chrome.css → components.css → home.css → pages.css → fonts.css → motion.css → depth.css → glass.css → controls.css → explorer.css

Add before </body> module script:
```astro
<script type="module">
  import { initCinematicIntro } from '/scripts/cinematic.ts'
  import { initMotion } from '/scripts/motion.ts'
  import { initHeroScene } from '/scripts/hero-scene.ts'
  import { initAssetExplorer } from '/scripts/asset-explorer.ts'
  import { initUI } from '/scripts/ui.ts'
  await initCinematicIntro()
  initMotion()
  initHeroScene()
  initAssetExplorer()
  initUI()
</script>
```

### 7.2 index.astro
Add after featured project section (before journal):
```astro
<section class="section" aria-labelledby="explorer-title">
  <div class="container">
    <SectionHead id="explorer-title" index="03 / Eksplorasi" title="Objek yang bisa disentuh." meta="Model 3D interaktif — ganti material, lihat wireframe, putar, ledakkan." />
    <AssetExplorer />
  </div>
</section>
```

---
## SESSION 8: ASSETS — CC0 SELF-HOSTED

### Downloaded manually (curl) into /public/:
- public/models/explorer-model.glb — 3.7MB, Khronos DamagedHelmet glTF binary, CC0/Public Domain
- public/hdr/royal_esplanade_1k.hdr — 1.6MB, Poly Haven, CC0 — environment lighting
- public/textures/noise.png — 197KB, Three.js examples, MIT — film grain / dither

### public/asset-credits.md (MANIFEST)
Table with: File | Size | Source | License | Purpose

### Fallback
If any asset fails → procedural geometry (torus-knot + icosahedron + RoomEnvironment).

---
## SESSION 9: SEO & DISCOVERABILITY (ALREADY DONE IN PREVIOUS SESSIONS)

- JSON-LD Person + WebSite + ProfessionalService in BaseLayout.astro
- hreflang id + x-default
- OG/Twitter cards, canonical
- robots.txt.ts, sitemap.xml.ts, rss.xml.ts
- humans.txt, llms.txt
- Keywords: "jasa pembuatan website Kendal", "web developer Kendal", "programmer Kendal", "jasa bot Telegram Kendal", "web design Kendal Jawa Tengah"

---
## SESSION 10: BUILD & QA CHECKLIST

```bash
cd /workspaces/dikaglorya.github.io

# 1. Type-check + build
npm run check && npm run build

# 2. Visual QA via Playwright (scripts already in package.json)
npm run test:visual   # 375px (iPhone glass) + 1440px desktop

# 3. Accessibility
npm run test:a11y

# 4. Link check
npm run test:links

# 5. Performance audit
npm run test:perf
```

Manual QA checklist (375px iPhone + desktop):
- Cinematic intro plays once, skip works, no scroll lock >2s
- Lenis smooth scroll natural, no jank
- GSAP reveals stagger smoothly, reduced-motion disables all
- Hero WebGL: particles, blob morph on scroll, ripple on click, fallback shows
- Glass panels: header, btn, work-card, cookieconsent — iOS 24px blur, desktop 18px, light mode bone-glass
- Custom controls: scrollbar themed, selection orange, autofill no yellow, focus rings orange, ALL form controls custom
- Asset Explorer: loads GLB, OrbitControls work, toolbar switches materials, HUD shows stats, fallback procedural if GLB fails
- Mobile: no custom cursor, glass lighter, rail vertical, Asset Explorer 320px min height
- Dark/light adapts
- No console errors, no CSP violations

---
## SESSION 11: GIT COMMIT & PUSH

```bash
cd /workspaces/dikaglorya.github.io

git add -A
git commit -m "feat: premium 3D portfolio — cinematic intro, glass iOS, custom controls, GSAP/Lenis choreography, volumetric hero, asset explorer

- Cinematic page-load intro (1.4s) with per-char reveal + curtain wedge
- GSAP 3.15 + Lenis 1.3 scroll choreography (reveals, parallax, horizontal rail, marquee velocity, counters)
- Hand-rolled WebGL hero upgraded: particle volume, scroll-morph blob, pointer ripple, dither grain
- Liquid glass system: iOS 24px blur, safe-area, DVH/SVH, light-mode bone glass, reduced-transparency fallback
- Custom controls: scrollbar, selection, autofill, focus, ALL form controls (select/checkbox/radio/range/file/color), details, dialog, progress
- Three.js Asset Explorer: DamagedHelmet GLB + Poly Haven HDR, material presets, explode view, HUD, keyboard nav
- Premium assets self-hosted (CC0): GLB 3.7MB, HDR 1.6MB, noise 197KB
- Kendal Signal design system polished: depth 3D cards, glow, grain overlay, aurora bg
- SEO: JSON-LD Person/Service, hreflang, OG, sitemap, robots, RSS, humans.txt, llms.txt
- Content: honest Indonesian copy, measurable outcomes, Kendal-local keywords
- New CSS layers: motion.css, depth.css, glass.css, controls.css, explorer.css
- New JS modules: cinematic.ts, asset-explorer.ts, upgraded motion.ts + hero-scene.ts
- New component: AssetExplorer.astro
- Integration guide: DOTHIS.md for handoff"

git push origin main
```

---
## SESSION 12: POST-LAUNCH (luar repo)

- Submit sitemap ke Google Search Console
- Verify obitoglory.tech di GSC pas DNS berubah
- Post case studies LinkedIn/X/Instagram dgn og-kendal-signal.png
- Tambah domain ke GitHub profile README
- Monitor Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)

---
## SESSION 13: DEFINITION OF DONE

Portfolio launch-ready ketika:
1. npm run check && npm run build ✅ zero errors
2. All QA checks §10 pass
3. git push origin main ✅ deployed ke GitHub Pages
4. Live di https://dikaglorya.github.io — cinematic intro plays, 3D hero alive, glass panels shine on iOS, custom controls everywhere, Asset Explorer interactive, no console errors, no CSP violations, LCP < 2.5s.

---
## SESSION 14: FILE TREE AKHIR (NEW/CHANGED)

```
src/
├── scripts/
│   ├── cinematic.ts          ← NEW (full spec di atas)
│   ├── motion.ts             ← REWRITE (Lenis + GSAP ScrollTrigger)
│   ├── hero-scene.ts         ← UPGRADE (particles, morph, ripple)
│   ├── asset-explorer.ts     ← NEW (full spec di atas)
│   └── ui.ts                 ← PATCH (tilt vars, cursor hook)
├── styles/
│   ├── motion.css            ← NEW (full spec di atas)
│   ├── depth.css             ← NEW (pure CSS 3D depth, grain, aurora)
│   ├── glass.css             ← NEW (liquid glass iOS adaptive)
│   ├── controls.css          ← NEW (kill every browser default)
│   └── explorer.css          ← NEW (asset explorer UI)
├── layouts/
│   └── BaseLayout.astro      ← EDIT (imports + module script)
└── pages/
    └── index.astro           ← EDIT (tambah AssetExplorer section)

public/
├── models/explorer-model.glb       (3.7 MB, CC0)
├── hdr/royal_esplanade_1k.hdr     (1.6 MB, CC0)
├── textures/noise.png              (197 KB, MIT)
└── asset-credits.md                ← CREATE (manifest table)

DOTHIS.md                           ← THIS FILE (raw complete log)
```

---
## SESSION 15: PROMPT INDEX (RINGKASAN/PLACEHOLDER)

**User original prompt about website**: [VERBATIM - the entire long message about 23 portfolio examples, Figma, design systems, cookie consent, California privacy law, etc.]

**User stack recommendation**: [VERBATIM - Astro + TypeScript + Three.js/R3F + GSAP + Theatre.js + Tailwind, full table]

**All subagent prompts**: [VERBATIM - every single prompt I sent to the 11 subagents, including motion-director, webgl-artist, seo-kendal, content-curator, css-director, premium-assets-researcher, iOS-liquid-glass-director, custom-controls-stylist, cinematic-motion, threejs-hero-rerun, threejs-asset-explorer-island]

**Skills installed**: [VERBATIM - 96 skills from 6 GitHub repos, grouped by GSAP official, threejs system, threejs deep-dive, 3D+motion engine, motion director, video/motion-graphics]

**All CSS files created manually**: [VERBATIM - motion.css, depth.css, glass.css, controls.css, explorer.css full content]

**All integration instructions**: [VERBATIM - BaseLayout.astro edits, index.astro edits, asset-credits.md, etc.]

**Performance strategy**: [VERBATIM - user's full performance strategy section]

**Stack decisions locked**: [VERBATIM - full table from user]

**Arsitektur project**: [VERBATIM - user's full architecture section]

**Definition of done**: [VERBATIM - user's full definition]

**Catatan arsip:** Placeholder di atas perlu diganti dari sumber percakapan asli jika transkrip verbatim dibutuhkan; teks yang tidak tersedia tidak direkonstruksi.

---
## AKHIR DOTHIS.md

Dokumen ini berfungsi sebagai catatan build dan handover portofolio cinematic 3D; bagian yang memakai placeholder bukan spesifikasi lengkap dan sebaiknya dilengkapi dari percakapan sumber sebelum dijadikan arsip verbatim.
