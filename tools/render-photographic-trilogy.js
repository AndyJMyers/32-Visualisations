const fs=require('node:fs'),path=require('node:path'),{spawn,spawnSync}=require('node:child_process');
const {createCanvas}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),out=process.env.PHOTO_OUTPUT||path.resolve(root,'../../outputs/Light-Lens-Illusion');
const music=process.env.PHOTO_MUSIC||'C:/Users/mr__b/OneDrive/TVR MUSIC PLAYLIST/Mission to Mars.wav';
const ffmpeg=process.env.FFMPEG_PATH||'C:/Program Files/CEWE Creator/CEWE Creator/ffmpeg.exe';
const stem='32V-Light-Lens-Illusion-Mission-To-Mars',ranges=[[0,30],[30,60],[60,90]],children=[];
fs.mkdirSync(out,{recursive:true});
async function main(){
  try{if(!process.argv.includes('--assemble-only'))await Promise.all(ranges.map(([start,end])=>new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[path.join(__dirname,'capture-photographic-trilogy.js')],{cwd:root,windowsHide:true,env:{...process.env,CAPTURE_START:String(start),CAPTURE_END:String(end)},stdio:['ignore','pipe','pipe']});
    children.push(child);let errors='';child.stdout.on('data',b=>process.stdout.write(`[${start}-${end}s] ${b}`));child.stderr.on('data',b=>errors+=b);
    child.on('error',reject);child.on('close',n=>n===0?resolve():reject(Error(errors||`Renderer exited ${n}`)));
  })));}catch(e){children.forEach(c=>c.kill());throw e;}
  for(const edition of ['Landscape','Portrait']){
    const list=path.join(out,`concat-${edition}.txt`);fs.writeFileSync(list,ranges.map(([start])=>`file '${path.join(out,`${stem}-part-${start}-${edition}.mp4`).replaceAll('\\','/')}'\nduration 30`).join('\n'));
    const final=path.join(out,`${stem}-${edition}-1080p60.mp4`);
    const inputs=['-f','concat','-safe','0','-i',list,'-ss','24','-i',music];
    let video=['-map','0:v:0','-c:v','copy'];
    if(edition==='Landscape'){
      // A clean promo masthead replaces overlapping in-player scene captions.
      const canvas=createCanvas(1920,84),c=canvas.getContext('2d'),header=path.join(out,'landscape-masthead.jpg');
      c.fillStyle='#03050c';c.fillRect(0,0,1920,84);c.font='500 20px Arial';c.fillStyle='#e4d5b3';let x=66;
      for(const ch of '32 VISUALISATIONS'){c.fillText(ch,x,50);x+=c.measureText(ch).width+3;}
      c.textAlign='right';c.font='500 18px Arial';c.fillStyle='#b8d2d5';c.fillText('MISSION TO MARS / ANDY J MYERS',1854,50);fs.writeFileSync(header,canvas.toBuffer('image/jpeg'));
      inputs.push('-loop','1','-i',header);video=['-filter_complex','[0:v][2:v]overlay=0:0:shortest=1[v]','-map','[v]','-c:v','libopenh264','-threads','2','-b:v','16M','-pix_fmt','yuv420p'];
    }
    const r=spawnSync(ffmpeg,['-y','-v','error','-filter_complex_threads','1',...inputs,...video,'-map','1:a:0','-af','volume=-1.5dB,afade=t=in:d=0.6,afade=t=out:st=87:d=3','-c:a','aac','-b:a','192k','-t','90','-movflags','+faststart',final],{windowsHide:true,encoding:'utf8',maxBuffer:1024*1024});
    if(r.status!==0)throw Error(r.stderr||'Assembly failed');console.log('Completed '+final);
  }
  fs.writeFileSync(path.join(out,'edit-notes.json'),JSON.stringify({title:'Light. Lens. Illusion.',duration:90,fps:60,nativeLandscape:[1920,1080],nativePortrait:[1080,1920],music,musicStart:24,musicEnd:114,audioGainDb:-1.5,sourceTags:['schlieren-v1.0','anamorphic-v1.0','bipack-v1.0'],shotLength:7.5,shots:12,render:'Fresh music-reactive frames; no still-image shots or frame duplication'},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
