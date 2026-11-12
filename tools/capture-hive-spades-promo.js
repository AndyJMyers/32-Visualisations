const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const {spawn, spawnSync} = require('node:child_process');
const {once} = require('node:events');
const {createCanvas} = require('@napi-rs/canvas');

const root = path.resolve(__dirname, '..');
const out = process.env.DOUBLE_BILL_OUTPUT || path.resolve(root, '../../outputs/Hive-and-Spades-On-Repeat');
const music = process.env.DOUBLE_BILL_MUSIC || path.join(process.env.USERPROFILE, 'OneDrive', 'TVR MUSIC PLAYLIST', 'On repeat.....wav');
const ffmpeg = process.env.FFMPEG_PATH || 'C:/Program Files/CEWE Creator/CEWE Creator/ffmpeg.exe';
const fps = 30, duration = 60, start = 24, rate = 8000;
const box = {window:{}};
for(const file of ['spades.js','hellstrom-hive.js']) vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),box);
const spades = box.window.Spades, hive = box.window.HellstromHive;
fs.mkdirSync(out,{recursive:true});
const bands = ['lowpass=f=185','highpass=f=185,lowpass=f=1600','highpass=f=1600'].map(filter=>{
  const result = spawnSync(ffmpeg,['-v','error','-ss',String(start),'-t',String(duration),'-i',music,'-af',filter,'-ar',String(rate),'-ac','1','-f','s16le','pipe:1'],{maxBuffer:2**21,windowsHide:true});
  if(result.status!==0 || result.stdout.length<duration*rate*2) throw Error(result.stderr?.toString() || 'Incomplete soundtrack excerpt');
  return result.stdout;
});
const count = duration*fps;
const levels = Array.from({length:count},(_,f)=>bands.map(samples=>{
  const a=Math.floor(f/fps*rate), b=Math.min(a+320,samples.length/2);
  let sum=0;
  for(let i=a;i<b;i++) sum+=(samples.readInt16LE(i*2)/32768)**2;
  return Math.sqrt(sum/(b-a));
}));
const gain=bands.map((_,i)=>{
  const sorted=levels.map(v=>v[i]).sort((a,b)=>a-b);
  return .8/Math.max(.005,sorted[Math.floor(count*.94)]);
});
const shots=[
  [0,'split','color','01 / THE DIG & THE HUM'],
  [4,'spades','color',''],
  [9,'hive','mono','02 / UNDERGROUND'],
  [13,'quad','mono',''],
  [17,'split','tech','03 / SOMETHING AT THE GATE'],
  [21,'hive','tech',''],
  [26,'quad','tech',''],
  [30,'spades','mono','04 / CALL A SPADE A SPADE'],
  [35,'split','color',''],
  [39,'hive','color','05 / THE HEAT OF THE DAY'],
  [45,'quad','tech',''],
  [50,'split','mono',''],
  [54,'quad','tech','HELLSTROM\u2019S HIVE  /  SPADES'],
];
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function label(c,text,x,y,size,fill,font='Arial'){
  c.font=`bold ${size}px ${font}`;c.fillStyle=fill;c.fillText(text,x,y);
}
function ellipse(c,x,y,rx,ry,fill){
  c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();
}
function mascot(c,x,y,r,t,bee){
  c.save();c.translate(x,y);c.rotate(Math.sin(t*4)*.17);c.scale(r,r);
  if(bee){
    const flap=.11+Math.abs(Math.sin(t*28))*.16;
    ellipse(c,-.26,-.19,.33,flap,'#9bf8efba');ellipse(c,.26,-.19,.33,flap,'#9bf8efba');
    ellipse(c,0,.12,.57,.36,'#ffc557');
    c.save();c.beginPath();c.ellipse(0,.12,.57,.36,0,0,Math.PI*2);c.clip();
    c.fillStyle='#382231';c.fillRect(-.27,-.3,.12,.9);c.fillRect(.13,-.3,.11,.9);c.restore();
    ellipse(c,0,-.05,.30,.27,'#ffe6ab');
  }else{
    c.fillStyle='#de864e';c.fillRect(-.06,-.73,.12,.91);
    c.lineWidth=.09;c.strokeStyle='#f8ce9a';c.beginPath();c.roundRect(-.17,-.87,.34,.21,.08);c.stroke();
    c.beginPath();c.moveTo(-.39,-.06);c.lineTo(.39,-.06);c.quadraticCurveTo(.43,.42,0,.62);c.quadraticCurveTo(-.43,.42,-.39,-.06);
    c.fillStyle='#a2ebe4';c.fill();
    c.fillStyle='#79b7c3';c.fillRect(-.24,-.02,.06,.31);
    c.translate(0,.24);
  }
  ellipse(c,-.12,-.08,.033,.043,'#302333');ellipse(c,.12,-.08,.033,.043,'#302333');
  c.beginPath();c.moveTo(-.10,.025);c.quadraticCurveTo(0,.16,.13,.023);c.lineWidth=.035;c.strokeStyle='#302333';c.stroke();
  c.restore();
}
function panel(c,img,x,y,w,h,look,color,zoom,offset){
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.fillStyle='#15141b';c.fillRect(x,y,w,h);
  const k=(zoom?Math.max:Math.min)(w/img.width,h/img.height)*(zoom?1.21:1);
  c.drawImage(img,x+(w-img.width*k)/2+offset,y+(h-img.height*k)/2,img.width*k,img.height*k);
  if(look==='mono'){
    c.globalCompositeOperation='saturation';c.fillStyle='#777';c.fillRect(x,y,w,h);
  }else if(look==='tech'){
    c.globalCompositeOperation='screen';c.globalAlpha=.25;c.fillStyle=color;c.fillRect(x,y,w,h);
    c.globalCompositeOperation='overlay';c.globalAlpha=.29;c.fillRect(x,y,w,h);
  }
  c.restore();c.strokeStyle=look==='mono'?'#e6ded2':'#ffc167';c.lineWidth=2;c.strokeRect(x+1,y+1,w-2,h-2);
}
function impact(c,w,h,t,k,look){
  const f=shots[k][0], age=t-f;
  if(age>1.65 || k===0)return;
  const mono=look==='mono', spread=1+age*.6;
  c.save();c.globalAlpha=Math.max(0,1-age/1.65);
  c.translate(w*.5,h*.50);
  for(let i=0;i<32;i++){
    const a=i*2.399, r=age*(140+i%9*52), x=Math.cos(a)*r*spread, y=Math.sin(a)*r*.68+age*age*25;
    c.save();c.translate(x,y);c.rotate(a+age*2);
    c.fillStyle=mono?'#eee3d6':['#ffca63','#f27294','#77efdc'][i%3];
    c.beginPath();c.moveTo(-3,-3);c.lineTo(5+i%7*3,-1);c.lineTo(2,5);c.closePath();c.fill();c.restore();
  }
  c.restore();
}
function compose(c,images,t,k,square){
  const [start,layout,look,chapter]=shots[k],w=c.canvas.width,h=c.canvas.height,age=t-start;
  const titleAlpha=smooth(age/.28)*(1-smooth((age-2.25)/.48));
  const mono=look==='mono', ink=mono?'#f3e9db':'#ffcd79';
  c.fillStyle=mono?'#1b1b1b':'#100e19';c.fillRect(0,0,w,h);
  const x=42,y=108,pw=w-84,ph=h-222,gap=10;
  const slide=(1-smooth(age/.38))*(square?160:260);
  if(layout==='hive'||layout==='spades'){
    panel(c,images[layout==='hive'?0:1],x,y,pw,ph,look,'#ff8d62',false,0);
  }else if(layout==='split'){
    if(square){
      panel(c,images[0],x,y,pw,(ph-gap)/2,look,'#dc557f',false,-slide);
      panel(c,images[1],x,y+(ph+gap)/2,pw,(ph-gap)/2,look,'#38d8c3',false,slide);
    }else{
      panel(c,images[0],x,y,(pw-gap)/2,ph,look,'#dc557f',false,-slide);
      panel(c,images[1],x+(pw+gap)/2,y,(pw-gap)/2,ph,look,'#38d8c3',false,slide);
    }
  }else{
    const colors=['#d53870','#279fc1','#e5a330','#61bf82'];
    for(let j=0;j<4;j++){
      panel(c,images[j%2],x+j%2*(pw+gap)/2,y+Math.floor(j/2)*(ph+gap)/2,(pw-gap)/2,(ph-gap)/2,look,colors[j],j>=2,(j%2?1:-1)*slide);
    }
  }
  impact(c,w,h,t,k,look);
  if(chapter && titleAlpha>0){
    c.save();c.globalAlpha=titleAlpha;
    const yy=h*.5, xx=w*.5+(1-smooth(age/.3))*-125;
    c.translate(xx,yy);c.rotate(-.035);
    c.fillStyle=mono?'#202020':'#6e274a';c.fillRect(-w*.47,-47,w*.94,94);
    c.textAlign='center';label(c,chapter,0,16,square?32:46,ink,'Georgia');c.restore();
  }
  if(!mono){
    const pop=age<1.8?Math.sin(clamp(age/1.8)*Math.PI):0;
    if(pop){
      mascot(c,x+91+age*72,y+ph*.70-age*80,47+pop*27,t,true);
      mascot(c,w-x-87-age*68,y+ph*.70-age*94,48+pop*28,t,false);
    }
  }
  label(c,"HELLSTROM'S HIVE  /  SPADES",x,71,square?31:40,ink,'Georgia');
  label(c,'32 VISUALISATIONS   /   ON REPEAT...',x,h-64,22,ink);
  label(c,'MUSIC: ANDY J MYERS  /  VISUAL ENGINEERING: OPENAI CODEX',x,h-30,17,'#f1e6dd');
  if(t>=57){
    const q=smooth((t-57)/.4);
    c.save();c.globalAlpha=q*.82;c.fillStyle='#120e19';c.fillRect(0,y,w,ph);c.restore();
    const e=t-57;
    mascot(c,w*.5-70-e*100,h*.48-e*23,70+e*13,t,true);
    mascot(c,w*.5+70+e*100,h*.48-e*23,71+e*13,t,false);
    c.save();c.textAlign='center';label(c,'ON REPEAT...',w*.5,h*.70,square?44:66,ink,'Georgia');c.restore();
  }
  const dark=Math.max(0,1-t/.6,(t-59)/1);
  if(dark){c.fillStyle=`rgba(8,6,12,${dark})`;c.fillRect(0,0,w,h);}
}
async function render(square){
  const edition=square?'Instagram-Square':'Landscape';
  const w=square?1080:1920,h=1080;
  const canvas=createCanvas(w,h),c=canvas.getContext('2d');
  const images=[createCanvas(960,620),createCanvas(960,620)];
  const [hc,sc]=images.map(img=>img.getContext('2d'));
  const file=path.join(out,`Hive-and-Spades-On-Repeat-${edition}.mp4`);
  const args=['-y','-v','error','-filter_threads','1','-f','rawvideo','-pix_fmt','rgba','-s',`${w}x${h}`,'-r',String(fps),'-i','pipe:0','-ss',String(start),'-t',String(duration),'-i',music,'-map','0:v:0','-map','1:a:0','-c:v','libopenh264','-threads','2','-b:v',square?'5M':'8M','-pix_fmt','yuv420p','-vf','setsar=1','-af','volume=-1.5dB,afade=t=in:d=0.5,afade=t=out:st=58:d=2','-c:a','aac','-ar','48000','-ac','2','-b:a','192k','-movflags','+faststart',file];
  const child=spawn(ffmpeg,args,{windowsHide:true,stdio:['pipe','ignore','pipe']});
  let errors='', pipeError;
  child.stderr.on('data',b=>errors+=b);
  child.stdin.on('error',e=>{pipeError=e;});
  const done=new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(errors||`Encoder exited ${code}`)));});
  done.catch(()=>{});
  hive.reset();spades.reset();
  let k=0;
  try{
    for(let f=0;f<count;f++){
      if(pipeError || child.stdin.destroyed){await done;throw pipeError||Error('Encoder closed early');}
      const t=f/fps,[bass,mid,treble]=levels[f].map((v,i)=>Math.min(1,v*gain[i]));
      if(k+1<shots.length && t>=shots[k+1][0]) k++;
      hive.draw(hc,960,620,t*1000,{form:'amber',speed:t<28?1.02:.62,bass,mid,treble});
      spades.draw(sc,960,620,t*1000,{form:'loam',speed:2.23,bass});
      compose(c,images,t,k,square);
      if([13.8,26.5,40.1,54.7,58.2].some(second=>f===Math.round(second*fps))) fs.writeFileSync(path.join(out,`${edition}-preview-${t.toFixed(1)}.jpg`),canvas.toBuffer('image/jpeg'));
      const pixels=c.getImageData(0,0,w,h).data;
      if(!child.stdin.write(Buffer.from(pixels.buffer,pixels.byteOffset,pixels.byteLength))) {
        await Promise.race([once(child.stdin,'drain'),done.then(()=>{throw Error('Encoder closed early');})]);
      }
      if(f%300===0)console.log(`${edition}: ${t}s / ${duration}s`);
    }
    child.stdin.end();await done;console.log(file);
  }catch(e){child.kill();await done.catch(()=>{});throw e;}
}
(async()=>{await render(false);await render(true);})().catch(e=>{console.error(e);process.exitCode=1;});
