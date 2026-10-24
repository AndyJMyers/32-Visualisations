/* Autumn 19: tabletop games and a music-driven arcade reel. */
window.OldSchoolGames = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const forms = ['tabletop', 'afterdark', 'blueprint', 'popart'];
  const recipes = [
    { name: 'Kitchen Table', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'After Dark', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Toybox Blueprint', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Pop-Art Pandemonium', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    tabletop: { back: '#25445a', back2: '#738b89', table: '#b58158', rim: '#e5bf8c', ink: '#243441', glass: '#d5edeb', a: '#d94c45', b: '#46adb6', gold: '#f5cb66', pink: '#ed7995', stick: ['#f3bd54', '#d45366', '#65bcb7', '#7797d0'] },
    afterdark: { back: '#14142d', back2: '#422a5c', table: '#39334b', rim: '#a56aae', ink: '#121426', glass: '#91dfed', a: '#f3689a', b: '#55d6ed', gold: '#ffde79', pink: '#dc84df', stick: ['#ffe16b', '#fa6c9d', '#62dce0', '#aa8dff'] },
    blueprint: { back: '#173d63', back2: '#256b92', table: '#22506f', rim: '#83c8d8', ink: '#113750', glass: '#caf2fa', a: '#f0a765', b: '#87d1d7', gold: '#f7df98', pink: '#bedaf2', stick: ['#f3d184', '#c7edf6', '#84c3d4', '#efaf8e'] },
    popart: { back: '#e9bb73', back2: '#f27669', table: '#4b6379', rim: '#ffdd87', ink: '#252738', glass: '#d8ecf1', a: '#f15256', b: '#48b4bd', gold: '#ffe46e', pink: '#eb7faa', stick: ['#ffce51', '#e95965', '#5dc1b4', '#8e9fda'] },
  };
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, previousBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = previousBass = 0; beats = 0; activeForm = null; }
  function line(c, x1, y1, x2, y2, color, width = 2) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function poly(c, points, fill, stroke = null, width = 2) {
    c.beginPath(); c.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) c.lineTo(...points[i]);
    c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function ellipse(c, x, y, rx, ry, fill, stroke = null, width = 2) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function label(c, text, x, y, size, color) {
    c.font = `900 ${size}px system-ui, sans-serif`; c.textAlign = 'center';
    c.lineWidth = 5; c.strokeStyle = '#1423319c'; c.strokeText(text, x, y);
    c.fillStyle = color; c.fillText(text, x, y);
  }
  function background(c, p, scene) {
    if (scene !== 'robots' && scene !== 'kerplunk') {
      c.fillStyle = p.ink; c.fillRect(0, 0, 900, 500);
      const screen = c.createRadialGradient(450, 250, 30, 450, 250, 510);
      screen.addColorStop(0, p.back2); screen.addColorStop(1, '#080d1c');
      c.fillStyle = screen; c.fillRect(32, 35, 836, 430);
      c.strokeStyle = p.rim; c.lineWidth = 11; c.strokeRect(26, 28, 848, 444);
      c.strokeStyle = `${p.glass}88`; c.lineWidth = 2; c.strokeRect(40, 42, 820, 416);
      const names = { maze: 'MAZE CHASE', invaders: 'SPACE INVADERS', pong: 'PONG', hover: 'HOVER BOVVER', gridrunner: 'GRIDRUNNER', forest: 'FORBIDDEN FOREST' };
      label(c, names[scene], 450, 78, 28, p.gold);
      label(c, `HI ${String(10000 + beats * 120).padStart(6, '0')}   •   1 UP`, 450, 105, 12, p.glass);
      return;
    }
    const g = c.createLinearGradient(0, 0, 0, 500);
    g.addColorStop(0, p.back); g.addColorStop(.7, p.back2); g.addColorStop(1, p.table);
    c.fillStyle = g; c.fillRect(0, 0, 900, 500);
    for (let i = 0; i < 20; i++) {
      const x = i * 83 % 900, y = i * 131 % 285;
      ellipse(c, x, y, 2 + treble * 5, 2 + treble * 5, `${p.gold}35`);
    }
    poly(c, [[0, 351], [900, 351], [900, 500], [0, 500]], p.table);
    line(c, 0, 351, 900, 351, p.rim, 8);
    for (let i = 0; i < 13; i++) line(c, i * 92 - 80, 500, 450 + (i - 6) * 33, 351, `${p.rim}35`, 2);
    label(c, scene === 'robots' ? 'ROBOT RUMBLE' : 'KERPLUNK!', 450, 54, 30, p.gold);
    label(c, scene === 'robots' ? 'WIND THEM UP  •  LET THEM LOOSE' : 'ONE STICK AT A TIME', 450, 76, 12, p.glass);
  }
  function bolt(c, x, y, p) {
    ellipse(c, x, y, 7, 7, p.rim, p.ink, 2);
    line(c, x - 3, y + 2, x + 3, y - 2, p.ink, 1.5);
  }
  function robot(c, x, y, facing, color, p, phase, index) {
    const wobble = Math.sin(time * (6 + bass * 7) + index) * (2.4 + mid * 3);
    const hit = phase > 2.7 && phase < 4.2 ? 1 : 0;
    c.save(); c.translate(x, y + wobble); c.scale(facing, 1);
    c.rotate((index ? -1 : 1) * Math.sin(time * 8 + index) * (hit ? .1 : .025));
    ellipse(c, 0, 8, 77, 17, '#10192360');
    // Wheels and feet keep the fighters planted on the tabletop.
    for (const dx of [-36, 36]) {
      ellipse(c, dx, -6, 21, 20, p.ink, p.rim, 3);
      ellipse(c, dx, -6, 9, 9, p.gold);
      line(c, dx - 28, 11, dx + 28, 11, p.ink, 7);
    }
    poly(c, [[-57,-123], [57,-123], [50,-24], [-50,-24]], color, p.ink, 5);
    poly(c, [[-52,-121], [46,-121], [40,-101], [-47,-101]], `${p.glass}50`);
    for (let i = 0; i < 5; i++) line(c, -24 + i * 12, -48, -24 + i * 12, -32, p.ink, 3);
    ellipse(c, 0, -75, 22, 19, p.gold, p.ink, 4);
    ellipse(c, 0, -75, 7 + bass * 4, 7 + bass * 4, p.ink);
    bolt(c, -39, -108, p); bolt(c, 39, -108, p);
    // Hinged arms swing on the beat; the forward pincer strikes first.
    const punch = 16 + Math.sin(time * 5.5 + index * 2) * 11 + hit * (16 + accent * 18);
    line(c, 45, -104, 73 + punch, -91 - bass * 10, p.ink, 16);
    line(c, 45, -104, 73 + punch, -91 - bass * 10, p.rim, 9);
    ellipse(c, 45, -104, 13, 13, p.gold, p.ink, 3);
    line(c, 73 + punch, -91 - bass * 10, 92 + punch, -110 - bass * 10, p.ink, 7);
    line(c, 73 + punch, -91 - bass * 10, 93 + punch, -74 - bass * 10, p.ink, 7);
    line(c, -49, -105, -80, -73 + Math.sin(time * 4 + index) * 8, p.ink, 13);
    ellipse(c, -84, -72 + Math.sin(time * 4 + index) * 8, 12, 14, p.rim, p.ink, 3);
    // Antennae, eyes and grill give each tin fighter a face.
    poly(c, [[-45,-189], [45,-189], [51,-128], [-51,-128]], p.rim, p.ink, 5);
    poly(c, [[-40,-184], [36,-184], [41,-169], [-37,-169]], color);
    ellipse(c, -20, -151, 11, 9, p.gold, p.ink, 3);
    ellipse(c, 20, -151, 11, 9, p.gold, p.ink, 3);
    ellipse(c, -17, -151, 4, 4, p.ink); ellipse(c, 23, -151, 4, 4, p.ink);
    for (let i = 0; i < 4; i++) line(c, -24 + i * 15, -135, -22 + i * 15, -130, p.ink, 2);
    line(c, 0, -190, 0, -212, p.ink, 4); ellipse(c, 0, -216, 8 + treble * 3, 8 + treble * 3, p.gold);
    c.restore();
  }
  function sparks(c, x, y, p, strength) {
    if (strength <= 0) return;
    c.save(); c.globalAlpha = strength;
    for (let i = 0; i < 16; i++) {
      const a = i * 2.399 + time * .7, r = (12 + i * 3.3) * (1 + bass * .5);
      const sx = x + Math.cos(a) * r, sy = y + Math.sin(a) * r;
      line(c, sx, sy, sx + Math.cos(a) * (8 + i % 4 * 4), sy + Math.sin(a) * (8 + i % 4 * 4), i % 3 ? p.gold : p.pink, 2 + i % 3);
    }
    c.restore();
  }
  function robots(c, p, local) {
    const phase = local % 7.5;
    const approach = Math.sin(Math.min(1, phase / 3) * Math.PI / 2);
    const separation = phase > 4.2 ? Math.min(1, (phase - 4.2) / 1.6) * 47 : 0;
    const gap = 236 - approach * 121 + separation;
    robot(c, 450 - gap, 334, 1, p.a, p, phase, 0);
    robot(c, 450 + gap, 334, -1, p.b, p, phase, 1);
    const impact = phase > 2.8 && phase < 4.2 ? Math.sin((phase - 2.8) / 1.4 * Math.PI) : 0;
    sparks(c, 450, 216, p, Math.max(impact * .95, accent * .7));
    if (impact > .2) {
      c.save(); c.globalAlpha = impact * .18; c.fillStyle = p.gold; c.fillRect(0, 0, 900, 500); c.restore();
    }
    for (let i = 0; i < 3; i++) {
      const x = 128 + i * 320 + Math.sin(time * 2 + i) * 8;
      ellipse(c, x, 430, 62, 14, '#1325323a');
      line(c, x - 32, 427, x + 32, 427, p.rim, 2);
    }
  }
  function marble(c, x, y, r, fill, p) {
    ellipse(c, x + 2, y + 3, r, r, '#12233160');
    ellipse(c, x, y, r, r, fill, p.ink, 1.5);
    ellipse(c, x - r * .28, y - r * .3, r * .28, r * .2, '#ffffffa8');
  }
  function kerplunk(c, p, local) {
    // The transparent cylinder is drawn back-to-front: glass, sticks, marbles, rim.
    ellipse(c, 450, 412, 160, 25, '#17253655');
    poly(c, [[337,118], [563,118], [555,394], [345,394]], `${p.glass}20`, `${p.glass}91`, 4);
    ellipse(c, 450, 119, 113, 24, `${p.glass}40`, `${p.glass}bb`, 4);
    ellipse(c, 450, 394, 105, 21, `${p.ink}50`, `${p.glass}b0`, 3);
    for (let i = 0; i < 12; i++) {
      const row = i % 4, y = 238 + row * 27, start = i * 1.1;
      const pull = clamp((local - start) / 1.1, 0, 1);
      const skew = (i % 3 - 1) * 7;
      const fromLeft = i % 2 === 0, shift = (fromLeft ? -1 : 1) * pull * 302;
      const left = 300 + shift, right = 601 + shift;
      line(c, left, y + skew, right, y - skew, p.ink, 9);
      line(c, left, y + skew - 2, right, y - skew - 2, p.stick[i % 4], 6);
      const capX = fromLeft ? left : right, capY = fromLeft ? y + skew : y - skew;
      ellipse(c, capX, capY - 1, 8, 8, p.stick[i % 4], p.ink, 2);
      const tipX = fromLeft ? right : left, tipY = fromLeft ? y - skew : y + skew;
      const direction = fromLeft ? 1 : -1;
      poly(c, [[tipX + direction * 9, tipY], [tipX - direction * 2, tipY - 4], [tipX - direction * 2, tipY + 4]], p.stick[i % 4]);
      if (pull > .1 && pull < 1) sparks(c, fromLeft ? 294 : 606, capY, p, accent * .45);
    }
    for (let i = 0; i < 22; i++) {
      const col = i % 6, row = Math.floor(i / 6);
      const x = 375 + col * 30 + (row % 2) * 10 + Math.sin(time * 2 + i) * (1 + mid * 3);
      const startY = 151 + row * 29;
      const release = (i * 7 % 11) * 1.26 + 1.1;
      const fall = clamp((local - release) / (.85 + i % 3 * .15), 0, 1);
      const settleY = 373 - Math.floor(i / 8) * 24 - (i % 3) * 3;
      const eased = 1 - (1 - fall) * (1 - fall);
      const bounce = fall > .86 ? Math.sin((fall - .86) / .14 * Math.PI) * 7 : 0;
      const y = startY + (settleY - startY) * eased - bounce;
      marble(c, x, y, 12 + i % 3, [p.gold, p.a, p.b, p.pink][i % 4], p);
    }
    line(c, 341, 130, 347, 383, '#ffffff79', 5);
    line(c, 558, 134, 552, 382, '#ffffff60', 4);
    ellipse(c, 450, 115, 116, 24, null, p.glass, 5);
    poly(c, [[330,397], [570,397], [602,430], [298,430]], p.a, p.ink, 4);
    label(c, 'KERPLUNK!', 450, 421, 19, p.gold);
    if (accent > .05) for (let i = 0; i < 8; i++) {
      const x = 321 + i * 38, y = 208 + Math.sin(i * 3 + time * 5) * 21;
      ellipse(c, x, y, 2 + accent * 3, 2 + accent * 3, p.gold);
    }
  }
  function arcadePixel(c, x, y, unit, rows, color) {
    c.fillStyle = color;
    rows.forEach((row, ry) => [...row].forEach((bit, rx) => {
      if (bit === '1') c.fillRect(x + rx * unit, y + ry * unit, unit, unit);
    }));
  }
  function maze(c, p, local) {
    const left = 111, top = 130, cell = 44;
    const route = [[1,1], [5,1], [5,3], [2,3], [2,5], [8,5], [8,2], [12,2], [12,4], [14,4], [14,1]];
    const branches = [[[2,3], [1,3]], [[8,5], [12,5]], [[12,2], [12,1]], [[14,4], [14,5]]];
    const xy = ([x, y]) => [left + x * cell, top + y * cell];
    const corridor = points => {
      for (let i = 1; i < points.length; i++) {
        const a = xy(points[i - 1]), b = xy(points[i]);
        line(c, ...a, ...b, p.b, 51);
        line(c, ...a, ...b, p.ink, 42);
      }
    };
    corridor(route); branches.forEach(corridor);
    let length = 0;
    const segments = route.slice(1).map((end, i) => {
      const start = route[i], distance = Math.abs(end[0] - start[0]) + Math.abs(end[1] - start[1]);
      const segment = { start, end, distance, offset: length };
      length += distance;
      return segment;
    });
    const pointAt = distance => {
      const d = clamp(distance, 0, length);
      const segment = segments.find(part => d <= part.offset + part.distance) || segments[segments.length - 1];
      const t = (d - segment.offset) / segment.distance;
      const x = segment.start[0] + (segment.end[0] - segment.start[0]) * t;
      const y = segment.start[1] + (segment.end[1] - segment.start[1]) * t;
      return { x: left + x * cell, y: top + y * cell, angle: Math.atan2(segment.end[1] - segment.start[1], segment.end[0] - segment.start[0]) };
    };
    const travel = Math.min(length, local * (1.75 + bass * .22));
    const lastPower = [6, 17, 27].filter(mark => travel >= mark).pop();
    const vulnerable = lastPower !== undefined && travel - lastPower < 4.4;
    for (let d = .6; d < length; d += .55) {
      if (d < travel - .2) continue;
      const point = pointAt(d), power = [6, 17, 27].some(mark => Math.abs(mark - d) < .25);
      ellipse(c, point.x, point.y, power ? 7 + accent * 3 : 3 + treble, power ? 7 + accent * 3 : 3 + treble, p.gold);
    }
    const { x: cx, y: cy, angle } = pointAt(travel);
    const mouth = .16 + Math.abs(Math.sin(time * 12)) * .43;
    c.save(); c.translate(cx, cy); c.rotate(angle);
    c.fillStyle = p.gold; c.beginPath(); c.moveTo(0, 0);
    c.arc(0, 0, 17 + bass * 3, mouth, TAU - mouth); c.closePath(); c.fill(); c.restore();
    const ghosts = [p.a, p.pink, p.b];
    ghosts.forEach((color, i) => {
      const point = pointAt((travel - 3 - i * 4 + length) % length);
      const gx = point.x, gy = point.y + Math.sin(time * 3 + i * 2) * 3;
      c.fillStyle = vulnerable ? '#315cc8' : color;
      c.beginPath(); c.arc(gx, gy, 16, Math.PI, 0); c.lineTo(gx + 16, gy + 17);
      for (let j = 2; j >= -2; j--) c.lineTo(gx + j * 7, gy + 12 + (j % 2 ? 5 : 0));
      c.closePath(); c.fill();
      ellipse(c, gx - 5, gy - 2, 4, 5, '#fff'); ellipse(c, gx + 5, gy - 2, 4, 5, '#fff');
      ellipse(c, gx - 4, gy - 1, 2, 2, p.ink); ellipse(c, gx + 6, gy - 1, 2, 2, p.ink);
      if (vulnerable) {
        line(c, gx - 7, gy + 9, gx, gy + 5 + Math.sin(time * 13 + i) * 2, '#fff', 2);
        line(c, gx, gy + 5 + Math.sin(time * 13 + i) * 2, gx + 7, gy + 9, '#fff', 2);
      }
    });
    if (vulnerable) label(c, 'POWER!', 450, 445, 16, p.gold);
    c.strokeStyle = p.b; c.lineWidth = 5; c.strokeRect(left - 16, top - 19, 15 * cell + 32, 6 * cell + 38);
    return vulnerable;
  }
  function invaders(c, p, local) {
    const alien = ['00111100', '01111110', '11111111', '11011011', '11111111', '00100100', '01011010'];
    const volleys = [
      [.8,3,4], [2.2,3,2], [3.6,2,5], [5,3,7], [6.4,2,1],
      [7.8,1,6], [9.2,2,3], [10.6,1,4], [12,0,5], [13.4,0,2],
    ];
    const flightTime = .72;
    const march = Math.floor(local * 2.4 + beats * .18);
    const wave = Math.sin(local * 1.55) * 30 + (march % 2 ? 9 : -9);
    const alienPosition = (row, col) => ({
      x: 170 + col * 65 + wave + (row % 2 ? 1 : -1) * accent * 7,
      y: 160 + row * 48 + local * 3.4 + Math.sin(local * 5.8 + row * 1.4) * (2 + mid * 5) + (row % 2 ? -1 : 1) * accent * 9,
    });
    let destroyed = 0;
    for (let row = 0; row < 4; row++) for (let col = 0; col < 9; col++) {
      const hit = volleys.find(([, targetRow, targetCol]) => row === targetRow && col === targetCol);
      const position = alienPosition(row, col);
      if (hit && local >= hit[0] + flightTime) {
        destroyed++;
        const age = local - hit[0] - flightTime;
        if (age < .32) sparks(c, position.x + 16, position.y + 12, p, 1 - age / .32);
        continue;
      }
      arcadePixel(c, position.x, position.y, 4, alien, [p.b, p.pink, p.gold, p.glass][row]);
    }
    const shipAt = sceneTime => 450 + Math.sin((time - local + sceneTime) * 1.35) * 240;
    const shipX = shipAt(local);
    poly(c, [[shipX - 28, 420], [shipX - 18, 405], [shipX - 6, 405], [shipX, 392], [shipX + 6, 405], [shipX + 18, 405], [shipX + 28, 420]], p.gold, p.glass, 2);
    for (const [at, row, col] of volleys) {
      const age = local - at;
      if (age < 0 || age >= flightTime) continue;
      const target = alienPosition(row, col), progress = age / flightTime;
      const shotX = shipAt(at) + (target.x + 16 - shipAt(at)) * progress;
      const shotY = 391 + (target.y + 14 - 391) * progress;
      line(c, shotX, shotY + 12, shotX, shotY - 10 - treble * 5, p.gold, 3);
      ellipse(c, shotX, shotY - 10, 4 + accent * 2, 5 + accent * 2, p.glass);
    }
    const saucerX = -45 + local % 8 * 122;
    ellipse(c, saucerX, 143, 33, 8, p.pink, p.glass, 2);
    ellipse(c, saucerX, 136, 17, 8, p.b, p.glass, 2);
    for (let i = -2; i <= 2; i++) ellipse(c, saucerX + i * 10, 143, 2 + accent, 2 + accent, p.gold);
    for (const [at, col] of [[1.4,6], [3.8,1], [5.8,7], [8.1,3], [10.1,5], [12.5,2], [14.2,8]]) {
      const age = local - at;
      if (age < 0 || age > 1.15) continue;
      const x = 170 + col * 65 + Math.sin(at * 1.55) * 30 + Math.sin(age * 5) * 7;
      const y = 313 + at * 3.4 + age * (112 + bass * 22);
      if (y < 414) {
        line(c, x, y - 22, x, y - 9, p.gold, 3);
        ellipse(c, x, y, 7 + bass * 2, 9 + bass * 2, p.a, p.gold, 2);
        poly(c, [[x, y + 15], [x - 6, y + 5], [x + 6, y + 5]], p.pink);
      } else if (age < 1.05) sparks(c, x, 413, p, 1 - (age - .8) * 3);
    }
    for (let i = 0; i < 3; i++) {
      const x = 280 + i * 170;
      poly(c, [[x - 33, 427], [x - 33, 410], [x + 33, 410], [x + 33, 427]], `${p.b}88`);
    }
    label(c, `${destroyed} HITS`, 750, 451, 12, p.glass);
    return destroyed;
  }
  function pong(c, p, local) {
    for (let y = 137; y < 428; y += 29) line(c, 450, y, 450, y + 13, `${p.glass}99`, 4);
    line(c, 91, 119, 809, 119, p.glass, 3); line(c, 91, 438, 809, 438, p.glass, 3);
    const rally = local * (1.7 + bass * .8);
    const leg = rally % 2, fraction = leg < 1 ? leg : 2 - leg;
    const ballX = 125 + fraction * 650;
    const ballY = 276 + Math.sin(rally * 2.1) * 113;
    const leftY = clamp(ballY + Math.sin(time * 2) * 18, 166, 390);
    const rightY = clamp(ballY + Math.cos(time * 2.4) * 23, 166, 390);
    line(c, 108, leftY - 39, 108, leftY + 39, p.b, 13);
    line(c, 792, rightY - 39, 792, rightY + 39, p.pink, 13);
    for (let i = 5; i >= 1; i--) {
      const trailX = clamp(ballX + (leg < 1 ? -i : i) * (8 + bass * 4), 125, 775);
      ellipse(c, trailX, ballY, 6 + treble * 2, 6 + treble * 2, `${p.gold}${Math.round((6 - i) * 24).toString(16).padStart(2, '0')}`);
    }
    ellipse(c, ballX, ballY, 8 + accent * 4, 8 + accent * 4, p.gold, p.glass, 2);
    label(c, String(Math.floor(local / 4) % 10), 365, 192, 52, p.glass);
    label(c, String(Math.floor((local + 2) / 4) % 10), 535, 192, 52, p.glass);
    if (fraction < .035 || fraction > .965) sparks(c, ballX, ballY, p, .5 + accent * .4);
  }
  function hover(c, p, local) {
    const x0 = 115, y0 = 135, size = 37, columns = 18, rows = 8;
    c.fillStyle = '#264a37'; c.fillRect(x0 - 14, y0 - 14, columns * size + 28, rows * size + 28);
    for (let i = 0; i < 19; i++) {
      if (i >= 7 && i <= 11) continue;
      const x = x0 + i * size;
      line(c, x, y0 - 17, x, y0 - 34, p.rim, 3);
      ellipse(c, x, y0 - 39, 13, 8, i % 2 ? '#4d8d5b' : '#397d53');
    }
    const step = local * (8.3 + bass * 1.7);
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const path = row % 2 ? row * columns + columns - 1 - col : row * columns + col;
      const garden = (row === 2 && col > 5 && col < 9) || (row === 5 && col > 12 && col < 16);
      const cut = path < step;
      c.fillStyle = garden ? '#67485a' : cut ? (row % 2 ? '#b0cb79' : '#9dc16d') : (row % 2 ? '#4f8b51' : '#417b4c');
      c.fillRect(x0 + col * size, y0 + row * size, size, size);
      if (garden) {
        ellipse(c, x0 + col * size + 18, y0 + row * size + 19, 20, 16, null, p.gold, 2);
        ellipse(c, x0 + col * size + 13, y0 + row * size + 13, 4, 4, p.pink);
        ellipse(c, x0 + col * size + 26, y0 + row * size + 25, 4, 4, p.gold);
      } else if (!cut) {
        for (let blade = 0; blade < 3; blade++) line(c, x0 + col * size + 8 + blade * 10, y0 + row * size + 25, x0 + col * size + 11 + blade * 10, y0 + row * size + 11, '#9dcc73', 2);
      } else {
        line(c, x0 + col * size + 2, y0 + row * size + 31, x0 + col * size + 34, y0 + row * size + 31, '#d6df91aa', 2);
      }
    }
    for (let i = 0; i < 5; i++) {
      const x = x0 + 35 + i * 137, y = i % 2 ? y0 + rows * size + 10 : y0 - 10;
      ellipse(c, x, y, 22, 12, '#305d46', '#a7c777', 2);
      ellipse(c, x - 7, y - 5, 10, 5, '#77ad69'); ellipse(c, x + 9, y + 2, 8, 5, '#5f9c61');
    }
    const index = Math.floor(step) % (columns * rows);
    const row = Math.floor(index / columns), col = row % 2 ? columns - 1 - index % columns : index % columns;
    const mx = x0 + (col + .5) * size, my = y0 + (row + .5) * size;
    c.save(); c.translate(mx, my); c.rotate(row % 2 ? Math.PI : 0);
    ellipse(c, 0, 8, 26, 13, '#142d2e70');
    poly(c, [[-24,-12], [18,-12], [24,10], [-24,10]], p.a, p.glass, 3);
    line(c, -15, -12, -17, -31, p.rim, 4); line(c, -17, -31, 9, -31, p.rim, 4);
    ellipse(c, 3, -1, 10 + accent * 3, 7, p.gold, p.ink, 2);
    ellipse(c, 0, -41, 7, 7, p.gold); ellipse(c, 0, -49, 7, 5, p.b);
    line(c, -2, -35, -11, -22, p.gold, 4); line(c, 2, -35, 12, -29, p.gold, 4);
    c.restore();
    for (let i = 0; i < 9; i++) {
      const a = time * 3.2 + i * 2.4;
      ellipse(c, mx - Math.cos(a) * (18 + i * 3), my + Math.sin(a) * (8 + i * 2), 2 + mid * 2, 2 + mid * 2, '#e0d990bb');
    }
    const nx = clamp(mx + 90 + Math.sin(time * 1.4) * 24, x0 + 25, x0 + columns * size - 25);
    const ny = clamp(my + 58 + Math.cos(time * 1.7) * 18, y0 + 23, y0 + rows * size - 22);
    ellipse(c, nx, ny + 9, 12, 5, '#102b2a88');
    ellipse(c, nx, ny - 4, 8, 10, p.gold); ellipse(c, nx, ny - 17, 7, 7, p.pink);
    line(c, nx - 9, ny - 6, nx - 16, ny - 10, p.gold, 3); line(c, nx + 9, ny - 6, nx + 15, ny - 13, p.gold, 3);
    line(c, nx - 5, ny + 5, nx - 9, ny + 17, p.gold, 3); line(c, nx + 5, ny + 5, nx + 9, ny + 17, p.gold, 3);
    const dx = nx - 36 + Math.sin(time * 5) * 9, dy = ny + 18 + Math.cos(time * 5) * 5;
    ellipse(c, dx, dy, 15, 8, p.ink, p.glass, 2); ellipse(c, dx + 11, dy - 6, 6, 6, p.ink, p.glass, 2);
    line(c, dx - 11, dy - 2, dx - 20, dy - 10, p.glass, 3);
    for (let leg = 0; leg < 4; leg++) line(c, dx - 8 + leg * 5, dy + 4, dx - 12 + leg * 5, dy + 10 + Math.sin(time * 9 + leg) * 3, p.glass, 2);
    c.fillStyle = p.ink; c.fillRect(120, 444, 125, 9);
    c.fillStyle = p.a; c.fillRect(122, 446, 121 * (.35 + Math.sin(local * .9) * .18 + bass * .25), 5);
    label(c, 'MOWER HEAT', 182, 439, 10, p.glass);
    label(c, `${Math.floor(clamp(step / (columns * rows), 0, 1) * 100)}% CUT`, 735, 452, 13, p.gold);
  }
  function gridrunner(c, p, local) {
    const left = 120, top = 132, width = 660, height = 291;
    c.fillStyle = '#100b25'; c.fillRect(left, top, width, height);
    for (let x = left; x <= left + width; x += 30) line(c, x, top, x, top + height, `${p.a}a0`, 1 + bass);
    for (let y = top; y <= top + height; y += 30) line(c, left, y, left + width, y, `${p.a}a0`, 1 + bass);
    const shipX = 450 + Math.sin(time * 2.1) * 240;
    poly(c, [[shipX, 387], [shipX - 20, 408], [shipX, 400], [shipX + 20, 408]], p.gold, p.glass, 2);
    ellipse(c, shipX, 397, 4 + accent * 4, 4 + accent * 4, p.glass);
    for (let i = 0; i < 5; i++) {
      const beamY = 385 - ((local * (123 + bass * 62) + i * 77) % 247);
      line(c, shipX + Math.sin(i + local) * 32, beamY, shipX + Math.sin(i + local) * 32, beamY - 21, p.gold, 3);
    }
    for (let i = 0; i < 15; i++) {
      const crawl = local * (25 + mid * 15) + i * 19;
      const ex = left + 40 + ((i * 39 + Math.sin(crawl * .045) * 74 + 540) % 580);
      const ey = top + 35 + ((crawl + Math.floor(i / 5) * 60) % 220);
      arcadePixel(c, ex, ey, 3, ['01110','11011','11111','10101'], i % 3 ? p.b : p.pink);
    }
    const sweeperY = top + 26 + ((local * 35) % 210);
    line(c, left + 12, sweeperY, left + width - 12, sweeperY, `${p.gold}88`, 3 + accent * 3);
    if (accent > .1) sparks(c, shipX, 352, p, accent * .5);
  }
  function forest(c, p, local) {
    const dusk = clamp(local / 16, 0, 1);
    const sky = c.createLinearGradient(0, 110, 0, 430);
    sky.addColorStop(0, '#332d5a'); sky.addColorStop(1, dusk > .5 ? '#182138' : '#705372');
    c.fillStyle = sky; c.fillRect(55, 113, 790, 333);
    ellipse(c, 705 - local * 3, 174 + local * 2, 34 + treble * 4, 34 + treble * 4, p.gold);
    for (let depth = 0; depth < 2; depth++) for (let i = 0; i < 9; i++) {
      const x = 70 + i * 95 + (depth ? 44 : 0) - (time * (depth ? 8 : 3) % 92);
      const ground = depth ? 404 : 363, height = depth ? 164 : 112;
      line(c, x, ground, x, ground - height, depth ? '#1d2831' : '#303447', depth ? 17 : 11);
      for (let j = 0; j < 4; j++) {
        const y = ground - height + 12 + j * 28;
        poly(c, [[x, y - 27], [x - 28 - depth * 10, y + 17], [x + 27 + depth * 10, y + 17]], depth ? '#233b38' : '#3a5050');
      }
    }
    c.fillStyle = '#25332c'; c.fillRect(55, 407, 790, 40);
    const ax = 222 + Math.sin(time * 1.2) * 48, ay = 388;
    ellipse(c, ax, ay - 44, 10, 11, p.gold); line(c, ax, ay - 32, ax, ay + 1, p.rim, 8);
    line(c, ax, ay - 19, ax + 20, ay - 35, p.rim, 5);
    line(c, ax - 2, ay, ax - 15, ay + 18, p.rim, 5); line(c, ax + 2, ay, ax + 15, ay + 18, p.rim, 5);
    c.beginPath(); c.arc(ax + 25, ay - 36, 20, -1.6, 1.6); c.strokeStyle = p.gold; c.lineWidth = 3; c.stroke();
    line(c, ax + 24, ay - 56, ax + 24, ay - 16, p.glass, 1);
    const volley = local % 3.2;
    const hitAge = volley - .95;
    const recoil = hitAge >= 0 && hitAge < .6 ? Math.sin(hitAge / .6 * Math.PI) * 12 : 0;
    const spiderX = 590 - Math.sin(time * 1.3) * 118, spiderY = 351 + Math.sin(time * 3) * 25 - recoil;
    ellipse(c, spiderX, spiderY, 33 + bass * 7, 21 + bass * 4, p.ink, p.pink, 3);
    ellipse(c, spiderX - 25, spiderY - 4, 14, 13, p.ink, p.pink, 2);
    for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
      const yy = spiderY - 12 + i * 9;
      line(c, spiderX + side * 17, yy, spiderX + side * (40 + i * 4), yy - 14 + i * 6, p.pink, 3);
      line(c, spiderX + side * (40 + i * 4), yy - 14 + i * 6, spiderX + side * (51 + i * 3), yy + 10, p.pink, 3);
    }
    ellipse(c, spiderX - 30, spiderY - 7, 3, 3, p.gold); ellipse(c, spiderX - 20, spiderY - 7, 3, 3, p.gold);
    const flight = clamp(volley / .95, 0, 1);
    const arrowX = ax + 35 + (spiderX - ax - 48) * flight;
    const arrowY = ay - 37 + (spiderY - ay + 29) * flight;
    if (volley < 1.55) {
      line(c, arrowX, arrowY, arrowX + 30, arrowY, p.gold, 2);
      poly(c, [[arrowX + 36, arrowY], [arrowX + 26, arrowY - 5], [arrowX + 26, arrowY + 5]], p.gold);
    }
    if (hitAge >= 0 && hitAge < .6) {
      const spray = Math.sin(hitAge / .6 * Math.PI);
      for (let stream = 0; stream < 4; stream++) {
        const a = -2.8 + stream * .48;
        const reach = (50 + stream * 12) * spray;
        line(c, spiderX - 21, spiderY - 7, spiderX - 21 + Math.cos(a) * reach, spiderY - 7 + Math.sin(a) * reach, stream % 2 ? '#b81739' : '#e3364d', 3 + bass * 2);
      }
      for (let i = 0; i < 24; i++) {
        const age = hitAge - i * .016;
        if (age < 0) continue;
        const angle = -3 + i * .12;
        const speed = 125 + i % 5 * 34 + bass * 55;
        const x = spiderX - 20 + Math.cos(angle) * speed * age;
        const y = spiderY - 7 + Math.sin(angle) * speed * age + 145 * age * age;
        ellipse(c, x, y, 3 + i % 3, 3 + i % 3, i % 4 ? '#c52643' : '#ee4c54');
      }
      ellipse(c, spiderX - 22, spiderY - 7, 5 + Math.sin(hitAge * 18) * 2, 4, '#cf2343');
    }
  }
  function treatment(c, p, form, scene, local) {
    if (form === 'afterdark') {
      c.save(); c.globalAlpha = .13 + accent * .13;
      poly(c, [[170,0], [275,0], [525,440], [60,440]], p.pink);
      poly(c, [[730,0], [625,0], [380,440], [850,440]], p.b);
      c.globalAlpha = .5 + accent * .25;
      for (let i = 0; i < 8; i++) {
        const x = 80 + i * 110 + Math.sin(time * 1.8 + i) * 22;
        ellipse(c, x, 456, 22 + bass * 15, 3, i % 2 ? p.pink : p.b);
      }
      c.restore();
    } else if (form === 'blueprint') {
      c.save(); c.globalAlpha = .2; c.strokeStyle = p.glass; c.lineWidth = 1;
      for (let x = 0; x <= 900; x += 30) line(c, x, 90, x, 500, p.glass, .6);
      for (let y = 90; y <= 500; y += 30) line(c, 0, y, 900, y, p.glass, .6);
      c.setLineDash([8, 7]);
      for (const x of scene === 'robots' ? [450 - 236 + Math.min(local / 3, 1) * 121, 450 + 236 - Math.min(local / 3, 1) * 121] : [450]) {
        ellipse(c, x, scene === 'robots' ? 236 : 267, scene === 'robots' ? 122 : 178, scene === 'robots' ? 153 : 182, null, p.glass, 2);
      }
      c.setLineDash([]); c.globalAlpha = .67;
      const figures = { robots: 'FIG. 01 / IMPACT', kerplunk: 'FIG. 02 / GRAVITY', maze: 'FIG. 03 / CHASE', invaders: 'FIG. 04 / DEFENCE', pong: 'FIG. 05 / RALLY', hover: 'FIG. 06 / PURSUIT', gridrunner: 'FIG. 07 / GRID', forest: 'FIG. 08 / DUSK' };
      label(c, figures[scene], 778, 464, 14, p.glass);
      c.restore();
    } else if (form === 'popart') {
      c.save(); c.globalAlpha = .32;
      for (let y = 105; y < 345; y += 18) for (let x = 32; x < 900; x += 18) {
        if (x > 175 && x < 725) continue;
        ellipse(c, x + (y % 36 ? 9 : 0), y, 3 + bass * 2, 3 + bass * 2, p.ink);
      }
      c.restore();
      const burst = scene === 'robots' ? local % 7.5 > 2.7 && local % 7.5 < 4.4 : accent > .2;
      if (burst) {
        c.save(); c.translate(scene === 'robots' ? 450 : 687, scene === 'robots' ? 130 : 180);
        c.rotate(-.13 + Math.sin(time * 6) * .04);
        const pts = [];
        for (let i = 0; i < 20; i++) {
          const a = i * Math.PI / 10, r = i % 2 ? 50 : 74 + accent * 13;
          pts.push([Math.cos(a) * r, Math.sin(a) * r]);
        }
        poly(c, pts, p.gold, p.ink, 5);
        const sounds = { robots: 'CLANK!', kerplunk: 'PLUNK!', maze: 'CHOMP!', invaders: 'ZAP!', pong: 'PING!', hover: 'MOW!', gridrunner: 'ZING!', forest: 'THWIP!' };
        label(c, sounds[scene], 0, 9, 21, p.ink);
        c.restore();
      }
    }
  }
  function draw(c, w, h, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'tabletop';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    const inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && inputBass > .62 && previousBass <= .62) { beats++; accent = 1; }
    previousBass = inputBass; accent = Math.max(0, accent - dt * 2.1);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const scenes = ['robots', 'kerplunk', 'maze', 'invaders', 'pong', 'hover', 'gridrunner', 'forest'];
    const scene = scenes[Math.floor(time / 16) % scenes.length];
    const local = time % 16, p = palettes[form];
    c.save(); c.scale(w / 900, h / 500);
    background(c, p, scene);
    let ghostsVulnerable = false, invadersDestroyed = 0;
    if (scene === 'robots') robots(c, p, local);
    else if (scene === 'kerplunk') kerplunk(c, p, local);
    else if (scene === 'maze') ghostsVulnerable = maze(c, p, local);
    else if (scene === 'invaders') invadersDestroyed = invaders(c, p, local);
    else if (scene === 'pong') pong(c, p, local);
    else if (scene === 'hover') hover(c, p, local);
    else if (scene === 'gridrunner') gridrunner(c, p, local);
    else forest(c, p, local);
    treatment(c, p, form, scene, local);
    const turn = Math.max(0, (local - 15.5) / .5);
    if (turn) { c.fillStyle = p.glass; c.globalAlpha = turn * .68; c.fillRect(0, 0, 900, 500); c.globalAlpha = 1; }
    c.restore();
    return { time, phase: scene, form, beats, ghostsVulnerable, invadersDestroyed };
  }
  return { recipes, draw, reset };
})();
