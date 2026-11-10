const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const box={window:{},Math,OffscreenCanvas:function(w,h){return createCanvas(w,h);}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../slit-scan.js'),'utf8'),box);
const visual=box.window.SlitScan,canvas=createCanvas(960,600),c=canvas.getContext('2d');
const images=new Set();
for(const [i,form] of ['platform','velvet','stargate','negative'].entries()){
  visual.reset();const initial=visual.draw(c,960,600,0,{form});
  assert.equal(initial.samples,80);assert.equal(initial.cursor,0);
  let result;
  for(let f=1;f<=190;f++)result=visual.draw(c,960,600,f*80,{form,speed:2,bass:.7,mid:.5,treble:.4});
  assert.ok(result.samples>900,'Actual strips must accumulate and wrap through the temporal buffer');
  assert.ok(result.cursor>=0&&result.cursor<640);assert.ok(result.aperture>0&&result.aperture<640);
  const image=canvas.toBuffer('image/png');images.add(image.toString('base64'));
  if(process.env.SLIT_PREVIEW)fs.writeFileSync(process.env.SLIT_PREVIEW+'-'+form+'.png',image);
  const pause=visual.draw(c,960,600,20000,{form,animate:false}),still=canvas.toBuffer('image/png');
  const later=visual.draw(c,960,600,90000,{form,animate:false});
  assert.equal(later.time,pause.time);assert.equal(later.samples,pause.samples);assert.ok(still.equals(canvas.toBuffer('image/png')));
  assert.equal(visual.draw(c,960,600,91000,{form:i,animate:false}).form,form);
}
assert.equal(images.size,4);
visual.reset();assert.equal(visual.draw(c,360,780,0,{form:'stargate'}).time,0);
console.log('Slit-scan: four distinct exposures, real temporal sampling, ring-buffer wrap, pause, recipe mapping and portrait passed.');
