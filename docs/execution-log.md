# Execution log — autonomous QA pass

Scope: `dikaglorya.github.io` (ObitoGlory, this repository, served at https://dikaglorya.github.io).
The second site (dikaofc.devs.li) had no available source in this workspace, so it was not modified.

Order of work, by priority (broken functionality → Android → desktop → system → motion):
1. Inspected the repo, ran `astro check`, `astro build`, `check-links`, `a11y` and a
   DOM/computed-style audit (contrast, overflow, tiny text, tap targets, duplicate ids)
   at 390×844 and 1440×900.
2. Fixed the defects the audit found (see below), re-ran every check.
3. Captured full-page screenshots before/after in `_master_shots/` and reviewed geometry
   through measurements (this agent cannot view images directly; layout was verified with
   DOM measurements: section gaps, overflow, contrast, target sizes, full-page height).

## Changes

| Area | Change | Reason |
| --- | --- | --- |
| Contact (`/contact/`) | Whole row is now the link (`.channel-list__row`, ≥48px) | Tap targets were 24–28px tall |
| Projects list | Explicit "Pratinjau" Quick Look button per row | Quick Look previously opened on Space and on a 500 ms touch-hold, which duplicated the link and stole scrolling/tapping on Android |
| Projects list | Status label per project (`Rilis / Eksperimen / Sedang dikerjakan / Arsip`) | Credibility: completed vs experimental work is now distinguishable without adding claims |
| Projects list | `?q=` search is part of the URL; "Tampilkan semua" clears search too | Shareable filtered state; empty state used to stay empty after reset |
| Project detail | Status shown in the hero and spec table | Same status information as the list |
| Project detail | External project links get a 32px hit area | 17px-high links |
| Project data | Old portfolio renamed "Portofolio v1", copy corrected | The name `dikaofc.github.io` now belongs to this site; the description mixed up "one file" and "multi-page" |
| Layout rhythm | Sections that follow a section use `0.62×` top padding; paper bands keep full padding; section-head gap 48→32px | Desktop seams measured ~200px of air between sections; the homepage was 5.1k px tall for 6 sections |
| Styling | Status/peek type raised to `--fs-micro` (12px), archived label loses the 0.75 opacity | Text under 11px failed the tiny-text audit; opacity dropped contrast to 3.32:1 (caught by axe) |

Not changed: architecture, deployment workflow, CSP, design tokens, motion system, hero scene.

## Verification actually executed

- `npm run check` — 0 errors, 0 warnings
- `npx astro build` — 29 pages
- `npm run test:links` — 29 files, 542 internal references
- `node scripts/a11y.mjs` — 10 pages × 3 viewports, axe clean
- `_master_audit.mjs` — 7 routes × 2 viewports: 0 horizontal overflow, 0 contrast failures, 0 undersized targets outside header/footer
- `_master_tasks.mjs` — 16/16 real-task checks (CTA → projects, filter, filter survives reload,
  Quick Look open/close by touch and keyboard, Escape, back navigation returns to the filtered
  list, 48px contact rows, skip link first tab stop, empty-state reset, reduced motion, in-page anchors)
- `_master_qa.mjs` — console errors 0, failed requests 0 on `/`, `/projects/`, `/contact/`

## Known limitations (not hidden)

- **No visual review possible from this agent**: screenshots are captured (`_master_shots/`),
  but this session cannot display images, so art direction was checked through measurements and
  markup, not by eye. A human should open the PNGs once.
- **Not committed / deployed**: changes are in the working tree; the GitHub Pages workflow runs on
  push to `main`, so they are not live until committed and pushed. The working tree also contains
  unrelated uncommitted work from earlier sessions; this pass did not stage or revert any of it.
- **Second site (dikaofc.devs.li)**: source is not in this workspace, so it was not audited or
  changed. Its identity cannot be compared side by side here.
- **Quick Look** is a metadata preview, not a screenshot preview: there are no project screenshots
  to show, and none were fabricated.

---

# Pass 2 — status system (prompt sections 12–15)

Scope: consolidate the design prompt into `docs/design-prompt.md`, then implement the typed status
system it specifies (sections 12–15) in the Astro site.

## Prompt document

`docs/design-prompt.md` (2 870 lines) is the recovered 1–27 master prompt followed by
"PART II — STATUS SYSTEM ADDENDUM" and the four new sections at their original line positions:

| Section | Line | Contents |
| --- | --- | --- |
| 12. CONCRETE COMPONENT TOKEN MAP | 1791 | Component → token table |
| 13. SEMANTIC STATUS COLOR SYSTEM | 1988 | Meaning → variant mapping |
| 14. ACCESSIBLE STATUS ICON MAPPINGS | 2151 | Icon-per-state table |
| 15. COMPLETE TYPED STATUS REGISTRY | 2346 | Typed registry spec, fallback, tests |

A precedence note in the Part II preamble settles conflicts: Part II wins over Part I for status
surfaces, and the zero-shadow rule applies everywhere. The original `# FINAL DIRECTIVE` still closes
the file.

Verbatim check: sections 12, 13, and 14 match the supplied text exactly. Section 15 matches for its
full 11 622 characters; the only thing dropped is the trailing block of `⋮⋮` filler characters that
sat after the last line of the pasted source (a copy artifact, not content).

## Implementation

| Area | Change | Reason |
| --- | --- | --- |
| `src/lib/status-registry.ts` | 6 variants × 36 states, `STATUS_REGISTRY` as `satisfies Record<StatusState, …>`, `resolveStatus` falls back to neutral `unknown` | Section 15: one typed source of truth, no untyped string literals, safe fallback |
| `src/components/StatusIndicator.astro` | The only renderer. Lucide `IconNode` → inline SVG with `aria-hidden="true"`; registry label in text; `data-status` / `data-variant` for styling hooks | Colour must never be the only cue; screen readers get the label, not the glyph |
| `src/styles/status.css` | Flat variant styling from `--status-*` tokens, dashed border for archived, spin scoped to `loading`/`running` and disabled under `prefers-reduced-motion` | Zero shadows; motion is opt-in and state-specific |
| `src/styles/tokens.css` | fg / fill / border triplet per variant in dark, light media query, and explicit light block; legacy `--ok` / `--warn` / `--danger` / `--status-error-soft` remapped | No hardcoded colours in component CSS; both themes covered |
| `tests/status-registry.test.ts` | 16 tests: state coverage, variant coverage, fallback, label uniqueness, token presence in all three theme blocks, component contract | Section 15 asks for tests; `npm run test:status` |
| `package.json` | `lucide` (framework-free IconNode arrays), `@types/node`, `test:status`, `test` chain now check → build → status → links | The site is static Astro with no React, so `lucide-react` would be dead weight |

Wired into `ProjectRow.astro` (filled block badge) and `projects/[slug].astro` (hero + spec row).
Project maturity words map through `PROJECT_STATUS_STATES`: released→published,
experimental→draft, in-progress→in_progress, archived→archived.

**Icon library substitution (section 15's explicit instruction to verify the installed version).**
The spec says `lucide-react`; this site is static Astro with no React, so `lucide-react` would ship a
renderer that never runs. The installed library is `lucide@1.61.0`, which exports the same icons as
framework-free `IconNode` arrays, and `StatusIndicator.astro` renders those arrays as inline SVG.
All seven referenced icons (`CheckCircle2`, `AlertTriangle`, `XCircle`, `Info`, `MinusCircle`,
`Clock3`, plus the fallback) were resolved against the installed package: every one exists and is an
`IconNode` array. No icon name from the spec's table is used unverified.

**Section 12 token names (partial adoption, stated openly).** Section 12 proposes a full token
vocabulary (`--bg-app`, `--bg-primary`, `--text-tertiary`, `--border-default`, `--accent-subtle`, …).
The site already has 190 live tokens under a different naming scheme, and eight of section 12's names
(`--text-primary`, `--text-secondary`, `--border-strong`, `--accent`, `--accent-hover`, `--danger`,
`--info`, `--focus-ring`) **collide with existing tokens that hold different values**. Renaming the
whole vocabulary would have touched every stylesheet and silently changed eight meanings, so the
existing names were kept and section 12 was applied as a *role* map instead: canvas, surface, text,
border, accent, and status roles all resolve through tokens, and no component hardcodes a colour.
This is the one place where the addendum is followed in intent rather than in literal identifiers.
Everything section 12 says about zero shadows, outline-only focus, `data-theme` handling, and
"never colour alone" is implemented literally.

## Zero-shadow cleanup (live stylesheets only)

`filter-btn` inset shadow → `border-left`; `finder-search` focus → outline; Quick Look palette
`box-shadow` + `backdrop-filter` removed; `.finder-view` shadow removed; the `.status` dot in
`base.css` / `pages.css` uses a 1px outline ring instead of a shadow. `src/styles/global.css` and
`src/styles/app-pages-misc.css` still contain shadows but are imported nowhere; both are deleted in
the working tree.

Section 12.E also asks for the global reset, so `base.css` now carries:

```css
*,
*::before,
*::after { box-shadow: none !important; text-shadow: none !important; }
```

`!important` is deliberate: the point is to beat third-party widgets and generated styles, which a
plain reset cannot reach. Focus rings are outlines, so they are unaffected — verified below. There is
no `filter: drop-shadow()` anywhere in `src/`.

## Defect found and fixed during verification

The project-detail hero status rendered muted grey in both themes and kept a leftover `::before`
dot. Two causes: `.project-hero__meta span:first-child { color: var(--text-secondary) }` outranked
`.status-indicator--success`, and the old dot pseudo-element rules from the pre-registry markup were
never removed. The pseudo-element rules are deleted, the emphasis rule now targets
`.project-hero__meta > .status-indicator + span`, and the now-unused `project-hero__status` class is
gone from the markup. Re-measured: hero status is `rgb(124,199,156)` in dark and `rgb(29,107,67)` in
light, `::before` computes to `none` on every meta child, and the row still reads
"Rilis · Proyek 01 · Gateway AI · AI & automasi".

## Verification actually executed

- `npm run check` — 0 errors, 0 warnings (119 files)
- `npm run build` — 29 pages
- `npm run test:status` — 16/16
- `npm run test:a11y` — 10 pages × 3 viewports, axe clean
- `npm run test:links` — 561 internal references, all resolve
- Computed-style sweep, 5 routes (`/`, `/about/`, `/projects/`, `/projects/dikaroute/`,
  `/projects/agentbuff/`) × 2 viewports (1440, 390) × 2 themes: every indicator has
  `box-shadow: none`, a text label, and an `aria-hidden` icon; 0 overflow; 0 horizontal scroll.
- Zero-shadow sweep, 8 routes × 2 themes: **0 elements** on any page compute a non-`none`
  `box-shadow`, and the first focusable element on each page still reports a `2px solid` outline, so
  the reset did not swallow focus rings.
- Contrast: all 30 status fg/bg pairings (5 variants × fill / surface / page background × 2 themes)
  measured ≥4.5:1; the worst is 5.73:1.

## Known limitations

- **No visual review by this agent**: the pass verified geometry, computed colour, and contrast
  numerically, not by eye. A human should look at `/projects/` in both themes once.
- **Not committed**: still in the working tree alongside unrelated concurrent changes.
- The `pending` variant intentionally reuses the neutral colour triplet; "waiting" is carried by the
  clock icon and the label, per the rule that colour is never the only cue.
- **Disabled controls use `opacity: 0.55`** rather than section 12.D's `--text-disabled` /
  `--bg-disabled` pair. It is one rule in `base.css` covering every control, it keeps disabled text
  below the 4.5:1 threshold *by design* (disabled controls are exempt), and swapping it for explicit
  tokens would mean restyling four element types for no visible gain. Flagged rather than silently
  left as a difference.
- **Radii follow the existing scale** (`--r-sm: 4px`, `--r-md: 8px`), not section 12.B's
  6 / 8 / 12 / 16. The site's tighter radii are part of its current look; changing them was out of
  scope for a status-system pass.
