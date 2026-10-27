const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'p-np.js'), 'utf8'), sandbox);
const scene = sandbox.window.PEqualsNP;
const forms = ['blueprint', 'chalk', 'clockwork', 'cosmos'];
assert.deepEqual(Array.from(scene.recipes, recipe => recipe.form), forms);
assert.equal(scene.chapters.length, 4);

const canvas = createCanvas(960, 540);
const context = canvas.getContext('2d');
const visited = new Set();
const previews = [];
for (let frame = 0; frame < 1200; frame++) {
  const state = scene.draw(context, 960, 540, frame * 50, {
    bass: frame % 12 < 3 ? .9 : .28, mid: .46, treble: .35,
  });
  visited.add(state.chapter);
  if (Math.abs(state.time % 14 - 6) < .025 && previews.length <= state.index) {
    previews.push(canvas.toBuffer('image/png'));
  }
  assert.ok(state.beat >= 0 && state.beat <= 1);
}
assert.equal(visited.size, 4, 'Every movement appears');
assert.equal(previews.length, 4, 'Every movement has a preview');
const frozen = scene.draw(context, 960, 540, 61000, { animate: false });
assert.equal(scene.draw(context, 960, 540, 62000, { animate: false }).time, frozen.time, 'Pause freezes the movement');
for (const form of forms) {
  assert.equal(scene.draw(context, 960, 540, 62000, { animate: false, form }).form, form);
  previews.push(canvas.toBuffer('image/png'));
}
scene.reset();
assert.equal(scene.draw(context, 960, 540, 0).chapter, 'THE SEARCH');

if (process.env.PNP_PREVIEW) {
  (async () => {
    const sheet = createCanvas(1920, 2160);
    const c = sheet.getContext('2d');
    for (let i = 0; i < previews.length; i++) {
      c.drawImage(await loadImage(previews[i]), (i % 2) * 960, Math.floor(i / 2) * 540);
    }
    fs.writeFileSync(process.env.PNP_PREVIEW, sheet.toBuffer('image/png'));
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
console.log('P = NP? movements, alchemies, music response and pause checks passed.');
