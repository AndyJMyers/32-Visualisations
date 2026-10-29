/* Punting with Ladies: a frosty river, sparkling bottles and ambiguous company. */
window.PuntingWithLadies = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  const forms = ['firstfrost', 'champagnemischief', 'willowreverie', 'morningafter'];
  const recipes = forms.map((form, i) => ({
    name: ['First Frost', 'Champagne Mischief', 'Willow Reverie', 'Morning After'][i],
    form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0,
  }));
  const palettes = {
    firstfrost: { sky: '#18253a', far: '#536376', water: '#253e53', ice: '#a8cad2', willow: '#768d87', gold: '#d7c398', wine: '#7d3548', lady: '#d7b5a0', coat: '#536b7a' },
    champagnemischief: { sky: '#261932', far: '#59415c', water: '#253c54', ice: '#b8d7e0', willow: '#718c7c', gold: '#ffd66f', wine: '#a33d58', lady: '#efb8c0', coat: '#7b5786' },
    willowreverie: { sky: '#24333b', far: '#647a73', water: '#315b5b', ice: '#bed9c4', willow: '#8ba887', gold: '#efdda4', wine: '#814958', lady: '#e5c2a9', coat: '#6e8581' },
    morningafter: { sky: '#555468', far: '#a08a88', water: '#667f91', ice: '#e0d9cc', willow: '#777a71', gold: '#f3d8a2', wine: '#744452', lady: '#ddc0ae', coat: '#757d8c' },
  };
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, previousBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = previousBass = 0; beats = 0; activeForm = null; }
  function line(c, x1, y1, x2, y2, color, width = 1) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function ellipse(c, x, y, rx, ry, fill, stroke, width = 1) {
    c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, TAU);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function circle(c, x, y, r, fill, stroke = null) {
    c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, TAU); c.fillStyle = fill; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
  }
  function glow(c, x, y, r, color, alpha) {
    const g = c.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, `${color}88`); g.addColorStop(1, `${color}00`);
    c.save(); c.globalAlpha = alpha; c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
  }
  function backdrop(c, p, local) {
    const sky = c.createLinearGradient(0, 0, 0, 310); sky.addColorStop(0, p.sky); sky.addColorStop(1, p.far);
    c.fillStyle = sky; c.fillRect(0, 0, 900, 500);
    c.fillStyle = `${p.gold}20`; c.beginPath(); c.arc(690, 103, 66 + treble * 12, 0, TAU); c.fill();
    c.fillStyle = p.far; c.beginPath(); c.moveTo(0, 248); c.quadraticCurveTo(180, 205, 360, 246); c.quadraticCurveTo(635, 207, 900, 243); c.lineTo(900, 322); c.lineTo(0, 322); c.fill();
    c.fillStyle = p.water; c.fillRect(0, 260, 900, 240);
    for (let row = 0; row < 13; row++) {
      const y = 278 + row * 19;
      for (let i = 0; i < 7; i++) {
        const x = (i * 157 + row * 43 + time * (12 + row) * (i % 2 ? 1 : -1)) % 1040 - 70;
        const w = 15 + (i * 11 + row * 3) % 43;
        c.globalAlpha = .15 + mid * .18 + (row % 3 === 0 ? .07 : 0);
        line(c, x, y + Math.sin(time * 1.8 + i + row) * (1 + bass * 4), x + w, y, row % 4 ? p.ice : p.gold, .7 + treble * 1.3);
      }
    }
    c.globalAlpha = 1;
    // Willow curtains frame the river and sway on the upper frequencies.
    for (const side of [-1, 1]) {
      const root = side < 0 ? 28 : 872;
      line(c, root, -10, root + side * 20, 164, p.willow, 10);
      for (let i = 0; i < 17; i++) {
        const x = root + side * (12 + i * 8), reach = 90 + (i * 31) % 118;
        c.strokeStyle = `${i % 4 ? p.willow : p.gold}b0`; c.lineWidth = 1.2 + (i % 3) * .45;
        c.beginPath(); c.moveTo(root, 14 + (i % 4) * 8);
        c.quadraticCurveTo(x + Math.sin(time * .7 + i) * (8 + treble * 15), 80 + reach * .28, x + Math.sin(time + i) * (12 + treble * 20), reach);
        c.stroke();
      }
    }
    for (let i = 0; i < 34; i++) {
      const x = (i * 71.3 + Math.sin(time * .28 + i) * 13) % 900;
      const y = (i * 43.7 + time * (8 + i % 4 * 3)) % 500;
      circle(c, x, y, .7 + (i % 3) * .35, `${p.ice}bb`);
    }
  }
  function punt(c, x, y, scale, direction, p, pose = 0) {
    c.save(); c.translate(x, y); c.scale(scale * direction, scale);
    const bob = Math.sin(time * 2.1 + x * .014) * (2 + bass * 5);
    c.translate(0, bob);
    c.fillStyle = '#171c26'; c.beginPath(); c.moveTo(-126, 0); c.quadraticCurveTo(-94, 18, 0, 16); c.quadraticCurveTo(105, 15, 128, 0); c.lineTo(108, 25); c.lineTo(-103, 25); c.closePath(); c.fill();
    c.strokeStyle = `${p.gold}bb`; c.lineWidth = 2; c.stroke();
    // Cushions and a small silver bucket keep the outing legible at a glance.
    ellipse(c, -30, -7, 34, 8, `${p.lady}bb`); ellipse(c, 53, -7, 30, 8, `${p.coat}dd`);
    c.fillStyle = '#9baeb3'; c.fillRect(73, -30, 17, 22); c.fillStyle = `${p.ice}cc`; c.fillRect(76, -27, 11, 3);
    person(c, -24, -22, p.lady, p, true, pose);
    person(c, 48, -23, p.coat, p, false, pose);
    // Long punt pole dips into the river and sweeps with the punter's stroke.
    c.save(); c.translate(70, -12); c.rotate(-.14 + Math.sin(time * 1.4 + pose) * .2);
    line(c, 0, 0, 20, 174, '#b6a07a', 4); line(c, 20, 174, 18, 193, '#ccb98e', 4); c.restore();
    c.restore();
  }
  function person(c, x, y, cloth, p, lady, pose) {
    c.save(); c.translate(x, y);
    const sway = Math.sin(time * 2.2 + pose + (lady ? 0 : 1.7)) * (.08 + mid * .06);
    c.rotate(sway);
    // A deliberately graphic, storybook silhouette rather than portrait realism.
    ellipse(c, 0, -17, lady ? 12 : 11, 20, cloth, `${p.gold}88`, 1.2);
    if (lady) {
      c.fillStyle = cloth; c.beginPath(); c.moveTo(-12, -24); c.quadraticCurveTo(-22, -9, -18, 1); c.lineTo(-12, -7); c.lineTo(-5, 0); c.lineTo(0, -9); c.lineTo(7, 0); c.lineTo(14, -10); c.quadraticCurveTo(16, -25, 9, -31); c.closePath(); c.fill();
    } else {
      c.fillStyle = '#302934'; c.fillRect(-12, -37, 24, 5);
      c.fillRect(-7, -45, 14, 9); c.fillRect(-10, -36, 20, 4);
    }
    circle(c, 0, -39, 7.3, p.lady, `${p.gold}bb`);
    c.fillStyle = '#493540'; c.beginPath(); c.arc(0, -40, 7.5, Math.PI, TAU); c.fill();
    circle(c, 2.5, -39, 1.1, '#332831');
    line(c, 0, -37, 3, -36, p.wine, 1);
    // Toasting arm rises on accents; the partner's hand pauses at a fan/flower.
    const armLift = pose > 2.1 || accent > .5 ? -.58 : .05;
    c.save(); c.translate(lady ? 10 : -9, -27); c.rotate(lady ? -armLift : armLift);
    line(c, 0, 0, lady ? 14 : -12, -12, cloth, 5);
    if (!lady) {
      line(c, -12, -12, -18, -22, p.lady, 1.5);
      c.save(); c.translate(-18, -25); c.rotate(-.3);
      ellipse(c, 0, -8, 5, 9, `${p.gold}ee`, p.gold, .8); line(c, 0, -2, 0, 9, p.gold, 1); c.restore();
    } else if (pose > 1.1) {
      line(c, 14, -12, 19, -17, p.lady, 1.5);
    }
    c.restore();
    c.restore();
  }
  function bottleMoment(c, p, local) {
    const x = 461, y = 244, pop = Math.max(0, 1 - Math.abs(local - 7.5) / 2.5);
    c.save(); c.translate(x, y); c.rotate(-.25 + Math.sin(time * .9) * .07);
    c.fillStyle = '#204b42'; c.beginPath(); c.roundRect(-9, -50, 18, 47, 5); c.fill();
    c.fillStyle = `${p.gold}dd`; c.fillRect(-5, -27, 10, 9);
    c.fillStyle = '#ded0af'; c.fillRect(-4, -59, 8, 12); c.fillStyle = '#8b5a4b'; c.fillRect(-5, -64, 10, 5);
    c.restore();
    if (pop > 0) {
      c.save(); c.globalAlpha = pop; c.translate(x, y - 60 - pop * 23); c.rotate(-.4 - pop * 2.4);
      c.fillStyle = '#8b5a4b'; c.fillRect(-4, -7, 8, 14); c.restore();
      for (let i = 0; i < 26; i++) {
        const a = i * 2.4, r = pop * (18 + i % 7 * 9);
        circle(c, x + Math.cos(a) * r, y - 60 + Math.sin(a) * r - pop * 28, .8 + i % 3 * .6, i % 5 ? p.gold : p.ice);
      }
      glow(c, x, y - 55, 90 + bass * 45, p.gold, .38);
    }
    // Glasses and bubbles drift above the boat, flickering with the treble.
    for (let i = 0; i < 14; i++) {
      const bx = x - 125 + (i * 47) % 245, by = 211 + Math.sin(time * 1.4 + i * 1.9) * (9 + treble * 8);
      if (i % 3 === 0) { ellipse(c, bx, by, 4, 8, `${p.gold}96`, `${p.ice}cf`, 1); line(c, bx - 4, by + 8, bx + 4, by + 8, p.gold, 1); }
      else circle(c, bx, by, 1.2 + treble * 1.8, i % 2 ? p.gold : p.ice);
    }
  }
  const chapters = [
    { end: 20, phase: 'FIRST FROST', caption: 'THE RIVER KEEPS ITS COUNSEL' },
    { end: 43, phase: 'THE CORK FLIES', caption: 'A TOAST, A GLANCE, A QUESTION' },
    { end: 70, phase: 'PUNTING WITH LADIES', caption: 'THE CURRENT CHOOSES A COURSE' },
    { end: 96, phase: 'CONSEQUENCES?', caption: 'A SPLASH, A LAUGH, OR A PROMISE' },
    { end: 120, phase: 'MORNING AFTER', caption: 'THE WILLOWS REMEMBER' },
  ];
  function draw(c, width, height, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'firstfrost';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5), inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * ease; mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && inputBass > .62 && previousBass <= .62) { beats++; accent = 1; }
    previousBass = inputBass; accent = Math.max(0, accent - dt * 2.1);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const progress = time % 120, index = chapters.findIndex(chapter => progress < chapter.end);
    const start = index ? chapters[index - 1].end : 0, local = progress - start, p = palettes[form];
    c.save(); c.scale(width / 900, height / 500);
    backdrop(c, p, local);
    const drift = (time * 8) % 180;
    punt(c, 285 + Math.sin(time * .22) * 20, 317 + drift * .025, 1.08, 1, p, local);
    punt(c, 730 - drift * .15, 397, .72, -1, p, local + 1.2);
    bottleMoment(c, p, local);
    // The river occasionally has its own opinion; it unsettles the punt, not the people.
    if (chapters[index].phase === 'CONSEQUENCES?') {
      const surge = Math.sin(local * 1.1) * (8 + bass * 11);
      c.save(); c.globalAlpha = .44;
      for (let i = 0; i < 8; i++) {
        c.strokeStyle = i % 2 ? p.ice : p.gold; c.lineWidth = 1 + bass * 2;
        c.beginPath(); c.moveTo(225 + i * 18, 332 + i * 4);
        c.quadraticCurveTo(302 + surge + i * 9, 301 + i * 4, 389 + i * 16, 339 + i * 4); c.stroke();
      }
      c.restore();
      for (let i = 0; i < 18; i++) {
        const x = 292 + Math.sin(time * 3 + i * 2) * (20 + i * 3), y = 309 + Math.cos(time * 2.5 + i) * (7 + i % 4 * 4);
        circle(c, x, y, 1 + bass * 2 + i % 2, i % 3 ? p.ice : p.gold);
      }
    }
    // Distant lamps and a scattering of reflected champagne glints.
    for (let i = 0; i < 9; i++) {
      const x = 68 + i * 94, y = 215 + Math.sin(i * 4) * 17;
      glow(c, x, y, 24 + mid * 14, p.gold, .18 + accent * .22);
      circle(c, x, y, 2 + treble * 1.7, p.gold);
    }
    c.fillStyle = `${p.sky}d9`; c.fillRect(24, 21, 315, 62);
    c.fillStyle = p.gold; c.font = '700 17px system-ui, sans-serif'; c.fillText(chapters[index].phase, 38, 48);
    c.fillStyle = p.ice; c.font = '12px system-ui, sans-serif'; c.fillText(chapters[index].caption, 39, 69);
    c.restore();
    return { time, phase: chapters[index].phase, form, beats };
  }
  return { recipes, draw, reset };
})();
