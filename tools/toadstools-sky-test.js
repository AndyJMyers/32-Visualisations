const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const gradient = { addColorStop() {} };
const context = new Proxy({ createLinearGradient: () => gradient, createRadialGradient: () => gradient }, {
  get(target, key) { return key in target ? target[key] : () => {}; },
  set(target, key, value) { target[key] = value; return true; },
});
const sandbox = { window: {}, document: { createElement: () => ({ getContext: () => context }) }, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'toadstools.js'), 'utf8'), sandbox);
const scene = sandbox.window.AutumnToadstools;
assert.equal(scene.recipes.length, 6);
assert.equal(scene.recipes[5].form, 4);
scene.reset();
let atStart, atSky, atReturn;
for (let i = 0; i <= 800; i++) {
  const frame = scene.draw(context, 800, 480, i * 50, { form: 'skysnow', animate: true });
  if (i === 0) atStart = frame;
  if (i === 300) atSky = frame;
  if (i === 800) atReturn = frame;
}
assert.equal(atStart.altitude, 0);
assert.equal(atStart.snowflakes, 0);
assert.equal(atStart.airborne, 0, 'Amanitas start on the woodland floor');
assert.equal(atSky.altitude, 1, 'The camera reaches the sky');
assert.equal(atSky.snowflakes, 72, 'The snow population is bounded');
assert.equal(atSky.airborne, atSky.mushrooms, 'The amanitas travel into the sky');
assert.equal(atReturn.altitude, 0, 'The camera returns to the woodland');
assert.equal(atReturn.airborne, 0, 'The amanitas return to the ground');
const paused = scene.draw(context, 800, 480, 100000, { form: 'skysnow', animate: false });
assert.equal(paused.time, atReturn.time, 'Pausing does not advance the animation');
const ordinary = scene.draw(context, 800, 480, 100050, { form: 'golden', animate: true });
assert.equal(ordinary.altitude, 0);
assert.equal(ordinary.snowflakes, 0, 'Other alchemies do not gain snowfall');
assert.equal(ordinary.airborne, 0, 'Other alchemies stay on the woodland floor');
const restarted = scene.draw(context, 800, 480, 100100, { form: 'skysnow', animate: true });
assert.equal(restarted.altitude, 0, 'Returning to the recipe begins in the woodland');
console.log('Toadstool sky ascent and snowfall checks passed.');
