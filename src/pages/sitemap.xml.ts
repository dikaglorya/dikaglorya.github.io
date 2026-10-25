import type { APIRoute } from 'astro';
import { articles } from '../data/articles';
import { projects } from '../data/projects';
import { site } from '../data/site';

const staticPaths = [
  '/',
  '/projects/',
  '/journal/',
  '/about/',
  '/services/',
  '/contact/',
  '/kendal/',
  '/privacy/',
];

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = () => {
  const entries = [
    ...staticPaths.map((path) => ({ path, lastmod: '2026-10-25', priority: path === '/' ? '1.0' : '0.8' })),
    ...projects.map((project) => ({
      path: `/projects/${project.slug}/`,
      lastmod: '2026-10-25',
      priority: project.featured ? '0.7' : '0.6',
    })),
    ...articles.map((article) => ({
      path: `/journal/${article.slug}/`,
      lastmod: article.date,
      priority: '0.6',
    })),
  ];

  const urls = entries
    .map(({ path, lastmod, priority }) => {
      const loc = new URL(path, site.url).href;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
