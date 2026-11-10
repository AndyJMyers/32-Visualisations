const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createCanvas } = require("@napi-rs/canvas");
const world = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../wormhole.js"), "utf8"), world);
const visual = world.window.Wormhole;
const canvas = createCanvas(1000, 600), c = canvas.getContext("2d");
const images = new Set();
for (const [i, form] of ["prism", "liquid", "velvet", "opal"].entries()) {
  visual.reset();
  let result;
  for (let frame = 0; frame < 130; frame++) {
    result = visual.draw(c, 1000, 600, frame * 80, {
      form, bass: frame % 13 < 3 ? .9 : .15, mid: .65, treble: .55,
    });
    assert.ok(Number.isFinite(result.time) && Number.isFinite(result.polarisation));
    assert.equal(result.form, form);
  }
  assert.ok(result.time > 10, "The journey advances");
  images.add(canvas.toBuffer("image/png").toString("base64"));
  if (process.env.WORMHOLE_PREVIEW) fs.writeFileSync(process.env.WORMHOLE_PREVIEW + "-" + form + ".png", canvas.toBuffer("image/png"));
  const paused = visual.draw(c, 1000, 600, 20000, { form, animate: false });
  const before = canvas.toBuffer("image/png");
  assert.equal(visual.draw(c, 1000, 600, 30000, { form, animate: false }).time, paused.time);
  assert.ok(before.equals(canvas.toBuffer("image/png")), "Paused imagery stays still");
  assert.equal(visual.draw(c, 1000, 600, 40000, { form: visual.recipes[i].form, animate: false }).form, form);
}
assert.equal(images.size, 4, "Each alchemy has distinct geometry and colour");
const responses = [];
for (const bass of [0, 1]) {
  visual.reset();
  for (let frame = 0; frame < 15; frame++) visual.draw(c, 1000, 600, frame * 80, { bass, mid: bass, treble: bass });
  responses.push(canvas.toBuffer("image/png"));
}
assert.ok(!responses[0].equals(responses[1]), "Music changes the rendered geometry and light");
visual.reset();
assert.equal(visual.draw(c, 400, 800, 0).time, 0, "Portrait canvas and reset work");
console.log("Wormhole: four distinct alchemies, audio response, animation, pause and portrait passed.");
