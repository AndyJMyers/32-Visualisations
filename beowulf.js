/* Autumn 24: an illuminated, music-led passage through the Beowulf story. */
window.Beowulf = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  const forms = ['meadgold', 'inkiron', 'bloodmoon', 'wyrdfire'];
  const recipes = [
    { name: 'Mead Gold', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Ink & Iron', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Blood Moon', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Wyrd Fire', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    meadgold: { sky: '#181a2a', deep: '#0d1321', stone: '#353543', wood: '#513b39', gold: '#e6ba6b', pale: '#ffe4a1', flame: '#ef844d', water: '#235d75', shade: '#101a29', rune: '#c6a36b' },
    inkiron: { sky: '#152631', deep: '#0a1721', stone: '#485860', wood: '#30434e', gold: '#a9c6d1', pale: '#e2f1f2', flame: '#9cdbef', water: '#1d637a', shade: '#0a1b25', rune: '#8ab5c3' },
    bloodmoon: { sky: '#301a2b', deep: '#160d22', stone: '#5a3449', wood: '#603441', gold: '#ed9c93', pale: '#ffd3b6', flame: '#f45961', water: '#5c255d', shade: '#211025', rune: '#d98088' },
    wyrdfire: { sky: '#201a3a', deep: '#0a1024', stone: '#393457', wood: '#423255', gold: '#b9a4ef', pale: '#d8f9df', flame: '#7ef0bd', water: '#245c79', shade: '#12142d', rune: '#ad93ec' },
  };
  const chapters = [
    ['HEOROT', 'songs before the dark'],
    ['GRENDEL', 'the hall answers back'],
    ['THE MERE', 'under the black water'],
    ['THE DRAGON', 'gold turns to fire'],
    ['THE PYRE', 'a last song for the king'],
  ];
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, priorBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = priorBass = 0; beats = 0; activeForm = null; }
  function line(c, x1, y1, x2, y2, color, width = 1) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function dot(c, x, y, r, color) {
    c.fillStyle = color; c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, TAU); c.fill();
  }
  function polygon(c, points, fill, stroke = null, width = 1) {
    c.beginPath(); c.moveTo(points[0][0], points[0][1]);
    for (const [x, y] of points.slice(1)) c.lineTo(x, y);
    c.closePath(); c.fillStyle = fill; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function backdrop(c, p, chapter, local) {
    const bg = c.createLinearGradient(0, 0, 0, 500);
    bg.addColorStop(0, p.sky); bg.addColorStop(1, p.deep);
    c.fillStyle = bg; c.fillRect(0, 0, 900, 500);
    if (chapter === 1 || chapter === 3) {
      const x = chapter === 1 ? 740 : 690, y = 115;
      c.fillStyle = `${p.flame}45`; dot(c, x, y, 99 + bass * 30, `${p.flame}24`);
      dot(c, x, y, chapter === 1 ? 49 : 62, `${p.flame}8d`);
    }
    for (let i = 0; i < 54; i++) {
      const x = (i * 173.9 + local * (2 + i % 4)) % 940 - 20;
      const y = (i * 131.7 + Math.sin(local * .5 + i) * 9) % 460;
      dot(c, x, y, .6 + (i % 3) * .5 + treble * .8,
        i % 5 ? `${p.pale}57` : `${p.flame}86`);
    }
  }
  function border(c, p, local) {
    c.strokeStyle = `${p.rune}b0`; c.lineWidth = 2.5;
    c.strokeRect(12, 12, 876, 476); c.strokeRect(20, 20, 860, 460);
    for (const side of [1, -1]) {
      c.save(); c.translate(side === 1 ? 29 : 871, 238); c.scale(side, 1);
      for (let i = 0; i < 5; i++) {
        const y = i * 64 - 128;
        line(c, 0, y, 13, y + 14, `${p.rune}8c`, 1.5);
        line(c, 13, y + 14, 0, y + 28, `${p.rune}8c`, 1.5);
      }
      c.restore();
    }
    for (let i = 0; i < 15; i++) {
      const x = 90 + i * 51, pulse = .3 + (Math.sin(local * 2 + i * 1.8) + 1) * .24 + treble * .25;
      c.save(); c.globalAlpha = pulse;
      line(c, x - 5, 475, x, 469, p.rune, 1.4);
      line(c, x, 469, x + 5, 475, p.rune, 1.4); c.restore();
    }
  }
  function flame(c, x, y, scale, p, local, i = 0) {
    const grow = 1 + bass * .43 + accent * .15;
    c.save(); c.translate(x, y); c.scale(scale * grow, scale * grow);
    c.fillStyle = `${p.flame}52`;
    c.beginPath(); c.ellipse(0, -22, 17, 31, 0, 0, TAU); c.fill();
    c.fillStyle = p.flame; c.beginPath(); c.moveTo(-10, 0);
    c.quadraticCurveTo(-17, -22, Math.sin(local * 3 + i) * 7, -47);
    c.quadraticCurveTo(6, -22, 13, -10); c.quadraticCurveTo(11, 0, 0, 2);
    c.closePath(); c.fill();
    c.fillStyle = p.pale; c.beginPath(); c.moveTo(-4, 0);
    c.quadraticCurveTo(-7, -13, 2, -25 - mid * 8);
    c.quadraticCurveTo(6, -9, 5, 0); c.closePath(); c.fill();
    c.restore();
  }
  function hero(c, x, ground, size, p, pose = 'ready', local = 0, trophy = 0) {
    const fight = pose === 'grapple' || pose === 'shield' || pose === 'dive';
    const stride = Math.sin(local * (fight ? 2.9 : 1.2));
    const lunge = pose === 'grapple' ? Math.max(0, stride) * (17 + bass * 11) : 0;
    c.save(); c.translate(x - lunge * .45, ground - Math.abs(stride) * (fight ? 4 : 1)); c.scale(-size, size);
    for (const [hipX, bootX] of [[-16, -24 - stride * 7], [13, 19 + stride * 8]]) {
      line(c, hipX, -54, bootX, -1, p.gold, 19);
      line(c, hipX, -54, bootX, -1, p.shade, 15);
      line(c, bootX, -2, bootX + 13, 0, p.wood, 9);
    }
    c.fillStyle = p.stone; c.beginPath(); c.moveTo(-29, -131); c.lineTo(23, -131);
    c.lineTo(28, -66); c.lineTo(-26, -66); c.closePath(); c.fill();
    for (let i = 0; i < 3; i++) line(c, -22, -112 + i * 15, 22, -112 + i * 15, `${p.gold}9e`, 2);
    dot(c, -1, -148, 18, p.pale);
    polygon(c, [[-22, -151], [-15, -175], [18, -175], [24, -150]], p.stone, p.gold, 2);
    line(c, -25, -154, 25, -154, p.gold, 3);
    dot(c, 8, -149, 2, p.shade);
    const shieldX = -51 + (fight ? Math.sin(local * 2.9) * 10 : 0);
    const shieldY = (pose === 'shield' || pose === 'dive' ? -55 : -78)
      - (pose === 'shield' ? Math.max(0, -stride) * 14 : 0);
    line(c, -24, -119, shieldX + 4, shieldY, p.pale, 10);
    c.fillStyle = p.wood; c.strokeStyle = p.gold; c.lineWidth = 4;
    c.beginPath(); c.ellipse(shieldX, shieldY, 27, 36, -.12, 0, TAU); c.fill(); c.stroke();
    for (let i = -1; i <= 1; i++) line(c, shieldX - 19, shieldY + i * 13, shieldX + 19, shieldY + i * 13, `${p.gold}8c`, 1.5);
    dot(c, shieldX, shieldY, 8, p.gold);
    const handX = 42 + lunge + (pose === 'grapple' ? 28 : 0);
    const handY = -79 - (fight ? stride * 7 : 0) - trophy * 70;
    line(c, 23, -117, handX, handY, p.pale, 10);
    if (pose === 'grapple') {
      dot(c, handX, handY, 7, p.pale);
      for (let i = 0; i < 4; i++) {
        line(c, handX + 2, handY - 4, handX + 12 + i * 2, handY - 20 + i * 9, p.pale, 3);
      }
    } else if (fight) {
      const baseX = handX + 9, baseY = handY - 22;
      const tipX = baseX - 103, tipY = baseY - 17;
      const dx = tipX - baseX, dy = tipY - baseY, length = Math.hypot(dx, dy);
      const nx = -dy / length, ny = dx / length;
      line(c, handX, handY + 3, baseX, baseY, p.wood, 6);
      dot(c, handX - 2, handY + 7, 3, p.gold);
      line(c, baseX - nx * 17, baseY - ny * 17, baseX + nx * 17, baseY + ny * 17, p.gold, 4);
      polygon(c, [[baseX + nx * 6, baseY + ny * 6],
        [tipX - dx / length * 14 + nx * 3, tipY - dy / length * 14 + ny * 3],
        [tipX, tipY],
        [tipX - dx / length * 14 - nx * 3, tipY - dy / length * 14 - ny * 3],
        [baseX - nx * 6, baseY - ny * 6]],
        p.pale, p.rune, 1.2);
      line(c, baseX, baseY, tipX - dx / length * 14, tipY - dy / length * 14, `${p.rune}a0`, 1);
    }
    c.restore();
  }
  function cup(c, x, y, p, tilt = 0) {
    c.save(); c.translate(x, y); c.rotate(tilt);
    polygon(c, [[-8, -12], [8, -12], [6, 8], [-6, 8]], p.gold, p.pale, 1);
    line(c, 8, -8, 15, -5, p.pale, 2); line(c, 15, -5, 9, 4, p.pale, 2);
    c.restore();
  }
  function server(c, x, ground, p, local, offset) {
    const pace = Math.sin(local * .78 + offset);
    c.save(); c.translate(x + pace * 19, ground - Math.abs(pace) * 3);
    polygon(c, [[-13, -59], [14, -59], [26, -3], [-25, -3]], p.flame, p.gold, 1.5);
    polygon(c, [[-12, -55], [12, -55], [17, -14], [-17, -14]], p.pale, p.gold, 1);
    line(c, -8, -7, -16 - pace * 4, 0, p.stone, 6);
    line(c, 9, -7, 16 + pace * 4, 0, p.stone, 6);
    dot(c, 0, -79, 13, p.pale);
    for (let i = -1; i <= 1; i++) {
      const lock = i * 8;
      line(c, lock, -91, lock + Math.sin(local + i) * 2, -55, p.gold, 5);
    }
    line(c, -13, -58, -31, -39, p.pale, 6);
    line(c, 14, -58, 32, -39, p.pale, 6);
    cup(c, -35, -39, p, -.1); cup(c, 35, -39, p, .1);
    c.restore();
  }
  function hall(c, p, local, dark = false) {
    c.fillStyle = p.wood; c.fillRect(47, 109, 806, 333);
    polygon(c, [[30, 125], [450, 39], [870, 125]], p.stone, p.gold, 4);
    for (let i = 0; i < 7; i++) {
      const x = 99 + i * 117;
      line(c, x, 112, x, 439, `${p.gold}${dark ? '66' : 'b9'}`, 9);
      polygon(c, [[x - 18, 116], [x, 94], [x + 18, 116]], p.gold);
    }
    for (let i = 0; i < 4; i++) {
      const x = 176 + i * 185;
      c.fillStyle = p.shade; c.fillRect(x - 25, 178, 50, 120);
      c.strokeStyle = `${p.gold}9d`; c.lineWidth = 2; c.strokeRect(x - 25, 178, 50, 120);
    }
    c.fillStyle = p.shade; c.fillRect(40, 399, 820, 72);
    line(c, 39, 400, 861, 400, p.gold, 4);
    for (const x of [114, 780]) {
      line(c, x, 256, x, 338, p.gold, 6);
      flame(c, x, 260, dark ? .7 : 1, p, local, x);
    }
  }
  function heorot(c, p, local) {
    hall(c, p, local);
    for (let i = 0; i < 5; i++) {
      const x = 155 + i * 129;
      const cheer = Math.sin(local * 2 + i * 1.7) * (5 + mid * 9);
      dot(c, x, 322 + Math.sin(local * 1.4 + i) * (2 + mid * 5), 17, p.pale);
      polygon(c, [[x - 18, 314], [x - 11, 297], [x + 13, 297], [x + 20, 315]], p.gold);
      polygon(c, [[x - 25, 342], [x + 25, 342], [x + 36, 393], [x - 35, 393]], p.stone, p.gold, 1);
      line(c, x + 22, 351, x + 34, 322 + cheer, p.pale, 6);
      cup(c, x + 35, 320 + cheer, p, cheer * .018);
    }
    server(c, 320, 395, p, local, 0);
    server(c, 548, 395, p, local, 2.6);
    c.fillStyle = p.wood; c.fillRect(75, 385, 752, 29);
    line(c, 75, 384, 827, 384, p.pale, 3);
    for (let i = 0; i < 9; i++) {
      const x = 104 + i * 81;
      polygon(c, [[x - 8, 378], [x + 8, 378], [x + 5, 386], [x - 5, 386]], p.gold);
      dot(c, x, 376, 3 + bass * 2, p.pale);
    }
    hero(c, 733 + Math.sin(local * .8) * 10, 411, .8, p, 'ready', local);
  }
  function grendel(c, p, local, step) {
    hall(c, p, local, true);
    const reach = smooth(step / 10), surge = Math.sin(local * 2.4) * (12 + bass * 14);
    const tear = smooth((step - 7) / 3), trophy = smooth((step - 10) / 4);
    const x = 175 + reach * 112 + surge - smooth((step - 10) / 5) * 85;
    c.save(); c.translate(x, 401 + Math.abs(surge) * .2); c.rotate(Math.sin(local * 1.5) * .045);
    c.fillStyle = p.shade; c.strokeStyle = `${p.flame}a0`; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-127, 0); c.bezierCurveTo(-158, -123, -123, -232, -19, -250);
    c.bezierCurveTo(99, -224, 120, -86, 87, 0); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(0, -230, 84, 65, -.2, 0, TAU); c.fill();
    for (const eye of [-33, 39]) polygon(c,
      [[eye - 13, -245], [eye + 10, -242], [eye + 2, -230 - accent * 3]], p.flame);
    const jaw = 11 + Math.max(0, Math.sin(local * 3)) * 13;
    polygon(c, [[-39, -200], [48, -204], [37, -186 + jaw], [-25, -185 + jaw]], p.flame);
    for (let i = 0; i < 5; i++) {
      const x = -31 + i * 17;
      polygon(c, [[x, -199], [x + 8, -199], [x + 4, -184]], p.pale);
      polygon(c, [[x + 3, -185 + jaw], [x + 12, -185 + jaw], [x + 7, -200 + jaw]], p.pale);
    }
    for (let i = 0; i < 8; i++) {
      const y = -130 + i * 15;
      line(c, -98 + i % 3 * 9, y, -72 + i % 3 * 9, y - 19, `${p.rune}60`, 2);
    }
    const clawSwing = Math.sin(local * 2.2) * 22;
    const armReach = smooth((step - 4) / 4) * 70;
    c.save(); c.globalAlpha *= 1 - tear;
    line(c, 76, -177, 192 - reach * 28 + clawSwing + armReach,
      -131 + clawSwing * .4, p.shade, 33);
    for (let i = 0; i < 4; i++) {
      const tipX = 182 - reach * 28 + i * 10 + clawSwing + armReach;
      line(c, 174 - reach * 28 + clawSwing + armReach,
        -132 + clawSwing * .4, tipX, -173 + i * 12, p.shade, 11);
      line(c, tipX, -173 + i * 12, tipX + 6, -186 + i * 12, p.gold, 2);
    }
    c.restore();
    if (tear) {
      dot(c, 76, -177, 15, '#7f303b');
      for (let i = 0; i < 5; i++) {
        const angle = i * TAU / 5;
        polygon(c, [[76 + Math.cos(angle) * 9, -177 + Math.sin(angle) * 9],
          [76 + Math.cos(angle + .4) * 23, -177 + Math.sin(angle + .4) * 23],
          [76 + Math.cos(angle - .4) * 16, -177 + Math.sin(angle - .4) * 16]], p.flame);
      }
    }
    c.restore();
    if (tear) {
      const stumpX = 385 + trophy * 20, stumpY = 242 - trophy * 47;
      const gripX = 520 - trophy * 5, gripY = 330 - trophy * 78;
      c.save(); c.globalAlpha = tear;
      line(c, stumpX, stumpY, gripX - 8, gripY, p.rune, 36);
      line(c, stumpX, stumpY, gripX - 8, gripY, p.shade, 30);
      dot(c, stumpX, stumpY, 15, '#7f303b');
      for (let i = 0; i < 4; i++) {
        line(c, gripX - 13, gripY, gripX + i * 6 - 11, gripY - 21 + i * 12, p.shade, 8);
      }
      c.restore();
    }
    hero(c, 665 - reach * 48 + Math.sin(local * 2.4) * 12, 423, 1.12, p, 'grapple', local, trophy);
    const ripBurst = Math.sin(Math.PI * clamp((step - 7) / 4, 0, 1));
    for (let i = 0; i < 9; i++) {
      const angle = i * TAU / 9 + local * .3;
      const burst = 12 + ripBurst * (24 + accent * 42 + bass * 20);
      const burstX = x + 76, burstY = 224 + Math.abs(surge) * .2;
      line(c, burstX + Math.cos(angle) * 9, burstY + Math.sin(angle) * 9,
        burstX + Math.cos(angle) * burst, burstY + Math.sin(angle) * burst,
        i % 2 ? p.gold : p.flame, 1 + treble * 2);
    }
  }
  function mere(c, p, local, step) {
    const water = c.createLinearGradient(0, 125, 0, 500);
    water.addColorStop(0, p.water); water.addColorStop(1, p.deep);
    c.fillStyle = water; c.fillRect(32, 125, 836, 347);
    for (let i = 0; i < 8; i++) {
      const y = 153 + i * 42 + Math.sin(local * 1.1 + i) * (3 + mid * 5);
      line(c, 45, y, 853, y, `${p.pale}${(40 + i * 8).toString(16)}`, 1.5);
    }
    for (let i = 0; i < 35; i++) {
      const x = (i * 127.3 + Math.sin(local + i) * 22) % 820 + 40;
      const y = 460 - ((local * (8 + i % 4) + i * 58) % 313);
      dot(c, x, y, 2 + i % 3 + treble * 2, `${p.pale}75`);
    }
    c.save(); c.translate(430 + Math.sin(local * .7) * 25, 290 + Math.sin(local * 1.4) * 16);
    c.rotate(.29 + Math.sin(local * .7) * .14);
    hero(c, 0, 144, .88, p, step > 8 ? 'dive' : 'shield', local);
    c.restore();
    const hunt = Math.sin(local * 1.25) * 30, rise = Math.sin(local * 1.8) * 11;
    c.save(); c.translate(hunt, rise);
    c.fillStyle = p.shade; c.strokeStyle = `${p.rune}b0`; c.lineWidth = 3;
    c.beginPath(); c.moveTo(806, 468);
    c.bezierCurveTo(673, 436, 805, 329, 680, 294);
    c.bezierCurveTo(615, 272, 591, 325, 632, 352);
    c.bezierCurveTo(571, 319, 566, 224, 668, 206);
    c.bezierCurveTo(801, 197, 865, 321, 806, 468); c.fill(); c.stroke();
    dot(c, 663, 269, 6 + accent * 4, p.flame);
    const swipe = Math.sin(local * 2.5) * 22;
    line(c, 636, 311, 553 + swipe, 350 - swipe, p.shade, 27);
    line(c, 553 + swipe, 350 - swipe, 513 + swipe, 340 - swipe, p.shade, 18);
    for (let i = 0; i < 3; i++) {
      line(c, 513 + swipe + i * 9, 340 - swipe, 494 + swipe + i * 11, 325 - swipe + i * 6, p.rune, 4);
    }
    for (let i = 0; i < 5; i++) {
      const x = 635 + i * 32;
      line(c, x, 423, x + Math.sin(local + i) * 12, 326, `${p.rune}96`, 2);
    }
    c.restore();
  }
  function dragon(c, p, local) {
    polygon(c, [[25, 396], [153, 280], [263, 350], [423, 248], [561, 332], [781, 277], [876, 391], [876, 472], [25, 472]], p.stone);
    for (let i = 0; i < 34; i++) {
      const x = 60 + (i * 97) % 779, y = 444 - (i * 29) % 28;
      dot(c, x, y, 3 + i % 5, `${p.gold}a1`);
    }
    c.save(); c.translate(651 + Math.sin(local * .6) * 20, 212 + Math.sin(local * 1.2) * 13); c.scale(-1, 1);
    c.fillStyle = p.shade; c.strokeStyle = p.gold; c.lineWidth = 3;
    c.beginPath(); c.moveTo(-184, 138);
    c.bezierCurveTo(-225, 13, -64, -91, 61, -71);
    c.bezierCurveTo(151, -126, 230, -91, 224, -39);
    c.bezierCurveTo(204, -3, 170, 14, 112, -2);
    c.bezierCurveTo(38, 35, 3, 132, -184, 138); c.fill(); c.stroke();
    for (let i = 0; i < 12; i++) {
      const x = -103 + i * 22, y = 42 + Math.sin(i * .8) * 12;
      polygon(c, [[x - 8, y], [x, y - 12], [x + 8, y]], `${p.rune}a6`);
    }
    const flap = Math.sin(local * 2.1) * (20 + mid * 18);
    polygon(c, [[-113, 20], [-167, -124 - flap], [18, -29 - flap * .4], [53, 62]], p.shade, p.gold, 2);
    polygon(c, [[-38, -37], [39, -159 - flap], [119, -57 - flap * .3], [103, 45]], p.shade, p.gold, 2);
    for (let i = 0; i < 7; i++) line(c, -128 + i * 25, -82 + i * 8, -42 + i * 20, 25, `${p.rune}8b`, 1.4);
    polygon(c, [[191, -69], [245, -77], [229, -43], [197, -36]], p.shade, p.gold, 2);
    dot(c, 189, -51, 7 + accent * 3, p.flame);
    for (let i = 0; i < 3; i++) polygon(c,
      [[153 + i * 19, -83], [162 + i * 19, -111], [178 + i * 19, -75]], p.gold);
    for (let i = 0; i < 4; i++) polygon(c,
      [[203 + i * 10, -49], [208 + i * 10, -34], [213 + i * 10, -48]], p.pale);
    c.restore();
    const plume = 1 + bass * .3 + accent * .18;
    for (let i = 0; i < 7; i++) {
      const x = 408 - i * 25 * plume;
      const y = 165 + Math.sin(local * 2.7 + i) * (4 + mid * 9) + i * 8;
      flame(c, x, y, (.23 + (7 - i) * .045) * plume, p, local, i);
    }
    hero(c, 255, 447, 1.14, p, 'shield', local);
  }
  function pyre(c, p, local) {
    const sea = c.createLinearGradient(0, 285, 0, 500);
    sea.addColorStop(0, p.water); sea.addColorStop(1, p.deep);
    c.fillStyle = sea; c.fillRect(29, 285, 842, 184);
    polygon(c, [[157, 375], [744, 375], [666, 435], [246, 435]], p.wood, p.gold, 4);
    for (let i = 0; i < 9; i++) {
      const x = 238 + i * 53;
      line(c, x, 387, x + 15, 425, `${p.gold}9c`, 2);
    }
    line(c, 450, 375, 450, 131, p.gold, 7);
    polygon(c, [[449, 147], [572, 228], [449, 228]], `${p.pale}56`, p.gold, 2);
    polygon(c, [[451, 155], [333, 228], [451, 228]], `${p.rune}54`, p.gold, 2);
    for (let i = 0; i < 11; i++) {
      const x = 310 + i * 28;
      flame(c, x, 374, .42 + (i % 4) * .13 + bass * .15, p, local, i);
    }
    for (let i = 0; i < 35; i++) {
      const x = 292 + (i * 61 + Math.sin(local * .8 + i) * 32) % 331;
      const y = 354 - (local * (14 + i % 6) + i * 28) % 316;
      dot(c, x, y, 1.5 + treble * 2 + i % 3, i % 3 ? `${p.flame}a6` : `${p.pale}ca`);
    }
    for (let i = 0; i < 9; i++) {
      const y = 447 + i * 4;
      line(c, 235 + i * 9, y, 675 - i * 8, y, `${p.gold}45`, 1);
    }
  }
  function scene(c, chapter, p, local, step, opacity) {
    c.save(); c.globalAlpha = opacity;
    backdrop(c, p, chapter, local);
    if (chapter === 0) heorot(c, p, local);
    else if (chapter === 1) grendel(c, p, local, step);
    else if (chapter === 2) mere(c, p, local, step);
    else if (chapter === 3) dragon(c, p, local);
    else pyre(c, p, local);
    c.restore();
  }
  function draw(c, width, height, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'meadgold';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5), incomingBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (incomingBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && incomingBass > .62 && priorBass <= .62) { beats++; accent = 1; }
    priorBass = incomingBass; accent = Math.max(0, accent - dt * 2.1);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const local = time % 90, chapter = Math.floor(local / 18), step = local % 18;
    const blend = smooth((step - 15) / 3), p = palettes[form];
    c.save(); c.scale(width / 900, height / 500);
    scene(c, chapter, p, local, step, 1);
    if (blend) scene(c, (chapter + 1) % 5, p, local, 0, blend);
    const shown = blend > .5 ? (chapter + 1) % 5 : chapter;
    border(c, p, local);
    c.fillStyle = `${p.shade}d8`; c.fillRect(28, 29, 273, 69);
    c.fillStyle = p.pale; c.font = '700 22px Georgia, serif'; c.fillText('BEOWULF', 43, 57);
    c.fillStyle = p.gold; c.font = 'italic 13px Georgia, serif';
    c.fillText(`${chapters[shown][0].toLowerCase()} / ${chapters[shown][1]}`, 43, 80);
    c.fillStyle = `${p.shade}9c`; c.fillRect(37, 466, 826, 3);
    c.fillStyle = p.gold; c.fillRect(37, 466, 826 * local / 90, 3);
    c.restore();
    return { time, chapter: shown, form, beats, blend };
  }
  return { recipes, draw, reset };
})();
