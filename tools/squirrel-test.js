const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const gradient = { addColorStop() {} };
const context = new Proxy({ createLinearGradient: () => gradient, measureText: text => ({ width: text.length * 6 }) }, {
  get(target, key) { return key in target ? target[key] : () => {}; },
  set(target, key, value) { target[key] = value; return true; },
});
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'squirrel.js'), 'utf8'), sandbox);
const scene = sandbox.window.SquirrelSequestering;
assert.equal(scene.recipes.length, 4);
scene.reset();
const stages = new Set();
const selected = new Set();
const directions = new Set();
const positions = new Set();
let frame;
for (let i = 0; i <= 170; i++) {
  frame = scene.draw(context, 900, 500, i * 100, { bass: .7, treble: .4 });
  stages.add(frame.stage);
  selected.add(frame.selected);
  directions.add(frame.journeys[0].facing);
  positions.add(`${frame.journeys[0].x.toFixed(2)},${frame.journeys[0].y.toFixed(2)}`);
  assert.equal(frame.squirrels, 4);
  assert.equal(frame.portrait, false);
}
assert.deepEqual([...stages].sort(), ['caching', 'carrying', 'gathering', 'searching']);
assert.equal(selected.size, 2, 'The point of view switches between named squirrels');
assert.equal(directions.size, 2, 'Squirrels face both ways along their journey');
assert.ok(positions.size > 10, 'Squirrels travel along their routes');
assert.ok(frame.bass > .6 && frame.treble > .3, 'Music levels influence the scene');
const paused = scene.draw(context, 400, 800, 100000, { animate: false });
assert.equal(paused.time, frame.time);
assert.equal(paused.portrait, true);
const resumed = scene.draw(context, 400, 800, 110000);
assert.equal(resumed.time, paused.time, 'Resuming does not skip the story');
for (const form of ['amber', 'mist', 'wind', 'dusk']) scene.draw(context, 800, 480, 110100, { form });
console.log('Squirrel story, music response, layout and pause checks passed.');
