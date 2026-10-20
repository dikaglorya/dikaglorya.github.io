# ObitoGlory — Global Recognition & Identity Growth PRD

## Document purpose

This document defines product requirements for growing ObitoGlory into the canonical online home for DikaGlorya's developer identity, work, and public writing. It extends the existing website direction with identity, credibility, distribution, discoverability, and measurement requirements; it does not promise virality, search rankings, or global recognition.

## 1. Mission

Build ObitoGlory into a recognizable independent developer brand through a distinctive website, useful software projects, credible technical writing, and a consistent public presence. The website is the canonical destination for the brand and the connected developer identity.

- **Primary personal identity:** DikaGlorya
- **Developer identity:** DikaCode
- **Website brand:** ObitoGlory
- **Website:** <https://obitoglory.tech>
- **GitHub:** <https://github.com/dikaglorya>

Recognition is an ongoing outcome of useful work and consistent publishing, not a feature that a website can guarantee.

## 2. Identity model and positioning

Position ObitoGlory as an independent developer brand focused on practical software, developer tools, web experiences, automation, and technical experiments.

The public identity should be consistent and explain the relationship between these names:

- **DikaGlorya** — primary personal identity.
- **DikaGlory** — alternate public name, when genuinely used.
- **DikaCode** — developer identity.
- **DikaOfc** — alternate public name, when genuinely used.
- **Dika Developer** — professional description, not a separate person.
- **ObitoGlory** — website and portfolio brand.
- **Dika Kendal** — use only where relevant and safe to publish.

Alias claims must describe real usage and context. Do not imply that any name is famous or independently established without evidence. The name mapping can be revised if the owner later chooses a different primary identity.

Brand personality:

- Technically credible, distinctive, independent, curious, minimal, and editorial.
- Honest about unfinished work and project limitations.
- Demonstrates ability through real projects and technical decisions.
- Avoids generic claims such as “passionate developer changing the world.”

## 3. Visual identity system

Create an original, recognizable identity that is consistent across the website, GitHub profile, repository documentation, and social previews.

### Design direction

- Near-black backgrounds and off-white typography.
- Restrained ice-blue accent.
- Editorial typography, thin structural dividers, and monospace technical metadata.
- Deliberate asymmetry and strong project screenshots or diagrams.
- Avoid visual effects that compete with the work or depend on a generic glowing logo.

### Signature assets

Create an original ObitoGlory identity system comprising:

- Wordmark.
- Compact monogram that remains legible at small sizes.
- Favicon and social avatar.
- Open Graph cover.
- Reusable repository social-preview template.

Apply the same identity consistently to the website, GitHub profile README, repository banners, project documentation, social profiles, and article covers.

## 4. Homepage growth architecture

The homepage must communicate the identity immediately and direct visitors to verifiable work:

1. **Identity:** Brand, concise positioning, and a memorable headline.
2. **Proof of work:** Strongest real project, with screenshot, concise description, technical details, and a working link. Never invent a project to fill this section.
3. **What is being built:** Active projects and experiments with honest development statuses.
4. **Technical credibility:** Links to source code, implementation notes, architecture decisions, and genuine technical articles.
5. **Follow the work:** Verified public profiles and project-update channels.
6. **Contact:** A clear path for collaboration, feedback, and legitimate project inquiries.

## 5. Project strategy and release process

Prioritize a small number of useful, well-finished projects over many shallow repositories. Each public project should provide, as applicable:

- A clear problem statement and understandable solution.
- A working demo when appropriate.
- A concise README, installation instructions, screenshots or a short demonstration.
- Actual architecture and technology details.
- Known limitations.
- License and contribution instructions where applicable.
- Issues or a roadmap when ongoing development warrants them.

Do not describe an experiment as production-ready.

For each substantial release:

1. Identify a real problem and define the minimum useful solution.
2. Implement and test the solution.
3. Document its actual behavior and limitations.
4. Publish a working release and create a demonstration.
5. Explain one meaningful engineering decision.
6. Collect feedback and improve based on evidence.

## 6. Technical content system

Create a technical journal that supports search discovery and demonstrates credibility. Topics may include developer tools, practical web development, Linux and development environments, API integration and automation, engineering trade-offs, performance, accessibility, and lessons from real debugging sessions.

Every article must give readers applicable value and follow this structure where relevant:

1. Specific title and the problem or question.
2. Relevant context.
3. Actual implementation, with code or examples where useful.
4. Verifiable results.
5. Limitations and trade-offs.
6. Links to the relevant project or documentation.

Do not fabricate benchmark results, personal experiences, case studies, or claims.

## 7. Distribution system

Every substantial project release needs a distribution plan:

- **Website:** Publish the canonical project page, documentation, screenshots, and a relevant technical article.
- **GitHub:** Maintain a useful profile README and documented public repositories with accurate descriptions, appropriate topics, licenses, and pinned projects.
- **Developer communities:** Share relevant work only where it fits community rules; prioritize reproducible demonstrations, helpful answers, and genuine technical discussion.
- **Social channels:** Choose a small number of audience-appropriate channels. Share concise technical demonstrations, before-and-after improvements, releases, lessons learned, and links to detailed documentation.

