import path from 'node:path'; import { readFile } from 'node:fs/promises'; import { chromium } from 'playwright';
const axeSource = await readFile(path.join(process.cwd(),'node_modules/axe-core/axe.min.js'),'utf8');
const b = await chromium.launch();
for (const scheme of ['dark','light']) {
  const ctx = await b.newContext({ viewport:{width:1440,height:900}, colorScheme: scheme });
  const p = await ctx.newPage();
  await p.route('**/__test__/axe.min.js', r=>r.fulfill({status:200,contentType:'application/javascript',body:axeSource}));
  await p.goto('http://127.0.0.1:4322/', { waitUntil:'networkidle' });
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300)window.scrollTo(0,y);window.scrollTo(0,0);});
  await p.waitForTimeout(1200);
  await p.addScriptTag({ url:'/__test__/axe.min.js' });
  const r = await p.evaluate(async ()=>{ const x = await window.axe.run(document, {runOnly:['color-contrast']}); return x.incomplete.flatMap(v=>v.nodes.map(n=>({t:n.target.join(' '),m:n.any.map(a=>a.message).join('|'),s:n.html.slice(0,120)}))); });
  console.log('=== '+scheme+' incomplete contrast '+r.length);
  const seen=new Set(); for (const n of r){ const k=n.t+n.m; if(seen.has(k))continue; seen.add(k); console.log(JSON.stringify(n)); }
  await ctx.close();
}
await b.close();
