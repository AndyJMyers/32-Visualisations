/* Autumn 02 / A2/32-A — Toadstools. Procedural, offline woodland theatre.
   Audio drives the choreography, never transport. All populations are bounded. */
window.AutumnToadstools = (() => {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const tau = Math.PI * 2;
  const recipes = [
    { name: 'Scarlet Matinee', form: 0, theme: 0, speed: 1, size: 1, count: 9, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Dew at Dawn', form: 1, theme: 0, speed: .7, size: 1.2, count: 7, grasp: .15, smiles: 0, insanity: 0 },
    { name: 'The Skirt Committee', form: 0, theme: 0, speed: 1.3, size: 1.4, count: 12, grasp: .65, smiles: 0, insanity: 0 },
    { name: 'After Hours in the Moss', form: 2, theme: 0, speed: .8, size: 1, count: 8, grasp: .85, smiles: 0, insanity: 0 },
    { name: 'Spore Score', form: 3, theme: 0, speed: 1.5, size: .85, count: 14, grasp: 1, smiles: 0, insanity: 0 },
  ];
  let state;
  const noise = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  function reset() {
    state = { time: 0, last: null, bass: 0, treble: 0, mid: 0, average: 0, pulse: 0,
      cooldown: 0, births: 0, mushrooms: [], background: null, backgroundKey: '' };
  }
  function ellipse(c, x, y, rx, ry, fill) {
    c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), 0, 0, tau); c.fill();
  }
  function mushroom(i, grown = true) {
    const depth = noise(i + 34);
    return { x: .08 + noise(i + 9) * .84, y: .58 + depth * .36,
      depth, seed: i * 2.399, growth: grown ? 1 : .025, age: 0 };
  }
  function background(w, h, form) {
    const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
    const c = canvas.getContext('2d'), night = form === 'moonlight' || form === 'enchanted';
    const sky = c.createLinearGradient(0, 0, w, h);
    sky.addColorStop(0, night ? '#071726' : '#183c3c');
    sky.addColorStop(.5, night ? '#173238' : form === 'dawn' ? '#7a8c89' : '#53776b'); sky.addColorStop(1, '#09251e');
    c.fillStyle = sky; c.fillRect(0, 0, w, h);
    // Birch trunks and foliage are rendered once per size/light change.
    for (let i = 0; i < 33; i++) {
      const x = noise(i + 100) * w, width = (2 + noise(i + 10) * 10) * w / 700;
      c.fillStyle = night ? '#607b80' : '#b1bcb0'; c.globalAlpha = .14 + noise(i) * .35;
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x + width, 0); c.lineTo(x + width * 3, h * .73); c.lineTo(x - width, h * .73); c.fill();
      c.strokeStyle = '#163132'; c.lineWidth = width * .35;
      for (let k = 0; k < 12; k++) { const y = noise(i * 15 + k) * h * .73; c.beginPath(); c.moveTo(x, y); c.lineTo(x + width, y + 2); c.stroke(); }
    }
    c.globalAlpha = 1;
    const sun = c.createRadialGradient(w * .72, h * .12, 0, w * .72, h * .12, h * .63);
    sun.addColorStop(0, night ? '#8dd8f84a' : form === 'dawn' ? '#f7c4db88' : '#ffe5a6aa'); sun.addColorStop(1, '#ffe5a600');
    c.fillStyle = sun; c.fillRect(0, 0, w, h);
    const ground = c.createLinearGradient(0, h * .5, 0, h);
    ground.addColorStop(0, '#19382c00'); ground.addColorStop(.23, '#183b29'); ground.addColorStop(1, '#061d15');
    c.fillStyle = ground; c.fillRect(0, h * .46, w, h * .54);
    for (let i = 0; i < 450; i++) {
      const x = noise(i + 201) * w, y = (.57 + noise(i + 600) * .43) * h;
      const r = (1 + noise(i + 20) * 7) * Math.min(w, h) / 600;
      c.save(); c.translate(x, y); c.rotate(noise(i) * tau);
      ellipse(c, 0, 0, r * 2, r * .65, ['#936027', '#bb7734', '#a64b29', '#577336', '#738044'][i % 5]); c.restore();
    }
    // Fern silhouettes at the edges frame the woodland stage.
    for (let i = 0; i < 12; i++) {
      const x = i % 2 ? w * .97 : w * .03, y = h * (.68 + noise(i) * .3), size = Math.min(w, h) * (.09 + noise(i + 3) * .12);
      c.save(); c.translate(x, y); c.rotate(i % 2 ? -.65 : .65); c.strokeStyle = '#809344'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-size * .2, -size * .5, 0, -size); c.stroke();
      for (let k = 1; k < 10; k++) for (const side of [-1, 1]) {
        c.save(); c.translate(-Math.sin(k / 10 * Math.PI) * size * .08, -size * k / 10); c.rotate(side * .65);
        ellipse(c, side * size * .10, 0, size * .15 * (1 - k / 12), size * .023, '#607c37'); c.restore();
      }
      c.restore();
    }
    return canvas;
  }
  function drawMushroom(c, m, w, h, opts) {
    const s = state, scale = Math.min(w, h), g = 1 - Math.pow(1 - m.growth, 3);
    const r = scale * (.035 + m.depth * .095) * opts.size * g;
    const stem = r * (1.05 + noise(m.seed) * .6), t = s.time;
    const sway = Math.sin(t * .75 + m.seed) * (.025 + s.bass * .13);
    c.save(); c.translate(m.x * w, m.y * h); c.rotate(sway);
    ellipse(c, 0, 0, r * 1.18, r * .17, '#00000055');
    const stalk = c.createLinearGradient(-r * .17, 0, r * .2, 0);
    stalk.addColorStop(0, '#a48b67'); stalk.addColorStop(.5, '#fff0c8'); stalk.addColorStop(1, '#b9a17c');
    c.fillStyle = stalk; c.beginPath(); c.moveTo(-r * .2, 0);
    c.bezierCurveTo(-r * .1, -stem * .4, -r * .2, -stem * .7, -r * .14, -stem);
    c.lineTo(r * .14, -stem); c.bezierCurveTo(r * .12, -stem * .6, r * .21, -stem * .3, r * .25, 0); c.closePath(); c.fill();
    // The annulus is a pleated skirt, lifting in successive folds on accents.
    c.save(); c.translate(0, -stem * .51);
    const flutter = Math.sin(t * 2.5 + m.seed) * (.03 + s.mid * .13) + s.pulse * .08;
    c.fillStyle = '#e9dab4'; c.beginPath(); c.moveTo(-r * .14, -r * .12);
    for (let k = 0; k <= 16; k++) {
      const a = k / 16 * Math.PI; c.lineTo(-Math.cos(a) * r * .37, Math.sin(a) * r * (.16 + flutter) + (k % 2) * r * .055);
    }
    c.lineTo(r * .14, -r * .12); c.closePath(); c.fill();
    c.strokeStyle = '#a38d6688'; c.lineWidth = Math.max(.6, r * .012);
    for (let k = 0; k < 10; k++) { const x = (k / 9 - .5) * r * .6; c.beginPath(); c.moveTo(x * .4, 0); c.lineTo(x, r * (.13 + flutter)); c.stroke(); }
    c.restore();
    // Cap tilt reveals the gills; spot orbits give a readable turning motion.
    c.translate(0, -stem); c.rotate(Math.sin(t * .43 + m.seed) * (.04 + s.mid * .11));
    const underside = r * (.19 + .09 * Math.sin(t * .55 + m.seed));
    ellipse(c, 0, 0, r, underside, '#ead1a0');
    c.save(); c.beginPath(); c.ellipse(0, 0, r, underside, 0, 0, tau); c.clip();
    for (let k = 0; k < 38; k++) {
      const a = k / 38 * tau;
      c.strokeStyle = `rgba(143,96,48,${.3 + .15 * Math.sin(k * .8 + t * 2)})`;
      c.lineWidth = Math.max(.5, r * .012); c.beginPath(); c.moveTo(0, -r * .07); c.lineTo(Math.cos(a) * r, Math.sin(a) * underside); c.stroke();
    }
    if (s.treble > .01 || opts.form === 'enchanted') {
      c.globalCompositeOperation = 'screen';
      for (let k = 0; k < 12; k++) {
        const a = k / 12 * tau + t * .5; c.strokeStyle = `rgba(123,237,218,${clamp(s.treble * .65 + (opts.form === 'enchanted' ? .16 : 0), 0, .8)})`;
        c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * r, Math.sin(a) * underside); c.stroke();
      }
    }
    c.restore();
    const dome = r * (.58 + (1 - g) * .4);
    const red = c.createLinearGradient(-r, -dome, r * .7, 0);
    red.addColorStop(0, '#ff9a61'); red.addColorStop(.28, '#ef4030'); red.addColorStop(.7, '#bb191e'); red.addColorStop(1, '#650e1b');
    c.fillStyle = red; c.beginPath(); c.moveTo(-r, 0); c.bezierCurveTo(-r * .9, -dome * 1.3, r * .85, -dome * 1.3, r, 0); c.quadraticCurveTo(0, -r * .11, -r, 0); c.fill();
    c.save(); c.clip();
    for (let k = 0; k < 28; k++) {
      const angle = noise(k + m.seed) * tau + t * (.08 + s.mid * .15);
      const radius = Math.sqrt(noise(k + m.seed + 70));
      const x = Math.cos(angle) * radius * r * .91, y = -dome * .43 + Math.sin(angle) * radius * dome * .51;
      const spot = r * (.025 + noise(k + 301) * .035);
      ellipse(c, x + spot * .2, y + spot * .4, spot, spot * .52, '#6e271960');
      ellipse(c, x, y, spot, spot * .55, '#fff0c9');
    }
    c.restore();
    c.strokeStyle = '#ffd7a3'; c.lineWidth = Math.max(.7, r * .018); c.beginPath(); c.moveTo(-r, 0); c.quadraticCurveTo(0, -r * .11, r, 0); c.stroke();
    c.restore();
  }
  function sprite(c, index, w, h, amount) {
    const t = state.time, scale = Math.min(w, h), visit = Math.sin(t * .17 + index * 2.5);
    if (visit < .05 || amount < .01) return false;
    const x = (.5 + Math.sin(t * (.19 + index * .03) + index * 3) * .34) * w;
    const y = (.40 + Math.sin(t * .37 + index) * .13 + Math.cos(t * .71) * .025) * h;
    const r = scale * .012;
    c.save(); c.translate(x, y); c.rotate(Math.sin(t + index) * .25);
    c.globalAlpha = Math.min(1, visit * 3) * amount;
    c.shadowColor = '#b8fff0'; c.shadowBlur = r * 2;
    const wing = .5 + Math.abs(Math.sin(t * 23)) * .6;
    for (const side of [-1, 1]) {
      c.save(); c.rotate(side * .45); ellipse(c, side * r * wing, -r * .2, r * .8 * wing, r * 1.4, '#a2ebdf99'); c.restore();
    }
    c.shadowBlur = 0; ellipse(c, 0, -r * 1.1, r * .35, r * .4, '#ffdbb4');
    c.fillStyle = '#ce80c5'; c.beginPath(); c.moveTo(0, -r * .65); c.lineTo(-r * .6, r * .7); c.quadraticCurveTo(0, r * .35, r * .65, r * .65); c.closePath(); c.fill();
    c.strokeStyle = '#ffdbb4'; c.lineWidth = Math.max(1, r * .13); c.lineCap = 'round';
    c.beginPath(); c.moveTo(-r * .1, r * .6); c.lineTo(-r * .45, r * 1.4); c.moveTo(r * .2, r * .6); c.lineTo(r * .9, r * 1.1);
    c.moveTo(0, -r * .4); c.lineTo(-r * .9, -r * .8); c.moveTo(0, -r * .4); c.lineTo(r * .8, -r * 1.3); c.stroke();
    c.restore(); return true;
  }
  function draw(c, w, h, now, options = {}) {
    if (!state) reset();
    const s = state, o = { speed: 1, size: 1, count: 9, mischief: .4, bass: 0, mid: 0, treble: 0, form: 'golden', animate: true, ...options };
    o.size = clamp(Number(o.size) || 1, .55, 1.8);
    const dt = s.last === null || !o.animate ? 0 : clamp((now - s.last) / 1000, 0, .05);
    s.last = now;
    const smoothing = 1 - Math.exp(-dt * 8);
    for (const band of ['bass', 'mid', 'treble']) s[band] += (clamp(Number(o[band]) || 0, 0, 1) - s[band]) * smoothing;
    s.time += dt * clamp(Number(o.speed) || 1, .2, 3);
    s.average += (s.bass - s.average) * (1 - Math.exp(-dt * 1.4));
    s.cooldown = Math.max(0, s.cooldown - dt); s.pulse *= Math.exp(-dt * 4);
    const wanted = clamp(Math.round(Number(o.count) || 9), 3, 14);
    if (!s.mushrooms.length) s.mushrooms = Array.from({ length: wanted }, (_, i) => mushroom(i));
    while (s.mushrooms.length < wanted) s.mushrooms.push(mushroom(s.mushrooms.length));
    s.mushrooms.length = wanted;
    if (dt > 0 && s.bass > .12 && s.bass - s.average > .055 && s.cooldown === 0) {
      s.pulse = 1; s.cooldown = .55;
      // Replace a small background performer, retaining the mature foreground anchors.
      const candidates = s.mushrooms.filter(m => m.depth < .65 && m.growth > .95);
      if (candidates.length) { const m = candidates[s.births % candidates.length]; m.growth = .025; m.age = 0; s.births++; }
    }
    for (const m of s.mushrooms) { m.growth = Math.min(1, m.growth + dt * (.17 + s.bass * .9)); m.age += dt; }
    const key = `${w}:${h}:${o.form}`;
    if (s.backgroundKey !== key) { s.background = background(w, h, o.form); s.backgroundKey = key; }
    c.save(); c.drawImage(s.background, 0, 0);
    s.mushrooms.slice().sort((a, b) => a.y - b.y).forEach(m => drawMushroom(c, m, w, h, o));
    // Drifting spores are deterministic and constant in number: no accumulating particles.
    c.globalCompositeOperation = 'screen';
    for (let i = 0; i < 42; i++) {
      const x = ((noise(i + 90) + Math.sin(s.time * .14 + i) * .035 + 1) % 1) * w;
      const y = ((noise(i + 40) - s.time * (.004 + noise(i) * .007)) % 1 + 1) % 1 * h;
      ellipse(c, x, y, 1 + noise(i) * Math.min(w, h) * .002, 1 + noise(i) * Math.min(w, h) * .002, `rgba(255,226,159,${.12 + s.treble * .45})`);
    }
    c.globalCompositeOperation = 'source-over';
    let sprites = 0;
    for (let i = 0; i < 3; i++) if (sprite(c, i, w, h, clamp(o.mischief, 0, 1))) sprites++;
    const vignette = c.createRadialGradient(w * .5, h * .5, Math.min(w, h) * .25, w * .5, h * .5, Math.max(w, h) * .75);
    vignette.addColorStop(0, '#00000000'); vignette.addColorStop(1, '#001410b0'); c.fillStyle = vignette; c.fillRect(0, 0, w, h);
    c.restore();
    return { time: s.time, mushrooms: s.mushrooms.length, growing: s.mushrooms.filter(m => m.growth < 1).length,
      births: s.births, sprites, spores: 42, bass: s.bass, treble: s.treble };
  }
  return { draw, reset, recipes };
})();
