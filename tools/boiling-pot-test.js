const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'boiling-pot.js'), 'utf8'), sandbox);
const scene = sandbox.window.BoilingPot;
assert.deepEqual(Array.from(scene.recipes, recipe => recipe.form), ['tar', 'sulphur', 'bluefire', 'mine']);
const canvas = createCanvas(960, 540);
const context = canvas.getContext('2d');
let blastSeen = false;
for (let frame = 0; frame < 850; frame++) {
  const state = scene.draw(context, 960, 540, frame * 50, { bass: frame % 12 < 3 ? .9 : .1, mid: .3, treble: .2 });
  blastSeen ||= state.blastActive;
  assert.ok(Number.isFinite(state.time));
}
assert.ok(blastSeen, 'The old mine occasionally erupts');
const images = new Set();
for (const recipe of scene.recipes) {
  scene.draw(context, 960, 540, 43000, { form: recipe.form, animate: false });
  images.add(canvas.toBuffer('image/png').toString('base64'));
}
assert.equal(images.size, 4, 'Every alchemy has a distinct rendered palette');
const ventCounts = new Set();
let birdStruck = false;
for (const recipe of scene.recipes) {
  scene.reset();
  let ignitionSeen = false;
  for (let frame = 0; frame < 600; frame++) {
    const state = scene.draw(context, 960, 540, frame * 80, { form: recipe.form, bass: .8, mid: .5, treble: .4 });
    ventCounts.add(state.jetCount);
    ignitionSeen ||= state.activeJets > 0;
    birdStruck ||= state.birdsFalling > 0;
    if (process.env.BOILING_PREVIEW && frame === 145) {
      fs.writeFileSync(process.env.BOILING_PREVIEW.replace(/\.png$/, `-${recipe.form}.png`), canvas.toBuffer('image/png'));
    }
  }
  assert.ok(ignitionSeen, `${recipe.form} gas ignites into flame jets`);
}
assert.equal(ventCounts.size, 4, 'Alchemies have different eruption arrangements, not just palettes');
assert.ok(birdStruck, 'A bird crossing a live flame jet can be brought down');
const frozen = scene.draw(context, 960, 540, 44000, { animate: false });
assert.equal(scene.draw(context, 960, 540, 45000, { animate: false }).time, frozen.time);
if (process.env.BOILING_PREVIEW) fs.writeFileSync(process.env.BOILING_PREVIEW, canvas.toBuffer('image/png'));
console.log('Boiling Pot: distinct eruptions, gas ignition, bird strikes, and mine blast passed');
