const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'mondrian.js'), 'utf8'), sandbox);
const visual = sandbox.window.Mondrian;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const pictures = [];
for (const form of ['primary', 'midnight', 'copper', 'boogie']) {
  visual.reset();
  visual.draw(context, 900, 500, 1000, { form });
  const frame = visual.draw(context, 900, 500, 1080, { form, bass: .8, mid: .7, treble: .6 });
  assert.equal(frame.form, form);
  pictures.push(canvas.toBuffer('image/png'));
  if (process.env.MONDRIAN_TEST_OUTPUT) {
    fs.mkdirSync(process.env.MONDRIAN_TEST_OUTPUT, { recursive: true });
    fs.writeFileSync(path.join(process.env.MONDRIAN_TEST_OUTPUT, `${form}.png`), pictures.at(-1));
  }
}
assert.equal(new Set(pictures.map(image => image.toString('base64'))).size, 4, 'Alchemies change the palette');
const strokes = [];
let strokeStart;
const recorder = {
  save() {}, restore() {}, scale() {}, fillRect() {}, beginPath() {},
  moveTo(x, y) { strokeStart = [x, y]; },
  lineTo(x, y) { strokes.push([strokeStart, [x, y]]); },
  stroke() {},
};
visual.reset();
for (let i = 0; i <= 110; i++) visual.draw(recorder, 900, 500, 1000 + i * 80, { form: 'primary' });
assert.ok(strokes.length > 0, 'The composition draws grid lines');
assert.ok(strokes.every(([[x1, y1], [x2, y2]]) =>
  (x1 === x2 && y1 === 0 && y2 === 500) || (y1 === y2 && x1 === 0 && x2 === 900)),
  'Every grid stroke spans the canvas without a blinking internal endpoint');
const flashes = [];
recorder.fillRect = (x, y, w, h) => { if (w === 8 && h === 8) flashes.push([x, y]); };
visual.reset();
for (let i = 0; i < 110; i++) visual.draw(recorder, 900, 500, 1000 + i * 80,
  { form: 'boogie', bass: .8, mid: .7, treble: .6 });
assert.equal(flashes.length, 0, 'Boogie has no pulsing pixel squares');
visual.reset();
let early, later;
for (let i = 0; i <= 45; i++) early = visual.draw(context, 900, 500, 1000 + i * 80, { form: 'primary' });
const first = Buffer.from(context.getImageData(0, 0, 900, 500).data);
for (let i = 46; i <= 105; i++) later = visual.draw(context, 900, 500, 1000 + i * 80, { form: 'primary' });
const second = Buffer.from(context.getImageData(0, 0, 900, 500).data);
assert.ok(later.seed > early.seed, 'The composition progresses to a new layout');
let changed = 0;
for (let i = 0; i < first.length; i += 4) {
  if (Math.abs(first[i] - second[i]) + Math.abs(first[i + 1] - second[i + 1])
      + Math.abs(first[i + 2] - second[i + 2]) > 35) changed++;
}
assert.ok(changed > 10000, `Lines and blocks must visibly change (${changed} pixels)`);
visual.reset();
visual.draw(context, 900, 500, 1000, { form: 'primary', bass: .1 });
const beat = visual.draw(context, 900, 500, 1080, { form: 'primary', bass: .9, mid: .8, treble: .7 });
assert.equal(beat.beatCount, 1, 'A bass accent triggers a colour event');
const quiet = Buffer.from(context.getImageData(0, 0, 900, 500).data);
visual.reset();
visual.draw(context, 900, 500, 1000, { form: 'primary', bass: .1 });
visual.draw(context, 900, 500, 1080, { form: 'primary', bass: .1, mid: .8, treble: .7 });
assert.notEqual(Buffer.compare(quiet, Buffer.from(context.getImageData(0, 0, 900, 500).data)), 0,
  'Music changes the composition');
const paused = visual.draw(context, 360, 640, 9000, { animate: false });
const still = Buffer.from(context.getImageData(0, 0, 360, 640).data);
visual.draw(context, 360, 640, 15000, { animate: false });
assert.equal(Buffer.compare(still, Buffer.from(context.getImageData(0, 0, 360, 640).data)), 0);
const resumed = visual.draw(context, 360, 640, 20000, { animate: true });
assert.equal(resumed.time, paused.time, 'Resume cannot leap forward');
console.log('Mondrian palettes, evolving geometry, music accents, portrait and pause/resume passed.');
