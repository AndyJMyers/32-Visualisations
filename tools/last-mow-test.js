const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const gradient = { addColorStop() {} };
const context = new Proxy({ createLinearGradient: () => gradient, createRadialGradient: () => gradient }, {
  get(target, key) { return key in target ? target[key] : () => {}; },
  set(target, key, value) { target[key] = value; return true; },
});
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'last-mow.js'), 'utf8'), sandbox);
const scene = sandbox.window.LastMow;
assert.equal(scene.recipes.length, 4);
scene.reset();
const states = {};
let previousMowed = .5, sawFlask = false;
const directions = new Set(), expressions = new Set(), mowerRows = new Set();
for (let i = 0; i <= 761; i++) {
  const frame = scene.draw(context, 800, 480, 1000 + i * 100, { bass: .4, treble: .3 });
  if ([0, 100, 250, 500, 680, 761].includes(i)) states[i] = frame;
  assert.equal(frame.leaves, 58); assert.equal(frame.rain, 38); assert.equal(frame.robin, true);
  assert.ok(frame.mowed >= .5 && frame.mowed <= 1);
  if (i < 760) assert.ok(frame.mowed >= previousMowed, 'The lawn does not become uncut during the day');
  if (frame.stage === 'mowing' || frame.stage === 'finishing') {
    directions.add(frame.direction); expressions.add(frame.expression); mowerRows.add(Math.round(frame.mowerY));
    sawFlask ||= frame.drinking;
  } else assert.equal(frame.drinking, false);
  previousMowed = frame.mowed;
}
assert.equal(states[0].stage, 'mowing'); assert.equal(states[0].mowed, .5);
assert.ok(states[100].mowed > .5 && states[100].mowed < .75, 'The first pass visibly mows before tea');
assert.equal(states[250].stage, 'tea'); assert.equal(states[250].mowed, .75); assert.equal(states[250].tea, true);
assert.equal(states[500].stage, 'finishing'); assert.ok(states[500].mowed > .75 && states[500].mowed < 1);
assert.equal(states[680].stage, 'home'); assert.equal(states[680].mowed, 1); assert.equal(states[680].leaving, true);
assert.equal(states[680].cutPasses, 4, 'All four tracked and clipped passes remain at the end of the day');
assert.equal(states[761].stage, 'mowing', 'The story starts again after the day ends');
assert.ok(sawFlask, 'The gardener takes a nip while mowing');
assert.equal(directions.size, 2, 'The mower makes outward and return passes');
assert.equal(expressions.size, 3, 'The gardener cycles through all three expressions');
assert.ok(mowerRows.size > 3, 'The mower moves between lawn strips');
const paused = scene.draw(context, 480, 800, 999999, { animate: false });
assert.equal(paused.time, states[761].time);
const resumed = scene.draw(context, 480, 800, 1000000, { animate: true });
assert.equal(resumed.time, paused.time, 'Resuming after a pause must not skip the story');
console.log('Last Mow story, weather and pause checks passed.');
