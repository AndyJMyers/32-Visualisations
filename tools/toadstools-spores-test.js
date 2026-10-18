const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const gradient = { addColorStop() {} };
const context = new Proxy({ createLinearGradient: () => gradient, createRadialGradient: () => gradient }, {
  get(target, key) { return key in target ? target[key] : () => {}; },
  set(target, key, value) { target[key] = value; return true; },
});
const sandbox = { window: {}, document: { createElement: () => ({ getContext: () => context }) }, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'toadstools.js'), 'utf8'), sandbox);
const scene = sandbox.window.AutumnToadstools;
scene.reset();
let now = 0, frame;
function advance(seconds, audio = {}, extra = {}) {
  for (let i = 0; i < seconds * 20; i++) {
    now += 50;
    frame = scene.draw(context, 800, 480, now, { animate: true, ...audio, ...extra });
    assert.ok(frame.spores <= 240, 'Spore population remains bounded');
    assert.equal(frame.fallingSpores, frame.spores, 'Spores fall from their release points');
  }
  return frame;
}
advance(3);
assert.equal(frame.sporeEmissions, 0, 'Silence does not invent musical pulses');
advance(.5, { bass: .9, mid: .8, treble: .7 });
assert.ok(frame.sporeBursts >= 1, 'A strong onset causes a shower');
assert.ok(frame.spores >= 84, 'The shower releases many spores');
assert.equal(frame.backgroundSporeEmissions, 0, 'Background waves begin after the foreground burst');
advance(.5, { bass: .9, mid: .8, treble: .7 });
assert.ok(frame.backgroundSporeEmissions > 0, 'Background mushrooms release their own wave');
assert.ok(frame.backgroundSpores > 0 && frame.backgroundSpores <= 60, 'Background spores have reserved capacity');
const bursts = frame.sporeBursts;
advance(8, { bass: .9, mid: .8, treble: .7 });
assert.equal(frame.sporeBursts, bursts, 'Sustained loud music is not repeatedly treated as an onset');
const kinds = new Set(frame.sporeKinds);
for (let i = 0; i < 8; i++) {
  advance(1, { bass: .3, mid: .3, treble: .3 }, { form: i % 2 ? 'skysnow' : 'golden' });
  frame.sporeKinds.forEach(kind => kinds.add(kind));
}
assert.equal(kinds.size, 4, 'The releases cycle through silver, foil, flames and sparks');
const beforePause = frame;
now += 1000;
frame = scene.draw(context, 800, 480, now, { animate: false, bass: 1, mid: 1, treble: 1 });
assert.equal(frame.time, beforePause.time);
assert.equal(frame.spores, beforePause.spores, 'Pausing freezes the spores');
assert.equal(frame.sporeEmissions, beforePause.sporeEmissions);
assert.equal(frame.backgroundSporeEmissions, beforePause.backgroundSporeEmissions, 'Pausing freezes background waves');
advance(12);
assert.equal(frame.spores, 0, 'Existing spores eventually settle after the music falls quiet');
console.log('Toadstool spore pulses, showers, materials and pause checks passed.');
