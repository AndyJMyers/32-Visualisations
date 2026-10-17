/* Integration checks: NODE_PATH=/path/to/node_modules node tools/season-test.js
   Test-only dependencies: jsdom and @napi-rs/canvas. No runtime dependencies. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM, VirtualConsole } = require('jsdom');
const { createCanvas } = require('@napi-rs/canvas');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const failures = [];
const logs = new VirtualConsole();
logs.on('jsdomError', error => failures.push(error.message));
const dom = new JSDOM(read('index.html').replace(/<script[\s\S]*?<\/script>/g, ''), {
  url: 'http://localhost:4173/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: logs,
});
const w = dom.window;
w.fetch = async () => ({ ok: true, json: async () => ({ directoryName: 'Test library', tracks: [] }) });
w.requestAnimationFrame = () => 1;
w.cancelAnimationFrame = () => {};
w.ResizeObserver = class { observe() {} disconnect() {} };
w.HTMLElement.prototype.scrollIntoView = () => {};
w.HTMLMediaElement.prototype.load = function () {};
w.HTMLMediaElement.prototype.pause = function () {};
w.HTMLMediaElement.prototype.play = async function () {};
const surfaces = new WeakMap();
w.HTMLCanvasElement.prototype.getContext = function (type) {
  if (type !== '2d') return null;
  let surface = surfaces.get(this);
  if (!surface || surface.width !== this.width || surface.height !== this.height) {
    surface = createCanvas(Math.max(1, this.width), Math.max(1, this.height)); surfaces.set(this, surface);
    const context = surface.getContext('2d');
    const drawImage = context.drawImage.bind(context);
    context.drawImage = (image, ...args) => drawImage(surfaces.get(image) || image, ...args);
  }
  return surface.getContext('2d');
};
const vm = require('node:vm');
const run = code => vm.runInContext(code, dom.getInternalVMContext());
run(read('autumn.js'));
run(read('toadstools.js'));
run(read('app.js'));
assert.equal(run('visualizerSelect.options.length'), 32, 'Summer retains all 32 visuals');
assert.equal(run('currentSeason'), 'summer');
// A saved shuffle preference must migrate to sequential playback.
run('restoreControlPreferences({controls:{shuffle:true,visualizer:"fireworks",form:"woman",speed:"1.4",grasp:"0.75"}})');
assert.equal(run('shuffleToggle.checked'), false);
const audio = w.document.querySelector('#audio');
audio.src = 'http://localhost/music.wav'; audio.currentTime = 37.5;
let audioLoads = 0, plays = 0, pauses = 0;
audio.load = () => { audioLoads++; }; audio.play = () => { plays++; return Promise.resolve(); }; audio.pause = () => { pauses++; };
w.document.querySelector('#desktopSeasonButton').click();
assert.equal(run('currentSeason'), 'autumn');
assert.equal(run('visualizerSelect.value'), 'ralphwatch');
assert.equal(run('visualizerSelect.options.length'), 2, 'Expose only the two implemented Autumn scenes');
assert.equal(audio.currentTime, 37.5); assert.equal(audioLoads + plays + pauses, 0, 'Season switching must not touch transport');
assert.equal(w.document.body.dataset.season, 'autumn');
assert.equal(run('activeAlchemyRecipes().length'), 7);
assert.ok(w.document.querySelector('#fireworkFormSelect').closest('label').classList.contains('autumn-time-control'), 'GARAGE exposes the time-of-day selector');
// The entire Garage flywheel and direct Alchemy action use the Autumn recipes.
run('applyAlchemicalAdjustment(3)');
assert.equal(run('fireworkFormSelect.value'), 'night');
assert.equal(run('handGrasp.value'), '1', 'Alchemy may reach maximum slaughter without a hidden ceiling');
run('stepGarageFlywheel(formFlywheel,fireworkFormSelect,1)');
assert.equal(run('fireworkFormSelect.value'), 'afternoon');
run('fireworkFormSelect.value="evening"; handGrasp.value="0.85"; setSeason("summer")');
assert.equal(run('visualizerSelect.value'), 'fireworks');
assert.equal(run('fireworkFormSelect.value'), 'woman');
assert.equal(run('fireworkSpeed.value'), '1.4');
run('setSeason("autumn")');
assert.equal(run('fireworkFormSelect.value'), 'evening');
assert.equal(run('handGrasp.value'), '0.85');
run('saveSessionNow(); setSeason("summer",{save:false}); restoreControlPreferences(loadSavedSession())');
assert.equal(run('currentSeason'), 'autumn');
assert.equal(run('fireworkFormSelect.value'), 'evening');
assert.equal(run('handGrasp.value'), '0.85');
assert.equal(audio.currentTime, 37.5);
assert.equal(audioLoads + plays + pauses, 0);
// Render the actual Canvas implementation through a full day at phone aspect ratio.
const canvas = createCanvas(160, 240), c = canvas.getContext('2d');
const scene = w.AutumnWatch;
const pictures = new Map(); let stats;
for (const index of [0, 1, 2, 3, 4]) assert.equal(scene.phaseAt(index * 48 + 5).index, index);
for (const form of ['dawn','morning','afternoon','evening','night']) assert.equal(scene.phaseAt(17, form).index, ['dawn','morning','afternoon','evening','night'].indexOf(form));
scene.reset();
for (let i = 0; i <= 4802; i++) {
  stats = scene.draw(c, 160, 240, 1000 + i * 50, {count:14,gore:1,recipeIndex:3,form:'cycle',bass:.6,treble:.4});
  if ([400, 1400, 2400, 3400, 4400].includes(i)) {
    const phase = scene.phaseAt(stats.time).index;
    const preview = createCanvas(480,760);
    scene.draw(preview.getContext('2d'),480,760,1000+i*50,{count:14,gore:1,recipeIndex:3,form:'cycle',animate:false});
    const image = preview.toBuffer('image/png'); pictures.set(phase, image);
    if (i < 4000) assert.ok(stats.alive > 0, 'The flock must last into evening');
    if (process.env.SEASON_TEST_OUTPUT) { fs.mkdirSync(process.env.SEASON_TEST_OUTPUT,{recursive:true}); fs.writeFileSync(path.join(process.env.SEASON_TEST_OUTPUT,`autumn-phase-${phase}.png`),image); }
  }
  assert.ok(stats.alive >= 0 && stats.alive <= 27);
  assert.ok(stats.particles <= 220);
  if (i === 3400) assert.ok(stats.kills > 0, 'The pack must eventually get past the guard');
}
assert.equal(pictures.size, 5, 'Every phase renders');
assert.ok(stats.time < 1, 'The scene resets for continuous listening');
assert.equal(new Set(Array.from(pictures.values(), b => b.toString('base64'))).size, 5, 'Light and weather change across the day');
// Autumn 02 has independent recipes and survives a seasonal round trip without touching audio.
run('visualizerSelect.value="toadstools"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 5);
for (let i = 0; i < 5; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('handCount.value'), String(w.AutumnToadstools.recipes[i].count));
  assert.equal(run('fireworkFormSelect.selectedIndex'), w.AutumnToadstools.recipes[i].form);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'toadstools');
assert.equal(run('fireworkFormSelect.value'), 'enchanted');
assert.equal(audio.currentTime, 37.5); assert.equal(audioLoads + plays + pauses, 0);
run('saveSessionNow(); setSeason("summer",{save:false}); restoreControlPreferences(loadSavedSession())');
assert.equal(run('visualizerSelect.value'), 'toadstools', 'Saved Autumn 02 restores');
const fungi = w.AutumnToadstools;
const fungalCanvas = w.document.createElement('canvas'); fungalCanvas.width=160; fungalCanvas.height=240;
const fungalContext = fungalCanvas.getContext('2d');
fungi.reset();
let fungalStats;
for (let i = 0; i < 900; i++) {
  fungalStats = fungi.draw(fungalContext, 160, 240, i * 50, { bass: i % 50 < 12 ? .9 : .02, mid:.4, treble:.6, count:14 });
  assert.equal(fungalStats.mushrooms, 14); assert.ok(fungalStats.sprites <= 3); assert.equal(fungalStats.spores, 42);
}
assert.ok(fungalStats.births > 2, 'Musical transients trigger repeated sprouting');
const stopped = fungi.draw(fungalContext,160,240,999999,{animate:false});
assert.equal(stopped.time, fungalStats.time, 'Idle redraws do not advance the choreography');
const lightPictures = [];
for (const form of ['golden','dawn','moonlight','enchanted']) {
  const preview = w.document.createElement('canvas'); preview.width=640; preview.height=480;
  fungi.draw(preview.getContext('2d'),640,480,1000000,{form,animate:false});
  const image = surfaces.get(preview).toBuffer('image/png'); lightPictures.push(image.toString('base64'));
  if (process.env.SEASON_TEST_OUTPUT) fs.writeFileSync(path.join(process.env.SEASON_TEST_OUTPUT,`toadstools-${form}.png`),image);
}
assert.equal(new Set(lightPictures).size,4,'All four woodland lighting treatments are distinct');
for (const name of ['app.js','autumn.js','toadstools.js','index.html','styles.css']) assert.equal(read(name), read(`android/app/src/main/assets/www/${name}`), `Offline Android asset is in sync: ${name}`);
assert.deepEqual(failures, []);
dom.window.close();
console.log('Season integration and full-day Canvas simulation passed.');
