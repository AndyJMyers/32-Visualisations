const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createCanvas } = require("@napi-rs/canvas");
const box = { window: {}, Math };
const source=fs.readFileSync(path.join(__dirname, "../orbital.js"), "utf8");
// Sample long narrative checkpoints without rendering thousands of intermediate frames.
vm.runInNewContext(source.replace("return {recipes,draw,reset};", "return {recipes,draw,reset,seek:t=>{time=t;}};"), box);
const visual = box.window.Orbital;
const canvas = createCanvas(1000, 600), c = canvas.getContext("2d");
const images = new Set();
for (const [i,form] of ["garden","midnight","ocean","machine"].entries()) {
  visual.reset();
  const phases = new Set();
  let previousRotation = -1, previousDistance = -1;
  const cameraDistances=[];
  const attackers=new Set();let sawImpact=false,sawGod=false;
  let interior = false, exterior = false;
  visual.draw(c,1000,600,0,{form,animate:false});
  const checkpoints=[0,3,10,24,37,44,55,78,88,95.99,96.01,103,126];
  for (const [f,seconds] of checkpoints.entries()) {
    visual.seek(seconds);
    const result = visual.draw(c, 1000, 600, f*80, { form, animate:false });
    phases.add(result.phase);
    assert.ok(Number.isFinite(result.time));
    assert.ok(result.cameraDistance>=930&&result.cameraDistance<=3087);
    assert.ok(result.reveal>=0&&result.reveal<=1);
    attackers.add(result.attacker);sawImpact ||= result.impact>.5;sawGod ||= result.reveal>.99;
    cameraDistances.push(result.cameraDistance);
    assert.ok(result.rotation >= previousRotation && result.distanceKm >= previousDistance);
    previousRotation=result.rotation;previousDistance=result.distanceKm;
    if(result.time>18&&!interior) {
      interior=true;images.add(canvas.toBuffer("image/png").toString("base64"));
      if(process.env.ORBITAL_PREVIEW)fs.writeFileSync(process.env.ORBITAL_PREVIEW+"-"+form+"-inside.png",canvas.toBuffer("image/png"));
    }
    if(result.phase==="composite torus"&&result.time>25&&!exterior) {
      exterior=true;
      if(process.env.ORBITAL_PREVIEW)fs.writeFileSync(process.env.ORBITAL_PREVIEW+"-"+form+"-outside.png",canvas.toBuffer("image/png"));
    }
    if(process.env.ORBITAL_PREVIEW&&seconds===55)fs.writeFileSync(process.env.ORBITAL_PREVIEW+"-"+form+"-reveal.png",canvas.toBuffer("image/png"));
  }
  assert.ok(phases.has(["composite torus","serpentine hose","interwoven knot","cable tangle"][i]));
  assert.ok(previousDistance>50000,"Journey traverses a continental distance");
  assert.ok(Math.max(...cameraDistances)-Math.min(...cameraDistances)>200,"Camera approaches and retreats");
  assert.equal(attackers.size,2);assert.ok(sawImpact&&sawGod,"Alternating rivalry, impact and wider reveal");
  const paused=visual.draw(c,1000,600,40000,{form,animate:false});
  const frame=canvas.toBuffer("image/png");
  assert.equal(visual.draw(c,1000,600,50000,{form,animate:false}).time,paused.time);
  assert.ok(frame.equals(canvas.toBuffer("image/png")));
  assert.equal(visual.draw(c,1000,600,60000,{form:visual.recipes[i].form,animate:false}).form,form);
}
assert.equal(images.size,4,"Four distinct habitat treatments");
visual.reset();assert.equal(visual.draw(c,400,800,0).time,0);
console.log("Orbital: all four alchemies, alternating slaps, spaghetti reveal, morphs, depth, pause and portrait passed.");
