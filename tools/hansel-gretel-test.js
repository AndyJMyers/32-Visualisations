const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'hansel-gretel.js'), 'utf8'), sandbox);
const visual = sandbox.window.HanselGretel;
assert.equal(visual.chapters.length, 7);
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const output = process.env.HANSEL_GRETEL_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const image = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), image);
  return image;
};

const frames = new Map();
for (let i = 0; i <= 500; i++) {
  const state = visual.draw(context, 900, 500, i * 80, {
    form: 'woodland', speed: 3, bass: i % 13 === 0 ? .75 : .25, mid: .5, treble: .48,
  });
  assert.ok(state.offset >= 0 && state.offset < 900, 'The world scrolls left within its panel');
  if ([30, 85, 150, 245, 320, 400, 470].includes(i)) {
    frames.set(i, { ...state, image: save(`${i}-${state.chapter}`) });
  }
}
assert.deepEqual([...frames.values()].map(frame => frame.index), [0, 1, 2, 3, 4, 5, 6]);
assert.equal(new Set([...frames.values()].map(frame => frame.image.toString('base64'))).size, 7,
  'Every chapter renders distinct artwork');
const moods = [];
for (const form of ['woodland', 'moonlit', 'sugar', 'ink']) {
  visual.reset();
  for (let i = 0; i <= 22; i++) visual.draw(context, 900, 500, i * 80, { form, mid: .4, treble: .5 });
  moods.push(save(form));
}
assert.equal(new Set(moods.map(image => image.toString('base64'))).size, 4, 'Alchemy moods differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'woodland', bass: .4 });
const paused = visual.draw(context, 900, 500, 80, { form: 'woodland', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'woodland', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes the artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'woodland' }).time,
  paused.time, 'Resume does not jump');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'ink' }).form, 'ink');
console.log('Hansel and Gretel chapters, scrolling, Alchemy, portrait, and pause/resume passed.');
