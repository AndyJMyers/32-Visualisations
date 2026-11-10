const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..');
// Freeze the camera: changing projected geometry must come from the bodies, not a pan or zoom.
const source=fs.readFileSync(path.join(root,'orbital.js'),'utf8')
  .replace('const spin=time*.018,tilt=.52+Math.sin(time*.014)*.065;','const spin=0,tilt=.52;')
  .replace('roll=-.22+Math.sin(time*.008)*.035','roll=-.22')
  .replace('gordian?1120+150*Math.cos(time*.13):','gordian?1120:')
  .replace('return {recipes,draw,reset};','return {recipes,draw,reset,seek:t=>{time=t;}};');
const box={window:{},Math};vm.runInNewContext(source,box);
const visual=box.window.Orbital,canvas=createCanvas(640,384),native=canvas.getContext('2d');
let positions=[];
const c=new Proxy(native,{
  get(target,key){const value=target[key];if(typeof value!=='function')return value;
    if(key==='moveTo'||key==='lineTo')return(x,y)=>{assert.ok(Number.isFinite(x)&&Number.isFinite(y));positions.push(x,y);return value.call(target,x,y);};
    return value.bind(target);},
  set(target,key,value){target[key]=value;return true;},
});
for(const form of ['garden','midnight','ocean','machine']){
  visual.reset();visual.draw(c,640,384,0,{form,gordian:true,animate:false});
  const frames=[];
  for(const seconds of [4,6,6]){
    positions=[];visual.seek(seconds);
    const result=visual.draw(c,640,384,0,{form,gordian:true,animate:false});
    assert.equal(result.strands,8);assert.equal(result.phase,'writhing Gordian knot');frames.push(positions);
  }
  assert.notDeepEqual(frames[0],frames[1],'Geometry must writhe with the camera held still');
  assert.deepEqual(frames[1],frames[2],'Paused geometry must remain still');
}
visual.reset();visual.draw(c,640,384,0,{form:'machine',gordian:true,animate:false});
const interactionAt=t=>{visual.seek(t);return visual.draw(c,640,384,0,{form:'machine',gordian:true,animate:false}).interaction;};
assert.equal(interactionAt(1).expressions[1],'relaxed','Recipient does not react before the action');
assert.equal(interactionAt(4.3).expressions[1],'startled');
assert.equal(interactionAt(6).expressions[1],'annoyed');
assert.equal(interactionAt(7.5).expressions[1],'amused');
assert.equal(interactionAt(12.5).expressions[1],'pucker');
assert.equal(interactionAt(15).expressions[2],'blushing');
assert.equal(interactionAt(22.3).kind,'flick');
assert.equal(interactionAt(22.3).expressions[1],'startled');
const manifestFile=path.resolve(root,'../../outputs/Positronic-Platitudes-Gordian/edit-notes.json');
if(fs.existsSync(manifestFile)){
  const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
  assert.ok(manifest.shots.every(shot=>shot.type==='orbital'&&shot.sceneTime===shot.start));
}
const teaserFile=path.resolve(root,'../../outputs/Positronic-Platitudes-Gordian-45s/edit-notes.json');
if(fs.existsSync(teaserFile)){
  const teaser=JSON.parse(fs.readFileSync(teaserFile,'utf8'));
  assert.equal(teaser.duration,45);assert.equal(teaser.musicOffset,40);
  assert.equal(teaser.letterExplosionSeconds,3.4);
  assert.equal(teaser.shots[0].start,0);assert.equal(teaser.shots.at(-1).end,45);
  assert.equal(new Set(teaser.shots.map(s=>s.form)).size,4);
  teaser.shots.forEach((shot,i)=>{
    assert.equal(shot.type,'orbital');assert.equal(shot.sceneTime,20+shot.start);
    if(i)assert.equal(shot.start,teaser.shots[i-1].end);
  });
}
console.log('Gordian: intrinsic deformation, finite geometry, four alchemies, pause and a still-free continuous film timeline passed.');
