const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'kola-superdeep.js'), 'utf8'), sandbox);
const scene = sandbox.window.KolaSuperdeep;
const canvas = createCanvas(1000, 600), c = canvas.getContext('2d');
let previous = { depth: 0, scroll: 0, temperature: -2, pressure: 0 };
const discoveries = new Set(), physics = new Set();
for (let frame = 0; frame < 1200; frame++) {
  const state = scene.draw(c, 1000, 600, frame * 80, { bass: frame % 13 < 3 ? .9 : .2, mid: .4, treble: .3 });
  for (const key of ['depth', 'scroll', 'temperature', 'pressure']) {
    assert.ok(Number.isFinite(state[key]) && state[key] >= previous[key], `${key} never reverses or resets`);
  }
  assert.ok(state.depth - previous.depth < 17, 'Beats cannot jump the descent');
  state.visible.forEach(type => discoveries.add(type));
  physics.add(state.physics);
  previous = state;
}
assert.ok(previous.speculative, 'The survey crosses the real borehole limit without resetting');
assert.equal(discoveries.size, 5, 'Saucer/axe, creatures, city, crystals, and fossil machinery all appear');
assert.ok(physics.size >= 4, 'The rock regime changes as depth increases');
const images = new Set();
for (const recipe of scene.recipes) {
  const state = scene.draw(c, 1000, 600, 100000, { form: recipe.form, animate: false });
  assert.equal(state.depth, previous.depth, 'Changing alchemy preserves position');
  const image = canvas.toBuffer('image/png'); images.add(image.toString('base64'));
  if (process.env.KOLA_PREVIEW) fs.writeFileSync(`${process.env.KOLA_PREVIEW}-${recipe.form}.png`, image);
}
assert.equal(images.size, 4);
assert.equal(scene.draw(c, 1000, 600, 110000, { animate: false }).depth, previous.depth, 'Paused telemetry stays still');
scene.reset();
assert.equal(scene.draw(c, 1000, 600, 0).depth, 0);
console.log('Kola: continuous descent, telemetry, discoveries, four alchemies and pause/reset passed');
