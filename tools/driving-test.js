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
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'driving.js'), 'utf8'), sandbox);
const drive = sandbox.window.AutumnDrive;
assert.equal(drive.cars.length, 7);
assert.equal(drive.recipes.length, drive.cars.length);
assert.deepEqual(Array.from(drive.regions, region => region.id),
  ['yorkshire', 'newengland', 'tokyo', 'tuscany', 'alps']);
drive.reset();
let frame;
for (let i = 0; i <= 50; i++) frame = drive.draw(context, 900, 500, i * 100, { bass: .7, treble: .4 });
assert.equal(frame.car, 'chimaera');
assert.ok(frame.time > 4 && frame.bass > .6 && frame.treble > .3);
assert.equal(frame.shower, 0);
let sawShower = false, sawClearSkyAgain = false;
for (let i = 51; i <= 260; i++) {
  frame = drive.draw(context, 900, 500, i * 100);
  if (frame.shower > .5) sawShower = true;
  if (sawShower && frame.shower === 0) sawClearSkyAgain = true;
}
assert.ok(sawShower && sawClearSkyAgain, 'Showers arrive and then clear');
const paused = drive.draw(context, 400, 800, 100000, { animate: false });
assert.equal(paused.time, frame.time);
const resumed = drive.draw(context, 400, 800, 110000);
assert.equal(resumed.time, paused.time, 'Resuming does not jump forward');
for (const car of drive.cars) {
  const selected = drive.draw(context, 800, 480, 110100, { form: car.id });
  assert.equal(selected.car, car.id);
  assert.equal(selected.wheelSide, car.id === 'miura' ? 'left' : 'right', `${car.name} steering side`);
  if (car.id === 'miura') assert.equal(selected.region, 'alps', 'The Miura begins on the Alpine pass');
}
const visited = new Set();
let sawTransition = false;
for (let i = 1; i <= 1500; i++) {
  frame = drive.draw(context, 800, 480, 110100 + i * 100, { form: 'chimaera' });
  visited.add(frame.region);
  if (frame.transition > 0 && frame.transition < 1) sawTransition = true;
  assert.equal(frame.car, 'chimaera', 'The cockpit does not change with the landscape');
}
assert.deepEqual([...visited].sort(), ['alps', 'newengland', 'tokyo', 'tuscany', 'yorkshire']);
assert.ok(sawTransition, 'Landscapes blend into one another while driving');
console.log('Driving regions, passing showers, car selection, music response and pause checks passed.');
