const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'pollocks.js'), 'utf8'), sandbox);
const visual = sandbox.window.Pollocks;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const pictures = [];
for (const form of ['enamel', 'ink', 'molten', 'midnight']) {
  visual.reset();
  visual.draw(context, 900, 500, 1000, { form, bass: .1, mid: .3, treble: .4 });
  for (let i = 1; i <= 120; i++) visual.draw(context, 900, 500, 1000 + i * 80,
    { form, bass: i % 12 === 0 ? .85 : .2, mid: .6, treble: .5 });
  pictures.push(canvas.toBuffer('image/png'));
  if (process.env.POLLOCKS_TEST_OUTPUT) {
    fs.mkdirSync(process.env.POLLOCKS_TEST_OUTPUT, { recursive: true });
    fs.writeFileSync(path.join(process.env.POLLOCKS_TEST_OUTPUT, `${form}.png`), pictures.at(-1));
  }
}
assert.equal(new Set(pictures.map(image => image.toString('base64'))).size, 4,
  'The four alchemies render distinct materials');

visual.reset();
let first = visual.draw(context, 900, 500, 1000, { form: 'enamel', bass: .1 });
assert.equal(first.markCount, 9, 'A new song starts with a sparse underpainting');
let later;
for (let i = 1; i <= 120; i++) later = visual.draw(context, 900, 500, 1000 + i * 80,
  { form: 'enamel', bass: i % 12 === 0 ? .85 : .2, mid: .7, treble: .65 });
assert.ok(later.markCount > first.markCount, 'Music adds paint to the canvas');
const paused = visual.draw(context, 900, 500, 12000, { form: 'enamel', animate: false });
const still = canvas.toBuffer('image/png');
visual.draw(context, 900, 500, 20000, { form: 'enamel', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes the canvas');
const resumed = visual.draw(context, 900, 500, 26000, { form: 'enamel' });
assert.equal(resumed.time, paused.time, 'Resume does not leap forward');
visual.reset();
first = visual.draw(context, 360, 640, 27000, { form: 'midnight' });
assert.equal(first.markCount, 9, 'The next song starts a fresh portrait canvas');
assert.equal(first.time, 0);
console.log('Pollocks materials, accumulating paint, reset, portrait, and pause/resume passed.');
