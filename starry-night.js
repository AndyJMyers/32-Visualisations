/* Autumn 09: an original, music-responsive night landscape after Van Gogh. */
window.StarryNight = (() => {
  const TAU = Math.PI * 2;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const hash = value => {
    const n = Math.sin(value * 127.1 + 78.233) * 43758.5453;
    return n - Math.floor(n);
  };
  const recipes = [
    { name: 'Cobalt Current', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Amber Constellation', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Negative Tempest', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    cobalt: {
      sky: ['#071730', '#183862', '#315472'], stroke: ['#7898bb', '#4575aa', '#c4b9a0', '#31527d'],
      light: '#ffdf84', halo: '#e9c76f', hill: '#263b59', village: '#28334a', roof: '#47617c', cypress: '#111c28', window: '#ebbe73',
    },
    amber: {
      sky: ['#291337', '#813a56', '#d77957'], stroke: ['#ffd07b', '#f68e6b', '#f5dcac', '#874c99'],
      light: '#fff0bb', halo: '#ffae66', hill: '#744765', village: '#402e49', roof: '#b87b76', cypress: '#32263f', window: '#ffe4a2',
    },
    silver: {
      sky: ['#f7dfa9', '#d9cde0', '#a9dad5'], stroke: ['#624176', '#b45683', '#316678', '#81556c'],
      light: '#292e63', halo: '#6d4d82', hill: '#d3b2c9', village: '#f3dfb6', roof: '#ae7488', cypress: '#423657', window: '#443262',
    },
  };
  const stars = [
    [86, 86, 8], [192, 152, 12], [280, 65, 7], [364, 132, 10], [495, 68, 8],
    [565, 155, 12], [645, 75, 8], [734, 126, 11], [805, 65, 23], [865, 205, 7], [460, 208, 5],
  ];
  let time = 0, phase = 0, last = null, bass = 0, mid = 0, treble = 0;

  function reset() { time = 0; phase = 0; last = null; bass = 0; mid = 0; treble = 0; }
  function ellipse(c, x, y, rx, ry, fill) {
    c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
  }
  function stroke(c, colour, width, x, y, dx, dy, bend = 0) {
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + dx * .5 - dy * bend, y + dy * .5 + dx * bend, x + dx, y + dy); c.stroke();
  }
  function sky(c, palette) {
    const fill = c.createLinearGradient(0, 0, 0, 385);
    fill.addColorStop(0, palette.sky[0]); fill.addColorStop(.56, palette.sky[1]); fill.addColorStop(1, palette.sky[2]);
    c.fillStyle = fill; c.fillRect(0, 0, 900, 500);
  }
  function vortexAt(index, movement) {
    const x = index ? 655 : 330, y = index ? 165 : 195;
    return [x + Math.sin(movement * .48 + index * 2) * 42,
      y + Math.cos(movement * .65 + index * 1.7) * 24];
  }
  function starAt([x, y], index, movement) {
    return [x + Math.sin(movement * .72 + index * 2.1) * (5 + bass * 7),
      y + Math.cos(movement * .57 + index * 1.4) * (3 + mid * 5)];
  }
  function flowingSky(c, palette, movement, mood) {
    const vortices = [vortexAt(0, movement), vortexAt(1, movement)];
    for (let index = 0; index < vortices.length; index++) {
      const [cx, cy] = vortices[index];
      const glow = c.createRadialGradient(cx, cy, 8, cx, cy, index ? 175 : 235);
      glow.addColorStop(0, `${palette.stroke[index + 1]}55`);
      glow.addColorStop(.55, `${palette.stroke[index]}22`);
      glow.addColorStop(1, `${palette.stroke[index]}00`);
      ellipse(c, cx, cy, index ? 175 : 235, index ? 135 : 170, glow);
    }
    for (let band = 0; band < 4; band++) {
      c.globalAlpha = .23 + bass * .1;
      c.strokeStyle = palette.stroke[(band + 1) % palette.stroke.length];
      c.lineWidth = 13 + band * 3 + bass * 9;
      c.beginPath();
      for (let x = -20; x <= 920; x += 14) {
        const wave = Math.sin(x * .012 + movement * (.65 + band * .08) + band * 1.7) * (20 + bass * 17);
        const y = 70 + band * 71 + wave + Math.sin(x * .026 - movement * .48) * 8;
        if (x === -20) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
    }
    // The short brush marks travel through a moving velocity field, not just rotate in place.
    for (let row = 0; row < 16; row++) for (let col = 0; col < 34; col++) {
      const index = row * 34 + col;
      const x = (col * 29 + hash(index + 11) * 20 + movement * (24 + hash(index + 31) * 12)) % 980 - 40;
      const y = row * 23 + 8 + hash(index + 29) * 15
        + Math.sin(movement * .85 + row * .62 + col * .27) * (8 + bass * 12);
      const vortex = vortices[x < 535 ? 0 : 1];
      const px = (x - vortex[0]) / 225, py = (y - vortex[1]) / 118;
      const pull = Math.exp(-(px * px + py * py) * .75);
      const vx = 1.05 - py * pull * (2.5 + mood * .6);
      const vy = px * pull * (2.2 + mood * .5) + Math.sin(x * .012 + y * .014 - movement * .7) * .4;
      const length = (13 + hash(index + 53) * 19) * (1 + bass * .4);
      const angle = Math.atan2(vy, vx) + Math.sin(movement * .8 + index * .17) * .16;
      const colour = palette.stroke[Math.floor(hash(index + 3) * palette.stroke.length)];
      c.globalAlpha = .29 + hash(index + 7) * .32;
      stroke(c, colour, 1.7 + hash(index + 19) * 2.8, x, y,
        Math.cos(angle) * length, Math.sin(angle) * length, .2 + pull * .12);
    }
    c.globalAlpha = 1;
    for (let index = 0; index < vortices.length; index++) {
      const [cx, cy] = vortices[index], radius = index ? .7 : 1;
      for (let ring = 0; ring < 5; ring++) {
        const rx = (41 + ring * 20 + bass * 11) * radius;
        const ry = (22 + ring * 13 + bass * 7) * radius;
        for (let segment = 0; segment < 28; segment++) {
          const a = segment * TAU / 28 + movement * (.17 + ring * .018) * (index ? -1 : 1);
          const ripple = 1 + Math.sin(a * 3 - movement * 1.4 + ring) * (.08 + mid * .08);
          const x = cx + Math.cos(a) * rx * ripple, y = cy + Math.sin(a) * ry * ripple;
          const tangentX = -Math.sin(a) * (13 + ring * 2), tangentY = Math.cos(a) * (9 + ring);
          c.globalAlpha = .39 + .26 * Math.sin(segment * 2 + ring + movement * 1.1) ** 2;
          stroke(c, palette.stroke[(ring + segment) % palette.stroke.length], 3.5 + bass * 2.6,
            x, y, tangentX, tangentY, .33);
        }
      }
    }
    c.globalAlpha = 1;
  }
  function lights(c, palette, movement) {
    stars.forEach(([baseX, baseY, radius], i) => {
      const [x, y] = starAt([baseX, baseY], i, movement);
      const pulse = 1 + Math.sin(movement * (1.5 + i * .08) + i * 2) * (.09 + treble * .22);
      const r = radius * pulse;
      const halo = c.createRadialGradient(x, y, 0, x, y, r * 3.8);
      halo.addColorStop(0, palette.light); halo.addColorStop(.19, palette.halo);
      halo.addColorStop(.42, `${palette.halo}88`); halo.addColorStop(1, `${palette.halo}00`);
      ellipse(c, x, y, r * 3.8, r * 3.8, halo);
      for (let ring = 0; ring < 3; ring++) {
        c.strokeStyle = ring === 1 ? palette.light : palette.halo;
        c.globalAlpha = .25 + treble * .18; c.lineWidth = 1.5 + ring * .65;
        c.beginPath(); c.ellipse(x, y, r * (1.55 + ring * .58), r * (1.35 + ring * .47), movement * .11, 0, TAU); c.stroke();
      }
      c.globalAlpha = 1;
      ellipse(c, x, y, Math.max(2.5, r * .42), Math.max(2.5, r * .42), palette.light);
      if (i === 8) {
        c.globalAlpha = .32; ellipse(c, x + 6, y - 8, r * .75, r * .75, palette.sky[0]); c.globalAlpha = 1;
      }
    });
  }
  function alchemySky(c, form, palette, movement) {
    if (form === 'amber') {
      // A loose constellation crosses the painting without fixing the stars in place.
      c.globalAlpha = .55 + treble * .2;
      for (let i = 0; i < stars.length - 1; i++) {
        const [x, y] = starAt(stars[i], i, movement);
        const [nextX, nextY] = starAt(stars[i + 1], i + 1, movement);
        const crest = Math.sin(movement * .35 + i * 1.9) * (18 + mid * 14);
        c.strokeStyle = i % 2 ? '#f3c77e' : '#d3a6a0'; c.lineWidth = 1.3 + mid * .8;
        c.beginPath(); c.moveTo(x, y);
        c.quadraticCurveTo((x + nextX) * .5, (y + nextY) * .5 - crest, nextX, nextY); c.stroke();
      }
      for (let i = 0; i < 22; i++) {
        const x = 24 + hash(i + 1800) * 852, y = 50 + hash(i + 1900) * 235;
        const flicker = .7 + Math.sin(movement * 2 + i * 3) * (.1 + treble * .3);
        ellipse(c, x, y, 1.5 * flicker, 1.5 * flicker, '#ffe6a6');
      }
    } else if (form === 'silver') {
      // Long wind-swept glints cut across the tighter swirls of the tempest.
      for (let i = 0; i < 58; i++) {
        const x = hash(i + 2000) * 1010 - 70;
        const y = 36 + hash(i + 2100) * 286;
        const lift = Math.sin(movement * .75 + i * .7) * 9;
        c.globalAlpha = .18 + hash(i + 2200) * .34;
        stroke(c, i % 3 ? '#c9e5e1' : '#e6e7d7', 1 + treble * 2,
          x, y + lift, 22 + hash(i + 2300) * 40 + bass * 18, -8 - mid * 12, .12);
      }
    }
    c.globalAlpha = 1;
  }
  function hills(c, palette, movement, form) {
    const shift = form === 'amber' ? 1.7 : form === 'silver' ? -.3 : .9;
    c.fillStyle = palette.hill; c.beginPath(); c.moveTo(0, 350);
    for (let x = 0; x <= 900; x += 12) c.lineTo(x, 345 + Math.sin(x * .012 + shift) * 29 + Math.sin(x * .027 + shift) * 9);
    c.lineTo(900, 500); c.lineTo(0, 500); c.fill();
    for (let i = 0; i < 80; i++) {
      const x = hash(i + 400) * 940 - 20;
      const y = 350 + hash(i + 510) * 38 + Math.sin(x * .012 + shift) * 29;
      c.globalAlpha = .25 + hash(i + 600) * .26;
      stroke(c, palette.stroke[i % 4], 2 + hash(i + 700) * 2, x, y, 8 + hash(i + 800) * 15, Math.sin(movement * .2 + i) * .6, .1);
    }
    c.globalAlpha = 1;
  }
  function windowLight(c, palette, x, y, index) {
    const width = 10, height = 14;
    const cycle = 50 + hash(index + 2500) * 35;
    const position = (time + hash(index + 2600) * cycle) / cycle;
    const step = Math.floor(position);
    const blend = clamp((position - step) * cycle / 2, 0, 1);
    const before = hash(index * 31 + (step - 1) * 43 + 2700) > .32 ? 1 : 0;
    const after = hash(index * 31 + step * 43 + 2700) > .32 ? 1 : 0;
    const brightness = before + (after - before) * (blend * blend * (3 - 2 * blend));
    if (brightness < .01) return;
    c.globalAlpha = brightness;
    c.fillStyle = palette.window; c.fillRect(x, y, width, height);
    c.globalAlpha = 1;
    if (index % 5 !== 2) return;
    const crossingCycle = 63 + hash(index + 2900) * 15;
    const crossing = (time + hash(index + 2800) * crossingCycle) % crossingCycle;
    if (crossing > 3.4) return;
    const figureX = x - 3 + crossing / 3.4 * (width + 6);
    c.save(); c.beginPath(); c.rect(x, y, width, height); c.clip();
    c.globalAlpha = brightness * .88;
    c.fillStyle = palette.cypress;
    ellipse(c, figureX, y + 4.2, 2, 2.5, palette.cypress);
    c.beginPath(); c.moveTo(figureX - 2, y + 7);
    c.lineTo(figureX + 2, y + 7); c.lineTo(figureX + 3, y + height);
    c.lineTo(figureX - 3, y + height); c.closePath(); c.fill();
    c.restore();
  }
  function village(c, palette, form) {
    const view = form === 'amber' ? { start: -15, step: 57, count: 17, church: 638, seed: 70 }
      : form === 'silver' ? { start: -26, step: 52, count: 20, church: 245, seed: 140 }
        : { start: 52, step: 47, count: 18, church: 476, seed: 0 };
    c.fillStyle = palette.village; c.fillRect(0, 402, 900, 98);
    for (let i = 0; i < view.count; i++) {
      const x = view.start + i * view.step + hash(i + 200 + view.seed) * 12;
      const width = 35 + hash(i + 210 + view.seed) * 19;
      const top = 393 + hash(i + 220 + view.seed) * 27;
      c.fillStyle = palette.village; c.fillRect(x, top, width, 500 - top);
      c.fillStyle = palette.roof; c.beginPath(); c.moveTo(x - 6, top); c.lineTo(x + width * .48, top - 13 - hash(i + 230 + view.seed) * 13);
      c.lineTo(x + width + 6, top); c.closePath(); c.fill();
      if (hash(i + 240 + view.seed) > .28) windowLight(c, palette, x + 8, top + 16, i * 2 + view.seed);
      if (hash(i + 250 + view.seed) > .42) windowLight(c, palette, x + width - 16, top + 18, i * 2 + 1 + view.seed);
    }
    const church = view.church;
    c.fillStyle = palette.village; c.fillRect(church - 25, 378, 51, 122);
    c.fillStyle = palette.roof; c.beginPath(); c.moveTo(church - 33, 379); c.lineTo(church, 353); c.lineTo(church + 34, 379); c.fill();
    c.fillStyle = palette.village; c.fillRect(church - 10, 329, 19, 28);
    c.beginPath(); c.moveTo(church - 16, 330); c.lineTo(church, 297); c.lineTo(church + 15, 330); c.fill();
    windowLight(c, palette, church - 4, 347, 36 + view.seed);
    c.fillStyle = palette.village; c.fillRect(0, 471, 900, 29);
    for (let i = 0; i < 130; i++) {
      const x = hash(i + 1000) * 900, y = 451 + hash(i + 1100) * 49;
      c.globalAlpha = .18 + hash(i + 1200) * .18;
      stroke(c, palette.stroke[i % 4], 1 + hash(i + 1300) * 2, x, y, 4 + hash(i + 1400) * 11, -1, .15);
    }
    c.globalAlpha = 1;
  }
  function cypress(c, palette, movement) {
    const sway = Math.sin(movement * .26) * (1 + bass * 3);
    c.fillStyle = palette.cypress; c.beginPath(); c.moveTo(33, 500);
    c.bezierCurveTo(8, 420, 55, 320, 75, 256);
    c.bezierCurveTo(83, 232, 94 + sway, 195, 98 + sway, 117);
    c.bezierCurveTo(122 + sway, 194, 129, 242, 118, 307);
    c.bezierCurveTo(153, 352, 148, 412, 172, 500); c.closePath(); c.fill();
    for (let i = 0; i < 45; i++) {
      const y = 160 + i * 8, x = 94 + Math.sin(i * 1.7) * (11 + i * .35);
      c.globalAlpha = .16 + hash(i + 1500) * .32;
      stroke(c, palette.stroke[i % 4], 1.5 + hash(i + 1600) * 2.2, x, y, Math.sin(i * 1.8) * 9, -9 - hash(i + 1700) * 12, .22);
    }
    c.globalAlpha = 1;
  }
  function poplars(c, palette, movement) {
    for (let i = 0; i < 3; i++) {
      const x = 745 + i * 61, top = 175 + i * 36;
      const sway = Math.sin(movement * .3 + i) * (2 + bass * 2);
      c.fillStyle = palette.cypress; c.beginPath(); c.moveTo(x - 23, 500);
      c.bezierCurveTo(x - 28, 380, x - 16, top + 66, x + sway, top);
      c.bezierCurveTo(x + 19 + sway, top + 68, x + 30, 392, x + 26, 500);
      c.closePath(); c.fill();
      for (let j = 0; j < 22; j++) {
        const y = top + 35 + j * (290 - (top - 175)) / 22;
        c.globalAlpha = .22 + hash(i * 29 + j + 3100) * .22;
        stroke(c, palette.stroke[(i + j) % 4], 2, x + Math.sin(j * 2) * 8, y, 4, -10, .2);
      }
    }
    c.globalAlpha = 1;
  }
  function bareTree(c, palette, movement) {
    const sway = Math.sin(movement * .22) * (1 + bass * 2);
    c.strokeStyle = palette.cypress; c.lineCap = 'round';
    c.lineWidth = 20; c.beginPath(); c.moveTo(83, 510); c.bezierCurveTo(82, 400, 117, 285, 124 + sway, 195); c.stroke();
    for (let i = 0; i < 11; i++) {
      const y = 240 + i * 20, x = 120 - i * 3;
      const direction = i % 2 ? 1 : -1;
      c.lineWidth = 8 - i * .35; c.beginPath(); c.moveTo(x, y);
      c.quadraticCurveTo(x + direction * 38, y - 36, x + direction * (69 + i * 3) + sway, y - 86); c.stroke();
      c.lineWidth = 2; c.beginPath(); c.moveTo(x + direction * 42, y - 41);
      c.lineTo(x + direction * 55, y - 79); c.stroke();
    }
  }
  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const easing = 1 - Math.exp(-dt * 4);
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * easing;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * easing;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * easing;
    const speed = clamp(Number(opts.speed) || 1, .2, 3);
    time += dt * speed;
    phase += dt * speed * (1.15 + mid * 1.2);
    const form = palettes[opts.form] ? opts.form : 'cobalt';
    const palette = palettes[form];
    const movement = phase * (form === 'silver' ? 1.25 : 1);
    c.save(); c.scale(w / 900, h / 500);
    sky(c, palette); flowingSky(c, palette, movement, form === 'silver' ? 1 : 0);
    lights(c, palette, movement); alchemySky(c, form, palette, movement); hills(c, palette, movement, form);
    village(c, palette, form);
    if (form === 'amber') poplars(c, palette, movement);
    else if (form === 'silver') bareTree(c, palette, movement);
    else cypress(c, palette, movement);
    c.restore();
    return { time, form, bass, mid, treble };
  }
  return { recipes, draw, reset };
})();
