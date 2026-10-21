import path from 'node:path'; import { readFile } from 'node:fs/promises'; import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
await p.goto('http://127.0.0.1:4322/', { waitUntil:'networkidle' });
await p.waitForTimeout(2000);
console.log(await p.evaluate(()=>{
  const el=document.querySelector('.project-row__name');
  const h=document.querySelector('.capability h3');
  const s=(e)=>{ if(!e) return null; const cs=getComputedStyle(e); const r=e.getBoundingClientRect(); return {cls:e.className, color:cs.color, op:cs.opacity, tr:cs.transform, vis:cs.visibility, rect:[r.x|0,r.y|0,r.width|0,r.height|0], parentOp:getComputedStyle(e.parentElement).opacity, parentCls:e.parentElement.className, blend:cs.mixBlendMode, filter:cs.filter}; };
  return {prn:s(el), cap:s(h), bodyH:document.body.scrollHeight, reveals:[...document.querySelectorAll('[data-reveal]')].slice(0,5).map(s)};
}));
await b.close();
