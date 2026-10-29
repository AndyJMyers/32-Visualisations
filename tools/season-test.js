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
run(read('cobweb.js'));
run(read('last-mow.js'));
run(read('squirrel.js'));
run(read('driving.js'));
run(read('harvest.js'));
run(read('rat-race.js'));
run(read('starry-night.js'));
run(read('water-lilies.js'));
run(read('the-scream.js'));
run(read('mondrian.js'));
run(read('pollocks.js'));
run(read('your-call.js'));
run(read('birds-eye.js'));
run(read('walk-egyptian.js'));
run(read('romans.js'));
run(read('life-studies.js'));
run(read('old-school-games.js'));
run(read('spaced.js'));
run(read('inner-space.js'));
run(read('champagne-fountain.js'));
run(read('punting-with-ladies.js'));
run(read('shy-smiles.js'));
run(read('beowulf.js'));
run(read('hansel-gretel.js'));
run(read('opium-eater.js'));
run(read('there-will-be-bones.js'));
run(read('churchill.js'));
run(read('iron-lady.js'));
run(read('blair.js'));
run(read('p-np.js'));
run(read('app.js'));
assert.equal(w.document.querySelector('#settingsCatalogue').open, false, 'Desktop Garage stays closed at startup');
const pressHideKey = key => w.document.body.dispatchEvent(new w.KeyboardEvent('keydown', {
  key, code: `Key${key.toUpperCase()}`, bubbles: true, cancelable: true,
}));
pressHideKey('h');
assert.equal(w.document.querySelector('.player').classList.contains('desktop-controls-hidden'), true, 'H hides desktop controls');
w.document.dispatchEvent(new w.Event('pointermove', { bubbles: true }));
assert.equal(w.document.querySelector('.player').classList.contains('desktop-controls-hidden'), false, 'Pointer movement restores controls');
pressHideKey('h');
pressHideKey('x');
assert.equal(w.document.querySelector('.player').classList.contains('desktop-controls-hidden'), false, 'Another key restores controls');
const search = w.document.querySelector('#songWheelSearch');
search.focus();
run('visualizerSelect.value="eyevisions"');
for (const [key, code] of [['f', 'KeyF'], ['t', 'KeyT'], ['w', 'KeyW'], [' ', 'Space']]) {
  const event = new w.KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true });
  search.dispatchEvent(event);
  assert.equal(event.defaultPrevented, false, `Track search keeps ${code} for text input`);
  assert.equal(w.document.activeElement, search, `Track search retains focus on ${code}`);
}
search.blur();
assert.equal(run('visualizerSelect.options.length'), 16, 'The active Arcana suit exposes sixteen visuals');
assert.equal(run('currentSeason'), 'summer');
assert.equal(run('currentArcanaSuit'), 'wands');
assert.equal(w.document.querySelector('#desktopSeasonLabel').textContent, 'Wands');
for (const suit of ['cups', 'swords', 'pentacles', 'wands']) {
  w.document.querySelector('#desktopSeasonButton').click();
  assert.equal(run('currentArcanaSuit'), suit, `Arcana selector advances to ${suit}`);
  assert.equal(run('visualizerSelect.options.length'), suit === 'pentacles' ? 17 : 16, `${suit} shows its assigned visuals`);
}
// A saved shuffle preference must migrate to sequential playback.
run('restoreControlPreferences({controls:{shuffle:true,visualizer:"fireworks",form:"woman",speed:"1.4",grasp:"0.75"}})');
assert.equal(run('shuffleToggle.checked'), false);
const audio = w.document.querySelector('#audio');
audio.src = 'http://localhost/music.wav'; audio.currentTime = 37.5;
let audioLoads = 0, plays = 0, pauses = 0;
audio.load = () => { audioLoads++; }; audio.play = () => { plays++; return Promise.resolve(); }; audio.pause = () => { pauses++; };
w.document.querySelector('#desktopSeasonButton').click();
assert.equal(run('currentArcanaSuit'), 'cups');
assert.equal(run('visualizerSelect.value'), 'swampbubbles');
assert.equal(run('visualizerSelect.options.length'), 16, 'A suit displays its sixteen assigned visuals');
assert.equal(audio.currentTime, 37.5); assert.equal(audioLoads + plays + pauses, 0, 'Suit switching must not touch transport');
assert.equal(w.document.querySelector('#desktopSeasonLabel').textContent, 'Cups');
assert.equal(w.document.querySelectorAll('#desktopSeasonButton .arcana-icon').length, 1, 'The active suit icon remains visible');
run('setSeason("autumn")');
assert.equal(run('currentSeason'), 'autumn');
assert.equal(run('visualizerSelect.value'), 'ralphwatch');
assert.equal(run('visualizerSelect.options.length'), 33, 'Internal Autumn rendering remains available');
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
assert.equal(run('activeAlchemyRecipes().length'), 6);
for (let i = 0; i < 6; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('handCount.value'), String(w.AutumnToadstools.recipes[i].count));
  assert.equal(run('fireworkFormSelect.selectedIndex'), w.AutumnToadstools.recipes[i].form);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'toadstools');
