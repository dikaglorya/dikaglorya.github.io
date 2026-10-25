import { defineConfig } from 'astro/config';

// The repo is a GitHub Pages user site (dikaglorya.github.io), so the base path is "/".
//
// Canonical origin: the host this build is actually served from. obitoglory.tech
// still serves the previous site on Vercel, so pointing canonical, sitemap, and
// og:url there would credit a different page. When the new site moves to the
// domain, set SITE_URL=https://obitoglory.tech for that build and add public/CNAME.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://dikaglorya.github.io',
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    syntaxHighlight: 'prism',
  },
  build: {
    format: 'directory',
  },
  compressHTML: true,
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "form-action 'self' mailto:",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        resources: ["'self'"],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  server: {
    host: '127.0.0.1',
  },
  preview: {
    host: '127.0.0.1',
  },
});
