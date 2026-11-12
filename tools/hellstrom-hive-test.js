const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const box={window:{}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../hellstrom-hive.js'),'utf8'),box);
const hive=box.window.HellstromHive, canvas=createCanvas(1000,620), c=canvas.getContext('2d');
const phases=new Set();
for(let ms=0;ms<=38100;ms+=100){
  const state=hive.draw(c,1000,620,ms,{bass:ms%500===100?.85:.16,mid:.4,treble:.5});
  phases.add(state.phase);
  assert.equal(state.swarm,180);
  if(ms===100)assert.ok(state.burst>.5,'Bass onset launches the swarm');
  if(ms===17000&&process.env.HIVE_PREVIEW)fs.writeFileSync(process.env.HIVE_PREVIEW,canvas.toBuffer('image/png'));
  if(ms===22000)assert.equal(state.intruder,'approaching');
  if(ms===25500)assert.equal(state.intruder,'retreating');
  if(ms===33000)assert.equal(state.fanning,true);
  if(process.env.HIVE_PREVIEW && (ms===24000 || ms===33000)){
    const name=ms===24000?'intruder':'midday';
    fs.writeFileSync(path.join(path.dirname(process.env.HIVE_PREVIEW),'hive-'+name+'.png'),canvas.toBuffer('image/png'));
  }
  if(ms===38100)assert.equal(state.phase,0,'Cycle loops back to extraction');
}
assert.deepEqual([...phases],[0,1,2,3,4,5,6]);
const paused=hive.draw(c,1000,620,50000,{animate:false});
assert.deepEqual(hive.draw(c,1000,620,60000),paused);
const phone=createCanvas(390,844);
for(const [i,[form]] of hive.forms.entries()){
  assert.equal(hive.draw(phone.getContext('2d'),390,844,0,{form,animate:false}).form,i);
}
console.log('Hive: seven phases, 180 bees, bass onset, wasp retreat, ventilation, pause, loop and portrait alchemies passed.');
