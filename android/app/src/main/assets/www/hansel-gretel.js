/* Autumn 25: a gentle, left-scrolling walk through Hansel and Gretel. */
window.HanselGretel = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  const recipes = [
    { name: 'Woodland Dawn', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Moonlit Crumbs', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Sugar Lanterns', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Ink & Honey', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const forms = ['woodland', 'moonlit', 'sugar', 'ink'];
  const palettes = {
    woodland: { sky: '#cfb894', dusk: '#9da98e', hill: '#668277', path: '#b99d7b', tree: '#4b594d', leaf: '#92a46d', light: '#f4da9c', deep: '#314b4b', roof: '#a96f5e', sweet: '#f3d49c', cloth: '#bd786b' },
    moonlit: { sky: '#243a5b', dusk: '#6689a0', hill: '#385969', path: '#79949b', tree: '#233c55', leaf: '#58788a', light: '#d2e9dc', deep: '#172d49', roof: '#71718e', sweet: '#b7d5d2', cloth: '#a8a7cc' },
    sugar: { sky: '#c8a0b5', dusk: '#e2bda5', hill: '#a0788e', path: '#d9b3a2', tree: '#795c79', leaf: '#b17c97', light: '#fff1bd', deep: '#694762', roof: '#d07382', sweet: '#fff0d3', cloth: '#e6a2b1' },
    ink: { sky: '#292e3a', dusk: '#816f61', hill: '#61564c', path: '#ad8f6b', tree: '#282f35', leaf: '#665e4e', light: '#f8d788', deep: '#202733', roof: '#996c4c', sweet: '#eac794', cloth: '#b99470' },
  };
  const chapters = [
    { name: 'The little house', id: 'cottage', duration: 14 },
    { name: 'White pebbles', id: 'pebbles', duration: 17 },
    { name: 'The birds and crumbs', id: 'crumbs', duration: 18 },
    { name: 'The sugar-window house', id: 'sweetHouse', duration: 20 },
    { name: 'Gretel and the oven', id: 'oven', duration: 18 },
    { name: 'The white duck', id: 'river', duration: 17 },
    { name: 'The way home', id: 'homecoming', duration: 16 },
  ];
  const length = chapters.reduce((sum, chapter) => sum + chapter.duration, 0);
  let time = 0, last = null, bass = 0, mid = 0, treble = 0;
  function reset() { time = 0; last = null; bass = mid = treble = 0; }
  function line(c, points, color, width = 1) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.stroke();
  }
  function shape(c, points, color, stroke = null, width = 1) {
    c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.closePath(); c.fillStyle = color; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function oval(c, x, y, rx, ry, color) {
    c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
  }
  function tree(c, x, base, scale, p, tick, i) {
    c.save(); c.translate(x, base); c.scale(scale, scale);
    const sway = Math.sin(tick * .85 + i * 1.7) * (2 + mid * 7);
    shape(c, [-11, 4, -15, -156, 6 + sway, -204, 14, 4], p.tree);
    line(c, [-1, -112, -57 + sway, -164], `${p.tree}bb`, 8);
    for (let j = 0; j < 5; j++) {
      const a = j * TAU / 5;
      oval(c, Math.cos(a) * 40 + sway, -195 + Math.sin(a) * 31,
        45, 32, j % 2 ? p.leaf : `${p.leaf}de`);
    }
    c.restore();
  }
  function cottage(c, x, p, tick, bright = false) {
    c.fillStyle = p.tree; c.fillRect(x - 103, 273, 206, 136);
    shape(c, [x - 127, 291, x, 210, x + 127, 291], p.roof, p.light, 3);
    c.fillStyle = p.path; c.fillRect(x - 15, 335, 37, 74);
    oval(c, x + 13, 370, 2, 2, p.light);
    for (const wx of [-65, 62]) {
      c.fillStyle = bright ? p.light : `${p.light}9e`;
      c.fillRect(x + wx - 23, 309, 46, 39);
      line(c, [x + wx, 309, x + wx, 348], p.tree, 3);
      line(c, [x + wx - 23, 329, x + wx + 23, 329], p.tree, 3);
    }
    for (let i = 0; i < 3; i++) {
      oval(c, x + 58 + Math.sin(tick + i) * 9, 205 - (tick * (7 + i * 2) + i * 23) % 75,
        10 + i * 5, 6 + i * 3, `${p.sweet}49`);
    }
    c.fillStyle = p.tree; c.fillRect(x + 51, 206, 21, 38);
  }
  function bird(c, x, y, p, tick, i, peck = false) {
    const flap = Math.sin(tick * 5 + i * 1.8) * (5 + mid * 9);
    c.save(); c.translate(x, y + (peck ? Math.abs(Math.sin(tick * 2.5 + i)) * 5 : Math.sin(tick * 2 + i) * 4));
    oval(c, 0, 0, 12, 8, p.tree);
    oval(c, 10, -5, 6, 6, p.tree);
    shape(c, [15, -6, 23, -3, 15, -1], p.light);
    shape(c, [-4, 0, -23, -7 - flap, -10, 6], p.leaf);
    oval(c, 12, -6, 1.5, 1.5, p.light);
    c.restore();
  }
  function sweetHouse(c, x, p, tick) {
    const glow = .52 + bass * .25 + Math.sin(tick * 1.1) * .08;
    c.fillStyle = p.roof; c.fillRect(x - 143, 271, 286, 153);
    shape(c, [x - 169, 288, x, 181, x + 169, 288], p.roof, p.sweet, 7);
    for (let i = 0; i < 12; i++) {
      const px = x - 152 + i * 28;
      oval(c, px, 283 - Math.sin(i * Math.PI / 11) * 91, 10, 7, p.sweet);
    }
    for (const side of [-1, 1]) {
      c.fillStyle = `${p.light}${Math.round(glow * 255).toString(16).padStart(2, '0')}`;
      c.fillRect(x + side * 84 - 23, 313, 46, 49);
      line(c, [x + side * 84, 313, x + side * 84, 362], p.sweet, 5);
      line(c, [x + side * 84 - 23, 338, x + side * 84 + 23, 338], p.sweet, 4);
    }
    shape(c, [x - 31, 424, x - 31, 354, x, 332, x + 31, 354, x + 31, 424], p.deep, p.sweet, 5);
    for (let i = 0; i < 9; i++) {
      const sx = x - 132 + i * 33;
      oval(c, sx, 290 + i % 2 * 17, 5 + treble * 2, 5 + treble * 2,
        i % 3 ? p.light : p.sweet);
    }
  }
  function oven(c, x, p, tick, closed) {
    c.fillStyle = p.tree; c.fillRect(x - 122, 247, 244, 182);
    shape(c, [x - 139, 268, x, 218, x + 139, 268], p.path);
    shape(c, [x - 76, 427, x - 76, 326, x - 53, 292, x + 53, 292, x + 76, 326, x + 76, 427],
      p.deep, p.sweet, 5);
    oval(c, x, 360, 54 + bass * 8, 45 + bass * 9, `${p.light}72`);
    for (let i = 0; i < 4; i++) {
      const fx = x - 30 + i * 20;
      shape(c, [fx - 12, 414, fx + 10, 414, fx + Math.sin(tick * 3 + i) * 10, 339 - bass * 22],
        i % 2 ? p.light : p.roof);
    }
    if (closed) {
      c.fillStyle = p.tree; c.fillRect(x - 66, 301, 132, 121);
      for (let i = 0; i < 5; i++) line(c, [x - 52, 313 + i * 23, x + 52, 313 + i * 23], p.path, 3);
      oval(c, x + 47, 368, 5, 5, p.light);
    }
  }
  function duck(c, x, y, p, tick) {
    const bob = Math.sin(tick * 2.3) * (3 + bass * 2);
    c.save(); c.translate(x, y + bob);
    oval(c, 0, 0, 55, 21, '#f7f2dc');
    oval(c, 29, -25, 16, 24, '#f7f2dc');
    oval(c, 39, -39, 16, 13, '#f7f2dc');
    shape(c, [51, -39, 69, -34, 52, -30], p.roof);
    shape(c, [-6, -4, -53, -25, -37, 10], '#e8e4d0');
    oval(c, 43, -42, 2, 2, p.deep);
    c.restore();
  }
  function father(c, x, y, p, tick) {
    const welcome = Math.sin(tick * 1.2) * 4;
    line(c, [x - 11, y - 69, x - 16, y], p.deep, 12);
    line(c, [x + 11, y - 69, x + 16, y], p.deep, 12);
    shape(c, [x - 26,y - 150,x + 26,y - 150,x + 31,y - 68,x - 31,y - 68], p.tree, p.light, 2);
    line(c, [x - 24,y - 133,x - 54,y - 93 + welcome], p.sweet, 9);
    line(c, [x + 24,y - 133,x + 52,y - 90 - welcome], p.sweet, 9);
    oval(c, x, y - 170, 20, 23, p.sweet);
    shape(c, [x - 20,y - 179,x - 15,y - 198,x + 13,y - 198,x + 20,y - 179], p.deep);
    oval(c, x - 7, y - 171, 2, 2, p.deep);
    oval(c, x + 7, y - 171, 2, 2, p.deep);
    line(c, [x - 6,y - 159,x,y - 156,x + 7,y - 159], p.roof, 2);
  }
  function blinkAmount(tick, chapter, girl) {
    const worried = chapter === 'crumbs' || chapter === 'sweetHouse' || chapter === 'oven';
    const period = worried ? 3.25 : 5.1;
    const cycle = (tick + (girl ? .63 : 1.74)) % period;
    const blink = (at, width) => smooth(1 - Math.abs(cycle - at) / width);
    let amount = blink(.22, .18);
    if (worried) amount = Math.max(amount, blink(.49, .13));
    if (chapter === 'oven') amount = Math.max(amount, blink(1.18, .43) * .68);
    return amount;
  }
  function child(c, x, y, p, tick, girl, motion = 1, handRaise = 0, chapter = 'cottage') {
    const step = Math.sin(tick * 5 + (girl ? 1.3 : 0)) * (5 + mid * 5) * motion;
    c.save(); c.translate(x, y - Math.abs(step) * .24);
    oval(c, 0, 3, 20, 4, `${p.deep}61`);
    line(c, [-9, -44, -11 + step, -1], p.deep, 8);
    line(c, [9, -44, 11 - step, -1], p.deep, 8);
    shape(c, girl ? [-17,-95,16,-95,24,-43,-24,-43] : [-17,-94,17,-94,18,-45,-17,-45],
      girl ? p.cloth : p.hill, p.light, 1.5);
    line(c, [-15, -87, -25, -58 - handRaise], p.sweet, 6);
    line(c, [16, -87, 26, -60], p.sweet, 6);
    oval(c, 0, -112, 15, 17, p.sweet);
    if (girl) {
      shape(c, [-17,-117,-11,-134,11,-134,18,-115,9,-122,-8,-122], p.roof);
      line(c, [-13,-113,-16,-94], p.roof, 6);
      line(c, [13,-113,17,-94], p.roof, 6);
    } else {
      shape(c, [-17,-120,-12,-136,9,-137,17,-120], p.tree);
      line(c, [-17,-121,19,-121], p.light, 2);
    }
    const blink = blinkAmount(tick, chapter, girl);
    for (const eyeX of [-5, 6]) {
      oval(c, eyeX, -111, 2, Math.max(.18, 2 * (1 - blink)), p.deep);
      if (blink > .35) line(c, [eyeX - 2.4, -112, eyeX + 2.4, -112], p.roof, .8);
    }
    line(c, [-4,-102,0,-100,5,-102], p.roof, 1.3);
    c.restore();
  }
  function backdrop(c, p, chapter, tick) {
    const indoor = chapter === 'oven';
    const sky = c.createLinearGradient(0, 0, 0, 480);
    sky.addColorStop(0, indoor ? p.tree : p.sky);
    sky.addColorStop(1, indoor ? p.path : p.dusk);
    c.fillStyle = sky; c.fillRect(0, 0, 900, 500);
    if (indoor) {
      c.fillStyle = p.path; c.fillRect(0, 391, 900, 109);
      for (let i = 0; i < 8; i++) line(c, [i * 119, 0, i * 119, 391], `${p.sweet}3c`, 2);
      line(c, [0,391,900,391], p.sweet, 4);
      return;
    }
    oval(c, 715, 94, 46 + bass * 8, 46 + bass * 8,
      chapter === 'crumbs' || chapter === 'river' ? p.light : `${p.light}bd`);
    shape(c, [0,326,145,252,297,309,481,248,655,315,779,269,900,309,900,500,0,500], p.hill);
    c.fillStyle = p.path; c.fillRect(0, 400, 900, 100);
    shape(c, [0,426,900,401,900,470,0,477], `${p.light}40`);
    if (chapter === 'river') {
      c.fillStyle = p.dusk; c.fillRect(0, 372, 900, 128);
      for (let i = 0; i < 14; i++) {
        const x = i * 77 + Math.sin(tick * 1.1 + i) * 12;
        line(c, [x, 390 + i % 5 * 19, x + 43, 390 + i % 5 * 19], `${p.light}75`, 2);
      }
      shape(c, [0,371,173,377,247,500,0,500], p.hill);
      shape(c, [737,500,811,377,900,371,900,500], p.hill);
    } else {
      const scroll = tick * 28 % 1050;
      for (let i = 0; i < 9; i++) {
        const x = ((34 + i * 144 - scroll + 1050) % 1050) - 75;
        tree(c, x, 399, .72 + i % 3 * .14, p, tick, i);
      }
    }
  }
  function panel(c, chapter, p, tick, phase) {
    backdrop(c, p, chapter, tick);
    if (chapter === 'cottage' || chapter === 'homecoming') {
      cottage(c, 688 - phase * 170, p, tick, chapter === 'homecoming');
    }
    if (chapter === 'pebbles' || chapter === 'crumbs') {
      for (let i = 0; i < 16; i++) {
        const x = 26 + i * 54, y = 420 + (i * 17 % 29);
        if (chapter === 'pebbles') oval(c, x, y, 5 + treble, 3 + treble, p.light);
        else if (i % 3 && i / 16 > phase * .8) oval(c, x, y, 3, 2, p.sweet);
      }
      if (chapter === 'crumbs') for (let i = 0; i < 5; i++) {
        bird(c, 170 + i * 139, 375 + i % 2 * 22, p, tick, i, true);
      }
    }
    if (chapter === 'sweetHouse') {
      sweetHouse(c, 700 - phase * 195, p, tick);
      bird(c, 403, 223 + Math.sin(tick) * 11, p, tick, 0);
    }
    if (chapter === 'oven') {
      oven(c, 675, p, tick, phase > .58);
      c.fillStyle = p.deep; c.fillRect(250, 315, 89, 106);
      if (phase < .58) {
        c.save(); c.translate(294, 421); c.scale(.68, .68);
        child(c, 0, 0, p, tick, false, 0, 0, chapter); c.restore();
        for (let i = 0; i < 5; i++) line(c, [258 + i * 18,315,258 + i * 18,421], p.sweet, 4);
      } else {
        line(c, [250,315,250,421,212,427], p.sweet, 4);
      }
      if (phase < .58) {
        oval(c, 553 + phase * 75, 298, 17, 19, p.deep);
        shape(c, [534 + phase * 75,312,570 + phase * 75,312,585 + phase * 75,410,518 + phase * 75,410], p.deep);
        line(c, [554 + phase * 75,326,590 + phase * 75,354], p.deep, 7);
      }
    }
  }
  function foreground(c, chapter, p, tick, phase) {
    const walking = chapter === 'oven' ? 0 : 1;
    if (chapter === 'river') {
      const duckX = 425 + Math.sin(tick * .7) * 25;
      duck(c, duckX, 430, p, tick);
      if (phase < .5) {
        child(c, 197, 420, p, tick, true, 0, 0, chapter);
        c.save(); c.translate(duckX, 408); c.scale(.58, .58);
        child(c, 0, 0, p, tick, false, 0, 0, chapter); c.restore();
      } else {
        child(c, 704, 420, p, tick, false, 0, 0, chapter);
        c.save(); c.translate(duckX, 408); c.scale(.58, .58);
        child(c, 0, 0, p, tick, true, 0, 0, chapter); c.restore();
      }
    } else if (chapter === 'oven' && phase < .57) {
      child(c, 480, 430, p, tick, true, 0, 15, chapter);
    } else {
      if (chapter === 'homecoming' && phase > .22) father(c, 576, 422, p, tick);
      child(c, 383, 430, p, tick, false, walking, 0, chapter);
      child(c, 447, 430, p, tick, true, walking, 0, chapter);
      line(c, [406, 369, 424, 369], p.sweet, 3);
    }
    if (chapter === 'pebbles' && phase < .7) oval(c, 359, 354, 4 + treble * 2, 3 + treble, p.light);
    if (chapter === 'homecoming' && phase > .25) {
      const glow = smooth((phase - .25) / .35);
      oval(c, 418, 303, 75 * glow, 70 * glow, `${p.light}35`);
    }
  }
  function sparkles(c, p, chapter, tick, form) {
    const many = form === 'sugar' ? 43 : form === 'ink' ? 13 : 28;
    for (let i = 0; i < many; i++) {
      const x = (i * 157.3 + tick * (3 + i % 3)) % 940 - 20;
      const y = 100 + (i * 89.7 + Math.sin(tick * 1.5 + i) * 19) % 299;
      const r = .7 + (i % 3) * .6 + treble * (chapter === 'sweetHouse' ? 3.5 : 2);
      oval(c, x, y, r, r, i % 4 ? `${p.light}92` : `${p.sweet}b2`);
    }
    if (chapter === 'crumbs') for (let i = 0; i < 6; i++) {
      bird(c, 73 + i * 146, 141 + Math.sin(tick * 1.1 + i) * 14, p, tick, i);
    }
  }
  function chapterAt(t) {
    let elapsed = ((t % length) + length) % length;
    for (let i = 0; i < chapters.length; i++) {
      if (elapsed < chapters[i].duration) return { index: i, elapsed, phase: elapsed / chapters[i].duration };
      elapsed -= chapters[i].duration;
    }
    return { index: 0, elapsed: 0, phase: 0 };
  }
  function draw(c, width, height, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const form = forms.includes(opts.form) ? opts.form : 'woodland';
    const p = palettes[form], story = chapterAt(time);
    const chapter = chapters[story.index], next = chapters[(story.index + 1) % chapters.length];
    const offset = time * 28 % 900;
    const handoff = smooth((story.phase - .84) / .16);
    c.save(); c.scale(width / 900, height / 500);
    panel(c, chapter.id, p, time, story.phase);
    foreground(c, chapter.id, p, time, story.phase);
    if (handoff) {
      c.save(); c.globalAlpha = handoff;
      panel(c, next.id, p, time, 0);
      foreground(c, next.id, p, time, 0);
      c.restore();
    }
    sparkles(c, p, chapter.id, time, form);
    c.fillStyle = `${p.deep}da`; c.fillRect(20, 20, 305, 72);
    c.fillStyle = p.light; c.font = '700 22px Georgia, serif'; c.fillText('HANSEL & GRETEL', 35, 49);
    c.fillStyle = p.sweet; c.font = 'italic 15px Georgia, serif'; c.fillText(chapter.name, 35, 75);
    c.fillStyle = `${p.deep}91`; c.fillRect(30, 479, 840, 3);
    c.fillStyle = p.light; c.fillRect(30, 479, 840 * (time % length) / length, 3);
    c.restore();
    return { time, chapter: chapter.id, index: story.index, phase: story.phase, offset, form, bass, mid, treble };
  }
  return { recipes, chapters, length, draw, reset };
})();
