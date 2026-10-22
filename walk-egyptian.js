/* Autumn 16: a musical passage through an impossible Egypt. */
window.WalkEgyptian = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const forms = ['gold', 'lapis', 'papyrus', 'storm'];
  const recipes = [
    { name: 'Gold of Ra', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Lapis Underworld', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Living Papyrus', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Sandstorm and Fire', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = [
    { sky: '#d47745', light: '#ffdf91', sand: '#dcb369', shadow: '#925a45', deep: '#372b4d', river: '#2e94a6', line: '#342342', gold: '#ffd064', red: '#b54637' },
    { sky: '#0b113b', light: '#5366a5', sand: '#474d8d', shadow: '#262f6f', deep: '#090c2c', river: '#134976', line: '#090e2b', gold: '#dce5ff', red: '#dd7dbc' },
    { sky: '#bc9d76', light: '#f5dfa7', sand: '#e2c996', shadow: '#ae8864', deep: '#514237', river: '#5f9d9a', line: '#49392d', gold: '#b78b39', red: '#a75544' },
    { sky: '#34243e', light: '#d35c5c', sand: '#8c4e4b', shadow: '#482943', deep: '#171323', river: '#31475a', line: '#130f1e', gold: '#ffad62', red: '#ff493f' },
  ];
  const shots = [
    ['procession', 0, 12], ['desert', 12, 22], ['nile', 22, 34],
    ['book', 34, 44], ['sphinx', 44, 54], ['battle', 54, 66],
  ];
  const routes = {
    gold: ['procession', 'desert', 'nile', 'book', 'sphinx', 'battle'],
    lapis: ['nile', 'sphinx', 'book', 'desert', 'procession', 'battle'],
    papyrus: ['book', 'procession', 'sphinx', 'nile', 'desert', 'battle'],
    storm: ['battle', 'desert', 'sphinx', 'nile', 'procession', 'book'],
  };
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, lastBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = lastBass = 0; beats = 0; activeForm = null; }
  function path(c, points, fill, stroke, width = 1) {
    c.beginPath(); c.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
    c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function line(c, x1, y1, x2, y2, color, width = 2) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function ellipse(c, x, y, rx, ry, fill, rotation = 0) {
    c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, rx, ry, rotation, 0, TAU); c.fill();
  }
  function circle(c, x, y, r, fill) { ellipse(c, x, y, r, r, fill); }
  function backdrop(c, p, t, horizon = 295) {
    const g = c.createLinearGradient(0, 0, 0, 450);
    g.addColorStop(0, p.sky); g.addColorStop(.72, p.light); g.addColorStop(1, p.sand);
    c.fillStyle = g; c.fillRect(0, 0, 900, 500);
    const sunX = 718 + Math.sin(t * .09) * 95;
    const glow = c.createRadialGradient(sunX, 115, 18, sunX, 115, 220 + bass * 40);
    glow.addColorStop(0, p.light); glow.addColorStop(.35, `${p.gold}70`); glow.addColorStop(1, `${p.gold}00`);
    c.fillStyle = glow; c.fillRect(0, 0, 900, 390);
    circle(c, sunX, 115, 42 + accent * 6, p.gold);
    path(c, [[0, horizon + 24], [190, horizon - 16], [330, horizon + 17], [540, horizon - 19], [720, horizon + 5], [900, horizon - 20], [900, 500], [0, 500]], p.shadow);
    path(c, [[0, horizon + 85], [145, horizon + 39], [420, horizon + 74], [605, horizon + 21], [900, horizon + 54], [900, 500], [0, 500]], p.sand);
    for (let i = 0; i < 26; i++) {
      const x = (i * 137 + t * (9 + bass * 24)) % 1020 - 60;
      const y = 68 + (i * 43) % 303;
      ellipse(c, x, y, 2 + i % 3, 1.1, i % 3 ? p.light : p.gold);
    }
  }
  function pyramid(c, x, y, width, height, p) {
    path(c, [[x - width / 2, y], [x, y - height], [x, y]], p.shadow);
    path(c, [[x, y - height], [x + width / 2, y], [x, y]], p.sand);
    line(c, x, y - height, x + width / 2, y, p.gold, 2);
    for (let row = 1; row < 6; row++) {
      const yy = y - height * row / 6;
      line(c, x - width * (1 - row / 6) / 2, yy, x + width * (1 - row / 6) / 2, yy, p.line, .7);
    }
  }
  function scarab(c, x, y, s, t, p) {
    c.save(); c.translate(x, y); c.scale(s, s); c.rotate(Math.sin(t * 2) * .15);
    for (const side of [-1, 1]) {
      path(c, [[0, 5], [side * 33, -12 - treble * 8], [side * 43, -2], [side * 13, 17]], p.river, p.gold, 1.5);
      for (let i = -1; i <= 1; i++) {
        line(c, side * 15, i * 11, side * (31 + i * 4), i * 21, p.line, 3);
        line(c, side * (31 + i * 4), i * 21, side * 43, i * 24 + 5, p.line, 2);
      }
    }
    ellipse(c, 0, 3, 19, 23, p.deep); ellipse(c, 0, 3, 10, 18, p.gold);
    circle(c, 0, -21, 10, p.line);
    line(c, -3, -26, -15, -37, p.line, 2); line(c, 3, -26, 15, -37, p.line, 2);
    c.restore();
  }
  function dancer(c, x, y, s, t, p, i) {
    const sway = Math.sin(t * (3.2 + mid * 3) + i * 1.6);
    c.save(); c.translate(x, y); c.scale(s, s);
    const skin = i % 3 === 0 ? '#9c5d45' : i % 3 === 1 ? '#c68157' : '#e1a873';
    line(c, 0, -87, 0, -43, skin, 11);
    path(c, [[-13, -52], [16, -52], [24, -13], [-24, -13]], i % 2 ? p.gold : '#f2dbb1', p.line, 2);
    line(c, -7, -12, -19 - sway * 8, 25, skin, 9);
    line(c, 8, -12, 23 + sway * 9, 24, skin, 9);
    line(c, -19 - sway * 8, 25, -39 - sway * 10, 27, skin, 4);
    line(c, 23 + sway * 9, 24, 41 + sway * 9, 26, skin, 4);
    line(c, -6, -80, -32 - sway * 15, -56 - sway * 11, skin, 8);
    line(c, -32 - sway * 15, -56 - sway * 11, -12, -108 - sway * 11, skin, 7);
    line(c, 6, -79, 30 + sway * 12, -98 + sway * 9, skin, 8);
    line(c, 30 + sway * 12, -98 + sway * 9, 48 + sway * 11, -77 + sway * 7, skin, 7);
    // A profile face, collar and black wig keep the pose in a drawn frieze.
    ellipse(c, 0, -108, 17, 23, skin);
    path(c, [[12, -112], [30, -107], [13, -101]], skin);
    path(c, [[-18, -127], [10, -135], [20, -123], [-8, -117], [-16, -85], [-24, -87]], p.line);
    line(c, 0, -130, 21, -131, p.gold, 5);
    circle(c, 11, -113, 2.5, p.line);
    for (let j = 0; j < 5; j++) line(c, -21 + j * 9, -76, -16 + j * 9, -67, j % 2 ? p.river : p.gold, 4);
    c.restore();
  }
  function temple(c, p, t) {
    for (let i = -1; i < 7; i++) {
      const x = i * 210 - (t * 43 % 210);
      c.fillStyle = p.shadow; c.fillRect(x, 128, 116, 306);
      c.fillStyle = p.sand; c.fillRect(x + 12, 138, 92, 287);
      c.fillStyle = p.line; c.fillRect(x - 6, 117, 129, 18); c.fillRect(x - 3, 422, 123, 18);
      for (let j = 0; j < 4; j++) {
        circle(c, x + 31 + j * 18, 171, 3, j % 2 ? p.gold : p.river);
        line(c, x + 28 + j * 20, 218, x + 41 + j * 20, 235, p.line, 2);
        line(c, x + 41 + j * 20, 235, x + 29 + j * 20, 251, p.line, 2);
      }
    }
  }
  function procession(c, p, local, form) {
    backdrop(c, p, time, 345); temple(c, p, local);
    c.fillStyle = p.deep; c.fillRect(0, 440, 900, 60);
    for (let i = 0; i < 24; i++) line(c, i * 43 - 10, 445, i * 43 + 10, 445, p.gold, 3);
    for (let i = 0; i < 6; i++) {
      const x = ((i * 186 + local * 62) % 1160) - 100;
      dancer(c, x, 417 + Math.sin(time * 5 + i) * (3 + bass * 7), .84 + (i % 3) * .12, time, p, i);
    }
    for (let i = 0; i < 4; i++) scarab(c, ((i * 257 + local * 74) % 1100) - 65, 463 + Math.sin(time * 4 + i) * 8, .37 + i % 2 * .08, time + i, p);
    if (form === 'storm') {
      c.save(); c.globalAlpha = .18 + accent * .22;
      path(c, [[0, 0], [900, 0], [610, 500], [0, 500]], p.red); c.restore();
    }
  }
  function desert(c, p, local) {
    backdrop(c, p, time, 329);
    for (let i = -1; i < 5; i++) {
      const x = i * 310 + 130 - local * 35;
      pyramid(c, x, 390 + i % 2 * 17, 340 - i % 2 * 90, 234 - i % 2 * 35, p);
    }
    path(c, [[0, 448], [220, 413], [520, 443], [900, 404], [900, 500], [0, 500]], p.sand);
    for (let i = 0; i < 11; i++) {
      const x = ((i * 123 + local * 40) % 1030) - 60;
      scarab(c, x, 438 + i % 3 * 18, .35 + i % 4 * .12, time + i, p);
    }
    dancer(c, 725 + Math.sin(local) * 24, 420, .78, time, p, 2);
  }
  function reed(c, x, y, p, sway) {
    line(c, x, y, x + sway, y - 67, p.line, 2.2);
    path(c, [[x + sway, y - 65], [x + sway - 15, y - 95], [x + sway + 6, y - 75]], p.gold);
    for (let j = 0; j < 3; j++) {
      line(c, x + sway * j / 3, y - j * 18, x + sway * j / 3 - 15, y - j * 18 - 10, p.line, 1.5);
    }
  }
  function boat(c, x, y, s, p, t, war = false, flip = 1) {
    c.save(); c.translate(x, y); c.scale(s * flip, s);
    path(c, [[-155, 4], [145, 4], [120, 42], [-107, 42]], war ? p.deep : p.line, p.gold, 3);
    path(c, [[-156, 6], [-180, -27], [-150, -18]], p.gold);
    path(c, [[145, 6], [170, -25], [137, -13]], p.gold);
    line(c, 0, 5, 0, -180, p.line, 6);
    path(c, [[-5, -170], [109, -122], [6, -78]], war ? p.light : '#f5dfb3', p.gold, 2);
    for (let i = 0; i < (war ? 5 : 3); i++) {
      const dx = -105 + i * (war ? 44 : 95);
      circle(c, dx, -15, 12, i % 2 ? p.red : p.gold);
      line(c, dx, -6, dx + Math.sin(t * 3 + i) * 7, 17, p.line, 10);
    }
    c.restore();
  }
  function nile(c, p, local) {
    backdrop(c, p, time, 280);
    pyramid(c, 205 - local * 16, 313, 160, 104, p);
    pyramid(c, 407 - local * 11, 303, 117, 78, p);
    const river = c.createLinearGradient(0, 298, 0, 500);
    river.addColorStop(0, p.river); river.addColorStop(1, p.deep);
    c.fillStyle = river; c.fillRect(0, 302, 900, 198);
    for (let i = 0; i < 22; i++) {
      const x = ((i * 151 + time * (19 + mid * 27)) % 1050) - 80;
      const y = 326 + i % 6 * 31;
      line(c, x, y, x + 55 + bass * 16, y, i % 4 ? p.light : p.gold, 1.5 + accent);
    }
    for (let i = 0; i < 19; i++) reed(c, i * 59 - local * 21 % 59, 350 + i % 3 * 15, p, Math.sin(time * 2 + i) * 8);
    boat(c, 130 + local * 39, 361 + Math.sin(time * 1.7) * 7, .95, p, time);
    boat(c, 715 - local * 28, 422 + Math.sin(time * 2) * 4, .42, p, time, false, -1);
    for (let i = 0; i < 3; i++) {
      const x = (i * 309 + local * 24) % 1020 - 60;
      line(c, x - 18, 293 + i * 14, x, 277 + i * 14 + Math.sin(time * 6) * 4, p.line, 3);
      line(c, x, 277 + i * 14 + Math.sin(time * 6) * 4, x + 18, 293 + i * 14, p.line, 3);
    }
  }
  function hieroglyph(c, x, y, i, p, t) {
    const k = i % 5;
    c.save(); c.translate(x, y); c.strokeStyle = p.line; c.fillStyle = p.line; c.lineWidth = 3;
    if (k === 0) { circle(c, 0, -14, 10, p.gold); line(c, 0, -3, 0, 19, p.line, 4); line(c, -9, 15, 9, 15, p.line, 3); }
    if (k === 1) { path(c, [[-14, 17], [-7, -17], [3, -7], [13, -20], [11, 16]], p.line); circle(c, 2, -18, 4, p.gold); }
    if (k === 2) { ellipse(c, 0, 1, 15, 9, p.river); circle(c, 12, -3, 5, p.line); line(c, -14, 2, -23, -11, p.line, 3); }
    if (k === 3) { path(c, [[-17, -15], [17, -15], [0, 16]], null, p.line, 3); circle(c, 0, -1, 4 + treble * 3, p.gold); }
    if (k === 4) { scarab(c, 0, 0, .33, t, p); }
    c.restore();
  }
  function book(c, p, local) {
    c.fillStyle = p.deep; c.fillRect(0, 0, 900, 500);
    const reveal = clamp(local / 2, 0, 1);
    const paper = c.createLinearGradient(0, 0, 900, 0);
    paper.addColorStop(0, '#896744'); paper.addColorStop(.07, '#e2c68c'); paper.addColorStop(.5, '#f1dbab'); paper.addColorStop(.93, '#dbbb7b'); paper.addColorStop(1, '#8a6643');
    c.fillStyle = paper; c.fillRect(0, 24, 900 * reveal, 452);
    if (reveal < .01) return;
    c.save(); c.beginPath(); c.rect(0, 24, 900 * reveal, 452); c.clip();
    c.strokeStyle = p.line; c.lineWidth = 5; c.strokeRect(34, 48, 832, 405);
    line(c, 40, 108, 860, 108, p.gold, 7); line(c, 40, 394, 860, 394, p.gold, 7);
    for (let row = 0; row < 2; row++) for (let i = 0; i < 17; i++) {
      hieroglyph(c, 64 + i * 47 - (local * 9 % 47), 82 + row * 343, i + row * 3, p, time);
    }
    // A stylised weighing of the heart: jackal-headed guide, feather and balance.
    dancer(c, 207, 358, 1.28, time * .3, p, 1);
    path(c, [[202, 213], [214, 172], [248, 159], [230, 190]], p.line);
    line(c, 488, 183, 488, 354, p.line, 7);
    line(c, 400, 202, 583, 202, p.line, 6);
    circle(c, 488, 189, 14, p.gold);
    for (const x of [427, 552]) {
      line(c, x, 203, x - 28, 299, p.line, 2); line(c, x, 203, x + 28, 299, p.line, 2);
      path(c, [[x - 32, 299], [x + 32, 299], [x + 19, 312], [x - 20, 312]], p.gold, p.line, 2);
    }
    path(c, [[421, 293], [405, 278], [411, 267], [428, 272], [437, 286]], p.red);
    line(c, 547, 293, 558 + Math.sin(time * 2) * 7, 254, p.line, 2);
    for (let j = 0; j < 4; j++) line(c, 548 + j * 3, 281 - j * 8, 564 + j * 5, 267 - j * 6, p.line, 1);
    scarab(c, 725, 277, .95 + bass * .12, time, p);
    c.restore();
  }
  function sphinx(c, p, local) {
    backdrop(c, p, time, 347);
    pyramid(c, 665 - local * 7, 357, 265, 210, p);
    pyramid(c, 827 - local * 4, 350, 180, 146, p);
    c.save(); c.translate(470, 394); c.scale(1.22, 1.22);
    ellipse(c, 62, -43, 189, 65, p.shadow);
    ellipse(c, 174, -19, 84, 69, p.sand);
    path(c, [[-87, -68], [-28, -115], [40, -86], [53, 24], [-95, 25]], p.sand, p.line, 3);
    path(c, [[-69, -16], [-203, 42], [-211, 55], [-53, 55], [-29, -12]], p.gold, p.line, 2);
    path(c, [[-35, -10], [-174, 42], [-173, 54], [-18, 54], [6, 0]], p.sand, p.line, 2);
    line(c, -208, 49, -177, 49, p.shadow, 2);
    line(c, -172, 49, -142, 49, p.shadow, 2);
    path(c, [[-118, -101], [-140, -162], [-119, -222], [-55, -225], [-32, -163], [-48, -92]], p.gold, p.line, 3);
    path(c, [[-139, -156], [-154, -188], [-135, -216], [-111, -203], [-118, -151]], p.river, p.line, 2);
    path(c, [[-55, -209], [-29, -183], [-43, -137], [-72, -152]], p.river, p.line, 2);
    ellipse(c, -92, -164, 37, 49, p.sand);
    path(c, [[-121, -169], [-152, -156], [-125, -150]], p.sand, p.line, 2);
    line(c, -117, -181, -91, -181, p.line, 3);
    line(c, -103, -181, -94, -175, p.line, 2);
    line(c, -112, -136, -87, -136, p.line, 2);
    path(c, [[-126, -220], [-63, -220], [-61, -208], [-129, -208]], p.gold);
    for (let i = 0; i < 4; i++) {
      line(c, -139 + i * 5, -197 + i * 13, -115 + i * 3, -186 + i * 13, p.gold, 2);
      line(c, -60 + i * 4, -194 + i * 13, -42 + i * 3, -182 + i * 13, p.gold, 2);
    }
    c.restore();
    for (let i = 0; i < 5; i++) {
      const x = ((i * 177 + local * 64) % 1030) - 40;
      ellipse(c, x, 434 + i % 3 * 15, 36, 5 + treble * 2, p.light);
    }
    scarab(c, 170 + local * 15, 442, .55, time, p);
  }
  function battle(c, p, local) {
    backdrop(c, p, time, 273);
    const g = c.createLinearGradient(0, 286, 0, 500);
    g.addColorStop(0, p.river); g.addColorStop(1, p.deep);
    c.fillStyle = g; c.fillRect(0, 289, 900, 211);
    for (let i = 0; i < 15; i++) {
      const x = ((i * 109 + time * 35) % 1000) - 40;
      line(c, x, 354 + i % 5 * 30, x + 56, 354 + i % 5 * 30, p.light, 1.5);
    }
    boat(c, 115 + local * 26, 366 + Math.sin(time * 2) * 6, 1.07, p, time, true);
    boat(c, 830 - local * 35, 391 + Math.sin(time * 2.6) * 6, 1.07, p, time, true, -1);
    const flash = Math.max(accent, Math.pow(Math.max(0, Math.sin(time * 2.8)), 18));
    if (flash > .16) {
      c.save(); c.globalAlpha = flash * .88;
      const x = 320 + Math.sin(time * 3) * 120, y = 310;
      for (let i = 0; i < 12; i++) {
        const a = i * TAU / 12;
        line(c, x, y, x + Math.cos(a) * (25 + flash * 52), y + Math.sin(a) * (25 + flash * 52), p.gold, 3);
      }
      circle(c, x, y, 12 + flash * 18, p.light);
      c.restore();
    }
    for (let i = 0; i < 9; i++) {
      const drift = (local * (7 + i % 3 * 4) + i * 59) % 520;
      ellipse(c, 286 + i * 40 + drift * .4, 270 - drift * .7, 28 + drift * .07, 16 + drift * .06, `${p.light}38`);
    }
  }
  function drawShot(c, shot, p, local, form) {
    if (shot === 'procession') procession(c, p, local, form);
    else if (shot === 'desert') desert(c, p, local);
    else if (shot === 'nile') nile(c, p, local);
    else if (shot === 'book') book(c, p, local);
    else if (shot === 'sphinx') sphinx(c, p, local);
    else battle(c, p, local);
  }
  function solarAlchemy(c, p) {
    c.save(); c.globalAlpha = .15 + accent * .24;
    const x = 718 + Math.sin(time * .09) * 95;
    for (let i = 0; i < 30; i++) {
      const a = i * TAU / 30 + time * .035;
      line(c, x + Math.cos(a) * 65, 115 + Math.sin(a) * 65,
        x + Math.cos(a) * (270 + mid * 80), 115 + Math.sin(a) * (270 + mid * 80), p.gold, i % 3 ? 2 : 5);
    }
    c.globalAlpha = .65;
    for (let i = 0; i < 19; i++) {
      const x = (i * 127 + time * (16 + bass * 30)) % 1040 - 70;
      const y = (i * 89 + Math.sin(time * 2 + i) * 24) % 500;
      circle(c, x, y, 2 + treble * 4, p.gold);
    }
    c.restore();
  }
  function lapisAlchemy(c, p) {
    c.save(); c.globalCompositeOperation = 'screen';
    for (let i = 0; i < 57; i++) {
      const x = (i * 197 + 41) % 900;
      const y = (i * 79 + 31) % 440;
      const pulse = .3 + .7 * Math.abs(Math.sin(time * (1.2 + treble * 3) + i));
      c.globalAlpha = pulse * .8;
      circle(c, x, y, 1.4 + i % 3 + accent * 2, i % 4 ? p.gold : p.red);
      if (i % 6 === 0) {
        line(c, x - 9, y, x + 9, y, p.gold, 1);
        line(c, x, y - 9, x, y + 9, p.gold, 1);
      }
      if (i % 7 === 0) {
        const nx = ((i + 4) * 197 + 41) % 900;
        const ny = ((i + 4) * 79 + 31) % 440;
        line(c, x, y, nx, ny, p.gold, .7);
      }
    }
    c.globalAlpha = .7 + accent * .2;
    c.translate(708, 114); c.rotate(time * .075);
    for (let j = 0; j < 3; j++) {
      c.strokeStyle = j === 1 ? p.red : p.gold; c.lineWidth = 2 + bass * 2;
      c.beginPath(); c.arc(0, 0, 93 + j * 23, j * .4, TAU - .45); c.stroke();
    }
    for (let j = 0; j < 12; j++) {
      const a = j * TAU / 12;
      circle(c, Math.cos(a) * 116, Math.sin(a) * 116, 3 + accent * 2, p.gold);
    }
    c.restore();
    c.save(); c.fillStyle = '#080a3270'; c.fillRect(0, 445, 900, 55);
    for (let i = 0; i < 12; i++) {
      const x = (i * 91 + time * 23) % 990 - 45;
      line(c, x, 472, x + 58, 472, p.gold, 2 + bass * 2);
    }
    c.restore();
  }
  function papyrusAlchemy(c, p, shot, local) {
    c.fillStyle = '#513b2e'; c.fillRect(0, 0, 900, 500);
    const paper = c.createLinearGradient(0, 0, 900, 0);
    paper.addColorStop(0, '#947246'); paper.addColorStop(.08, '#dec68e');
    paper.addColorStop(.48, '#f0dfae'); paper.addColorStop(.92, '#dec28a'); paper.addColorStop(1, '#86623e');
    c.fillStyle = paper; c.fillRect(13, 14, 874, 472);
    for (let i = 0; i < 56; i++) {
      c.globalAlpha = .09;
      line(c, 15 + i * 16, 16, 21 + i * 16 + Math.sin(time + i) * 3, 483, p.line, 1);
    }
    c.globalAlpha = 1;
    c.save(); c.beginPath(); c.rect(62, 75, 776, 348); c.clip();
    c.translate(60, 76); c.scale(.866, .692);
    drawShot(c, shot, p, local, 'papyrus');
    c.fillStyle = '#efdaad42'; c.fillRect(0, 0, 900, 500);
    c.restore();
    c.strokeStyle = p.line; c.lineWidth = 5; c.strokeRect(57, 70, 786, 358);
    c.strokeStyle = p.gold; c.lineWidth = 3; c.strokeRect(66, 79, 768, 340);
    for (let i = 0; i < 16; i++) {
      const x = 72 + i * 49 - (time * 12 % 49);
      hieroglyph(c, x, 41, i, p, time);
      hieroglyph(c, x + 18, 455, i + 3, p, time);
    }
    for (const x of [22, 878]) {
      c.fillStyle = '#8d643e'; c.fillRect(x - 12, 4, 24, 492);
      ellipse(c, x, 10, 20, 10, p.gold); ellipse(c, x, 490, 20, 10, p.gold);
    }
    if (accent) {
      c.save(); c.globalAlpha = accent * .35;
      c.fillStyle = p.gold; c.fillRect(62, 75, 776, 348); c.restore();
    }
  }
  function stormAlchemy(c, p) {
    c.save(); c.fillStyle = '#130d2660'; c.fillRect(0, 0, 900, 500);
    const strength = .4 + mid * .6 + accent * .5;
    for (let i = 0; i < 7; i++) {
      const x = 70 + i * 131 + Math.sin(time * .8 + i) * 19;
      const y = 365 + Math.sin(i * 2.4) * 65;
      const glow = c.createRadialGradient(x, y, 2, x, y, 44 + bass * 40);
      glow.addColorStop(0, '#ffcf6b9c');
      glow.addColorStop(.45, '#f15d3070');
      glow.addColorStop(1, '#f15d3000');
      c.fillStyle = glow; c.fillRect(x - 90, y - 90, 180, 180);
      c.globalAlpha = .45 + bass * .45;
      path(c, [[x - 8, y + 10], [x - 3, y - 11 - mid * 17], [x + 2, y - 4], [x + 7, y - 20 - accent * 19], [x + 11, y + 10]], i % 2 ? p.gold : p.red);
    }
    for (let i = 0; i < 94; i++) {
      const x = (i * 173 + time * (160 + bass * 170)) % 1220 - 170;
      const y = (i * 83 + time * 31) % 590 - 45;
      c.globalAlpha = (.12 + (i % 5) * .055) * strength;
      line(c, x, y, x + 58 + i % 4 * 21, y - 25 - i % 3 * 13, i % 3 ? p.gold : p.red, 1 + i % 3);
    }
    c.globalAlpha = .65 + accent * .3;
    path(c, [[0, 0], [170 + Math.sin(time * 1.7) * 90, 0], [0, 280]], p.deep);
    path(c, [[900, 500], [620 - Math.sin(time * 1.3) * 80, 500], [900, 180]], p.deep);
    if (accent > .04 || Math.sin(time * 2.8) > .97) {
      c.globalAlpha = Math.max(accent, .18) * .9;
      path(c, [[617, -20], [572, 150], [600, 150], [500, 350], [554, 177], [527, 177]], p.light);
      c.globalAlpha = Math.max(accent, .18) * .13;
      c.fillStyle = p.red; c.fillRect(0, 0, 900, 500);
    }
    c.restore();
  }
  function draw(c, w, h, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'gold';
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
    accent = Math.max(0, accent - dt * 2.5);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const loop = time % 66;
    const shotIndex = shots.findIndex(([, start, end]) => loop >= start && loop < end);
    const [, start, end] = shots[shotIndex];
    const shot = routes[form][shotIndex];
    const local = loop - start;
    const p = palettes[forms.indexOf(form)];
    c.save(); c.scale(w / 900, h / 500);
    c.save();
    const progress = local / (end - start);
    const zoom = form === 'papyrus' ? 1 : 1.02 + Math.sin(progress * Math.PI)
      * (form === 'storm' ? .23 + bass * .07 : shot === 'book' ? .1 : .16 + bass * .025);
    c.translate(450, 250); c.scale(zoom, zoom); c.translate(-450, -250);
    if (form === 'storm') c.translate(Math.sin(time * 18) * (2 + accent * 11), Math.sin(time * 13) * (1 + accent * 5));
    if (form === 'papyrus') papyrusAlchemy(c, p, shot, local);
    else {
      drawShot(c, shot, p, local, form);
      if (form === 'gold') solarAlchemy(c, p);
      else if (form === 'lapis') lapisAlchemy(c, p);
      else stormAlchemy(c, p);
    }
    c.restore();
    const cut = Math.min(local, end - loop);
    if (time > 0 && cut < .42) {
      c.fillStyle = p.deep;
      c.globalAlpha = (1 - cut / .42) * .72;
      c.fillRect(0, 0, 900, 500);
      c.globalAlpha = 1;
    }
    const vignette = c.createRadialGradient(450, 240, 150, 450, 245, 570);
    vignette.addColorStop(0, '#0000'); vignette.addColorStop(1, `${p.deep}a8`);
    c.fillStyle = vignette; c.fillRect(0, 0, 900, 500);
    c.restore();
    return { time, phase: shot, form, beats };
  }
  return { recipes, draw, reset };
})();
