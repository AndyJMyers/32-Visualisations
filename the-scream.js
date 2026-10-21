/* Autumn 11: an original, music-responsive bridge scene inspired by The Scream. */
window.TheScream = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const recipes = [
    { name: 'The Burning Sky', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Flight from the Fjord', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Negative Nerves', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Electric Dread', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    burning: { sky: ['#210d24', '#8e3043', '#e47b42', '#f6b35d'], ribbons: ['#fdaf50', '#d5454d', '#ffd59a'],
      land: '#272638', water: '#34405a', bridge: '#745040', plank: '#a67152', rail: '#241e2d', figure: '#171a2a', face: '#eed2a0', glow: '#ffb26b', away: false },
    flight: { sky: ['#101d35', '#425875', '#7c7a89', '#d8a68b'], ribbons: ['#acd5d4', '#c9a2a3', '#e3caba'],
      land: '#1a2937', water: '#334b5e', bridge: '#565c60', plank: '#829097', rail: '#142330', figure: '#283341', face: '#e2c6a9', glow: '#b9d8df', away: true },
    negative: { sky: ['#d3d1bd', '#b1d2d2', '#8bd3ca', '#ecd7e4'], ribbons: ['#395666', '#534f77', '#f7f7e6'],
      land: '#b7aecb', water: '#958db3', bridge: '#b8a7c6', plank: '#ead2e0', rail: '#47396c', figure: '#eee6d5', face: '#2d4560', glow: '#477da1', away: false },
    electric: { sky: ['#090b24', '#28225c', '#69448e', '#152e5d'], ribbons: ['#e356ba', '#65d3e6', '#f9e36e'],
      land: '#141334', water: '#282957', bridge: '#553c70', plank: '#926a9c', rail: '#0b1430', figure: '#101326', face: '#d8d0ee', glow: '#ec68cb', away: true },
  };
  let time = 0, last = null, bass = 0, mid = 0, treble = 0;
  function reset() { time = 0; last = null; bass = mid = treble = 0; }
  function center(t) { return 634 - 430 * t + Math.sin(t * Math.PI) * 36; }
  function depthY(t) { return 267 + 263 * t * t; }
  function halfWidth(t) { return 22 + 229 * t * t; }
  function edge(t, side) { return center(t) + side * halfWidth(t); }

  function sky(c, p, form) {
    const grad = c.createLinearGradient(0, 0, 0, 330);
    p.sky.forEach((colour, i) => grad.addColorStop(i / 3, colour));
    c.fillStyle = grad; c.fillRect(0, 0, 900, 500);
    // Broad ribbons move at different speeds, like a painted sky refusing to stay still.
    for (let band = 0; band < 13; band++) {
      const base = 34 + band * 20;
      c.beginPath();
      for (let x = -35; x <= 940; x += 20) {
        const wave = Math.sin(x * .009 + time * (.22 + mid * .65) + band * .87) * (10 + bass * 16)
          + Math.sin(x * .023 - time * .33 + band) * 5;
        const y = base + wave;
        if (x === -35) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.globalAlpha = .17 + treble * .17;
      c.strokeStyle = p.ribbons[band % p.ribbons.length]; c.lineWidth = 5 + band * .48 + bass * 5;
      c.stroke();
    }
    c.globalAlpha = 1;
    const sun = c.createRadialGradient(685, 95, 5, 685, 95, 160 + bass * 45);
    sun.addColorStop(0, p.glow + '88'); sun.addColorStop(1, p.glow + '00');
    c.fillStyle = sun; c.fillRect(470, -100, 430, 400);
    if (form === 'electric') {
      for (let i = 0; i < 19; i++) {
        const x = (i * 193.7) % 900, y = (i * 79.3) % 235;
        c.globalAlpha = .15 + Math.max(0, Math.sin(time * 2 + i)) * .45 + treble * .2;
        c.fillStyle = p.glow; c.fillRect(x, y, 2.5, 2.5);
      }
      c.globalAlpha = 1;
    }
  }

  function fjord(c, p) {
    c.fillStyle = p.land;
    c.beginPath(); c.moveTo(0, 277);
    for (let x = 0; x <= 900; x += 25) c.lineTo(x, 258 + Math.sin(x * .014 + .5) * 18 + Math.sin(x * .036) * 8);
    c.lineTo(900, 500); c.lineTo(0, 500); c.fill();
    c.fillStyle = p.water;
    c.beginPath(); c.moveTo(600, 279); c.bezierCurveTo(715, 277, 800, 300, 900, 288);
    c.lineTo(900, 500); c.lineTo(530, 500); c.closePath(); c.fill();
    c.globalAlpha = .15 + treble * .1; c.strokeStyle = p.glow;
    for (let i = 0; i < 22; i++) {
      const y = 310 + i * 10;
      const x = 680 + Math.sin(i * 5.3 + time * .7) * 45 + i * 2;
      c.lineWidth = 1 + (i % 3); c.beginPath(); c.moveTo(x, y); c.lineTo(x + 26 + i * 2, y); c.stroke();
    }
    c.globalAlpha = 1;
  }

  function bridge(c, p) {
    c.fillStyle = p.bridge; c.beginPath(); c.moveTo(edge(0, -1), depthY(0));
    for (let i = 1; i <= 34; i++) { const t = i / 34; c.lineTo(edge(t, -1), depthY(t)); }
    for (let i = 34; i >= 0; i--) { const t = i / 34; c.lineTo(edge(t, 1), depthY(t)); }
    c.closePath(); c.fill();
    for (let i = 0; i < 26; i++) {
      const t = (i + .5) / 26, y = depthY(t);
      c.globalAlpha = .22 + t * .3; c.strokeStyle = p.plank; c.lineWidth = .5 + t * 3;
      c.beginPath(); c.moveTo(edge(t, -1), y); c.lineTo(edge(t, 1), y + 2 * t); c.stroke();
    }
    c.globalAlpha = 1;
    // The right rail is behind the traveller; the foreground left rail is drawn last.
    railing(c, p, 1);
  }

  function railing(c, p, side) {
    c.strokeStyle = p.rail; c.lineCap = 'round';
    for (let level = 0; level < 2; level++) {
      c.beginPath();
      for (let i = 0; i <= 34; i++) {
        const t = i / 34, x = edge(t, side), y = depthY(t) - (20 + 60 * t) * (1 - level * .47);
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.lineWidth = level ? 3 : 5; c.stroke();
    }
    for (let i = 0; i <= 11; i++) {
      const t = i / 11, x = edge(t, side), y = depthY(t);
      c.lineWidth = 2 + t * 4; c.beginPath(); c.moveTo(x, y + 4); c.lineTo(x, y - 20 - 60 * t); c.stroke();
    }
  }

  function person(c, p, x, footY, scale, facingAway, seed = 0) {
    const sway = Math.sin(time * (3.2 + mid * 3) + seed) * (1.5 + bass * 2.5);
    const step = Math.sin(time * (5 + mid * 3) + seed) * (2 + scale * 2);
    c.save(); c.translate(x + sway, footY); c.scale(scale, scale);
    c.fillStyle = p.figure;
    c.beginPath(); c.moveTo(-8, -54); c.quadraticCurveTo(-21, -32, -16 - step, 0);
    c.lineTo(15 + step, 0); c.quadraticCurveTo(22, -30, 8, -55); c.fill();
    c.fillStyle = p.face;
    c.beginPath(); c.ellipse(0, -68, 10.5, 17, 0, 0, TAU); c.fill();
    if (!facingAway) {
      c.fillStyle = p.figure;
      c.beginPath(); c.ellipse(-4, -72, 1.6, 2.8, 0, 0, TAU); c.ellipse(4, -72, 1.6, 2.8, 0, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(0, -61, 3.1 + bass * 1.5, 5.3 + mid * 2.5, 0, 0, TAU); c.fill();
    }
    c.strokeStyle = p.figure; c.lineWidth = 4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-9, -48); c.quadraticCurveTo(-19, -58, -11, -74);
    c.moveTo(9, -48); c.quadraticCurveTo(19, -58, 11, -74); c.stroke();
    c.restore();
  }

  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 4);
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const form = palettes[opts.form] ? opts.form : 'burning', p = palettes[form];
    const cycle = (time * .078 + .25) % 1;
    const depth = p.away ? .77 - cycle * .59 : .18 + cycle * .59;
    const fade = clamp(Math.min(cycle, 1 - cycle) * 10, 0, 1);
    c.save(); c.scale(w / 900, h / 500);
    sky(c, p, form); fjord(c, p); bridge(c, p);
    person(c, p, center(.11) - 10, depthY(.11), .35, true, 2);
    person(c, p, center(.08) + 12, depthY(.08), .3, true, 4);
    c.globalAlpha = fade;
    person(c, p, center(depth), depthY(depth) + 1, .62 + depth * 1.23, p.away);
    c.globalAlpha = 1;
    railing(c, p, -1);
    c.restore();
    return { time, form, bass, mid, treble, depth, direction: p.away ? 'away' : 'towards' };
  }
  return { recipes, draw, reset };
})();
