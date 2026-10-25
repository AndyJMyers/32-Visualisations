const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'beowulf.js'), 'utf8'), sandbox);
const visual = sandbox.window.Beowulf;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const output = process.env.BEOWULF_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const image = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), image);
  return image;
};

const frames = new Map();
for (let i = 0; i <= 440; i++) {
  const state = visual.draw(context, 900, 500, i * 80, {
    form: 'meadgold', speed: 3, bass: i % 9 === 0 ? .86 : .38, mid: .55, treble: .52,
  });
  if ([35, 115, 190, 270, 345].includes(i)) frames.set(i, { ...state, image: save(`${i}-chapter-${state.chapter}`) });
  if (i === 100 || i === 135) save(`${i}-grendel-action`);
  if (i === 20) assert.ok(state.beats > 0, 'Bass accents register');
}
assert.deepEqual([...frames.values()].map(frame => frame.chapter), [0, 1, 2, 3, 4]);
assert.equal(new Set([...frames.values()].map(frame => frame.image.toString('base64'))).size, 5,
  'Each narrative chapter has distinct artwork');
const moods = [];
for (const form of ['meadgold', 'inkiron', 'bloodmoon', 'wyrdfire']) {
  visual.reset();
  for (let i = 0; i <= 40; i++) visual.draw(context, 900, 500, i * 80, { form, bass: .44, mid: .5 });
  moods.push(save(form));
}
assert.equal(new Set(moods.map(image => image.toString('base64'))).size, 4, 'Alchemy moods differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'meadgold', bass: .4 });
const paused = visual.draw(context, 900, 500, 80, { form: 'meadgold', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'meadgold', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'meadgold' }).time,
  paused.time, 'Resume does not jump');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'wyrdfire' }).form, 'wyrdfire');
console.log('Beowulf chapters, Alchemy, portrait, and pause/resume passed.');
