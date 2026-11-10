window.MonkeyBusiness = (() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const forms = ['golden', 'moon', 'fruit', 'disco'];
  const names = ['Jungle Confidential', 'Moonlight Mischief', 'Fruitful Disorder', 'The Primate Club'];
  const recipes = forms.map((form, i) => ({ name: names[i], form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 }));
  const palettes = {
    golden: ['#102d2b', '#d9a555', '#1d5547', '#40866a', '#e7c273', '#ffa250'],
    moon: ['#090e29', '#6f99c6', '#192342', '#34486d', '#ccdcfa', '#b1a4ff'],
    fruit: ['#29122f', '#f87981', '#49365b', '#857347', '#fff0ac', '#ff5474'],
    disco: ['#10091f', '#b42c93', '#22224c', '#185b70', '#8cffe1', '#ff4aaf'],
  };
  let time = 0, last = null, drive = 0, accent = 0, previousBass = 0;
  const noise = n => { const v = Math.sin(n * 127.1 + 41.3) * 43758.5; return v - Math.floor(v); };
  function reset() { time = drive = accent = previousBass = 0; last = null; }
  function oval(c, x, y, rx, ry, colour) {
    c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, TAU); c.fillStyle = colour; c.fill();
  }
  function line(c, points, colour, width) {
    c.beginPath(); c.moveTo(...points[0]); points.slice(1).forEach(p => c.lineTo(...p));
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
  }
  function label(c, value, x, y, size, colour, align = 'left') {
    c.font = `600 ${size}px sans-serif`; c.fillStyle = colour; c.textAlign = align; c.fillText(value, x, y);
  }
  function leaf(c, x, y, size, angle, colour) {
    c.save(); c.translate(x, y); c.rotate(angle); c.beginPath(); c.moveTo(0, 0);
    c.quadraticCurveTo(size, -size * .7, size * 1.9, 0); c.quadraticCurveTo(size, size * .7, 0, 0);
    c.fillStyle = colour; c.fill(); c.restore();
  }
  function jungle(c, p, form) {
    const sky = c.createLinearGradient(0, 0, 0, 600); sky.addColorStop(0, p[0]); sky.addColorStop(1, p[1]);
    c.fillStyle = sky; c.fillRect(0, 0, 1000, 600);
    oval(c, 780, 125, form === 'moon' ? 49 : 70, form === 'moon' ? 49 : 70, `${p[4]}55`);
    if (form === 'moon') oval(c, 800, 110, 43, 43, p[0]);
    for (let layer = 0; layer < 3; layer++) for (let i = -1; i < 9; i++) {
      const x = i * 150 + layer * 37 + Math.sin(time * .08 + i) * (3 + layer * 2);
      line(c, [[x, 650], [x + 15, 230], [x - 35, -30]], layer === 0 ? `${p[2]}80` : p[2], 18 + layer * 13);
      for (let b = 0; b < 3; b++) {
        const y = 80 + b * 115 + noise(i + layer * 11) * 70;
        line(c, [[x, y + 65], [x + 65, y], [x + 110, y - 8]], p[2], 9 + layer * 3);
        leaf(c, x + 35, y, 65, -.4 + Math.sin(time * .7 + i) * .07, layer === 2 ? p[3] : `${p[3]}80`);
      }
    }
    c.save(); c.globalAlpha = .04 + drive * .08; c.fillStyle = p[4];
    for (let i = 0; i < 6; i++) {
      const x = i * 210 + Math.sin(time * .15) * 25;
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 30, 0); c.lineTo(x + 220, 600); c.lineTo(x + 100, 600); c.fill();
    } c.restore();
    for (let i = 0; i < 22; i++) {
      const x = noise(i) * 1000 + Math.sin(time * .6 + i) * 12;
      const y = (noise(i + 32) * 600 + time * (form === 'moon' ? -6 : 9) + 60000) % 600;
      oval(c, x, y, 1 + accent * 3, 1.5, `${p[4]}a0`);
    }
  }
  function branch(c, p, y) {
    line(c, [[-40, y + 45], [250, y - 20], [550, y + 15], [1040, y - 35]], '#362d32', 31);
    line(c, [[-40, y + 37], [250, y - 27], [550, y + 7], [1040, y - 43]], `${p[3]}a0`, 6);
  }
  function primate(c, species, x, y, scale, phase, pose, facing = 1, anchor = null) {
    const orang = species === 'orang', monkey = species === 'monkey', gorilla = species === 'gorilla', bonobo = species === 'bonobo';
    const fur = orang ? '#bb5d32' : monkey ? '#a68c65' : gorilla ? '#252e36' : '#262b36';
    const light = orang ? '#ef9853' : monkey ? '#e1c19a' : gorilla ? '#aab2b5' : '#747983';
    const skin = orang ? '#65423f' : monkey ? '#f1c5a2' : gorilla || bonobo ? '#53515c' : '#bd9e89';
    const pace = orang ? .26 : gorilla ? .42 : 1;
    const swing = Math.sin(time * (orang ? .38 : (1.4 + drive * 1.2) * pace) + phase);
    const beat = Math.sin(time * 4.4 * pace + phase) * (.15 + drive * (orang ? .12 : .65)) + accent * (orang ? .04 : .5);
    c.save(); c.translate(x, y); c.scale(scale * facing, scale); c.rotate(pose === 'swing' ? swing * .22 : swing * .025);
    if (monkey) {
      c.beginPath(); c.moveTo(13, 24); c.bezierCurveTo(90, 45, 82 + swing * 12, -90, 40, -65);
      c.bezierCurveTo(5, -48, 48, -20, 53, -47); c.strokeStyle = fur; c.lineWidth = 8; c.stroke();
    }
    const arm = orang ? 86 : monkey ? 53 : 63;
    const hands = pose === 'swing' ? [[-31, -arm - 33], [30, -arm - 15 + swing * (orang ? 3 : 15)]]
      : pose === 'drum' ? [[-42, 65 - Math.max(0, beat) * 38], [45, 65 - Math.max(0, -beat) * 38]]
        : pose === 'fling' ? [[-37, 48], [phase < 3 ? 24 : phase < 4 ? 24 + (phase - 3) * 22 : 46 - Math.min(1, (phase - 4) * 4) * 100, phase < 3 ? 72 : phase < 4 ? 72 - (phase - 3) * 100 : -28]]
        : pose === 'groom' ? [[38, -12 + beat * 5], [47, -26 + swing * 4]]
          : [[-45 - swing * 12, 35 + arm * .35], [42 + swing * 14, 35 + arm * .3]];
    if (anchor) {
      const angle = swing * .22, dx = (anchor[0] - x) / (scale * facing), dy = (anchor[1] - y) / scale;
      const local = [dx * Math.cos(angle) + dy * Math.sin(angle), -dx * Math.sin(angle) + dy * Math.cos(angle)];
      for (const hand of hands) line(c, [local, hand], '#638878', 3 / scale);
    }
    for (let side = 0; side < 2; side++) {
      const sign = side ? 1 : -1, hand = hands[side];
      line(c, [[sign * (gorilla ? 32 : 18), -7], [sign * (gorilla ? 46 : 32), (hand[1] - 7) * .5], hand], fur, gorilla ? 28 : orang ? 19 : 14);
      oval(c, ...hand, 9, 7, skin);
      line(c, [[sign * 13, 35], [sign * 29, 57 + swing * sign * 6], [sign * 34, 76]], fur, 15);
      oval(c, sign * 36, 77, 15, 7, skin);
    }
    oval(c, 0, 15, gorilla ? 44 : orang ? 32 : 25, gorilla ? 48 : orang ? 43 : 35, fur);
    oval(c, -3, 18, gorilla ? 30 : 15, gorilla ? 31 : 25, light);
    if (gorilla) { oval(c, 0, -43, 26, 35, fur); line(c, [[-23, -53], [0, -58], [23, -53]], '#151d24', 9); }
    if (orang) {
      for (let i = 0; i < 13; i++) line(c, [[-26 + i * 4, 0], [-31 + i * 5 + swing * 3, 56 + noise(i) * 17]], fur, 3);
      oval(c, -24, -34, 16, 26, fur); oval(c, 24, -34, 16, 26, fur);
    } else { oval(c, -24, -37, 10, 13, skin); oval(c, 24, -37, 10, 13, skin); }
    oval(c, 0, -37, 27, 30, fur); oval(c, -10, -41, 13, 15, skin); oval(c, 10, -41, 13, 15, skin); oval(c, 0, -23, 19, 14, skin);
    const blink = Math.sin(time * 1.2 + phase * 7) > .985 ? .6 : orang ? 1.8 : 3.2;
    for (const sign of [-1, 1]) {
      oval(c, sign * 10, -43, 4.2, blink + .6, '#fff2cf'); oval(c, sign * 10 + swing, -43, 2, blink, '#171922');
      line(c, [[sign * 5, -53], [sign * 16, -55 + beat * 2]], fur, 3);
    }
    oval(c, 0, -29, 6, 3, '#342e31'); c.beginPath(); c.arc(0, -24, 10, .22, Math.PI - .22);
    c.strokeStyle = '#382a30'; c.lineWidth = 2; c.stroke(); c.restore();
  }
  function mischief(c, p) {
    const t = time % 14, x = 885, y = 370 + (t < 3 ? Math.sin(Math.min(1, t) * Math.PI / 2) * 16 : 0);
    primate(c, 'monkey', x, y, .8, t, t < 5 ? 'fling' : 'sway');
    // Drop, scoop, wind-up, flight and a brief foreground splat form one continuous gag.
    let px, py, radius = 7;
    if (t >= 1 && t < 3) { px = x + 19; py = y + 51 + Math.min(1, t - 1) * 11; }
    else if (t >= 3 && t < 4) { px = x + (24 + (t - 3) * 22) * .8; py = y + (72 - (t - 3) * 100) * .8; }
    else if (t >= 4 && t < 5.2) {
      const u = (t - 4) / 1.2; px = x + 37 - u * 710; py = y - 22 - Math.sin(u * Math.PI) * 240 + u * 90; radius += u * 10;
    }
    if (px !== undefined) {
      oval(c, px, py, radius, radius * .75, '#72502d'); oval(c, px - radius * .2, py - radius * .35, radius * .55, radius * .5, '#977044');
    }
    if (t >= 5.2 && t < 7) {
      c.save(); c.globalAlpha = Math.min(1, (7 - t) / .8);
      for (let i = 0; i < 11; i++) {
        const a = i * TAU / 11, r = i % 3 ? 23 : 3;
        oval(c, 212 + Math.cos(a) * r, 438 + Math.sin(a) * r * .6, 9 + i % 3 * 3, 7, '#72502d');
      } c.restore();
    }
    if (t > 7 && t < 9) label(c, 'WHO, ME?', 885, 310, 12, p[4], 'center');
    return t < 1 ? 'prepare' : t < 3 ? 'drop' : t < 4 ? 'scoop' : t < 5.2 ? 'flight' : t < 7 ? 'splat' : 'innocent';
  }
  function clearing(c, p, form) {
    oval(c, 500, 539, 520, 75, `${p[0]}b0`);
    // Silverbacks hold the clearing with slow weight shifts, not the chimps' jitter.
    for (let i = 0; i < 2; i++) {
      const x = 100 + i * 690, y = 430 + Math.sin(time * .32 + i) * 2;
      oval(c, x, 552, 78, 12, '#00000040');
      primate(c, 'gorilla', x, y, i ? 1.18 : 1.48, i + 11, 'sway', i ? -1 : 1);
    }
    // Non-graphic courtship theatre: a rocking leafy hideaway, glances and kisses.
    const cuddle = Math.sin(time * .8) > -.35, rock = cuddle ? Math.sin(time * 2.6) * (2 + drive * 3) : 0;
    primate(c, 'bonobo', 430 + rock, 452, .72, 16, cuddle ? 'groom' : 'sway');
    primate(c, 'bonobo', 478 - rock, 450, .76, 19, cuddle ? 'groom' : 'sway', -1);
    for (let i = 0; i < 5; i++) leaf(c, 380 + i * 26, 535, 39, -1.8 + i * .12 + rock * .015, p[3]);
    if (cuddle) for (let i = 0; i < 3; i++) {
      const u = (time * .23 + i / 3) % 1;
      c.save(); c.globalAlpha = Math.sin(u * Math.PI); label(c, '\u2665', 450 + Math.sin(i + time) * 16, 398 - u * 72, 14 + i * 2, form === 'moon' ? p[4] : p[5], 'center'); c.restore();
    }
  }
  function bananaBroadcast(c, p, form) {
    const active = form === 'disco' || form === 'fruit';
    const phase = time % 54;
    if (!active && phase > 13) return false;
    c.save(); c.translate(28, 115);
    c.fillStyle = '#d79a3e'; c.fillRect(0, 0, 345, 164);
    c.fillStyle = '#392447'; c.fillRect(8, 8, 329, 148);
    for (let i = 0; i < 9; i++) {
      c.save(); c.translate(168, 82); c.rotate(i * TAU / 9 + Math.sin(time * .2) * .1);
      c.fillStyle = i % 2 ? '#e67c4d40' : '#db68be40'; c.beginPath(); c.moveTo(0, 0); c.lineTo(250, -45); c.lineTo(250, 45); c.fill(); c.restore();
    }
    label(c, 'THE BANANA BREAK', 172, 28, 17, '#ffe38c', 'center');
    const colours = ['#b75b39', '#bfa5d8', '#e7b34f', '#dca34f'];
    for (let i = 0; i < 4; i++) {
      const x = 48 + i * 82, y = 88 + Math.sin(time * 3 + i) * (3 + drive * 8);
      c.fillStyle = ['#ee634f', '#59bdb0', '#b865c9', '#6b95d9'][i]; c.fillRect(x - 22, y + 17, 44, 29);
      if (i === 2) for (let petal = 0; petal < 10; petal++) {
        const a = petal * TAU / 10; oval(c, x + Math.cos(a) * 24, y + Math.sin(a) * 25, 10, 12, '#9e4d35');
      }
      if (i === 0 || i === 1) {
        oval(c, x - 25, y + 6, i ? 18 : 8, i ? 22 : 29, colours[i]);
        oval(c, x + 25, y + 6, i ? 18 : 8, i ? 22 : 29, colours[i]);
      }
      oval(c, x, y, 23, 27, colours[i]);
      oval(c, x, y + 12, 18, 12, '#f3d3aa');
      if (i === 1) line(c, [[x, y + 7], [x + Math.sin(time * 2) * 8, y + 33], [x + 13, y + 31]], colours[i], 10);
      if (i === 3) oval(c, x, y - 3, 18, 17, '#67505a');
      for (const side of [-1, 1]) { oval(c, x + side * 8, y - 5, 5, 6, '#fff3d4'); oval(c, x + side * 8, y - 4, 2, 3, '#302737'); }
      c.fillStyle = '#f84553'; c.fillRect(x - 22, y - 26, 44, 7); oval(c, x, y - 29, 19, 10, '#f84553');
      line(c, [[x - 13, y + 27], [x - 27, y + 38 + Math.sin(time * 4 + i) * drive * 9]], '#f3d3aa', 6);
      oval(c, x + 10, y + 42, 20, 9, '#e4bb57');
    }
    for (let i = 0; i < 18; i++) oval(c, 13 + i * 18, 157, 2 + accent * 2, 2, i % 2 ? p[4] : p[5]);
    label(c, 'LIVE FROM THE TREETOPS', 172, 148, 9, '#ffe5b9', 'center');
    c.restore(); return true;
  }
  function hazyVisitors(c, p) {
    const phase = time % 48;
    if (phase < 12 || phase > 31) return false;
    const travel = phase < 16 ? (phase - 12) / 4 : phase > 27 ? 1 + (phase - 27) / 4 : 1;
    const x = travel <= 1 ? 1100 - (1 - (1 - travel) ** 2) * 520 : 580 - (travel - 1) ** 2 * 1100;
    c.save(); c.translate(x, 115 + Math.sin(time * 3) * (1 + drive * 3)); c.rotate(Math.sin(time * 1.7) * .007);
    c.fillStyle = '#673d64'; c.fillRect(0, 0, 300, 94);
    c.fillStyle = '#c19b70'; c.fillRect(8, -22, 278, 38);
    c.fillStyle = '#252f3d'; c.fillRect(19, -13, 120, 52); c.fillRect(150, -13, 125, 52);
    // An original pair of sleepy road-comedy caricatures, rather than sampled footage.
    for (let i = 0; i < 2; i++) {
      const px = 65 + i * 141, py = 9 + Math.sin(time * (i ? .4 : .7)) * 2;
      oval(c, px, py - 5, 25, 26, '#2c242e'); oval(c, px, py, 16, 21, '#c98b66');
      if (i) { oval(c, px, py + 16, 18, 15, '#423038'); oval(c, px, py - 21, 27, 10, '#d2ad73'); }
      else { line(c, [[px - 23, py - 11], [px + 23, py - 11]], '#de5046', 7); line(c, [[px - 9, py + 8], [px, py + 4], [px + 10, py + 8]], '#30232d', 5); }
      for (const side of [-1, 1]) line(c, [[px + side * 4, py - 2], [px + side * 11, py - 1]], '#32252e', 2);
    }
    line(c, [[83, 24], [94, 19]], '#e7d2a1', 3);
    for (let i = 0; i < 12; i++) {
      const u = (time * .14 + i / 12) % 1;
      c.save(); c.globalAlpha = Math.sin(u * Math.PI) * .23;
      oval(c, 88 + u * 145 + Math.sin(time * .6 + i) * 22, 13 - u * 125, 10 + u * 33, 6 + u * 18, '#e1d9bd'); c.restore();
    }
    for (const wheel of [58, 242]) {
      oval(c, wheel, 94, 23, 23, '#232735'); oval(c, wheel, 94, 12, 12, '#c19b70');
      line(c, [[wheel - Math.cos(time * 2) * 9, 94 - Math.sin(time * 2) * 9], [wheel + Math.cos(time * 2) * 9, 94 + Math.sin(time * 2) * 9]], '#6d596b', 3);
    }
    label(c, 'UP IN THE CANOPY', 150, 69, 15, '#f4d894', 'center');
    for (let i = 0; i < 3; i++) {
      const px = 35 + i * 110;
      for (let petal = 0; petal < 5; petal++) { const a = petal * TAU / 5; oval(c, px + Math.cos(a) * 9, 82 + Math.sin(a) * 9, 5, 5, p[5]); }
      oval(c, px, 82, 4, 4, p[4]);
    }
    c.restore(); return true;
  }
  function draw(c, width, height, now, options = {}) {
    const dt = options.animate !== false && last !== null ? clamp((now - last) / 1000, 0, .08) : 0;
    last = options.animate === false ? null : now;
    const bass = clamp(Number(options.bass) || 0, 0, 1), mid = clamp(Number(options.mid) || 0, 0, 1), treble = clamp(Number(options.treble) || 0, 0, 1);
    if (dt) {
      time += dt * clamp(Number(options.speed) || 1, .2, 3);
      drive += (bass * .65 + mid * .35 - drive) * (1 - Math.exp(-dt * 6));
      accent = Math.max(accent * Math.exp(-dt * 4), Math.max(0, bass - previousBass) * 1.8); previousBass = bass;
    }
    const form = forms.includes(options.form) ? options.form : 'golden', p = palettes[form];
    const chapter = Math.floor(time / 18) % 3, canopy = form === 'moon' || chapter === 1;
    c.save(); c.scale(width / 1000, height / 600); jungle(c, p, form);
    const bananaOnAir = bananaBroadcast(c, p, form), visitors = hazyVisitors(c, p);
    branch(c, p, canopy ? 185 : 395);
    if (canopy) {
      for (let i = 0; i < 4; i++) {
        const lazy = i === 2;
        const pivot = 130 + i * 250, a = Math.sin(time * (lazy ? .29 : 1.1 + i * .07) + i * 2) * (lazy ? .18 + drive * .03 : .55 + drive * .3), length = 190 + i % 2 * 50;
        const x = pivot + Math.sin(a) * length, y = 65 + Math.cos(a) * length;
        primate(c, i === 2 ? 'orang' : 'monkey', x, y, i === 2 ? 1.1 : .8, i, 'swing', i % 2 ? -1 : 1, [pivot, -10]);
      }
    } else {
      for (let i = 0; i < 2; i++) {
        const x = 170 + i * 175;
        oval(c, x + 10, 475, 60, 30, '#443038'); c.fillStyle = '#684733'; c.fillRect(x - 50, 443, 120, 32);
        oval(c, x + 10, 442, 60, 23, p[4]); oval(c, x + 10, 442, 46, 15, '#503a35');
        primate(c, 'chimp', x, 365 + Math.sin(time * 2 + i) * drive * 6, 1.1, i * 2, 'drum', i ? -1 : 1);
        c.save(); c.globalAlpha = accent * .6;
        for (let ring = 0; ring < 3; ring++) {
          c.beginPath(); c.ellipse(x + 10, 442, 65 + ring * 17, 25 + ring * 8, 0, 0, TAU); c.strokeStyle = p[5]; c.lineWidth = 2; c.stroke();
        } c.restore();
      }
      primate(c, 'orang', 700, 350, 1.5, 3, chapter === 2 ? 'groom' : 'sway');
      for (let i = 0; i < 2; i++) {
        const a = time * (1.25 + i * .2) + i * Math.PI, x = 500 + Math.sin(a) * 165, y = 130 + Math.cos(a) * 40;
        primate(c, 'monkey', x, y, .65, i + 7, 'swing', Math.cos(a) > 0 ? 1 : -1, [500 + i * 70, -10]);
      }
    }
    clearing(c, p, form);
    const mischiefStage = mischief(c, p);
    if (form === 'fruit') for (let i = 0; i < 17; i++) {
      const u = (time * (.13 + i % 3 * .025) + i * .137) % 1, x = 100 + u * 800, y = 510 - Math.sin(u * Math.PI) * (230 + i % 4 * 45);
      oval(c, x, y, 12, 14, i % 2 ? p[5] : p[4]); leaf(c, x, y - 12, 7, -1, p[3]);
    }
    if (form === 'disco') {
      oval(c, 500, 64, 43, 43, '#a7b9ce');
      for (let i = 0; i < 18; i++) {
        const a = time * .4 + i * TAU / 18;
        oval(c, 500 + Math.cos(a) * 450, 300 + Math.sin(a * 2) * 230, 5 + drive * 14, 3 + treble * 8, i % 2 ? p[4] : p[5]);
      }
      label(c, 'THE PRIMATE CLUB', 500, 135, 25 + accent * 3, p[5], 'center');
    }
    for (let i = 0; i < 13; i++) leaf(c, i * 83 - 30, 590 + Math.sin(time * .8 + i) * 8, 52, -1.8 + i % 3 * .7, p[0]);
    // A short dissolve through jungle shadow softens the change of viewpoint.
    const edge = time % 18;
    const shade = Math.max(0, 1 - Math.min(edge, 18 - edge) / .65);
    if (time > .01 && form !== 'moon') {
      c.save(); c.globalAlpha = shade * .85; c.fillStyle = p[0]; c.fillRect(0, 0, 1000, 600); c.restore();
    }
    c.fillStyle = `${p[0]}c0`; c.fillRect(24, 22, 330, 64);
    label(c, 'MONKEY BUSINESS', 40, 49, 23, p[4]); label(c, names[forms.indexOf(form)].toUpperCase(), 40, 70, 11, p[5]);
    label(c, canopy ? 'CANOPY CAPERS' : chapter === 2 ? 'A LITTLE SOCIAL GROOMING' : 'THE RHYTHM SECTION', 960, 568, 11, p[4], 'right');
    c.restore(); return { time, form, chapter, canopy, drive, accent, mischiefStage, bananaOnAir, visitors };
  }
  return { draw, reset, recipes };
})();
