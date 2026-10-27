/* Autumn 32: an industrial procession driven by the music. */
window.PlentyOfPuff = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const chapters = [
    ['THE ENGINE HOUSE', 'Steam rises. The great beam begins to breathe.'],
    ['THE MILL', 'One engine drives a forest of belts and busy looms.'],
    ['THE CHIMNEY', 'A flat cap and a very long way up.'],
    ['THE FORGE', 'Iron, fire, and the rhythm of the hammer.'],
  ];
  const recipes = [
    { name: 'Brass & Soot', form: 'brass', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Furnace Glow', form: 'furnace', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Engineer\'s Blueprint', form: 'blueprint', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Night Shift', form: 'night', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    brass: { sky: '#5d655f', floor: '#302a27', wall: '#746b58', metal: '#b6a682', shadow: '#241f1e', line: '#ead5a6', hot: '#f5a840', smoke: '#d8d0b9', window: '#c8c3a0' },
    furnace: { sky: '#603b32', floor: '#291b20', wall: '#744433', metal: '#c69263', shadow: '#1c1720', line: '#ffe0a5', hot: '#ff7345', smoke: '#f4b382', window: '#f0b86f' },
    blueprint: { sky: '#0a3151', floor: '#092440', wall: '#174566', metal: '#5799ae', shadow: '#082136', line: '#d0f7ff', hot: '#ffe19b', smoke: '#9ed8e3', window: '#3588a4' },
    night: { sky: '#161d31', floor: '#111625', wall: '#26324a', metal: '#72849a', shadow: '#0c1120', line: '#d5deed', hot: '#f8b568', smoke: '#8a94af', window: '#d8a85b' },
  };
  let time = 0;
  let last = null;
  function reset() { time = 0; last = null; }
  function rect(c, x, y, w, h, colour) { c.fillStyle = colour; c.fillRect(x, y, w, h); }
  function line(c, x1, y1, x2, y2, colour, width = 2) {
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2);
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.stroke();
  }
  function disc(c, x, y, r, colour, stroke = false, width = 2) {
    c.beginPath(); c.arc(x, y, r, 0, TAU);
    if (stroke) { c.strokeStyle = colour; c.lineWidth = width; c.stroke(); }
    else { c.fillStyle = colour; c.fill(); }
  }
  function polygon(c, points, colour) {
    c.beginPath(); c.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
    c.closePath(); c.fillStyle = colour; c.fill();
  }
  function text(c, value, x, y, size, colour, align = 'center') {
    c.font = `bold ${size}px Georgia`; c.textAlign = align; c.fillStyle = colour; c.fillText(value, x, y);
  }
  function backdrop(c, p, form, beat) {
    const gradient = c.createLinearGradient(0, 0, 0, 540);
    gradient.addColorStop(0, p.sky); gradient.addColorStop(1, p.floor);
    c.fillStyle = gradient; c.fillRect(0, 0, 960, 540);
    if (form === 'blueprint') {
      for (let x = 0; x < 960; x += 32) line(c, x, 0, x, 540, '#bde6f01c', 1);
      for (let y = 0; y < 540; y += 32) line(c, 0, y, 960, y, '#bde6f01c', 1);
    } else {
      for (let i = 0; i < 70; i++) {
        const x = (i * 173) % 960, y = (i * 91 + time * (i % 3 + 1) * 7) % 540;
        disc(c, x, y, i % 5 === 0 ? 2 : 1, `${p.smoke}42`);
      }
    }
    rect(c, 0, 450, 960, 90, p.floor);
    line(c, 0, 450, 960, 450, p.metal, 5);
    if (form === 'furnace') rect(c, 0, 435, 960, 15 + beat * 7, `${p.hot}30`);
  }
  function chimney(c, p, x, top, width, height, beat, smokeAmount = 1) {
    polygon(c, [[x, top], [x + width, top], [x + width + 12, top + height], [x - 12, top + height]], p.wall);
    rect(c, x - 9, top - 10, width + 18, 13, p.shadow);
    for (let y = top + 16; y < top + height; y += 21) line(c, x + 4, y, x + width - 4, y, `${p.shadow}77`, 2);
    for (let i = 0; i < 12 * smokeAmount; i++) {
      const age = (time * (33 + beat * 35) + i * 21) % 255;
      const drift = Math.sin(i * 2.1 + time * .65) * (12 + age * .18);
      disc(c, x + width * .5 + drift, top - age, 8 + age * .14,
        `${p.smoke}${Math.round((1 - age / 255) * 75).toString(16).padStart(2, '0')}`);
    }
  }
  function wheel(c, p, x, y, r, angle, beat) {
    disc(c, x, y, r, p.shadow);
    disc(c, x, y, r - 5, p.metal, true, 8);
    disc(c, x, y, r * .67, p.line, true, 3);
    for (let i = 0; i < 8; i++) {
      const a = angle + i * TAU / 8;
      line(c, x + Math.cos(a) * 9, y + Math.sin(a) * 9,
        x + Math.cos(a) * (r - 7), y + Math.sin(a) * (r - 7), p.metal, 8);
    }
    disc(c, x, y, 12 + beat * 3, p.hot);
  }
  function engine(c, p, beat, phase) {
    rect(c, 70, 152, 820, 295, p.wall);
    for (let i = 0; i < 5; i++) {
      rect(c, 103 + i * 157, 178, 92, 129, p.shadow);
      rect(c, 110 + i * 157, 185, 78, 115, p.window);
      line(c, 149 + i * 157, 185, 149 + i * 157, 300, p.wall, 8);
    }
    rect(c, 70, 317, 820, 130, p.shadow);
    chimney(c, p, 762, 80, 68, 237, beat);
    rect(c, 306, 335, 283, 113, p.metal);
    rect(c, 320, 347, 254, 85, p.shadow);
    wheel(c, p, 639, 375, 76, phase, beat);
    const crankX = 639 + Math.cos(phase) * 47, crankY = 375 + Math.sin(phase) * 47;
    const pistonX = 461 + Math.cos(phase) * 36;
    line(c, pistonX, 380, crankX, crankY, p.line, 15);
    rect(c, pistonX - 30, 359, 60, 42, p.metal);
    disc(c, crankX, crankY, 10, p.hot);
    line(c, 165, 261, 661, 230 + Math.sin(phase) * 30, p.metal, 21);
    disc(c, 343, 252, 16, p.hot);
    line(c, 661, 230 + Math.sin(phase) * 30, 639, 375, p.line, 10);
    line(c, 173, 260, 205, 418, p.line, 13);
    for (let i = 0; i < 13; i++) {
      const x = (i * 69 + time * 91) % 960;
      disc(c, x, 428 - (i % 3) * 13, 3 + beat * 2, `${p.hot}a0`);
    }
  }
  function mill(c, p, beat, phase) {
    rect(c, 52, 122, 855, 328, p.wall);
    for (let i = 0; i < 5; i++) {
      rect(c, 87 + i * 173, 146, 103, 111, p.shadow);
      rect(c, 93 + i * 173, 152, 91, 99, p.window);
      line(c, 138 + i * 173, 152, 138 + i * 173, 251, p.wall, 8);
    }
    line(c, 75, 119, 888, 119, p.shadow, 24);
    for (let i = 0; i < 5; i++) {
      const x = 138 + i * 170;
      wheel(c, p, x, 125, 29, phase * (i % 2 ? -1 : 1), beat);
      disc(c, x, 327, 22, p.metal, true, 7);
      line(c, x - 20, 125, x - 20, 327, p.shadow, 5);
      line(c, x + 20, 125, x + 20, 327, p.shadow, 5);
      rect(c, x - 51, 351, 102, 91, p.shadow);
      rect(c, x - 42, 361, 84, 60, p.metal);
      for (let j = 0; j < 8; j++) line(c, x - 38 + j * 10, 365, x - 38 + j * 10, 418, p.line, 2);
      const shuttle = Math.sin(phase * 1.4 + i * .3) * 33;
      rect(c, x - 15 + shuttle, 391, 30, 8, p.hot);
    }
    line(c, 45, 277, 915, 277, p.line, 6);
    for (let i = 0; i < 5; i++) {
      const x = 138 + i * 170;
      line(c, x, 277, x, 324 + Math.sin(phase + i) * (9 + beat * 9), p.metal, 8);
    }
  }
  function climber(c, p, x, y, pose) {
    disc(c, x, y - 23, 10, p.shadow);
    polygon(c, [[x - 14, y - 34], [x + 13, y - 34], [x + 5, y - 40], [x - 10, y - 40]], p.shadow);
    line(c, x, y - 12, x, y + 18, p.shadow, 10);
    line(c, x - 2, y, x - 22, y + 8 + pose * 4, p.shadow, 6);
    line(c, x + 2, y, x + 19, y - 8 - pose * 4, p.shadow, 6);
    line(c, x, y + 18, x - 12, y + 35 + pose * 5, p.shadow, 7);
    line(c, x, y + 18, x + 14, y + 37 - pose * 5, p.shadow, 7);
    disc(c, x + 4, y - 26, 2, p.hot);
  }
  function climb(c, p, beat, phase, local) {
    for (let i = 0; i < 13; i++) {
      const x = i * 85 - 10;
      polygon(c, [[x, 451], [x + 9, 372 - (i % 3) * 15], [x + 62, 372 - (i % 3) * 15], [x + 70, 451]], p.shadow);
    }
    chimney(c, p, 445, 65, 85, 385, beat, 2);
    line(c, 429, 94, 429, 449, p.line, 5);
    line(c, 452, 94, 452, 449, p.line, 5);
    for (let y = 102; y < 452; y += 22) line(c, 429, y, 452, y, p.line, 4);
    const climbY = 407 - (local / 14) * 304;
    climber(c, p, 435, climbY, Math.sin(phase * 2));
    line(c, 510, 180, 670, 180, p.metal, 5);
    line(c, 670, 180, 670, 436, p.metal, 4);
    disc(c, 670, 180, 18, p.hot, true, 5);
    wheel(c, p, 742, 400, 41, phase * .4, beat);
    line(c, 742, 359, 670, 180, p.metal, 3);
    text(c, 'FRED DIBNAH', 765, 278, 19, p.line);
  }
  function forge(c, p, beat, phase) {
    rect(c, 48, 128, 864, 323, p.wall);
    for (let i = 0; i < 4; i++) {
      const x = 88 + i * 206;
      rect(c, x, 155, 104, 143, p.shadow);
      rect(c, x + 9, 164, 86, 125, p.window);
      line(c, x + 52, 164, x + 52, 289, p.wall, 8);
    }
    rect(c, 75, 324, 222, 126, p.shadow);
    rect(c, 99, 341, 174, 86, p.hot);
    for (let i = 0; i < 14; i++) {
      const x = 115 + (i * 41 + time * 24) % 143;
      const y = 355 - (i * 37 + time * 66) % 170;
      disc(c, x, y, 2 + beat * 3, p.hot);
    }
    rect(c, 401, 367, 202, 26, p.shadow);
    polygon(c, [[420, 391], [583, 391], [559, 420], [449, 420]], p.metal);
    rect(c, 462, 420, 80, 31, p.shadow);
    const strike = Math.pow((Math.sin(phase * 1.35) + 1) / 2, 4);
    const hammerY = 260 + strike * 99;
    line(c, 508, 145, 508, hammerY, p.metal, 15);
    rect(c, 460, hammerY - 16, 96, 28, p.shadow);
    rect(c, 467, hammerY - 11, 82, 17, p.metal);
    rect(c, 454, 357, 105, 10, p.hot);
    wheel(c, p, 771, 354, 79, phase, beat);
    disc(c, 771, 354, 47, p.shadow);
    for (let i = 0; i < 26; i++) {
      const a = i * 2.4 + time * 3;
      const burst = strike * (20 + beat * 40);
      disc(c, 510 + Math.cos(a) * burst * (i % 4 + 1) * .35,
        360 + Math.sin(a) * burst * (i % 3 + 1) * .35, 2 + beat * 2, p.hot);
    }
    text(c, 'IRON TAKES THE BEAT', 755, 223, 21, p.line);
  }
  const scenes = [engine, mill, climb, forge];
  function draw(c, width, height, now, options = {}) {
    const elapsed = last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = now;
    if (options.animate !== false) time += elapsed * clamp(Number(options.speed) || 1, .2, 3);
    const index = Math.floor(time / 14) % chapters.length;
    const local = time % 14;
    const bass = clamp(options.bass || 0, 0, 1);
    const treble = clamp(options.treble || 0, 0, 1);
    const beat = clamp(bass * .8 + (options.mid || 0) * .35 + treble * .2, 0, 1);
    const form = palettes[options.form] ? options.form : 'brass';
    const p = palettes[form];
    const phase = time * (1.55 + bass * 1.2);
    c.save(); c.scale(width / 960, height / 540);
    backdrop(c, p, form, beat);
    scenes[index](c, p, beat, phase, local);
    rect(c, 0, 0, 960, 67, `${p.shadow}ed`);
    text(c, 'PLENTY OF PUFF', 24, 43, 27, p.hot, 'left');
    text(c, chapters[index][0], 934, 42, 22, p.line, 'right');
    rect(c, 0, 489, 960, 51, `${p.shadow}ee`);
    text(c, chapters[index][1], 24, 521, 18, p.line, 'left');
    for (let i = 0; i < 4; i++) rect(c, 822 + i * 30, 512, 20, 7, i === index ? p.hot : p.metal);
    c.restore();
    return { chapter: chapters[index][0], index, form, beat, time };
  }
  return { chapters, recipes, draw, reset };
})();
