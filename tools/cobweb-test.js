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
for (let i = 0; i < scene.recipes.length; i++) {
  scene.reset();
  const frame = scene.draw(context, 480, 800, 1000, { animate: true, recipeIndex: i });
  assert.ok(frame.layers >= 5 && frame.layers <= 6, 'Each recipe should draw a bounded set of overlapping webs');
  assert.ok(frame.tears > 0, 'Webs should have gaps and partially woven threads');
  assert.ok(frame.spiders >= 2 && frame.spiders <= 6, 'Several spiders should inhabit the visible webs');
  assert.ok(frame.prey >= 1 && frame.prey <= frame.spiders, 'Trapped creatures should remain attached to intact web sections');
}
let sawPhage = false, sawFeeding = false;
for (let recipe = 0; recipe < scene.recipes.length; recipe++) {
  scene.reset();
  for (let frame = 0; frame < 200; frame++) {
    const state = scene.draw(context, 800, 480, 1000 + frame * 100, { animate: true, recipeIndex: recipe });
    sawPhage ||= state.phages > 0;
    sawFeeding ||= state.feeding > 0;
  }
}
assert.ok(sawPhage, 'Phage-shaped visitors should appear in the webs');
assert.ok(sawFeeding, 'Spiders should approach and feed on trapped butterflies');
try {
  const { createCanvas } = require('@napi-rs/canvas');
  const crypto = require('node:crypto');
  const hashes = new Set();
  for (let i = 0; i < scene.recipes.length; i++) {
    scene.reset();
    const canvas = createCanvas(480, 300), ctx = canvas.getContext('2d');
    scene.draw(ctx, 480, 300, 1000, { animate: true, recipeIndex: i });
    const hash = () => crypto.createHash('sha256').update(canvas.toBuffer('image/png')).digest('hex');
    const firstHash = hash(); hashes.add(firstHash);
    scene.draw(ctx, 480, 300, 1100, { animate: true, recipeIndex: i });
    assert.notEqual(hash(), firstHash, 'The scene should move when playing');
    scene.draw(ctx, 480, 300, 2000, { animate: false, recipeIndex: i });
    const pausedHash = hash();
    scene.draw(ctx, 480, 300, 9000, { animate: false, recipeIndex: i });
    assert.equal(hash(), pausedHash, 'The paused scene should remain visually still');
  }
  assert.equal(hashes.size, scene.recipes.length, 'Alchemy recipes should render distinct scenes');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
  console.log('Optional canvas pixel checks skipped: @napi-rs/canvas is not installed.');
}
console.log('Cobweb rendering and animation checks passed.');
