const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createCanvas } = require("@napi-rs/canvas");
const canvas = createCanvas(1200, 720), c = canvas.getContext("2d");
const sandbox = { window: {}, Math: Object.create(Math) };
sandbox.Math.random = () => .35;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../lightning-farm.js"), "utf8"), sandbox);
const farm = sandbox.window.LightningFarm;
const seen = new Set(), dogX = [[], []], dogY = [[], []];
let starts = 0, exits = 0, wasRunning = false, bolts = 0, lastBolt = -Infinity;
for (let i = 0; i < 60 * 100; i++) {
  const now = i * 1000 / 60;
  c.fillStyle = "#142634"; c.fillRect(0, 0, 1200, 720);
  const result = farm.draw(c, 1200, 720, now, {
    bass: .6, mid: .5, treble: .4,
    strike(target) {
      assert.ok(target.x > 0 && target.x < 1200, "Bolt lands on screen");
      assert.ok(target.y > 0 && target.y < 720);
      assert.ok(now - lastBolt > 3000, "Strikes leave time to read the action");
      lastBolt = now; bolts++;
    },
  });
  result.shocks.forEach(kind => seen.add(kind));
  if (result.running && !wasRunning) starts++;
  if (!result.running && wasRunning) exits++;
  wasRunning = result.running;
  result.dogs.forEach((dog, n) => { dogX[n].push(dog.x); dogY[n].push(dog.y); });
  if (process.env.FARM_PREVIEW && result.shocks.includes("shepherd")) {
    fs.writeFileSync(process.env.FARM_PREVIEW, canvas.toBuffer("image/png"));
    delete process.env.FARM_PREVIEW;
  }
}
for (const kind of ["shepherd", "sheep", "dog", "tractor", "tree"]) assert.ok(seen.has(kind), kind + " can be struck");
assert.ok(starts >= 2 && exits >= 2, "A strike starts the tractor, which travels off screen");
for (let i = 0; i < 2; i++) {
  assert.ok(Math.max(...dogX[i]) - Math.min(...dogX[i]) > 250);
  assert.ok(Math.max(...dogY[i]) - Math.min(...dogY[i]) > 70, "Dogs work around the flock, not just sideways");
}
assert.ok(bolts > 10 && bolts < 30);
farm.reset();
assert.equal(farm.draw(c, 1200, 720, 200000).strikes, 0, "Scene resets cleanly");
console.log("Pastoral Resistance: all strike targets, readable pacing, herding paths and tractor exits passed.");
