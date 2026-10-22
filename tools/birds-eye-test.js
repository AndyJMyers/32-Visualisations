const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'birds-eye.js'), 'utf8'), sandbox);
const visual = sandbox.window.BirdsEye;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const images = [];
const output = process.env.BIRDS_EYE_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const picture = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), picture);
  return picture;
};
for (const form of ['orchard', 'village', 'rain', 'twilight']) {
  visual.reset();
  let frame = visual.draw(context, 900, 500, 0, { form, bass: .45, mid: .5, treble: .4 });
  assert.equal(frame.phase, 'magpie');
  assert.equal(frame.solo, form === 'orchard');
  save(`${form}-magpie`);
  for (let i = 1; i <= 70; i++) frame = visual.draw(context, 900, 500, i * 80, { form, bass: .45, mid: .5, treble: .4 });
  assert.equal(frame.phase, 'eye');
  save(`${form}-eye`);
  for (let i = 71; i <= 135; i++) frame = visual.draw(context, 900, 500, i * 80, { form, bass: .45, mid: .5, treble: .4 });
  assert.equal(frame.phase, 'flight');
  images.push(save(`${form}-flight`));
}
assert.equal(new Set(images.map(image => image.toString('base64'))).size, 4, 'Flight routes must be visibly distinct');
visual.reset();
const storyFrames = new Map([
  [230, 'fox-stalking'], [275, 'fox-pounce'], [325, 'fox-scraps'],
  [385, 'pipe-walking'], [450, 'pipe-filling'], [500, 'pipe-lighting'], [550, 'pipe-smoking'],
]);
let story;
for (let i = 0; i <= 585; i++) {
  story = visual.draw(context, 900, 500, i * 80, { form: 'orchard', bass: .4, mid: .6, treble: .3 });
  if (storyFrames.has(i)) save(storyFrames.get(i));
  if (i === 230 || i === 275 || i === 325) assert.equal(story.phase, 'fox');
  if (i === 385 || i === 450 || i === 500 || i === 550) assert.equal(story.phase, 'pipe');
}
assert.equal(story.phase, 'return', 'The flight eventually returns to the magpie');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'orchard', bass: .1 });
const beat = visual.draw(context, 900, 500, 80, { form: 'orchard', bass: .8 });
assert.equal(beat.beats, 1, 'Bass accents register');
const paused = visual.draw(context, 900, 500, 160, { form: 'orchard', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'orchard', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes the artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'orchard' }).time, paused.time,
  'Resume cannot leap forward');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'twilight' }).phase, 'magpie');
console.log('Birds Eye routes, fox hunt, pipe story, music, portrait, and pause/resume passed.');
