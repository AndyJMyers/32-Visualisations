/* Autumn 22: a champagne fountain slips into a tipsy Art Deco cocktail carousel. */
window.ChampagneFountain = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  const mix = (a, b, t) => a + (b - a) * t;
  const mixColor = (a, b, t) => '#' + [1, 3, 5].map(i =>
    Math.round(mix(parseInt(a.slice(i, i + 2), 16), parseInt(b.slice(i, i + 2), 16), t))
      .toString(16).padStart(2, '0')).join('');
  const forms = ['gilded', 'rose', 'absinthe', 'midnight'];
  const recipes = [
    { name: 'Gilded Evening', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Rose & Gin', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Absinthe Dream', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'After Midnight', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    gilded: { back: '#16122b', deep: '#080b1e', gold: '#f2c778', rim: '#fff1cb', light: '#9ce9f0', drinks: ['#e9bf60', '#ed9eaa', '#77c9ce', '#b69be2'] },
    rose: { back: '#3e1d3e', deep: '#170e2b', gold: '#f1b5c4', rim: '#ffe8ea', light: '#f4a4d2', drinks: ['#fa9caa', '#f9c5a4', '#d28eca', '#ffc8d4'] },
    absinthe: { back: '#20332d', deep: '#071c22', gold: '#d6ed97', rim: '#eaffd8', light: '#8de6c9', drinks: ['#8de6a0', '#c6e678', '#b6dda1', '#f1ec9b'] },
    midnight: { back: '#172444', deep: '#060c1e', gold: '#b2b7ef', rim: '#e5f2ff', light: '#6ad9f3', drinks: ['#797ce3', '#57b8db', '#c486ee', '#f3afcd'] },
  };
  const shapes = {
    coupe: { width: 43, depth: 29, bottom: 8, stem: 47, base: 24 },
    flute: { width: 17, depth: 59, bottom: 8, stem: 33, base: 19 },
    martini: { width: 47, depth: 45, bottom: 5, stem: 42, base: 22 },
    highball: { width: 27, depth: 68, bottom: 23, stem: 3, base: 25 },
    hurricane: { width: 34, depth: 60, bottom: 11, stem: 24, base: 21 },
  };
  const cocktailShapes = ['martini', 'hurricane', 'highball', 'flute', 'coupe', 'martini', 'highball', 'hurricane', 'martini'];
  const glasses = [
    { x: 450, y: 91, scale: 1.03, row: 0 },
    { x: 314, y: 226, scale: .95, row: 1 }, { x: 450, y: 226, scale: .95, row: 1 }, { x: 586, y: 226, scale: .95, row: 1 },
    { x: 178, y: 351, scale: .83, row: 2 }, { x: 315, y: 351, scale: .83, row: 2 },
    { x: 450, y: 351, scale: .83, row: 2 }, { x: 585, y: 351, scale: .83, row: 2 }, { x: 722, y: 351, scale: .83, row: 2 },
  ];
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, previousBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = previousBass = 0; beats = 0; activeForm = null; }
  function circle(c, x, y, r, color) { c.fillStyle = color; c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, TAU); c.fill(); }
  function line(c, x1, y1, x2, y2, color, width = 1) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function star(c, x, y, r, color, alpha = 1) {
    c.save(); c.globalAlpha = alpha;
    circle(c, x, y, Math.max(1, r * .16), color);
    line(c, x - r, y, x + r, y, color, Math.max(.6, r * .12));
    line(c, x, y - r * 1.4, x, y + r * 1.4, color, Math.max(.6, r * .12));
    c.restore();
  }
  function background(c, p, turn, local) {
    const bg = c.createRadialGradient(450, 235, 35, 450, 235, 610);
    bg.addColorStop(0, p.back); bg.addColorStop(1, p.deep);
    c.fillStyle = bg; c.fillRect(0, 0, 900, 500);
    c.save(); c.translate(450, 245); c.rotate(turn * .5);
    for (let i = 0; i < 22; i++) {
      const a = i * TAU / 22;
      c.globalAlpha = .055 + (i % 3 === 0 ? .045 : 0) + mid * .03;
      c.fillStyle = i % 2 ? p.gold : p.light;
      c.beginPath(); c.moveTo(Math.cos(a) * 155, Math.sin(a) * 155);
      c.lineTo(Math.cos(a - .014) * 680, Math.sin(a - .014) * 680);
      c.lineTo(Math.cos(a + .014) * 680, Math.sin(a + .014) * 680); c.fill();
    }
    c.globalAlpha = .16;
    for (let i = 0; i < 5; i++) {
      c.strokeStyle = p.gold; c.lineWidth = i === 0 ? 2 : 1;
      c.beginPath(); c.ellipse(0, 0, 170 + i * 92, 110 + i * 58, 0, 0, TAU); c.stroke();
    }
    c.restore();
    for (let i = 0; i < 45; i++) {
      const x = (i * 211.3) % 900, y = (i * 139.7) % 480;
      star(c, x, y, 2 + (i % 5) + treble * 2, i % 4 ? p.gold : p.light,
        .18 + (Math.sin(local * 2 + i * 2.7) + 1) * .18);
    }
    c.strokeStyle = `${p.gold}88`; c.lineWidth = 3;
    c.strokeRect(14, 14, 872, 472); c.strokeRect(21, 21, 858, 458);
    for (const side of [-1, 1]) {
      c.save(); c.translate(450 + side * 414, 250); c.scale(side, 1);
      for (let i = 0; i < 5; i++) {
        line(c, -12, -192 + i * 94, -41, -164 + i * 94, `${p.gold}77`, 2);
        line(c, -41, -164 + i * 94, -12, -136 + i * 94, `${p.gold}77`, 2);
      }
      c.restore();
    }
  }
  function geometry(from, to, morph) {
    const a = shapes[from], b = shapes[to];
    return Object.fromEntries(Object.keys(a).map(key => [key, mix(a[key], b[key], morph)]));
  }
  function glass(c, x, y, scale, from, to, morph, drink, p, index, local) {
    const g = geometry(from, to, morph);
    c.save(); c.translate(x, y); c.scale(scale, scale);
    const w = g.width, d = g.depth, b = g.bottom, stem = g.stem;
    const slosh = Math.sin(time * 2.3 + index * .7) * (1.1 + bass * 3);
    function bowl() {
      c.beginPath(); c.moveTo(-w, 0);
      c.bezierCurveTo(-w * .92, d * .55, -b * 1.7, d, -b, d);
      c.lineTo(b, d);
      c.bezierCurveTo(b * 1.7, d, w * .92, d * .55, w, 0);
      c.closePath();
    }
    bowl(); c.fillStyle = `${p.rim}14`; c.fill();
    c.save(); bowl(); c.clip();
    const fillAt = d * (.38 + Math.sin(time * 1.7 + index * .9) * .055 - bass * .04);
    const liquid = c.createLinearGradient(-w, fillAt, w, d);
    liquid.addColorStop(0, `${drink}d2`); liquid.addColorStop(.53, drink); liquid.addColorStop(1, `${p.rim}e0`);
    c.fillStyle = liquid; c.fillRect(-w - 2, fillAt + slosh, w * 2 + 4, d - fillAt + 8);
    c.fillStyle = `${p.rim}72`; c.fillRect(-w, fillAt + slosh, w * 2, 2);
    for (let i = 0; i < 8; i++) {
      const u = (local * (.36 + i % 3 * .07) + i * .21 + index * .31) % 1;
      const yy = d - u * (d - fillAt - 2);
      const xx = Math.sin(i * 4.2 + index) * w * .6 + Math.sin(time * 2 + i) * 2;
      circle(c, xx, yy, .8 + i % 3 * .5 + treble * .7, `${p.rim}b8`);
    }
    c.restore();
    bowl(); c.strokeStyle = `${p.rim}dd`; c.lineWidth = 2.2; c.stroke();
    c.strokeStyle = p.rim; c.lineWidth = 2.3;
    c.beginPath(); c.ellipse(0, 0, w, Math.max(2, w * .08), 0, 0, TAU); c.stroke();
    line(c, 0, d, 0, d + stem, `${p.rim}c8`, stem < 6 ? 0 : 2.4);
    line(c, -g.base, d + stem, g.base, d + stem, `${p.rim}d8`, 2.6);
    line(c, -w * .7, d * .15, -b * 1.25, d * .85, `${p.rim}63`, 2);
    if (morph > .55 && (to === 'martini' || to === 'hurricane')) {
      circle(c, w * .35, d * .43, 4.2, p.gold);
      line(c, w * .35, d * .43, w * .63, -9, p.rim, 1.6);
    }
    c.restore();
    star(c, x + Math.sin(local * 2 + index * 1.5) * g.width * scale * .7,
      y + Math.cos(local * 2.4 + index) * 3, 2.5 + treble * 5 + accent * 5, p.rim, .65);
  }
  function cascade(c, x1, y1, x2, y2, p, local, i, strength) {
    c.save(); c.globalAlpha = strength;
    for (let lane = 0; lane < 3; lane++) {
      const bend = Math.sin(local * 1.3 + i + lane) * 4;
      c.strokeStyle = lane === 1 ? p.rim : p.gold;
      c.lineWidth = lane === 1 ? 2.5 + bass * 3 : .8;
      c.beginPath(); c.moveTo(x1 + lane * 2, y1);
      c.bezierCurveTo(x1 + bend + lane * 2, y1 + 34, x2 - bend, y2 - 22, x2, y2); c.stroke();
    }
    for (let j = 0; j < 8; j++) {
      const u = (local * (.28 + bass * .16) + j / 8 + i * .17) % 1;
      const x = mix(x1, x2, u) + Math.sin(u * Math.PI) * Math.sin(local * 2 + i) * 9;
      const y = mix(y1, y2, u) + Math.sin(u * Math.PI) * 8;
      circle(c, x, y, 1 + u * 1.5 + treble, j % 2 ? p.rim : p.gold);
    }
    c.restore();
  }
  function neonSign(c, p, local) {
    const label = 'THE VELVET ROOM', lit = Math.floor(local * 2.8) % (label.length + 16);
    c.save();
    c.fillStyle = `${p.deep}c8`; c.fillRect(632, 35, 237, 52);
    c.strokeStyle = `${p.gold}80`; c.lineWidth = 1.6; c.strokeRect(632, 35, 237, 52);
    c.font = '700 18px Georgia, serif';
    let x = 647;
    for (let i = 0; i < label.length; i++) {
      const letter = label[i], on = i < lit && (i !== lit - 1 || Math.sin(local * 28) > -.35);
      c.shadowBlur = on ? 11 + accent * 10 : 0;
      c.shadowColor = p.light; c.fillStyle = on ? p.light : `${p.gold}48`;
      c.fillText(letter, x, 67);
      x += c.measureText(letter).width + .3;
    }
    c.shadowBlur = 0;
    line(c, 647, 75, 855, 75, `${p.gold}${lit > label.length ? 'c8' : '55'}`, 1.4);
    c.restore();
  }
  function grandTourer(c, p, local) {
    const drive = (local * 76) % 1390;
    c.save(); c.translate(-300 + drive, 452);
    c.globalAlpha = .55 + Math.min(1, Math.abs(Math.sin(local * 1.4))) * .35;
    for (let i = 0; i < 6; i++) {
      const trail = 32 + i * 26 + bass * 45;
      line(c, -trail, -16 + i * 5, -27 - i * 7, -16 + i * 5,
        i % 2 ? `${p.light}8c` : `${p.gold}8c`, 1.2 + accent * 1.5);
    }
    c.globalAlpha = 1;
    c.fillStyle = `${p.deep}ed`; c.strokeStyle = `${p.gold}a8`; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-23, -12); c.lineTo(5, -21);
    c.bezierCurveTo(36, -24, 47, -42, 77, -43);
    c.lineTo(123, -43); c.bezierCurveTo(142, -43, 156, -26, 187, -23);
    c.lineTo(238, -17); c.quadraticCurveTo(254, -13, 257, -3);
    c.lineTo(252, 7); c.lineTo(-17, 7); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(74, -42); c.lineTo(123, -42);
    c.lineTo(142, -24); c.lineTo(45, -24); c.closePath();
    c.fillStyle = `${p.light}30`; c.fill(); c.stroke();
    line(c, 103, -40, 103, -25, `${p.gold}9c`, 1.5);
    line(c, 153, -22, 238, -18, `${p.rim}bd`, 1.5);
    line(c, 200, -10, 248, -8, `${p.gold}aa`, 1.2);
    line(c, -8, -5, 245, -5, `${p.drinks[2]}d0`, 1.4);
    line(c, -15, -9, -15, -4, p.drinks[1], 3);
    for (const x of [28, 206]) {
      circle(c, x, 7, 17, p.deep); circle(c, x, 7, 11, `${p.gold}95`);
      circle(c, x, 7, 7, p.deep); circle(c, x, 7, 2, p.rim);
      for (let spoke = 0; spoke < 5; spoke++) {
        const a = local * 6 + spoke * TAU / 5;
        line(c, x + Math.cos(a) * 3, 7 + Math.sin(a) * 3,
          x + Math.cos(a) * 7, 7 + Math.sin(a) * 7, p.rim, .8);
      }
    }
    star(c, 252, -9, 6 + treble * 5, p.rim, .55 + accent * .3);
    c.restore();
  }
  function noirGuests(c, p, local) {
    const sway = Math.sin(local * .65) * 5;
    c.save(); c.translate(103 + sway, 447); c.rotate(Math.sin(local * .7) * .018); c.scale(.78, 1);
    c.fillStyle = p.deep; c.strokeStyle = `${p.gold}b0`; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-25, -145); c.quadraticCurveTo(-41, -128, -35, -111);
    c.lineTo(-19, -88); c.lineTo(-26, -63); c.lineTo(-41, 0); c.lineTo(37, 0);
    c.lineTo(22, -67); c.lineTo(16, -91); c.lineTo(33, -126);
    c.quadraticCurveTo(25, -143, 18, -150);
    c.quadraticCurveTo(2, -137, -25, -145); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-9, -147); c.lineTo(-9, -171); c.lineTo(8, -171);
    c.lineTo(10, -147); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(0, -188, 21, 28, -.12, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-22, -198); c.bezierCurveTo(-29, -239, 28, -241, 23, -198);
    c.bezierCurveTo(38, -177, 22, -155, 13, -166);
    c.bezierCurveTo(26, -189, 20, -209, 11, -213);
    c.quadraticCurveTo(-11, -194, -22, -198); c.fill();
    c.beginPath(); c.moveTo(17, -188); c.lineTo(29, -183); c.lineTo(20, -179);
    c.quadraticCurveTo(18, -169, 9, -166); c.stroke();
    c.beginPath(); c.moveTo(-20, -210); c.bezierCurveTo(-5, -223, 5, -203, 18, -215);
    c.strokeStyle = `${p.gold}a0`; c.stroke();
    line(c, 17, -183, 27, -179, p.rim, 1.5);
    circle(c, 15, -170, 2.5, p.drinks[3]);
    c.beginPath(); c.moveTo(-23, -145); c.quadraticCurveTo(0, -120, 24, -145);
    c.strokeStyle = `${p.rim}aa`; c.stroke();
    line(c, -14, -119, -19, -88, `${p.light}be`, 2);
    line(c, 16, -91, 26, -61, `${p.drinks[1]}c0`, 2);
    line(c, 8, -8, 28, -51, `${p.rim}85`, 1.5);
    c.beginPath(); c.moveTo(23, -137); c.quadraticCurveTo(46, -130, 35, -103);
    c.lineTo(12, -82); c.stroke();
    line(c, 12, -82, 21, -77, `${p.rim}c8`, 2);
    line(c, 22, -77, 41, -85, p.gold, 1.5);
    star(c, 44, -86, 3 + treble * 3, p.rim, .4 + accent * .25);
    c.restore();

    c.save(); c.translate(810 - sway * .6, 447); c.rotate(Math.sin(local * .55 + 1) * .013); c.scale(.8, 1);
    c.fillStyle = p.deep; c.strokeStyle = `${p.gold}ac`; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-15, -144); c.quadraticCurveTo(-44, -141, -49, -118);
    c.lineTo(-44, -56); c.lineTo(-33, -55); c.lineTo(-30, -2);
    c.lineTo(-4, -2); c.lineTo(0, -70); c.lineTo(6, -2);
    c.lineTo(32, -2); c.lineTo(34, -55); c.lineTo(44, -56);
    c.lineTo(47, -118); c.quadraticCurveTo(38, -143, 17, -146);
    c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-18, -144); c.lineTo(-3, -122); c.lineTo(0, -117);
    c.lineTo(4, -122); c.lineTo(19, -145); c.strokeStyle = p.rim; c.stroke();
    c.beginPath(); c.moveTo(-25, -137); c.lineTo(-10, -110); c.lineTo(0, -118);
    c.lineTo(11, -109); c.lineTo(28, -139); c.strokeStyle = `${p.gold}9a`; c.stroke();
    line(c, 15, -111, 26, -112, p.drinks[1], 2.5);
    line(c, -28, -132, -10, -108, `${p.light}bd`, 2.2);
    line(c, 10, -108, 29, -135, `${p.light}bd`, 2.2);
    line(c, -29, -55, -28, -4, `${p.gold}93`, 1.5);
    c.fillStyle = p.rim; c.beginPath(); c.moveTo(-6, -129); c.lineTo(0, -124);
    c.lineTo(6, -129); c.lineTo(0, -133); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-8, -143); c.lineTo(-8, -165); c.lineTo(9, -165);
    c.lineTo(9, -143); c.closePath(); c.fillStyle = p.deep; c.fill();
    c.beginPath(); c.ellipse(1, -185, 19, 25, .09, 0, TAU); c.fill(); c.strokeStyle = `${p.gold}ac`; c.stroke();
    c.beginPath(); c.moveTo(-22, -205); c.quadraticCurveTo(0, -223, 24, -206);
    c.lineTo(20, -198); c.quadraticCurveTo(0, -207, -19, -196); c.fill();
    line(c, -12, -183, -4, -182, p.rim, 1.3);
    line(c, 8, -183, 17, -182, p.rim, 1.3);
    c.beginPath(); c.moveTo(-15, -180); c.lineTo(-23, -174);
    c.lineTo(-12, -169); c.quadraticCurveTo(0, -159, 12, -169); c.stroke();
    line(c, -40, -75, -14, -92, `${p.gold}a8`, 2);
    line(c, -14, -92, -9, -101, `${p.rim}ce`, 2);
    line(c, -16, -102, -2, -102, p.rim, 1.5);
    line(c, -9, -101, -9, -79, p.rim, 1.5);
    line(c, -21, -79, 3, -79, p.rim, 1.5);
    line(c, 44, -77, 61, -107, `${p.gold}be`, 2);
    c.restore();
  }
  function draw(c, width, height, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'gilded';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5), incomingBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (incomingBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && incomingBass > .62 && previousBass <= .62) { beats++; accent = 1; }
    previousBass = incomingBass; accent = Math.max(0, accent - dt * 2.5);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const local = time % 72, p = palettes[form];
    const cocktail = smooth((local - 16) / 12) * (1 - smooth((local - 61) / 9));
    const tipsy = smooth((local - 37) / 10) * (1 - smooth((local - 61) / 9));
    const turn = time * (.06 + tipsy * (.12 + mid * .15));
    const phase = tipsy > .5 ? 'TIPSY CAROUSEL' : cocktail > .5 ? 'COCKTAIL HOUR' : 'CHAMPAGNE FOUNTAIN';
    c.save(); c.scale(width / 900, height / 500);
    background(c, p, turn, local);
    neonSign(c, p, local);
    grandTourer(c, p, local);
    noirGuests(c, p, local);
    c.save(); c.translate(450, 263);
    c.rotate(Math.sin(turn * 1.5) * (.018 + tipsy * .15) + Math.sin(time * 1.8) * bass * tipsy * .035);
    c.scale(1 + Math.sin(time * .9) * tipsy * .035, 1 + Math.cos(time * 1.1) * tipsy * .025);
    c.translate(-450, -263);
    const projected = glasses.map((glass, i) => ({ ...glass, index: i,
      x: glass.x + Math.sin(turn + i * 2.35) * tipsy * (glass.row ? 16 : 6),
      y: glass.y + Math.cos(turn + i * 2.35) * tipsy * (glass.row ? 7 : 3),
    }));
    c.fillStyle = `${p.gold}23`; c.beginPath(); c.ellipse(450, 488, 334, 27, 0, 0, TAU); c.fill();
    line(c, 112, 487, 788, 487, p.gold, 4);
    for (let i = 0; i < 3; i++) cascade(c, projected[0].x + (i - 1) * 18, projected[0].y + 29,
      projected[i + 1].x, projected[i + 1].y, p, local, i, .55 + bass * .35);
    for (let i = 0; i < 5; i++) cascade(c, projected[1 + Math.min(2, Math.floor(i * 3 / 5))].x + (i % 2 ? 22 : -22),
      projected[1 + Math.min(2, Math.floor(i * 3 / 5))].y + 33,
      projected[i + 4].x, projected[i + 4].y, p, local, i + 3, .43 + bass * .35);
    for (const item of projected.slice().sort((a, b) => b.row - a.row)) {
      const first = item.row === 2 ? 'flute' : 'coupe';
      const drink = mixColor(p.drinks[0], p.drinks[item.index % p.drinks.length], cocktail);
      glass(c, item.x, item.y, item.scale, first, cocktailShapes[item.index], cocktail, drink, p, item.index, local);
    }
    c.restore();
    for (let i = 0; i < 20; i++) {
      const x = ((i * 137 + time * (8 + bass * 15)) % 1000) - 50;
      const y = (i * 101 + Math.sin(time * .8 + i) * 33) % 500;
      star(c, x, y, (2 + (i % 4) * 1.2 + treble * 3) * (1 + tipsy * .4),
        i % 3 ? p.rim : p.gold, .22 + accent * .18 + tipsy * .12);
    }
    c.fillStyle = `${p.deep}dc`; c.fillRect(26, 27, 274, 63);
    c.fillStyle = p.rim; c.font = '700 19px Georgia, serif'; c.fillText(phase, 39, 52);
    c.fillStyle = p.gold; c.font = 'italic 12px Georgia, serif'; c.fillText('a little too much of a good thing', 40, 74);
    c.fillStyle = `${p.gold}66`; c.fillRect(38, 459, 824, 2);
    c.fillStyle = p.light; c.fillRect(38, 459, 824 * (local / 72), 2);
    c.restore();
    return { time, phase, form, beats, cocktail, tipsy };
  }
  return { recipes, draw, reset };
})();
