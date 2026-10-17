/* Autumn 03: a music-responsive web at dawn. */
window.DawnCobweb = (() => {
  const palettes = [
    { name: 'First Light', sky: ['#102638', '#715771', '#e3a377'], silk: '#e6dbe5', dew: '#c9efff', sun: '#ffe2b1' },
    { name: 'Blue Hour', sky: ['#071a31', '#344e73', '#a4baca'], silk: '#a9c7e5', dew: '#d6f7ff', sun: '#d9edff' },
    { name: 'Rose Morning', sky: ['#2b203c', '#a85e76', '#f7c2a0'], silk: '#ffd8da', dew: '#ffe3f0', sun: '#fff0c5' },
    { name: 'Gold Thread', sky: ['#202638', '#84654c', '#e8bf77'], silk: '#f3dfb3', dew: '#fff3bd', sun: '#fff1b0' },
    { name: 'Prismatic Mist', sky: ['#171d3b', '#575578', '#a9b7c2'], silk: '#d3d2ed', dew: '#f3ddff', sun: '#fff3de' },
  ];
  const recipes = palettes.map((p, i) => ({ name: p.name, form: i, theme: i % 5, speed: 1, size: 1, count: 6, grasp: .4, smiles: 0, insanity: 0 }));
  let time = 0, last = 0, energy = 0;
  function reset() { time = 0; last = 0; energy = 0; }
  const mix = (a, b, t) => a + (b - a) * t;
  function spider(c, x, y, size, phase) {
    c.save(); c.translate(x, y); c.rotate(phase * .08);
    c.strokeStyle = '#192731'; c.lineWidth = Math.max(.8, size * .13); c.lineCap = 'round';
    for (let side of [-1, 1]) for (let i = 0; i < 4; i++) {
      const bend = Math.sin(phase * 4 + i) * size * .15;
      c.beginPath(); c.moveTo(side * size * .22, (i - 1.5) * size * .22);
      c.lineTo(side * size * .72, (i - 1.5) * size * .38 + bend);
      c.lineTo(side * size, (i - 1.5) * size * .48 + bend); c.stroke();
    }
    c.fillStyle = '#17232a'; c.beginPath(); c.ellipse(0, size * .22, size * .4, size * .52, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#a99883'; c.beginPath(); c.ellipse(-size * .1, size * .02, size * .13, size * .19, -.4, 0, Math.PI * 2); c.fill(); c.restore();
  }
  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    if (!animate) last = 0;
    else {
      const dt = last ? Math.min(.1, Math.max(0, (now - last) / 1000)) : 0;
      last = now; time += dt * Math.max(.2, Number(opts.speed) || 1);
      energy += ((Number(opts.treble) || 0) - energy) * Math.min(1, dt * 3);
    }
    const palette = palettes[Math.max(0, Math.floor(Number(opts.recipeIndex) || 0)) % palettes.length];
    const gradient = c.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, palette.sky[0]); gradient.addColorStop(.58, palette.sky[1]); gradient.addColorStop(1, palette.sky[2]);
    c.fillStyle = gradient; c.fillRect(0, 0, w, h);
    const sun = c.createRadialGradient(w * .77, h * .73, 0, w * .77, h * .73, Math.max(w, h) * .6);
    sun.addColorStop(0, palette.sun + '99'); sun.addColorStop(1, palette.sun + '00'); c.fillStyle = sun; c.fillRect(0, 0, w, h);
    c.save(); c.globalAlpha = .23; c.fillStyle = '#142a30';
    for (let i = 0; i < 16; i++) { const x = (i * .137 % 1) * w; c.beginPath(); c.ellipse(x, h * (.88 + .07 * Math.sin(i)), w * .09, h * .18, i * .3, 0, Math.PI * 2); c.fill(); }
    c.restore();
    const cx = w * .5, cy = h * .46, radius = Math.min(w * .46, h * .52), spokes = 24, rings = 16;
    const drift = Math.sin(time * .32) * .012 + (Number(opts.bass) || 0) * .009;
    const point = (angle, r) => [cx + Math.cos(angle + drift * r) * radius * r, cy + Math.sin(angle + drift * r) * radius * r];
    c.save(); c.strokeStyle = palette.silk; c.lineWidth = Math.max(.6, radius * .0024); c.globalAlpha = .62;
    for (let i = 0; i < spokes; i++) { const a = i * Math.PI * 2 / spokes, p = point(a, 1); c.beginPath(); c.moveTo(cx, cy); c.lineTo(...p); c.stroke(); }
    // The final rings are steadily woven, then the web begins a new cycle.
    const growth = Math.min(rings, 5 + (time % 72) / 72 * (rings + 2));
    for (let j = 2; j <= rings; j++) {
      const visible = Math.max(0, Math.min(spokes, (growth - j) * spokes));
      if (!visible) continue;
      c.beginPath();
      for (let i = 0; i <= Math.ceil(visible); i++) { const p = point(Math.min(i, visible) * Math.PI * 2 / spokes, j / rings); if (!i) c.moveTo(...p); else c.lineTo(...p); }
      c.stroke();
    }
    c.restore();
    const weavers = Array.from({ length: 2 }, (_, i) => {
      const r = .25 + .55 * ((time * (.025 + i * .008) + i * .42) % 1);
      const a = time * (.09 + i * .025) + i * Math.PI;
      return point(a, Math.round(r * rings) / rings);
    });
    for (let j = 3; j <= Math.min(rings, Math.floor(growth)); j++) for (let i = 0; i < spokes; i++) {
      if ((i * 7 + j * 11) % 5 > 1) continue;
      const a = (i + .28 + ((j * 7 + i * 3) % 4) * .12) * Math.PI * 2 / spokes;
      const [x, y] = point(a, j / rings); const sparkle = Math.max(0, Math.sin(time * 1.2 + i * 2.9 + j * 4.1));
      if (weavers.some(([sx, sy]) => Math.hypot(x - sx, y - sy) < radius * .025)) continue;
      const size = Math.max(1, radius * (.004 + ((i + j) % 3) * .0016));
      c.fillStyle = palette.dew; c.globalAlpha = .48 + sparkle * .4; c.beginPath(); c.arc(x, y, size, 0, Math.PI * 2); c.fill();
      if (sparkle > .91 - Math.min(.12, energy * .12)) { c.globalAlpha = (sparkle - .8) * 2; c.strokeStyle = palette.sun; c.lineWidth = 1; c.beginPath(); c.moveTo(x - size * 3, y); c.lineTo(x + size * 3, y); c.moveTo(x, y - size * 3); c.lineTo(x, y + size * 3); c.stroke(); }
    }
    c.globalAlpha = 1;
    for (let i = 0; i < weavers.length; i++) {
      const [x, y] = weavers[i], size = Math.max(4, radius * .035);
      spider(c, x, y, size, time + i * 2);
      c.fillStyle = palette.dew; c.beginPath(); c.arc(x, y - size * .55, Math.max(1, size * .16), 0, Math.PI * 2); c.fill();
    }
    return { time, growth, energy };
  }
  return { draw, reset, recipes };
})();
