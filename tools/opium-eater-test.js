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
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'opium-eater.js'), 'utf8'), sandbox);
const scene = sandbox.window.OpiumEater;
assert.equal(scene.recipes.length, 5);
assert.equal(scene.chapters.length, 6);
const visited = new Set();
const previewPath = process.argv[2];
const alchemyPreviewPath = process.argv[3];
const canvasLib = previewPath || alchemyPreviewPath ? require('@napi-rs/canvas') : null;
const preview = previewPath ? canvasLib.createCanvas(1350, 500) : null;
const alchemyPreview = alchemyPreviewPath ? canvasLib.createCanvas(1800, 250) : null;
const captured = new Set();
let alchemyCaptured = false;
let frame, translated = false, pulsed = false;
for (let i = 0; i < 1250; i++) {
  frame = scene.draw(context, 900, 500, i * 100, { bass: .7, mid: .5, treble: .6 });
  visited.add(frame.chapter);
  if (preview && frame.phase > .42 && !captured.has(frame.chapter)) {
    const tile = canvasLib.createCanvas(450, 250);
    scene.draw(tile.getContext('2d'), 450, 250, i * 100, { animate: false, form: 'london' });
    preview.getContext('2d').drawImage(tile, captured.size % 3 * 450, Math.floor(captured.size / 3) * 250);
    captured.add(frame.chapter);
  }
  if (alchemyPreview && frame.chapter === 'city' && frame.phase > .42 && !alchemyCaptured) {
    for (const [index, form] of ['london', 'scotland', 'greece', 'paris', 'rome'].entries()) {
      const tile = canvasLib.createCanvas(360, 250);
      scene.draw(tile.getContext('2d'), 360, 250, i * 100, { animate: false, form });
      alchemyPreview.getContext('2d').drawImage(tile, index * 360, 0);
    }
    alchemyCaptured = true;
  }
  translated ||= frame.slide > 0;
  pulsed ||= frame.pulse > .4;
}
assert.deepEqual([...visited], ['street', 'apothecary', 'music', 'city', 'dream', 'dawn']);
assert.ok(translated, 'Chapters slide left as the story travels right');
assert.ok(pulsed, 'Music and syncopated accents animate the scenes');
const paused = scene.draw(context, 400, 800, 200000, { animate: false });
assert.equal(paused.time, frame.time);
assert.equal(scene.draw(context, 400, 800, 210000).time, paused.time);
for (const form of ['london', 'scotland', 'greece', 'paris', 'rome']) {
  assert.equal(scene.draw(context, 900, 500, 210100, { form }).form, form);
}
scene.reset();
assert.equal(scene.draw(context, 900, 500, 0).chapter, 'street');
if (preview) fs.writeFileSync(previewPath, preview.toBuffer('image/png'));
if (alchemyPreview) fs.writeFileSync(alchemyPreviewPath, alchemyPreview.toBuffer('image/png'));
console.log('Opium Eater chapters, rightward narrative, music accents, alchemies and pause checks passed.');
