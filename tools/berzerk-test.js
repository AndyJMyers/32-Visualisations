const assert = require('node:assert/strict');
const { createCanvas } = require('@napi-rs/canvas');
global.window = {};
require('../berzerk.js');
const game = window.Berzerk;
const c = createCanvas(390, 844).getContext('2d');
let now = 0;
let frame;
function advance(ms) {
  for (let end = now + ms; now < end; now += 16) frame = game.draw(c, 390, 844, now);
  return frame;
}
assert.equal(advance(6000).sector, 1);
assert.equal(advance(6500).sector > 1, true);
game.reset();
game.key('KeyB', true);
assert.equal(advance(32).manual, true);
game.key('ArrowUp', true);
assert.deepEqual(advance(144).position, [1, 2]);
game.key('ArrowUp', false);
game.key('KeyE', true);
assert.equal(advance(144).lock > 0, true);
const bots = frame.bots;
game.key('ArrowDown', true);
game.key('Space', true);
advance(1100);
assert.deepEqual(frame.position, [1, 2]);
assert.deepEqual(frame.bots, bots);
assert.equal(frame.shots, 0);
game.clearKeys();
assert.equal(advance(2900).shield > 0, true);
assert.notDeepEqual(frame.bots, bots);
assert.equal(frame.score, 150);
assert.ok(frame.reward > 0);
assert.deepEqual(frame.position, [1, 2]);
game.key('KeyB', true);
assert.equal(advance(32).manual, false);
game.reset();
game.key('KeyB', true);
const opening = advance(32).bots;
function tapFire() {
  game.key('Space', true);
  game.key('Space', false);
}
tapFire();
assert.equal(advance(144).shots, 1);
tapFire();
assert.equal(advance(400).shots, 2);
assert.deepEqual(frame.bots, opening);
game.reset();
game.key('KeyB', true);
let sawWindup = false;
let sawShot = false;
for (let i = 0; i < 800 && !sawShot; i++) {
  const { aiming, shots } = advance(16);
  if (aiming && !shots) sawWindup = true;
  if (shots) { assert.equal(sawWindup, true); sawShot = true; }
}
assert.equal(sawShot, true);
let sawBurst = false;
for (let i = 0; i < 350 && !sawBurst; i++) sawBurst = advance(16).bursts > 0;
assert.equal(sawBurst, true);
assert.equal(game.forms.length, 4);
assert.deepEqual(game.recipes.map(recipe => recipe.name), game.forms.map(([, name]) => name));
game.reset();
for (const [form] of game.forms) {
  for (const desktop of [true, false]) game.draw(c, 390, 844, now, { form, desktop, animate: false });
}
assert.ok(game.draw(c, 390, 844, now, { animate: false }).rows > 7);
const wide = createCanvas(1200, 360).getContext('2d');
for (const [form] of game.forms) {
  game.reset();
  const options = { desktop: true, form, bass: .6, mid: .4, treble: .2 };
  frame = game.draw(wide, 1200, 360, now, options);
  assert.ok(frame.columns > 11);
  for (let i = 0; i < 1800 && frame.sector === 1; i++) {
    frame = game.draw(wide, 1200, 360, now += 16, options);
  }
  assert.ok(frame.sector > 1, 'autopilot can reach the expanded exit in ' + form);
}
console.log('Berzerk: attract mode, desktop takeover, movement, rendezvous lock, pursuit, shield and alchemies passed.');
