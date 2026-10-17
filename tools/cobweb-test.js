const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(root, 'cobweb.js'), 'utf8'), sandbox);
const scene = sandbox.window.DawnCobweb;
const gradient = { addColorStop() {} };
const noop = () => {};
const context = new Proxy({ createLinearGradient: () => gradient, createRadialGradient: () => gradient }, {
  get(target, key) { return key in target ? target[key] : noop; },
  set(target, key, value) { target[key] = value; return true; },
});
assert.equal(scene.recipes.length, 5);
scene.reset();
const first = scene.draw(context, 800, 480, 1000, { animate: true, treble: 1 });
const next = scene.draw(context, 800, 480, 1100, { animate: true, treble: 1 });
assert.ok(next.time > first.time && next.energy > first.energy);
const paused = scene.draw(context, 800, 480, 5000, { animate: false });
assert.equal(paused.time, next.time, 'Static preview must not advance animation');
scene.draw(context, 480, 800, 10000, { animate: true, recipeIndex: 4 });
assert.equal(scene.draw(context, 480, 800, 10100, { animate: true }).time, next.time + .1, 'Resume must not jump after a pause');
console.log('Cobweb rendering and animation checks passed.');
