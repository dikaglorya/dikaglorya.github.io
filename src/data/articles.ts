export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  code?: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  tags: string[];
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: 'small-static-portfolio-architecture',
    title: 'A small static portfolio architecture that stays easy to maintain',
    description:
      'A practical look at shared page metadata, data-driven project routes, a generated sitemap, and the trade-offs of a static Astro portfolio.',
    date: '2026-10-20',
    readingTime: 5,
    tags: ['Astro', 'Static sites', 'SEO'],
    sections: [
      {
        heading: 'The problem: a portfolio can become a pile of one-off pages',
        paragraphs: [
          'A portfolio needs project pages, clear identity information, and search metadata. Copying those details into every page makes it easy for titles, author names, canonical URLs, and social links to drift apart.',
          'This site is built with Astro as static HTML. The goal is not to claim a performance score; it is to keep the content and page rules understandable, then make the published routes checkable at build time.',
        ],
      },
      {
        heading: 'Put site identity and shared metadata in one place',
        paragraphs: [
          'The site identity lives in `src/data/site.ts`. The shared layout reads that data to emit canonical, Open Graph, Twitter, and structured-data metadata. A page can still pass its own title, description, and specific schema without duplicating the global Person and WebSite entities.',
          'This helps keep the primary person name, the ObitoGlory website brand, and the canonical origin distinct. Alternate names describe one person; the website remains its own entity.',
        ],
        code: `const canonicalURL = new URL(canonicalPath, Astro.site);

const personSchema = {
  '@type': 'Person',
  '@id': 'https://obitoglory.tech/#person',
  name: 'DikaGlorya',
  alternateName: ['DikaGlory', 'DikaCode', 'DikaOfc'],
  url: 'https://obitoglory.tech',
};`,
      },
      {
        heading: 'Generate repeated project pages from structured data',
        paragraphs: [
          'Project summaries are stored in `src/data/projects.ts`. Astro generates each project detail route from that list, so titles, descriptions, stack details, and the project URL all refer to the same entry.',
          'A data-driven route is useful only when its source data is accurate. The portfolio leaves repository and demo links out unless a real destination is available; a project description is not proof that the source is public.',
        ],
        code: `export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}`,
      },
      {
        heading: 'Make the sitemap follow the same content sources',
        paragraphs: [
          'The sitemap is generated from the static routes and the project and article data. Adding a real content entry therefore adds its canonical URL to the same build output, rather than relying on a hand-maintained list that can go stale.',
          'The repository also has a link-check script that resolves internal links and sitemap URLs against the generated `dist/` files. That catches missing local destinations; it does not prove that third-party sites will remain online.',
        ],
        code: `const paths = [
  ...staticPaths,
  ...projects.map((project) => \`/projects/\${project.slug}/\`),
  ...articles.map((article) => \`/journal/\${article.slug}/\`),
];`,
      },
      {
        heading: 'Know when static publishing is the wrong trade-off',
        paragraphs: [
          'Static output avoids a runtime content server for these pages and keeps deployment simple. The trade-off is that content changes require a build and deploy; there is no editor or live publishing workflow in this repository.',
          'That is a good fit for a small portfolio and a modest journal. If publishing volume or collaborative editing grows, the content workflow should be revisited based on that need rather than adding a CMS pre-emptively.',
        ],
      },
      {
        heading: 'What this does and does not prove',
        paragraphs: [
          'The implementation shows how this repository shares identity metadata, generates content routes, and checks its own static links. It does not establish search rankings, measured speed improvements, or adoption by other developers.',
          'The useful next step is to publish actual project releases and documentation, then use privacy-conscious search and feedback data to decide what to improve.',
        ],
      },
    ],
  },
  {
    slug: 'static-contact-form-mailto-handoff',
    title: 'A contact form with no backend: local validation and the mailto handoff',
    description:
      'How the ObitoGlory contact form works on a static site: novalidate validation, a prepared mailto draft, a status-line fallback for sandboxed browsers, and the trade-offs accepted.',
    date: '2026-10-20',
    readingTime: 6,
    tags: ['Astro', 'Forms', 'Static sites'],
    sections: [
      {
        heading: 'The problem: a static site has no inbox',
        paragraphs: [
          'This site is hosted as static files, so there is no origin-controlled server to receive a form POST. A contact form has three realistic options: a third-party form service, a self-hosted endpoint, or no form at all.',
          'A third-party service needs an external script, an account, and a privacy policy to review. A backend turns a static portfolio into something with logs, spam filtering, and maintenance. The path used here is the middle one: the form composes a structured brief and hands it over to the email client the visitor already uses, with mailto. The address is published on the page either way, so nothing new is exposed.',
        ],
      },
      {
        heading: 'Keep a form that works without JavaScript',
        paragraphs: [
          'The form element itself declares the fallback before any script is involved: a mailto action with text/plain encoding. If the script layer never loads, the browser still attempts native mailto submission. The result varies by browser and is never polished, but it is not zero.',
        ],
        code: `<form
  action="mailto:dikasukasukaa@gmail.com"
  method="post"
  enctype="text/plain"
  novalidate
  data-contact-form
  data-contact-email={site.email}
>`,
      },
      {
        heading: 'Take over the submit and validate locally',
        paragraphs: [
          'The novalidate attribute disables native bubbles so the custom handler always runs. checkValidity and reportValidity keep the native behavior that matters: focus moves to the first invalid field, and the browser explains which field failed. A status line carries the message in the wording used everywhere else on the page.',
          'One migration detail: the service select is normalized from the query string first. Old Indonesian URLs such as ?service=perbaikan map to repairs, so a decade-old link still preselects the right option instead of failing silently.',
        ],
        code: `form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
    setStatus('Complete the required fields first.', true);
    return;
  }
  event.preventDefault();
  // ...compose the mailto draft from FormData
});`,
      },
      {
        heading: 'Compose the draft and hand it off',
        paragraphs: [
          'Values come from FormData, trimmed the same way no matter the source field. The subject and body are assembled into readable plain text, and both query values are passed through encodeURIComponent so newlines and ampersands in the message cannot corrupt the mailto URL.',
        ],
        code: `const subject = \`Project brief: \${service} - \${name}\`;
const body = [
  \`Name: \${name}\`,
  \`Email: \${email}\`,
  \`Service: \${service}\`,
  \`Budget: \${budget || 'Not decided yet'}\`,
  '',
  'Message:',
  message,
].join('\\n');
const mailto = \`mailto:\${formEmail}?subject=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(body)}\`;`,
      },
      {
        heading: 'The fallback that must exist',
        paragraphs: [
          'Script-initiated mailto navigation is blocked in some sandboxed browsers and embedded webviews. A status line that only says "opening your email" would then claim an action that never happened.',
          'So the status line appends a real anchor element carrying the exact prepared href. Whatever the environment decides about window.location, the visitor always holds a clickable path to the same draft. The status element uses role="status" with aria-live="polite", and the copy-email button has its own failure path: if the Clipboard API rejects, the status says "Copy manually" followed by the address.',
        ],
        code: `const draftLink = document.createElement('a');
draftLink.href = mailto;
draftLink.textContent = formEmail;
setStatus('Opening your email application. If nothing opens, use the prepared draft:', false, draftLink);
window.location.href = mailto;`,
      },
      {
        heading: 'What is verified, and what is not',
        paragraphs: [
          'The verifiable part lives in this repository: typecheck and build pass, the internal link checker passes, and the recorded manual checks show the empty submit blocked with the required-field status, focus moved to the first invalid field, a filled submit preparing the exact draft, and zero console errors.',
          'The unverifiable part is delivery. The email client decides whether mail is ever sent, and the site holds no receipt, no log, and no counter. That is the trade-off in exchange for keeping zero third-party involvement in a private message.',
        ],
      },
      {
        heading: 'Limitations, and when to replace this',
        paragraphs: [
          'mailto subjects and bodies are interpreted differently by every client: some strip newlines, some ignore prefill, and none accept attachments. Submissions are not stored anywhere, so a brief the visitor never sends leaves no trace on either side. The published address can be harvested like any public address.',
          'None of these justify a backend for the current volume. The honest replacement points are real: a working endpoint when spam or volume justifies it, or first-party hosting that can accept POSTs. Until then the form copy says exactly what happens: nothing is sent to a server by this site.',
        ],
      },
      {
        heading: 'Where to look',
        paragraphs: [
          'The form is at /contact/. The implementation is src/scripts/contact.ts in this website repository (github.com/dikaglorya/dikaglorya.github.io), and the architecture trade-offs are covered in the sibling note about the static portfolio structure that hosts this journal.',
        ],
      },
    ],
  },
];
