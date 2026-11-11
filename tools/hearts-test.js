const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createCanvas} = require('@napi-rs/canvas');
const box = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../hearts.js'),'utf8'),box);
const hearts = box.window.Hearts;
const canvas = createCanvas(480,330), c = canvas.getContext('2d');
const sheet = createCanvas(1440,990), montage = sheet.getContext('2d');
const samples = [2,7.5,12,18.5,22.6,25.6,34,41.8,45];
let frame = 0, previous = 0;
hearts.draw(c,480,330,0);
for(let ms=50;ms<=48000;ms+=50){
  const state=hearts.draw(c,480,330,ms,{bass:.7,mid:.4,treble:.3});
  if(frame<samples.length && state.time>=samples[frame]){
    assert.ok(state.scene>=previous);
    assert.ok(state.pulse>=1);
    montage.drawImage(canvas,(frame%3)*480,Math.floor(frame/3)*330);
    previous=state.scene;
    frame++;
  }
  if(ms===48000) assert.equal(state.scene,0,'story loops back to the pump');
}
assert.equal(frame,samples.length);
assert.equal(previous,7);
const a=hearts.draw(c,480,330,90000,{animate:false});
const b=hearts.draw(c,480,330,100000,{animate:false});
assert.deepEqual(b,a);
assert.deepEqual(hearts.draw(c,480,330,110000),a,'resume does not jump');
const portrait=createCanvas(390,844);
for(const [i,[form]] of hearts.forms.entries()){
  hearts.reset();
  assert.equal(hearts.draw(portrait.getContext('2d'),390,844,0,{form}).form,i);
}
if(process.env.HEARTS_PREVIEW)fs.writeFileSync(process.env.HEARTS_PREVIEW,sheet.toBuffer('image/png'));
console.log('Hearts: all story chapters, wrap, pause/resume and portrait alchemies passed.');
