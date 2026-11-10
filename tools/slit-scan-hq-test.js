const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const box={window:{},Math,OffscreenCanvas:function(w,h){return createCanvas(w,h);}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../slit-scan.js'),'utf8'),box);
const visual=box.window.SlitScan,canvas=createCanvas(960,600),c=canvas.getContext('2d');
for(const form of ['platform','velvet','stargate','negative']){
  for(const quality of [1,2]){
    visual.reset();let state=visual.draw(c,960,600,0,{form,quality,sampleRate:60});
    assert.equal(state.sourceWidth,640*quality);assert.equal(state.sourceHeight,360*quality);
    for(let i=1;i<=8;i++)state=visual.draw(c,960,600,i*100,{form,quality,sampleRate:60,speed:3,bass:.8});
    assert.ok(state.samples>210);assert.equal(state.samplingHz,60);assert.equal(state.historySeconds,640/60);
    const frozen=visual.draw(c,960,600,1000,{form,quality,sampleRate:60,animate:false}),image=canvas.toBuffer('image/png');
    assert.equal(visual.draw(c,960,600,9000,{form,quality,sampleRate:60,animate:false}).samples,frozen.samples);
    assert.ok(image.equals(canvas.toBuffer('image/png')));
  }
}
visual.reset();let state;
for(let i=0;i<=75;i++)state=visual.draw(c,960,600,i*100,{form:'platform',quality:2,sampleRate:60,speed:3});
assert.ok(state.samples>1300);assert.ok(state.cursor>=0&&state.cursor<640);
visual.reset();assert.equal(visual.draw(c,360,780,0).sourceWidth,640);
assert.equal(visual.draw(c,1920,1080,0).sourceWidth,1280);
canvas.clientWidth=360;visual.reset();
assert.equal(visual.draw(c,1920,1080,0).sourceWidth,640,'High-DPI phones keep the lighter live tier');
console.log('HQ slit-scan: both quality tiers, 60 Hz sampling, unchanged exposure length, ring wrap, pause and small-display fallback passed.');