Do not spam unrelated communities, buy fake engagement, or manufacture social proof.

## 8. Identity hub and entity recognition

Create a useful `/about` identity hub that states who DikaGlorya is, how the names above relate, what ObitoGlory represents, which projects are real, and which public accounts are official. Explain each alias in its true context rather than creating near-duplicate pages for each name.

Use structured data to help search engines understand the person and website. A basic concept is:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://obitoglory.tech/#person",
  "name": "DikaGlorya",
  "alternateName": [
    "DikaGlory",
    "DikaCode",
    "DikaOfc",
    "ObitoGlory",
    "Dika Developer"
  ],
  "url": "https://obitoglory.tech/"
}
```

Implementation requirements:

- Add `sameAs` only for public profile URLs verified to belong to DikaGlorya.
- Add `WebSite` structured data to describe the website and its brand.
- Include an alias in `alternateName` only when it is genuinely used and its relationship is explained on the site.
- Do not add guessed URLs, profiles belonging to other people, or unsafe personal details.
- Treat structured data as an identity signal, not a guarantee of rankings or a knowledge panel.

Build consistent independent references through the website, verified GitHub profile and repositories, other official public profiles, and useful content. Do not create dozens of thin alias pages, fake profiles, backlink spam, or fabricated popularity claims.

## 9. Search discoverability

Implement technical SEO for each important public page:

- Unique page titles and descriptions.
- Canonical URLs, sitemap, and robots configuration.
- Open Graph metadata and useful internal links.
- Descriptive project URLs and semantic page structure.
- Alternative text for meaningful images.
- Fast rendering and mobile usability.
- Search Console setup and monitoring, when access is available.

### Homepage Open Graph metadata

A Vercel Open Graph snapshot supplied on 2026-10-20 showed inconsistent homepage metadata and an image URL that did not match the repository. The homepage now supplies one title and description to the shared layout, which uses them consistently for the document, Open Graph, and Twitter cards.

Current homepage metadata:

| Field | Current value |
| --- | --- |
| Title | `DikaGlorya | ObitoGlory, Independent Developer` |
| Description | `The official portfolio of DikaGlorya, also known as DikaCode. ObitoGlory is the home for practical software, developer tools, web projects, and technical notes.` |
| Open Graph site name | `ObitoGlory` |
| Canonical URL | `https://obitoglory.tech/` |
| Open Graph image | `https://obitoglory.tech/og-default.png` (1200 × 630) |
| Image alt | `ObitoGlory social preview identifying DikaGlorya as an independent developer and linking the website brand to practical software work.` |

The repository uses the non-`www` hostname in `astro.config.mjs`, `src/data/site.ts`, canonical links, `og:url`, and the sitemap. Keep the `www` hostname redirected to this canonical host. Confirm the Open Graph image path exists in the repository and deployed output. Do not publish different titles or descriptions for Open Graph and Twitter cards.

Target relevant searches for the real brand and alias names, actual project names, and specific problems solved by each project. Do not stuff unrelated keywords or publish repetitive thin pages.

Search engines determine results and site names using multiple signals. The site should provide clear, consistent evidence but must not promise a particular ranking, first position, or result for every alias.

## 10. Measurement and privacy

Establish a baseline after launch and review it monthly. Where privacy-conscious measurement is available, track:

- Organic search visits and queries.
- Referring domains.
- Project-page visits, repository outbound clicks, and demo visits.
- Article engagement.
- Genuine contributions and feedback.
- Project adoption where it can be measured reliably.

Use observed evidence to decide which projects and content deserve further investment. Do not publish visitor, star, download, or adoption numbers unless they are genuine and their source is clear. Select and document an analytics approach that respects visitor privacy.

## 11. Growth phases

- **Phase A — Foundation:** Deploy the complete website; establish the visual identity, metadata, analytics decision, and verified profile links.
- **Phase B — Credibility:** Publish the first verified projects with working documentation, appropriate demos, and accurate technical explanations.
- **Phase C — Discoverability:** Publish useful articles, improve search metadata, connect projects to documentation, and share releases with relevant communities.
- **Phase D — Feedback:** Collect real user feedback, fix defects, improve onboarding, and prioritize features based on actual needs.
- **Phase E — Recognition:** Maintain a consistent publishing rhythm and recognizable visual assets, contribute to relevant communities, and continue shipping useful work.

Do not optimize vanity metrics at the expense of software quality.

## 12. Growth acceptance criteria

The website is ready to support growth when:

- The personal identity, aliases, and ObitoGlory brand are consistently and accurately explained.
- The identity system is consistent across the website and official public profiles.
- The site works on mobile and desktop, and important pages are indexable.
- Project links and demonstrations work.
- Published claims are accurate; project status and limitations are honest.
- Technical articles provide real value.
- GitHub and website content are consistent.
- Visitors can understand and evaluate the work quickly.
- The site can be maintained without rebuilding its architecture.

The priority is: **a strong website → one flagship project → good documentation → consistent distribution → iteration based on feedback.** The website is the stage; useful work is the reason people return and talk about it.
