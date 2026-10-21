import fs from 'node:fs';
const dir = '/tmp/lh2';
for (const f of ['mob-home', 'desk-home', 'mob-homeprojects', 'desk-homeprojects', 'mob-homecontact']) {
  const r = JSON.parse(fs.readFileSync(`${dir}/${f}.json`, 'utf8'));
  const a = r.audits;
  console.log(`\n== ${f}`);
  const fr = a['forced-reflow-insight'];
  if (fr) {
    const s = JSON.stringify(fr.details).slice(0, 1400);
    console.log('forced-reflow:', s);
  }
  const rb = a['render-blocking-insight'];
  console.log('render-blocking items:', JSON.stringify(rb?.details?.items ?? []).slice(0, 500));
  // unused css/js
  const ucss = a['unused-css-rules'];
  console.log('unused css:', ucss?.details?.overallSavingsBytes, JSON.stringify((ucss?.details?.items ?? []).slice(0, 3).map(i => ({ u: i.url.split('/').pop(), w: i.wastedBytes }))));
  const ujs = a['unused-javascript'];
  console.log('unused js:', ujs?.details?.overallSavingsBytes, JSON.stringify((ujs?.details?.items ?? []).slice(0, 3).map(i => ({ u: i.url.split('/').pop(), w: i.wastedBytes }))));
  // a11y fails on home
  if (f === 'mob-home') {
    const fails = Object.entries(a).filter(([k, x]) => x.score !== null && x.score < 1 && x.scoreDisplayMode === 'binary').map(([k, x]) => k);
    console.log('a11y score=0 audits:', fails.join(', '));
  }
  // font display insight
  console.log('font-display:', JSON.stringify(a['font-display-insight']?.details?.items ?? []).slice(0, 300));
  // LCP phases (mobile home)
  const ph = a['lcp-breakdown-insight'];
  if (ph) console.log('lcp phases:', JSON.stringify(ph.details?.items ?? []).slice(0, 600));
}
