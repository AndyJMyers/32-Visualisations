const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'the-scream.js'), 'utf8'), sandbox);
const visual = sandbox.window.TheScream;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const pictures = [];
for (const form of ['burning', 'flight', 'negative', 'electric']) {
  visual.reset();
  visual.draw(context, 900, 500, 1000, { form });
  let frame;
  for (let i = 1; i <= 35; i++) frame = visual.draw(context, 900, 500, 1000 + i * 80,
    { form, bass: .8, mid: .7, treble: .6 });
  assert.equal(frame.form, form);
  assert.equal(frame.direction, ['flight', 'electric'].includes(form) ? 'away' : 'towards');
  pictures.push(canvas.toBuffer('image/png'));
  if (process.env.THE_SCREAM_TEST_OUTPUT) {
    fs.mkdirSync(process.env.THE_SCREAM_TEST_OUTPUT, { recursive: true });
    fs.writeFileSync(path.join(process.env.THE_SCREAM_TEST_OUTPUT, `${form}.png`), pictures.at(-1));
  }
}
assert.equal(new Set(pictures.map(image => image.toString('base64'))).size, 4, 'Alchemies change the scene');
visual.reset();
let approach, retreat;
for (let i = 0; i <= 100; i++) approach = visual.draw(context, 900, 500, 1000 + i * 80, { form: 'burning' });
assert.ok(approach.depth > .6, 'The figure comes towards us');
visual.reset();
for (let i = 0; i <= 100; i++) retreat = visual.draw(context, 900, 500, 1000 + i * 80, { form: 'flight' });
assert.ok(retreat.depth < .4, 'The figure runs away');
const quiet = Buffer.from(context.getImageData(0, 0, 900, 500).data);
visual.reset();
for (let i = 0; i <= 100; i++) visual.draw(context, 900, 500, 1000 + i * 80,
  { form: 'flight', bass: .9, mid: .8, treble: .7 });
const loud = Buffer.from(context.getImageData(0, 0, 900, 500).data);
let changed = 0;
for (let i = 0; i < quiet.length; i += 4) {
  if (Math.abs(quiet[i] - loud[i]) + Math.abs(quiet[i + 1] - loud[i + 1])
      + Math.abs(quiet[i + 2] - loud[i + 2]) > 35) changed++;
}
assert.ok(changed > 2000, `Music must reshape the scene (${changed} changed pixels)`);
const paused = visual.draw(context, 360, 640, 9000, { animate: false });
const still = Buffer.from(context.getImageData(0, 0, 360, 640).data);
visual.draw(context, 360, 640, 15000, { animate: false });
assert.equal(Buffer.compare(still, Buffer.from(context.getImageData(0, 0, 360, 640).data)), 0);
const resumed = visual.draw(context, 360, 640, 20000, { animate: true });
assert.equal(resumed.time, paused.time, 'Resume cannot leap forward');
console.log('The Scream palettes, direction, audio response, portrait rendering and pause/resume passed.');
