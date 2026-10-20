import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { site } from '../data/site';

const staticPaths = ['/', '/projects/', '/about/', '/services/', '/contact/'];

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = () => {
  const paths = [
    ...staticPaths,
    ...projects.map((project) => `/projects/${project.slug}/`),
  ];

  const urls = paths
    .map((path) => {
      const loc = new URL(path, site.url).href;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
