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
    { name: 'Snow Above the Woodland', form: 4, theme: 0, speed: 1, size: 1.1, count: 9, grasp: .4, smiles: 0, insanity: 0 },
  ];
  let state;
  const noise = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  function reset() {
    state = { time: 0, last: null, bass: 0, treble: 0, mid: 0, average: 0, pulse: 0,
      cooldown: 0, births: 0, mushrooms: [], background: null, backgroundKey: '', skyTime: 0, skyActive: false,
      spores: [], sporeAverage: 0, sporeCooldown: 0, backgroundSporeCooldown: .8,
      burstCooldown: 0, emissions: 0, backgroundEmissions: 0, bursts: 0 };
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
    c.save(); c.translate(m.x * w, m.y * h); c.rotate(sway + (m.flightTilt || 0));
    if (!m.airborne) ellipse(c, 0, 0, r * 1.18, r * .17, '#00000055');
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
  function skyAltitude(time) {
    const smooth = value => { const x = clamp(value, 0, 1); return x * x * (3 - 2 * x); };
    const phase = time % 40;
    return smooth((phase - 2) / 9) * (1 - smooth((phase - 29) / 9));
  }
  function skySnow(c, w, h, time, altitude, treble) {
    if (altitude <= 0) return 0;
    const count = 72, scale = Math.min(w, h);
    c.save(); c.lineCap = 'round';
    for (let i = 0; i < count; i++) {
      const fall = time * (.025 + noise(i + 260) * .035);
      const x = ((noise(i + 333) + Math.sin(time * .25 + i) * .045 + 1) % 1) * w;
      const y = ((noise(i + 444) + fall) % 1) * h;
      const r = clamp(scale * (.009 + noise(i + 42) * .019), 2, 13);
      const twinkle = Math.max(0, Math.sin(time * (1.4 + noise(i) * 2) + i * 4.7));
      const flash = twinkle > .96 && noise(i + 100) > .6;
      c.strokeStyle = flash ? (i % 2 ? '#ff524d' : '#fff265') : (i % 2 ? '#fff0c0' : '#e4f3ff');
      c.globalAlpha = altitude * (.25 + twinkle * (.5 + treble * .2));
      c.lineWidth = Math.max(.6, r * .11); c.save(); c.translate(x, y); c.rotate(time * .12 + i);
      c.beginPath();
      for (let arm = 0; arm < 6; arm++) {
        const a = arm * tau / 6, dx = Math.cos(a), dy = Math.sin(a);
        c.moveTo(0, 0); c.lineTo(dx * r, dy * r);
        if (r > 4) {
          for (const side of [-1, 1]) {
            const b = a + side * .65;
            c.moveTo(dx * r * .65, dy * r * .65);
            c.lineTo(dx * r * .65 - Math.cos(b) * r * .27, dy * r * .65 - Math.sin(b) * r * .27);
          }
        }
      }
      c.stroke(); c.restore();
    }
    c.restore(); return count;
  }
  function travellingMushroom(m, time, altitude) {
    const orbit = time * .65 + m.seed;
    const targetX = .5 + (m.x - .5) * .7 + Math.sin(orbit) * .12;
    const targetY = .22 + m.depth * .42 + Math.cos(orbit * .8) * .06;
    return { ...m, x: m.x + (targetX - m.x) * altitude,
      y: m.y + (targetY - m.y) * altitude,
      flightTilt: Math.sin(orbit) * .24 * altitude, airborne: altitude > .01 };
  }
  function releaseSpores(mushrooms, w, h, size, burst, background = false) {
    const s = state, count = background ? 18 : burst ? 84 : 24;
    const ranked = mushrooms.slice().sort((a, b) => b.depth - a.depth);
    const boundary = Math.max(1, Math.ceil(ranked.length / 2));
    const mature = (background ? ranked.slice(boundary) : ranked.slice(0, boundary)).filter(m => m.growth > .5);
    if (!mature.length) return;
    const active = s.spores.filter(p => p.background === background).length;
    const available = Math.min(count, (background ? 60 : 180) - active);
    if (available <= 0) return;
    if (background) s.backgroundEmissions++; else s.emissions++;
    if (burst) s.bursts++;
    const emission = background ? s.backgroundEmissions : s.emissions;
    const style = (emission + (background ? 2 : 0)) % 4;
    for (let i = 0; i < available; i++) {
      const seed = emission * 71 + i * 13 + (background ? 319 : 0);
      const m = mature[(emission + (background ? Math.floor(i / 9) : burst ? Math.floor(i / 28) : 0)) % Math.min(mature.length, 4)];
      const r = Math.min(w, h) * (.035 + m.depth * .095) * size * (1 - Math.pow(1 - m.growth, 3));
      const stem = r * (1.05 + noise(m.seed) * .6);
      const sway = Math.sin(s.time * .75 + m.seed) * (.025 + s.bass * .13) + (m.flightTilt || 0);
      const capTilt = Math.sin(s.time * .43 + m.seed) * (.04 + s.mid * .11);
      const across = (noise(seed) - .5) * r * 1.75;
      const below = r * (.04 + noise(seed + 4) * .13);
      const capX = across * Math.cos(capTilt) - below * Math.sin(capTilt);
      const capY = -stem + across * Math.sin(capTilt) + below * Math.cos(capTilt);
      s.spores.push({ x: m.x + (capX * Math.cos(sway) - capY * Math.sin(sway)) / w,
        y: m.y + (capX * Math.sin(sway) + capY * Math.cos(sway)) / h,
        vx: (noise(seed + 1) - .5) * (burst ? .05 : .025),
        vy: (.025 + noise(seed + 2) * (burst ? .09 : .045)) * (background ? .75 : 1), age: 0,
        life: 3.2 + noise(seed + 3) * 2.8, seed, background,
        scale: background ? clamp(.42 + m.depth * .38, .42, .7) : 1,
        kind: burst && i % 4 === 0 ? (style + 1) % 4 : style });
    }
  }
  function drawSpores(c, w, h) {
    const s = state, scale = Math.min(w, h);
    c.save(); c.globalCompositeOperation = 'screen';
    for (const p of s.spores) {
      const fade = Math.min(1, p.age * 5, (p.life - p.age) * 1.2);
      const x = p.x * w, y = p.y * h, r = clamp(scale * (.006 + noise(p.seed) * .004), 2, 8) * p.scale;
      c.save(); c.translate(x, y); c.rotate(s.time * (1 + noise(p.seed)) + p.seed); c.globalAlpha = fade * (.8 + s.treble * .2);
      if (p.kind === 0) {
        ellipse(c, 0, 0, r, r * .8, '#e1f7ff');
        lineSpore(c, r * 1.8, '#ffffff');
      } else if (p.kind === 1) {
        c.fillStyle = '#be82ff'; c.beginPath(); c.moveTo(0, -r * 1.7); c.lineTo(r, 0); c.lineTo(0, r * 1.7); c.lineTo(-r, 0); c.closePath(); c.fill();
        c.strokeStyle = '#f7d9ff'; c.lineWidth = .8; c.beginPath(); c.moveTo(0, -r); c.lineTo(0, r); c.stroke();
      } else if (p.kind === 2) {
        c.rotate(-s.time * (1 + noise(p.seed)) - p.seed); c.fillStyle = '#ff8a3e'; c.beginPath(); c.moveTo(0, -r * 2.3);
        c.quadraticCurveTo(r * 1.5, -r * .3, r * .65, r * .7); c.quadraticCurveTo(0, r * 1.4, -r * .65, r * .7);
        c.quadraticCurveTo(-r * 1.5, -r * .3, 0, -r * 2.3); c.fill(); ellipse(c, 0, r * .2, r * .34, r * .55, '#ffe8a0');
      } else {
        lineSpore(c, r * 2, '#ffd268'); ellipse(c, 0, 0, r * .55, r * .55, '#fff7cf');
      }
      c.restore();
    }
    c.restore();
  }
  function lineSpore(c, r, colour) {
    c.strokeStyle = colour; c.lineWidth = Math.max(.7, r * .12); c.beginPath();
    c.moveTo(-r, 0); c.lineTo(r, 0); c.moveTo(0, -r); c.lineTo(0, r); c.stroke();
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
    const skyActive = o.form === 'skysnow';
    if (skyActive && !s.skyActive) s.skyTime = 0;
    if (skyActive) s.skyTime += dt * clamp(Number(o.speed) || 1, .2, 3);
    s.skyActive = skyActive;
    const altitude = skyActive ? skyAltitude(s.skyTime) : 0;
    s.average += (s.bass - s.average) * (1 - Math.exp(-dt * 1.4));
    s.cooldown = Math.max(0, s.cooldown - dt); s.pulse *= Math.exp(-dt * 4);
    const level = s.bass * .5 + s.mid * .3 + s.treble * .2;
    s.sporeAverage += (level - s.sporeAverage) * (1 - Math.exp(-dt * 1.2));
    s.sporeCooldown = Math.max(0, s.sporeCooldown - dt);
    s.burstCooldown = Math.max(0, s.burstCooldown - dt);
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
    const travellers = skyActive ? s.mushrooms.map(m => travellingMushroom(m, s.skyTime, altitude)) : s.mushrooms;
    if (dt > 0 && level > .035) {
      s.backgroundSporeCooldown = Math.max(0, s.backgroundSporeCooldown - dt);
      const burst = level > .32 && level - s.sporeAverage > .065 && s.burstCooldown === 0;
      if (burst || s.sporeCooldown === 0) {
        releaseSpores(travellers, w, h, o.size, burst);
        s.sporeCooldown = burst ? 1.2 : Math.max(.65, 2.3 - level * 1.4);
        if (burst) s.burstCooldown = 4;
      }
      if (s.backgroundSporeCooldown === 0) {
        releaseSpores(travellers, w, h, o.size, false, true);
        s.backgroundSporeCooldown = Math.max(1.1, 3.1 - level * .8);
      }
    }
    for (const p of s.spores) {
      const breeze = Math.sin(s.time * .65) * .035 + Math.sin(s.time * 1.5 + p.seed) * .008;
      p.age += dt; p.x += (p.vx + breeze) * dt; p.y += p.vy * dt;
      p.vx *= Math.exp(-dt * .5); p.vy += .014 * dt;
    }
    s.spores = s.spores.filter(p => p.age < p.life);
    const key = `${w}:${h}:${o.form}`;
    if (s.backgroundKey !== key) { s.background = background(w, h, o.form); s.backgroundKey = key; }
    c.save();
    if (skyActive) {
      const sky = c.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#071426'); sky.addColorStop(.55, '#33465c'); sky.addColorStop(1, '#a98e79');
      c.fillStyle = sky; c.fillRect(0, 0, w, h);
    }
    c.save(); c.globalAlpha = 1 - altitude * .95; c.translate(0, altitude * h * 1.12); c.drawImage(s.background, 0, 0);
    if (!skyActive) s.mushrooms.slice().sort((a, b) => a.y - b.y).forEach(m => drawMushroom(c, m, w, h, o));
    let sprites = 0;
    for (let i = 0; i < 3; i++) if (sprite(c, i, w, h, clamp(o.mischief, 0, 1))) sprites++;
    c.restore();
    const snowflakes = skyActive ? skySnow(c, w, h, s.skyTime, altitude, s.treble) : 0;
    let airborne = 0;
    if (skyActive) {
      // The amanitas follow winding individual paths, returning to their original places.
      travellers.sort((a, b) => a.y - b.y).forEach(m => drawMushroom(c, m, w, h, o));
      if (altitude > .01) airborne = travellers.length;
    }
    drawSpores(c, w, h);
    const vignette = c.createRadialGradient(w * .5, h * .5, Math.min(w, h) * .25, w * .5, h * .5, Math.max(w, h) * .75);
    vignette.addColorStop(0, '#00000000'); vignette.addColorStop(1, '#001410b0'); c.fillStyle = vignette; c.fillRect(0, 0, w, h);
    c.restore();
    return { time: s.time, mushrooms: s.mushrooms.length, growing: s.mushrooms.filter(m => m.growth < 1).length,
      births: s.births, sprites, spores: s.spores.length, sporeEmissions: s.emissions, sporeBursts: s.bursts,
      backgroundSporeEmissions: s.backgroundEmissions, backgroundSpores: s.spores.filter(p => p.background).length,
      sporeKinds: [...new Set(s.spores.map(p => p.kind))], fallingSpores: s.spores.filter(p => p.vy > 0).length,
      bass: s.bass, treble: s.treble, altitude, snowflakes, airborne };
  }
  return { draw, reset, recipes };
})();
