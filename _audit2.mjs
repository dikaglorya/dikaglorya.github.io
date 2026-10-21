import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:4322';
const pages = [['home','/'],['about','/about/'],['projects','/projects/'],['project-detail','/projects/dikaroute/'],['journal','/journal/'],['article','/journal/small-static-portfolio-architecture/'],['services','/services/'],['contact','/contact/'],['404','/nonexistent-page/']];
const widths=[320,390,768,1024,1440,1920];
const browser=await chromium.launch();
for (const [name,path] of pages){
 for(const w of widths){
  const h= w<480?800: w<1024?1080:900;
  const page=await browser.newPage({viewport:{width:w,height:h}});
  await page.goto(BASE+path,{waitUntil:'networkidle'});
  await page.waitForTimeout(300);
  const r=await page.evaluate(()=>{
    const vw=innerWidth, vh=innerHeight;
    const res={vw,vh,out:{}};
    const vis=el=>{const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return false;const rc=el.getBoundingClientRect();return rc.width>0&&rc.height>0;};
    const sel=el=>{let s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;if(typeof el.className==='string'&&el.className.trim())s+='.'+el.className.trim().split(/\s+/).slice(0,2).join('.');return s;};
    // real horizontal overflow: scrollWidth of html/body and scrollable containers
    res.htmlSW=document.documentElement.scrollWidth;
    res.bodySW=document.body.scrollWidth;
    const out=[];
    for(const el of document.querySelectorAll('body *')){
      if(!vis(el))continue;
      const cs=getComputedStyle(el);
      if(cs.position==='fixed')continue;
      const rc=el.getBoundingClientRect();
      if(rc.right>vw+0.5 && rc.width>0){
        // is it inside a scrollable-x ancestor?
        let sc=null,p=el.parentElement;
        while(p&&p!==document.body){const pcs=getComputedStyle(p);if((pcs.overflowX==='auto'||pcs.overflowX==='scroll')&&p.scrollWidth>p.clientWidth){sc=sel(p);break;}p=p.parentElement;}
        out.push({sel:sel(el),l:Math.round(rc.left),r:Math.round(rc.right),w:Math.round(rc.width),ov:Math.round(rc.right-vw),scroller:sc,text:(el.textContent||'').trim().slice(0,36)});
      }
    }
    // keep outermost only
    res.outList=out.filter(o=>!out.some(o2=>o2!==o&&o2.r>=o.r&&o2.w>=o.w&&o2.sel!==o.sel&&o2.l<=o.l)).slice(0,8);
    // overlap of content with header/dock at scroll 0 and mid
    const hdr=document.querySelector('.site-header'), dock=document.querySelector('.app-dock');
    const hb=hdr?hdr.getBoundingClientRect().bottom:0;
    const dt=dock?dock.getBoundingClientRect().top:vh;
    res.headerBottom=Math.round(hb);res.dockTop=Math.round(dt);
    // which elements are under header/dock (sanity: hero h1 top)
    const h1=document.querySelector('h1');
    res.h1Top=h1?Math.round(h1.getBoundingClientRect().top):null;
    // interactive target sizes (all <44 check, focus header nav + dock + body links)
    const small=[];
    const seen=new Set();
    for(const el of document.querySelectorAll('a,button,input,select,textarea,summary,[role=button]')){
      if(!vis(el))continue; const rc=el.getBoundingClientRect();
      if(rc.height<44||rc.width<44){
        const k=sel(el)+Math.round(rc.width)+'x'+Math.round(rc.height)+((el.getAttribute('aria-label')||el.textContent||'').trim().slice(0,12));
        if(seen.has(k))continue;seen.add(k);
        small.push({sel:sel(el),w:Math.round(rc.width),h:Math.round(rc.height),t:(el.getAttribute('aria-label')||el.textContent||'').trim().slice(0,24)});
      }
    }
    res.small=small;
    // clamp/ellipsis/text truncation: -webkit-line-clamp or overflow hidden with scrollHeight larger
    const clip=[];
    for(const el of document.querySelectorAll('body *')){
      if(!vis(el))continue;const cs=getComputedStyle(el);
      if(el===document.body)continue;
      if(el.scrollHeight-el.clientHeight>6&&el.clientHeight>0&&(cs.overflowY==='hidden'||cs.overflowY==='clip'||cs.webkitLineClamp!=='none')){
        if(el.children.length>0&&el.tagName!=='P')continue;
        clip.push({sel:sel(el),c:el.clientHeight,s:el.scrollHeight,clamp:cs.webkitLineClamp,text:(el.textContent||'').trim().slice(0,30)});
      }
      if(el.scrollWidth-el.clientWidth>6&&el.clientWidth>0&&(cs.overflowX==='hidden'||cs.overflowX==='clip')){
        clip.push({sel:sel(el),x:'X',c:el.clientWidth,s:el.scrollWidth,text:(el.textContent||'').trim().slice(0,30)});
      }
    }
    res.clip=clip.slice(0,10);
    // section heights + text density
    res.secs=[...document.querySelectorAll('main section, main article, .site-footer')].map(s=>{const rc=s.getBoundingClientRect();return{sel:sel(s),h:Math.round(rc.height),ratio:+(rc.height/vh).toFixed(2),chars:(s.innerText||'').trim().length};}).filter(s=>s.h>0);
    // footer top vs last content bottom
    const ft=document.querySelector('.site-footer');
    if(ft){const rc=ft.getBoundingClientRect();res.footerH=Math.round(rc.height);res.footerTop=Math.round(rc.top+scrollY);}
    // images
    res.imgs=[...document.images].filter(i=>i.complete&&i.naturalWidth&&vis(i)).map(i=>{const rc=i.getBoundingClientRect();return{src:i.currentSrc.split('/').pop(),nat:+(i.naturalWidth/i.naturalHeight).toFixed(2),shown:+(rc.width/rc.height).toFixed(2),w:Math.round(rc.width),h:Math.round(rc.height),fit:getComputedStyle(i).objectFit};}).filter(i=>i.fit==='fill'&&Math.abs(i.shown/i.nat-1)>0.05);
    // toasts
    res.toasts=[...document.querySelectorAll('[class*=toast],[class*=notif],[class*=banner],[data-toast]')].filter(vis).map(sel);
    return res;
  });
  console.log(`== ${name}@${w}x${h} htmlSW=${r.htmlSW} bodySW=${r.bodySW} hdrB=${r.headerBottom} dockT=${r.dockTop} h1Top=${r.h1Top} footerH=${r.footerH}`);
  if(r.outList.length) console.log('  OVERFLOW:',r.outList.map(o=>`${o.sel} l${o.l} r${o.r} w${o.w} ov+${o.ov}${o.scroller?' inScroll:'+o.scroller:''} "${o.text}"`).join('\n            '));
  if(r.clip.length) console.log('  CLIP:',r.clip.map(c=>`${c.sel} ${c.x||''} c${c.c}<s${c.s}${c.clamp&&c.clamp!=='none'?' clamp'+c.clamp:''} "${c.text}"`).join(' ; '));
  if(r.imgs.length) console.log('  IMG:',r.imgs.map(i=>`${i.src} ${i.shown}/${i.nat}`).join(' ; '));
  if(r.small.length) console.log('  SMALL:',r.small.map(s=>`${s.sel} ${s.w}x${s.h}`).slice(0,10).join(', '));
  const tall=r.secs.filter(s=>s.ratio>1.5&&s.chars/Math.max(1,s.h)*1000<2.5);
  if(tall.length) console.log('  LOWDENSITY:',tall.map(s=>`${s.sel} ${s.h}px(${s.ratio}vh) ${s.chars}ch`).join(' ; '));
  if(r.toasts.length) console.log('  TOASTS:',r.toasts.join(','));
  await page.close();
 }
}
await browser.close();
