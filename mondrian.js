/* Autumn 12: an animated rectilinear composition inspired by Mondrian. */
window.Mondrian = (() => {
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const hash = n => { const v = Math.sin(n * 127.1 + 78.233) * 43758.5453; return v - Math.floor(v); };
  const recipes = [
    { name: 'Primary Balance', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Midnight Grid', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Copper and Cobalt', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Boogie Woogie', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    primary: { ground: '#eee9dd', line: '#171717', colours: ['#c83225', '#d9b52d', '#254b89', '#343434'], accents: ['#e1452f', '#e8cb3d', '#2d65b0'] },
    midnight: { ground: '#19212b', line: '#d9d2bf', colours: ['#df6659', '#e7bc55', '#5182ab', '#8a8796'], accents: ['#ff8879', '#f8d273', '#7bbde1'] },
    copper: { ground: '#e5d8c3', line: '#302e37', colours: ['#ae6847', '#cfaa6e', '#3d597e', '#74687a'], accents: ['#e08b58', '#e4c77d', '#5682a2'] },
    boogie: { ground: '#f1ede0', line: '#29252c', colours: ['#ed5642', '#f4cd4b', '#527bc0', '#4b455e'], accents: ['#f7644b', '#ffe363', '#65a4e0'] },
  };
  const baseX = [0, .12, .34, .62, .82, 1];
  const baseY = [0, .18, .46, .75, 1];
  let time = 0, last = null, bass = 0, mid = 0, treble = 0;
  let lastInputBass = 0, lastBeat = -10, beatCount = 0;
  function reset() { time = 0; last = null; bass = mid = treble = 0; lastInputBass = 0; lastBeat = -10; beatCount = 0; }
  function layout(seed) {
    const xs = baseX.map((x, i) => i === 0 || i === 5 ? x : clamp(x + (hash(seed * 31 + i) - .5) * .085, .05, .94));
    const ys = baseY.map((y, i) => i === 0 || i === 4 ? y : clamp(y + (hash(seed * 43 + i) - .5) * .1, .06, .94));
    return { xs, ys };
  }
  function cellColour(seed, col, row, form) {
    if (col === (seed + 2) % 5 && row === (seed + 1) % 4) return 0;
    if (col === (seed + 3) % 5 && row === seed % 4) return 1;
    if (col === (seed + 4) % 5 && row === (seed + 2) % 4) return 2;
    const number = hash(seed * 53 + col * 19 + row * 71 + 4);
    const density = form === 'boogie' ? .49 : .33;
    if (number > density) return -1;
    return Math.floor(hash(seed * 29 + col * 23 + row * 97 + 9) * 4);
  }
  function linePresent(seed, axis, band, segment, form) {
    if (form === 'boogie') return hash(seed * 17 + axis * 419 + band * 31 + segment * 7) > .12;
    return hash(seed * 17 + axis * 419 + band * 31 + segment * 7) > .23;
  }
  function paintCell(c, p, x, y, w, h, colour, alpha) {
    if (colour < 0 || alpha <= 0) return;
    c.globalAlpha = alpha;
    c.fillStyle = p.colours[colour];
    c.fillRect(x + 2, y + 2, Math.max(0, w - 4), Math.max(0, h - 4));
    c.globalAlpha = 1;
  }
  function gridLine(c, x1, y1, x2, y2, oldOn, newOn, blend, width) {
    const alpha = mix(oldOn ? 1 : 0, newOn ? 1 : 0, blend);
    if (alpha <= 0) return;
    c.globalAlpha = alpha;
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.globalAlpha = 1;
  }
  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    const inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    if (animate && inputBass > .53 && lastInputBass <= .53 && time - lastBeat > .33) {
      lastBeat = time; beatCount++;
    }
    lastInputBass = inputBass;
    const form = palettes[opts.form] ? opts.form : 'primary', p = palettes[form];
    const cycle = time / (form === 'boogie' ? 5.4 : 7.4);
    const seed = Math.floor(cycle), phase = cycle - seed;
    const raw = clamp((phase - .63) / .37, 0, 1);
    const blend = raw * raw * (3 - 2 * raw);
    const old = layout(seed), next = layout(seed + 1);
    const xs = old.xs.map((value, i) => mix(value, next.xs[i], blend) * 900);
    const ys = old.ys.map((value, i) => mix(value, next.ys[i], blend) * 500);
    c.save(); c.scale(w / 900, h / 500);
    c.fillStyle = p.ground; c.fillRect(0, 0, 900, 500);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const x = xs[col], y = ys[row], cw = xs[col + 1] - x, ch = ys[row + 1] - y;
        const before = cellColour(seed, col, row, form), after = cellColour(seed + 1, col, row, form);
        if (before === after) paintCell(c, p, x, y, cw, ch, before, 1);
        else {
          paintCell(c, p, x, y, cw, ch, before, 1 - blend);
          paintCell(c, p, x, y, cw, ch, after, blend);
        }
      }
    }
    // Whole grid lines fade and move together, keeping every crossing continuous.
    c.strokeStyle = p.line; c.lineCap = 'butt';
    const weight = 8 + bass * 2.3;
    for (let col = 1; col < 5; col++) {
      gridLine(c, xs[col], 0, xs[col], 500,
        linePresent(seed, 0, col, 0, form), linePresent(seed + 1, 0, col, 0, form), blend, weight);
    }
    for (let row = 1; row < 4; row++) {
      gridLine(c, 0, ys[row], 900, ys[row],
        linePresent(seed, 1, row, 0, form), linePresent(seed + 1, 1, row, 0, form), blend, weight);
    }
    const beatAge = time - lastBeat;
    if (beatCount && beatAge < .48) {
      const col = Math.floor(hash(beatCount * 17) * 5);
      const row = Math.floor(hash(beatCount * 29) * 4);
      c.globalAlpha = (1 - beatAge / .48) * (.38 + bass * .38);
      c.fillStyle = p.accents[beatCount % p.accents.length];
      c.fillRect(xs[col] + 5, ys[row] + 5, xs[col + 1] - xs[col] - 10, ys[row + 1] - ys[row] - 10);
      c.globalAlpha = 1;
    }
    c.restore();
    return { time, form, bass, mid, treble, seed, blend, beatCount };
  }
  return { recipes, draw, reset };
})();
