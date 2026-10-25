const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const gradient = { addColorStop() {} };
const context = new Proxy({ createLinearGradient: () => gradient }, {
  get(target, key) { return key in target ? target[key] : () => {}; },
  set(target, key, value) { target[key] = value; return true; },
});
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'churchill.js'), 'utf8'), sandbox);
const scene = sandbox.window.Churchill;
assert.equal(scene.chapters.length, 9);
assert.equal(scene.chapters[1][1], 'OMDURMAN');
assert.deepEqual(Array.from(scene.recipes, recipe => recipe.form),
  ['newsreel', 'dispatches', 'oils', 'blackout']);
const visited = new Set();
for (let i = 0; i < 1600; i++) {
  const frame = scene.draw(context, 900, 500, i * 50, { bass: i % 20 < 5 ? .8 : .1, mid: .3, treble: .2 });
  visited.add(frame.chapter);
  assert.ok(frame.pulse >= 0 && frame.pulse <= 1);
}
assert.equal(visited.size, 9, 'Every chapter appears');
const frozen = scene.draw(context, 900, 500, 81000, { animate: false });
assert.equal(scene.draw(context, 900, 500, 82000, { animate: false }).time, frozen.time, 'Pause freezes the story');
for (const form of ['newsreel', 'dispatches', 'oils', 'blackout']) {
  assert.equal(scene.draw(context, 900, 500, 82000, { animate: false, form }).form, form);
}
scene.reset();
assert.equal(scene.draw(context, 900, 500, 0).chapter, 'BLENHEIM');
console.log('Churchill chapters, alchemies, music response and pause checks passed.');
