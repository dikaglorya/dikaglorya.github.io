import fs from 'node:fs';
const files = fs.readdirSync('/tmp/lh').filter(f => f.startsWith('desk-') || f.startsWith('mob-'));
for (const f of files) {
  const r = JSON.parse(fs.readFileSync('/tmp/lh/' + f, 'utf8'));
  const a = r.audits;
  const c = r.categories;
  const v = k => a[k]?.displayValue ?? 'n/a';
  console.log(`\n### ${f.replace('.json','')}  perf=${Math.round(c.performance.score*100)}  a11y=${Math.round(c.accessibility.score*100)}  bp=${Math.round(c['best-practices'].score*100)}  seo=${Math.round(c.seo.score*100)}`);
  console.log(`FCP ${v('first-contentful-paint')} | LCP ${v('largest-contentful-paint')} | TBT ${v('total-blocking-time')} | CLS ${v('cumulative-layout-shift')} | SI ${v('speed-index')} | TTI ${v('interactive')}`);
  console.log(`LCP el: ${a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0,120) ?? 'n/a'}`);
  const lcpEls = a['lcp-lazy-loaded'];
  console.log(`CLS top: ${a['layout-shifts']?.details?.items?.slice(0,3).map(i=>`${i.node?.snippet?.slice(0,70)} score=${i.score}`).join(' || ') ?? 'none'}`);
  console.log(`render-blocking savings: ${a['render-blocking-resources']?.details?.overallSavingsMs ?? 0}ms ; unused-css: ${a['unused-css-rules']?.details?.overallSavingsBytes ?? 0}B ; unused-js: ${a['unused-javascript']?.details?.overallSavingsBytes ?? 0}B ; bootup: ${v('bootup-time')}`);
  console.log(`network: transfer=${(a['total-byte-weight']?.numericValue/1024).toFixed(0)}KB requests=${a['network-requests']?.details?.items?.length}`);
  const big = (a['network-requests']?.details?.items ?? []).filter(i=>i.transferSize>40000).map(i=>`${i.url.split('/').pop()} ${(i.transferSize/1024).toFixed(0)}KB ${Math.round(i.networkEndTime-i.networkRequestTime)}ms`).slice(0,6);
  console.log('big:', big.join(' | '));
  console.log(`forced reflow: ${v('forced-reflow-insight')} ; longtasks: ${a['long-tasks']?.details?.items?.length ?? 0} total ${a['long-tasks']?.details?.items?.reduce((s,i)=>s+i.duration,0).toFixed(0) ?? 0}ms; third-party none`);
  console.log(`mainthread breakdown: ${a['mainthread-work-breakdown']?.details?.items?.slice(0,3).map(i=>`${i.groupLabel} ${Math.round(i.duration)}ms`).join(', ')}`);
}
