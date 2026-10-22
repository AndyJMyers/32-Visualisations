/* Autumn 15: a magpie's view of the world below. */
window.BirdsEye = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const forms = ['orchard', 'village', 'rain', 'twilight'];
  const recipes = [
    { name: 'Orchard Watch', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Village Mischief', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Rain Patrol', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Last Light', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = [
    { sky: '#9ebfc0', far: '#849867', near: '#6a8048', earth: '#ae995c', leaf: '#b06f2c', light: '#f5d58b', ink: '#1a2630' },
    { sky: '#a8c7d2', far: '#8e9b77', near: '#758853', earth: '#b79c76', leaf: '#bf782f', light: '#f5e2aa', ink: '#202733' },
    { sky: '#677c88', far: '#73827d', near: '#69786b', earth: '#998d73', leaf: '#9e663b', light: '#c1d6d8', ink: '#14242c' },
    { sky: '#e9a468', far: '#a07067', near: '#625f63', earth: '#a17b6d', leaf: '#d8954b', light: '#ffe3ab', ink: '#241d2f' },
  ];
  let time = 0, last = null, bass = 0, mid = 0, treble = 0;
  let activeForm = null, lastBass = 0, beats = 0;
  function reset() { time = 0; last = null; bass = mid = treble = lastBass = 0; beats = 0; activeForm = null; }
  function ellipse(c, x, y, rx, ry, color, rotation = 0) {
    c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, rotation, 0, TAU); c.fill();
  }
  function poly(c, points, color) {
    c.fillStyle = color; c.beginPath(); c.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) c.lineTo(...points[i]);
    c.closePath(); c.fill();
  }
  function line(c, x1, y1, x2, y2, color, width = 2) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function magpie(c, wingLift) {
    // Local origin is the bird's breast; its eye is at (53, -54).
    poly(c, [[-45, 12], [-198, 68], [-194, 79], [-36, 45]], '#142d3a');
    poly(c, [[-50, 20], [-201, 74], [-166, 88], [-34, 44]], '#284655');
    ellipse(c, 0, 9, 95, 61, '#111923', -.2);
    ellipse(c, 21, 30, 66, 31, '#f5f2e9', -.24);
    poly(c, [[-70, -11], [-96, -88 - wingLift], [-51, -114 - wingLift], [10, -21]], '#10222b');
    poly(c, [[-57, -34], [-82, -91 - wingLift], [-41, -96 - wingLift], [4, -25]], '#eef0e9');
    for (let i = 0; i < 4; i++) line(c, -54 + i * 11, -57 - wingLift * .7, -42 + i * 11, -105 - wingLift, '#809eae', 2);
    ellipse(c, 44, -44, 43, 36, '#121b24');
    poly(c, [[75, -51], [119, -43], [78, -31]], '#23252b');
    ellipse(c, 53, -54, 11, 10, '#f1dca7');
    ellipse(c, 54, -54, 7, 8, '#161d29');
    ellipse(c, 56, -57, 2.4, 2.4, '#f8ffff');
    line(c, 11, 62, 4, 98, '#282a2b', 4); line(c, 43, 60, 38, 98, '#282a2b', 4);
    for (const x of [4, 38]) { line(c, x, 98, x - 14, 103, '#282a2b', 3); line(c, x, 98, x + 14, 102, '#282a2b', 3); }
  }
  function tree(c, x, y, s, p, seed) {
    line(c, x, y, x + 2 * s, y - 27 * s, '#504333', 5 * s);
    ellipse(c, x + 2 * s, y - 34 * s, 23 * s, 20 * s, seed % 3 === 0 ? p.leaf : p.near);
    ellipse(c, x - 9 * s, y - 37 * s, 13 * s, 13 * s, seed % 2 ? p.leaf : p.far);
    ellipse(c, x + 14 * s, y - 44 * s, 15 * s, 15 * s, seed % 2 ? p.far : p.leaf);
  }
  function dog(c, x, y, s, phase, ink) {
    c.save(); c.translate(x, y); c.scale(s, s);
    ellipse(c, 0, 0, 24, 9, ink); ellipse(c, 25, -6, 8, 8, ink);
    poly(c, [[23, -12], [31, -23], [31, -7]], ink);
    for (const dx of [-14, 13]) line(c, dx, 5, dx + Math.sin(phase + dx) * 4, 18, ink, 3);
    line(c, -23, -3, -39, -11 - Math.sin(phase) * 5, ink, 4);
    c.restore();
  }
  function human(c, x, y, s, phase, ink, coat) {
    c.save(); c.translate(x, y); c.scale(s, s);
    ellipse(c, 0, -18, 6, 6, ink); poly(c, [[-7, -9], [8, -9], [11, 11], [-11, 11]], coat);
    line(c, -5, 10, -7 + Math.sin(phase) * 4, 25, ink, 4);
    line(c, 5, 10, 7 - Math.sin(phase) * 4, 25, ink, 4);
    line(c, -6, -6, -14, 8, ink, 3); line(c, 7, -6, 16, 5, ink, 3);
    c.restore();
  }
  function wingFrame(c, t) {
    const flap = Math.sin(t * (3 + mid * 3)) * 30;
    poly(c, [[0, 500], [0, 244 + flap], [100, 345 + flap], [285, 500]], '#15232c');
    poly(c, [[900, 500], [900, 244 + flap], [800, 345 + flap], [615, 500]], '#15232c');
    poly(c, [[0, 500], [100, 368 + flap], [214, 500]], '#e8ece7');
    poly(c, [[900, 500], [800, 368 + flap], [686, 500]], '#e8ece7');
  }
  function meadow(c, p, t) {
    const sky = c.createLinearGradient(0, 0, 0, 500);
    sky.addColorStop(0, p.sky); sky.addColorStop(1, p.light);
    c.fillStyle = sky; c.fillRect(0, 0, 900, 500);
    poly(c, [[0, 235], [152, 206], [371, 225], [617, 193], [900, 211], [900, 500], [0, 500]], p.far);
    poly(c, [[0, 330], [219, 280], [503, 311], [735, 276], [900, 300], [900, 500], [0, 500]], p.near);
    poly(c, [[0, 402], [201, 372], [450, 385], [679, 351], [900, 372], [900, 500], [0, 500]], p.earth);
    for (let i = 0; i < 11; i++) tree(c, i * 100 - 44, 303 + i % 3 * 23, .55 + i % 3 * .16, p, i);
    for (let i = 0; i < 55; i++) {
      const x = (i * 79 + 23) % 900, y = 396 + (i * 37) % 108;
      line(c, x, y + 9, x + Math.sin(t * 2 + i) * 3, y - 5, i % 4 ? p.near : p.leaf, 1.5);
    }
  }
  function fox(c, x, y, leap) {
    c.save(); c.translate(x, y - leap * 45); c.rotate(-leap * .16);
    poly(c, [[-79, 6], [-145, -32], [-164, -23], [-115, 30], [-72, 25]], '#b96532');
    ellipse(c, -30, 5, 70, 29, '#b96532', -.08);
    ellipse(c, -21, 20, 47, 11, '#eee0bf');
    poly(c, [[15, -16], [50, -42], [75, -22], [67, 6], [38, 10]], '#c5743c');
    poly(c, [[41, -34], [42, -69], [57, -44]], '#7e3e2e');
    poly(c, [[57, -34], [68, -65], [70, -24]], '#7e3e2e');
    poly(c, [[65, -8], [101, 0], [68, 8]], '#eee0bf');
    ellipse(c, 61, -17, 3, 3, '#211c20'); ellipse(c, 94, 0, 3, 3, '#211c20');
    for (const dx of [-77, -32, 16, 48]) line(c, dx, 24, dx + leap * 14, 55 - leap * 12, '#70452e', 7);
    poly(c, [[-147, -25], [-164, -23], [-149, -5]], '#f0e5d4');
    c.restore();
  }
  function rabbit(c, x, y, alert) {
    ellipse(c, x, y, 17, 12, '#cfc4ae');
    ellipse(c, x + 16, y - 8, 8, 8, '#cfc4ae');
    if (alert) {
      ellipse(c, x + 13, y - 25, 3, 15, '#cfc4ae', -.18);
      ellipse(c, x + 21, y - 25, 3, 15, '#cfc4ae', .18);
    }
    ellipse(c, x + 20, y - 9, 1.5, 1.5, '#28262a');
    ellipse(c, x - 14, y - 1, 6, 6, '#eee4d5');
  }
  function foxScene(c, p, local, t) {
    meadow(c, p, t);
    const stalk = clamp(local / 5, 0, 1);
    const pounce = clamp((local - 5) / 1.4, 0, 1);
    const foxX = local < 5 ? 185 + stalk * 365 : 550 + pounce * 115 + Math.max(0, local - 7) * 100;
    const leap = local >= 5 && local < 7 ? Math.sin(pounce * Math.PI) : 0;
    fox(c, foxX, 383, leap * (1 + bass * .25));
    if (local < 7) rabbit(c, 681, 394, true);
    else {
      // A few non-graphic scraps remain after the fox has moved on.
      ellipse(c, 684, 406, 19, 6, '#69513f');
      poly(c, [[667, 403], [678, 392], [682, 405]], '#e9dac0');
      poly(c, [[687, 406], [704, 393], [699, 409]], '#e9dac0');
      if (local > 9) {
        c.save(); c.translate(779 - (local - 9) * 23, 313 + (local - 9) * 12); c.scale(.65, .65);
        magpie(c, Math.abs(Math.sin(t * 6)) * 15);
        c.restore();
      }
    }
    wingFrame(c, t);
  }
  function bench(c, p) {
    poly(c, [[405, 350], [694, 339], [694, 356], [405, 368]], '#64452f');
    poly(c, [[415, 308], [688, 299], [688, 320], [415, 330]], '#714d33');
    line(c, 439, 362, 434, 427, '#3f3934', 8); line(c, 663, 353, 674, 422, '#3f3934', 8);
    line(c, 422, 323, 425, 366, '#3f3934', 7); line(c, 681, 311, 681, 355, '#3f3934', 7);
    for (let i = 0; i < 5; i++) line(c, 434, 316 + i * 8, 674, 307 + i * 8, p.light, 1.5);
  }
  function pipeWalker(c, x, local, p, t) {
    const seated = local >= 5;
    const headY = seated ? 265 : 232;
    ellipse(c, x, headY, 18, 22, '#b79270');
    poly(c, [[x - 32, headY - 19], [x + 28, headY - 19], [x + 15, headY - 30], [x - 23, headY - 30]], '#3d3c3d');
    poly(c, [[x - 33, headY + 20], [x + 28, headY + 19], [x + 40, seated ? 91 + headY : 120 + headY], [x - 31, seated ? 92 + headY : 119 + headY]], '#394749');
    if (seated) {
      line(c, x - 7, 352, x + 60, 367, '#252d31', 15);
      line(c, x + 57, 367, x + 65, 408, '#252d31', 10);
      line(c, x - 14, 351, x - 18, 408, '#252d31', 10);
    } else {
      const stride = Math.sin(local * 8) * 16;
      line(c, x - 13, headY + 116, x - 18 + stride, 406, '#252d31', 12);
      line(c, x + 14, headY + 116, x + 20 - stride, 406, '#252d31', 12);
    }
    const armY = local >= 7 ? headY + 4 : headY + 55;
    line(c, x + 24, headY + 35, x + 47, armY + 25, '#394749', 11);
    line(c, x + 47, armY + 25, x + 18, armY, '#b79270', 8);
    if (local >= 7) {
      line(c, x + 13, headY + 4, x + 33, headY + 4, '#3a2927', 4);
      ellipse(c, x + 34, headY + 8, 7, 5, '#4a2d23');
    }
    if (local >= 8 && local < 11) {
      // The pouch is filled before the match is struck.
      poly(c, [[x - 62, headY + 65], [x - 25, headY + 65], [x - 31, headY + 94], [x - 58, headY + 91]], '#9a6740');
      line(c, x - 28, headY + 49, x + 32, headY + 9, '#b79270', 7);
    }
    if (local >= 11 && local < 13) {
      line(c, x + 58, headY + 21, x + 46, headY + 8, '#c7a271', 2);
      ellipse(c, x + 46, headY + 4, 5 + bass * 2, 9 + bass * 2, '#ffc36b');
      ellipse(c, x + 46, headY + 6, 2.5, 5, '#fff0aa');
    }
    if (local >= 13) {
      for (let i = 0; i < 3; i++) {
        const rise = (local - 13) * 19 + i * 22;
        c.strokeStyle = '#e9e6d7'; c.globalAlpha = .38 - i * .07; c.lineWidth = 4 + treble * 2;
        c.beginPath(); c.moveTo(x + 36, headY - 2 - rise);
        c.bezierCurveTo(x + 58 + Math.sin(t * 2 + i) * 9, headY - 28 - rise,
          x + 19, headY - 41 - rise, x + 46, headY - 61 - rise); c.stroke();
      }
      c.globalAlpha = 1;
    }
  }
  function pipeScene(c, p, local, t) {
    meadow(c, p, t);
    poly(c, [[0, 411], [900, 391], [900, 500], [0, 500]], '#a88b6a');
    line(c, 0, 415, 900, 395, '#e6c594', 4);
    bench(c, p);
    const x = local < 5 ? 133 + local * 80 : 534;
    pipeWalker(c, x, local, p, t);
    if (local > 12) {
      // He may not offer a feast, but the magpie knows to wait.
      for (let i = 0; i < 5; i++) ellipse(c, 486 + i * 9, 396 + i % 2 * 8, 2, 2, p.light);
    }
    wingFrame(c, t);
  }
  function birds(c, p, shift, solo) {
    if (solo) return;
    for (let i = 0; i < 3; i++) {
      const x = 650 + i * 64 - (shift * (28 + i * 8) % 740);
      const y = 102 + i * 28 + Math.sin(shift * 2 + i) * 12;
      const span = 14 + i * 3 + Math.sin(shift * 8 + i) * 5;
      line(c, x - span, y + 4, x, y, p.ink, 2.5);
      line(c, x, y, x + span, y + 4, p.ink, 2.5);
    }
  }
  function outside(c, p, form, t, zoom) {
    const sky = c.createLinearGradient(0, 0, 0, 500);
    sky.addColorStop(0, p.sky); sky.addColorStop(.65, p.light); sky.addColorStop(1, p.earth);
    c.fillStyle = sky; c.fillRect(0, 0, 900, 500);
    ellipse(c, 745, 100, 43, 43, p.light);
    poly(c, [[0, 290], [160, 262], [345, 285], [525, 240], [900, 275], [900, 500], [0, 500]], p.far);
    poly(c, [[0, 360], [205, 308], [428, 351], [633, 302], [900, 347], [900, 500], [0, 500]], p.near);
    for (let i = 0; i < 8; i++) tree(c, i * 135 - 55, 385 + (i % 3) * 42, .85 + (i % 3) * .3, p, i);
    birds(c, p, t, form === 'orchard' && Math.floor(t / 49) % 2 === 0);
    line(c, 0, 412, 900, 398, '#564432', 14);
    if (zoom < 1) {
      const s = 1 + zoom * 10;
      c.save(); c.translate(450, 250); c.scale(s, s); c.translate(-53, 54);
      magpie(c, Math.sin(t * 5) * (5 + mid * 7)); c.restore();
    } else {
      c.fillStyle = '#0b101d'; c.fillRect(0, 0, 900, 500);
      ellipse(c, 450, 250, 235, 235, '#ceaa68');
      for (let i = 0; i < 22; i++) {
        const a = i * TAU / 22;
        line(c, 450 + Math.cos(a) * 62, 250 + Math.sin(a) * 62,
          450 + Math.cos(a) * 225, 250 + Math.sin(a) * 225, '#745b45', 5);
      }
      ellipse(c, 450, 250, 78, 78, '#101d27'); ellipse(c, 425, 216, 25, 17, '#fff7da', -.4);
    }
    if (zoom === 0 && form === 'orchard' && Math.floor(t / 49) % 2 === 0) {
      // The traditional salute reads as a small observer in the foreground.
      const hand = Math.sin(t * 2) * 3;
      ellipse(c, 91, 412, 20, 22, '#343033');
      poly(c, [[56, 500], [58, 453], [73, 434], [106, 434], [125, 454], [131, 500]], '#343033');
      line(c, 121, 462, 146, 424, '#343033', 12);
      line(c, 146, 424, 119, 392 + hand, '#343033', 11);
      line(c, 119, 392 + hand, 94, 391 + hand, '#343033', 9);
      line(c, 94, 391 + hand, 83, 395 + hand, '#343033', 5);
    }
  }
  function ground(c, p, form, t) {
    const move = t * (35 + bass * 14);
    c.fillStyle = p.sky; c.fillRect(0, 0, 900, 500);
    poly(c, [[0, 60], [900, 26], [900, 500], [0, 500]], p.far);
    for (let i = -1; i < 8; i++) {
      const y = ((i * 125 + move) % 875) - 155;
      poly(c, [[-60, y + 14], [950, y - 70], [950, y + 48], [-60, y + 132]],
        i % 2 ? p.near : p.earth);
      line(c, -30, y + 30, 920, y - 49, p.light, 3);
    }
    const offset = move % 600;
    for (let i = -1; i < 5; i++) {
      const y = i * 175 + offset - 145;
      tree(c, 80 + i * 160, y + 34, 1 + i * .15, p, i);
      tree(c, 755 - i * 90, y + 82, .8 + i * .12, p, i + 3);
    }
    if (form === 'village') {
      for (let i = 0; i < 3; i++) {
        const x = 170 + i * 280, y = ((i * 250 + offset) % 620) - 70;
        poly(c, [[x - 65, y], [x, y - 40], [x + 65, y], [x + 65, y + 55], [x - 65, y + 55]], '#d7bb92');
        poly(c, [[x - 75, y], [x, y - 54], [x + 75, y]], '#594b50');
        c.fillStyle = '#3a6372'; c.fillRect(x + 24, y + 14, 22, 25);
      }
    } else if (form === 'rain') {
      c.save(); c.globalAlpha = .42; c.strokeStyle = '#d9e7e8'; c.lineWidth = 1.5;
      for (let i = 0; i < 120; i++) {
        const x = (i * 79 + t * 110) % 970 - 35, y = (i * 47 + t * 260) % 570 - 35;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x - 10, y + 29); c.stroke();
      }
      c.restore();
    } else if (form === 'twilight') {
      for (let i = 0; i < 10; i++) ellipse(c, (i * 139 + 77) % 900, (i * 103 + offset) % 500,
        3 + treble * 3, 3 + treble * 3, p.light);
    }
    const phase = t * 7;
    human(c, 460 + Math.sin(t * .6) * 40, 300 + offset * .08, 1.25, phase, p.ink, '#c34e38');
    dog(c, 555 + Math.sin(t * .9) * 55, 330 + offset * .07, 1.1, phase, p.ink);
    human(c, 185 + Math.sin(t * .4) * 25, 422 - offset * .03, .9, phase + 2, p.ink, '#d6b15e');
    for (let i = 0; i < 4; i++) {
      const x = (i * 215 + 130 - t * 35) % 1050;
      const y = 140 + i * 33 + Math.sin(t * 2 + i) * 15;
      line(c, x - 15, y + Math.sin(t * 9 + i) * 7, x, y, p.ink, 3);
      line(c, x, y, x + 15, y + Math.sin(t * 9 + i) * 7, p.ink, 3);
    }
    wingFrame(c, t);
  }
  function draw(c, w, h, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'orchard';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    const inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt > 0 && inputBass > .62 && lastBass <= .62) beats++;
    lastBass = inputBass;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const local = time % 49;
    const phase = local < 4 ? 'magpie' : local < 7 ? 'eye' : local < 16 ? 'flight'
      : local < 28 ? 'fox' : local < 46 ? 'pipe' : 'return';
    const p = palettes[forms.indexOf(form)];
    c.save(); c.scale(w / 900, h / 500);
    if (phase === 'magpie') outside(c, p, form, time, 0);
    else if (phase === 'eye') outside(c, p, form, time, clamp((local - 4) / 2.7, 0, 1));
    else if (phase === 'flight') ground(c, p, form, time);
    else if (phase === 'fox') foxScene(c, p, local - 16, time);
    else if (phase === 'pipe') pipeScene(c, p, local - 28, time);
    else pipeScene(c, p, 18, time);
    if (phase === 'return') {
      c.globalAlpha = clamp((local - 46) / 3, 0, 1);
      outside(c, p, form, time, 0);
    }
    c.globalAlpha = 1;
    const vignette = c.createRadialGradient(450, 240, 160, 450, 250, 570);
    vignette.addColorStop(0, '#0000'); vignette.addColorStop(1, '#07131a8c');
    c.fillStyle = vignette; c.fillRect(0, 0, 900, 500);
    c.restore();
    return { time, phase, form, solo: form === 'orchard' && Math.floor(time / 49) % 2 === 0, beats };
  }
  return { recipes, draw, reset };
})();
