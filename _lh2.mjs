import fs from 'node:fs';
for (const f of ['mob-home','desk-home']) {
  const r = JSON.parse(fs.readFileSync(`/tmp/lh/${f}.json`, 'utf8'));
  const a = r.audits;
  console.log(`\n== ${f}  throttling=${JSON.stringify(r.configSettings.throttling).slice(0,200)}`);
  console.log('LCP element:', JSON.stringify(a['largest-contentful-paint-element']?.details?.items ?? null)?.slice(0,900));
  const lt = a['long-tasks']?.details?.items ?? [];
  console.log('longtasks:', lt.slice(0,8).map(i=>`${Math.round(i.startTime)}ms +${Math.round(i.duration)}ms ${i.url.split('/').pop()}`).join('\n   '));
  const dbg = a['diagnostics']?.details?.items?.[0];
  console.log('diagnostics:', JSON.stringify(dbg).slice(0,300));
  // top main thread tasks audit
  const mt = a['main-thread-tasks']?.details?.items ?? [];
  console.log('top tasks:', mt.sort((x,y)=>y.duration-x.duration).slice(0,6).map(i=>`${Math.round(i.startTime)}+${Math.round(i.duration)}ms`).join(' | '));
  console.log('render blocking:', JSON.stringify(a['render-blocking-resources']?.details?.items ?? []).slice(0,300));
  console.log('network items:'); (a['network-requests']?.details?.items??[]).forEach(i=>console.log('  ', (i.url.split('/').pop()||i.url).slice(0,48), `${(i.transferSize/1024).toFixed(0)}KB`, i.priority, Math.round(i.networkEndTime)));
}
