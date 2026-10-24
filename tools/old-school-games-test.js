const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas } = require('@napi-rs/canvas');

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'old-school-games.js'), 'utf8'), sandbox);
const visual = sandbox.window.OldSchoolGames;
assert.equal(visual.recipes.length, 4);
const canvas = createCanvas(900, 500), context = canvas.getContext('2d');
const output = process.env.OLD_SCHOOL_GAMES_TEST_OUTPUT;
if (output) fs.mkdirSync(output, { recursive: true });
const save = name => {
  const image = canvas.toBuffer('image/png');
  if (output) fs.writeFileSync(path.join(output, `${name}.png`), image);
  return image;
};
visual.reset();
const frames = new Map();
for (let i = 0; i <= 1600; i++) {
  const frame = visual.draw(context, 900, 500, i * 80, {
    form: 'tabletop', bass: i % 10 === 0 ? .82 : .37, mid: .52, treble: .42,
  });
  if ([65, 185, 265, 385, 435, 465, 585, 665, 705, 785, 865, 985, 1065, 1185, 1265, 1385, 1465, 1494, 1585].includes(i)) frames.set(i, { ...frame, image: save(`frame-${i}`) });
  if (i === 15) assert.ok(frame.beats > 0, 'Bass accents register');
  if (i === 1494) {
    const pixels = context.getImageData(350, 270, 400, 150).data;
    let bloodPixels = 0;
    for (let j = 0; j < pixels.length; j += 4) if (pixels[j] > 150 && pixels[j + 1] < 90 && pixels[j + 2] < 110) bloodPixels++;
    assert.ok(bloodPixels > 20, 'A forest arrow hit visibly sprays red');
  }
}
assert.equal(frames.get(65).phase, 'robots');
assert.equal(frames.get(185).phase, 'robots');
assert.equal(frames.get(265).phase, 'kerplunk');
assert.equal(frames.get(385).phase, 'kerplunk');
assert.equal(frames.get(435).ghostsVulnerable, false, 'Ghosts are ordinary before a power pill');
assert.equal(frames.get(465).ghostsVulnerable, true, 'Eating a power pill frightens the ghosts');
assert.ok(frames.get(665).invadersDestroyed > 0, 'Missiles remove invaders');
assert.ok(frames.get(785).invadersDestroyed > frames.get(665).invadersDestroyed, 'The formation thins during the scene');
for (const [phase, first, second] of [['maze', 465, 585], ['invaders', 665, 785], ['pong', 865, 985], ['hover', 1065, 1185], ['gridrunner', 1265, 1385], ['forest', 1465, 1585]]) {
  assert.equal(frames.get(first).phase, phase);
  assert.equal(frames.get(second).phase, phase);
  assert.notEqual(Buffer.compare(frames.get(first).image, frames.get(second).image), 0, `${phase} action evolves`);
}
assert.notEqual(Buffer.compare(frames.get(65).image, frames.get(185).image), 0, 'Robot action evolves');
assert.notEqual(Buffer.compare(frames.get(265).image, frames.get(385).image), 0, 'Sticks and marbles evolve');
const moods = [];
for (const form of ['tabletop', 'afterdark', 'blueprint', 'popart']) {
  visual.reset();
  for (let i = 0; i <= 55; i++) visual.draw(context, 900, 500, i * 80, { form, bass: .45, mid: .5 });
  moods.push(save(form));
}
assert.equal(new Set(moods.map(image => image.toString('base64'))).size, 4, 'Alchemy moods differ');
visual.reset();
visual.draw(context, 900, 500, 0, { form: 'tabletop', bass: .4 });
const paused = visual.draw(context, 900, 500, 80, { form: 'tabletop', animate: false });
const still = save('paused');
visual.draw(context, 900, 500, 30000, { form: 'tabletop', animate: false });
assert.equal(Buffer.compare(still, canvas.toBuffer('image/png')), 0, 'Pause freezes artwork');
assert.equal(visual.draw(context, 900, 500, 40000, { form: 'tabletop' }).time, paused.time, 'Resume does not jump');
visual.reset();
assert.equal(visual.draw(context, 360, 640, 50000, { form: 'afterdark' }).form, 'afterdark');
console.log('Eight Old School Games scenes, Alchemy, motion, portrait and pause/resume passed.');
