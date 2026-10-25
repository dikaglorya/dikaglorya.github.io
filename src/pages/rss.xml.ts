import type { APIRoute } from 'astro';
import { articles } from '../data/articles';
import { site } from '../data/site';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = () => {
  const items = articles
    .map((article) => {
      const url = new URL(`/journal/${article.slug}/`, site.url).href;
      return `    <item>\n      <title>${escapeXml(article.title)}</title>\n      <link>${escapeXml(url)}</link>\n      <guid>${escapeXml(url)}</guid>\n      <pubDate>${new Date(`${article.date}T08:00:00+07:00`).toUTCString()}</pubDate>\n      <description>${escapeXml(article.description)}</description>\n    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>Jurnal ObitoGlory</title>\n    <link>${escapeXml(new URL('/journal/', site.url).href)}</link>\n    <description>Catatan teknis DikaGlorya tentang web, bot, tools, dan automasi.</description>\n    <language>id</language>\n    <atom:link href="${escapeXml(new URL('/rss.xml', site.url).href)}" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
