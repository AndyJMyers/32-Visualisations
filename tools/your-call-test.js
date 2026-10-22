const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'your-call.js'), 'utf8'), sandbox);
const visual = sandbox.window.YourCall;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const pictures = [];
for (const [index, form] of ['menu', 'verify', 'queue', 'agent'].entries()) {
  visual.reset();
  const frame = visual.draw(context, 900, 500, 1000, { form, bass: .5, mid: .6, treble: .4 });
  assert.equal(frame.chapter, index, 'Each Alchemy opens in its own department');
  pictures.push(canvas.toBuffer('image/png'));
  if (process.env.YOUR_CALL_TEST_OUTPUT) {
    fs.mkdirSync(process.env.YOUR_CALL_TEST_OUTPUT, { recursive: true });
    fs.writeFileSync(path.join(process.env.YOUR_CALL_TEST_OUTPUT, `${form}.png`), pictures.at(-1));
  }
}
assert.equal(new Set(pictures.map(image => image.toString('base64'))).size, 4,
  'The four departments must look distinct');

visual.reset();
visual.draw(context, 900, 500, 1000, { form: 'menu', bass: .1 });
const beat = visual.draw(context, 900, 500, 1080, { form: 'menu', bass: .8 });
assert.equal(beat.beats, 1, 'A bass accent changes the menu state');
let advanced;
for (let i = 2; i <= 152; i++) advanced = visual.draw(context, 900, 500, 1000 + i * 80,
  { form: 'menu', bass: .2, mid: .6, treble: .4 });
assert.equal(advanced.chapter, 1, 'The menu eventually morphs into verification');
const paused = visual.draw(context, 900, 500, 20000, { form: 'menu', animate: false });
const still = canvas.toBuffer('image/png');
visual.draw(context, 900, 500, 30000, { form: 'menu', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes the artwork');
const resumed = visual.draw(context, 900, 500, 40000, { form: 'menu' });
assert.equal(resumed.time, paused.time, 'Resume cannot jump ahead');
visual.reset();
const portrait = visual.draw(context, 360, 640, 41000, { form: 'queue' });
assert.equal(portrait.chapter, 2);
assert.equal(portrait.time, 0);
console.log('Your call departments, morphing, music, portrait, and pause/resume passed.');
