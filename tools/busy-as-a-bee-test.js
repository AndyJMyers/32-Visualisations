const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'busy-as-a-bee.js'), 'utf8'), sandbox);
const scene = sandbox.window.BusyAsABee;
const forms = ['meadow', 'bloom', 'hive', 'moonflower'];
assert.deepEqual(Array.from(scene.recipes, recipe => recipe.form), forms);
assert.equal(scene.chapters.length, 4);

const canvas = createCanvas(960, 540), context = canvas.getContext('2d');
const visited = new Set(), previews = [];
for (let frame = 0; frame < 1000; frame++) {
  const state = scene.draw(context, 960, 540, frame * 50, {
    bass: frame % 13 < 4 ? .9 : .22, mid: .38, treble: .31,
  });
  visited.add(state.chapter);
  assert.ok(state.beat >= 0 && state.beat <= 1);
  assert.ok(state.energy >= 0 && state.energy <= 1);
  assert.ok(Number.isFinite(state.pulse));
  if (Math.abs(state.local - 5.5) < .025 && previews.length <= state.index) previews.push(canvas.toBuffer('image/png'));
}
assert.equal(visited.size, 4, 'Courtship, colony building, foraging and dance all appear');
assert.equal(previews.length, 4, 'Every chapter has a captured preview');
const frozen = scene.draw(context, 960, 540, 51000, { animate: false });
assert.equal(scene.draw(context, 960, 540, 52000, { animate: false }).time, frozen.time);
for (const form of forms) assert.equal(scene.draw(context, 960, 540, 52000, { animate: false, form }).form, form);
scene.reset();
assert.equal(scene.draw(context, 960, 540, 0).chapter, 'MATING FLIGHT');

if (process.env.BEE_PREVIEW) {
  (async () => {
    const sheet = createCanvas(1920, 1080), c = sheet.getContext('2d');
    for (let i = 0; i < previews.length; i++) c.drawImage(await loadImage(previews[i]), (i % 2) * 960, Math.floor(i / 2) * 540);
    fs.writeFileSync(process.env.BEE_PREVIEW, sheet.toBuffer('image/png'));
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
console.log('Busy as a bee chapters, colour treatments, music response and pause checks passed.');
