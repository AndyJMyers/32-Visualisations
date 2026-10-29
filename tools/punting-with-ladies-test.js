const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'punting-with-ladies.js'), 'utf8'), sandbox);
const visual = sandbox.window.PuntingWithLadies;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const save = () => canvas.toBuffer('image/png');
visual.reset();
const frames = [];
for (let i = 0; i <= 1500; i++) {
  const state = visual.draw(context, 900, 500, i * 80, {
    form: 'firstfrost', speed: 1, bass: i % 12 === 0 ? .88 : .3, mid: .45, treble: .55,
  });
  if ([20, 350, 690, 1040, 1380].includes(i)) frames.push({ phase: state.phase, image: save() });
}
assert.deepEqual(frames.map(frame => frame.phase), [
  'FIRST FROST', 'THE CORK FLIES', 'PUNTING WITH LADIES', 'CONSEQUENCES?', 'MORNING AFTER',
]);
assert.equal(new Set(frames.map(frame => frame.image.toString('base64'))).size, 5, 'Each chapter has distinct imagery');
const moods = [];
for (const recipe of visual.recipes) {
  visual.reset();
  visual.draw(context, 900, 500, 0, { form: recipe.form, bass: .52, mid: .44, treble: .61, animate: false });
  moods.push(save());
}
assert.equal(new Set(moods.map(image => image.toString('base64'))).size, 4, 'Alchemy palettes differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'champagnemischief', bass: .4 });
const still = save();
visual.draw(context, 900, 500, 30000, { form: 'champagnemischief', animate: false });
assert.equal(Buffer.compare(still, save()), 0, 'Pause freezes artwork');
console.log('Punting with Ladies chapters, four winter alchemies and pause passed.');
