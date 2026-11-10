const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const box={window:{},Math,OffscreenCanvas:function(w,h){return createCanvas(w,h);}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../anamorphic.js'),'utf8'),box);
const visual=box.window.AnamorphicSqueeze,canvas=createCanvas(1440,900),c=canvas.getContext('2d'),images=new Set();
for(const [index,form] of ['barrel','casino','alpine','abyss'].entries()){
  visual.reset();const initial=visual.draw(c,1440,900,0,{form});let state;
  for(let f=1;f<=100;f++)state=visual.draw(c,1440,900,f*80,{form,bass:.8,mid:.6,treble:.5});
  assert.equal(state.form,form);assert.ok(state.time>7.9);assert.notEqual(state.squeeze,initial.squeeze);
  const still=canvas.toBuffer('image/png');images.add(still.toString('base64'));
  if(process.env.ANAMORPHIC_PREVIEW)fs.writeFileSync(process.env.ANAMORPHIC_PREVIEW+'-'+form+'.jpg',canvas.toBuffer('image/jpeg'));
  visual.draw(c,1440,900,9000,{form,animate:false});assert.ok(still.equals(canvas.toBuffer('image/png')));
  assert.equal(visual.draw(c,1440,900,90000,{form:index,animate:false}).time,state.time);
  assert.ok(still.equals(canvas.toBuffer('image/png')),'Paused lens and action must stay frozen');
}
assert.equal(images.size,4);visual.reset();
assert.equal(visual.draw(c,360,780,0,{form:'alpine'}).sourceWidth,960);
assert.equal(visual.draw(c,3840,2160,10,{form:'abyss'}).sourceWidth,1920);
visual.reset();visual.draw(c,1440,900,0,{form:'casino'});
for(let i=1;i<=20;i++)visual.draw(c,1440,900,i*50,{form:'casino',bass:0});
const quiet=canvas.toBuffer('image/png');visual.reset();visual.draw(c,1440,900,0,{form:'casino'});
for(let i=1;i<=20;i++)visual.draw(c,1440,900,i*50,{form:'casino',bass:1});
assert.ok(!quiet.equals(canvas.toBuffer('image/png')),'Music must modulate the lens flare');
console.log('Anamorphic passed: four scenes, changing squeeze, audio response, pause, reset, recipes, portrait and bounded source resolution.');
