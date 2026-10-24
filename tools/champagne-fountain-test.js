const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'champagne-fountain.js'), 'utf8'), sandbox);
const visual = sandbox.window.ChampagneFountain;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const output = process.env.CHAMPAGNE_FOUNTAIN_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const image = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), image);
  return image;
};

visual.reset();
const frames = new Map();
for (let i = 0; i <= 305; i++) {
  const state = visual.draw(context, 900, 500, i * 80, {
    form: 'gilded', speed: 3, bass: i % 9 === 0 ? .84 : .39, mid: .56, treble: .53,
  });
  if ([30, 130, 220, 305].includes(i)) frames.set(i, { ...state, image: save(`${i}-${state.phase.toLowerCase().replaceAll(' ', '-')}`) });
  if (i === 20) assert.ok(state.beats > 0, 'Bass accents register');
}
assert.deepEqual([...frames.values()].map(frame => frame.phase),
  ['CHAMPAGNE FOUNTAIN', 'COCKTAIL HOUR', 'TIPSY CAROUSEL', 'CHAMPAGNE FOUNTAIN']);
assert.ok(frames.get(130).cocktail > .9, 'The vessels become cocktails');
assert.ok(frames.get(220).tipsy > .9, 'The carousel grows more animated');
assert.equal(new Set([...frames.values()].map(frame => frame.image.toString('base64'))).size, 4, 'Each phase has distinct artwork');
const moods = [];
for (const form of ['gilded', 'rose', 'absinthe', 'midnight']) {
  visual.reset();
  for (let i = 0; i <= 40; i++) visual.draw(context, 900, 500, i * 80, { form, bass: .45, mid: .5 });
  moods.push(save(form));
}
assert.equal(new Set(moods.map(image => image.toString('base64'))).size, 4, 'Alchemy moods differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'gilded', bass: .4 });
const paused = visual.draw(context, 900, 500, 80, { form: 'gilded', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'gilded', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'gilded' }).time, paused.time, 'Resume does not jump');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'absinthe' }).form, 'absinthe');
console.log('Champagne Fountain, cocktail morph, carousel, Alchemy and pause/resume passed.');
