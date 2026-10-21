import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://127.0.0.1:4322/', {waitUntil:'networkidle'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=200){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}window.scrollTo(0,0);});
await p.waitForTimeout(1200);
const r = await p.evaluate(()=>{
  const q=(s)=>[...document.querySelectorAll(s)].slice(0,3).map(e=>{const c=getComputedStyle(e);return {t:e.textContent.trim().slice(0,30),color:c.color,fs:c.fontSize,fw:c.fontWeight,op:c.opacity,bg:c.backgroundColor,parentBg:e.parentElement?getComputedStyle(e.parentElement).backgroundColor:'', op2:e.parentElement?getComputedStyle(e.parentElement).opacity:''}});
  return { cap:q('.portrait-frame__caption span'), route:q('.route-diagram__connector-label'), state:q('.route-diagram__state'), ghost:q('.footer__ghost'), btn:q('.hero__actions .btn'), em:q('.hero__title em') };
});
console.log(JSON.stringify(r,null,1));
await b.close();
