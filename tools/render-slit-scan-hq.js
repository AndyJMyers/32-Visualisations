const fs=require('node:fs'),path=require('node:path'),{spawn,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),folder=path.resolve(root,'../../outputs/Slit-Scan-Perfection-HQ');
const ffmpeg=process.env.FFMPEG_PATH||'C:/Program Files/CEWE Creator/CEWE Creator/ffmpeg.exe';
const music=process.env.SLIT_MUSIC||'C:/Users/mr__b/OneDrive/TVR MUSIC PLAYLIST/Perfection-#1.wav';
const ranges=[[0,15],[15,30],[30,45],[45,60]],stem='Slit-Scan-Photography-Perfection-1-HQ',children=[];
fs.mkdirSync(folder,{recursive:true});
async function main(){
  try{if(!process.argv.includes('--assemble-only'))await Promise.all(ranges.map(([start,end])=>new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[path.join(__dirname,'capture-slit-scan-video.js'),'--hq'],{
      cwd:root,env:{...process.env,CAPTURE_START:String(start),CAPTURE_END:String(end),CAPTURE_PART:'1'},windowsHide:true,stdio:['ignore','pipe','pipe']});
    children.push(child);let errors='';child.stdout.on('data',b=>process.stdout.write(`[${start}-${end}s] ${b}`));
    child.stderr.on('data',b=>errors+=b);child.on('error',reject);child.on('close',n=>n===0?resolve():reject(Error(errors)));
  })));}catch(e){children.forEach(c=>c.kill());throw e;}
  for(const edition of ['1080p60','Portrait-1080p60']){
    const list=path.join(folder,`concat-${edition}.txt`);
    const videos=ranges.map(([start])=>{
      const source=path.join(folder,`${stem}-part-${start}-${edition}.mp4`),video=source.replace('.mp4','-video.mp4');
      // Exclude each worker's AAC priming timestamps before concatenating video.
      const r=spawnSync(ffmpeg,['-y','-v','error','-i',source,'-map','0:v:0','-c:v','copy','-an',video],{windowsHide:true,encoding:'utf8'});
      if(r.status!==0)throw Error(r.stderr||'Video extraction failed');return video;
    });
    fs.writeFileSync(list,videos.map(video=>`file '${video.replaceAll('\\','/')}'\nduration 15`).join('\n'));
    const final=path.join(folder,`${stem}-${edition}.mp4`);
    const r=spawnSync(ffmpeg,['-y','-v','error','-f','concat','-safe','0','-i',list,'-ss','28','-i',music,
      '-map','0:v:0','-map','1:a:0','-c:v','copy','-af','afade=t=in:d=0.5,afade=t=out:st=58:d=2','-c:a','aac','-b:a','192k','-t','60','-movflags','+faststart',final],{windowsHide:true,encoding:'utf8',maxBuffer:1024*1024});
    if(r.status!==0)throw Error(r.stderr||'HQ assembly failed');console.log('Completed '+final);
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
