const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const gradient = { addColorStop() {} };
const context = new Proxy({
  createLinearGradient: () => gradient,
  createRadialGradient: () => gradient,
}, {
  get(target, key) { return key in target ? target[key] : () => {}; },
  set(target, key, value) { target[key] = value; return true; },
});
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'there-will-be-bones.js'), 'utf8'), sandbox);
const scene = sandbox.window.ThereWillBeBones;
assert.deepEqual(Array.from(scene.subjects, subject => subject.name),
  ['VOLE', 'DUCK', 'HUMAN', 'DINOSAUR', 'HUNTER-KILLER', 'AFTER HOURS']);
assert.deepEqual(Array.from(scene.recipes, recipe => recipe.form),
  ['cabinet', 'xray', 'fossil', 'cabaret']);

const visited = new Set();
for (let i=0; i<1160; i++) {
  const frame = scene.draw(context,900,500,i*50,{bass:i%30<5?.8:.12,mid:.4,treble:.3});
  visited.add(frame.subject);
  assert.ok(frame.pulse>=0 && frame.pulse<=1);
}
assert.equal(visited.size,6,'Every skeleton takes its turn in the spotlight');
const frozen=scene.draw(context,900,500,60000,{animate:false});
assert.equal(scene.draw(context,900,500,61000,{animate:false}).time,frozen.time,'Pause freezes the procession');
for(const form of ['cabinet','xray','fossil','cabaret']) {
  assert.equal(scene.draw(context,900,500,61000,{animate:false,form}).form,form);
}
scene.reset();
assert.equal(scene.draw(context,900,500,0).subject,'VOLE');
console.log('Bones subjects, music response, alchemies and pause checks passed.');
