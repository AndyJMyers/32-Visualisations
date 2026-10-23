/* Autumn 17: Rome as pageant, argument, appetite and spectacle. */
window.Romans = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const forms = ['imperial', 'bacchanal', 'mosaic', 'inferno'];
  const recipes = [
    { name: 'Imperial Parade', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Bacchanal After Dark', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Living Mosaic', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Rome in Flames', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    imperial: { sky: '#668fa2', glow: '#ffdda0', stone: '#e9cda1', shade: '#947d75', dark: '#433d50', ground: '#be9064', red: '#ad3945', gold: '#f9c969', cloth: '#f0e4c4', green: '#476f5d' },
    bacchanal: { sky: '#241d4c', glow: '#d9a278', stone: '#857395', shade: '#554968', dark: '#1a193a', ground: '#614367', red: '#dc547b', gold: '#ffd178', cloth: '#d5bbd7', green: '#568c82' },
    mosaic: { sky: '#4a797d', glow: '#eacb8b', stone: '#e2c795', shade: '#9e8065', dark: '#344456', ground: '#ae745a', red: '#b25450', gold: '#f1bd70', cloth: '#e9d9b2', green: '#4f8573' },
    inferno: { sky: '#4a2238', glow: '#ff7e46', stone: '#b77765', shade: '#674459', dark: '#211e32', ground: '#753e49', red: '#ff4f38', gold: '#ffca70', cloth: '#dd9d87', green: '#625b61' },
  };
  const scenes = ['legions', 'forum', 'cleopatra', 'banquet', 'arena', 'bread'];
  const routes = {
    imperial: scenes,
    bacchanal: ['banquet', 'cleopatra', 'bread', 'forum', 'arena', 'legions'],
    mosaic: ['forum', 'bread', 'banquet', 'cleopatra', 'legions', 'arena'],
    inferno: ['arena', 'legions', 'forum', 'bread', 'banquet', 'cleopatra'],
  };
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, lastBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = lastBass = 0; beats = 0; activeForm = null; }
  function poly(c, pts, fill, stroke, width = 1) {
    c.beginPath(); c.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) c.lineTo(...pts[i]); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function line(c, x1, y1, x2, y2, color, width = 2) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function ellipse(c, x, y, rx, ry, fill) { c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill(); }
  function circle(c, x, y, r, fill) { ellipse(c, x, y, r, r, fill); }
  function background(c, p, local, horizon = 330) {
    const g = c.createLinearGradient(0, 0, 0, 500);
    g.addColorStop(0, p.sky); g.addColorStop(.67, p.glow); g.addColorStop(1, p.ground);
    c.fillStyle = g; c.fillRect(0, 0, 900, 500);
    const sunX = 715 + Math.sin(time * .13) * 45;
    circle(c, sunX, 91, 45 + accent * 9, p.gold);
    poly(c, [[0, horizon], [160, horizon - 38], [330, horizon + 4], [610, horizon - 47], [900, horizon - 13], [900, 500], [0, 500]], p.shade);
    c.fillStyle = p.ground; c.fillRect(0, horizon + 58, 900, 500 - horizon);
    for (let i = 0; i < 23; i++) {
      const x = (i * 103 - local * (18 + bass * 22)) % 1020;
      line(c, x, horizon + 84 + i % 5 * 26, x + 40, horizon + 79 + i % 5 * 26, p.stone, 1);
    }
  }
  function column(c, x, y, h, p) {
    c.fillStyle = p.stone; c.fillRect(x + 9, y, 29, h);
    c.fillStyle = p.shade; c.fillRect(x + 31, y, 7, h);
    c.fillStyle = p.dark; c.fillRect(x - 1, y - 11, 49, 12); c.fillRect(x - 5, y + h - 4, 57, 11);
    for (let k = 0; k < 3; k++) line(c, x + 14 + k * 6, y + 6, x + 14 + k * 6, y + h - 6, p.glow, 1);
  }
  function figure(c, x, y, s, p, opts = {}) {
    const stride = Math.sin(time * (2.8 + bass * 4) + x * .03) * (opts.walk ? 12 : 2);
    c.save(); c.translate(x, y); c.scale(s, s);
    const skin = opts.skin || '#ba8069';
    line(c, -8, -28, -15 + stride, 5, skin, 7); line(c, 9, -28, 15 - stride, 5, skin, 7);
    poly(c, [[-16, -73], [16, -73], [23, -26], [-21, -26]], opts.robe || p.cloth, p.dark, 2);
    line(c, -13, -66, -27 - stride * .5, -33, skin, 7);
    line(c, 14, -66, opts.point ? 44 : 27 + stride * .5, opts.point ? -91 : -36, skin, 7);
    circle(c, 0, -88, 15, skin);
    poly(c, [[-16, -91], [-12, -110], [9, -109], [16, -95], [7, -103], [-8, -101]], p.dark);
    circle(c, 7, -90, 2, p.dark);
    if (opts.laurel) {
      for (let i = -2; i <= 2; i++) ellipse(c, i * 6, -104 - Math.cos(i) * 7, 4, 2, p.green);
    }
    c.restore();
  }
  function recliner(c, x, y, p, i) {
    const gesture = Math.sin(time * 1.8 + i * 1.3) * (4 + mid * 7);
    ellipse(c, x, y + 4, 55, 19, i % 2 ? p.red : p.green);
    line(c, x - 43, y + 4, x - 28, y - 27, p.gold, 5);
    line(c, x - 28, y - 27, x + 7, y - 28, p.gold, 4);
    poly(c, [[x - 38, y - 2], [x + 15, y - 14], [x + 45, y - 7], [x - 5, y + 11]], i % 3 ? p.cloth : p.gold, p.dark, 2);
    line(c, x - 7, y - 20, x + 18, y - 45, '#c28469', 12);
    circle(c, x + 26, y - 51, 13, '#c28469');
    poly(c, [[x + 17, y - 56], [x + 17, y - 67], [x + 36, y - 65], [x + 39, y - 55]], p.dark);
    line(c, x + 15, y - 33, x + 45, y - 43 - gesture, '#c28469', 6);
    line(c, x + 44, y - 43 - gesture, x + 48, y - 60 - gesture, p.gold, 3);
    ellipse(c, x + 48, y - 60 - gesture, 8, 4, p.glow);
    if (i % 2 === 0) for (let j = 0; j < 3; j++) ellipse(c, x + 20 + j * 5, y - 65 - j, 3, 2, p.green);
  }
  function standard(c, x, y, p, local) {
    line(c, x, y, x, y - 166, p.gold, 5);
    poly(c, [[x, y - 149], [x + 65 + Math.sin(local * 2) * 8, y - 140], [x + 54, y - 97], [x, y - 105]], p.red, p.gold, 3);
    circle(c, x, y - 169, 12, p.gold); line(c, x - 11, y - 169, x + 11, y - 169, p.dark, 3);
  }
  function legions(c, p, local) {
    background(c, p, local, 315);
    for (let i = 0; i < 5; i++) column(c, i * 225 - local * 15 % 225 - 60, 166, 169, p);
    const march = time * (25 + bass * 30);
    for (let row = 0; row < 3; row++) for (let i = 0; i < 8; i++) {
      const x = (i * 131 + row * 46 - march) % 1110 - 100;
      const y = 337 + row * 53;
      figure(c, x, y, .72 + row * .17, p, { robe: p.red, walk: true });
      ellipse(c, x - 17, y - 43, 22, 31, p.red); ellipse(c, x - 17, y - 43, 13, 23, p.gold);
      line(c, x + 20, y - 32, x + 25, y - 125, p.dark, 3);
    }
    standard(c, 175 - march % 450, 420, p, local);
    standard(c, 620 - march % 450, 413, p, local);
    poly(c, [[0, 468], [900, 468], [900, 500], [0, 500]], p.ground);
  }
  function forum(c, p, local) {
    background(c, p, local, 326);
    poly(c, [[130, 153], [450, 65], [770, 153]], p.stone, p.dark, 5);
    c.fillStyle = p.shade; c.fillRect(170, 149, 560, 16);
    for (let i = 0; i < 7; i++) column(c, 188 + i * 87, 177, 171, p);
    c.fillStyle = p.dark; c.fillRect(153, 347, 594, 19);
    poly(c, [[295, 365], [606, 365], [688, 467], [212, 467]], p.stone, p.dark, 4);
    for (let i = 0; i < 9; i++) {
      const x = 155 + i * 72 + Math.sin(local + i) * 4;
      figure(c, x, 449, .65 + i % 3 * .09, p, { robe: i % 3 ? p.cloth : p.red });
    }
    figure(c, 450, 374, 1.85, p, { robe: p.cloth, point: true, laurel: true });
    c.save(); c.translate(527, 271); c.rotate(Math.sin(time * 1.8) * .09);
    c.fillStyle = p.stone; c.fillRect(0, 0, 60, 35); c.fillStyle = p.gold; c.fillRect(-5, -4, 70, 6); c.restore();
    c.fillStyle = p.dark; c.font = 'bold 23px Georgia, serif'; c.textAlign = 'center';
    c.fillText('CICERO', 450, 146);
    for (let i = 0; i < 13; i++) {
      const x = 260 + i * 31;
      line(c, x, 478, x + Math.sin(time * 3 + i) * (4 + mid * 8), 469, p.dark, 2);
    }
  }
  function cleopatra(c, p, local) {
    background(c, p, local, 286);
    c.fillStyle = p.sky; c.fillRect(0, 300, 900, 200);
    for (let i = 0; i < 15; i++) line(c, (i * 111 + time * 26) % 1000 - 60, 334 + i % 6 * 27, i * 111 + 56, 334 + i % 6 * 27, p.gold, 2);
    for (let i = 0; i < 3; i++) column(c, i * 175 - 50, 196, 119, p);
    const bob = Math.sin(time * 1.7) * (3 + bass * 6);
    c.save(); c.translate(0, bob);
    poly(c, [[190, 342], [726, 342], [653, 420], [292, 420]], p.dark, p.gold, 5);
    for (let i = 0; i < 12; i++) line(c, 266 + i * 34, 381, 268 + i * 34, 405, p.gold, 2);
    line(c, 444, 350, 444, 138, p.gold, 6);
    poly(c, [[447, 144], [616, 331], [458, 326]], p.cloth, p.red, 4);
    poly(c, [[447, 151], [305, 325], [433, 322]], p.red, p.gold, 3);
    for (let i = 0; i < 5; i++) figure(c, 281 + i * 89, 352, .6, p, { robe: i % 2 ? p.cloth : p.gold });
    figure(c, 592, 352, 1.28, p, { robe: p.gold, skin: '#ab6d51' });
    poly(c, [[576, 219], [591, 200], [606, 218]], p.gold);
    poly(c, [[573, 223], [581, 218], [583, 251], [579, 265], [570, 259]], p.dark);
    poly(c, [[604, 218], [612, 223], [616, 260], [606, 268], [600, 250]], p.dark);
    for (let i = 0; i < 4; i++) line(c, 576 + i * 9, 257, 584 + i * 7, 269, i % 2 ? p.gold : p.sky, 3);
    line(c, 598, 231, 604, 229, p.dark, 2);
    for (let i = 0; i < 7; i++) {
      const x = 222 + i * 77;
      line(c, x, 384, x - 31, 441 + Math.sin(time * 2 + i) * 7, p.stone, 5);
    }
    c.restore();
  }
  function banquet(c, p, local) {
    background(c, p, local, 370);
    for (let i = 0; i < 6; i++) column(c, i * 178 - 12, 111, 272, p);
    c.fillStyle = p.dark; c.fillRect(0, 368, 900, 30);
    for (let i = 0; i < 7; i++) recliner(c, 100 + i * 116, 338 + Math.sin(time * 1.2 + i) * 3, p, i);
    poly(c, [[105, 362], [800, 362], [860, 439], [53, 439]], p.red, p.gold, 4);
    c.fillStyle = p.stone; c.fillRect(76, 421, 755, 21);
    for (let i = 0; i < 15; i++) {
      const x = 114 + i * 49;
      ellipse(c, x, 378 + i % 3 * 9, 13 + i % 2 * 5, 7, i % 3 ? p.gold : p.green);
      if (i % 4 === 0) { line(c, x + 24, 356, x + 22, 402, p.gold, 3); ellipse(c, x + 22, 356, 9, 5, p.glow); }
      if (i % 3 === 0) for (let j = 0; j < 5; j++) circle(c, x - 10 + j * 5, 386 + j % 2 * 5, 3, j % 2 ? p.green : p.red);
    }
    for (let i = 0; i < 13; i++) circle(c, (i * 147 + time * 26) % 950, 110 + i % 4 * 61, 2 + treble * 3, p.gold);
  }
  function arena(c, p, local) {
    background(c, p, local, 345);
    ellipse(c, 448, 415, 520, 216, p.dark);
    ellipse(c, 448, 412, 484, 187, p.stone);
    for (let i = 0; i < 24; i++) {
      const x = 75 + i * 32;
      const rim = Math.sqrt(Math.max(0, 1 - ((x - 448) / 486) ** 2));
      const y = 412 - rim * 184 + 15;
      c.fillStyle = p.shade; c.beginPath(); c.ellipse(x, y, 10, 17, 0, Math.PI, TAU); c.lineTo(x + 10, y + 15); c.lineTo(x - 10, y + 15); c.fill();
      line(c, x - 12, y + 17, x + 12, y + 17, p.dark, 2);
    }
    ellipse(c, 448, 414, 430, 138, p.shade);
    ellipse(c, 448, 414, 355, 107, p.ground);
    for (let row = 0; row < 3; row++) for (let i = 0; i < 34; i++) {
      const a = i * TAU / 34 + row * .08;
      circle(c, 448 + Math.cos(a) * (404 + row * 34), 414 + Math.sin(a) * (119 + row * 21), 4 + row, i % 5 ? p.red : p.gold);
    }
    for (let i = 0; i < 13; i++) {
      const a = i * TAU / 13;
      const x = 448 + Math.cos(a) * 421, y = 414 + Math.sin(a) * 123;
      line(c, x, y, x + Math.cos(a) * 28, y + Math.sin(a) * 14, p.dark, 8);
    }
    const duel = Math.sin(time * 2 + bass * 3) * 13;
    figure(c, 340 + duel, 418, 1.2, p, { robe: p.red, walk: true });
    figure(c, 552 - duel, 421, 1.2, p, { robe: p.gold, walk: true });
    line(c, 370 + duel, 360, 420 + duel, 310 - accent * 20, p.stone, 5);
    line(c, 523 - duel, 359, 480 - duel, 310 - accent * 12, p.stone, 5);
    ellipse(c, 321 + duel, 351, 22, 31, p.gold); ellipse(c, 571 - duel, 351, 22, 31, p.red);
    for (let i = 0; i < 11; i++) {
      const x = (i * 89 + time * 55) % 920;
      circle(c, x, 345 + i % 4 * 26, 2 + bass * 3, p.gold);
    }
  }
  function bread(c, p, local) {
    background(c, p, local, 330);
    for (let i = 0; i < 6; i++) column(c, i * 179 - 10, 149, 202, p);
    poly(c, [[45, 329], [857, 329], [798, 388], [105, 388]], p.stone, p.dark, 5);
    poly(c, [[133, 390], [769, 390], [823, 500], [79, 500]], p.shade);
    for (let i = 0; i < 6; i++) figure(c, 178 + i * 110, 350, .9, p, { robe: i % 2 ? p.red : p.cloth, point: i % 3 === 0 });
    for (let i = 0; i < 13; i++) {
      const x = (i * 87 + local * 32) % 1020 - 55, y = 418 + i % 3 * 35;
      figure(c, x, y, .68 + i % 3 * .12, p, { robe: i % 3 ? p.cloth : p.green });
    }
    for (let i = 0; i < 10; i++) {
      const x = (i * 111 + time * (34 + bass * 65)) % 1000 - 50;
      const y = 263 + Math.sin(time * 1.8 + i) * 34 + i % 3 * 31;
      ellipse(c, x, y, 14, 8, p.gold);
      line(c, x - 5, y - 2, x + 5, y - 2, p.shade, 2);
    }
    c.save(); c.globalAlpha = .45 + accent * .35;
    for (let i = 0; i < 16; i++) circle(c, (i * 67 + time * 28) % 900, 66 + i % 4 * 37, 2 + treble * 3, p.gold);
    c.restore();
  }
  const drawings = { legions, forum, cleopatra, banquet, arena, bread };
  function overlay(c, p, form) {
    if (form === 'imperial') {
      c.save(); c.globalAlpha = .25 + accent * .2;
      for (let i = 0; i < 11; i++) {
        const x = (i * 107 + time * 20) % 1010 - 30, y = 40 + i % 5 * 73;
        ellipse(c, x, y, 9, 3, p.gold);
      }
      c.restore();
    } else if (form === 'bacchanal') {
      c.save(); c.fillStyle = '#18123572'; c.fillRect(0, 0, 900, 500);
      for (let i = 0; i < 26; i++) {
        const x = (i * 199 + time * 13) % 930, y = i * 71 % 335;
        circle(c, x, y, 1.5 + accent * 3, p.gold);
      }
      for (let i = 0; i < 8; i++) {
        const x = 45 + i * 117, y = 410 + Math.sin(time * 1.3 + i) * 8;
        const g = c.createRadialGradient(x, y, 0, x, y, 67 + bass * 40);
        g.addColorStop(0, '#ffbd6480'); g.addColorStop(1, '#ffbd6400');
        c.fillStyle = g; c.fillRect(x - 110, y - 110, 220, 220);
        poly(c, [[x - 6, y], [x, y - 28 - accent * 17], [x + 7, y]], p.gold);
      }
      c.restore();
    } else if (form === 'mosaic') {
      c.save();
      c.fillStyle = '#ead7a830'; c.fillRect(0, 0, 900, 500);
      for (let y = 0; y < 500; y += 15) for (let x = 0; x < 900; x += 15) {
        c.strokeStyle = (x + y) % 45 ? '#483b4250' : '#f7e6bd5e';
        c.lineWidth = 1.1; c.strokeRect(x + .6, y + .6, 14, 14);
      }
      c.strokeStyle = p.gold; c.lineWidth = 19; c.strokeRect(10, 10, 880, 480);
      c.strokeStyle = p.dark; c.lineWidth = 5; c.strokeRect(22, 22, 856, 456);
      for (let i = 0; i < 36; i++) {
        const a = i * TAU / 36 + time * .07;
        circle(c, 450 + Math.cos(a) * 426, 250 + Math.sin(a) * 215, 3 + mid * 3, p.red);
      }
      c.restore();
    } else {
      c.save(); c.fillStyle = '#190c2260'; c.fillRect(0, 0, 900, 500);
      for (let i = 0; i < 51; i++) {
        const x = (i * 167 + time * (37 + bass * 62)) % 1050 - 80;
        const y = (i * 97 - time * (48 + mid * 90)) % 670 + 60;
        c.globalAlpha = .18 + i % 5 * .12;
        line(c, x, y, x + 11, y - 25 - accent * 24, i % 3 ? p.gold : p.red, 1 + i % 3);
      }
      c.globalAlpha = .85;
      for (let i = 0; i < 12; i++) {
        const x = i * 93 + Math.sin(time * 2 + i) * 18;
        const h = 20 + (Math.sin(time * 4 + i * 1.7) + 1) * (25 + bass * 32);
        poly(c, [[x - 12, 500], [x, 500 - h], [x + 12, 500]], i % 2 ? p.gold : p.red);
      }
      if (accent > .12) { c.globalAlpha = accent * .16; c.fillStyle = p.glow; c.fillRect(0, 0, 900, 500); }
      c.restore();
    }
  }
  function draw(c, w, h, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'imperial';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    const inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && inputBass > .62 && lastBass <= .62) { beats++; accent = 1; }
    lastBass = inputBass;
    accent = Math.max(0, accent - dt * 2.3);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const loop = time % 72, shotIndex = Math.floor(loop / 12), local = loop % 12;
    const scene = routes[form][shotIndex], p = palettes[form];
    c.save(); c.scale(w / 900, h / 500);
    c.save();
    const zoom = 1.025 + Math.sin(local / 12 * Math.PI) * (form === 'inferno' ? .17 : .08);
    c.translate(450, 250); c.scale(zoom, zoom); c.translate(-450, -250);
    if (form === 'inferno') c.translate(Math.sin(time * 17) * (2 + accent * 9), Math.cos(time * 13) * (1 + accent * 6));
    drawings[scene](c, p, local);
    overlay(c, p, form);
    c.restore();
    const cut = Math.min(local, 12 - local);
    if (time > 0 && cut < .4) {
      c.fillStyle = p.dark; c.globalAlpha = (1 - cut / .4) * .65; c.fillRect(0, 0, 900, 500); c.globalAlpha = 1;
    }
    const vignette = c.createRadialGradient(450, 250, 160, 450, 250, 620);
    vignette.addColorStop(0, '#0000'); vignette.addColorStop(1, `${p.dark}92`);
    c.fillStyle = vignette; c.fillRect(0, 0, 900, 500);
    c.restore();
    return { time, phase: scene, form, beats };
  }
  return { recipes, draw, reset };
})();
