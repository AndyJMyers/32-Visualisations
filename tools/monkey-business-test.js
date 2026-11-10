const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'monkey-business.js'), 'utf8'), sandbox);
const scene = sandbox.window.MonkeyBusiness;
const canvas = createCanvas(1000, 600), c = canvas.getContext('2d');
const chapters = new Set();
const mischiefStages = new Set();
const cameos = new Set();
for (let frame = 0; frame < 760; frame++) {
  const state = scene.draw(c, 1000, 600, frame * 80, { bass: frame % 12 < 3 ? .9 : .1, mid: .5, treble: .4 });
  chapters.add(state.chapter);
  mischiefStages.add(state.mischiefStage);
  cameos.add(`${state.bananaOnAir}/${state.visitors}`);
  assert.ok(Number.isFinite(state.time) && Number.isFinite(state.drive));
  if (process.env.MONKEY_PREVIEW && [100, 235].includes(frame)) fs.writeFileSync(`${process.env.MONKEY_PREVIEW}-cameo-${frame}.png`, canvas.toBuffer('image/png'));
}
assert.equal(chapters.size, 3, 'All three tableaux play');
assert.equal(mischiefStages.size, 6, 'Drop, scoop, flight, splat and recovery all appear');
assert.ok(cameos.has('true/false') && cameos.has('false/true') && cameos.has('false/false'), 'Cameos enter and leave rather than becoming permanent overlays');
const images = new Set();
for (const recipe of scene.recipes) {
  const state = scene.draw(c, 1000, 600, 70000, { form: recipe.form, animate: false });
  assert.equal(state.form, recipe.form);
  images.add(canvas.toBuffer('image/png').toString('base64'));
  if (process.env.MONKEY_PREVIEW) fs.writeFileSync(`${process.env.MONKEY_PREVIEW}-${recipe.form}.png`, canvas.toBuffer('image/png'));
}
assert.equal(images.size, 4, 'Four distinct alchemies');
const paused = scene.draw(c, 1000, 600, 80000, { animate: false });
assert.equal(scene.draw(c, 1000, 600, 90000, { animate: false }).time, paused.time);
scene.reset();
assert.equal(scene.draw(c, 1000, 600, 0).time, 0);
const quiet = scene.draw(c, 1000, 600, 80, { bass: 0 });
const loud = scene.draw(c, 1000, 600, 160, { bass: 1, mid: 1 });
assert.ok(loud.drive > quiet.drive && loud.accent > quiet.accent, 'Music drives movement and accents');
for (const [w, h] of [[390, 844], [1920, 1080]]) scene.draw(c, w, h, 240, { form: 'moon' });
console.log('Monkey Business: three tableaux, four alchemies, audio response, pause/reset and aspect ratios passed');
