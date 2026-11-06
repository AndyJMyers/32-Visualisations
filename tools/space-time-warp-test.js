const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createCanvas } = require("@napi-rs/canvas");
const world = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../space-time-warp.js"), "utf8"), world);
const visual = world.window.SpaceTimeWarp;
const c = createCanvas(1000, 600), context = c.getContext("2d");
const images = new Set();
for (const [i, form] of ["vortex", "stargate", "horizon", "negative"].entries()) {
  visual.reset();
  let result;
  const phases = new Set();
  for (let frame = 0; frame < 480; frame++) {
    result = visual.draw(context, 1000, 600, frame * 80, {
      form, bass: frame % 13 < 3 ? .85 : .15, mid: .55, treble: .6, speed: 1,
    });
    phases.add(result.phase);
    assert.ok(Number.isFinite(result.time) && result.time >= 0);
    assert.equal(result.form, form);
    if (frame === 145 && process.env.WARP_PREVIEW) fs.writeFileSync(process.env.WARP_PREVIEW + "-" + form + ".png", c.toBuffer("image/png"));
  }
  if (form !== "horizon") assert.ok(phases.has("threshold"), "The doorway passage occurs");
  images.add(c.toBuffer("image/png").toString("base64"));
  const paused = visual.draw(context, 1000, 600, 80000, { form, animate: false });
  assert.equal(visual.draw(context, 1000, 600, 90000, { form, animate: false }).time, paused.time);
  const mapped = visual.draw(context, 1000, 600, 90000, { form: visual.recipes[i].form, animate: false });
  assert.equal(mapped.form, form, "Alchemy indexes select the intended form");
}
assert.equal(images.size, 4, "All four alchemies produce distinct imagery");
visual.reset();
assert.equal(visual.draw(context, 400, 800, 0).time, 0);
console.log("Space-Time Warp: four alchemies, continuous journey, portrait rendering, pause and reset passed.");
