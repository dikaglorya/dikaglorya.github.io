import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const [label,url] of [['LOCAL','http://127.0.0.1:4322/'],['LOCAL-live-build','http://127.0.0.1:4322/']]) {
  const ctx = await browser.newContext({ viewport:{width:1440,height:900}, colorScheme:'light' });
  const page = await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push('pageerror: '+e.message)); page.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
  await page.goto(url,{waitUntil:'networkidle'}); await page.waitForTimeout(1500);
  const m = await page.evaluate(()=>{
    const g=s=>{const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); const c=getComputedStyle(e); return {y:Math.round(r.y),h:Math.round(r.height),cssH:c.height,padT:c.paddingTop,pos:c.position,z:c.zIndex};};
    const cs=getComputedStyle(document.documentElement);
    return {shell:cs.getPropertyValue('--shell-height').trim()||'(undefined)', body:g('body'), header:g('.site-header'), inner:g('.site-header__inner'), hero:g('.hero'), h1:g('h1'), dock:g('.app-dock'), footer:g('.site-footer')};
  });
  console.log('\n#####',label,url); console.log(JSON.stringify(m,null,1)); console.log('ERR',errs.slice(0,5));
  await page.screenshot({path:'/tmp/'+label+'.png'});
  await ctx.close();
}
await browser.close();
