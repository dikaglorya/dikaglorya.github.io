import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const axeSource = await readFile(path.join(process.cwd(),'node_modules/axe-core/axe.min.js'),'utf8');
const b = await chromium.launch();
for (const scheme of ['dark','light']) {
  const ctx = await b.newContext({ viewport:{width:1440,height:900}, colorScheme: scheme });
  const p = await ctx.newPage();
  await p.route('**/__test__/axe.min.js', r=>r.fulfill({status:200,contentType:'application/javascript',body:axeSource}));
  await p.goto('http://127.0.0.1:4322/', { waitUntil:'networkidle' });
  await p.waitForTimeout(1500);
  await p.addScriptTag({ url:'/__test__/axe.min.js' });
  const r = await p.evaluate(async ()=>{ const x = await window.axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}); return {v:x.violations.length,inc:x.incomplete.map(i=>i.id+':'+i.nodes.length),pass:x.passes.map(p=>p.id+':'+p.nodes.length),na:x.inapplicable.length, rules:x.testEngine.version, bg:[getComputedStyle(document.body).backgroundColor, getComputedStyle(document.body).color], txtLen: document.body.innerText.length, hidden: [...document.querySelectorAll('[data-reveal]')].filter(e=>getComputedStyle(e).opacity==='0').length}; });
  console.log(scheme, JSON.stringify(r));
  await ctx.close();
}
await b.close();
