const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const box={window:{}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../clubs.js'),'utf8'),box);
const clubs=box.window.Clubs, canvas=createCanvas(420,294), c=canvas.getContext('2d');
const seen=new Map(), sheet=createCanvas(1680,1176), sc=sheet.getContext('2d'), captured=new Set();
for(let ms=0;ms<=73000;ms+=100){
  const state=clubs.draw(c,420,294,ms,{bass:.75});
  if(!seen.has(state.rank)) seen.set(state.rank,new Set());
  seen.get(state.rank).add(state.phase);
  if(state.phase==='act' && state.time%5.6>2.7 && !captured.has(state.rank)){
    captured.add(state.rank);
    sc.drawImage(canvas,state.index%4*420,Math.floor(state.index/4)*294);
  }
}
assert.deepEqual([...seen.keys()],['A','2','3','4','5','6','7','8','9','10','J','Q','K']);
for(const phases of seen.values())assert.deepEqual([...phases],['entrance','act','exit']);
assert.equal(clubs.draw(c,420,294,73100).rank,'A');
const paused=clubs.draw(c,420,294,90000,{animate:false});
assert.deepEqual(clubs.draw(c,420,294,120000),paused);
const phone=createCanvas(390,844);
for(const [form] of clubs.forms)assert.equal(clubs.draw(phone.getContext('2d'),390,844,0,{form,animate:false}).rank,'A');
if(process.env.CLUBS_PREVIEW)fs.writeFileSync(process.env.CLUBS_PREVIEW,sheet.toBuffer('image/png'));
console.log('Clubs: all thirteen ranks, entrances, acts, exits, wrap, pause and portrait alchemies passed.');
