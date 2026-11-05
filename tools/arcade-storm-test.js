const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createCanvas } = require("@napi-rs/canvas");
const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const canvas = createCanvas(1000, 620);
const context = canvas.getContext("2d");
const world = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(root, "old-school-games.js"), "utf8"), world);
let catches = 0;
for (let frame = 0; frame < 60 * 130; frame++) {
  const state = world.window.OldSchoolGames.draw(context, 1000, 620, frame * 1000 / 60, {
    form: "tabletop", speed: 1, bass: .5, mid: .4, treble: .35,
  });
  if (state.ghostsEaten) {
    assert.equal(state.phase, "maze");
    assert.equal(state.ghostsVulnerable, true);
    catches = Math.max(catches, state.ghostsEaten);
  }
}
assert.equal(catches, 3, "Power-ups let the player catch three ghosts");

let now = 0;
const sandbox = vm.createContext({
  Math, performance: { now: () => now }, churchyardStorm: null, lightningBolts: [],
  fireworkSpeedMultiplier: () => 1, handSizeMultiplier: () => 1,
  handCountValueNumber: () => 6, handGraspAmount: () => .4,
  lightningSkyPalette: () => ({ hue: 210 }), lightningFrame: 0,
  asteroidFrame: 1, asteroidLastShot: -100, asteroidShots: [], asteroidKeys: new Set(),
  asteroidShip: { x: 500, y: 310, vx: 0, vy: 0, angle: -Math.PI / 2, radius: 15 },
  asteroidRocks: [{ x: 800, y: 310, vx: 0, vy: 0 }],
  asteroidHue: () => 180,
});
function extract(start, end) {
  return source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
}
vm.runInContext(extract("function createLightningBolt(", "function drawLightningPath("), sandbox);
vm.runInContext(extract("function drawChurchyardStorm(", "function drawLightningScene("), sandbox);
vm.runInContext(extract("function fireShipMissile(", "function fireSaucerShot("), sandbox);
vm.runInContext(extract("function steerAsteroidAutopilot(", "function updateAsteroidsScene("), sandbox);
let strikes = 0, lastStrike = -10000;
for (let frame = 0; frame < 3600; frame++) {
  now = frame * 1000 / 60;
  sandbox.drawChurchyardStorm(context, 1000, 620, .7, .4, .3);
  if (sandbox.lightningBolts.length) {
    assert.ok(now - lastStrike > 2400, "Individual bolts are separated by quiet intervals");
    lastStrike = now;
    const bolt = sandbox.lightningBolts.pop();
    assert.equal(bolt.points.at(-1).x, bolt.groundX);
    strikes++;
  }
}
assert.ok(strikes >= 6 && strikes < 22);
assert.ok(sandbox.churchyardStorm.hits.some(Boolean), "Occasional strikes damage a landmark");
for (let frame = 0; frame < 160; frame++) {
  sandbox.asteroidFrame++;
  sandbox.steerAsteroidAutopilot(1000, 620, 1, .6, .4);
}
assert.ok(Math.abs(sandbox.asteroidShip.angle) < .16, "The ship turns to face its target");
assert.ok(sandbox.asteroidShip.vx > 0, "Aligned thrust moves towards the target");
assert.ok(sandbox.asteroidShots.length > 0, "The ship fires after rotating into alignment");
const shot = sandbox.asteroidShots.at(-1);
assert.ok(shot.vx > 0 && Math.abs(shot.vy) < 2, "Missiles follow the ship's nose");
sandbox.asteroidKeys.add("KeyA");
const angle = sandbox.asteroidShip.angle;
sandbox.steerAsteroidAutopilot(1000, 620, 1, .6, .4);
assert.equal(sandbox.asteroidShip.angle, angle, "Keyboard control takes priority over autopilot");
console.log("Maze ghost captures, measured churchyard strikes, and Asteroids steering passed.");
