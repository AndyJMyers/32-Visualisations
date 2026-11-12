const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const box={window:{}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../spades.js'),'utf8'),box);
const spades=box.window.Spades, canvas=createCanvas(420,294), c=canvas.getContext('2d');
const messages=new Set(), seen=new Map(), sheet=createCanvas(1680,1176), sc=sheet.getContext('2d'), captured=new Set();
for(let ms=0;ms<=130100;ms+=100){
  const state=spades.draw(c,420,294,ms,{bass:.75});
  messages.add(state.message);
  if(!seen.has(state.rank)) seen.set(state.rank,new Set());
  seen.get(state.rank).add(state.phase);
  if(state.phase==='act' && state.time%10>5 && !captured.has(state.rank)){
    captured.add(state.rank);
    sc.drawImage(canvas,state.index%4*420,Math.floor(state.index/4)*294);
  }
}
assert.equal(messages.size,6);
assert.deepEqual([...seen.keys()],['A','2','3','4','5','6','7','8','9','10','J','Q','K']);
for(const phases of seen.values())assert.deepEqual([...phases],['entrance','act','exit']);
assert.equal(spades.draw(c,420,294,130200).rank,'A');
const paused=spades.draw(c,420,294,150000,{animate:false});
assert.deepEqual(spades.draw(c,420,294,180000),paused);
const phone=createCanvas(390,844);
for(const [form] of spades.forms)assert.equal(spades.draw(phone.getContext('2d'),390,844,0,{form,animate:false}).rank,'A');
if(process.env.SPADES_PREVIEW)fs.writeFileSync(process.env.SPADES_PREVIEW,sheet.toBuffer('image/png'));
console.log('Spades: all thirteen ranks, entrances, acts, exits, wrap, pause and portrait alchemies passed.');
