# Liquid Glass system

The site uses progressive enhancement: semantic live HTML remains the content layer; CSS materials are the baseline; a single optional WebGL caustic layer decorates the homepage hero on capable desktop hardware. The glass never replaces page content with a screenshot.

## Quality profiles

The runtime publishes its selection on `html[data-glass-quality]`:

- `high`: fine-pointer desktop with strong CPU/memory signals. Enables pointer-driven rim lighting/very small card tilt and one low-power WebGL caustic canvas in the hero. That shader pauses offscreen and while the document is hidden; on browsers that expose Battery Status, it is skipped below 18% when discharging. Sustained frame rate below about 43 FPS removes the canvas and downgrades to `balanced`.
- `balanced`: CSS glass with moderate blur; no extra shader canvas.
- `eco`: reduced blur and saturation for mobile/coarse-pointer devices, low-memory/CPU hints, Save-Data/slow connections, or reduced-motion preference.
- `fallback`: opaque, no-backdrop-filter materials when reduced transparency is requested or the profile is forced.

The existing Three.js hero remains independently lazy-loaded under its desktop/fine-pointer/reduced-motion/Save-Data guards. The glass shader adds at most one further WebGL context, so the homepage uses no more than two contexts; no card creates its own context.

## Changing profiles

Temporary per-visit override: add `?glass=high`, `?glass=balanced`, `?glass=eco`, `?glass=fallback`, or `?glass=auto` to the URL. The override is bounded by the same accessibility and device guards: the glass shader is not enabled on mobile/coarse-pointer or when reduced motion is requested.

From DevTools, set a persistent choice with:

```js
window.obitoGlass.setProfile('balanced');
window.obitoGlass.getProfile();
window.obitoGlass.getQuality();
```

To return to automatic selection:

```js
window.obitoGlass.setProfile('auto');
```

Profiles are stored in `localStorage` as `obitoglory-glass-quality`. Private browsing without storage still uses auto mode.

## Customizing materials

The public tokens live in `src/styles/liquid-glass.css`:

- `--glass-opacity`: baseline material translucency.
- `--glass-blur`: backdrop blur radius (reduced on mobile/eco).
- `--glass-saturation`: backdrop color intensity.
- `--glass-border`, `--glass-highlight`: edge and specular-rim strength.
- `--glass-shadow`, `--glass-tint`, `--glass-tint-strong`: depth, tint and modal opacity.
- `--glass-radius`, `--glass-accent-glow`: corner scale and accent light.

Add new glass regions to the `surfaceSelector` in `src/scripts/liquid-glass.ts` only when they are discrete material surfaces; avoid applying backdrop blur to long text flows or entire page sections.

## Browser and accessibility behavior

CSS `backdrop-filter` uses the WebKit prefix and has a tinted-material fallback. The optional SVG displacement filter is only attached to the hero in engines that affirm support for `backdrop-filter: url()`; Safari/Firefox and unsupported engines use blur/saturation only. Inline SVG filters are decorative, never required for readable text. Motion and transparency preference changes are observed while the page is open as well as at startup.

`prefers-reduced-motion` disables the ambient animation, tilt, and shader. `prefers-reduced-transparency: reduce` switches to opaque material and disables filtering. Focus indicators retain a high-contrast outline; forced-colors mode falls back to system colors. On Android/mobile, blur is capped around 11–13px and no shader canvas is created.
