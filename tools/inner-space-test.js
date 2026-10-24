const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'inner-space.js'), 'utf8'), sandbox);
const visual = sandbox.window.InnerSpace;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const output = process.env.INNER_SPACE_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const image = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), image);
  return image;
};

visual.reset();
const frames = new Map();
for (let i = 0; i <= 510; i++) {
  const state = visual.draw(context, 900, 500, i * 80, {
    form: 'anatomy', speed: 3, bass: i % 9 === 0 ? .85 : .39, mid: .52, treble: .47,
  });
  if ([30, 80, 150, 240, 320, 390, 470, 510].includes(i)) {
    frames.set(i, { phase: state.phase, image: save(`${i}-${state.phase.toLowerCase().replaceAll(' ', '-')}`) });
  }
  if (i === 20) assert.ok(state.beats > 0, 'Bass accents register');
}
assert.deepEqual([...frames.values()].map(frame => frame.phase),
  ['NASAL PASSAGE', 'TRACHEA', 'BRONCHIOLES', 'ALVEOLI', 'CAPILLARY', 'HEART', 'TISSUE', 'NASAL PASSAGE']);
assert.equal(new Set([...frames.values()].map(frame => frame.image.toString('base64'))).size, 8, 'Each chapter has distinct moving imagery');
const moods = [];
for (const form of ['anatomy', 'bioluminescent', 'watercolour', 'radiograph']) {
  visual.reset();
  for (let i = 0; i <= 30; i++) visual.draw(context, 900, 500, i * 80, { form, bass: .45, mid: .5 });
  moods.push(save(form));
}
assert.equal(new Set(moods.map(image => image.toString('base64'))).size, 4, 'Alchemy moods differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'anatomy', bass: .4 });
const paused = visual.draw(context, 900, 500, 80, { form: 'anatomy', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'anatomy', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'anatomy' }).time, paused.time, 'Resume does not jump');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'bioluminescent' }).form, 'bioluminescent');
console.log('Inner Space journey, seven chapters, Alchemy and pause/resume passed.');
