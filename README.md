# ObitoGlory

Portfolio and services site for **DikaGlorya**, working under the developer identity **DikaCode**. **ObitoGlory** is the canonical website and portfolio brand; DikaGlory, DikaOfc, Dika Developer, and Dika Kendal are contextual public-name variations. The site uses a dark editorial surface, one restrained ice-blue accent, monospace technical metadata, and minimal decoration.

- Production target: [obitoglory.tech](https://obitoglory.tech) (still the previous site). The new build is previewed at [dikaglorya.github.io](https://dikaglorya.github.io).
- GitHub: [github.com/dikaglorya](https://github.com/dikaglorya)
- Stack: Astro 7, TypeScript, hand-written CSS on custom properties, self-hosted fonts, `sharp` image optimization, Playwright + axe-core for checks
- Output: fully static HTML, built into `dist/`

## Design system (v2.0)

Tokens live at the top of `src/styles/global.css`. They are initial values, not immutable, but every color pair in use is contrast-verified.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#08090b` | Page background |
| `--surface` / `--raised` | `#10161a` / `#172126` | Panels, elevated blocks, and project cards |
| `--text` | `#f0f1ed` | Primary text (17.6:1 on bg) |
| `--muted` | `#a2adb2` | Secondary text (8.7:1 on bg) |
| `--accent` | `#9bd7e5` | Single ice-blue accent (12.6:1 on bg) |
| `--accent-ink` | `#08090b` | Text on accent |
| `--border` / `--border-strong` | `#273238` / `#43535a` | Dividers and structural edges |
| `--control-border` | `#64757d` | Interactive boundaries: 4.2:1 on the page background and 3.8:1 on `--surface`; passes the 3:1 non-text requirement |

- Type: **Newsreader Variable** for display (an editorial serif chosen for the independent-journal voice), **Inter Variable** for body, **JetBrains Mono** for eyebrows, labels, and metadata. All are self-hosted through Fontsource packages: `@fontsource-variable/newsreader`, `@fontsource-variable/inter`, `@fontsource/jetbrains-mono`; no font CDNs.
- Performance: `src/styles/fonts.css` includes only the Latin and Latin Extended WOFF2 subsets used by the site. Fonts use `font-display: swap`, images use Astro-generated responsive WebP variants, and the homepage portrait is prioritized as the hero image.
- Security: Astro generates a hash-based Content Security Policy for bundled and inline scripts/styles; the policy restricts resource origins, frames, objects, and form destinations. A strict referrer policy is set, and CI runs `npm audit --audit-level=high`.
- Hosting limitation: GitHub Pages does not let this repository configure arbitrary HTTP response headers. The CSP is delivered as a meta policy; protections that require response headers (such as HSTS and `X-Frame-Options`) must be configured at a capable CDN/hosting layer when the domain is moved. Do not treat the meta policy as a replacement for those headers.
- Radii: 2px for small controls, 3px for editorial cards, and 6px for large panels. Shadows are reserved for the portrait.
- Layout: 1200px outer container, 720px reading width for prose, gutters `clamp(20px, 5vw, 76px)`.
- Motion: restrained, transitions in the 140–220ms range on color, border, and transform only. `prefers-reduced-motion` disables all of it. There is no scroll-reveal system.
- Public copy is bilingual, Indonesian first and English second, in the same block. Longer prose (journal articles) stays single-language. The document is `lang="id"` with `og:locale` `id_ID` and `en_US` as the alternate. The journal publishes practical technical notes based on implementation details that can be checked in this repository. Navigation labels are paired, `Home / Beranda` through `Services / Layanan`, with "Get in touch" as a separate header action.

## Local setup

```bash
npm install
npm run dev
```

The dev server prints a local URL (pinned to `127.0.0.1` by `astro.config.mjs`). Production build:

```bash
npm run build
npm run preview
```

The preview command in this workspace daemonizes. It reports its state on stdout and is managed with:

```bash
astro preview status
astro preview logs
astro preview stop
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Astro dev server |
| `npm run check` | Run `astro check` (TypeScript and Astro diagnostics) |
| `npm run build` | Build the static site to `dist/` |
| `npm run preview` | Preview the built site (daemonized; see above) |
| `npm run test:links` | Check internal links, assets, anchors, and sitemap URLs in `dist/` |
| `npm run test:a11y` | Run axe-core WCAG checks against a running preview |
| `npm run test:visual` | Capture responsive screenshots and test menu/filter/contact interactions |
| `npm run brand` | Regenerate the 1200×630 OG card, the 180×180 touch icon, and the 512×512 social avatar; use `node scripts/generate-brand.mjs --repo <name> --tagline "<text>"` for a 1280×720 repository preview |
| `npm test` | Typecheck, build, then check links |

`test:a11y` and `test:visual` expect a server at `http://127.0.0.1:4321` by default. Start one in another terminal:

```bash
npx astro preview --port 4321
BASE_URL=http://127.0.0.1:4321 npm run test:a11y
BASE_URL=http://127.0.0.1:4321 npm run test:visual
```

Browser tests need Chromium:

```bash
npx playwright install chromium
# On a fresh Linux machine, system libraries may also be required:
sudo npx playwright install-deps chromium
```

Screenshots are written to `.test-output/screenshots/` (ignored by Git).

## Content editing

All public content is typed and centralized. Paired Indonesian/English strings live side by side (`body` / `bodyId`) and are rendered through `BilingualCopy.astro`. No CMS or database is involved.

| File | Content |
| --- | --- |
| `src/data/site.ts` | Name, canonical URL, email, Telegram, GitHub, social links, location, availability |
| `src/data/articles.ts` | Journal articles and technical notes |
| `src/data/navigation.ts` | Header, mobile, and footer navigation |
| `src/data/projects.ts` | 10 project case studies, categories, stacks, and verified live links |
| `src/data/services.ts` | Four services: deliverables, scope limits, starting prices, and pricing notes |
| `src/data/technologies.ts` | Stack groups (Languages / Frameworks / Tools / Infrastructure) and current focus |
| `src/data/facts.ts` | About facts, principles, and the four-step process |
| `src/data/faqs.ts` | FAQ questions and answers |

### Bilingual copy

The site is bilingual on the same URL: Indonesian and English sit next to each other, not on separate routes. This is a deliberate choice, not an unfinished translation.

- `BilingualCopy.astro` renders two lines: English in the normal text color, Indonesian below it in `--muted` at `0.92em`, each wrapped in `lang="en"` / `lang="id"` so screen readers and search engines can tell them apart. The `EN` / `ID` markers are `aria-hidden`; they are a visual cue only.
- Data files carry paired fields (`body` / `bodyId`, `name` / `nameId`, `summary` / `summaryId`). Both must be written by hand. Do not machine-translate: the Indonesian line is what local searches match, and a mechanical translation matches nothing anyone types.
- There is one canonical URL per page, so no `hreflang` alternate set is needed or emitted. Emitting `hreflang` for the same URL in two languages would be wrong.
- Page titles and descriptions combine both languages where the page targets Indonesian search intent (home, services, contact, projects, journal). `/about` leads in English. Titles stay under the point where Google truncates them.
- Mixed-language copy is not a ranking trick. It exists because the same visitor group searches in both languages: Indonesian for local service intent ("jasa website Kendal"), English for technical intent. It will not make the site rank for a name on its own; the name still has to appear in real, linked, referenced places.

### Projects

Each project in `src/data/projects.ts` needs a unique `slug`, `name`, `category`, `type`, `tagline`, `summary`, `problem`, `approach`, `features`, and `stack`. The `link` field is optional and must only contain a URL that has been checked. Repository links are intentionally omitted until they can be verified; project pages state that the source is not public and offer a walkthrough on request.

`link.kind` decides how the link is described, and the two values are not interchangeable:

| `kind` | Meaning | Rendered as |
| --- | --- | --- |
| `live` (default) | a running instance you can open | spec label `Live` |
| `package` | a published artifact you can install | spec label `Package` |

Only DikaRoute has a verified public artifact today: the `dikaroute` npm package. Its npm metadata lists the maintainer `dikacode` with the same contact address used in `site.email`, and its homepage field points at `obitoglory.tech`, so the package can be claimed. The GitHub repository that package metadata points at returns 404, so no repository link is published. Do not add a `package` link for any other project until the registry entry can be checked the same way.

The old slugs are preserved:

```text
dikaroute
pentesterbot
remoteuniversal
website
obitobuff
agentbuff
telegrambot-ai
pentesterbot-website
dikaroute-website
freebuff-patch
```

### Images

- The identity is portrait-led and type-led. The real masked portrait appears in the hero, About introduction, 404 page, and the social card. The face is intentionally obscured with a question mark; the alt text says so.
- `src/assets/portrait.jpg` is the 640×640 source portrait from the previous site. `public/profile-portrait.jpg` is an exact copy used by the `Person` schema so the structured-data image stays at a stable public URL.
- `public/og-default.png` is the 1200×630 photo-led social preview used by `og:image` and `twitter:image`. It is generated by `npm run brand`.
- `public/favicon.svg` is the cyan O-dot mark. `public/apple-touch-icon.png` (180×180) is generated from the same mark; it is not a portrait crop.
- `scripts/generate-brand.mjs` renders the OG card in Chromium from the portrait and self-hosted fonts, then regenerates the touch icon and social avatar with Sharp. Keep the OG at 1200×630; the link check verifies the declared dimensions and MIME type.
- `public/social-avatar.png` (512×512) is the square monogram for profiles that need an avatar larger than the touch icon. Generated from `favicon.svg` on every `npm run brand`.
- Repository social previews: `node scripts/generate-brand.mjs --repo <name> --tagline "<one sentence>"` renders `public/social-previews/<name>.png` at 1280×720 from the same identity (wordmark, ice-blue accent, mono metadata, no portrait). Use it for every public repository card so the GitHub project list stays visually consistent.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/projects/` | Work index with client-side category filtering |
| `/projects/[slug]/` | Project case study |
| `/journal/` | Technical notes index |
| `/journal/[slug]/` | Individual technical article |
| `/about/` | About, principles, current focus, stack |
| `/services/` | Services, scope limits, starting prices, process, FAQ |
| `/contact/` | Project brief form, direct channels, next steps |
| `/404.html` | Branded not-found page |
| `/sitemap.xml` | Generated sitemap |
| `/robots.txt` | Generated robots file |

Old Indonesian routes redirect to their new equivalents with a meta refresh and a fallback link:

```text
/proyek/              -> /projects/
/tentang/             -> /about/
/layanan/             -> /services/
/layanan/website/     -> /services/#website
/layanan/bot/         -> /services/#bot
/layanan/tools/       -> /services/#tools
/layanan/perbaikan/   -> /services/#repairs
/harga/               -> /services/#pricing
/kontak/              -> /contact/
/faq/                 -> /services/#faq
```

For a hard 301, configure redirects at the hosting layer. GitHub Pages cannot serve custom 301 rules for static files.

## Contact form

The contact form does not post to a backend: nothing is sent to a server by this site. The submit handler validates the required fields (the form is `novalidate`, so the custom handler always runs and keeps the status line in sync), builds a `mailto:` URL from the filled fields, and hands off to the visitor's email application. Because some sandboxed browsers block script-initiated `mailto:` navigation, the status line also renders a real link with the exact prepared draft, so the handoff always has a clickable path. The copy-email button uses the Clipboard API with a visible status message. No analytics, cookies, or tracking scripts are included.

## Measurement and privacy

The choice is documented so it is a decision, not an omission:

- Nothing on the site measures visitors: no analytics scripts, cookies, fingerprinting, or third-party trackers. The footer line "No analytics or tracking." is a factual claim; if measurement is ever added, update that line in the same change.
- Post-deploy baseline: Google Search Console (once domain access is verified) for organic queries and impressions, and GitHub Insights for stars, forks, and repository traffic on the site repository. These count public artifacts, not individuals.
- Outbound links carry `data-outbound` attributes (`github`, `telegram`, `instagram`, `tiktok`, `project-live`) in Footer, ContactBlock, the home Follow section, About, and project pages. The attribute is inert today; it exists so a privacy-conscious click counter can wire events later without rewriting markup.
- If visit-level measurement is ever connected, pick a cookieless, no-fingerprinting approach (for example self-hosted analytics on an owned server), document the provider and what it stores in this section, and keep the payload small enough to stay honest about privacy.
- Monthly review after launch: organic search visits and queries, referring domains, project page visits, outbound clicks, article engagement, and genuine feedback. Evidence decides where the next effort goes; numbers do not manage themselves.
- Visitor, star, download, or adoption numbers are never published on the site unless they are genuine and their source is stated next to them.

## SEO and accessibility

- Canonical URLs follow `SITE_URL` in `astro.config.mjs`, which defaults to the host the build is served from (`https://dikaglorya.github.io` while the new site is in preview). No page hardcodes a domain.
- Open Graph and Twitter card metadata are generated in `src/layouts/BaseLayout.astro`.
- JSON-LD covers the Person, WebSite, project pages, services, contact page, and journal articles.
- Every indexable page has a skip link, semantic landmarks, one `h1`, visible focus states, and reduced-motion handling.
- The mobile menu uses a native `<dialog>` with Escape handling and focus return.
- Axe checks cover WCAG 2.0/2.1/2.2 A and AA tags at desktop, tablet, mobile, and 320px widths.
- Interactive boundaries use `--control-border` (3:1+ against adjacent surfaces); `--border`/`--border-strong` appear on non-interactive dividers only.

## Deployment

Two hosts exist on purpose right now:

| Host | What it serves | Source |
| --- | --- | --- |
| `obitoglory.tech` (apex + `www`) | the previous site, on Vercel | outside this repository |
| `dikaglorya.github.io` | this build, on GitHub Pages | `main` via `.github/workflows/deploy.yml` |

The new site is not yet at parity with the old one, so the domain has not moved. Until it does, canonical, sitemap, and `og:url` point at `dikaglorya.github.io` so search engines are never told that a different page at `obitoglory.tech` is this content.

The Astro build is deployed from `dist/` by GitHub Actions. The root `index.html` is a small branded gateway served by Pages branch publishing; it sends visitors to the live preview of this build, not to the old site.

1. In GitHub, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**. With branch publishing still enabled, every push also starts a Jekyll build that fails on `.astro` files.
3. Leave the custom domain empty while `obitoglory.tech` is served elsewhere.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` runs `npm ci`, typechecks, builds, checks internal links, and deploys `dist/`.
5. After the first deploy, add the site in Google Search Console and submit `/sitemap.xml`. That is the organic-search baseline for the measurement section above.

### Moving to the domain later

1. Point the apex and `www` records at GitHub Pages and remove the Vercel project, or keep Vercel and serve `dist/` there instead.
2. Build with `SITE_URL=https://obitoglory.tech npm run build` so canonical, sitemap, and structured data switch in one place.
3. Add `public/CNAME` containing `obitoglory.tech`, then set the custom domain in **Settings → Pages** and enforce HTTPS.
4. Re-verify Search Console against the new origin and resubmit the sitemap.

`public/CNAME` is deliberately absent today: if it ships while Pages has no custom domain, it claims `obitoglory.tech` for a build that is not served there. This repository does not change DNS records.

### Rollback

Open the failed or previous run in the **Actions** tab. Re-run the last known-good deploy workflow, or revert the content commit and push it. Deployment history is available in the **Actions** tab and the `github-pages` environment.

## Known content notes

- The portrait is intentionally masked with a question mark. It is the only real personal photo exposed by the previous site; do not replace it with an invented or unmasked image. The hero, About, 404, and OG card feature it.
- There are no fabricated testimonials, client logos, download counts, uptime claims, or project screenshots on the site.
- Prices are starting points from the existing public content, not final quotes. Confirm scope before publishing a price change.
- The old `dikaofc` GitHub links are not reused. The current profile is `https://github.com/dikaglorya`.
- The GitHub profile currently has one public repository, `dikaglorya.github.io` (this site repository). No project repository links are published because those repositories have not been verified. The `github.com/dikaofc` account that older links point at returns 404, so it is not linked from the site.
- The `dikaroute` npm package is the only verified public artifact for a project. Its registry metadata lists the maintainer `dikacode` with the site contact address, so it is linked from the DikaRoute page as a `package` link. The `kendalscript` npm package has the same maintainer but no case study here, so it is not referenced.
- The structured-data alias list (`site.alternateNames`) deliberately excludes "Dika Kendal": the name is explained on /about as location-related, but it is not established enough through real use to claim as an entity alias (PRD rule: include an alias only when it is genuinely used and explained). Add it to the list only if the owner confirms real usage.
- The Instagram (`xxcdicka`) and TikTok (`dikasecx`) handles come from the owner's previous site data. They appear in `rel="me"` links; verify the accounts belong to DikaGlorya and remove them from `src/data/site.ts` if they do not. Schema `sameAs` stays GitHub-only until those accounts are re-verified.
- `docs/github-profile-README.md` is a draft for the GitHub profile README at github.com/dikaglorya. The live profile still carries an older version, so treat the draft as pending until it is pasted in. Keep only claims you can verify, and re-check every link before publishing.
- The project diagram is conceptual, not a screenshot of a running dashboard.

## License

MIT. See `LICENSE`.
