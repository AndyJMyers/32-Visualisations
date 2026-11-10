const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const box={window:{},Math,OffscreenCanvas:function(w,h){return createCanvas(w,h);}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../bipack.js'),'utf8'),box);
const visual=box.window.Bipack,canvas=createCanvas(1440,900),c=canvas.getContext('2d'),images=new Set();
for(const [index,form] of ['contact','glass','velvet','silver'].entries()){
  visual.reset();visual.draw(c,1440,900,0,{form});let state;
  for(let f=1;f<=80;f++)state=visual.draw(c,1440,900,f*80,{form,bass:.8,mid:.6,treble:.5});
  assert.equal(state.form,form);assert.equal(state.plates,2);assert.ok(state.time>6.3);
  const still=canvas.toBuffer('image/png');images.add(still.toString('base64'));
  if(process.env.BIPACK_PREVIEW)fs.writeFileSync(process.env.BIPACK_PREVIEW+'-'+form+'.jpg',canvas.toBuffer('image/jpeg'));
  visual.draw(c,1440,900,9000,{form,animate:false});assert.ok(still.equals(canvas.toBuffer('image/png')));
  assert.equal(visual.draw(c,1440,900,90000,{form:index,animate:false}).time,state.time);
  assert.ok(still.equals(canvas.toBuffer('image/png')),'Both plates and film weave must freeze');
}
assert.equal(images.size,4);visual.reset();
assert.equal(visual.draw(c,360,780,0).sourceWidth,960);
assert.equal(visual.draw(c,3840,2160,10).sourceWidth,1600);
visual.reset();visual.draw(c,1440,900,0);
for(let i=1;i<=20;i++)visual.draw(c,1440,900,i*50,{bass:0});
const quiet=canvas.toBuffer('image/png');visual.reset();visual.draw(c,1440,900,0);
for(let i=1;i<=20;i++)visual.draw(c,1440,900,i*50,{bass:1,treble:1});
assert.ok(!quiet.equals(canvas.toBuffer('image/png')),'Music must affect exposure and registration');
assert.equal(visual.draw(c,1440,900,9000,{form:'glass'}).time,0);
console.log('Bipack passed: four composites, two plates, pause, recipe mapping, audio response, portrait and bounded resolution.');
