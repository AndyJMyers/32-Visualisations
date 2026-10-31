/* Retro-futurist courtship, where flawless compatibility meets unscripted agency. */
window.AndroidChicks = (() => {
  const TAU = Math.PI * 2;
  const chapters = [
    ['THE INTRODUCTION', 'Perfectly tuned. Impossibly attentive.'],
    ['DATE NIGHT', 'A little chemistry gets the whole city dancing.'],
    ['ALWAYS AGREEABLE', 'Every answer is yes. Something still feels missing.'],
    ['THE X FACTOR', 'A surprise is not a fault in the design.'],
  ];
  const recipes = [
    { name: 'Chrome Confidence', form: 'chrome', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Pink Compatibility', form: 'rose', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Ultraviolet Uncanny', form: 'ultraviolet', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Double-X Wildcard', form: 'wildcard', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    chrome: { sky: '#14273b', low: '#364c61', floor: '#1a232e', ink: '#111925', chrome: '#c2d4dc', glow: '#76d6ed', rose: '#eea9a9', cream: '#fff0cf', suit: '#c9d5d5', skin: '#f0ddcb', hair: '#d9c17b', grid: '#79abc322' },
    rose: { sky: '#4a233e', low: '#9a4763', floor: '#321e34', ink: '#291426', chrome: '#f4b9bb', glow: '#ff9fc3', rose: '#ffcf82', cream: '#fff0dc', suit: '#e8d4d3', skin: '#f3d9cf', hair: '#e1c58c', grid: '#ffd4e522' },
    ultraviolet: { sky: '#15163c', low: '#454178', floor: '#17172c', ink: '#101126', chrome: '#a8a9f5', glow: '#74f1f0', rose: '#e292d5', cream: '#e4e2ff', suit: '#bcbcdf', skin: '#edddd9', hair: '#c6c5bd', grid: '#c6c4ff24' },
    wildcard: { sky: '#30212a', low: '#725344', floor: '#201d25', ink: '#15141a', chrome: '#f1c27a', glow: '#ff6f61', rose: '#ffdc7c', cream: '#fff0cf', suit: '#e8c995', skin: '#f1ddc9', hair: '#c9835c', grid: '#f7d99020' },
  };
  let time = 0, last = null, energy = 0, phase = 0;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const smooth = n => { const p = clamp(n, 0, 1); return p * p * (3 - 2 * p); };
  function reset() { time = 0; last = null; energy = 0; phase = 0; }
  function disc(c, x, y, rx, ry, colour, stroke = null, width = 1) {
    c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, TAU);
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
    else { c.fillStyle = colour; c.fill(); }
  }
  function line(c, x1, y1, x2, y2, colour, width = 2) {
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = colour;
    c.lineWidth = width; c.lineCap = 'round'; c.stroke();
  }
  function polygon(c, points, colour) {
    c.beginPath(); c.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
    c.closePath(); c.fillStyle = colour; c.fill();
  }
  function label(c, value, x, y, size, colour, align = 'center') {
    c.font = `600 ${size}px system-ui, sans-serif`; c.textAlign = align; c.fillStyle = colour; c.fillText(value, x, y);
  }
  function backdrop(c, p, beat, form) {
    const sky = c.createLinearGradient(0, 0, 0, 540);
    sky.addColorStop(0, p.sky); sky.addColorStop(.68, p.low); sky.addColorStop(1, p.floor);
    c.fillStyle = sky; c.fillRect(0, 0, 960, 540);
    for (let x = 0; x < 960; x += 48) line(c, x, 0, x, 540, p.grid, 1);
    for (let y = 95; y < 540; y += 48) line(c, 0, y, 960, y, p.grid, 1);
    if (form === 'ultraviolet') {
      for (let i = 0; i < 54; i++) disc(c, (i * 173) % 960, (i * 71) % 360, 1 + i % 3 * .4, .7, `${p.cream}88`);
    }
    polygon(c, [[0,407],[106,365],[213,397],[343,347],[478,400],[603,360],[737,402],[846,355],[960,392],[960,540],[0,540]], `${p.ink}b8`);
    c.fillStyle = `${p.glow}${Math.round(12 + beat * 22).toString(16).padStart(2, '0')}`;
    c.fillRect(0, 398, 960, 142);
    if (form === 'chrome') {
      c.fillStyle = `${p.chrome}22`;
      for (let i = 0; i < 12; i++) c.fillRect(30 + i * 82, 399, 2, 141);
    }
  }
  function city(c, p, beat) {
    for (let i = 0; i < 12; i++) {
      const x = i * 83 - 15, h = 74 + (i * 41 % 104);
      c.fillStyle = `${p.ink}dd`; c.fillRect(x, 407 - h, 61, h);
      for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
        if ((i + row + col) % 3 === 0) continue;
        const rhythm = Math.sin(time * .53 + i * 1.71 + row * .93 + col * 2.07)
          + .28 * Math.sin(time * .19 + i + col * .6);
        const brightness = clamp((rhythm + .8 + beat * .55) / 2.1, 0, 1);
        const tint = (i + row + col) % 4 === 0 ? p.rose : p.glow;
        c.fillStyle = `${tint}${Math.round(24 + brightness * 190).toString(16).padStart(2, '0')}`;
        c.fillRect(x + 9 + col * 16, 417 - h + row * 21, 6, 9);
      }
    }
  }
  function android(c, x, y, scale, p, beat, mood = 0, pose = 0, dancing = false, interaction = {}) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    if (dancing) c.rotate(Math.sin(time * 2.2 + pose) * .12);
    if (interaction.bend) {
      c.translate(0, 47); c.rotate(interaction.bend); c.translate(0, -47);
    }
    const sway = Math.sin(time * (dancing ? 2.3 : 1.2) + pose) * (2 + beat * (dancing ? 7 : 4));
    const nod = mood > .5 ? .07 + Math.sin(time * 2.4 + pose) * .045 : Math.sin(time * .8 + pose) * .025;
    const styling = Math.abs(Math.round(pose)) % 5;
    const skin = [p.skin, '#f5e5d7', '#ead5c7', '#f4dfcd', '#efdbc9'][styling];
    const hair = [p.hair, '#c7b996', '#e7d5a5', '#b97d60', '#f1e7ce'][styling];
    c.shadowColor = p.glow; c.shadowBlur = 8 + beat * 14;
    disc(c, 0, -52 + sway * .2, 20, 25, p.chrome);
    c.shadowBlur = 0;
    polygon(c, [[-16,-59],[-22,-70],[-18,-81],[-8,-85],[5,-83],[17,-76],[22,-66],[19,-48],[16,-38],[11,-42],[14,-56],[10,-67],[2,-71],[-8,-67],[-12,-53],[-10,-39],[-16,-35],[-20,-45]], hair);
    c.save(); c.translate(0, -29 + sway * .2); c.rotate(nod); c.translate(0, 29 - sway * .2);
    disc(c, 0, -55 + sway * .2, 15.5, 19, skin);
    disc(c, 0, -55 + sway * .2, 15.5, 19, 'transparent', `${p.chrome}bb`, 1.5);
    polygon(c, [[-16,-59],[-21,-70],[-17,-80],[-7,-85],[6,-83],[17,-76],[21,-66],[17,-60],[12,-69],[4,-72],[-4,-68],[-11,-63]], hair);
    line(c, -15, -73, -7, -80, `${p.cream}bb`, 1.4); line(c, 0, -79, 9, -75, `${p.cream}bb`, 1.4);
    const eye = styling === 3 ? '#687c8b' : p.glow;
    disc(c, -6, -57 + sway * .2, 2.6, 2, eye);
    disc(c, 6, -57 + sway * .2, 2.6, 2, eye);
    for (const side of [-1, 1]) {
      line(c, side * 5, -60 + sway * .2, side * 8, -64 + sway * .2, hair, 1.5);
      disc(c, side * 10, -48 + sway * .2, 2.2, 1.3, `${p.rose}aa`);
    }
    if (interaction.kiss) {
      disc(c, 0, -45 + sway * .2, 3.2, 2.4, '#c85c78');
      disc(c, 0, -45 + sway * .2, 1.2, 2.1, p.cream);
    } else {
      c.beginPath(); c.moveTo(-6, -46 + sway * .2); c.quadraticCurveTo(0, -39 + sway * .2, 7, -47 + sway * .2);
      c.strokeStyle = '#a64d67'; c.lineWidth = 2.5; c.lineCap = 'round'; c.stroke();
    }
    c.restore();
    disc(c, 0, -25 + sway * .3, 14, 11, p.chrome);
    c.fillStyle = p.suit; c.beginPath(); c.moveTo(-13, -19); c.bezierCurveTo(-18, -27, -25, -25, -23, -17);
    c.bezierCurveTo(-22, -10, -15, -8, -12, -14); c.bezierCurveTo(-9, -6, -10, 2, -13, 8);
    c.bezierCurveTo(-19, 15, -24, 28, -21, 40); c.bezierCurveTo(-19, 51, -9, 54, 0, 52);
    c.bezierCurveTo(9, 54, 19, 51, 21, 40); c.bezierCurveTo(24, 28, 19, 15, 13, 8);
    c.bezierCurveTo(10, 2, 9, -6, 12, -14); c.bezierCurveTo(15, -8, 22, -10, 23, -17);
    c.bezierCurveTo(25, -25, 18, -27, 13, -19); c.bezierCurveTo(8, -32, 4, -34, 0, -32);
    c.bezierCurveTo(-4, -34, -8, -32, -13, -19); c.closePath(); c.fill();
    line(c, -10, -19, -7, -27, p.chrome, 1.6); line(c, 10, -19, 7, -27, p.chrome, 1.6);
    line(c, -10, 3, 10, 3, `${p.cream}bb`, 1);
    frock(c, p, styling);
    // Soft highlights through the fitted bodice, kept as fabric detail rather than anatomy.
    disc(c, -7, -19, 1.7, 1.2, `${p.cream}46`); disc(c, 7, -19, 1.7, 1.2, `${p.cream}46`);
    line(c, -14, -11, -9, -6, `${p.chrome}bb`, 1); line(c, 14, -11, 9, -6, `${p.chrome}bb`, 1);
    line(c, -17, 45 + sway, 17, 45 + sway, p.chrome, 2);
    const handLift = mood > .5 ? Math.sin(time * 1.3 + pose) * 3 : 0;
    if (dancing) {
      const rhythm = time * 2.6 + pose;
      line(c, -19, -8 + sway, -36, -28 + Math.sin(rhythm) * 10, p.chrome, 6);
      line(c, -36, -28 + Math.sin(rhythm) * 10, -43, -39 + Math.sin(rhythm + 1) * 7, p.chrome, 4.5);
      line(c, 19, -8 + sway, 35, -26 + Math.cos(rhythm) * 11, p.chrome, 6);
      line(c, 35, -26 + Math.cos(rhythm) * 11, 43, -37 + Math.cos(rhythm + 1) * 6, p.chrome, 4.5);
      disc(c, -43, -39 + Math.sin(rhythm + 1) * 7, 3.5, 3.5, p.rose);
      disc(c, 43, -37 + Math.cos(rhythm + 1) * 6, 3.5, 3.5, p.rose);
    } else {
      line(c, -19, -8 + sway, -36, 9 + Math.sin(time * 2 + pose) * 7, p.chrome, 7);
    }
    if (mood > .5 && !dancing) {
      line(c, 19, -8 + sway, 29, -28 + handLift, p.chrome, 7);
      line(c, 29, -28 + handLift, 21, -39 + handLift, p.chrome, 6);
      disc(c, 21, -39 + handLift, 4, 4, p.rose);
      line(c, 0, 6, 0, 13, p.rose, 2);
    } else if (!dancing) {
      line(c, 19, -8 + sway, 36, 8 + Math.cos(time * 1.8 + pose) * 7, p.chrome, 7);
    }
    for (const side of [-1, 1]) {
      const step = Math.sin(time * (dancing ? 4.5 : 1.4) + pose + (side < 0 ? Math.PI : 0));
      const thighX = side * 12 + step * side * (dancing ? 7 : 3);
      line(c, side * 11, 48 + sway, thighX, 64, p.ink, 10);
      line(c, side * 11, 49 + sway, thighX, 49 + sway, p.rose, 2);
      line(c, thighX - 2, 56, thighX + 1, 64, `${p.chrome}88`, 1.4);
      line(c, thighX, 64, side * 12 + step * (dancing ? 7 : 0), 78 - Math.max(0, step) * (dancing ? 6 : 0), p.chrome, 5.5);
      c.save(); c.translate(side * 13, 0); c.scale(side, 1);
      polygon(c, [[-6,77],[5,77],[13,81],[3,82],[-2,87],[-7,87],[-5,82],[-12,81]], p.rose);
      line(c, -7, 85, -7, 90, p.chrome, 2.3);
      line(c, -7, 90, 5, 82, p.ink, 2.6);
      c.restore();
    }
    line(c, -17, 77, -5, 77, p.glow, 3); line(c, 5, 77, 17, 77, p.glow, 3);
    if (interaction.kiss) label(c, '\u2665', 24, -70, 15, p.rose);
    c.restore();
  }
  function human(c, x, y, scale, p, beat, dance = 0, blush = 0) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    const lively = dance !== 0, beatTime = time * (lively ? 4 : 2.2) + dance;
    const step = Math.sin(beatTime) * (lively ? 8 + beat * 12 : 4 + beat * 9);
    if (lively) c.rotate(Math.sin(beatTime * .5) * .09);
    disc(c, Math.sin(beatTime) * 2, -57 + Math.max(0, Math.sin(beatTime)) * 3, 15, 16, p.ink);
    polygon(c, [[-10,-39],[10,-39],[19,step],[13,35],[-13,35],[-19,-step]], p.ink);
    if (lively) {
      line(c, -12, -29, -30, -49 + Math.sin(beatTime + 1) * 9, p.ink, 8);
      line(c, 12, -29, 30, -46 + Math.cos(beatTime + 1) * 9, p.ink, 8);
    } else {
      line(c, -12, -29, -31, -7 + step, p.ink, 8); line(c, 12, -29, 29, -8 - step, p.ink, 8);
    }
    line(c, -7, 34, -10 + step, 71 - Math.max(0, step) * .35, p.ink, 8);
    line(c, 7, 34, 10 - step, 71 - Math.max(0, -step) * .35, p.ink, 8);
    if (blush > 0) {
      const flush = '#ff637b';
      c.save(); c.globalAlpha = clamp(blush, 0, 1) * .52;
      disc(c, 0, -54, 14, 15, flush);
      disc(c, 0, -4, 15, 29, flush);
      disc(c, 0, 43, 12, 25, flush);
      c.restore();
      c.save(); c.globalAlpha = clamp(blush, 0, 1) * .9;
      disc(c, -7, -55, 3.2, 2, flush); disc(c, 7, -55, 3.2, 2, flush);
      c.restore();
    }
    c.restore();
  }
  function xMark(c, x, y, size, colour, width = 5) {
    line(c, x-size, y-size, x+size, y+size, colour, width);
    line(c, x+size, y-size, x-size, y+size, colour, width);
  }
  function fitCheck(c, p, beat) {
    const settle = smooth(((time % 10) - 1.2) / 5.8);
    label(c, 'COMPATIBILITY', 269, 94, 11, p.chrome, 'left');
    label(c, 'OPTIMAL', 694, 105, 17, p.cream, 'right');
    const channels = ['XX', 'XY', 'Si'];
    for (let i = 0; i < 3; i++) {
      const x = 405 + i * 47, y = 99;
      c.beginPath(); c.arc(x, y, 15, Math.PI * 1.13, Math.PI * 1.87);
      c.strokeStyle = `${p.chrome}aa`; c.lineWidth = 2.3; c.stroke();
      for (let tick = 0; tick < 5; tick++) {
        const a = Math.PI * 1.15 + tick * Math.PI * .175;
        line(c, x + Math.cos(a) * 11, y + Math.sin(a) * 11,
          x + Math.cos(a) * 15, y + Math.sin(a) * 15, p.chrome, 1.2);
      }
      const sweep = Math.sin(time * (3.5 + i * .2) + i * 2.1) * (1.18 * (1 - settle) + .018);
      const tremor = Math.sin(time * 43 + i * 3) * (.2 * (1 - settle) + beat * .028);
      const angle = -Math.PI / 2 + sweep + tremor;
      line(c, x, y, x + Math.cos(angle) * 11, y + Math.sin(angle) * 11, p.glow, 2.6);
      disc(c, x, y, 2.5, 2.5, p.cream);
      label(c, `${channels[i]} ${settle > .88 ? '✓' : '·'}`, x, 125, 8, settle > .88 ? p.glow : p.chrome);
    }
  }
  function frock(c, p, style) {
    const fabric = [p.cream, p.rose, '#b8c9cf', '#b83c52', '#d0ad63'][style];
    const trim = [p.rose, p.cream, p.glow, '#f6d783', '#f8e5b6'][style];
    if (style === 0) {
      polygon(c, [[-12,7],[12,7],[17,18],[26,46],[-26,46],[-17,18]], fabric);
      polygon(c, [[-12,-26],[-5,-29],[0,-18],[5,-29],[12,-26],[8,-10],[-8,-10]], p.chrome);
      line(c, -18, 12, 18, 12, trim, 2);
      for (let i = 0; i < 3; i++) disc(c, 0, -2 + i * 7, 1.5, 1.5, trim);
    } else if (style === 1) {
      polygon(c, [[-12,9],[12,9],[16,18],[19,44],[-19,44],[-16,18]], fabric);
      line(c, 0, -25, 0, 37, trim, 1.5); line(c, -14, 15, 14, 15, `${trim}aa`, 1.5);
    } else if (style === 2) {
      polygon(c, [[-12,8],[12,8],[19,20],[22,47],[-22,47],[-19,20]], fabric);
      polygon(c, [[-12,-26],[-5,-30],[0,-17],[5,-30],[12,-26],[8,-10],[-8,-10]], trim);
      line(c, -18, 17, 18, 17, `${p.chrome}bb`, 1.5);
    } else if (style === 3) {
      polygon(c, [[-12,8],[12,8],[18,18],[24,45],[-24,45],[-18,18]], fabric);
      for (const [x, y, r] of [[-15,20,2.4],[-6,27,2],[7,20,2.6],[15,32,2],[-10,39,1.8],[3,41,2.3],[1,14,1.8]]) {
        disc(c, x, y, r, r * .7, `${p.ink}bb`); disc(c, x + .6, y - .5, r * .4, r * .3, trim);
      }
      line(c, -18, 15, 18, 15, trim, 2);
    } else {
      polygon(c, [[-12,7],[12,7],[17,19],[20,43],[-20,43],[-17,19]], fabric);
      polygon(c, [[-12,-25],[-5,-28],[0,-17],[5,-28],[12,-25],[8,-10],[-8,-10]], `${p.ink}cc`);
      line(c, -17, 10, 17, 10, trim, 2); disc(c, 0, -4, 2.2, 2.2, trim);
    }
  }
  function showroom(c, p, beat) {
    city(c, p, beat);
    c.fillStyle = `${p.ink}80`; c.fillRect(114, 126, 732, 285);
    c.strokeStyle = p.chrome; c.lineWidth = 3; c.strokeRect(114, 126, 732, 285);
    for (let i = 0; i < 5; i++) {
      const x = 212 + i * 134;
      line(c, x, 148, x, 381, `${p.chrome}55`, 1);
      const heat = clamp(beat * .72 + .14 + Math.sin(time * 1.7 + i * 1.4) * .12, 0, 1);
      const dial = `rgb(${Math.round(45 + heat * 205)},${Math.round(185 - heat * 150)},${Math.round(255 - heat * 190)})`;
      const radius = 38 + beat * 5 + Math.sin(time * 2.4 + i) * 1.8;
      disc(c, x, 192, radius, 42, `${p.glow}12`, dial, 2.4);
      c.beginPath(); c.arc(x, 192, radius - 5, time * (1.15 + beat * 2.6) + i, time * (1.15 + beat * 2.6) + i + Math.PI * (.3 + beat * .34));
      c.strokeStyle = dial; c.lineWidth = 3 + beat * 2; c.lineCap = 'round'; c.stroke();
      const needle = time * (1.35 + beat * 3.2) + i * 1.8;
      line(c, x, 192, x + Math.cos(needle) * (radius - 7), 192 + Math.sin(needle) * 29, dial, 2.5);
      disc(c, x, 192, 3 + beat * 2, 3 + beat * 2, dial);
      // The showroom is a runway, not a row of mannequins: each model keeps
      // her own phase so the choreography feels loose rather than mechanical.
      android(c, x, 307, .67, p, beat, i === 4 ? .2 : 0, i * 1.7, true);
      for (let j = 0; j < 3; j++) disc(c, x - 15 + j * 15, 378, 3, 3, j === 1 ? p.rose : p.glow);
    }
    label(c, 'DIOR TO AB FAB, DAHLING!', 480, 477, 15, p.cream);
    c.fillStyle = `${p.ink}e8`; c.fillRect(255, 72, 450, 57);
    fitCheck(c, p, beat);
    disc(c, 480, 443, 250, 15, 'transparent', `${p.glow}64`, 2);
  }
  function date(c, p, beat) {
    city(c, p, beat);
    disc(c, 783, 102, 35, 35, p.cream);
    for (let i = 0; i < 9; i++) {
      const x = 91 + i * 96, h = Math.max(4, 16 + Math.sin(time * 3 + i * 1.8) * (10 + beat * 20));
      c.fillStyle = `${p.glow}77`; c.fillRect(x, 449 - h, 4, h);
    }
    const orbit = time * .85;
    const herX = 441 + Math.cos(orbit) * 42, herY = 318 + Math.sin(orbit * 2) * 9;
    const partnerX = 562 - Math.cos(orbit) * 35, partnerY = 322 - Math.sin(orbit * 2) * 8;
    android(c, herX, herY, 1.05, p, beat, .12, 0, true);
    human(c, partnerX, partnerY, 1.05, p, beat, 1);
    line(c, herX + 39, herY - 29, partnerX - 31, partnerY - 42, p.glow, 2);
    for (let i = 0; i < 12; i++) {
      const a = i * TAU / 12 + time * .12;
      disc(c, 480 + Math.cos(a) * 70, 278 + Math.sin(a) * 38, 2 + beat * 2, 2 + beat * 2, i % 2 ? p.rose : p.glow);
    }
    c.save(); c.translate(738, 384); c.rotate(-.03);
    c.fillStyle = p.ink; c.fillRect(-73, -17, 146, 28); c.fillRect(-45, -34, 87, 25);
    disc(c, -46, 13, 16, 16, p.ink); disc(c, 47, 13, 16, 16, p.ink);
    disc(c, -46, 13, 6, 6, p.chrome); disc(c, 47, 13, 6, 6, p.chrome);
    c.restore();
  }
  function agreeable(c, p, beat) {
    for (let i = 0; i < 7; i++) {
      const x = 89 + i * 130, y = 230 + Math.sin(i * 1.8) * 29;
      android(c, x, 340, .7 + (i % 3) * .08, p, beat, .8, i);
      c.fillStyle = `${p.ink}e0`; c.fillRect(x - 34, y - 36, 72, 28);
      label(c, ['YES!', 'OF COURSE', 'ANYTHING'][i % 3], x, y - 17, 9, p.cream);
      for (let k = 0; k < 4; k++) line(c, x - 22 + k * 15, y + 3, x - 22 + k * 15, y + 13, k < 3 ? p.glow : `${p.chrome}66`, 3);
    }
    c.fillStyle = `${p.ink}a8`; c.fillRect(245, 78, 470, 50);
    label(c, 'EVERY PREFERENCE MATCHED', 480, 110, 18, p.cream);
    disc(c, 480, 440, 130 + Math.sin(time * 1.8) * 7, 17, 'transparent', `${p.rose}aa`, 2);
    disc(c, 480, 440, 190, 22, 'transparent', `${p.glow}60`, 2);
  }
  function wildcard(c, p, beat) {
    city(c, p, beat);
    const orbit = 146 + Math.sin(time * .65) * 9;
    disc(c, 480, 275, orbit, orbit * .45, 'transparent', `${p.chrome}82`, 2);
    disc(c, 480, 275, orbit * .74, orbit * .34, 'transparent', `${p.glow}62`, 1);
    xMark(c, 480 - 64, 235, 35 + beat * 5, p.glow, 6);
    xMark(c, 480 + 64, 235, 35 + beat * 5, p.rose, 6);
    const local = time % 10;
    const bendIn = smooth((local - 2.25) / .35), bendOut = smooth((local - 3.55) / .4);
    const bend = (bendIn - bendOut) * .48;
    const slap = Math.exp(-Math.pow((local - 3.35) / .12, 2));
    const kiss = local > 4.15 && local < 5.5;
    const whisper = smooth((local - 6) / .45) * (1 - smooth((local - 7.75) / .45));
    const interaction = Math.max(slap * .48, smooth((local - 3.35) / .3) * (1 - smooth((local - 5.2) / .35)) * .3, whisper * .9);
    const movingIn = smooth((local - 2) / .45), movingOut = smooth((local - 7.8) / .45);
    const closeness = movingIn * (1 - movingOut);
    const dance = Math.sin(time * 1.8) * 24 * (1 - closeness);
    const herX = 403 + dance + closeness * 45, partnerX = 563 - dance * .5 - closeness * 45;
    android(c, herX, 324, 1.15, p, beat, .75, 1, true, { bend, kiss });
    human(c, partnerX, 330, 1.05, p, beat, 1, interaction);
    if (slap > .03) {
      c.save(); c.globalAlpha = slap * .72;
      c.shadowColor = '#ff526d'; c.shadowBlur = 24;
      disc(c, herX + 17, 360, 11 + slap * 3, 9 + slap * 2, '#ff637b');
      line(c, partnerX - 32, 302, herX + 17, 360, p.cream, 4);
      disc(c, herX + 17, 360, 4, 4, p.cream);
      for (let i = 0; i < 3; i++) {
        const a = -1.8 + i * .8;
        line(c, herX + 17 + Math.cos(a) * 12, 360 + Math.sin(a) * 9,
          herX + 17 + Math.cos(a) * 18, 360 + Math.sin(a) * 14, '#ff9aaa', 2);
      }
      c.restore();
    }
    if (kiss) {
      const lift = Math.sin((local - 4.15) * Math.PI / 1.35);
      label(c, '\u2665', herX + 28, 239 - lift * 12, 18, p.rose);
    }
    if (whisper > .05) {
      for (let i = 0; i < 3; i++) {
        const x = herX + 40 + i * 8, y = 264 + Math.sin(time * 7 + i) * 3;
        c.beginPath(); c.arc(x, y, 4 + i, -.9, .9);
        c.strokeStyle = `${p.cream}${Math.round(whisper * 220).toString(16).padStart(2, '0')}`;
        c.lineWidth = 1.7; c.stroke();
      }
    }
    for (let i = 0; i < 28; i++) {
      const a = i * TAU / 28 + time * (.12 + beat * .14), r = 95 + (i % 5) * 18;
      disc(c, 480 + Math.cos(a) * r, 256 + Math.sin(a) * r * .54, 2 + (i % 3), 2 + (i % 3), i % 2 ? p.rose : p.glow);
    }
    label(c, 'SOMEONE CHANGED THE SCRIPT', 480, 451, 17, p.cream);
  }
  const scenes = [showroom, date, agreeable, wildcard];
  function draw(c, width, height, now, options = {}) {
    const animate = options.animate !== false;
    const elapsed = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    if (animate) time += elapsed * clamp(Number(options.speed) || 1, .2, 3);
    const beat = clamp((options.bass || 0) * .62 + (options.mid || 0) * .26 + (options.treble || 0) * .3, 0, 1);
    energy += (beat - energy) * (1 - Math.exp(-elapsed * 4.5));
    phase += elapsed * (.7 + energy * 2.8);
    const index = Math.floor(time / 10) % chapters.length, local = time % 10;
    const form = palettes[options.form] ? options.form : 'chrome', p = palettes[form];
    c.save(); c.scale(width / 960, height / 540);
    backdrop(c, p, energy, form);
    scenes[index](c, p, energy);
    c.fillStyle = `${p.ink}e8`; c.fillRect(0, 0, 960, 67);
    label(c, 'ANDROID CHICKS', 24, 43, 25, p.rose, 'left');
    label(c, chapters[index][0], 934, 42, 20, p.cream, 'right');
    c.fillStyle = `${p.ink}e8`; c.fillRect(0, 489, 960, 51);
    label(c, chapters[index][1], 24, 520, 17, p.cream, 'left');
    for (let i = 0; i < 4; i++) c.fillRect(820 + i * 31, 511, 20, 6);
    for (let i = 0; i < 4; i++) {
      c.fillStyle = i === index ? p.glow : `${p.chrome}88`;
      c.fillRect(820 + i * 31, 511, 20, 6);
    }
    c.restore();
    return { chapter: chapters[index][0], index, form, beat, energy, phase, time, local };
  }
  return { chapters, recipes, scenes, draw, reset };
})();
