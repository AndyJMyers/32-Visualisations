const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'android-chicks.js'), 'utf8'), sandbox);
const visual = sandbox.window.AndroidChicks;
const forms = ['chrome', 'rose', 'ultraviolet', 'wildcard'];
assert.deepEqual(Array.from(visual.recipes, recipe => recipe.form), forms);
assert.equal(visual.chapters.length, 4);

const canvas = createCanvas(960, 540), context = canvas.getContext('2d');
const visited = new Set(), previews = [], palettePixels = new Set();
for (let frame = 0; frame < 900; frame++) {
  const state = visual.draw(context, 960, 540, frame * 50, {
    bass: frame % 12 < 3 ? .9 : .2, mid: .4, treble: .32,
  });
  visited.add(state.chapter);
  assert.ok(state.beat >= 0 && state.beat <= 1);
  assert.ok(state.energy >= 0 && state.energy <= 1);
  assert.ok(Number.isFinite(state.phase));
  if (Math.abs(state.local - 5) < .03 && previews.length <= state.index) previews.push(canvas.toBuffer('image/png'));
}
assert.equal(visited.size, 4, 'Introduction, date, agreeable loop, and X factor all appear');
assert.equal(previews.length, 4, 'Each chapter can be captured');

visual.reset();
for (const form of forms) {
  const state = visual.draw(context, 960, 540, 0, { form, animate: false });
  assert.equal(state.form, form);
  const pixel = context.getImageData(15, 15, 1, 1).data;
  palettePixels.add(Array.from(pixel).join(','));
}
assert.equal(palettePixels.size, 4, 'Each alchemy changes the actual canvas palette');
const frozen = visual.draw(context, 960, 540, 1000, { animate: false });
assert.equal(visual.draw(context, 960, 540, 2000, { animate: false }).time, frozen.time);
visual.reset();
assert.equal(visual.draw(context, 960, 540, 0).chapter, 'THE INTRODUCTION');

if (process.env.ANDROID_CHICKS_PREVIEW) {
  (async () => {
    const sheet = createCanvas(1920, 1080), c = sheet.getContext('2d');
    for (let i = 0; i < previews.length; i++) c.drawImage(await loadImage(previews[i]), (i % 2) * 960, Math.floor(i / 2) * 540);
    fs.writeFileSync(process.env.ANDROID_CHICKS_PREVIEW, sheet.toBuffer('image/png'));
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
console.log('Android Chicks chapters, alchemies, music response and pause checks passed.');
