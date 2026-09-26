const sharp=require('sharp');
const W=1500,H=700, SC=2;
function bubblePath(x,y,w,h,r,tailX,tipX,tipY){ // tail from bottom edge near tailX, smooth curve to tip
  const t0=tailX-26,t1=tailX+26, b=y+h;
  return `M${x+r},${y} H${x+w-r} Q${x+w},${y} ${x+w},${y+r} V${b-r} Q${x+w},${b} ${x+w-r},${b} H${t1} Q${tailX+6},${b+16} ${tipX},${tipY} Q${tailX-18},${b+12} ${t0},${b} H${x+r} Q${x},${b} ${x},${b-r} V${y+r} Q${x},${y} ${x+r},${y} Z`;
}
(async()=>{
 const annan=await sharp('s/img/annan_waving.png').resize({height:290}).png().toBuffer();
 const am=await sharp(annan).metadata();
 const txt='Come in. Let me show you around.';
 const cells=[];
 const variants=[
  {name:'A · App message', desc:'Like Bod Annan\'s own in-app card', svg:(ox)=>`
    <path d="${bubblePath(ox+40,70,330,120,26,ox+150,ox+175,245)}" fill="#1C2123" stroke="#3C4D12" stroke-width="2"/>
    <text x="${ox+68}" y="108" font-family="Plus Jakarta Sans" font-weight="800" font-size="13" letter-spacing="2.4" fill="#B8E62E">BOD ANNAN</text>
    <text x="${ox+68}" y="140" font-family="Manrope" font-weight="700" font-size="21" fill="#F4F6F5">Come in. Let me show</text>
    <text x="${ox+68}" y="168" font-family="Manrope" font-weight="700" font-size="21" fill="#F4F6F5">you around.</text>`},
  {name:'B · Lime bubble', desc:'Solid brand lime, curved tail', svg:(ox)=>`
    <path d="${bubblePath(ox+40,80,330,104,52,ox+150,ox+175,245)}" fill="#B8E62E"/>
    <text x="${ox+74}" y="124" font-family="Manrope" font-weight="800" font-size="22" fill="#0B0D0C">Come in. Let me show</text>
    <text x="${ox+74}" y="153" font-family="Manrope" font-weight="800" font-size="22" fill="#0B0D0C">you around.</text>`},
  {name:'C · Handwritten note', desc:'No box: a quote with a drawn line to him', svg:(ox)=>`
    <rect x="${ox+40}" y="78" width="5" height="76" rx="2.5" fill="#B8E62E"/>
    <text x="${ox+78}" y="112" font-family="Epilogue" font-weight="700" font-size="25" fill="#F4F6F5">Come in. Let me</text>
    <text x="${ox+78}" y="144" font-family="Epilogue" font-weight="700" font-size="25" fill="#F4F6F5">show you around.</text>
    <path d="M${ox+170},172 C${ox+170},200 ${ox+172},215 ${ox+172},238" stroke="#B8E62E" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="1 9"/>`},
 ];
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#0B0D0C"/>`;
 variants.forEach((v,i)=>{const ox=i*500; svg+=v.svg(ox)+`<text x="${ox+40}" y="${H-62}" font-family="Manrope" font-weight="800" font-size="20" fill="#F4F6F5">${v.name}</text><text x="${ox+40}" y="${H-34}" font-family="Manrope" font-size="16" fill="#9AA7A2">${v.desc}</text>`;
   if(i) svg+=`<line x1="${ox}" y1="30" x2="${ox}" y2="${H-30}" stroke="#262C2E"/>`;});
 svg+='</svg>';
 const comps=[0,1,2].map(i=>({input:annan,left:i*500+175-Math.round(am.width*0.39),top:262}));
 await sharp(Buffer.from(svg)).composite(comps).png().toFile('/home/user/Claude-Works/bod-app-sales-deck/bubble-styles.png');
 console.log('ok');
})();
