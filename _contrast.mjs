import { chromium } from 'playwright';
const BASE='http://127.0.0.1:4322';
const browser = await chromium.launch();
const pages=['/','/about/','/projects/','/journal/','/services/','/contact/'];
const parse = c => { const m=c.match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[,/ ]+([\d.]+))?\)/); return m?{r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]}:null; };
const lin = v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
const L = c => 0.2126*lin(c.r)+0.7152*lin(c.g)+0.0722*lin(c.b);
const blend=(fg,bg)=>({r:fg.r*fg.a+bg.r*(1-fg.a),g:fg.g*fg.a+bg.g*(1-fg.a),b:fg.b*fg.a+bg.b*(1-fg.a),a:1});
const ratio=(a,b)=>{const l1=L(a),l2=L(b);return ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05));};

for (const scheme of ['dark','light']) {
 for (const vp of [{n:'d',w:1440,h:900},{n:'m',w:390,h:844}]) {
  const ctx = await browser.newContext({viewport:{width:vp.w,height:vp.h},colorScheme:scheme});
  for (const p of pages) {
   const page = await ctx.newPage();
   await page.goto(BASE+p,{waitUntil:'networkidle'});
   await page.waitForTimeout(400);
   const H = await page.evaluate(()=>document.body.scrollHeight);
   for(let y=0;y<H;y+=600){await page.evaluate(yy=>scrollTo(0,yy),y);await page.waitForTimeout(50);}
   const res = await page.evaluate(()=>{
     const out=[];
     const els=[...document.querySelectorAll('#main *, header *, footer *, nav *')];
     for(const el of els){
       const t=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim();
       if(!t) continue;
       const b=el.getBoundingClientRect(); if(b.width<2||b.height<2) continue;
       const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.opacity==='0') continue;
       // find effective background by walking up
       let bgEl=el,bg=null;
       while(bgEl){ const c=getComputedStyle(bgEl).backgroundColor; const pc=c.match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[,/ ]+([\d.]+))?\)/); if(pc){const a=pc[4]===undefined?1:+pc[4]; if(a>0){bg={r:+pc[1],g:+pc[2],b:+pc[3],a}; break;}} bgEl=bgEl.parentElement;}
       if(!bg) bg=getComputedStyle(document.documentElement).backgroundColor.match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/)?{r:+RegExp.$1,g:+RegExp.$2,b:+RegExp.$3,a:1}:{r:0,g:0,b:0,a:1};
       out.push({t:t.slice(0,40),cls:(el.className||'').toString().split(' ').slice(0,2).join('.'),fs:cs.fontSize,fw:cs.fontWeight,color:cs.color,bg:`rgba(${bg.r},${bg.g},${bg.b},${bg.a})`,tag:el.tagName.toLowerCase()});
     }
     return out;
   });
   const seen=new Map();
   for(const r of res){
     const fg=parse(r.color), bg=parse(r.bg); if(!fg||!bg) continue;
     const cr=ratio(blend(fg,bg),bg);
     const key=r.cls+'|'+r.color+'|'+r.fs;
     const th = parseFloat(r.fs)>=24 ? 3 : 4.5;
     if(cr<th){ if(!seen.has(key)||seen.get(key).cr>cr) seen.set(key,{...r,cr:+cr.toFixed(2),th}); }
   }
   const fails=[...seen.values()].sort((a,b)=>a.cr-b.cr);
   console.log(`\n### ${scheme} ${vp.n} ${p} — ${fails.length} failing text styles`);
   for(const f of fails.slice(0,12)) console.log(`  ${f.cr} (need ${f.th}) ${f.tag}.${f.cls} fs${f.fs} fw${f.fw} "${f.t}" c=${f.color} bg=${f.bg}`);
   await page.close();
  }
  await ctx.close();
 }
}
await browser.close();
