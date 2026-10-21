/* Autumn 10: an animated lily pond inspired by Monet's garden paintings. */
window.WaterLilies = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const hash = n => { const v = Math.sin(n * 127.1 + 78.233) * 43758.5453; return v - Math.floor(v); };
  const recipes = [
    { name: 'The Lily Pond', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Negative Garden', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Orange Reflection', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'The Pond Is Awake', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    pond: { water: ['#203c51', '#4a7f88', '#8ab4a7'], reflection: ['#b5b99b', '#6f9a95', '#d2c0a4'],
      bank: '#2b4c43', willow: '#6d8762', pad: ['#56895d', '#8ba66c', '#335f52'], rim: '#d0d2a3',
      flower: ['#fbebe3', '#f0b6bc', '#fff6da'], heart: '#f5ce71', ripple: '#d6d6bf' },
    negative: { water: ['#e7c6b2', '#efd7bb', '#b48eb4'], reflection: ['#493e71', '#697599', '#725c92'],
      bank: '#b38daa', willow: '#784d96', pad: ['#b95f99', '#744b9c', '#d181a5'], rim: '#492c70',
      flower: ['#182f5c', '#24526b', '#39366d'], heart: '#77d3db', ripple: '#413c78' },
    orange: { water: ['#3a334a', '#a75b53', '#e5a56c'], reflection: ['#e6b373', '#f3d59d', '#b95965'],
      bank: '#574351', willow: '#a7624e', pad: ['#5e6964', '#8c6858', '#414e67'], rim: '#eec18a',
      flower: ['#ffe0a4', '#ffb682', '#fff0ce'], heart: '#f5f0b1', ripple: '#fbd4a1' },
    awake: { water: ['#15293f', '#225463', '#286b75'], reflection: ['#8cebc9', '#ab7cdb', '#e3bfea'],
      bank: '#213d4e', willow: '#619caa', pad: ['#43aa97', '#727ec3', '#367989'], rim: '#c4f4d5',
      flower: ['#fa9fd7', '#e8d2ff', '#ffdaad'], heart: '#fded9b', ripple: '#b3f4dd' },
  };
  let time = 0, last = null, bass = 0, mid = 0, treble = 0;
  function reset() { time = 0; last = null; bass = mid = treble = 0; }
  function ellipse(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); }
  function current(x, y, seed, form) {
    const force = form === 'awake' ? 1.45 : 1;
    const energy = clamp(bass * 1.8 + mid * .9, 0, 1);
    let dx = Math.sin(time * .9 + seed * 1.8) * (3 + energy * 9);
    let dy = Math.cos(time * .78 + seed * 1.3) * (1.5 + energy * 4);
    for (const [cx, cy, direction] of [[290, 270, 1], [680, 320, -1]]) {
      const px = (x - cx) / 225, py = (y - cy) / 145;
      const pull = Math.exp(-(px * px + py * py) * .8);
      const turn = Math.sin(time * .8 + Math.hypot(px, py) * 2 + seed * .25);
      dx -= py * pull * turn * (13 + energy * 15) * direction;
      dy += px * pull * turn * (6 + energy * 9) * direction;
    }
    return [dx * force, dy * force];
  }

  function water(c, p, form) {
    const gradient = c.createLinearGradient(0, 0, 0, 500);
    p.water.forEach((colour, i) => gradient.addColorStop(i / 2, colour));
    c.fillStyle = gradient; c.fillRect(0, 0, 900, 500);
    // Broad reflected tree masses and broken, horizontal paint marks.
    for (let i = 0; i < 10; i++) {
      const x = i * 105 - 55 + hash(i + 2) * 30;
      const sway = Math.sin(time * .75 + i * 1.4) * (13 + bass * 22);
      const reflected = c.createLinearGradient(x - 28, 0, x + 116, 0);
      reflected.addColorStop(0, p.reflection[i % 3] + '00');
      reflected.addColorStop(.48, p.reflection[i % 3] + '77');
      reflected.addColorStop(1, p.reflection[i % 3] + '00');
      c.fillStyle = reflected;
      c.beginPath(); c.moveTo(x, -10); c.bezierCurveTo(x - 35 + sway, 120, x + 90 - sway, 270, x + 25, 500);
      c.lineTo(x + 90, 500); c.bezierCurveTo(x + 135, 290, x + 24 + sway, 125, x + 75, -10); c.fill();
    }
    for (let i = 0; i < 275; i++) {
      const x = hash(i + 31) * 930 - 15, y = hash(i + 1021) * 510;
      const [dx, dy] = current(x, y, i, form);
      c.globalAlpha = .12 + hash(i + 81) * .21 + treble * .13;
      c.strokeStyle = p.reflection[i % 3]; c.lineWidth = 1 + hash(i + 92) * 4;
      c.beginPath(); c.moveTo(x + dx, y + dy);
      c.quadraticCurveTo(x + dx + 12, y + dy - Math.sin(time + i) * (2 + mid * 4),
        x + dx + 8 + hash(i + 173) * 42, y + dy); c.stroke();
    }
    c.globalAlpha = 1;
    for (let i = 0; i < 145; i++) {
      const x = hash(i + 2010) * 950 - 25, y = hash(i + 2110) * 520;
      const [dx, dy] = current(x, y, i + 700, form);
      c.globalAlpha = .09 + hash(i + 2210) * .18;
      c.strokeStyle = p.reflection[i % 3]; c.lineWidth = 2 + hash(i + 2310) * 5;
      c.beginPath(); c.moveTo(x + dx, y + dy);
      c.quadraticCurveTo(x + dx + 12, y + dy + Math.sin(time * .9 + i) * (3 + bass * 5),
        x + dx + 14 + hash(i + 2410) * 30, y + dy); c.stroke();
    }
    c.globalAlpha = 1;
    if (form === 'awake') {
      const glow = c.createRadialGradient(455, 230, 15, 455, 230, 390 + bass * 75);
      glow.addColorStop(0, '#d5a9eb33'); glow.addColorStop(1, '#d5a9eb00');
      c.fillStyle = glow; c.fillRect(0, 0, 900, 500);
    }
  }

  function swirlingWater(c, p, form) {
    const energy = clamp(bass * 1.8 + mid * .9, 0, 1);
    for (const [vortex, [cx, cy, direction]] of [[290, 270, 1], [680, 320, -1]].entries()) {
      for (let ring = 0; ring < 5; ring++) {
        const rx = 44 + ring * 35 + bass * 24, ry = (22 + ring * 17 + bass * 12) * (form === 'awake' ? 1.25 : 1);
        for (let mark = 0; mark < 24; mark++) {
          const angle = mark * TAU / 24 + time * (.45 + mid * .5) * direction + ring * .6;
          const shimmer = Math.sin(time * 2.2 + mark * 1.4 + ring + vortex) ** 2;
          c.globalAlpha = (.13 + shimmer * .14 + energy * .16) * (form === 'awake' ? 1.45 : 1);
          c.strokeStyle = mark % 4 ? p.reflection[(ring + mark) % 3] : p.ripple;
          c.lineWidth = 1.3 + ring * .32 + bass * 2.5;
          const x = cx + Math.cos(angle) * rx, y = cy + Math.sin(angle) * ry;
          c.beginPath(); c.moveTo(x, y);
          c.quadraticCurveTo(x - Math.sin(angle) * 10, y + Math.cos(angle) * 5,
            x - Math.sin(angle) * (15 + energy * 7), y + Math.cos(angle) * (7 + energy * 3)); c.stroke();
        }
      }
    }
    c.globalAlpha = 1;
  }

  function distantGarden(c, p) {
    c.fillStyle = p.bank;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(900, 0); c.lineTo(900, 41);
    for (let x = 900; x >= 0; x -= 12) c.lineTo(x, 43 + Math.sin(x * .013) * 8 + hash(x + 9) * 7);
    c.closePath(); c.fill();
    for (let i = 0; i < 120; i++) {
      const x = hash(i + 400) * 960 - 20, y = hash(i + 700) * 63 - 12;
      const length = 11 + hash(i + 800) * 34;
      c.globalAlpha = .16 + hash(i + 900) * .33;
      c.strokeStyle = p.willow; c.lineWidth = 1 + hash(i + 1000) * 2;
      c.beginPath(); c.moveTo(x, y - length); c.quadraticCurveTo(x + Math.sin(time * .3 + i) * 6, y, x + 3, y + length); c.stroke();
    }
    c.globalAlpha = 1;
  }

  function ripple(c, p, x, y, scale, seed, form) {
    const energy = clamp(bass * 1.7 + mid * .7, 0, 1);
    const pulse = Math.sin(time * (1.8 + mid) + seed) * (3 + energy * (form === 'awake' ? 19 : 11));
    for (let ring = 0; ring < 2; ring++) {
      c.globalAlpha = (.17 + (ring ? .08 : .12) + energy * .16 + treble * .1) * (form === 'awake' ? 1.45 : 1);
      c.strokeStyle = p.ripple; c.lineWidth = ring ? 1 : 1.5;
      ellipse(c, x, y + scale * 2, Math.max(2, scale * (1.24 + ring * .24) + pulse),
        Math.max(1, scale * (.36 + ring * .12) + pulse * .21)); c.stroke();
    }
    c.globalAlpha = 1;
  }

  function lily(c, p, x, y, scale, seed, form) {
    const energy = clamp(bass * 1.6 + mid * .9, 0, 1);
    const breathing = 1 + Math.sin(time * (1.35 + mid) + seed * 2) * (.08 + energy * (form === 'awake' ? .21 : .13));
    const open = (.82 + Math.sin(time * .8 + seed * 3) * .09 + mid * .22) * breathing;
    const colours = p.flower;
    c.save(); c.translate(x, y + Math.sin(time * 1.15 + seed) * (1.5 + energy * 4));
    c.rotate(Math.sin(time * .9 + seed) * (.05 + energy * .1));
    c.globalAlpha = .22; c.fillStyle = '#0a1a26'; ellipse(c, 3, scale * .21, scale * .73, scale * .3); c.fill();
    c.globalAlpha = 1;
    for (let layer = 0; layer < 2; layer++) for (let petal = 0; petal < 7; petal++) {
      const angle = petal * TAU / 7 + layer * .41 + Math.sin(time * .28 + seed) * .035;
      const reach = scale * (layer ? .49 : .68) * open;
      const px = Math.cos(angle) * reach * .56, py = Math.sin(angle) * reach * .28;
      c.save(); c.translate(px, py); c.rotate(angle);
      c.fillStyle = colours[(petal + layer + Math.floor(seed * 3)) % 3];
      c.beginPath(); c.moveTo(-scale * .1, 0);
      c.quadraticCurveTo(scale * .1, -scale * (layer ? .25 : .32), reach, 0);
      c.quadraticCurveTo(scale * .1, scale * (layer ? .25 : .32), -scale * .1, 0); c.fill();
      c.restore();
    }
    c.fillStyle = p.heart; ellipse(c, 0, 0, scale * .17, scale * .1); c.fill();
    if (form === 'awake') {
      c.globalAlpha = .45 + .3 * Math.sin(time * 2 + seed) ** 2;
      c.strokeStyle = p.heart; c.lineWidth = 1.2;
      ellipse(c, 0, 0, scale * (.83 + bass * .25), scale * (.37 + bass * .12)); c.stroke();
    }
    c.restore();
  }

  function pad(c, p, x, y, scale, seed, form) {
    const [dx, dy] = current(x, y, seed, form);
    x += dx; y += dy;
    ripple(c, p, x, y, scale, seed, form);
    c.save(); c.translate(x, y); c.rotate(Math.sin(time * .65 + seed) * (.05 + mid * .13));
    c.fillStyle = p.pad[Math.floor(seed * 11) % 3];
    c.beginPath(); c.moveTo(0, 0);
    for (let edge = 0; edge <= 24; edge++) {
      const a = -.34 + edge * (TAU - .22) / 24;
      const radius = scale * (.92 + .055 * Math.sin(edge * 2.9 + seed * 8));
      c.lineTo(Math.cos(a) * radius, Math.sin(a) * radius * .89);
    }
    c.closePath(); c.fill();
    c.globalAlpha = .27; c.strokeStyle = p.rim; c.lineWidth = 1.1;
    c.beginPath(); c.ellipse(0, 0, scale * .89, scale * .8, 0, .2, TAU - .5); c.stroke();
    c.globalAlpha = .19;
    for (let vein = 0; vein < 4; vein++) {
      const a = .4 + vein * 1.43;
      c.beginPath(); c.moveTo(0, 0);
      c.lineTo(Math.cos(a) * scale * .72, Math.sin(a) * scale * .65); c.stroke();
    }
    for (let mark = 0; mark < 7; mark++) {
      const a = hash(seed * 23 + mark) * TAU;
      const radius = hash(seed * 43 + mark) * scale * .75;
      c.globalAlpha = .13 + hash(seed * 13 + mark) * .13;
      c.strokeStyle = mark % 2 ? p.rim : p.reflection[mark % 3];
      c.lineWidth = 1.8; c.beginPath(); c.moveTo(Math.cos(a) * radius, Math.sin(a) * radius * .75);
      c.lineTo(Math.cos(a) * radius + scale * .15, Math.sin(a) * radius * .75); c.stroke();
    }
    c.restore(); c.globalAlpha = 1;
    if (seed % 4 < 1.5) lily(c, p, x + scale * .2, y - scale * .13, scale * .9, seed, form);
  }

  function surface(c, p, form) {
    const pads = [];
    for (let i = 0; i < 44; i++) {
      const y = 93 + hash(i + 197) * 435;
      const depth = (y - 70) / 450;
      pads.push({ x: hash(i + 272) * 970 - 35, y, scale: 7 + depth * (16 + hash(i + 369) * 16), seed: i + .18 });
    }
    pads.sort((a, b) => a.y - b.y);
    for (const item of pads) pad(c, p, item.x, item.y, item.scale, item.seed, form);
    for (let i = 0; i < 85; i++) {
      const x = hash(i + 1480) * 940 - 20, y = 62 + hash(i + 1580) * 445;
      const shimmer = Math.sin(time * 2.1 + i * 4.1);
      c.globalAlpha = (.08 + treble * .12) * (shimmer + 1);
      c.strokeStyle = p.ripple; c.lineWidth = .7 + hash(i + 1680);
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + 3 + hash(i + 1780) * 11, y); c.stroke();
    }
    c.globalAlpha = 1;
  }

  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const easing = 1 - Math.exp(-dt * 4);
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * easing;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * easing;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * easing;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const form = palettes[opts.form] ? opts.form : 'pond', p = palettes[form];
    c.save(); c.scale(w / 900, h / 500);
    water(c, p, form); swirlingWater(c, p, form); distantGarden(c, p); surface(c, p, form);
    c.restore();
    return { time, form, bass, mid, treble };
  }
  return { recipes, draw, reset };
})();
