/* Ninety seconds of the three approved v1.0 effects, rendered live against original music. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {spawn,spawnSync}=require('node:child_process'),{once}=require('node:events');
const {createCanvas}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),out=process.env.PHOTO_OUTPUT||path.resolve(root,'../../outputs/Light-Lens-Illusion');
const music=process.env.PHOTO_MUSIC||'C:/Users/mr__b/OneDrive/TVR MUSIC PLAYLIST/Mission to Mars.wav';
const ffmpeg=process.env.FFMPEG_PATH||'C:/Program Files/CEWE Creator/CEWE Creator/ffmpeg.exe';
const fps=60,duration=90,musicStart=24,start=Number(process.env.CAPTURE_START||0),end=Number(process.env.CAPTURE_END||90);
const stem='32V-Light-Lens-Illusion-Mission-To-Mars',shotLength=7.5;
const definitions=[['schlieren-v1.0','schlieren.js','Schlieren','SCHLIEREN PHOTOGRAPHY'],['anamorphic-v1.0','anamorphic.js','AnamorphicSqueeze','ANAMORPHIC SQUEEZE'],['bipack-v1.0','bipack.js','Bipack','BIPACK PROCESSING']];
const shots=[
  [0,'ballistics','THE SHAPE OF A BANG'],[1,'barrel','LICENCE TO ILLUMINATE'],[2,'contact','SACRED / PROFANE'],
  [0,'velvet','BODY HEAT'],[1,'casino','VELVET, GOLD & DANGEROUS COMPANY'],[2,'glass','STAINED GLASS AFTER DARK'],
  [0,'equine','THOROUGHBRED ATMOSPHERE'],[1,'alpine','THE ALPINE ARRANGEMENT'],[2,'velvet','VELVET DOUBLE EXPOSURE'],
  [0,'velocity','VELOCITY HAS CONSEQUENCES'],[1,'abyss','DEEP COVER'],[2,'silver','SILVER NITRATE SUNDAY']
];
const accents=['#a6e6e3','#edd099','#f29bc8'];
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const fade=(t,a,b)=>smooth((t-a)/.7)*smooth((b-t)/.8);
fs.mkdirSync(out,{recursive:true});
function load([tag,file,name]){
  const source=spawnSync('git',['show',`${tag}:${file}`],{cwd:root,encoding:'utf8',windowsHide:true});
  if(source.status!==0)throw Error(source.stderr||`Missing tagged source: ${tag}`);
  const box={window:{},Math,Float32Array,OffscreenCanvas:function(w,h){return createCanvas(w,h);}};
  vm.runInNewContext(source.stdout,box);return box.window[name];
}
const visuals=definitions.map(load),stage=createCanvas(1920,1080),s=stage.getContext('2d');
const wide=createCanvas(1920,1080),wc=wide.getContext('2d'),tall=createCanvas(1080,1920),tc=tall.getContext('2d');
const bands=['lowpass=f=220','highpass=f=220,lowpass=f=1800','highpass=f=1800'].map(filter=>{
  const r=spawnSync(ffmpeg,['-v','error','-ss',String(musicStart),'-t',String(duration),'-i',music,'-af',filter,'-ac','1','-ar','8000','-f','s16le','pipe:1'],{windowsHide:true,maxBuffer:4*1024*1024});
  if(r.status!==0||r.stdout.length<duration*16000)throw Error(r.stderr.toString()||'Soundtrack is too short');return r.stdout;
});
function energy(b,t){const a=Math.floor(t*8000),z=Math.min(a+400,bands[b].length/2);let sum=0;for(let i=a;i<z;i++)sum+=(bands[b].readInt16LE(i*2)/32768)**2;return clamp(Math.sqrt(sum/Math.max(1,z-a))*[6,8,12][b]);}
function text(c,str,x,y,size,colour='#eee5d4',font='Arial'){c.fillStyle=colour;c.font=`500 ${size}px ${font}`;c.fillText(str,x,y);}
function tracking(c,str,x,y,size,colour){c.fillStyle=colour;c.font=`500 ${size}px Arial`;for(const ch of str){c.fillText(ch,x,y);x+=c.measureText(ch).width+size*.15;}}
function titleLines(type){return [['SCHLIEREN','PHOTOGRAPHY'],['ANAMORPHIC','SQUEEZE'],['BIPACK','PROCESSING']][type];}
function credits(c,t,portrait){
  const a=fade(t,31,37),b=fade(t,61,67);
  if(!a&&!b)return;c.save();c.globalAlpha=Math.max(a,b);const x=portrait?76:76,y=portrait?1360:250;
  const slide=(1-smooth((t-(a?31:61))/.7))*110;
  text(c,a?'ANDY J MYERS':'OPENAI CODEX',x-slide,y,portrait?35:32);
  text(c,a?'CONCEPT / ART DIRECTION / ORIGINAL MUSIC':'CODE / VISUAL ENGINEERING / CREATIVE COLLABORATION',x-slide,y+39,portrait?17:16,'#a9c5c9');c.restore();
}
function compose(c,portrait,t,index){
  const [type,,label]=shots[index],accent=accents[type],local=t-index*shotLength,w=c.canvas.width,h=c.canvas.height;
  c.fillStyle='#03050c';c.fillRect(0,0,w,h);
  if(portrait){
    const drift=Math.sin(t*.11)*130;c.drawImage(stage,-1280+drift,0,3413,1920);c.fillStyle='#020510ce';c.fillRect(0,0,w,h);
    tracking(c,'32 VISUALISATIONS',76,112,23,'#d7c9a7');
    const slide=(1-smooth(local/.8))*140;
    titleLines(type).forEach((str,i)=>text(c,str,76-slide,265+i*72,63,i?accent:'#f4eddd'));
    text(c,'v1.0 / THE PHOTOGRAPHIC COLLECTION',78,394,18,'#b4b8ba');
    c.drawImage(stage,0,490,1080,607.5);c.strokeStyle=accent;c.lineWidth=1;c.strokeRect(1,489,1078,609);
    const words=label.split(' ');let line='',y=1170;
    c.font='500 25px Arial';for(const word of words){const trial=(line?line+' ':'')+word;if(c.measureText(trial).width>925){text(c,line,76,y,25,accent);line=word;y+=34;}else line=trial;}text(c,line,76,y,25,accent);
    text(c,['AIR BECOMES VISIBLE.','CINEMA CHANGES SHAPE.','TWO WORLDS. ONE EXPOSURE.'][type],76,y+65,19,'#d9d5ce');
    text(c,'MISSION TO MARS',76,1618,30);text(c,'ORIGINAL MUSIC / ANDY J MYERS',76,1653,18,'#a9c5c9');
    tracking(c,'YOUR MUSIC.',76,1780,26,'#efe4cb');tracking(c,'AN EXTRAORDINARY VIEW.',76,1822,26,accent);
  }else{
    c.drawImage(stage,0,0,w,h);
    const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#02040cec');g.addColorStop(.16,'#02040c00');g.addColorStop(.76,'#02040c00');g.addColorStop(1,'#02040cf5');c.fillStyle=g;c.fillRect(0,0,w,h);
    tracking(c,'32 VISUALISATIONS',66,50,20,'#e4d5b3');
    c.textAlign='right';text(c,'MISSION TO MARS / ANDY J MYERS',w-66,50,18,'#b8d2d5');c.textAlign='left';
    const a=smooth(local/.6),slide=(1-a)*140;c.save();c.globalAlpha=a;
    text(c,definitions[type][3],68-slide,967,39);text(c,label,70-slide,1007,20,accent);c.restore();
    c.textAlign='right';text(c,'v1.0 / YOUR MUSIC. AN EXTRAORDINARY VIEW.',w-66,1030,16,'#b8c2c5');c.textAlign='left';
  }
  credits(c,t,portrait);
  const opening=fade(t,.4,5.9),ending=fade(t,83.5,89.5);
  if(opening||ending){
    c.save();c.globalAlpha=Math.max(opening,ending);const yy=portrait?1440:170;
    text(c,ending?'NO CLOUD. NO ACCOUNT.':'LIGHT. LENS. ILLUSION.',portrait?76:68,yy,portrait?33:48,accent);
    text(c,ending?'JUST YOUR MUSIC.':'THREE NEW WAYS TO SEE YOUR MUSIC.',portrait?76:70,yy+43,portrait?21:20);c.restore();
  }
  // A brief travelling glint joins moving scenes without freeze-frame transitions.
  if(index&&local<.32){c.save();c.globalCompositeOperation='screen';c.globalAlpha=(1-local/.32)*.3;
    const x=local/.32*w*1.4-w*.2,g=c.createLinearGradient(x-160,0,x+160,0);g.addColorStop(0,'#ffffff00');g.addColorStop(.5,accent);g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(x-160,0,320,h);c.restore();}
  const darkness=Math.max(1-smooth(t/.8),smooth((t-88)/2));if(darkness){c.fillStyle=`rgba(1,3,8,${darkness})`;c.fillRect(0,0,w,h);}
}
function encode(file,w,h){
  const child=spawn(ffmpeg,['-y','-v','error','-filter_threads','1','-threads','2','-f','rawvideo','-pix_fmt','rgba','-s',`${w}x${h}`,'-r',String(fps),'-i','pipe:0','-an','-c:v','libopenh264','-b:v','14M','-pix_fmt','yuv420p','-movflags','+faststart',file],{windowsHide:true,stdio:['pipe','ignore','pipe']});
  let errors='';child.stderr.on('data',b=>errors+=b);child.stdin.on('error',()=>{});
  const done=new Promise((res,rej)=>{child.on('error',rej);child.on('close',n=>n===0?res():rej(Error(errors)));});done.catch(()=>{});return {child,done};
}
async function send(enc,c){
  if(enc.child.stdin.destroyed){await enc.done;throw Error('Encoder closed early');}
  const p=c.getImageData(0,0,c.canvas.width,c.canvas.height).data;
  if(!enc.child.stdin.write(Buffer.from(p.buffer,p.byteOffset,p.byteLength)))await Promise.race([once(enc.child.stdin,'drain'),enc.done.then(()=>{throw Error('Encoder ended before drain');})]);
}
async function main(){
  const a=encode(path.join(out,`${stem}-part-${start}-Landscape.mp4`),1920,1080),b=encode(path.join(out,`${stem}-part-${start}-Portrait.mp4`),1080,1920);
  try{
    for(let f=start*fps;f<end*fps;f++){
      const t=f/fps,index=Math.floor(t/shotLength),local=t-index*shotLength,[type,form]=shots[index],visual=visuals[type];
      if(f%(shotLength*fps)===0){
        visual.reset();const preroll=type===1&&form==='barrel'?3:type===2?3:.8;
        for(let i=0;i<=Math.round(preroll*10);i++)visual.draw(s,1920,1080,i*100,{form,bass:energy(0,t),mid:energy(1,t),treble:energy(2,t)});
        console.log(`${t}s / ${definitions[type][3]} / ${form}`);
      }
      const offset=type===1&&form==='barrel'?3:type===2?3:.8;
      visual.draw(s,1920,1080,(offset+local)*1000,{form,bass:energy(0,t),mid:energy(1,t),treble:energy(2,t)});
      compose(wc,false,t,index);compose(tc,true,t,index);
      if(f%(shotLength*fps)===225){fs.writeFileSync(path.join(out,`landscape-${index+1}.jpg`),wide.toBuffer('image/jpeg'));fs.writeFileSync(path.join(out,`portrait-${index+1}.jpg`),tall.toBuffer('image/jpeg'));}
      await Promise.all([send(a,wc),send(b,tc)]);
      if(f%(fps*5)===0)console.log(`Rendered ${t}/90 seconds`);
    }
    a.child.stdin.end();b.child.stdin.end();await Promise.all([a.done,b.done]);console.log(`Completed ${start}-${end}s`);
  }catch(e){a.child.kill();b.child.kill();throw e;}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
