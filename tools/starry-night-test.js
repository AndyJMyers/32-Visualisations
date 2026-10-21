const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'starry-night.js'), 'utf8'), sandbox);
const visual = sandbox.window.StarryNight;
assert.equal(visual.recipes.length, 3);
const canvas = createCanvas(900, 500);
const context = canvas.getContext('2d');
const pictures = [];
const skyBrightness = [];
for (const form of ['cobalt', 'amber', 'silver']) {
  visual.reset();
  visual.draw(context, 900, 500, 1000, { form, animate: true });
  const frame = visual.draw(context, 900, 500, 1200, { form, bass: .8, mid: .6, treble: .7 });
  assert.equal(frame.form, form);
  assert.ok(frame.bass > 0 && frame.mid > 0 && frame.treble > 0);
  pictures.push(canvas.toBuffer('image/png'));
  const skyPixel = context.getImageData(450, 8, 1, 1).data;
  skyBrightness.push(skyPixel[0] + skyPixel[1] + skyPixel[2]);
  if (process.env.STARRY_NIGHT_TEST_OUTPUT) {
    fs.mkdirSync(process.env.STARRY_NIGHT_TEST_OUTPUT, { recursive: true });
    fs.writeFileSync(path.join(process.env.STARRY_NIGHT_TEST_OUTPUT, `${form}.png`), pictures.at(-1));
  }
}
assert.equal(new Set(pictures.map(image => image.toString('base64'))).size, 3, 'Alchemy changes the composition');
assert.ok(skyBrightness[2] > skyBrightness[0] + 240, 'Negative Tempest must invert the dark sky');
visual.reset();
visual.draw(context, 900, 500, 1000, { form: 'cobalt' });
const firstSky = context.getImageData(0, 0, 900, 300).data;
for (let i = 1; i <= 60; i++) visual.draw(context, 900, 500, 1000 + i * 80, { form: 'cobalt', bass: .6, mid: .5 });
const laterSky = context.getImageData(0, 0, 900, 300).data;
let changed = 0;
for (let i = 0; i < firstSky.length; i += 4) {
  if (Math.abs(firstSky[i] - laterSky[i]) + Math.abs(firstSky[i + 1] - laterSky[i + 1])
      + Math.abs(firstSky[i + 2] - laterSky[i + 2]) > 35) changed++;
}
assert.ok(changed > 15000, `The sky must visibly transform over a few seconds, not merely flicker (${changed} changed pixels)`);
visual.reset();
visual.draw(context, 900, 500, 1000, { speed: 3 });
const firstVillage = Buffer.from(context.getImageData(200, 425, 680, 20).data);
for (let i = 1; i <= 180; i++) visual.draw(context, 900, 500, 1000 + i * 80, { speed: 3 });
const laterVillage = Buffer.from(context.getImageData(200, 425, 680, 20).data);
assert.notEqual(Buffer.compare(firstVillage, laterVillage), 0, 'Village windows change over time');
const paused = visual.draw(context, 360, 640, 3000, { animate: false });
const pausedImage = Buffer.from(context.getImageData(0, 0, 360, 640).data);
visual.draw(context, 360, 640, 9000, { animate: false });
const heldImage = Buffer.from(context.getImageData(0, 0, 360, 640).data);
assert.equal(Buffer.compare(heldImage, pausedImage), 0, 'A paused frame holds still');
const resumed = visual.draw(context, 360, 640, 20000, { animate: true });
assert.equal(resumed.time, paused.time, 'Resuming cannot leap forward through the sky');
const moving = visual.draw(context, 360, 640, 20100, { animate: true, bass: .9 });
assert.ok(moving.time > resumed.time, 'The sky moves once playback resumes');
console.log('Starry Night palettes, animated sky and windows, audio response, portrait rendering and pause/resume passed.');
