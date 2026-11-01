/* Three-minute editorial film. All moving art comes from the player's renderers. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const root = path.resolve(__dirname, '..');
const output = process.env.SHOWCASE_OUTPUT || path.resolve(root, '..', '..', 'outputs', '32V-Premiere');
const ffmpeg = process.env.FFMPEG_PATH || 'C:\\Program Files\\CEWE Creator\\CEWE Creator\\ffmpeg.exe';
const library = process.env.SHOWCASE_LIBRARY || 'C:\\Andy ChatGPT DALL-E aisongs';
const fps = 30, duration = 180, W = 1280, H = 720;
fs.mkdirSync(output, { recursive: true });
const track = (file, title, offset) => ({ file, title, offset });
const music = [
  track(path.join(library, 'Mr Flufferlumps Comes to Tea-#1.wav'), 'Mr Flufferlumps Comes to Tea', 12),
  track(path.join(library, 'Salt Light Litany suno1.wav'), 'Salt Light Litany', 35),
  track(path.join(library, 'Goddess of Last Resort.wav'), 'Goddess of Last Resort', 45),
  track(process.env.SHOWCASE_BAKLAVA || 'C:\\Users\\mr__b\\Downloads\\Canonical Baklava.wav', 'Canonical Baklava', 35),
  track(path.join(library, 'Lots Going On Here.wav'), 'Lots Going On Here', 35),
  track(path.join(library, 'Paraguay Isn\u2019t For Me, Pet.wav'), 'Paraguay Isn\u2019t For Me, Pet', 30),
].map((t, i) => ({ ...t, start: i * 29.6, length: 32 }));
// start, end, source, export, title, suit, treatment, preroll seconds, detail focus.
const shots = [
  [0,8,'starry-night.js','StarryNight','Starry Night','wands','cobalt',8,.5],
  [8,15,'walk-egyptian.js','WalkEgyptian','Walk Like an Egyptian','wands','gold',4,.5],
  [15,22,'old-school-games.js','OldSchoolGames','Old School Games','swords','popart',29,.5],
  [22,29.6,'your-call.js','YourCall','Your Call Is Important to Us','swords','menu',9,.5],
  [29.6,37,'busy-as-a-bee.js','BusyAsABee','Busy as a Bee','pentacles','bloom',20,.5],
  [37,44,'toadstools.js','AutumnToadstools','Toadstools','pentacles','golden',9,.48],
  [44,51,'cobweb.js','DawnCobweb','Dawn Cobweb','cups',3,9,.52],
  [51,59.2,'water-lilies.js','WaterLilies','Water Lilies','cups','awake',9,.5],
  [59.2,67,'champagne-fountain.js','ChampagneFountain','Champagne Fountain','cups','midnight',28,.5],
  [67,74,'shy-smiles.js','ShySmiles','Shy Smiles','cups','amber',17,.5],
  [74,81,'punting-with-ladies.js','PuntingWithLadies','Punting with Ladies','pentacles','champagnemischief',8,.5],
  [81,85,'@desktop',null,'The Orbital','cups',null,0,.5],
  [85,88.8,'@android',null,'Find Your Next Obsession','cups',null,0,.5],
  [88.8,96,'spaced.js','Spaced','Spaced','swords','solarwind',47,.5],
  [96,103,'p-np.js','PEqualsNP','P = NP?','swords','cosmos',16,.5],
  [103,110,'the-scream.js','TheScream','The Scream','swords','negative',10,.5],
  [110,118.4,'inner-space.js','InnerSpace','Inner Space','cups','bioluminescent',14,.5],
  [118.4,126,'plenty-of-puff.js','PlentyOfPuff','Plenty of Puff','pentacles','brass',15,.5],
  [126,134,'driving.js','AutumnDrive','Autumn Drive','pentacles','miura',20,.5],
  [134,141,'mondrian.js','Mondrian','Mondrian','pentacles','boogie',8,.5],
  [141,148,'pollocks.js','Pollocks','A Load of Pollocks','pentacles','midnight',12,.5],
  [148,155,'kola-superdeep.js','KolaSuperdeep','Kola Superdeep Borehole','pentacles','abyss',59,.7,true],
  [155,162,'boiling-pot.js','BoilingPot','Boiling Pot','cups','bluefire',11,.5,true],
  [162,170,'starry-night.js','StarryNight','Starry Night / Amber','wands','amber',8,.5],
  [170,180,'spaced.js','Spaced','Spaced / The Milky Way','swords','aurora',106,.5],
].map(([start,end,file,exported,title,suit,form,preroll,focus,development]) => ({start,end,file,exported,title,suit,form,preroll,focus,development:!!development}));
const headlines = [
  [1,7.6,'32 Visualisations','Your music. An extraordinary view.','hero'],
  [10,14.5,'A little more play.','A little less ordinary.'],
  [23,28.6,'Imagination, turned up.','Every song deserves a world.'],
  [31,36.8,'Four Arcana. Every mood.','Cups. Swords. Pentacles. Wands.'],
  [45,50.4,'Andy J Myers','Creative direction & engineering management','credit'],
  [53,58.6,'Your music. Local. Offline.','The files you love. A world of their own.'],
  [62,66.8,'Dress the music for the night.','Colour. Motion. A little chemistry.'],
  [75,80.4,'OpenAI Codex','Engineering & creative collaboration','credit'],
  [82,88.5,'Find the one.','Dual flywheels. Text search. Your collection.'],
  [97,102.6,'A little Alchemy.','Change the colour. Change the atmosphere.'],
  [111,117.6,'No cloud. No account. No tracking.','Your listening belongs to you.'],
  [120,125.8,'Keep your files. Keep your freedom.','Original worlds. No rented library.'],
  [136,140.8,'An original soundtrack','Music & creative production: Andy J Myers','credit'],
  [150,154.8,'Still stranger worlds ahead.','A glimpse of the development collection.'],
  [164,169.6,'Pay once. Keep playing.','No ads. No subscription.'],
  [173,179.5,'32 Visualisations','Own the music. Own the moment.','end'],
];
const suitColours = {cups:'#ebabc0',swords:'#99cceb',pentacles:'#c6d4a0',wands:'#d5b4fb'};
const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
const smooth = v => { const x=clamp(v); return x*x*(3-2*x); };
const fade = (t,a,b,r=.8) => smooth((t-a)/r)*smooth((b-t)/r);
const stage = createCanvas(W,H), s = stage.getContext('2d');
const old = createCanvas(W,H), oldContext = old.getContext('2d');
const landscape = createCanvas(W,H), lc=landscape.getContext('2d');
const portrait = createCanvas(720,1280), pc=portrait.getContext('2d');
const snapshots = new Map();
function run(args, maxBuffer=4*1024*1024) {
  const result=spawnSync(ffmpeg,args,{maxBuffer});
  if(result.status!==0) throw new Error(result.stderr.toString() || 'FFmpeg failed');
  return result.stdout;
}
function audio() {
  for(const t of music) if(!fs.existsSync(t.file)) throw new Error(`Missing soundtrack: ${t.file}`);
  const args=['-y','-v','error'];
  for(const t of music) args.push('-ss',String(t.offset),'-t',String(t.length),'-i',t.file);
  const filters=music.map((t,i)=>`[${i}:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-1.5:LRA=11,atrim=duration=32,asetpts=PTS-STARTPTS[a${i}]`);
  let previous='a0';
  for(let i=1;i<6;i++){const next=`mix${i}`;filters.push(`[${previous}][a${i}]acrossfade=d=2.4:c1=qsin:c2=qsin[${next}]`);previous=next;}
  filters.push(`[${previous}]atrim=duration=180,afade=t=in:d=1.3,afade=t=out:st=177:d=3,alimiter=limit=0.95:level=false[out]`);
  args.push('-filter_complex',filters.join(';'),'-map','[out]','-ar','48000','-c:a','pcm_s16le',path.join(output,'soundtrack-edit.wav'));
  run(args);
  return ['lowpass=f=220','highpass=f=220,lowpass=f=1800','highpass=f=1800'].map(filter=>run(['-v','error','-i',path.join(output,'soundtrack-edit.wav'),'-af',filter,'-ar','8000','-ac','1','-f','s16le','pipe:1'],4*1024*1024));
}
function energy(samples,band,t) {
  if(!samples)return [.45,.35,.3][band];
  const first=Math.floor(Math.max(0,t)*8000),end=Math.min(first+267,samples[band].length/2);
  let sum=0;
  for(let i=first;i<end;i++)sum+=(samples[band].readInt16LE(i*2)/32768)**2;
  return clamp(Math.sqrt(sum/Math.max(1,end-first))*[7,9,15][band]);
}
async function load(shot) {
  if(shot.file.startsWith('@')) {
    const image=await loadImage(path.join(output,shot.file==='@desktop'?'desktop-search.png':'android-flywheels.png'));
    return {image};
  }
  const sandbox={window:{},Math,performance:{now:()=>0},document:{createElement:()=>createCanvas(1,1)}};
  vm.runInNewContext(fs.readFileSync(path.join(root,shot.file),'utf8'),sandbox);
  const visual=sandbox.window[shot.exported];
  if(!visual||typeof visual.draw!=='function')throw new Error(`Missing renderer: ${shot.file}`);
  if(visual.reset)visual.reset();
  const ticks=Math.ceil(shot.preroll*20/3);
  for(let tick=0;tick<=ticks;tick++)visual.draw(s,W,H,tick*50,{form:shot.form,speed:3,bass:tick%13<3?.85:.25,mid:.4,treble:.3+(tick%9)*.03});
  return {visual,clock:ticks*50};
}
function drawStage(shot,renderer,t,samples) {
  s.setTransform(1,0,0,1,0,0);s.globalAlpha=1;s.globalCompositeOperation='source-over';
  if(renderer.image){
    s.fillStyle='#070c13';s.fillRect(0,0,W,H);
    const image=renderer.image;
    const scale=Math.min((W-110)/image.width,(H-35)/image.height)*(1+.015*clamp((t-shot.start)/(shot.end-shot.start)));
    s.drawImage(image,(W-image.width*scale)/2,(H-image.height*scale)/2,image.width*scale,image.height*scale);
  }else renderer.visual.draw(s,W,H,renderer.clock+(t-shot.start)*1000,{form:shot.form,speed:1,bass:energy(samples,0,t),mid:energy(samples,1,t),treble:energy(samples,2,t)});
}
function fillText(c,value,x,y,size,colour,{align='left',family='Arial',weight=400,max=1100}={}) {
  c.textAlign=align;c.fillStyle=colour;
  c.font=`${weight} ${size}px "${family}"`;
  while(size>10&&c.measureText(value).width>max){size--;c.font=`${weight} ${size}px "${family}"`;}
  c.fillText(value,x,y);
}
function icon(c,suit,x,y,size,colour) {
  c.save();c.translate(x,y);c.scale(size/40,size/40);c.strokeStyle=colour;c.lineWidth=1.4;c.lineCap='round';c.beginPath();
  if(suit==='cups'){c.moveTo(-13,-14);c.bezierCurveTo(-15,8,15,8,13,-14);c.moveTo(-13,-14);c.lineTo(13,-14);c.moveTo(0,3);c.lineTo(0,15);c.moveTo(-9,15);c.lineTo(9,15);}
  else if(suit==='pentacles'){c.arc(0,0,17,0,Math.PI*2);for(let i=0;i<6;i++){const a=-Math.PI/2+i*4*Math.PI/5;const p=[Math.cos(a)*14,Math.sin(a)*14];i?c.lineTo(...p):c.moveTo(...p);}}
  else for(const sign of [-1,1]){c.moveTo(sign*-13,15);c.lineTo(sign*12,-16);c.lineTo(sign*13,-8);c.moveTo(sign*-11,4);c.lineTo(sign*-2,11);if(suit==='wands'){c.moveTo(sign*6,-13);c.lineTo(sign*15,-13);}}
  c.stroke();c.restore();
}
function shade(c,width,height,portraitMode=false) {
  const top=c.createLinearGradient(0,0,0,portraitMode?350:160);top.addColorStop(0,'#030609d9');top.addColorStop(1,'#03060900');c.fillStyle=top;c.fillRect(0,0,width,portraitMode?350:160);
  const bottom=c.createLinearGradient(0,height*.58,0,height);bottom.addColorStop(0,'#03060900');bottom.addColorStop(1,'#030609ec');c.fillStyle=bottom;c.fillRect(0,height*.58,width,height*.42);
}
function composition(c,shot,t,vertical=false,play=false) {
  const w=vertical?720:W,h=vertical?1280:H,local=t-shot.start;
  c.save();
  c.fillStyle='#070b12';c.fillRect(0,0,w,h);
  if(vertical){
    c.save();c.globalAlpha=.35;c.drawImage(stage,-778,0,2276,1280);c.restore();
    c.fillStyle='#070b1255';c.fillRect(0,0,w,h);
    shade(c,w,h,true);
    fillText(c,'32 VISUALISATIONS',48,150,32,'#f1e3c6',{family:'Georgia',max:600});
    c.save();c.globalAlpha=fade(t,shot.start,shot.end,.6);
    icon(c,shot.suit,61,203,25,suitColours[shot.suit]);
    fillText(c,shot.suit.toUpperCase(),86,208,13,suitColours[shot.suit],{weight:600});
    fillText(c,shot.title,48,260,32,'#fff5df',{family:'Georgia',max:610});
    c.restore();
    if(shot.file==='@android'){
      const image=snapshots.get('android');
      const scale=Math.min(610/image.width,700/image.height);
      c.drawImage(image,360-image.width*scale/2,305,image.width*scale,image.height*scale);
    }else{
      c.drawImage(stage,32,319,656,369);
      const focus=shot.focus*W+Math.sin(local*.18)*20,crop=760;
      const cropY=shot.file==='toadstools.js'?320:shot.file==='water-lilies.js'?250:200;
      c.drawImage(stage,clamp(focus-crop/2,0,W-crop),cropY,crop,324.4,32,714,656,280);
      c.strokeStyle='#ddc39390';c.lineWidth=1;c.strokeRect(31.5,318.5,657,370);c.strokeRect(31.5,713.5,657,281);
    }
  }else{
    c.drawImage(stage,0,0,w,h);shade(c,w,h);
    c.save();c.globalAlpha=fade(t,shot.start,shot.end,.6);
    icon(c,shot.suit,45,43,28,suitColours[shot.suit]);
    fillText(c,`${shot.suit.toUpperCase()}  /  ${shot.title.toUpperCase()}`,70,48,14,'#fff0d5',{weight:600,max:950});
    c.restore();
    fillText(c,'32 V',1235,48,21,'#e4cf9e',{align:'right',family:'Georgia'});
  }
  if(shot.development)fillText(c,'DEVELOPMENT COLLECTION',vertical?48:46,vertical?296:75,11,'#d6bc87',{weight:600});
  // Credits and selling points breathe over the footage instead of replacing it.
  for(const [a,b,title,sub,kind]of headlines){
    const opacity=fade(t,a,b,kind==='hero'?1.2:.75);if(!opacity)continue;
    if(play&&(a>=150||a===164||kind==='end'))continue;
    c.save();c.globalAlpha=opacity;
    const hero=kind==='hero'||kind==='end';
    if(hero){
      c.fillStyle='#05091299';c.fillRect(0,vertical?350:175,w,vertical?350:300);
      fillText(c,'32',w/2,vertical?490:300,vertical?110:105,'#e8ce91',{align:'center',family:'Georgia'});
      fillText(c,'VISUALISATIONS',w/2,vertical?540:365,vertical?38:55,'#fff0d3',{align:'center',family:'Georgia',max:w-100});
      c.fillStyle='#d8bc83';c.fillRect(w/2-70,vertical?567:390,140,1);
      fillText(c,sub,w/2,vertical?608:430,vertical?23:24,'#f3e4c6',{align:'center',max:w-80});
      if(kind==='end'){
        fillText(c,'No ads. No subscription. Just your music.',w/2,vertical?653:465,vertical?17:17,'#c7c4bd',{align:'center',max:w-80});
        fillText(c,'Android / Google Play     Desktop / GitHub',w/2,vertical?690:495,vertical?14:14,'#bcb9af',{align:'center',max:w-70});
      }
    }else{
      const y=vertical?1038:565;
      fillText(c,title,vertical?48:48,y,kind==='credit'?(vertical?32:40):(vertical?28:37),'#fff0d6',{family:'Georgia',max:vertical?610:1150});
      fillText(c,sub,48,y+(vertical?32:37),vertical?16:19,'#c8c5bb',{max:vertical?610:1130});
      c.fillStyle='#d6b879';c.fillRect(48,y-(vertical?29:43),64,1);
    }
    c.restore();
  }
  const current=music.findLast(track=>t>=track.start)||music[0];
  const titleStart=current.start+(current.start===0?8:1.6);
  const songOpacity=fade(t,titleStart,Math.min(current.start+17,180),.9);
  if(songOpacity&&!(t>173)){
    c.save();c.globalAlpha=songOpacity;
    fillText(c,'ORIGINAL SOUNDTRACK',vertical?48:1234,vertical?169:648,vertical?9:10,'#c3b28e',{align:vertical?'left':'right',weight:600});
    fillText(c,current.title,vertical?48:1234,vertical?188:673,vertical?16:19,'#f1e3c6',{align:vertical?'left':'right',family:'Georgia',max:vertical?600:650});c.restore();
  }
  fillText(c,'32 VISUALISATIONS / MUSIC MADE VISIBLE',vertical?48:48,vertical?1230:688,10,'#b8b2a3',{max:w-80});
  c.fillStyle='#e6c98988';c.fillRect(vertical?48:48,vertical?1243:703,(w-96)*t/duration,1);
  const globalFade=Math.max(1-t/1.2,(t-178.4)/1.6,0);
  if(globalFade>0){c.fillStyle=`rgba(3,5,9,${globalFade})`;c.fillRect(0,0,w,h);}
  c.restore();
}
function encoder(filename,width,height,scaledWidth,scaledHeight,bitrate,seconds=180,audioFile='soundtrack-edit.wav') {
  const args=['-y','-v','error','-f','rawvideo','-pix_fmt','rgba','-s',`${width}x${height}`,'-r',String(fps),'-i','pipe:0','-i',path.join(output,audioFile),'-t',String(seconds),'-vf',`scale=${scaledWidth}:${scaledHeight}:flags=lanczos,format=yuv420p`,'-c:v','libopenh264','-b:v',bitrate,'-c:a','aac','-b:a','192k','-movflags','+faststart',path.join(output,filename)];
  const process=spawn(ffmpeg,args,{stdio:['pipe','ignore','pipe']});let errors='';
  process.stderr.on('data',chunk=>{errors+=chunk;});process.stdin.on('error',()=>{});
  const finished=new Promise((resolve,reject)=>{process.on('error',reject);process.on('close',code=>code===0?resolve():reject(new Error(errors)));});
  // Attach an early handler while the frame producer is still running.
  finished.catch(()=>{});
  return {process,finished};
}
async function pixels(encoder,context,w,h) {
  if(encoder.process.stdin.destroyed){await encoder.finished;throw new Error('Encoder closed early');}
  const data=context.getImageData(0,0,w,h).data;
  if(!encoder.process.stdin.write(Buffer.from(data.buffer,data.byteOffset,data.byteLength)))await once(encoder.process.stdin,'drain');
}
async function prepareImages() {
  snapshots.set('android',await loadImage(path.join(output,'android-flywheels.png')));
}
async function proofs() {
  await prepareImages();
  const contact=createCanvas(1920,Math.ceil(shots.length/4)*312),cc=contact.getContext('2d');
  cc.fillStyle='#080c12';cc.fillRect(0,0,contact.width,contact.height);
  for(let i=0;i<shots.length;i++){
    const shot=shots[i],renderer=await load(shot);
    for(let tick=0;tick<60;tick++)drawStage(shot,renderer,shot.start+tick/30,null);
    const x=i%4*480,y=Math.floor(i/4)*312;
    cc.drawImage(stage,x,y,480,270);fillText(cc,`${i+1}. ${shot.title}`,x+10,y+294,15,'#e7d4a8',{max:460});
    const t=shot.start+2;composition(lc,shot,t);composition(pc,shot,t,true);
    if([0,5,8,11,12,18,21,24].includes(i)){
      fs.writeFileSync(path.join(output,`proof-${String(i).padStart(2,'0')}-wide.jpg`),landscape.toBuffer('image/jpeg'));
      fs.writeFileSync(path.join(output,`proof-${String(i).padStart(2,'0')}-portrait.jpg`),portrait.toBuffer('image/jpeg'));
    }
    console.log(`Proof ${i+1}/${shots.length}: ${shot.title}`);
  }
  fs.writeFileSync(path.join(output,'shot-contact-sheet.jpg'),contact.toBuffer('image/jpeg'));
}
async function render() {
  await prepareImages();const samples=audio();
  const portraitOnly=process.argv.includes('--portrait-only');
  const wide=portraitOnly?null:encoder('32V-Premiere-YouTube-Rumble-1080p.mp4',W,H,1920,1080,'6M');
  const tall=encoder('32V-Premiere-Instagram-1080x1920.mp4',720,1280,1080,1920,'5M');
  let index=-1,renderer;
  try{
    for(let frame=0;frame<duration*fps;frame++){
      const t=frame/fps,next=shots.findIndex(shot=>t>=shot.start&&t<shot.end);
      if(next!==index){
        if(index>=0)oldContext.drawImage(stage,0,0);
        index=next;renderer=await load(shots[index]);console.log(`Shot ${index+1}/${shots.length}: ${shots[index].title}`);
      }
      const shot=shots[index];drawStage(shot,renderer,t,samples);
      const transition=smooth((t-shot.start)/.55);
      if(index&&transition<1){s.save();s.globalAlpha=1-transition;s.drawImage(old,0,0);s.restore();}
      if(wide)composition(lc,shot,t);composition(pc,shot,t,true);
      if(wide)await pixels(wide,lc,W,H);await pixels(tall,pc,720,1280);
      if(frame===Math.round(5*fps)||frame===Math.round(63*fps)){
        if(wide)fs.writeFileSync(path.join(output,`poster-${frame/fps}-wide.jpg`),landscape.toBuffer('image/jpeg'));
        fs.writeFileSync(path.join(output,`poster-${frame/fps}-portrait.jpg`),portrait.toBuffer('image/jpeg'));
      }
      if(frame%(fps*10)===0)console.log(`Rendered ${t}/180 seconds`);
    }
    if(wide)wide.process.stdin.end();tall.process.stdin.end();if(wide)await wide.finished;await tall.finished;
  }catch(error){if(wide)wide.process.kill();tall.process.kill();throw error;}
  if(portraitOnly){console.log(`Portrait refined: ${output}`);return;}
  run(['-y','-v','error','-i',path.join(output,'32V-Premiere-YouTube-Rumble-1080p.mp4'),'-vf','scale=960:540','-c:v','libopenh264','-b:v','1100k','-c:a','aac','-b:a','128k','-movflags','+faststart',path.join(output,'32V-Premiere-GitHub-540p.mp4')]);
  // The first minute uses established scenes, with no price or ranking claims.
  run(['-y','-v','error','-i',path.join(output,'32V-Premiere-YouTube-Rumble-1080p.mp4'),'-t','60','-vf','fade=t=out:st=58.8:d=1.2','-af','afade=t=out:st=58:d=2','-c:v','libopenh264','-b:v','4500k','-c:a','aac','-b:a','192k','-movflags','+faststart',path.join(output,'32V-Play-Preview-60s.mp4')]);
  console.log(`Finished: ${output}`);
}
function manifest() {
  fs.writeFileSync(path.join(output,'edit-manifest.json'),JSON.stringify({duration,fps,music,shots,headlines,credits:{direction:'Andy J Myers',engineering:'OpenAI Codex',music:'Andy J Myers'},note:'Rendered development showcase; not all pictured scenes are in the currently published Android release.'},null,2));
}
manifest();
(process.argv.includes('--proof')?proofs():render()).catch(error=>{console.error(error);process.exitCode=1;});
