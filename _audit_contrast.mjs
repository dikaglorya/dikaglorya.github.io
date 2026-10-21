import path from 'node:path'; import { readFile } from 'node:fs/promises'; import { chromium } from 'playwright';
import sharp from 'sharp';
const b = await chromium.launch();
const pages = ['/', '/about/', '/projects/', '/journal/', '/services/', '/contact/', '/404.html'];
const sel = 'a,p,span,h1,h2,h3,h4,h5,h6,li,button,label,time,figcaption,dt,dd,strong,em,code,kbd,option,input,select,textarea,summary,th,td,blockquote';
const lum = ([r,g,b]) => { const f=c=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4}; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
const ratio = (a,c)=>{const L1=lum(a),L2=lum(c);return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)};
const out=[];
for (const scheme of ['dark','light']) for (const p of pages) for (const vp of [{width:1440,height:900},{width:390,height:844}]) {
  const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, deviceScaleFactor:1 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4322'+p, { waitUntil:'networkidle' });
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=200){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}window.scrollTo(0,0);});
  await page.waitForTimeout(1400);
  // gather elements with text
  const els = await page.evaluate((sel)=>{
    const res=[]; const els=[...document.querySelectorAll(sel)];
    els.forEach((e,i)=>{
      if (e.closest('[hidden]')||e.closest('dialog:not([open])')) return;
      let a=e; while(a){const c=getComputedStyle(a); if(c.display==='none'||c.visibility==='hidden'||parseFloat(c.opacity)<0.99) return; a=a.parentElement;}
      const own = [...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
      if (!own) return;
      const cs=getComputedStyle(e); if (cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)===0) return;
      const r=e.getBoundingClientRect(); if (r.width<1||r.height<1) return;
      const range=document.createRange(); range.selectNodeContents(e); const tr=range.getBoundingClientRect();
      if (tr.width<1) return;
      e.setAttribute('data-audit-idx', String(i));
      const fs=parseFloat(cs.fontSize), fw=parseInt(cs.fontWeight)||400;
      res.push({i, text: own.slice(0,40), color: cs.color, fs, fw, large: fs>=24 || (fs>=18.66 && fw>=700), tag:e.tagName.toLowerCase(), cls:(e.className&&typeof e.className==='string')?e.className.slice(0,60):'', x: tr.left+tr.width/2, y: tr.top+tr.height/2, op: cs.opacity, bgImage: cs.backgroundImage!=='none', blend: cs.mixBlendMode, clip: cs.webkitBackgroundClip||cs.backgroundClip});
    });
    return res;
  }, sel);
  const full = await page.screenshot({ fullPage: true });
  const meta = await sharp(full).metadata();
  const raw = await sharp(full).raw().toBuffer({ resolveWithObject: true });
  const positions = await page.evaluate((list)=>list.map(idx=>{ const el=document.querySelector(`[data-audit-idx="${idx}"]`); if(!el) return null; const range=document.createRange(); range.selectNodeContents(el); const r=range.getBoundingClientRect(); return {x:r.left+window.scrollX,y:r.top+window.scrollY,w:r.width,h:r.height}; }), els.map(e=>e.i));
  for (let ei=0; ei<els.length; ei++) {
    const e = els[ei]; const pos = positions[ei];
    if (!pos || pos.w<1||pos.h<1) continue;
    const X0=Math.floor(Math.max(0,pos.x)), Y0=Math.floor(Math.max(0,pos.y));
    const X1=Math.ceil(Math.min(meta.width, pos.x+Math.min(70,pos.w))), Y1=Math.ceil(Math.min(meta.height, pos.y+Math.min(45,pos.h)));
    if (X1-X0<3||Y1-Y0<3) continue;
    const crop = await sharp(full).extract({left:X0,top:Y0,width:X1-X0,height:Y1-Y0}).raw().toBuffer({resolveWithObject:true});
    const { data, info } = crop;
    const CH=info.channels; const W=info.width,H=info.height;
    const at=(x,y)=>{const k=(y*W+x)*CH; return [data[k],data[k+1],data[k+2]];};
    const px=[]; for(let y=0;y<H;y++)for(let x=0;x<W;x++)px.push(at(x,y));
    const hist=new Map(); for(const q of px){const k=q.join(',');hist.set(k,(hist.get(k)||0)+1);}
    const sorted=[...hist.entries()].sort((a,b)=>b[1]-a[1]);
    const bg = sorted[0][0].split(',').map(Number); // most common = background
    const bgL=lum(bg);
    const far = px.map(q=>({q,l:lum(q)})).filter(o=>Math.abs(o.l-bgL)>0.03).sort((a,b)=>Math.abs(b.l-bgL)-Math.abs(a.l-bgL));
    let txt = far.length? far[0].q : bg;
    if(!txt) txt=bg;
    const ra = ratio(txt,bg);
    out.push({scheme,page:p,vp:vp.width,tag:e.tag,cls:e.cls,text:e.text,color:e.color,bg:bg.join(','),px:txt.join(','),ratio:+ra.toFixed(2),large:e.large,fs:e.fs,fw:e.fw,pass: ra >= (e.large?3:4.5), grad:e.bgImage, blend:e.blend, clip:e.clip});
  }
  await ctx.close();
}
const fails = out.filter(o=>!o.pass).sort((a,b)=>a.ratio-b.ratio);
console.log('SAMPLED', out.length, 'FAILS', fails.length);
const key=new Map(); for(const f of fails){const k=f.page+'|'+f.tag+'.'+f.cls+'|'+f.text+'|'+f.scheme+'|'+f.vp; if(!key.has(k)||key.get(k).ratio>f.ratio)key.set(k,f);}
for(const f of [...key.values()].sort((a,b)=>a.ratio-b.ratio)) console.log(`${f.ratio} ${f.scheme} ${f.vp} ${f.page} <${f.tag} class="${f.cls}"> "${f.text}" fg=${f.px} bg=${f.bg} fs=${f.fs}${f.large?' LARGE':''}${f.grad?' grad':''}${f.clip!=='border-box'?' clip='+f.clip:''}`);
await b.close();
