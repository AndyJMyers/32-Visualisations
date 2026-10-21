const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'water-lilies.js'), 'utf8'), sandbox);
const visual = sandbox.window.WaterLilies;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500);
const context = canvas.getContext('2d');
const pictures = [];
for (const form of ['pond', 'negative', 'orange', 'awake']) {
  visual.reset();
  visual.draw(context, 900, 500, 1000, { form, animate: true });
  const frame = visual.draw(context, 900, 500, 1200, { form, bass: .8, mid: .6, treble: .7 });
  assert.equal(frame.form, form);
  assert.ok(frame.bass > 0 && frame.mid > 0 && frame.treble > 0);
  pictures.push(canvas.toBuffer('image/png'));
  if (process.env.WATER_LILIES_TEST_OUTPUT) {
    fs.mkdirSync(process.env.WATER_LILIES_TEST_OUTPUT, { recursive: true });
    fs.writeFileSync(path.join(process.env.WATER_LILIES_TEST_OUTPUT, `${form}.png`), pictures.at(-1));
  }
}
assert.equal(new Set(pictures.map(image => image.toString('base64'))).size, 4, 'Alchemy changes the scene');
visual.reset();
visual.draw(context, 900, 500, 1000, { form: 'pond' });
const first = Buffer.from(context.getImageData(0, 0, 900, 500).data);
for (let i = 1; i <= 70; i++) visual.draw(context, 900, 500, 1000 + i * 80, { form: 'pond', bass: .6, mid: .5 });
const later = Buffer.from(context.getImageData(0, 0, 900, 500).data);
let changed = 0;
for (let i = 0; i < first.length; i += 4) {
  if (Math.abs(first[i] - later[i]) + Math.abs(first[i + 1] - later[i + 1])
      + Math.abs(first[i + 2] - later[i + 2]) > 35) changed++;
}
assert.ok(changed > 1000, `The pond must visibly move (${changed} changed pixels)`);
visual.reset();
for (let i = 0; i <= 65; i++) visual.draw(context, 900, 500, 1000 + i * 80, { form: 'pond' });
const quiet = Buffer.from(context.getImageData(0, 0, 900, 500).data);
visual.reset();
for (let i = 0; i <= 65; i++) visual.draw(context, 900, 500, 1000 + i * 80,
  { form: 'pond', bass: .8, mid: .7, treble: .6 });
const loud = Buffer.from(context.getImageData(0, 0, 900, 500).data);
let audioChanges = 0;
for (let i = 0; i < quiet.length; i += 4) {
  if (Math.abs(quiet[i] - loud[i]) + Math.abs(quiet[i + 1] - loud[i + 1])
      + Math.abs(quiet[i + 2] - loud[i + 2]) > 35) audioChanges++;
}
assert.ok(audioChanges > 4000, `Music must visibly reshape the pond (${audioChanges} changed pixels)`);
const paused = visual.draw(context, 360, 640, 9000, { animate: false });
const still = Buffer.from(context.getImageData(0, 0, 360, 640).data);
visual.draw(context, 360, 640, 15000, { animate: false });
assert.equal(Buffer.compare(still, Buffer.from(context.getImageData(0, 0, 360, 640).data)), 0);
const resumed = visual.draw(context, 360, 640, 20000, { animate: true });
assert.equal(resumed.time, paused.time, 'Resume cannot leap forward');
assert.ok(visual.draw(context, 360, 640, 20100, { animate: true }).time > resumed.time);
console.log('Water Lilies palettes, animated pond, audio response, portrait rendering and pause/resume passed.');
