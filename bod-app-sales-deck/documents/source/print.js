const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage();
for(const n of process.argv.slice(2)){await p.goto('file:///tmp/q/docs/'+n+'.html');await p.waitForTimeout(600);
await p.pdf({path:'/tmp/q/docs/'+n+'.pdf',format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0},preferCSSPageSize:true});console.log(n);}
await b.close();})();
