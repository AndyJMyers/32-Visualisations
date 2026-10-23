const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'romans.js'), 'utf8'), sandbox);
const visual = sandbox.window.Romans;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const output = process.env.ROMANS_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const image = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), image);
  return image;
};
const checkpoints = new Map([
  [50, 'legions'], [200, 'forum'], [350, 'cleopatra'],
  [500, 'banquet'], [650, 'arena'], [800, 'bread'],
]);
const frames = [];
visual.reset();
for (let i = 0; i <= 850; i++) {
  const frame = visual.draw(context, 900, 500, i * 80, {
    form: 'imperial', bass: i % 10 === 0 ? .8 : .4, mid: .6, treble: .5,
  });
  if (checkpoints.has(i)) {
    assert.equal(frame.phase, checkpoints.get(i), `Scene at ${i * 80} ms`);
    frames.push(save(frame.phase));
  }
  if (i === 12) assert.ok(frame.beats > 0, 'Bass beats drive accents');
}
assert.equal(new Set(frames.map(image => image.toString('base64'))).size, 6, 'All six scenes differ');
const openingScenes = { imperial: 'legions', bacchanal: 'banquet', mosaic: 'forum', inferno: 'arena' };
const treatments = [];
for (const form of Object.keys(openingScenes)) {
  visual.reset();
  let frame;
  for (let i = 0; i <= 50; i++) frame = visual.draw(context, 900, 500, i * 80, { form, bass: .4, mid: .5 });
  assert.equal(frame.phase, openingScenes[form], `${form} follows its own route`);
  treatments.push(save(`${form}-opening`));
}
assert.equal(new Set(treatments.map(image => image.toString('base64'))).size, 4, 'Alchemy treatments differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'imperial', bass: .5 });
const paused = visual.draw(context, 900, 500, 80, { form: 'imperial', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'imperial', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'imperial' }).time, paused.time, 'Resume does not jump');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'mosaic' }).phase, 'forum');
console.log('Roman scenes, Alchemy, music, portrait and pause/resume passed.');
