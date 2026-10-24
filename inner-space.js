/* Autumn 21: follow a breath from the nose to oxygen delivery in tissue. */
window.InnerSpace = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  const forms = ['anatomy', 'bioluminescent', 'watercolour', 'radiograph'];
  const recipes = [
    { name: 'Living Anatomy', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Bioluminescent', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Watercolour', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Radiograph', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    anatomy: { dark: '#111629', back: '#492438', wall: '#b96172', flesh: '#ed9b9b', rim: '#ffd0b9', air: '#a9f4ec', oxygen: '#75dce9', blood: '#b93252', red: '#ed5d68', cell: '#6c6c9b', gold: '#ffe4a0' },
    bioluminescent: { dark: '#061726', back: '#123b52', wall: '#316d80', flesh: '#6ac6b4', rim: '#b6ffdf', air: '#96d8ff', oxygen: '#6effdb', blood: '#6842a0', red: '#e974df', cell: '#406fab', gold: '#f5e681' },
    watercolour: { dark: '#263448', back: '#7c7894', wall: '#b9839a', flesh: '#e6acaa', rim: '#ffe8d7', air: '#d6f8e5', oxygen: '#a6e6e6', blood: '#ab678b', red: '#e4a0a2', cell: '#8992ae', gold: '#ffe8a5' },
    radiograph: { dark: '#061925', back: '#173d50', wall: '#296c77', flesh: '#65aeb0', rim: '#b3f6e4', air: '#d0fff1', oxygen: '#f4ffca', blood: '#337e9c', red: '#89c9db', cell: '#3d7285', gold: '#e6fcce' },
  };
  const chapters = [
    { end: 15, phase: 'NASAL PASSAGE', caption: 'A BREATH BEGINS' },
    { end: 32, phase: 'TRACHEA', caption: 'DOWN THE AIRWAY' },
    { end: 48, phase: 'BRONCHIOLES', caption: 'THE PATH BRANCHES' },
    { end: 68, phase: 'ALVEOLI', caption: 'OXYGEN CROSSES INTO BLOOD' },
    { end: 88, phase: 'CAPILLARY', caption: 'RED CELLS TAKE UP OXYGEN' },
    { end: 102, phase: 'HEART', caption: 'PUMPED TO THE BODY' },
    { end: 120, phase: 'TISSUE', caption: 'OXYGEN REACHES THE CELLS' },
  ];
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, previousBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = previousBass = 0; beats = 0; activeForm = null; }
  function circle(c, x, y, r, fill, stroke, width = 1) {
    c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, TAU);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function ellipse(c, x, y, rx, ry, fill, stroke, width = 1) {
    c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, TAU);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function line(c, x1, y1, x2, y2, color, width = 1) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function glow(c, x, y, r, color, opacity = .55) {
    const g = c.createRadialGradient(x, y, 1, x, y, r);
    g.addColorStop(0, color); g.addColorStop(.2, `${color}88`); g.addColorStop(1, `${color}00`);
    c.save(); c.globalAlpha = opacity; c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
  }
  function background(c, p, center = p.back) {
    const g = c.createRadialGradient(450, 250, 20, 450, 250, 580);
    g.addColorStop(0, center); g.addColorStop(1, p.dark);
    c.fillStyle = g; c.fillRect(0, 0, 900, 500);
  }
  function oxygen(c, x, y, r, p, brightness = 1) {
    glow(c, x, y, r * 5, p.oxygen, .2 * brightness);
    circle(c, x, y, r, p.air, p.oxygen, Math.max(.5, r * .18));
    circle(c, x - r * .25, y - r * .27, r * .24, '#ffffffaa');
  }
  function floatingBreath(c, p, local, count, spread = 1) {
    for (let i = 0; i < count; i++) {
      const drift = (local * (.14 + (i % 5) * .025) + i * .137) % 1;
      const angle = i * 2.399963;
      const depth = .1 + drift * drift * 1.9;
      const x = 450 + Math.cos(angle) * 165 * depth * spread;
      const y = 250 + Math.sin(angle) * 112 * depth * spread;
      if (x < -10 || x > 910 || y < -10 || y > 510) continue;
      oxygen(c, x, y, 1.5 + depth * 2.4 + treble * 1.2, p, .65);
    }
  }
  function nose(c, p, local) {
    background(c, p);
    const inhale = Math.sin(time * 1.7) * (6 + bass * 7);
    const walls = c.createRadialGradient(450, 250, 15, 450, 250, 380);
    walls.addColorStop(0, p.dark); walls.addColorStop(.42, p.back); walls.addColorStop(1, p.flesh);
    c.fillStyle = walls; c.fillRect(0, 0, 900, 500);
    ellipse(c, 450, 255, 300 + inhale, 175 + inhale * .5, p.back, p.rim, 15);
    ellipse(c, 450, 255, 233 + inhale * .5, 124 + inhale * .3, p.dark, p.wall, 30);
    for (let side of [-1, 1]) {
      c.strokeStyle = `${p.flesh}b8`; c.lineWidth = 17;
      for (let i = 0; i < 4; i++) {
        const x = 450 + side * (95 + i * 61);
        c.beginPath(); c.moveTo(x, 65); c.bezierCurveTo(x - side * 60, 158, x - side * 30, 342, x, 435); c.stroke();
      }
      for (let i = 0; i < 20; i++) {
        const y = 90 + i * 17;
        const x = 450 + side * (205 + Math.sin(i * 1.9) * 10);
        line(c, x, y, x - side * (24 + Math.sin(time * 3 + i) * 4), y + 15, p.rim, 1.4);
      }
    }
    floatingBreath(c, p, local, 34, .75);
  }
  function trachea(c, p, local) {
    background(c, p, p.wall);
    const shift = (local * .52) % 1;
    const tunnel = c.createRadialGradient(450, 250, 20, 450, 250, 520);
    tunnel.addColorStop(0, p.dark); tunnel.addColorStop(.4, p.back); tunnel.addColorStop(.8, p.wall); tunnel.addColorStop(1, p.flesh);
    c.fillStyle = tunnel; c.fillRect(0, 0, 900, 500);
    for (let i = 0; i < 11; i++) {
      const z = ((i / 11 + shift) % 1) ** 2;
      c.globalAlpha = .28 + z * .6;
      ellipse(c, 450, 250, 31 + z * 580, 19 + z * 360, null, p.rim, 3 + z * 23);
    }
    c.globalAlpha = 1;
    for (let side of [-1, 1]) for (let i = 0; i < 24; i++) {
      const y = 15 + i * 22, x = 450 + side * (315 + Math.sin(i * 2) * 12);
      line(c, x, y, x - side * (18 + Math.sin(time * 4 + i) * 7), y + 8, `${p.rim}aa`, 2);
    }
    floatingBreath(c, p, local, 43);
  }
  function bronchi(c, p, local) {
    background(c, p);
    const sway = Math.sin(time * .75) * 9;
    c.save(); c.translate(sway, 0);
    for (const side of [-1, 1]) {
      c.strokeStyle = p.flesh; c.lineCap = 'round'; c.lineWidth = 108;
      c.beginPath(); c.moveTo(450, -100); c.bezierCurveTo(450, 120, 450 + side * 25, 190, 450 + side * 255, 310); c.stroke();
      c.strokeStyle = p.wall; c.lineWidth = 82; c.stroke();
      c.strokeStyle = p.dark; c.lineWidth = 48; c.stroke();
      for (let i = 0; i < 4; i++) {
        const x = 450 + side * (132 + i * 77), y = 242 + i * 45;
        line(c, x, y, x + side * 140, y - 94 + i * 15, p.flesh, 46 - i * 4);
        line(c, x, y, x + side * 140, y - 94 + i * 15, p.wall, 27 - i * 3);
        line(c, x, y, x + side * 140, y - 94 + i * 15, p.dark, 12);
      }
    }
    c.restore();
    floatingBreath(c, p, local, 40, 1.35);
  }
  function alveoli(c, p, local) {
    background(c, p, p.wall);
    const sacs = [[210, 180, 95], [420, 170, 116], [665, 180, 108], [280, 365, 104], [515, 363, 113], [745, 360, 92]];
    for (const [x, y, r0] of sacs) {
      const r = r0 * (1 + Math.sin(time * 1.35 + x) * .045);
      glow(c, x, y, r * 1.5, p.air, .2);
      ellipse(c, x, y, r, r * .84, `${p.air}25`, p.rim, 5);
      ellipse(c, x, y, r * .78, r * .64, `${p.air}1c`, null);
    }
    c.strokeStyle = p.blood; c.lineWidth = 25; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-30, 120); c.bezierCurveTo(180, 520, 350, 30, 520, 390); c.bezierCurveTo(680, 560, 780, 100, 930, 345); c.stroke();
    c.strokeStyle = p.red; c.lineWidth = 6; c.stroke();
    // Motifs cross from the air sacs through the thin wall into the capillary.
    for (let i = 0; i < 34; i++) {
      const [x, y, r] = sacs[i % sacs.length];
      const a = i * 2.4, journey = (local * .26 + i * .173) % 1;
      const startX = x + Math.cos(a) * r * .35, startY = y + Math.sin(a) * r * .3;
      const endX = x + Math.cos(a) * r * 1.2, endY = y + Math.sin(a) * r;
      oxygen(c, startX + (endX - startX) * journey, startY + (endY - startY) * journey, 2 + journey * 2.2, p);
    }
    for (let i = 0; i < 9; i++) {
      const u = (local * .055 + i / 9) % 1;
      redCell(c, -35 + u * 975, 320 + Math.sin(u * 20) * 45, 13, p, u > .45);
    }
  }
  function redCell(c, x, y, r, p, oxygenated) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(time * 3 + x * .03) * .25);
    const color = oxygenated ? p.red : p.blood;
    ellipse(c, 0, 0, r * 1.35, r * .78, color, p.rim, Math.max(1, r * .08));
    ellipse(c, 0, 0, r * .49, r * .29, `${p.dark}66`, null);
    if (oxygenated) circle(c, -r * .5, -r * .22, Math.max(1, r * .13), p.gold);
    c.restore();
  }
  function bloodstream(c, p, local) {
    background(c, p, p.blood);
    const tunnel = c.createRadialGradient(450, 250, 30, 450, 250, 590);
    tunnel.addColorStop(0, p.dark); tunnel.addColorStop(.42, p.blood); tunnel.addColorStop(1, p.flesh);
    c.fillStyle = tunnel; c.fillRect(0, 0, 900, 500);
    for (let i = 0; i < 12; i++) {
      const z = ((local * .15 + i / 12) % 1) ** 2;
      c.globalAlpha = .16 + z * .3;
      ellipse(c, 450, 250, 45 + z * 580, 28 + z * 340, null, p.rim, 2 + z * 12);
    }
    c.globalAlpha = 1;
    for (let i = 0; i < 39; i++) {
      const z = (local * (.23 + i % 3 * .05) + i * .173) % 1;
      const depth = z * z;
      const a = i * 2.399963;
      const x = 450 + Math.cos(a) * depth * 520, y = 250 + Math.sin(a) * depth * 280;
      if (x < -50 || x > 950 || y < -50 || y > 550) continue;
      redCell(c, x, y, 5 + depth * 29, p, true);
      if (i % 3 === 0) oxygen(c, x + 12 + depth * 38, y - 6, 1.5 + depth * 3, p);
    }
  }
  function heart(c, p, local) {
    background(c, p, p.blood);
    const pulse = 1 + Math.pow(Math.max(0, Math.sin(time * 5 + bass * 2)), 6) * (.07 + bass * .08);
    glow(c, 450, 240, 260 * pulse, p.red, .42);
    c.save(); c.translate(450, 245); c.scale(pulse, pulse);
    c.strokeStyle = p.rim; c.lineWidth = 34; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-35, -110); c.bezierCurveTo(-85, -190, -165, -230, -172, -300); c.stroke();
    c.beginPath(); c.moveTo(40, -104); c.bezierCurveTo(90, -210, 170, -185, 220, -280); c.stroke();
    c.fillStyle = p.red; c.strokeStyle = p.rim; c.lineWidth = 8;
    c.beginPath(); c.moveTo(0, 185); c.bezierCurveTo(-230, 45, -210, -135, -75, -132);
    c.bezierCurveTo(-20, -140, 0, -98, 0, -83); c.bezierCurveTo(50, -170, 176, -144, 183, -40);
    c.bezierCurveTo(188, 42, 92, 125, 0, 185); c.fill(); c.stroke();
    line(c, 0, -70, 0, 142, `${p.blood}aa`, 8);
    c.restore();
    for (let i = 0; i < 26; i++) {
      const travel = (local * .27 + i * .139) % 1;
      const x = 450 + (travel - .5) * 720, y = 260 - Math.sin(travel * Math.PI) * 150;
      if (i % 2) oxygen(c, x, y, 2.5 + bass * 2, p, .7);
    }
  }
  function tissue(c, p, local) {
    background(c, p, p.cell);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 7; col++) {
      const x = 66 + col * 132 + (row % 2) * 60, y = 68 + row * 124;
      const r = 58 + Math.sin(time * 1.3 + row * 2 + col) * 3;
      ellipse(c, x, y, r, r * .88, `${p.flesh}36`, `${p.rim}8c`, 3);
      ellipse(c, x + 6, y + 5, r * .26, r * .23, `${p.cell}aa`, `${p.rim}77`, 1.5);
      for (let k = 0; k < 3; k++) {
        const a = k * 2.1 + col;
        ellipse(c, x + Math.cos(a) * r * .49, y + Math.sin(a) * r * .4, r * .13, r * .09, p.gold, p.rim, 1);
      }
    }
    c.strokeStyle = p.blood; c.lineWidth = 26; c.beginPath(); c.moveTo(-30, 252);
    for (let x = 0; x <= 930; x += 30) c.lineTo(x, 250 + Math.sin(x * .012 + .3) * 30); c.stroke();
    for (let i = 0; i < 30; i++) {
      const delivery = (local * (.09 + i % 3 * .008) + i * .113) % 1;
      const x = 20 + (i * 97) % 870, targetY = 80 + (i % 4) * 115;
      const y = 250 + (targetY - 250) * smooth(delivery);
      oxygen(c, x + Math.sin(time + i) * 9, y, (1 - delivery * .5) * (3 + treble * 2), p);
      if (delivery > .8) glow(c, x, targetY, 14 + bass * 18, p.gold, .12 + accent * .13);
    }
    for (let i = 0; i < 8; i++) {
      const x = (time * 52 + i * 141) % 1050 - 60;
      redCell(c, x, 251 + Math.sin(x * .012 + .3) * 30, 14, p, true);
    }
  }
  function caption(c, p, chapter, progress) {
    c.save(); c.fillStyle = `${p.dark}c9`; c.fillRect(23, 18, 312, 67);
    c.textAlign = 'left'; c.shadowColor = p.dark; c.shadowBlur = 12;
    c.fillStyle = p.rim; c.font = '700 18px system-ui, sans-serif'; c.fillText(chapter.phase, 36, 49);
    c.fillStyle = p.air; c.font = '12px system-ui, sans-serif'; c.fillText(chapter.caption, 37, 72);
    c.restore();
    c.fillStyle = `${p.rim}44`; c.fillRect(37, 459, 826, 2);
    c.fillStyle = p.oxygen; c.fillRect(37, 459, 826 * progress, 2);
    circle(c, 37 + 826 * progress, 460, 3.5, p.gold);
  }
  const scenes = [nose, trachea, bronchi, alveoli, bloodstream, heart, tissue];
  function draw(c, width, height, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'anatomy';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5), inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && inputBass > .62 && previousBass <= .62) { beats++; accent = 1; }
    previousBass = inputBass; accent = Math.max(0, accent - dt * 2);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const progress = time % 120, index = chapters.findIndex(chapter => progress < chapter.end);
    const start = index ? chapters[index - 1].end : 0;
    const local = progress - start, p = palettes[form];
    c.save(); c.scale(width / 900, height / 500);
    scenes[index](c, p, local);
    const lastSecond = Math.max(0, local - (chapters[index].end - start - 1));
    if (lastSecond && index < chapters.length - 1) {
      c.save(); c.globalAlpha = smooth(lastSecond);
      scenes[index + 1](c, p, 0); c.restore();
    }
    caption(c, p, chapters[index], progress / 120);
    if (accent) { c.globalAlpha = accent * .035; c.fillStyle = p.air; c.fillRect(0, 0, 900, 500); }
    if (progress > 119) { c.globalAlpha = progress - 119; c.fillStyle = p.dark; c.fillRect(0, 0, 900, 500); }
    c.restore();
    return { time, phase: chapters[index].phase, form, beats };
  }
  return { recipes, draw, reset };
})();
