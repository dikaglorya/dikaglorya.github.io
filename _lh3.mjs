import fs from 'node:fs';
const dir = process.argv[2] || '/tmp/lh2';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
  const r = JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8'));
  const a = r.audits, c = r.categories;
  const v = k => a[k]?.displayValue ?? '-';
  console.log(`\n### ${f.replace('.json', '')} perf=${Math.round(c.performance.score * 100)} a11y=${Math.round(c.accessibility.score * 100)} bp=${Math.round(c['best-practices'].score * 100)} seo=${Math.round(c.seo.score * 100)}`);
  console.log(`FCP ${v('first-contentful-paint')} | LCP ${v('largest-contentful-paint')} | TBT ${v('total-blocking-time')} | CLS ${v('cumulative-layout-shift')} | SI ${v('speed-index')} | TTI ${v('interactive')}`);
  const lcpItems = a['largest-contentful-paint-element']?.details?.items ?? [];
  const lcpNode = lcpItems.find(i => i.type === 'node')?.node?.snippet;
  console.log(`LCP el: ${(lcpNode || JSON.stringify(lcpItems[0]?.items?.[0]?.node?.snippet) || 'n/a').slice(0, 110)}`);
  console.log(`CLS shifts: ${JSON.stringify((a['layout-shifts']?.details?.items ?? []).slice(0, 3).map(i => ({ n: (i.node?.snippet || '').slice(0, 50), s: +i.score.toFixed(4) })))}`);
  for (const k of ['font-display-insight', 'render-blocking-insight', 'unused-css-rules', 'unused-javascript', 'lcp-discovery-insight', 'forced-reflow-insight']) {
    const x = a[k]; if (x && x.score !== null && x.score < 1) console.log(`  ${k}: score=${x.score.toFixed(2)} ${x.displayValue ?? ''} savings=${x.details?.overallSavingsMs ?? x.details?.overallSavingsBytes ?? ''}`);
  }
  const lt = a['long-tasks']?.details?.items ?? [];
  console.log(`longtasks=${lt.length} total=${Math.round(lt.reduce((s, i) => s + i.duration, 0))}ms; bootup=${v('bootup-time')}; doc-in-LCP=${a['lcp-lazy-loaded']?.score}`);
  console.log(`bytes=${(a['total-byte-weight']?.numericValue / 1024).toFixed(0)}KB reqs=${a['network-requests']?.details?.items?.length}`);
  console.log('  ' + (a['network-requests']?.details?.items ?? []).map(i => `${(i.url.split('/').pop() || i.url).slice(0, 34)}=${(i.transferSize / 1024).toFixed(0)}K`).join(' '));
}
