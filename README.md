# ObitoGlory

Portfolio and services site for **DikaCode / DikaOfc / ObitoGlory**, an indie developer in Kendal, Central Java. ObitoGlory site v2.0 — a full rebuild in the "Digital Workshop / Independent Engineering Journal" design language: dark editorial surface, one restrained accent, mono-spaced system metadata, and no decorative noise.

- Production target: [obitoglory.tech](https://obitoglory.tech)
- GitHub: [github.com/dikaglorya](https://github.com/dikaglorya)
- Stack: Astro 7, TypeScript, hand-written CSS on custom properties, self-hosted fonts, `sharp` image optimization, Playwright + axe-core for checks
- Output: fully static HTML, built into `dist/`

## Design system (v2.0)

Tokens live at the top of `src/styles/global.css`. They are initial values, not immutable — but every color pair in use is contrast-verified.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#08090b` | Page background |
| `--surface` / `--raised` | `#0d0f13` / `#12151a` | Panels, elevated blocks |
| `--text` | `#edf0f4` | Primary text (16.5:1 on bg) |
| `--muted` | `#9aa3ae` | Secondary text (6.5:1 on bg) |
| `--accent` | `#8ec9dc` | Single accent color (10.9:1 on bg) |
| `--border` / `--border-strong` | `#232830` / `#414958` | Decorative dividers only |
| `--control-border` | `#5e677a` | Interactive boundaries — computed value; the PRD's `--border-strong` fails the 3:1 non-text requirement on dark surfaces, this one passes |

- Type: **Newsreader Variable** for display (an editorial serif chosen for the independent-journal voice), **Inter Variable** for body, **JetBrains Mono** for eyebrows, labels, and metadata. All are self-hosted through Fontsource packages — `@fontsource-variable/newsreader`, `@fontsource-variable/inter`, `@fontsource/jetbrains-mono`; no font CDNs.
- Radii: 2px for small controls, 6px for large panels. Shadows are minimal.
- Layout: 1200px outer container, 720px reading width for prose, gutters `clamp(20px, 5vw, 76px)`.
- Motion: restrained — transitions in the 140–220ms range on color, border, and transform only. `prefers-reduced-motion` disables all of it. There is no scroll-reveal system.
- Copy is English throughout. There is no journal/blog: v2.0 navigation is `home / projects / about / services`, with "Get in touch" as a separate header action.

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

All public content is typed and centralized, in English. No CMS or database is involved.

| File | Content |
| --- | --- |
| `src/data/site.ts` | Name, canonical URL, email, Telegram, GitHub, social links, location, availability |
| `src/data/navigation.ts` | Header, mobile, and footer navigation |
| `src/data/projects.ts` | 10 project case studies, categories, stacks, and verified live links |
| `src/data/services.ts` | Four services: deliverables, scope limits, starting prices, and pricing notes |
| `src/data/technologies.ts` | Stack groups (Languages / Frameworks / Tools / Infrastructure) and current focus |
| `src/data/facts.ts` | About facts, principles, and the four-step process |
| `src/data/faqs.ts` | FAQ questions and answers |

### Projects

Each project in `src/data/projects.ts` needs a unique `slug`, `name`, `category`, `type`, `tagline`, `summary`, `problem`, `approach`, `features`, and `stack`. The `link` field is optional and must only contain a URL that has been checked. Repository links are intentionally omitted until they can be verified; the site points to the GitHub profile instead.

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

- The site is type-led. There is no portrait or hero image; the hero is a typographic statement.
- `public/og-default.png` is the 1200×630 social preview used by `og:image` and `twitter:image`. It is generated by `npm run brand`.
- `public/favicon.svg` is the cyan O-dot mark. `public/apple-touch-icon.png` (180×180) is generated from the same file.
- `scripts/generate-brand.mjs` renders the OG card in Chromium and regenerates the touch icon with Sharp. Keep the OG at 1200×630; the link check verifies the declared dimensions and MIME type.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/projects/` | Work index with client-side category filtering |
| `/projects/[slug]/` | Project case study |
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

The contact form does not post to a backend — nothing is sent to a server by this site. The submit handler validates the required fields (the form is `novalidate`, so the custom handler always runs and keeps the status line in sync), builds a `mailto:` URL from the filled fields, and hands off to the visitor's email application. Because some sandboxed browsers block script-initiated `mailto:` navigation, the status line also renders a real link with the exact prepared draft, so the handoff always has a clickable path. The copy-email button uses the Clipboard API with a visible status message. No analytics, cookies, or tracking scripts are included.

## SEO and accessibility

- Canonical URLs use `https://obitoglory.tech`.
- Open Graph and Twitter card metadata are generated in `src/layouts/BaseLayout.astro`.
- JSON-LD covers the Person, WebSite, project pages, services, and contact page.
- Every indexable page has a skip link, semantic landmarks, one `h1`, visible focus states, and reduced-motion handling.
- The mobile menu uses a native `<dialog>` with Escape handling and focus return.
- Axe checks cover WCAG 2.0/2.1/2.2 A and AA tags at desktop, tablet, mobile, and 320px widths.
- Interactive boundaries use `--control-border` (3:1+ against adjacent surfaces); `--border`/`--border-strong` appear on non-interactive dividers only.

## Deployment

The repository is set up for GitHub Pages as a user site at the apex domain. It has not been pushed or deployed from this workspace, so the apex domain may still serve the previous site until the first Pages deployment and DNS cutover.

1. In GitHub, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Set the custom domain to `obitoglory.tech`.
4. Enable **Enforce HTTPS** after DNS is verified.
5. Push to `main`. The workflow in `.github/workflows/deploy.yml` runs `npm ci`, typechecks, builds, checks internal links, and deploys `dist/`.

The custom domain is stored in `public/CNAME`, so it is copied into every build. This repository does **not** change DNS records. At the DNS provider, point the apex domain to GitHub Pages and add the `www` record according to GitHub's current instructions. If the site is hosted somewhere else, publish the `dist/` directory after `npm run build`.

### Rollback

Open the failed or previous run in the **Actions** tab. Re-run the last known-good deploy workflow, or revert the content commit and push it. Deployment history is available in the **Actions** tab and the `github-pages` environment.

## Known content notes

- The site uses a typographic hero instead of a portrait.
- There are no fabricated testimonials, client logos, download counts, uptime claims, or project screenshots on the site.
- Prices are starting points from the existing public content, not final quotes. Confirm scope before publishing a price change.
- The old `dikaofc` GitHub links are not reused. The current profile is `https://github.com/dikaglorya`.
- The GitHub profile currently has no public repositories, so the site does not claim any.
- The project diagram is conceptual, not a screenshot of a running dashboard.

## License

MIT. See `LICENSE`.
