/* One minute, four actual temporal exposures, original soundtrack. No still-image shots. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {spawn,spawnSync}=require('node:child_process'),{once}=require('node:events');
const {createCanvas}=require('@napi-rs/canvas');
const hq=process.argv.includes('--hq');
const root=path.resolve(__dirname,'..'),out=process.env.SLIT_OUTPUT||path.resolve(root,hq?'../../outputs/Slit-Scan-Perfection-HQ':'../../outputs/Slit-Scan-Perfection');
const music=process.env.SLIT_MUSIC||'C:/Users/mr__b/OneDrive/TVR MUSIC PLAYLIST/Perfection-#1.wav';
const ffmpeg=process.env.FFMPEG_PATH||'C:/Program Files/CEWE Creator/CEWE Creator/ffmpeg.exe';
const fps=hq?60:24,duration=60,musicStart=28;
const start=Number(process.env.CAPTURE_START||0),end=Number(process.env.CAPTURE_END||duration),part=process.env.CAPTURE_PART==='1';
const stem='Slit-Scan-Photography-Perfection-1'+(hq?'-HQ':'')+(part?`-part-${start}`:'');
const shots=[['platform','MIDNIGHT PLATFORM'],['velvet','VELVET TIME'],['stargate','INFINITY APERTURE'],['negative','NEGATIVE EXPOSURE']];
fs.mkdirSync(out,{recursive:true});
const box={window:{},Math,OffscreenCanvas:function(w,h){return createCanvas(w,h);}};
vm.runInNewContext(fs.readFileSync(path.join(root,'slit-scan.js'),'utf8'),box);
const visual=box.window.SlitScan,stage=createCanvas(hq?1920:960,hq?1200:600),s=stage.getContext('2d');
const wide=createCanvas(hq?1920:1280,hq?1080:720),wc=wide.getContext('2d'),tall=createCanvas(hq?1080:720,hq?1920:1280),tc=tall.getContext('2d');
if(hq){wc.scale(1.5,1.5);tc.scale(1.5,1.5);}
const old=createCanvas(stage.width,stage.height),oldC=old.getContext('2d');
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const fade=(t,a,b)=>smooth((t-a)/.8)*smooth((b-t)/.8);
const bands=['lowpass=f=220','highpass=f=220,lowpass=f=1800','highpass=f=1800'].map(filter=>{
  const r=spawnSync(ffmpeg,['-v','error','-ss',String(musicStart),'-t',String(duration),'-i',music,'-af',filter,'-ac','1','-ar','8000','-f','s16le','pipe:1'],{windowsHide:true,maxBuffer:3*1024*1024});
  if(r.status!==0||r.stdout.length<duration*16000)throw Error(r.stderr.toString()||'Soundtrack is too short');return r.stdout;
});
function energy(b,t){const start=Math.floor(t*8000),end=Math.min(start+334,bands[b].length/2);let sum=0;for(let i=start;i<end;i++)sum+=(bands[b].readInt16LE(i*2)/32768)**2;return clamp(Math.sqrt(sum/Math.max(1,end-start))*[6,8,12][b]);}
function text(c,value,x,y,size,colour='#f1e5ce'){c.fillStyle=colour;c.font=`500 ${size}px Arial`;c.fillText(value,x,y);}
function compose(c,w,h,t,index,portrait){
  c.fillStyle='#040711';c.fillRect(0,0,w,h);
  if(portrait){
    const aspect=stage.width/stage.height,sw=h*aspect;
    c.drawImage(stage,(w-sw)/2,0,sw,h);c.fillStyle='#030610bf';c.fillRect(0,0,w,h);
    c.drawImage(stage,0,350,w,450);
    text(c,'SLIT-SCAN',30,119,57);text(c,'PHOTOGRAPHY',30,181,48,'#9fdce9');
    text(c,shots[index][1],30,290,22);
    text(c,'A NARROW APERTURE. A DIFFERENT MOMENT.',30,865,16,'#a9dbe2');
    text(c,'PERFECTION #1',30,1152,27);text(c,'ORIGINAL MUSIC / ANDY J MYERS',30,1184,16,'#a9dbe2');
    text(c,'32 VISUALISATIONS / WANDS',30,1240,18);
  }else{
    c.drawImage(stage,0,0,w,h);
    const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#020611aa');g.addColorStop(.24,'#02061100');g.addColorStop(.75,'#02061100');g.addColorStop(1,'#020611cc');c.fillStyle=g;c.fillRect(0,0,w,h);
    text(c,'32 VISUALISATIONS / SLIT-SCAN PHOTOGRAPHY',30,34,18);
    text(c,shots[index][1],30,651,24);text(c,'A NARROW APERTURE. A DIFFERENT MOMENT.',30,681,14,'#a9dbe2');
    c.textAlign='right';text(c,'PERFECTION #1',w-30,34,19);text(c,'ORIGINAL MUSIC / ANDY J MYERS',w-30,58,12,'#a9dbe2');c.textAlign='left';
  }
  const creditA=fade(t,18,24),creditB=fade(t,37,43);
  if(creditA||creditB){
    c.save();c.globalAlpha=Math.max(creditA,creditB);
    const x=30,y=portrait?965:106;
    text(c,creditA?'ANDY J MYERS':'OPENAI CODEX',x,y,portrait?28:27);
    text(c,creditA?'ART + ORIGINAL MUSIC':'CODE + CREATIVE COLLABORATION',x,y+29,14,'#a9dbe2');c.restore();
  }
  if(t>53){c.save();c.globalAlpha=fade(t,53,59.8);text(c,'LET TIME DANCE.',30,portrait?1015:118,portrait?39:36);c.restore();}
  const darkness=Math.max(1-clamp(t/.8),clamp((t-58)/2));
  if(darkness){c.fillStyle=`rgba(2,4,10,${darkness})`;c.fillRect(0,0,w,h);}
}
function encode(file,w,h,ow,oh){
  const fades=[start===0?'afade=t=in:d=0.5':null,end===duration?`afade=t=out:st=${end-start-2}:d=2`:null].filter(Boolean).join(',')||'anull';
  const child=spawn(ffmpeg,['-y','-v','error','-filter_complex_threads','1','-f','rawvideo','-pix_fmt','rgba','-s',`${w}x${h}`,'-r',String(fps),'-i','pipe:0','-ss',String(musicStart+start),'-i',music,
    '-filter_complex',`[0:v]scale=${ow}:${oh}:flags=lanczos,format=yuv420p[v];[1:a]${fades}[a]`,
    '-map','[v]','-map','[a]','-t',String(end-start),'-c:v','libopenh264','-b:v',hq?'15M':'7M','-c:a','aac','-b:a','192k','-movflags','+faststart',file],{windowsHide:true,stdio:['pipe','ignore','pipe']});
  let errors='';child.stderr.on('data',b=>errors+=b);child.stdin.on('error',()=>{});
  const done=new Promise((res,rej)=>{child.on('error',rej);child.on('close',n=>n===0?res():rej(Error(errors)));});done.catch(()=>{});return {child,done};
}
async function send(enc,c){if(enc.child.stdin.destroyed){await enc.done;throw Error('Encoder closed early');}const p=c.getImageData(0,0,c.canvas.width,c.canvas.height).data;if(!enc.child.stdin.write(Buffer.from(p.buffer,p.byteOffset,p.byteLength)))await once(enc.child.stdin,'drain');}
async function main(){
  const a=encode(path.join(out,stem+(hq?'-1080p60.mp4':'-1080p.mp4')),wide.width,wide.height,1920,1080);
  const b=encode(path.join(out,stem+(hq?'-Portrait-1080p60.mp4':'-Instagram.mp4')),tall.width,tall.height,1080,1920);
  try{
    for(let f=start*fps;f<end*fps;f++){
      const t=f/fps,index=Math.floor(t/15),local=t-index*15;
      if(f%(fps*15)===0){if(f>start*fps)oldC.drawImage(stage,0,0);visual.reset();console.log('Exposure '+(index+1)+'/4: '+shots[index][1]);}
      visual.draw(s,stage.width,stage.height,t*1000,{form:shots[index][0],bass:energy(0,t),mid:energy(1,t),treble:energy(2,t),speed:1.25,quality:hq?2:1,sampleRate:hq?60:30});
      if(index&&local<.7&&f-start*fps>=fps*.7){s.save();s.globalAlpha=1-smooth(local/.7);s.drawImage(old,0,0);s.restore();}
      compose(wc,1280,720,t,index,false);compose(tc,720,1280,t,index,true);
      if([7,22,37,52].includes(t)){fs.writeFileSync(path.join(out,`preview-${t}s.jpg`),wide.toBuffer('image/jpeg'));fs.writeFileSync(path.join(out,`portrait-${t}s.jpg`),tall.toBuffer('image/jpeg'));}
      await Promise.all([send(a,wc),send(b,tc)]);
      if(f%(fps*5)===0)console.log(`Rendered ${t} / 60 seconds`);
    }
    a.child.stdin.end();b.child.stdin.end();await Promise.all([a.done,b.done]);
    fs.writeFileSync(path.join(out,'edit-notes.json'),JSON.stringify({duration,music,musicStart,fps,nativeOutput:hq,sourceWidth:hq?1280:640,sourceHeight:hq?720:360,samplingHz:hq?60:30,shots,source:'Slit-Scan Photography: live temporal sampling throughout'},null,2));
    console.log('Completed: '+out);
  }catch(e){a.child.kill();b.child.kill();throw e;}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
