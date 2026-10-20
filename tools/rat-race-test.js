const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const gradient = { addColorStop() {} };
const eyeHeights = [];
const context = new Proxy({
  createLinearGradient: () => gradient,
  ellipse(x, y, rx, ry) { if (rx === 1.5 && (x === -6 || x === 7 || (x > -8 && x < 9))) eyeHeights.push(ry); },
}, {
  get(target, key) { return key in target ? target[key] : () => {}; },
  set(target, key, value) { target[key] = value; return true; },
});
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'rat-race.js'), 'utf8'), sandbox);
const visual = sandbox.window.RatRace;
assert.equal(visual.recipes.length, 3);
assert.equal(visual.scenes.length, 13);
visual.reset();
const seen = new Set();
let transition = null, finalScene = null, restart = null;
for (let i = 0; i <= 1220; i++) {
  const frame = visual.draw(context, 900, 500, i * 100, { bass: .6, treble: .4 });
  seen.add(frame.scene);
  if (frame.scene === 'alarm' && frame.transition > .2 && !transition) transition = frame;
  if (frame.scene === 'sleep') finalScene = frame;
  if (frame.cycle === 1 && frame.scene === 'alarm') restart = frame;
}
assert.deepEqual([...seen].sort(), Array.from(visual.scenes, ([name]) => name).sort());
assert.equal(transition.next, 'coffee', 'The next scene scrolls in from the right');
assert.ok(transition.transition > 0 && transition.transition < 1);
assert.equal(finalScene.next, 'alarm', 'Bedtime leads back to morning');
assert.ok(restart && restart.cycle === 1, 'The day repeats');
assert.ok(restart.bass > .5 && restart.treble > .3, 'Audio levels reach the visual');
assert.ok(Math.min(...eyeHeights) < .5 && Math.max(...eyeHeights) > 1.5,
  'The commuter blinks without exaggerated movement');
const paused = visual.draw(context, 400, 800, 200000, { animate: false });
assert.equal(paused.time, restart.time);
const resumed = visual.draw(context, 400, 800, 210000);
assert.equal(resumed.time, paused.time, 'Resuming does not skip the commute');
for (const form of ['clockwork','neon','after']) {
  assert.equal(visual.draw(context, 900, 500, 210100, { form }).form, form);
}
console.log('Rat Race scene order, leftward transitions, repeated day, audio, pause and moods passed.');
