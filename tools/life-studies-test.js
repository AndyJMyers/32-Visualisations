const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'life-studies.js'), 'utf8'), sandbox);
const visual = sandbox.window.LifeStudies;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const output = process.env.LIFE_STUDIES_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const image = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), image);
  return image;
};
const images = [], phases = [];
visual.reset();
for (let i = 0; i <= 600; i++) {
  const frame = visual.draw(context, 900, 500, i * 80, {
    form: 'atelier', bass: i % 9 === 0 ? .8 : .35, mid: .5, treble: .35,
  });
  if (i % 125 === 75) { phases.push(frame.phase); images.push(save(frame.phase)); }
  if (i === 18) assert.ok(frame.beats > 0, 'Bass accents register');
}
assert.equal(new Set(phases).size, 5, 'Five different studies appear');
assert.equal(new Set(images.map(image => image.toString('base64'))).size, 5, 'Five studies render differently');
const moods = [];
for (const form of ['atelier', 'nocturne', 'vermilion', 'bluewash']) {
  visual.reset();
  for (let i = 0; i <= 55; i++) visual.draw(context, 900, 500, i * 80, { form, bass: .45, mid: .6 });
  moods.push(save(form));
}
assert.equal(new Set(moods.map(image => image.toString('base64'))).size, 4, 'Alchemy moods differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'atelier', bass: .4 });
const paused = visual.draw(context, 900, 500, 80, { form: 'atelier', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'atelier', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'atelier' }).time, paused.time, 'Resume does not jump');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'bluewash' }).form, 'bluewash');
console.log('Life Studies poses, Alchemy, music, portrait and pause/resume passed.');