assert.equal(run('fireworkFormSelect.value'), 'skysnow');
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
  assert.equal(fungalStats.mushrooms, 14); assert.ok(fungalStats.sprites <= 3); assert.ok(fungalStats.spores <= 240);
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
run('visualizerSelect.value="dawncobweb"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 5);
for (let i = 0; i < 5; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('fireworkFormSelect.selectedIndex'), i, 'Cobweb Alchemy selects its own light');
}
run('saveSessionNow(); setSeason("summer",{save:false}); restoreControlPreferences(loadSavedSession())');
assert.equal(run('visualizerSelect.value'), 'dawncobweb', 'Saved Dawn Cobweb restores');
assert.equal(run('fireworkFormSelect.value'), 'mist');
run('visualizerSelect.value="lastmow"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'The garden has its own weather recipes');
assert.equal(run('alchemyRecipeIndex()'), 0, 'The default garden weather and Alchemy agree');
for (let i = 0; i < 4; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('fireworkFormSelect.selectedIndex'), i, 'Garden Alchemy changes its weather');
  assert.equal(run('alchemyRecipeIndex()'), i, 'The selected garden Alchemy is labelled correctly');
}
run('saveSessionNow(); setSeason("summer",{save:false}); restoreControlPreferences(loadSavedSession())');
assert.equal(run('visualizerSelect.value'), 'lastmow', 'The garden restores after a season change');
assert.equal(audio.currentTime, 37.5); assert.equal(audioLoads + plays + pauses, 0);
run('visualizerSelect.value="squirrel"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Squirrels have their own Alchemy moods');
run('applyAlchemicalAdjustment(3)');
assert.equal(run('fireworkFormSelect.value'), 'dusk');
assert.equal(run('alchemyRecipeIndex()'), 3, 'Garage reflects the selected squirrel mood');
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'squirrel', 'Squirrels restore after a season change');
run('visualizerSelect.value="autumndrive"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 7, 'The drive offers all seven cars');
for (let i = 0; i < 7; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The selected car and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), run(`window.AutumnDrive.cars[${i}].id`));
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'autumndrive', 'The drive restores after a season change');
run('visualizerSelect.value="harvest"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 3, 'Harvest Time offers three lighting treatments');
for (let i = 0; i < 3; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The harvest mood and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), ['amber','blue','storm'][i]);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'harvest', 'The harvest restores after a season change');
run('visualizerSelect.value="ratrace"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 3, 'Rat Race offers three city moods');
for (let i = 0; i < 3; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Rat Race mood and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), ['clockwork','neon','after'][i]);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'ratrace', 'Rat Race restores after a season change');
run('visualizerSelect.value="starrynight"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 3, 'Starry Night offers three palettes');
for (let i = 0; i < 3; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Starry Night palette and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), ['cobalt','amber','silver'][i]);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'starrynight', 'Starry Night restores after a season change');
run('visualizerSelect.value="waterlilies"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Water Lilies offers four pond moods');
for (let i = 0; i < 4; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Water Lilies mood and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), ['pond','negative','orange','awake'][i]);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'waterlilies', 'Water Lilies restores after a season change');
run('visualizerSelect.value="thescream"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'The Scream offers four bridge moods');
for (let i = 0; i < 4; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The Scream mood and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), ['burning','flight','negative','electric'][i]);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'thescream', 'The Scream restores after a season change');
run('visualizerSelect.value="mondrian"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Mondrian offers four composition palettes');
for (let i = 0; i < 4; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Mondrian palette and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), ['primary','midnight','copper','boogie'][i]);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'mondrian', 'Mondrian restores after a season change');
run('visualizerSelect.value="pollocks"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'A load of Pollocks offers four paint materials');
for (let i = 0; i < 4; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The selected paint and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), ['enamel','ink','molten','midnight'][i]);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'pollocks', 'A load of Pollocks restores after a season change');
run('visualizerSelect.value="yourcall"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Your call offers four bureaucratic departments');
for (let i = 0; i < 4; i++) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The selected department and Alchemy label agree');
  assert.equal(run('fireworkFormSelect.value'), ['menu','verify','queue','agent'][i]);
}
run('setSeason("summer"); setSeason("autumn")');
assert.equal(run('visualizerSelect.value'), 'yourcall', 'Your call restores after a season change');
run('visualizerSelect.value="birdseye"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Birds Eye offers four flight routes');
for (const [i, form] of ['orchard', 'village', 'rain', 'twilight'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The flight route and Alchemy label agree');
}
run('visualizerSelect.value="walkegyptian"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Egyptian passage offers four treatments');
for (const [i, form] of ['gold', 'lapis', 'papyrus', 'storm'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The Egyptian Alchemy label matches its scene');
}
run('visualizerSelect.value="romans"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Romans offers four distinct treatments');
for (const [i, form] of ['imperial', 'bacchanal', 'mosaic', 'inferno'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The Roman Alchemy label matches its scene');
}
run('visualizerSelect.value="lifestudies"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Life Studies offers four studio moods');
for (const [i, form] of ['atelier', 'nocturne', 'vermilion', 'bluewash'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The Life Studies Alchemy label matches its scene');
}
run('visualizerSelect.value="oldschoolgames"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Old School Games offers four toybox moods');
for (const [i, form] of ['tabletop', 'afterdark', 'blueprint', 'popart'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'The Old School Games Alchemy label matches its scene');
}
run('visualizerSelect.value="spaced"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Spaced offers four cosmic moods');
for (const [i, form] of ['observatory', 'aurora', 'solarwind', 'negative'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Spaced Alchemy label matches its scene');
}
run('visualizerSelect.value="innerspace"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Inner Space offers four moods');
for (const [i, form] of ['anatomy', 'bioluminescent', 'watercolour', 'radiograph'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Inner Space Alchemy label matches its scene');
}
run('visualizerSelect.value="champagnefountain"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Champagne Fountain offers four cocktail moods');
for (const [i, form] of ['gilded', 'rose', 'absinthe', 'midnight'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Champagne Fountain Alchemy label matches its mood');
}
run('visualizerSelect.value="shysmiles"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Shy Smiles offers four light and colour moods');
for (const [i, form] of ['firstlight', 'sorbet', 'amber', 'nocturne'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Shy Smiles Alchemy label matches its mood');
}
run('visualizerSelect.value="beowulf"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Beowulf offers four illumination moods');
for (const [i, form] of ['meadgold', 'inkiron', 'bloodmoon', 'wyrdfire'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Beowulf Alchemy label matches its mood');
}
run('visualizerSelect.value="hanselgretel"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Hansel and Gretel offers four storybook moods');
for (const [i, form] of ['woodland', 'moonlit', 'sugar', 'ink'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Hansel and Gretel Alchemy label matches its mood');
}
run('visualizerSelect.value="opiumeater"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 5, 'Opium Eater offers five architectural alchemies');
for (const [i, form] of ['london', 'scotland', 'greece', 'paris', 'rome'].entries()) {
  run(`fireworkFormSelect.value="${form}"; fireworkFormSelect.dispatchEvent(new Event("change"))`);
  assert.equal(run('alchemyRecipeIndex()'), i, 'Opium Eater Alchemy label matches its mood');
}
run('fireworkFormSelect.value="london"');
w.document.querySelector('#desktopAlchemyButton').click();
assert.equal(run('fireworkFormSelect.value'), 'scotland', 'Desktop Alchemy advances a named recipe');
run('stepGarageFlywheel(formFlywheel, fireworkFormSelect, 1)');
assert.equal(run('fireworkFormSelect.value'), 'greece', 'Garage Alchemy advances a named recipe');
run('visualizerSelect.value="bones"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Bones offers four distinct treatments');
for (const [i, form] of ['cabinet', 'xray', 'fossil', 'cabaret'].entries()) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('fireworkFormSelect.value'), form, 'Bones Alchemy selects the intended treatment');
}
run('visualizerSelect.value="churchill"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Churchill offers four distinct treatments');
for (const [i, form] of ['newsreel', 'dispatches', 'oils', 'blackout'].entries()) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('fireworkFormSelect.value'), form, 'Churchill Alchemy selects the intended treatment');
}
run('visualizerSelect.value="ironlady"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'The Iron Lady offers four distinct treatments');
for (const [i, form] of ['steel', 'ink', 'coal', 'neon'].entries()) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('fireworkFormSelect.value'), form, 'Iron Lady Alchemy selects the intended treatment');
}
run('visualizerSelect.value="blair"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'Blair offers four distinct treatments');
for (const [i, form] of ['red', 'newsprint', 'dossier', 'neon'].entries()) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('fireworkFormSelect.value'), form, 'Blair Alchemy selects the intended treatment');
}
run('visualizerSelect.value="pnp"; visualizerSelect.dispatchEvent(new Event("change"))');
assert.equal(run('activeAlchemyRecipes().length'), 4, 'P = NP? offers four distinct treatments');
for (const [i, form] of ['blueprint', 'chalk', 'clockwork', 'cosmos'].entries()) {
  run(`applyAlchemicalAdjustment(${i})`);
  assert.equal(run('fireworkFormSelect.value'), form, 'P = NP? Alchemy selects the intended treatment');
}
for (const name of ['app.js','autumn.js','toadstools.js','cobweb.js','last-mow.js','squirrel.js','driving.js','harvest.js','rat-race.js','starry-night.js','water-lilies.js','the-scream.js','mondrian.js','pollocks.js','your-call.js','birds-eye.js','walk-egyptian.js','romans.js','life-studies.js','old-school-games.js','spaced.js','inner-space.js','champagne-fountain.js','shy-smiles.js','beowulf.js','hansel-gretel.js','opium-eater.js','there-will-be-bones.js','churchill.js','iron-lady.js','blair.js','p-np.js','plenty-of-puff.js','index.html','styles.css']) assert.equal(read(name), read(`android/app/src/main/assets/www/${name}`), `Offline Android asset is in sync: ${name}`);
assert.deepEqual(failures, []);
dom.window.close();
console.log('Season integration and full-day Canvas simulation passed.');
