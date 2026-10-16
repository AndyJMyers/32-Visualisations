/* Autumn 01 — Ralph's Last Watch. Original procedural characters and scenery.
   Kept independent of playback: a season switch never touches the audio element. */
window.AutumnWatch = (() => {
  const phases = [
    { name: 'Dawn · the missing shapes', sky: [27, 38, 53], snow: [141, 159, 173], fog: .77, light: .06 },
    { name: 'Mid-morning · whiteout', sky: [39, 47, 59], snow: [119, 139, 159], fog: .61, light: .12 },
    { name: 'Afternoon · winter eyes', sky: [124, 151, 177], snow: [223, 228, 215], fog: .13, light: 1 },
    { name: 'Evening · no promise', sky: [100, 49, 72], snow: [143, 133, 159], fog: .18, light: .45 },
    { name: 'Night · somewhere else', sky: [5, 10, 23], snow: [44, 63, 89], fog: .42, light: 0 },
  ];
  const recipes = [
    { name: 'First Snow', form: 0, theme: 1, speed: .8, size: .7, count: 5, grasp: .2, smiles: 0, insanity: 0, hunger: .35, ferocity: .3, mist: .75 },
    { name: 'The Hungry Dark', form: 5, theme: 0, speed: 1.2, size: 1, count: 12, grasp: .7, smiles: 0, insanity: 0, hunger: 1, ferocity: .75, mist: .6 },
    { name: 'Whiteout', form: 2, theme: 1, speed: 1.4, size: 1.8, count: 9, grasp: .45, smiles: 0, insanity: 0, hunger: .65, ferocity: .5, mist: 1 },
    { name: 'Blood Moon', form: 5, theme: 4, speed: .9, size: 1.1, count: 14, grasp: 1, smiles: 0, insanity: 0, hunger: .85, ferocity: 1, mist: .35 },
    { name: 'Red on White', form: 3, theme: 2, speed: 1.5, size: .8, count: 11, grasp: .95, smiles: 0, insanity: 0, hunger: .85, ferocity: .85, mist: .2 },
    { name: 'Woolly Pandemonium', form: 0, theme: 3, speed: 1.8, size: .7, count: 14, grasp: .08, smiles: 0, insanity: 0, hunger: 1, ferocity: .45, mist: .35 },
    { name: 'Last Light', form: 4, theme: 2, speed: .7, size: 1.2, count: 8, grasp: .65, smiles: 0, insanity: 0, hunger: .7, ferocity: .6, mist: .45 },
  ];
  let state;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = (a, opacity = 1) => `rgba(${a.join(',')},${opacity})`;
  function reset() {
    state = { time: 0, last: 0, energy: 0, sheep: Array.from({ length: 27 }, (_, i) => ({ x: .29 + Math.random() * .45, y: .57 + Math.random() * .34, seed: i * 1.83, alive: true })), wolves: [], marks: [], particles: [], tracks: [], dog: { x: .51, y: .78, facing: 1 }, lastTrail: 0, kills: 0 };
  }
  function phaseAt(seconds, form = 'cycle') {
    const forced = ['dawn', 'morning', 'afternoon', 'evening', 'night'].indexOf(form);
    const position = forced < 0 ? (seconds % 240) / 48 : forced;
    const index = Math.floor(position);
    const blend = forced < 0 ? clamp((position % 1 - .65) / .35, 0, 1) : 0;
    const a = phases[index], b = phases[(index + 1) % phases.length];
    return { name: a.name, index, sky: mix(a.sky, b.sky, blend), snow: mix(a.snow, b.snow, blend), fog: a.fog + (b.fog - a.fog) * blend, light: a.light + (b.light - a.light) * blend };
  }
  function ellipse(c, x, y, rx, ry, color) { c.fillStyle = color; c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, Math.PI * 2); c.fill(); }
  function spawnWolf(i) {
    const left = i % 2 === 0;
    return { x: left ? -.08 : 1.08, y: .56 + Math.random() * .34, seed: i * 2.7, cooldown: 1 + Math.random() * 4, retreat: 0, facing: left ? 1 : -1 };
  }
  function update(dt, p, opts) {
    const s = state, dog = s.dog, live = s.sheep.filter(x => x.alive);
    const wanted = clamp(Math.round(opts.count), 3, 14);
    while (s.wolves.length < wanted) s.wolves.push(spawnWolf(s.wolves.length));
    s.wolves.length = wanted;
    // Courage buys time. Fatigue, deep snow and poor visibility gradually take it back.
    let threat = null, closest = Infinity;
    for (const wolf of s.wolves) {
      const distance = Math.hypot(wolf.x - dog.x, wolf.y - dog.y);
      if (distance < closest && wolf.retreat <= 0) { closest = distance; threat = wolf; }
    }
    const visibility = .34 - p.fog * opts.recipe.mist * .21 - p.light * .055;
    const target = threat && closest < visibility ? threat : { x: .5 + Math.sin(s.time * .09) * .24, y: .73 };
    const dogSpeed = (.115 / (.8 + opts.snow * .4)) * Math.max(.48, 1 - s.time / 450);
    const distance = Math.hypot(target.x - dog.x, target.y - dog.y) || 1;
    dog.facing = target.x >= dog.x ? 1 : -1;
    dog.x += (target.x - dog.x) / distance * Math.min(distance, dt * dogSpeed);
    dog.y += (target.y - dog.y) / distance * Math.min(distance, dt * dogSpeed);
    for (const sheep of live) {
      const near = s.wolves.reduce((best, w) => Math.hypot(w.x - sheep.x, w.y - sheep.y) < Math.hypot(best.x - sheep.x, best.y - sheep.y) ? w : best, s.wolves[0]);
      if (near && Math.hypot(near.x - sheep.x, near.y - sheep.y) < .12) {
        sheep.x = clamp(sheep.x + Math.sign(sheep.x - near.x) * dt * .025, .12, .9);
        sheep.y = clamp(sheep.y + Math.sign(sheep.y - near.y) * dt * .02, .53, .94);
      } else { sheep.x += Math.sin(s.time * .5 + sheep.seed) * dt * .0015; }
    }
    for (const wolf of s.wolves) {
      wolf.cooldown -= dt; wolf.retreat = Math.max(0, wolf.retreat - dt);
      if (Math.hypot(wolf.x - dog.x, wolf.y - dog.y) < .052 && wolf.retreat === 0) {
        wolf.retreat = 2 + (1 - opts.recipe.ferocity) * 5;
        for (let i = 0; i < 8; i++) s.particles.push({ x: wolf.x, y: wolf.y, vx: (Math.random() - .5) * .16, vy: -.07 - Math.random() * .12, life: 1, wool: true });
      }
      let prey = null, nearest = Infinity;
      for (const sheep of live) {
        if (!sheep.alive) continue;
        const d = Math.hypot(sheep.x - wolf.x, sheep.y - wolf.y);
        // Pack members approach different flanks rather than one conga line.
        const score = d + Math.abs(Math.sin(sheep.seed + wolf.seed)) * .09;
        if (score < nearest) { nearest = score; prey = sheep; }
      }
      const tx = wolf.retreat ? (wolf.x < dog.x ? .02 : .98) : prey ? prey.x : (wolf.seed % 2 ? -.1 : 1.1);
      const ty = wolf.retreat ? .53 + (Math.sin(wolf.seed) + 1) * .2 : prey ? prey.y : .65;
      const d = Math.hypot(tx - wolf.x, ty - wolf.y) || 1;
      const speed = (.018 + opts.recipe.hunger * .022 + s.energy * .025) / (1 + opts.snow * .12);
      const step = Math.min(d, dt * speed * (wolf.retreat ? 1.8 : 1));
      wolf.facing = tx > wolf.x ? 1 : -1;
      wolf.x += (tx - wolf.x) / d * step; wolf.y += (ty - wolf.y) / d * step;
      if (prey && !wolf.retreat && wolf.cooldown <= 0 && d < .025 && s.kills < Math.floor(s.time / 8.2)) {
        prey.alive = false; s.kills++; wolf.cooldown = 4 + (1 - opts.recipe.hunger) * 8;
        s.marks.push({ x: prey.x, y: prey.y, gore: opts.gore, seed: prey.seed });
        for (let i = 0; i < 15 + opts.gore * 20; i++) s.particles.push({ x: prey.x, y: prey.y, vx: (Math.random() - .5) * .16, vy: -.05 - Math.random() * .16, life: 1 + Math.random(), wool: i % 3 === 0 || opts.gore < .2 });
      }
    }
    if (s.time - s.lastTrail > .8) {
      s.lastTrail = s.time;
      for (const actor of [dog, ...s.wolves]) s.tracks.push({ x: actor.x, y: actor.y, age: 0 });
    }
    for (const t of s.tracks) t.age += dt;
    s.tracks = s.tracks.filter(t => t.age < 22).slice(-320);
    for (const b of s.particles) { b.x += b.vx * dt; b.y += b.vy * dt; b.vy += .18 * dt; b.life -= dt; }
    s.particles = s.particles.filter(b => b.life > 0).slice(-220);
  }
  function animal(c, a, kind, w, h, time, light) {
    const x = a.x * w, y = a.y * h, scale = Math.min(w / 1050, h / 640) * (.65 + a.y * .65);
    c.save(); c.translate(x, y); c.scale(scale, scale);
    if (light > .2) { c.save(); c.transform(1, .2, -1.7, .35, 0, 0); ellipse(c, 28, 17, 49 * light, 11, `rgba(20,32,61,${.23 * light})`); c.restore(); }
    const direction = a.facing || (Math.cos(a.seed) > 0 ? 1 : -1); c.scale(direction, 1);
    const stride = Math.sin(time * (kind === 'sheep' ? 3 : 11) + (a.seed || 0)) * 5;
    c.lineWidth = kind === 'dog' ? 5 : 3; c.strokeStyle = '#222732';
    for (let i = 0; i < 4; i++) { const lx = -14 + i * 9; c.beginPath(); c.moveTo(lx, -8); c.lineTo(lx + (i % 2 ? stride : -stride), 9); c.stroke(); }
    if (kind === 'sheep') {
      for (let i = 0; i < 8; i++) ellipse(c, Math.cos(i * 2.4) * 16, -19 + Math.sin(i * 2.4) * 7, 10, 9, '#e4dfce');
      ellipse(c, 23, -17, 7, 9, '#303542'); ellipse(c, 26, -20, 1.3, 1.3, '#f4d78e');
    } else if (kind === 'dog') {
      ellipse(c, -1, -20, 28, 22, '#9e8f78'); ellipse(c, 23, -28, 16, 17, '#c1b49c');
      ellipse(c, 32, -20, 12, 7, '#d6c7aa'); ellipse(c, 40, -22, 5, 4, '#171d28');
      // A heavy fringe and broad shoulders make the exhausted guardian readable at a distance.
      for (let i = 0; i < 5; i++) ellipse(c, 13 + i * 5, -37, 7, 9, '#827968');
      c.strokeStyle = '#b55139'; c.lineWidth = 4; c.beginPath(); c.moveTo(11, -24); c.lineTo(17, -9); c.stroke();
      c.strokeStyle = '#9e8f78'; c.lineWidth = 8; c.beginPath(); c.moveTo(-24, -24); c.quadraticCurveTo(-40, -44, -39, -27); c.stroke();
    } else {
      ellipse(c, 0, -14, 23, 11, '#343d4a');
      c.fillStyle = '#343d4a'; c.beginPath(); c.moveTo(17, -24); c.lineTo(22, -39); c.lineTo(28, -24); c.lineTo(42, -16); c.lineTo(24, -10); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(-19, -19); c.lineTo(-44, -26); c.lineTo(-28, -8); c.fill();
      ellipse(c, 28, -24, 2.2, 1.5, '#e2b369');
      if (a.cooldown > 3) ellipse(c, 38, -12, 6, 2, '#7a1829');
    }
    c.restore();
  }
  function draw(c, w, h, now, options = {}) {
    if (!state) reset();
    const opts = { speed: 1, snow: 1, count: 8, gore: .6, form: 'cycle', recipeIndex: 0, bass: 0, treble: 0, animate: true, ...options };
    opts.recipe = recipes[((opts.recipeIndex % recipes.length) + recipes.length) % recipes.length];
    let dt = state.last && opts.animate ? clamp((now - state.last) / 1000, 0, .05) : 0;
    state.last = now; dt *= opts.speed;
    state.time += dt;
    // A full day ends under drifting snow. Reset the tableau only while it is obscured.
    if (state.time >= 240) { reset(); state.last = now; }
    state.energy += (opts.bass - state.energy) * (1 - Math.exp(-dt * 4));
    const p = phaseAt(state.time, opts.form);
    if (dt) update(dt, p, opts);
    const sky = c.createLinearGradient(0, 0, 0, h * .67);
    sky.addColorStop(0, rgb(p.sky)); sky.addColorStop(1, rgb(mix(p.sky, p.index === 3 ? [232, 134, 102] : [168, 182, 189], .45)));
    c.fillStyle = sky; c.fillRect(0, 0, w, h);
    // Clouds break only briefly in the afternoon; dawn never becomes a clear blue day.
    for (let i = 0; i < 6; i++) {
      const x = ((i * .23 + state.time * .002) % 1.8 - .4) * w, y = h * (.12 + i % 3 * .08);
      c.save(); c.translate(x, y); c.scale(1, .3);
      const cloud = c.createRadialGradient(0, 0, 0, 0, 0, w * .5);
      cloud.addColorStop(0, rgb(mix(p.sky, [44, 48, 62], .5), .38 * (1 - p.light * .8)));
      cloud.addColorStop(1, rgb(p.sky, 0));
      c.fillStyle = cloud; c.fillRect(-w * .5, -w * .5, w, w); c.restore();
    }
    if (p.index === 4) {
      const bloodMoon = opts.recipeIndex % recipes.length === 3;
      ellipse(c, w * .78, h * .23, h * .027, h * .027, bloodMoon ? '#b64e49' : '#b8c3cc');
    }
    // Distant ridges, bare firs, a snowbound stone wall.
    for (let layer = 0; layer < 3; layer++) {
      c.fillStyle = rgb(mix(p.sky, p.snow, .14 + layer * .14)); c.beginPath(); c.moveTo(0, h);
      for (let x = 0; x <= w + 16; x += 16) c.lineTo(x, h * (.36 + layer * .08 + Math.sin(x / w * 8 + layer) * .045 + Math.cos(x / w * 17) * .016));
      c.lineTo(w, h); c.fill();
    }
    const ground = c.createLinearGradient(0, h * .5, 0, h); ground.addColorStop(0, rgb(mix(p.snow, p.sky, .25))); ground.addColorStop(1, rgb(p.snow));
    c.fillStyle = ground; c.beginPath(); c.moveTo(0, h * .58); c.bezierCurveTo(w * .3, h * .44, w * .7, h * .57, w, h * .5); c.lineTo(w, h); c.lineTo(0, h); c.fill();
    c.strokeStyle = rgb(mix(p.sky, p.snow, .25)); c.lineWidth = Math.max(2, h * .008);
    c.beginPath(); c.moveTo(0, h * .64); c.quadraticCurveTo(w * .55, h * .52, w, h * .59); c.stroke();
    for (let i = 0; i < 46; i++) { const x = i / 45 * w, y = h * (.64 - .16 * (i / 45) + .11 * (i / 45) ** 2); c.fillStyle = rgb(mix(p.sky, p.snow, .2)); c.fillRect(x, y - h * .009, w * .015, h * .008); }
    for (let i = 0; i < 15; i++) { const x = (i * .071 + .04) * w, y = (.39 + Math.sin(i * 4) * .045) * h; c.strokeStyle = rgb(p.sky, .7); c.lineWidth = Math.max(1, w / 750); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h * .1); for (let j = 0; j < 4; j++) { c.moveTo(x - w * .012, y - h * j * .02); c.lineTo(x, y - h * (.04 + j * .02)); c.lineTo(x + w * .01, y - h * j * .02); } c.stroke(); }
    if (p.light > .12) {
      const sx = w * .8, sy = h * .34, radius = w * .35;
      const halo = c.createRadialGradient(sx, sy, 0, sx, sy, radius);
      halo.addColorStop(0, `rgba(255,237,188,${p.light * .75})`); halo.addColorStop(.15, `rgba(255,219,158,${p.light * .22})`); halo.addColorStop(1, 'rgba(255,221,170,0)'); c.fillStyle = halo; c.fillRect(0, 0, w, h);
      ellipse(c, sx, sy, h * .024, h * .024, `rgba(255,237,200,${p.light})`);
    }
    for (const t of state.tracks) { ellipse(c, t.x * w, t.y * h, w * .002, h * .0015, `rgba(29,43,65,${.18 * (1 - t.age / 22)})`); }
    for (const m of state.marks) {
      const g = m.gore;
      if (g > .15) { ellipse(c, m.x * w, m.y * h, w * (.009 + g * .013), h * (.003 + g * .005), `rgba(119,16,38,${.2 + g * .6})`); }
      for (let i = 0; i < (g > .65 ? 5 : 2); i++) ellipse(c, (m.x + Math.sin(m.seed + i * 2) * .015) * w, (m.y + Math.cos(i * 3) * .008) * h, w * .0035, h * .0024, i % 2 && g > .65 ? '#7d2136' : '#d7d3c8');
    }
    const actors = [...state.sheep.filter(s => s.alive).map(a => ({ a, kind: 'sheep' })), ...state.wolves.map(a => ({ a, kind: 'wolf' })), { a: state.dog, kind: 'dog' }].sort((a, b) => a.a.y - b.a.y);
    for (const { a, kind } of actors) animal(c, a, kind, w, h, state.time, p.light);
    for (const b of state.particles) ellipse(c, b.x * w, b.y * h, w * (b.wool ? .0035 : .0017), h * .0023, b.wool ? '#eee7d5' : '#9a1932');
    // Fog crosses in separate veils: gaps reveal attacks, then conceal the next approach.
    const fog = clamp(p.fog * (.5 + opts.recipe.mist) + (opts.snow - 1) * .1, .04, .94);
    for (let i = 0; i < 7; i++) {
      const x = ((state.time * (.008 + i * .001) + i * .17) % 1.6 - .3) * w;
      const y = (.44 + (i % 3) * .19 + Math.sin(state.time * .07 + i) * .04) * h;
      c.save(); c.translate(x, y); c.scale(1, .33);
      const veil = c.createRadialGradient(0, 0, 0, 0, 0, w * .4); veil.addColorStop(0, rgb(mix(p.snow, [186, 196, 202], .3), fog * .42)); veil.addColorStop(1, rgb(p.snow, 0));
      c.fillStyle = veil; c.fillRect(-w * .4, -w * .4, w * .8, w * .8); c.restore();
    }
    const snowCount = Math.min(180, Math.round(45 * opts.snow + opts.treble * 60));
    c.strokeStyle = rgb(mix(p.snow, [255, 255, 255], .6), .5); c.lineWidth = Math.max(1, w / 1200);
    c.beginPath(); for (let i = 0; i < snowCount; i++) { const x = ((i * .61803 + state.time * .035 * opts.snow) % 1) * w, y = ((i * .38197 + state.time * (.035 + i % 5 * .003)) % 1) * h; c.moveTo(x, y); c.lineTo(x - 3 * opts.snow, y + 2); } c.stroke();
    // The last seconds hide a reset beneath a dense, seamless snow curtain.
    const curtain = opts.form === 'cycle' ? clamp((state.time - 232) / 8, 0, 1) + clamp(1 - state.time / 6, 0, 1) : clamp((state.time - 235) / 5, 0, 1) + clamp(1 - state.time / 5, 0, 1);
    c.fillStyle = rgb([96, 113, 134], (opts.animate ? Math.min(1, curtain) : 0)); c.fillRect(0, 0, w, h);
    const font = Math.max(10, Math.min(15, w / 65)); c.font = `500 ${font}px sans-serif`; c.fillStyle = 'rgba(243,237,220,.8)';
    c.fillText(`AUTUMN 01  /  RALPH’S LAST WATCH`, w * .035, h * .065);
    c.fillStyle = 'rgba(243,237,220,.6)'; c.font = `${font * .85}px sans-serif`; c.fillText(p.name.toUpperCase(), w * .035, h * .065 + font * 1.6);
    return { time: state.time, phase: p.index, alive: state.sheep.filter(s => s.alive).length, kills: state.kills, wolves: state.wolves.length, particles: state.particles.length };
  }
  return { draw, reset, phaseAt, recipes };
})();
