/* A fictional cross-section expedition; telemetry is illustrative, not measured data. */
window.KolaSuperdeep = (() => {
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const forms = ['survey', 'abyss', 'archive', 'thermal'];
  const recipes = forms.map((form, i) => ({ name: ['Survey Amber', 'Abyssal Life', 'The Lost Archive', 'Thermal Inversion'][i], form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 }));
  const palettes = {
    survey: { sky: '#080c10', rock: '#302c28', layer: '#695143', line: '#b38657', glow: '#ffc66b', life: '#d7edaf', text: '#e8d8b9' },
    abyss: { sky: '#030e17', rock: '#09282c', layer: '#164957', line: '#347489', glow: '#60efff', life: '#df85ff', text: '#c7e9ed' },
    archive: { sky: '#160c19', rock: '#332035', layer: '#643957', line: '#a9746e', glow: '#ffd98a', life: '#ff888c', text: '#f2dcc5' },
    thermal: { sky: '#dddeda', rock: '#afbdc2', layer: '#7389a6', line: '#435b85', glow: '#b92e54', life: '#47246d', text: '#24374f' },
  };
  let time = 0, last = null, depth = 0, drive = 0, accent = 0, previousBass = 0;
  const noise = n => { const a = Math.sin(n * 127.13 + 48.7) * 43758.5453; return a - Math.floor(a); };
  function reset() { time = depth = drive = accent = previousBass = 0; last = null; }
  function line(c, points, colour, width = 2) {
    c.beginPath(); c.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) c.lineTo(...points[i]);
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
  }
  function ellipse(c, x, y, rx, ry, colour) {
    c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, TAU); c.fillStyle = colour; c.fill();
  }
  function text(c, value, x, y, size, colour, align = 'left') {
    c.font = `600 ${size}px monospace`; c.fillStyle = colour; c.textAlign = align; c.fillText(value, x, y);
  }
  function glow(c, x, y, r, colour, alpha = .5) {
    const gradient = c.createRadialGradient(x, y, 1, x, y, r);
    gradient.addColorStop(0, `${colour}a0`); gradient.addColorStop(1, `${colour}00`);
    c.save(); c.globalAlpha = alpha; c.fillStyle = gradient; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
  }
  function wallX(side, worldY) {
    return 500 + side * (111 + Math.sin(worldY * .006) * 18 + Math.sin(worldY * .019) * 9);
  }
  function rock(c, p, scroll, form) {
    c.fillStyle = p.sky; c.fillRect(0, 0, 1000, 600);
    for (const side of [-1, 1]) {
      c.beginPath(); c.moveTo(side < 0 ? 0 : 1000, -40);
      for (let y = -40; y <= 640; y += 10) c.lineTo(wallX(side, y + scroll), y);
      c.lineTo(side < 0 ? 0 : 1000, 640); c.closePath(); c.fillStyle = p.rock; c.fill();
      const first = Math.floor(scroll / 42) - 2;
      for (let layer = first; layer < first + 20; layer++) {
        const y = layer * 42 - scroll;
        const start = side < 0 ? 0 : 1000;
        const edge = wallX(side, layer * 42);
        const points = [];
        for (let step = 0; step <= 18; step++) {
          const x = start + (edge - start) * step / 18;
          points.push([x, y + Math.sin(x * .015 + layer) * (8 + Math.min(depth / 4000, 13))]);
        }
        line(c, points, layer % 4 === 0 ? p.line : p.layer, layer % 5 === 0 ? 9 : 3);
        for (let flake = 0; flake < 5; flake++) {
          const x = start + (edge - start) * noise(layer * 31 + flake);
          line(c, [[x, y + 10], [x + side * 10, y + 16], [x + side * 16, y + 13]], `${p.line}60`, 1);
        }
      }
      const rim = [];
      for (let y = -20; y <= 620; y += 10) rim.push([wallX(side, y + scroll), y]);
      line(c, rim, `${p.glow}70`, 2);
    }
    const motes = form === 'abyss' ? 45 : 22;
    for (let i = 0; i < motes; i++) {
      const y = ((noise(i + 30) * 1100 - scroll * (.2 + noise(i) * .3)) % 640 + 640) % 640;
      const x = 415 + noise(i + 10) * 170 + Math.sin(time + i) * 8;
      ellipse(c, x, y, 1 + drive * 2, 2 + drive * 4, `${p.glow}80`);
    }
  }
  function axe(c, p, x, y) {
    line(c, [[x - 17, y + 22], [x + 12, y - 20]], '#ad8461', 7);
    c.beginPath(); c.moveTo(x - 5, y - 18); c.lineTo(x + 8, y - 34); c.lineTo(x + 37, y - 25); c.lineTo(x + 28, y - 7); c.closePath(); c.fillStyle = p.text; c.fill();
    line(c, [[x + 3, y - 15], [x + 15, y - 20]], p.line, 3);
  }
  function saucer(c, p, x, y, size) {
    glow(c, x, y + 9, size * 1.5, p.glow, .2 + drive * .3);
    ellipse(c, x, y - size * .12, size * .39, size * .3, p.line);
    ellipse(c, x, y, size, size * .21, p.text);
    ellipse(c, x, y + 4, size * .78, size * .12, p.layer);
    for (let i = 0; i < 6; i++) ellipse(c, x - size * .65 + i * size * .26, y + 3, 2.8 + accent * 2, 2, p.glow);
  }
  function creature(c, p, x, y, seed, form) {
    const big = form === 'abyss' ? 1.35 : .85;
    c.save(); c.translate(x, y); c.scale(big, big);
    glow(c, 0, 0, 62, p.life, .22 + accent * .35);
    const reach = 33 + drive * 12;
    for (let limb = 0; limb < 7; limb++) {
      const angle = limb * TAU / 7 + Math.sin(time * .4 + seed) * .2;
      const bend = Math.sin(time * (1 + limb * .1) + limb + seed) * 16;
      line(c, [[Math.cos(angle) * 12, Math.sin(angle) * 12], [Math.cos(angle) * reach, Math.sin(angle) * reach + bend], [Math.cos(angle + .25) * (reach + 20), Math.sin(angle + .25) * (reach + 20) + bend]], p.life, 3);
    }
    ellipse(c, 0, 0, 19 + drive * 3, 27, p.layer);
    const blink = Math.sin(time * .7 + seed) > .992 ? .3 : 4;
    ellipse(c, -7, -5, 4, blink, p.glow); ellipse(c, 7, -5, 4, blink, p.glow);
    c.restore();
  }
  function city(c, p, x, y, seed, form) {
    const count = form === 'archive' ? 8 : 5;
    for (let i = 0; i < count; i++) {
      const px = x - 80 + i * 23, h = 24 + noise(seed + i) * 74;
      c.fillStyle = p.layer; c.fillRect(px, y - h, 17, h);
      c.fillStyle = p.line; c.fillRect(px - 2, y - h - 5, 21, 6);
      for (let row = 0; row < 4; row++) {
        if (row * 16 < h - 10) { c.fillStyle = `${p.glow}${Math.sin(time * .6 + seed + row + i) > 0 ? 'b0' : '30'}`; c.fillRect(px + 5, y - h + 8 + row * 16, 5, 7); }
      }
    }
    line(c, [[x - 88, y + 4], [x + 108, y + 4]], p.glow, 3);
  }
  function chamber(c, p, index, y, form) {
    const side = index % 2 ? 1 : -1;
    const x = side < 0 ? 207 : 793;
    const type = ((index % 5) + 5) % 5;
    ellipse(c, x, y, 157, 83, p.sky);
    glow(c, x, y, 150, p.glow, .14);
    line(c, [[x - side * 145, y + 27], [500 + side * 105, y + 27]], p.layer, 5);
    if (type === 0) {
      saucer(c, p, x - 30, y, 58); axe(c, p, x + 76, y + 7);
    } else if (type === 1) {
      creature(c, p, x, y, index, form);
      if (form === 'abyss') { creature(c, p, x - 95, y + 20, index + 2, 'survey'); }
    } else if (type === 2) city(c, p, x, y + 48, index * 3, form);
    else if (type === 3) {
      for (let i = 0; i < 8; i++) {
        const h = 20 + noise(index + i) * 65 + drive * 8;
        c.beginPath(); c.moveTo(x - 100 + i * 27, y + 45); c.lineTo(x - 88 + i * 27, y + 45 - h); c.lineTo(x - 78 + i * 27, y + 45); c.closePath(); c.fillStyle = i % 2 ? p.life : p.glow; c.fill();
      }
      if (form === 'archive') saucer(c, p, x, y - 22, 35);
    } else {
      // A ribbed fossil encircles a much newer, still-running mechanism.
      for (let i = 0; i < 10; i++) {
        const px = x - 95 + i * 20;
        line(c, [[px - 8, y - 17], [px, y - 30 + Math.sin(i) * 7], [px + 9, y - 4], [px, y + 18]], p.text, 3);
      }
      line(c, [[x - 110, y], [x + 105, y]], p.line, 4);
      ellipse(c, x + 24, y + 23, 22, 22, p.layer);
      line(c, [[x + 24, y + 23], [x + 24 + Math.cos(time) * 16, y + 23 + Math.sin(time) * 16]], p.glow, 2);
    }
    if (form === 'abyss' && type !== 1) {
      for (let i = 0; i < 5; i++) ellipse(c, x - 90 + i * 44, y - 45, 3, 2 + drive * 3, p.life);
    }
  }
  function dial(c, p, x, y, value, fraction, title, unit) {
    ellipse(c, x, y, 34, 34, p.sky);
    for (let i = 0; i < 11; i++) {
      const a = Math.PI * .8 + i * Math.PI * 1.4 / 10;
      line(c, [[x + Math.cos(a) * 26, y + Math.sin(a) * 26], [x + Math.cos(a) * 30, y + Math.sin(a) * 30]], p.line, 2);
    }
    const angle = Math.PI * .8 + clamp(fraction, 0, 1) * Math.PI * 1.4;
    line(c, [[x, y], [x + Math.cos(angle) * 24, y + Math.sin(angle) * 24]], p.glow, 3);
    ellipse(c, x, y, 3, 3, p.text);
    text(c, title, x + 47, y - 12, 12, p.line);
    text(c, `${value} ${unit}`, x + 47, y + 12, 19, p.text);
  }
  function draw(c, width, height, now, options = {}) {
    const animate = options.animate !== false;
    const dt = animate && last !== null ? clamp((now - last) / 1000, 0, .08) : 0;
    last = animate ? now : null;
    const bass = clamp(Number(options.bass) || 0, 0, 1);
    const mid = clamp(Number(options.mid) || 0, 0, 1);
    const treble = clamp(Number(options.treble) || 0, 0, 1);
    const speed = clamp(Number(options.speed) || 1, .2, 3);
    if (animate) {
      time += dt * speed;
      drive += (bass * .7 + mid * .3 - drive) * (1 - Math.exp(-dt * 5));
      accent = Math.max(accent * Math.exp(-dt * 4), Math.max(0, bass - previousBass) * 1.8);
      previousBass = bass;
      depth += dt * speed * (155 + drive * 38);
    }
    const form = palettes[options.form] ? options.form : 'survey';
    const p = palettes[form], scroll = depth * .31;
    const temperature = -2 + depth * .0172;
    const pressure = depth * .0265;
    const physics = depth < 2500 ? 'BRITTLE / FRACTURED' : depth < 6800 ? 'FLUIDS / MINERAL VEINS' : depth < 12262 ? 'HOT CRYSTALLINE CRUST' : depth < 30000 ? 'UNSURVEYED / DEFORMING' : 'DREAM OF THE LOWER CRUST';
    c.save(); c.scale(width / 1000, height / 600);
    rock(c, p, scroll, form);
    const first = Math.floor((scroll - 650) / 255);
    const visible = [];
    for (let i = first; i <= first + 5; i++) {
      const y = i * 255 + 340 - scroll;
      if (i < 0 || y < -100 || y > 700) continue;
      chamber(c, p, i, y, form); visible.push(i % 5);
    }
    // The depth ruler and embedded discoveries share world coordinates.
    const firstMark = Math.floor((depth - 1100) / 500);
    for (let mark = firstMark; mark < firstMark + 7; mark++) {
      if (mark < 0) continue;
      const y = 300 + (mark * 500 - depth) * .31;
      line(c, [[375, y], [396, y]], p.glow, 2);
      text(c, `${(mark * .5).toFixed(1)} km`, 370, y + 4, 12, p.text, 'right');
    }
    const limitY = 300 + (12262 - depth) * .31;
    if (limitY > -20 && limitY < 620) {
      c.setLineDash([8, 8]); line(c, [[8, limitY], [992, limitY]], p.glow, 2); c.setLineDash([]);
      text(c, 'SG-3 LIMIT 12,262 m / IMAGINATION CONTINUES', 500, limitY - 12, 14, p.text, 'center');
    }
    // Cable, sonde, downlights and rotating sensor cage stay with the viewer.
    line(c, [[500, 0], [500, 245]], p.line, 3);
    glow(c, 500, 342, 125 + drive * 35, p.glow, .35);
    c.beginPath(); c.moveTo(477, 332); c.lineTo(425 - accent * 20, 490); c.lineTo(575 + accent * 20, 490); c.lineTo(523, 332); c.closePath(); c.fillStyle = `${p.glow}12`; c.fill();
    ellipse(c, 500, 258, 24, 9, p.line);
    c.fillStyle = p.layer; c.fillRect(479, 258, 42, 72);
    ellipse(c, 500, 329, 21, 9, p.text);
    for (let i = 0; i < 5; i++) {
      const x = 500 + Math.cos(time * 2 + i * TAU / 5) * 19;
      line(c, [[x, 269], [x, 317]], p.glow, 2);
    }
    ellipse(c, 500, 338, 13, 5 + accent * 4, p.glow);
    for (let i = 0; i < 24; i++) {
      const y = 80 + i * 16;
      const x = 553 + Math.sin(time * 3 - i * .7) * (4 + mid * 18 + treble * 8);
      line(c, [[553, y], [x, y + 2]], `${p.life}80`, 1);
    }
    c.fillStyle = `${p.sky}ed`; c.fillRect(0, 0, 1000, 70); c.fillRect(0, 489, 1000, 111);
    text(c, 'KOLA SUPERDEEP BOREHOLE', 22, 32, 24, p.text);
    text(c, recipes[forms.indexOf(form)].name.toUpperCase(), 22, 56, 12, p.glow);
    text(c, 'DESCENT / NO RETURN SIGNAL REQUIRED', 978, 36, 11, p.line, 'right');
    dial(c, p, 56, 536, (depth / 1000).toFixed(2), (depth % 15000) / 15000, 'DEPTH', 'km');
    dial(c, p, 300, 536, Math.round(temperature), Math.min(1, temperature / 600), 'TEMPERATURE', 'C');
    dial(c, p, 540, 536, Math.round(pressure), Math.min(1, pressure / 1000), 'LITHOSTATIC EST.', 'MPa');
    text(c, physics, 978, 523, 11, p.glow, 'right');
    text(c, depth > 12262 ? 'SPECULATIVE EXTENSION' : 'FICTIONAL CROSS-SECTION', 978, 547, 11, p.text, 'right');
    text(c, 'Illustrative telemetry / impossible archaeology', 22, 587, 11, p.line);
    text(c, `SEISMIC ${Math.round((drive + accent) * 100)} / SIGNAL ${Math.round(97 - Math.min(40, depth / 1500) + treble * 2)}%`, 978, 583, 11, p.line, 'right');
    c.restore();
    return { form, time, depth, scroll, temperature, pressure, physics, visible, speculative: depth > 12262, drive, accent };
  }
  return { draw, reset, recipes };
})();
