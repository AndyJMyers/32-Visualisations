/* Autumn 03: a music-responsive flight through webs at dawn. */
window.DawnCobweb = (() => {
  const palettes = [
    { name: 'First Light', sky: ['#102638', '#715771', '#e3a377'], silk: '#e6dbe5', dew: '#c9efff', sun: '#ffe2b1', flow: .30, twist: .12, tear: .13, layers: 5, rays: 20 },
    { name: 'Blue Hour', sky: ['#071a31', '#344e73', '#a4baca'], silk: '#a9c7e5', dew: '#d6f7ff', sun: '#d9edff', flow: .22, twist: -.35, tear: .28, layers: 6, rays: 16 },
    { name: 'Rose Morning', sky: ['#2b203c', '#a85e76', '#f7c2a0'], silk: '#ffd8da', dew: '#ffe3f0', sun: '#fff0c5', flow: .36, twist: .65, tear: .17, layers: 5, rays: 24 },
    { name: 'Gold Thread', sky: ['#100f1d', '#584638', '#b58a52'], silk: '#ffdc8f', dew: '#fff4d4', sun: '#ffdf99', flow: .74, twist: -.25, tear: .42, layers: 6, rays: 20 },
    { name: 'Prismatic Mist', sky: ['#171d3b', '#575578', '#a9b7c2'], silk: '#d3d2ed', dew: '#f3ddff', sun: '#fff3de', flow: .52, twist: .85, tear: .34, layers: 6, rays: 18 },
  ];
  const recipes = palettes.map((p, i) => ({ name: p.name, form: i, theme: i % 5, speed: 1, size: 1, count: 6, grasp: .4, smiles: 0, insanity: 0 }));
  let time = 0, last = 0, energy = 0;
  function reset() { time = 0; last = 0; energy = 0; }
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const fract = n => n - Math.floor(n);
  const mix = (a, b, t) => a + (b - a) * t;

  function spider(c, x, y, size, phase, variant) {
    c.save(); c.translate(x, y); c.rotate(phase * .08);
    c.strokeStyle = variant ? '#30213b' : '#192731'; c.lineWidth = Math.max(.8, size * .10); c.lineCap = 'round';
    for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
      const bend = Math.sin(phase * 4 + i) * size * .15;
      c.beginPath(); c.moveTo(side * size * .22, (i - 1.5) * size * .22);
      c.lineTo(side * size * .72, (i - 1.5) * size * .38 + bend);
      c.lineTo(side * size, (i - 1.5) * size * .48 + bend); c.stroke();
    }
    c.fillStyle = variant ? '#39263e' : '#17232a'; c.beginPath(); c.ellipse(0, size * .22, size * .4, size * .52, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = variant ? '#d0996c' : '#93b1aa'; c.beginPath(); c.ellipse(-size * .12, size * .10, size * .11, size * .18, -.35, 0, Math.PI * 2); c.fill();
    c.restore();
  }

  function trapped(c, x, y, size, kind, phase, silk, feeding = 0) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(phase * .8) * .16 + kind * .5);
    if (kind === 4) {
      // A stylised phage: faceted head, delicate tail and angular landing fibres.
      c.lineWidth = Math.max(.8, size * .07); c.strokeStyle = '#c5eff5'; c.fillStyle = '#5572aa';
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 3 * i - Math.PI / 6;
        const px = Math.cos(a) * size * .48, py = Math.sin(a) * size * .45 - size * .35;
        if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = '#e4d4ff'; c.beginPath(); c.moveTo(0, size * .1); c.lineTo(0, size * .62);
      for (const side of [-1, 1]) {
        c.moveTo(0, size * .5); c.lineTo(side * size * .42, size * .82); c.lineTo(side * size * .62, size * .75);
        c.moveTo(0, size * .58); c.lineTo(side * size * .23, size * .98);
      }
      c.stroke(); c.fillStyle = '#f4e5ff'; c.beginPath(); c.arc(-size * .14, -size * .48, size * .07, 0, Math.PI * 2); c.fill();
      c.strokeStyle = silk; c.globalAlpha *= .7; c.lineWidth = Math.max(.6, size * .035);
      c.beginPath(); c.moveTo(-size * .8, -size * .75); c.lineTo(size * .75, size * .75); c.stroke();
      c.restore(); return;
    }
    const flutter = (.65 + .35 * Math.abs(Math.sin(phase * (kind === 3 ? 8 : 4)))) * (1 - feeding * .55);
    const colours = ['#f6a6bb', '#e3d2a5', '#9de4dd', '#eeb851'];
    c.lineWidth = Math.max(.7, size * .06); c.strokeStyle = '#302832';
    if (kind === 0 || kind === 1) {
      // A butterfly or moth, caught by a few fine strands rather than a solid cocoon.
      for (const side of [-1, 1]) {
        c.fillStyle = colours[kind]; c.beginPath(); c.ellipse(side * size * .48, -size * .15, size * .48 * flutter, size * .62, side * .45, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); c.ellipse(side * size * .35, size * .38, size * .34 * flutter, size * .35, -side * .4, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = kind ? '#826d71' : '#6d4c86'; c.beginPath(); c.arc(side * size * .46, -size * .14, size * .09, 0, Math.PI * 2); c.fill();
      }
    } else {
      // Long translucent wings distinguish dragonflies from the striped wasp.
      for (const side of [-1, 1]) for (let wing = 0; wing < 2; wing++) {
        c.fillStyle = kind === 2 ? '#a6e9e4aa' : '#f5e8c4aa'; c.beginPath();
        c.ellipse(side * size * .58, (wing - .5) * size * .35, size * .62 * flutter, size * .16, side * (wing ? .35 : -.35), 0, Math.PI * 2); c.fill(); c.stroke();
      }
    }
    c.fillStyle = kind === 3 ? '#b77a24' : '#35303a'; c.beginPath(); c.ellipse(0, 0, size * .14, size * (kind === 2 ? .75 : .48), 0, 0, Math.PI * 2); c.fill();
    if (kind === 3) {
      c.strokeStyle = '#302832'; c.lineWidth = Math.max(1, size * .1);
      for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(-size * .12, i * size * .2); c.lineTo(size * .12, i * size * .2); c.stroke(); }
    }
    c.strokeStyle = silk; c.lineWidth = Math.max(.6, size * .035); c.globalAlpha *= .75;
    c.beginPath(); c.moveTo(-size * .9, -size * .65); c.lineTo(size * .7, size * .55); c.moveTo(size * .8, -size * .8); c.lineTo(-size * .65, size * .75); c.stroke();
    if (feeding > 0) {
      c.globalAlpha *= feeding; c.strokeStyle = '#f8ede0'; c.lineWidth = Math.max(.8, size * .07);
      for (let i = -2; i <= 2; i++) {
        c.beginPath(); c.moveTo(-size * .32, i * size * .16 - size * .13); c.lineTo(size * .32, i * size * .16 + size * .13); c.stroke();
      }
    }
    c.restore();
  }

  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    if (!animate) last = 0;
    else {
      const dt = last ? Math.min(.1, Math.max(0, (now - last) / 1000)) : 0;
      last = now; time += dt * Math.max(.2, Number(opts.speed) || 1);
      energy += (clamp(Number(opts.treble) || 0, 0, 1) - energy) * Math.min(1, dt * 3);
    }
    const index = Math.max(0, Math.floor(Number(opts.recipeIndex) || 0)) % palettes.length;
    const p = palettes[index], bass = clamp(Number(opts.bass) || 0, 0, 1);
    const size = Math.max(w, h), vx = w * (.5 + .035 * Math.sin(time * .13)), vy = h * .42;
    const gradient = c.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, p.sky[0]); gradient.addColorStop(.58, p.sky[1]); gradient.addColorStop(1, p.sky[2]);
    c.fillStyle = gradient; c.fillRect(0, 0, w, h);
    const sun = c.createRadialGradient(vx, vy, 0, vx, vy, size * .65);
    sun.addColorStop(0, p.sun + '88'); sun.addColorStop(1, p.sun + '00'); c.fillStyle = sun; c.fillRect(0, 0, w, h);

    // Flowing strands converge at the horizon, then stream past the viewer.
    c.save(); c.lineCap = 'round';
    const strands = index === 3 ? 25 : index === 4 ? 19 : 12;
    for (let i = 0; i < strands; i++) {
      const n = (i - (strands - 1) / 2) / (strands / 2);
      const shimmer = .5 + .5 * Math.sin(time * (1 + p.flow) + i * 2.1);
      const bend = Math.sin(time * .3 + i * .7) * w * .08;
      c.globalAlpha = (.08 + shimmer * .15) * (index === 3 ? 1.7 : 1);
      c.strokeStyle = i % 2 ? '#f6f3ef' : '#ffcd6c';
      c.lineWidth = Math.max(.6, size * (.0007 + shimmer * .001));
      c.beginPath(); c.moveTo(vx + n * w * .014, vy);
      c.bezierCurveTo(vx + n * w * .12 + bend, h * .55, vx + n * w * .35 - bend, h * .82, vx + n * w * .82, h * 1.13); c.stroke();
    }
    c.restore();

    const layers = [];
    for (let i = 0; i < p.layers; i++) {
      const depth = fract((i + .4) / p.layers + time * p.flow * .055);
      layers.push({ depth, seed: i });
    }
    layers.sort((a, b) => a.depth - b.depth);
    let tears = 0, spiders = 0, prey = 0, phages = 0, feeding = 0;
    for (const layer of layers) {
      const d = layer.depth, seed = layer.seed;
      const fade = clamp(d * 9, 0, 1) * clamp((1 - d) * 7, 0, 1);
      const radius = size * (.055 + d * d * .95);
      const cx = vx + Math.sin(seed * 4.2 + time * .16) * w * (.02 + d * .15);
      const cy = vy + Math.cos(seed * 3.1 + time * .13) * h * (.015 + d * .12);
      const rotation = seed * .72 + time * (.035 + p.flow * .045) * (seed % 2 ? -1 : 1);
      const rings = 10, spokes = p.rays;
      const point = (a, r) => {
        const angle = a + rotation + p.twist * r + Math.sin(time * .5 + seed + r * 5) * (.025 + bass * .035);
        const rr = radius * r * (1 + .035 * Math.sin(a * 5 + seed + time * .3));
        return [cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr];
      };
      // A moving sector opens as each web approaches; its outer rings tear first.
      const gapCentre = fract(seed * .371 + time * .018) * spokes;
      const gapWidth = p.tear * spokes * clamp((d - .35) * 1.8, 0, 1);
      const broken = (i, j) => {
        const distance = Math.abs(fract((i - gapCentre) / spokes + .5) - .5) * spokes;
        return j > 4 && distance < gapWidth * (j / rings);
      };
      c.save(); c.strokeStyle = p.silk; c.lineWidth = Math.max(.45, size * (.0007 + d * .0012));
      c.globalAlpha = fade * (.22 + d * .48); c.lineCap = 'round';
      c.beginPath();
      for (let i = 0; i < spokes; i++) {
        const a = i * Math.PI * 2 / spokes;
        const inner = point(a, .04), outer = point(a, broken(i, rings) ? .52 : 1);
        c.moveTo(...inner); c.lineTo(...outer);
      }
      c.stroke();
      // One partially woven ring travels outwards, leaving completed silk behind it.
      const weave = fract(time * .035 + seed * .19) * spokes;
      for (let j = 2; j <= rings; j++) {
        c.beginPath();
        for (let i = 0; i < spokes; i++) {
          if (broken(i, j) || (j === rings && i > weave)) { tears++; continue; }
          const a = point(i * Math.PI * 2 / spokes, j / rings);
          const b = point((i + 1) * Math.PI * 2 / spokes, j / rings);
          c.moveTo(...a); c.lineTo(...b);
        }
        c.stroke();
      }
      for (let j = 3; j <= rings; j += 2) for (let i = 0; i < spokes; i += 3) {
        if (broken(i, j)) continue;
        const [x, y] = point((i + .3) * Math.PI * 2 / spokes, j / rings);
        const sparkle = Math.max(0, Math.sin(time * 1.5 + i * 2.9 + j * 4.1 + seed));
        const dot = Math.max(.8, radius * (.0025 + sparkle * .002));
        c.fillStyle = index === 4 && i % 2 ? '#ffd2eb' : p.dew;
        c.globalAlpha = fade * (.35 + sparkle * .6); c.beginPath(); c.arc(x, y, dot, 0, Math.PI * 2); c.fill();
        if (sparkle > .94 - energy * .08 && d > .3) {
          c.strokeStyle = p.sun; c.lineWidth = .7; c.beginPath(); c.moveTo(x - dot * 3, y); c.lineTo(x + dot * 3, y); c.moveTo(x, y - dot * 3); c.lineTo(x, y + dot * 3); c.stroke();
        }
      }
      if (d > .18 && d < .88) {
        const preyAngle = (seed * 5 + 3) % spokes;
        const kind = (seed + index) % 5, hasPrey = !broken(preyAngle, 6);
        const mealCycle = fract(time / 18 + seed * .23);
        const approach = clamp(mealCycle / .35, 0, 1) * clamp((1 - mealCycle) / .2, 0, 1);
        const meal = kind === 0 && hasPrey ? clamp((approach - .7) / .3, 0, 1) : 0;
        if (hasPrey) {
          const [x, y] = point(preyAngle * Math.PI * 2 / spokes, .6);
          c.globalAlpha = fade * .9;
          trapped(c, x, y, clamp(radius * .045, 4, 23), kind, time + seed, p.silk, meal);
          prey++;
          if (kind === 4) phages++;
          if (meal > .5) feeding++;
        }
        const hunting = kind === 0 && hasPrey;
        const r = hunting ? mix(.18, .56, approach) : .2 + .45 * fract(time * .025 + seed * .31);
        const angle = hunting ? preyAngle * Math.PI * 2 / spokes : time * .12 + seed * 2;
        const [x, y] = point(angle, r);
        const spiderSize = radius * (seed % 3 === 0 ? .085 : seed % 3 === 1 ? .045 : .06);
        c.globalAlpha = fade * .95; spider(c, x, y, clamp(spiderSize, 4, 34), time + seed, seed % 2);
        spiders++;
      }
      c.restore();
    }
    return { time, growth: fract(time * .035) * 10, energy, layers: layers.length, tears, spiders, prey, phages, feeding };
  }
  return { draw, reset, recipes };
})();
