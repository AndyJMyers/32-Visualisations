const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const box={window:{},Math,Float32Array,OffscreenCanvas:function(w,h){return createCanvas(w,h);}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../schlieren.js'),'utf8'),box);
const visual=box.window.Schlieren,canvas=createCanvas(1440,900),c=canvas.getContext('2d');
const images=new Set();let elapsed=0,frames=0;
for(const [index,form] of ['ballistics','velvet','equine','velocity'].entries()){
  visual.reset();assert.equal(visual.draw(c,1440,900,0,{form}).time,0);
  const started=performance.now();let state;
  for(let f=1;f<=80;f++)state=visual.draw(c,1440,900,f*50,{form,bass:.8,mid:.6,treble:.5});
  elapsed+=performance.now()-started;frames+=80;
  assert.equal(state.form,form);assert.ok(state.time>3.9);assert.equal(state.fieldWidth,320);
  const still=canvas.toBuffer('image/png');images.add(still.toString('base64'));
  if(process.env.SCHLIEREN_PREVIEW)fs.writeFileSync(process.env.SCHLIEREN_PREVIEW+'-'+form+'.jpg',canvas.toBuffer('image/jpeg'));
  visual.draw(c,1440,900,9000,{form,animate:false});
  assert.ok(still.equals(canvas.toBuffer('image/png')),'Pause must be pixel stable');
  assert.equal(visual.draw(c,1440,900,90000,{form:index,animate:false}).time,state.time);
  assert.ok(still.equals(canvas.toBuffer('image/png')),'Paused audio must not advance effects');
}
assert.equal(images.size,4,'Four visibly distinct alchemies');
visual.reset();visual.draw(c,1440,900,0,{form:'velvet'});
for(let i=1;i<=20;i++)visual.draw(c,1440,900,i*50,{form:'velvet',bass:0,mid:0});
const quiet=canvas.toBuffer('image/png');visual.reset();visual.draw(c,1440,900,0,{form:'velvet'});
for(let i=1;i<=20;i++)visual.draw(c,1440,900,i*50,{form:'velvet',bass:1,mid:1});
assert.ok(!quiet.equals(canvas.toBuffer('image/png')),'Audio must change the field and motion');
visual.reset();assert.equal(visual.draw(c,360,780,0,{form:'velocity'}).time,0);
assert.equal(visual.draw(c,360,780,100000,{form:'equine'}).time,0,'Alchemy changes reset time');
assert.equal(visual.draw(c,360,780,100016,{form:'invalid'}).form,'ballistics');
console.log(`Schlieren passed: four alchemies, music response, pause, reset, numeric recipes and portrait. Offline canvas: ${(elapsed/frames).toFixed(1)} ms/frame.`);
