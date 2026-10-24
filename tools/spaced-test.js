const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'spaced.js'), 'utf8'), sandbox);
const visual = sandbox.window.Spaced;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const output = process.env.SPACED_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const image = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), image);
  return image;
};

visual.reset();
const phases = new Map(), images = new Map();
for (let i = 0; i <= 1510; i++) {
  const state = visual.draw(context, 900, 500, i * 80, {
    form: 'observatory', bass: i % 10 === 0 ? .84 : .35, mid: .53, treble: .45,
  });
  if ([50, 160, 275, 390, 500, 615, 730, 840, 1050, 1330, 1460, 1510].includes(i)) {
    phases.set(i, state.phase);
    images.set(i, save(`${i}-${state.phase.toLowerCase().replaceAll(' ', '-')}`));
  }
  if (i === 20) assert.ok(state.beats > 0, 'Bass accents register');
}
assert.deepEqual([...phases.values()], ['NEPTUNE', 'URANUS', 'SATURN', 'JUPITER', 'MARS', 'EARTH', 'VENUS', 'MERCURY', 'THE SUN', 'MILKY WAY', 'MILKY WAY', 'NEPTUNE']);
assert.notEqual(Buffer.compare(images.get(1330), images.get(1460)), 0, 'Galactic pullback continues moving');
const moods = [];
for (const form of ['observatory', 'aurora', 'solarwind', 'negative']) {
  visual.reset();
  for (let i = 0; i <= 55; i++) visual.draw(context, 900, 500, i * 80, { form, bass: .45, mid: .5 });
  moods.push(save(form));
}
assert.equal(new Set(moods.map(image => image.toString('base64'))).size, 4, 'Alchemy moods differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'observatory', bass: .4 });
const paused = visual.draw(context, 900, 500, 80, { form: 'observatory', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'observatory', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'observatory' }).time, paused.time, 'Resume does not jump');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'aurora' }).form, 'aurora');
console.log('Spaced fly-bys, solar close pass, Milky Way, Alchemy and pause/resume passed.');
