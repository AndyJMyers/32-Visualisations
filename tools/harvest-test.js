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
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'harvest.js'), 'utf8'), sandbox);
const scene = sandbox.window.HarvestTime;
assert.equal(scene.recipes.length, 3);
scene.reset();
const stages = new Set(), passes = new Set();
let frame, firstCut = false, loaded = false, reachedStore = false;
let movingLoadStart, movingLoadEnd, farEdge = false;
let deliveryStart, deliveryTurn, deliveryEnd;
let scrollStart, scrollMiddle, nextFieldStart, nextFieldCut, boardedAgain = false;
let flappingBirds, earlyBirds, departingBirds, laterBirds;
for (let i = 0; i <= 1460; i++) {
  frame = scene.draw(context, 900, 500, i * 100, { bass: .7, treble: .4 });
  if (i === 32) flappingBirds = frame.birds;
  if (i === 50) earlyBirds = frame.birds;
  if (i === 150) departingBirds = frame.birds;
  if (i === 250) laterBirds = frame.birds;
  stages.add(frame.stage);
  if (i > 700 && frame.stage === 'boarding') boardedAgain = true;
  if (i === 700) scrollStart = frame;
  if (i === 730) scrollMiddle = frame;
  if (i === 761) nextFieldStart = frame;
  if (i === 800) nextFieldCut = frame;
  if (frame.stage === 'cutting' || frame.stage === 'unloading') {
    passes.add(frame.pass);
    if (frame.cut[0] > .5) firstCut = true;
    if (frame.pass === 0 && frame.combineX > 725) farEdge = true;
  }
  if (frame.stage === 'unloading') {
    if (frame.load > .5) loaded = true;
    if (i === 460) movingLoadStart = frame;
    if (i === 530) movingLoadEnd = frame;
  }
  if (frame.stage === 'delivery') {
    if (frame.lorryY < 273 && frame.lorryX > 789 && frame.lorryX < 827 && frame.barnEntry > .9) reachedStore = true;
    if (i === 570) deliveryStart = frame;
    if (i === 630) deliveryTurn = frame;
    if (i === 695) deliveryEnd = frame;
  }
}
assert.deepEqual([...stages].sort(), ['boarding', 'cutting', 'delivery', 'reposition', 'unloading']);
assert.deepEqual([...passes].sort(), [0,1,2], 'The combine cuts three passes');
assert.ok(firstCut && loaded && reachedStore, 'Cut crop remains, the lorry loads and reaches storage');
assert.ok(farEdge, 'The combine works almost to the field edge');
assert.ok(movingLoadEnd.combineX > movingLoadStart.combineX + 100, 'The combine keeps cutting while loading');
assert.ok(movingLoadEnd.cut[2] > movingLoadStart.cut[2], 'The moving unload leaves a third cut pass');
assert.ok(Math.abs(movingLoadEnd.lorryX - movingLoadEnd.combineX - 150) < 1, 'The lorry matches the combine pace');
assert.ok(deliveryStart.lorryX > 865, 'The lorry first drives forward into the turn');
assert.ok(deliveryTurn.lorryTurn > .9, 'The lorry turns to show its rear as it heads away');
assert.ok(deliveryEnd.lorryX < deliveryTurn.lorryX && deliveryEnd.lorryY < deliveryTurn.lorryY,
  'The curved tramline brings the lorry back towards the shed');
assert.ok(deliveryEnd.lorrySize < .35 && deliveryEnd.barnEntry > .8,
  'The truck fits the doorway and disappears into the darker store');
assert.equal(scrollStart.stage, 'reposition', 'The combine continues after the delivery');
assert.equal(scrollMiddle.fieldIndex, 1, 'The camera advances to the next field');
assert.ok(scrollMiddle.scroll > .4 && scrollMiddle.scroll < .6, 'The completed field scrolls out');
assert.equal(nextFieldStart.stage, 'cutting', 'The next field starts without repeating the opening');
assert.equal(nextFieldStart.fieldIndex, 1);
assert.ok(nextFieldCut.cut[0] > 0, 'The combine cuts the new field');
assert.equal(boardedAgain, false, 'The farmer boards only once');
assert.ok(frame.bass > .6 && frame.treble > .3, 'Music changes motion and dust');
assert.ok(frame.fieldIndex >= 2, 'The harvest can continue through further fields');
assert.equal(earlyBirds.robinStage, 'perched');
assert.equal(departingBirds.robinStage, 'departing');
assert.equal(laterBirds.robinStage, 'gone');
assert.ok(Math.abs(laterBirds.kiteX - earlyBirds.kiteX) > 100, 'The kite wheels across the field');
assert.notEqual(laterBirds.kiteBank, earlyBirds.kiteBank, 'The kite banks through its turn');
assert.ok(Math.abs(flappingBirds.kiteFlap) > .1, 'The kite occasionally flaps between glides');
assert.notEqual(laterBirds.kestrelY, earlyBirds.kestrelY, 'The kestrel hovers and dives');
const paused = scene.draw(context, 400, 800, 100000, { animate: false });
assert.equal(paused.time, frame.time);
const resumed = scene.draw(context, 400, 800, 110000);
assert.equal(resumed.time, paused.time, 'Resuming does not skip the story');
for (const mood of ['amber','blue','storm']) assert.equal(scene.draw(context, 800, 480, 110100, { form: mood }).mood, mood);
console.log('Harvest boarding, repeated fields, grain transfer, storage run, birds, music response and pause checks passed.');
