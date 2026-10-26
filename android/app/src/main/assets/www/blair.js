/* Autumn 30: a satirical, music-led passage through the Blair years. */
window.TonyBlair = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const chapters = [
    ['1997', 'THE LANDSLIDE', 'A grin, a podium, a promise of change'],
    ['2004', 'THE GATES', 'The policy gates open; the argument grows'],
    ['2000s', 'THE FISCAL BARGAIN', 'A redistribution without a line in the manifesto'],
    ['2000s', 'THE MACHINE', 'New bodies, longer chains of accountability'],
    ['2002', 'THE DOSSIER', 'Certainty outruns the evidence'],
    ['2003', 'THE WAR', 'A decision that cannot be called back'],
    ['2007', 'THE LEDGER', 'The bill remains after the curtain falls'],
  ];
  const recipes = [
    { name: 'New Labour Red', form: 'red', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Westminster Newsprint', form: 'newsprint', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Dossier Green', form: 'dossier', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Debt Neon', form: 'neon', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    red: { sky: '#681c32', floor: '#241829', paper: '#fff0d8', ink: '#172031', accent: '#f0535a', second: '#64b5d7', gold: '#f2c46e' },
    newsprint: { sky: '#a89d85', floor: '#554e49', paper: '#f7e8c9', ink: '#302d2c', accent: '#a64a42', second: '#6a7f82', gold: '#d1aa68' },
    dossier: { sky: '#203d38', floor: '#0e2529', paper: '#d9edcf', ink: '#0d2024', accent: '#ee7554', second: '#8bd4a5', gold: '#f1d584' },
    neon: { sky: '#242c5b', floor: '#121630', paper: '#f2e9fb', ink: '#11132b', accent: '#fe648a', second: '#6ddff1', gold: '#ffe17e' },
  };
  let time = 0, last = null;
  function reset() { time = 0; last = null; }
  function rect(c, x, y, w, h, colour) { c.fillStyle = colour; c.fillRect(x, y, w, h); }
  function line(c, points, colour, width = 2) {
    c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
  }
  function ellipse(c, x, y, rx, ry, colour) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fillStyle = colour; c.fill();
  }
  function text(c, value, x, y, size, colour, align = 'left') {
    c.fillStyle = colour; c.font = `bold ${size}px Arial`; c.textAlign = align; c.fillText(value, x, y);
  }
  function figure(c, x, y, scale, p, pose = 0) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    ellipse(c, 0, 9, 28, 37, p.paper);
    ellipse(c, 0, -15, 29, 13, p.ink);
    ellipse(c, -9, 5, 2, 2, p.ink); ellipse(c, 10, 5, 2, 2, p.ink);
    c.beginPath(); c.arc(1, 13, 12, .15, Math.PI - .15); c.strokeStyle = p.ink; c.lineWidth = 2; c.stroke();
    rect(c, -32, 46, 64, 85, p.ink);
    line(c, [-5, 48, 0, 71, 6, 48], p.paper, 10);
    line(c, [0, 70, 4, 105], p.accent, 8);
    line(c, [-30, 59, -48, 106 + pose * 10], p.ink, 13);
    line(c, [30, 59, 50, pose ? 15 : 105], p.ink, 13);
    ellipse(c, 50, pose ? 15 : 105, 8, 8, p.paper);
    line(c, [-16, 131, -20, 162], p.ink, 14); line(c, [16, 131, 20, 162], p.ink, 14);
    c.restore();
  }
  function backdrop(c, p, beat) {
    const g = c.createLinearGradient(0, 0, 960, 540);
    g.addColorStop(0, p.sky); g.addColorStop(1, p.floor);
    rect(c, 0, 0, 960, 540, g);
    for (let i = 0; i < 18; i++) {
      const x = (i * 149 + time * (4 + beat * 8)) % 1060 - 50;
      line(c, [x, 68, x - 170, 498], `${p.second}19`, 2);
    }
  }
  function landslide(c, p, local, beat) {
    for (let i = 0; i < 9; i++) {
      const x = 90 + i * 98;
      ellipse(c, x, 405 + Math.sin(local * 3 + i) * 5, 19, 21, i % 2 ? p.second : p.paper);
      line(c, [x, 427, x + Math.sin(local * 2 + i) * 14, 498], p.ink, 20);
      line(c, [x, 449, x + 25, 392 - beat * 15], p.paper, 7);
    }
    for (let i = 0; i < 7; i++) {
      const x = 130 + i * 115;
      rect(c, x, 150 + Math.sin(local * 2 + i) * 10, 64, 38, i % 2 ? p.accent : p.second);
      text(c, '97', x + 32, 177 + Math.sin(local * 2 + i) * 10, 25, p.paper, 'center');
    }
    figure(c, 480, 220, 1.12, p, 1);
    rect(c, 350, 340, 260, 100, p.accent);
    text(c, 'NEW LABOUR', 480, 398, 34, p.paper, 'center');
    for (let i = 0; i < 8; i++) ellipse(c, 70 + i * 127, 110 + Math.sin(local * 3 + i) * 22, 2 + beat * 5, 2 + beat * 5, p.gold);
  }
  function gates(c, p, local, beat) {
    const opening = 42 + 65 * (.5 + .5 * Math.sin(local * .8));
    rect(c, 90, 122, 780, 339, p.ink);
    rect(c, 106, 138, 748, 307, p.second);
    rect(c, 106, 138, 374 - opening, 307, p.paper);
    rect(c, 480 + opening, 138, 374 - opening, 307, p.paper);
    for (let i = 0; i < 8; i++) {
      const x = 135 + i * 105;
      line(c, [x, 138, x, 445], p.ink, 7);
    }
    text(c, 'BORDER POLICY', 480, 119, 32, p.paper, 'center');
    for (let i = 0; i < 13; i++) {
      const x = ((i * 112 + local * (29 + beat * 18)) % 1050) - 50;
      const y = 342 + (i % 3) * 37;
      ellipse(c, x, y, 10, 11, i % 3 ? p.gold : p.paper);
      line(c, [x, y + 12, x, y + 36, x - 9, y + 48], p.ink, 5);
      line(c, [x, y + 24, x + 15, y + 28], p.ink, 4);
      rect(c, x + 14, y + 22, 13, 14, p.accent);
    }
    rect(c, 637, 363, 198, 66, p.ink);
    text(c, 'EU ENLARGEMENT', 736, 388, 14, p.paper, 'center');
    text(c, '2004', 736, 416, 26, p.gold, 'center');
  }
  function fiscalBargain(c, p, local, beat) {
    const pulse = Math.sin(local * 3) * (3 + beat * 6);
    text(c, 'WHO PAYS?', 189, 151, 35, p.paper, 'center');
    text(c, 'WHO GAINS?', 773, 151, 35, p.paper, 'center');
    for (let i = 0; i < 6; i++) {
      const x = 85 + i * 47, y = 269 + (i % 2) * 20;
      ellipse(c, x, y, 13, 14, i % 3 ? '#e8cbaa' : '#f6dfbb');
      line(c, [x, y + 17, x, y + 69, x - 11, y + 87], p.ink, 11);
      line(c, [x, y + 37, x + 16, y + 46], p.paper, 5);
    }
    for (let i = 0; i < 6; i++) {
      const x = 655 + i * 47, y = 269 + (i % 2) * 20;
      const skin = ['#80604e', '#b8795c', '#d4a17a', '#654c41', '#e3b992', '#9a694f'][i];
      ellipse(c, x, y, 13, 14, skin);
      line(c, [x, y + 17, x, y + 69, x - 11, y + 87], p.ink, 11);
      line(c, [x, y + 37, x + 16, y + 46], p.paper, 5);
    }
    rect(c, 402, 196, 156, 218, p.ink);
    rect(c, 416, 210, 128, 190, p.paper);
    text(c, 'HM', 480, 259, 43, p.ink, 'center');
    text(c, 'TREASURY', 480, 297, 21, p.ink, 'center');
    for (let i = 0; i < 5; i++) {
      const x = 281 + ((local * (48 + beat * 38) + i * 36) % 113);
      ellipse(c, x, 375 + Math.sin(local * 4 + i) * 9, 10, 10, p.gold);
      text(c, '£', x, 379 + Math.sin(local * 4 + i) * 9, 12, p.ink, 'center');
      const outX = 570 + ((local * (48 + beat * 38) + i * 36) % 113);
      ellipse(c, outX, 375 + Math.sin(local * 4 + i) * 9, 10, 10, p.gold);
      text(c, '£', outX, 379 + Math.sin(local * 4 + i) * 9, 12, p.ink, 'center');
    }
    line(c, [335, 431 + pulse, 625, 431 + pulse], p.gold, 8 + beat * 5);
    line(c, [625, 431 + pulse, 606, 420 + pulse], p.gold, 8 + beat * 5);
    line(c, [625, 431 + pulse, 606, 442 + pulse], p.gold, 8 + beat * 5);
    line(c, [624, 465, 336, 465], p.second, 3);
    text(c, 'TAXES', 367, 407, 15, p.paper, 'center');
    text(c, 'SERVICES', 596, 407, 15, p.paper, 'center');
  }
  function machine(c, p, local, beat) {
    text(c, 'TREASURY', 160, 165, 30, p.paper, 'center');
    rect(c, 75, 186, 170, 199, p.ink);
    for (let i = 0; i < 7; i++) {
      const x = 98 + (i % 4) * 35, y = 210 + Math.floor(i / 4) * 39;
      rect(c, x, y, 23, 26, p.gold);
    }
    text(c, 'TAX', 160, 367, 27, p.gold, 'center');
    for (let i = 0; i < 5; i++) {
      const x = (local * 60 + i * 39) % 212 - 25;
      ellipse(c, x, 302, 8 + beat * 2, 8 + beat * 2, p.gold);
      text(c, '£', x, 306, 10, p.ink, 'center');
    }
    line(c, [245, 300, 395, 300, 450, 265, 520, 300, 680, 300], p.gold, 16 + beat * 10);
    for (let i = 0; i < 7; i++) {
      const x = 340 + (i % 4) * 115, y = 137 + Math.floor(i / 4) * 194;
      const wiggle = Math.sin(local * 2 + i) * 8;
      rect(c, x, y + wiggle, 99, 78, p.paper);
      rect(c, x + 8, y + 9 + wiggle, 83, 60, i % 2 ? p.second : p.accent);
      text(c, i % 2 ? 'AGENCY' : 'QUANGO', x + 50, y + 47 + wiggle, 13, p.ink, 'center');
      line(c, [x + 50, y + 78 + wiggle, x + 50, 300], p.paper, 2);
    }
    text(c, 'WHO ANSWERS TO WHOM?', 494, 485, 30, p.paper, 'center');
  }
  function dossier(c, p, local, beat) {
    c.save(); c.translate(480, 304); c.rotate(Math.sin(local * .6) * .07);
    rect(c, -246, -194, 492, 383, p.ink);
    rect(c, -230, -177, 460, 350, p.paper);
    rect(c, -230, -177, 460, 62, p.accent);
    text(c, 'IRAQ / INTELLIGENCE', 0, -136, 31, p.ink, 'center');
    text(c, '45 MINUTES', 0, -43, 47, p.ink, 'center');
    for (let i = 0; i < 7; i++) rect(c, -170, -4 + i * 27, 324 - (i % 3) * 49, 8, i < 3 ? p.ink : p.second);
    c.globalAlpha = .15 + beat * .28;
    c.translate(65, 91); c.rotate(-.26);
    text(c, 'CERTAIN', 0, 0, 60, p.accent, 'center');
    c.restore();
    for (let i = 0; i < 12; i++) {
      const x = (i * 97 + local * 28) % 1060 - 60;
      line(c, [x, 435, x + 12, 458], p.paper, 2);
    }
  }
  function war(c, p, local, beat) {
    const horizon = 354;
    for (let i = 0; i < 12; i++) {
      const x = i * 90 + 13;
      rect(c, x, horizon - 26 - (i % 4) * 20, 60, 150, p.ink);
      if (i % 3 === 0) rect(c, x + 18, horizon - 10, 9, 9, p.gold);
    }
    for (let i = 0; i < 6; i++) {
      const x = 120 + i * 150;
      ellipse(c, x + Math.sin(local + i) * 29, 285 - i % 3 * 16, 80 + beat * 20, 24, `${p.paper}35`);
    }
    for (let i = 0; i < 8; i++) {
      const x = (i * 140 + local * 30) % 1120 - 80;
      line(c, [x, 250 + i % 3 * 14, x + 60, 290 + i % 3 * 14], p.accent, 3);
    }
    text(c, '2003', 480, 205, 112, p.paper, 'center');
    text(c, 'NO REWIND', 480, 462, 40, p.gold, 'center');
  }
  function ledger(c, p, local, beat) {
    rect(c, 95, 119, 770, 333, p.paper);
    for (let i = 0; i < 7; i++) line(c, [128, 163 + i * 40, 835, 163 + i * 40], `${p.ink}35`, 2);
    for (let i = 0; i < 11; i++) {
      const x = 165 + i * 60;
      const h = 92 + i * 5 + Math.sin(local * 2 + i) * (2 + beat * 5);
      rect(c, x, 415 - h, 35, h, i < 5 ? p.second : p.accent);
    }
    line(c, [159, 347, 285, 340, 409, 327, 531, 312, 649, 295, 769, 279], p.ink, 7);
    text(c, 'PUBLIC DEBT', 480, 183, 37, p.ink, 'center');
    text(c, '2000-07  /  +7.4% OF GDP', 480, 225, 20, p.ink, 'center');
    text(c, '2000', 163, 442, 17, p.ink, 'center');
    text(c, '2007', 772, 442, 17, p.ink, 'center');
    for (let i = 0; i < 7; i++) ellipse(c, 740 + i * 11, 137 + Math.sin(time * 3 + i) * 7, 5, 5, p.gold);
  }
  const scenes = [landslide, gates, fiscalBargain, machine, dossier, war, ledger];
  function draw(c, width, height, now, options = {}) {
    const dt = last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = now;
    if (options.animate !== false) time += dt * clamp(Number(options.speed) || 1, .2, 3);
    const chapter = Math.floor(time / 10) % chapters.length;
    const local = time % 10;
    const beat = clamp((options.bass || 0) * .85 + (options.mid || 0) * .45 + (options.treble || 0) * .2, 0, 1);
    const form = palettes[options.form] ? options.form : 'red';
    const p = palettes[form];
    c.save(); c.scale(width / 960, height / 540);
    backdrop(c, p, beat);
    scenes[chapter](c, p, local, beat);
    if (form === 'newsprint') {
      for (let i = 0; i < 24; i++) line(c, [0, i * 22 + Math.sin(time + i) * 2, 960, i * 22 + Math.sin(time + i) * 2], `${p.ink}16`, 1);
    } else if (form === 'dossier') {
      for (let i = 0; i < 30; i++) rect(c, (i * 157 + time * 14) % 960, (i * 91) % 540, 2 + beat * 3, 8, `${p.second}55`);
    } else if (form === 'neon') {
      for (let i = 0; i < 6; i++) line(c, [i * 200, 80, i * 200 + Math.sin(time + i) * 60, 455], `${i % 2 ? p.accent : p.second}55`, 5);
    }
    rect(c, 0, 0, 960, 72, '#0a1122d9');
    text(c, chapters[chapter][0], 25, 47, 27, p.gold);
    text(c, chapters[chapter][1], 480, 47, 34, p.paper, 'center');
    rect(c, 0, 495, 960, 45, '#0a1122e6');
    text(c, chapters[chapter][2], 23, 525, 18, p.paper);
    for (let i = 0; i < chapters.length; i++) rect(c, 758 + i * 30, 516, 21, 5, i === chapter ? p.accent : p.gold);
    c.restore();
    return { chapter: chapters[chapter][1], index: chapter, form, beat, time };
  }
  return { recipes, chapters, draw, reset };
})();
