const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'blair.js'), 'utf8'), sandbox);
const scene = sandbox.window.TonyBlair;
assert.deepEqual(Array.from(scene.recipes, recipe => recipe.form), ['red', 'newsprint', 'dossier', 'neon']);
assert.equal(scene.chapters.length, 7);

const canvas = createCanvas(960, 540);
const context = canvas.getContext('2d');
const visited = new Set();
const previews = [];
for (let frame = 0; frame < 1300; frame++) {
  const state = scene.draw(context, 960, 540, frame * 50, {
    bass: frame % 14 < 3 ? .85 : .34, mid: .5, treble: .4,
  });
  if (!visited.has(state.chapter)) previews.push(canvas.toBuffer('image/png'));
  visited.add(state.chapter);
  assert.ok(state.beat >= 0 && state.beat <= 1);
}
assert.equal(visited.size, 7, 'Every chapter appears');
const frozen = scene.draw(context, 960, 540, 66000, { animate: false });
assert.equal(scene.draw(context, 960, 540, 67000, { animate: false }).time, frozen.time, 'Pause freezes the story');
for (const form of ['red', 'newsprint', 'dossier', 'neon']) {
  assert.equal(scene.draw(context, 960, 540, 67000, { animate: false, form }).form, form);
}
scene.reset();
assert.equal(scene.draw(context, 960, 540, 0).chapter, 'THE LANDSLIDE');

if (process.env.BLAIR_PREVIEW) {
  const { loadImage } = require('@napi-rs/canvas');
  (async () => {
    const sheet = createCanvas(1920, 2160);
    const c = sheet.getContext('2d');
    for (let i = 0; i < previews.length; i++) {
      c.drawImage(await loadImage(previews[i]), (i % 2) * 960, Math.floor(i / 2) * 540);
    }
    fs.writeFileSync(process.env.BLAIR_PREVIEW, sheet.toBuffer('image/png'));
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
console.log('Blair chapters, alchemies, music response and pause checks passed.');
