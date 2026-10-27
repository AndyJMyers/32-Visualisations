const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'plenty-of-puff.js'), 'utf8'), sandbox);
const scene = sandbox.window.PlentyOfPuff;
const forms = ['brass', 'furnace', 'blueprint', 'night'];
assert.deepEqual(Array.from(scene.recipes, recipe => recipe.form), forms);
assert.equal(scene.chapters.length, 4);

const canvas = createCanvas(960, 540);
const context = canvas.getContext('2d');
const visited = new Set();
const previews = [];
let previousPhase = 0;
let restingHeight = null;
for (let frame = 0; frame < 1200; frame++) {
  const state = scene.draw(context, 960, 540, frame * 50, {
    bass: frame % 11 < 3 ? .9 : .26, mid: .4, treble: .35,
  });
  visited.add(state.chapter);
  assert.ok(state.beat >= 0 && state.beat <= 1);
  assert.ok(state.phase >= previousPhase, 'A bass hit cannot reverse the drive shaft');
  assert.ok(state.phase - previousPhase < .2, 'A bass hit cannot jump the drive shaft');
  previousPhase = state.phase;
  if (state.index === 2 && state.time % 14 >= 6 && state.time % 14 < 8) {
    if (restingHeight === null) restingHeight = state.climbProgress;
    assert.equal(state.climbProgress, restingHeight, 'The climber rests at a rung before continuing');
  }
  if (Math.abs(state.time % 14 - 6) < .025 && previews.length <= state.index) {
    previews.push(canvas.toBuffer('image/png'));
  }
}
assert.equal(visited.size, 4, 'Every movement appears');
assert.equal(previews.length, 4, 'Every movement has a preview');
assert.notEqual(restingHeight, null, 'The climb includes a resting beat');
const frozen = scene.draw(context, 960, 540, 61000, { animate: false });
assert.equal(scene.draw(context, 960, 540, 62000, { animate: false }).time, frozen.time);
assert.equal(scene.draw(context, 960, 540, 62000, { animate: false }).phase, frozen.phase);
for (const form of forms) {
  assert.equal(scene.draw(context, 960, 540, 62000, { animate: false, form }).form, form);
}
scene.reset();
assert.equal(scene.draw(context, 960, 540, 0).chapter, 'THE ENGINE HOUSE');

if (process.env.PUFF_PREVIEW) {
  (async () => {
    const sheet = createCanvas(1920, 1080);
    const c = sheet.getContext('2d');
    for (let i = 0; i < previews.length; i++) {
      c.drawImage(await loadImage(previews[i]), (i % 2) * 960, Math.floor(i / 2) * 540);
    }
    fs.writeFileSync(process.env.PUFF_PREVIEW, sheet.toBuffer('image/png'));
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
console.log('Plenty of Puff movements, alchemies, music response and pause checks passed.');
