/* Autumn 20: a music-driven voyage inwards, then out to the Milky Way. */
window.Spaced = (() => {
  const TAU = Math.PI * 2;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const smooth = value => { const x = clamp(value, 0, 1); return x * x * (3 - 2 * x); };
  const forms = ['observatory', 'aurora', 'solarwind', 'negative'];
  const recipes = [
    { name: 'Observatory', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Aurora Drive', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Solar Wind', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Photographic Negative', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const bodies = [
    { name: 'NEPTUNE', color: '#398cd5', light: '#9ae4f0', dark: '#172965', radius: 62, side: -1, type: 'gas' },
    { name: 'URANUS', color: '#80cbd0', light: '#d8fff1', dark: '#386c91', radius: 55, side: 1, type: 'gas' },
    { name: 'SATURN', color: '#c7a773', light: '#fff0bb', dark: '#795b57', radius: 69, side: -1, type: 'saturn' },
    { name: 'JUPITER', color: '#c9926d', light: '#ffdbad', dark: '#68465e', radius: 88, side: 1, type: 'jupiter' },
    { name: 'MARS', color: '#b85743', light: '#ffa668', dark: '#5d282e', radius: 48, side: -1, type: 'rock' },
    { name: 'EARTH', color: '#237abe', light: '#a8edff', dark: '#142a63', radius: 54, side: 1, type: 'earth' },
    { name: 'VENUS', color: '#cea681', light: '#fff1c2', dark: '#806078', radius: 51, side: -1, type: 'gas' },
    { name: 'MERCURY', color: '#8f8a88', light: '#e5e0c9', dark: '#464958', radius: 41, side: 1, type: 'rock' },
  ];
  const palettes = {
    observatory: { space: '#03081a', deep: '#101b46', stars: '#d7efff', trail: '#5dc2eb', glow: '#f6ce83', tint: '#9dbbfa' },
    aurora: { space: '#070c20', deep: '#25205b', stars: '#e3fff8', trail: '#72f5cc', glow: '#ff9cdd', tint: '#a68eff' },
    solarwind: { space: '#160a1c', deep: '#5d2038', stars: '#fff3d0', trail: '#ffc77f', glow: '#ffdb68', tint: '#ff7793' },
    negative: { space: '#e4e9df', deep: '#88a9bd', stars: '#243d6b', trail: '#382c83', glow: '#315dae', tint: '#bc4966' },
  };
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, previousBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = previousBass = 0; beats = 0; activeForm = null; }
  function disc(c, x, y, radius, color) { c.fillStyle = color; c.beginPath(); c.arc(x, y, radius, 0, TAU); c.fill(); }
  function line(c, x1, y1, x2, y2, color, width = 1) {
    c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function glow(c, x, y, radius, color, strength = .55) {
    const g = c.createRadialGradient(x, y, 1, x, y, radius);
    g.addColorStop(0, color); g.addColorStop(.2, `${color}88`); g.addColorStop(1, `${color}00`);
    c.save(); c.globalAlpha = strength; c.fillStyle = g; c.fillRect(x - radius, y - radius, radius * 2, radius * 2); c.restore();
  }
  function starfield(c, p, travel, far = false) {
    const bg = c.createRadialGradient(450, 245, 12, 450, 245, 630);
    bg.addColorStop(0, p.deep); bg.addColorStop(1, p.space);
    c.fillStyle = bg; c.fillRect(0, 0, 900, 500);
    for (let i = 0; i < 235; i++) {
      const angle = i * 2.399963, seed = ((i * 73.17) % 227) / 227;
      const orbit = (seed + travel * (.045 + i % 7 * .006)) % 1;
      const distance = Math.pow(orbit, far ? 1.15 : 2) * 620;
      const x = 450 + Math.cos(angle) * distance * 1.32;
      const y = 250 + Math.sin(angle) * distance * .78;
      const size = .45 + orbit * (far ? 1.6 : 2.6) + treble * .8;
      if (x < 0 || x > 900 || y < 0 || y > 500) continue;
      c.globalAlpha = .28 + orbit * .55 + Math.sin(time * 2 + i) * .1;
      if (!far && orbit > .48) {
        const streak = 2 + orbit * orbit * (15 + mid * 24);
        line(c, x - Math.cos(angle) * streak, y - Math.sin(angle) * streak * .7, x, y, p.trail, Math.max(1, size * .6));
      }
      disc(c, x, y, size, i % 9 === 0 ? p.glow : p.stars);
    }
    c.globalAlpha = 1;
  }
  function orbitLines(c, p, progress) {
    c.save(); c.globalAlpha = .10 + .07 * Math.sin(time * .6);
    for (let i = 0; i < 4; i++) {
      c.strokeStyle = i % 2 ? p.tint : p.trail; c.lineWidth = 1;
      c.beginPath(); c.ellipse(450, 250, 170 + i * 110 + progress * 16, 80 + i * 54, -.16, 0, TAU); c.stroke();
    }
    c.restore();
  }
  function planet(c, body, x, y, radius, p, phase) {
    const r = Math.max(2, radius);
    glow(c, x, y, r * 2.1, body.light, .18 + bass * .15);
    if (body.type === 'saturn') {
      c.save(); c.translate(x, y); c.rotate(-.32);
      c.strokeStyle = '#d8be9b99'; c.lineWidth = Math.max(1, r * .12);
      c.beginPath(); c.ellipse(0, 0, r * 1.82, r * .58, 0, Math.PI, TAU); c.stroke(); c.restore();
    }
    const g = c.createRadialGradient(x - r * .32, y - r * .38, r * .05, x + r * .18, y + r * .06, r * 1.3);
    g.addColorStop(0, body.light); g.addColorStop(.42, body.color); g.addColorStop(1, body.dark);
    disc(c, x, y, r, g);
    c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.clip();
    if (body.type === 'gas' || body.type === 'saturn' || body.type === 'jupiter') {
      for (let i = -4; i <= 4; i++) {
        const yy = y + i * r * .23 + Math.sin(phase * 2 + i) * r * .024;
        c.globalAlpha = .11 + (i % 3 === 0 ? .16 : 0);
        line(c, x - r, yy, x + r, yy + r * .07, i % 2 ? body.light : body.dark, r * (.08 + (i % 3 === 0 ? .025 : 0)));
      }
      if (body.type === 'jupiter') disc(c, x + r * .3, y + r * .23, r * .11, '#b75850aa');
    } else if (body.type === 'earth') {
      for (let i = 0; i < 7; i++) {
        const a = i * 2.32 + phase * .16;
        c.fillStyle = i % 2 ? '#55ac76aa' : '#d6e7e3aa';
        c.beginPath(); c.ellipse(x + Math.sin(a) * r * .62, y + Math.cos(a * 1.7) * r * .48, r * (.17 + i % 3 * .07), r * .12, a, 0, TAU); c.fill();
      }
    } else {
      for (let i = 0; i < 12; i++) disc(c, x + Math.sin(i * 2.4 + phase * .1) * r * .7, y + Math.cos(i * 1.8) * r * .65, r * (.02 + i % 3 * .018), `${body.dark}66`);
    }
    c.restore();
    c.strokeStyle = `${body.light}99`; c.lineWidth = Math.max(1, r * .015); c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    if (body.type === 'saturn') {
      c.save(); c.translate(x, y); c.rotate(-.32);
      c.strokeStyle = '#f9ddaec9'; c.lineWidth = Math.max(1, r * .15);
      c.beginPath(); c.ellipse(0, 0, r * 1.82, r * .58, 0, 0, Math.PI); c.stroke();
      c.strokeStyle = '#795b57b0'; c.lineWidth = Math.max(1, r * .025);
      c.beginPath(); c.ellipse(0, 0, r * 2.04, r * .69, 0, 0, Math.PI); c.stroke(); c.restore();
    }
  }
  function caption(c, p, title, subtitle, progress) {
    c.save(); c.textAlign = 'left'; c.shadowColor = p.space; c.shadowBlur = 12;
    c.fillStyle = p.stars; c.font = '700 18px system-ui, sans-serif'; c.fillText(title, 37, 53);
    c.globalAlpha = .7; c.font = '12px system-ui, sans-serif'; c.fillText(subtitle, 39, 75);
    c.restore();
    c.fillStyle = `${p.stars}38`; c.fillRect(38, 457, 824, 2);
    c.fillStyle = p.trail; c.fillRect(38, 457, 824 * clamp(progress, 0, 1), 2);
    disc(c, 38 + 824 * clamp(progress, 0, 1), 458, 3.5, p.glow);
  }
  function flyby(c, p, progress) {
    const index = Math.min(7, Math.floor(progress / 9));
    const local = (progress - index * 9) / 9;
    const body = bodies[index];
    starfield(c, p, time * (.45 + bass * .35)); orbitLines(c, p, local);
    // The next destination is already visible through the departing planet's limb.
    const next = bodies[index + 1];
    if (next && local > .58) planet(c, next, 450 - body.side * 62, 258, 2 + smooth((local - .58) / .42) * 18, p, 0);
    const approach = smooth(local / .82);
    const depart = smooth((local - .62) / .38);
    const radius = body.radius * (.12 + approach * 2.45);
    const x = 450 + body.side * (approach * 155 + depart * 520);
    const y = 250 + Math.sin(index * 2.3) * approach * 68 + depart * (index % 2 ? -60 : 60);
    planet(c, body, x, y, radius, p, local);
    if (body.name === 'EARTH' && local > .27) {
      const moonX = x - radius * 1.37, moonY = y - radius * .53;
      planet(c, { color: '#adb6c4', light: '#f6f0df', dark: '#565e71', type: 'rock' }, moonX, moonY, radius * .21, p, local);
    }
    caption(c, p, body.name, `INBOUND  /  ${String(index + 1).padStart(2, '0')} OF 08`, progress / 120);
    return body.name;
  }
  function sun(c, p, progress) {
    const local = clamp((progress - 72) / 20, 0, 1);
    starfield(c, p, time * (.8 + bass));
    const r = 36 + smooth(local) * 460;
    glow(c, 450, 250, r * 2, p.glow, .6);
    for (let i = 0; i < 26; i++) {
      const a = i * TAU / 26 + time * .18;
      const fringe = r * (1.06 + .06 * Math.sin(time * (2 + mid) + i * 2));
      line(c, 450 + Math.cos(a) * r * .92, 250 + Math.sin(a) * r * .92,
        450 + Math.cos(a + .04) * fringe, 250 + Math.sin(a + .04) * fringe, p.glow, 3 + treble * 7);
    }
    const g = c.createRadialGradient(450 - r * .25, 250 - r * .2, r * .05, 450, 250, r);
    g.addColorStop(0, '#fff8d5'); g.addColorStop(.48, '#ffd477'); g.addColorStop(.83, '#f37b46'); g.addColorStop(1, '#bb3350');
    disc(c, 450, 250, r, g);
    for (let i = 0; i < 16; i++) {
      const a = i * 2.4 + time * .3, rr = Math.sqrt((i * 37 % 79) / 100) * r;
      disc(c, 450 + Math.cos(a) * rr, 250 + Math.sin(a) * rr, Math.max(1, r * (.009 + i % 4 * .004)), '#fff7cc55');
    }
    caption(c, p, 'THE SUN', 'SOLAR CLOSE PASS  /  TURNING OUTWARDS', progress / 120);
    return 'THE SUN';
  }
  function galaxy(c, p, progress) {
    const local = clamp((progress - 92) / 28, 0, 1);
    starfield(c, p, time * .13, true);
    const shrink = smooth(local / .54);
    const radius = 360 * (1 - shrink) + 2;
    glow(c, 450, 250, Math.max(65, radius * 1.4), p.glow, .5);
    disc(c, 450, 250, radius, p.glow);
    if (local > .12) {
      const reveal = smooth((local - .12) / .74), size = 24 + reveal * 360;
      c.save(); c.translate(450, 250); c.rotate(-.19 - local * .13);
      glow(c, 0, 0, size * .76, p.tint, .3 + reveal * .2);
      for (let arm = 0; arm < 3; arm++) for (let i = 0; i < 240; i++) {
        const d = i / 240, a = arm * TAU / 3 + d * 5.3 + time * .018;
        const scatter = Math.sin(i * 14.31 + arm * 47) * (1 + d * 21);
        const x = Math.cos(a) * d * size + scatter * Math.sin(a);
        const y = (Math.sin(a) * d * size + scatter * Math.cos(a)) * .47;
        c.globalAlpha = (.12 + d * .46) * reveal;
        disc(c, x, y, .5 + (i % 9 === 0 ? 2.2 : 0) + bass * .75, i % 7 ? p.stars : p.tint);
      }
      c.globalAlpha = reveal;
      glow(c, 0, 0, size * .3, p.glow, .38);
      c.restore();
    }
    caption(c, p, local < .46 ? 'LEAVING THE SOLAR SYSTEM' : 'THE MILKY WAY', 'ONE STAR AMONG BILLIONS', progress / 120);
    return local < .46 ? 'SOLAR SYSTEM' : 'MILKY WAY';
  }
  function draw(c, width, height, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'observatory';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    const incomingBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (incomingBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && incomingBass > .62 && previousBass <= .62) { beats++; accent = 1; }
    previousBass = incomingBass; accent = Math.max(0, accent - dt * 1.8);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const progress = time % 120, p = palettes[form];
    c.save(); c.scale(width / 900, height / 500);
    const phase = progress < 72 ? flyby(c, p, progress) : progress < 92 ? sun(c, p, progress) : galaxy(c, p, progress);
    if (accent) {
      c.fillStyle = p.trail; c.globalAlpha = accent * .045;
      c.fillRect(0, 0, 900, 500); c.globalAlpha = 1;
    }
    const fade = Math.max(0, (progress - 119) / 1);
    if (fade) { c.fillStyle = p.space; c.globalAlpha = fade; c.fillRect(0, 0, 900, 500); }
    c.restore();
    return { time, phase, form, beats };
  }
  return { recipes, draw, reset };
})();
