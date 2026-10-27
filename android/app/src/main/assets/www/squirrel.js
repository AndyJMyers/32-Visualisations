/* Autumn 05: a woodland gathering, seen both from outside and close to the ground. */
window.SquirrelSequestering = (() => {
  const recipes = [
    { name: 'Amber Afternoon', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Misty Morning', form: 1, theme: 0, speed: .85, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'The Great Gathering', form: 2, theme: 0, speed: 1.25, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Last Light', form: 3, theme: 0, speed: .8, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const tau = Math.PI * 2;
  const names = ['Hazel', 'Copper', 'Bramble', 'Rowan'];
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const noise = n => { const v = Math.sin(n * 127.1 + 91.7) * 43758.5453; return v - Math.floor(v); };
  let time = 0, last = null, bass = 0, treble = 0;
  function reset() { time = 0; last = null; bass = 0; treble = 0; }
  function ellipse(c, x, y, rx, ry, colour, angle = 0) {
    c.fillStyle = colour; c.beginPath(); c.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), angle, 0, tau); c.fill();
  }
  function path(c, colour, points, width = 2) {
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.beginPath();
    c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.stroke();
  }
  function acorn(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    ellipse(c, 0, 3, 7, 10, '#aa6a2d'); ellipse(c, -2, 2, 2, 6, '#e8b768');
    ellipse(c, 0, -4, 8, 4, '#644522'); path(c, '#42351f', [0, -7, 3, -11], 2);
    c.restore();
  }
  function leaf(c, x, y, s, rotation, colour) {
    c.save(); c.translate(x, y); c.rotate(rotation); c.scale(s, s);
    c.fillStyle = colour; c.beginPath(); c.moveTo(0, -8); c.quadraticCurveTo(8, -5, 8, 0);
    c.quadraticCurveTo(6, 6, 0, 8); c.quadraticCurveTo(-7, 5, -8, 0); c.quadraticCurveTo(-7, -5, 0, -8); c.fill();
    path(c, '#e4ba6a88', [0, -7, 0, 7], .7); c.restore();
  }
  function squirrel(c, x, y, size, phase, seed, carries, facing, moving) {
    const bounce = moving ? Math.abs(Math.sin(phase * 10 + seed)) * 4 : 0;
    const colour = ['#b36b37', '#98512c', '#cf8851', '#75462f'][seed % 4];
    c.save(); c.translate(x, y - bounce); c.scale(size * facing, size);
    // The tail curls behind the body, with an inner highlight to give it weight.
    c.fillStyle = colour; c.beginPath(); c.moveTo(-10, -8); c.bezierCurveTo(-40, -6, -44, -47, -26, -57);
    c.bezierCurveTo(-4, -68, 2, -51, -10, -45); c.bezierCurveTo(-25, -47, -27, -29, -9, -28); c.closePath(); c.fill();
    c.strokeStyle = '#efbd8277'; c.lineWidth = 3; c.beginPath(); c.moveTo(-13, -14); c.bezierCurveTo(-38, -18, -37, -48, -24, -53); c.stroke();
    ellipse(c, 0, -13, 15, 18, colour); ellipse(c, 5, -10, 8, 12, '#e5bb86');
    ellipse(c, 7, -30, 12, 11, colour); ellipse(c, 2, -40, 4, 7, colour, -.3); ellipse(c, 12, -39, 4, 7, colour, .2);
    ellipse(c, 10, -30, 1.8, 1.8, '#171a18'); ellipse(c, 18, -25, 4, 3, '#e4b387');
    const stride = moving ? Math.sin(phase * 10 + seed) * 7 : 0;
    path(c, '#64402a', [-5, 1, -13 + stride, 3], 4); path(c, '#64402a', [6, 1, 12 - stride, 3], 4);
    path(c, colour, [7, -20, 17, -12], 5);
    if (carries) acorn(c, 18, -12, .65);
    c.restore();
  }
  function journey(t, i) {
    const cycleTime = t / 16 + i * .17;
    const cycle = Math.floor(cycleTime), p = cycleTime - cycle;
    const fromX = [.12, .82, .31, .68][i], fromY = [.76, .80, .88, .93][i];
    const direction = i % 2 ? -1 : 1;
    const toX = clamp(fromX + direction * (.18 + noise(i * 19 + cycle * 7) * .12), .08, .92);
    const toY = clamp(fromY + (noise(i * 23 + cycle * 11 + 3) - .5) * .14, .72, .94);
    const smooth = n => n * n * (3 - 2 * n);
    const progress = p < .3 ? smooth(p / .3) : p < .52 ? 1 : p < .78 ? 1 - smooth((p - .52) / .26) : 0;
    const moving = p < .3 || (p >= .52 && p < .78);
    const stage = p < .3 ? 'searching' : p < .52 ? 'gathering' : p < .78 ? 'carrying' : 'caching';
    return { p, stage, moving, x: fromX + (toX - fromX) * progress,
      y: fromY + (toY - fromY) * progress, facing: direction * (p >= .52 ? -1 : 1),
      cacheX: fromX, cacheY: fromY };
  }
  function background(c, w, h, t, mood) {
    const sky = c.createLinearGradient(0, 0, 0, h);
    const colours = mood === 'dusk' ? ['#263447', '#bd815c', '#665c42'] : mood === 'mist' ? ['#738a91', '#d4c7a2', '#77866d'] : ['#a77756', '#e0bc7c', '#8b9a69'];
    sky.addColorStop(0, colours[0]); sky.addColorStop(.6, colours[1]); sky.addColorStop(1, colours[2]); c.fillStyle = sky; c.fillRect(0, 0, w, h);
    ellipse(c, w * .69, h * .24, w * .16, h * .15, mood === 'dusk' ? '#eeaa5d35' : '#fff1c42a');
    for (let i = 0; i < 12; i++) {
      const x = w * ((i + .2 + noise(i + 20) * .55) / 12);
      path(c, '#443b3070', [x, h * .73, x + w * .015, -h * .06], w * (.009 + noise(i) * .008));
      for (let j = 0; j < 4; j++) ellipse(c, x + (noise(i * 7 + j) - .5) * w * .16, h * (.08 + j * .08), w * .09, h * .065, ['#9b542d66', '#c5803766', '#80632955'][i % 3]);
    }
    c.fillStyle = '#596346'; c.beginPath(); c.moveTo(0, h * .69); c.quadraticCurveTo(w * .5, h * .56, w, h * .7); c.lineTo(w, h); c.lineTo(0, h); c.fill();
    c.fillStyle = '#735939'; c.beginPath(); c.moveTo(0, h * .82); c.quadraticCurveTo(w * .52, h * .68, w, h * .83); c.lineTo(w, h); c.lineTo(0, h); c.fill();
    for (let i = 0; i < 36; i++) {
      const x = noise(i * 3 + 31) * w, y = h * (.75 + noise(i * 3 + 32) * .25);
      leaf(c, x, y, Math.max(1, w / 850) * (.5 + noise(i + 5)), noise(i) * 4, ['#a56435', '#c79042', '#80603a'][i % 3]);
    }
    const wind = (mood === 'wind' ? 1.8 : .7) + bass * .6;
    for (let i = 0; i < 18; i++) {
      const y = ((noise(i + 101) * h + t * (8 + noise(i + 5) * 12) * wind) % (h * .9));
      const x = (noise(i + 52) * w + Math.sin(t * .5 + i) * w * .035 + t * 7 * wind) % w;
      leaf(c, x, y, .5 + treble * .45 + noise(i + 3) * .6, t + i, ['#edb75e', '#ce713b', '#e9ce79'][i % 3]);
    }
  }
  function overview(c, w, h, t, mood, selected) {
    background(c, w, h, t, mood);
    const count = 4;
    for (let i = 0; i < count; i++) {
      const trip = journey(t, i), x = w * trip.x, y = h * trip.y;
      const stored = Math.min(6, Math.floor(t / 16 + i * .17));
      const cacheX = w * trip.cacheX, cacheY = h * trip.cacheY;
      if (stored) {
        ellipse(c, cacheX, cacheY + 3, w * .029, h * .015, '#473820');
        for (let nut = 0; nut < stored; nut++) {
          acorn(c, cacheX + (nut % 3 - 1) * w * .012, cacheY - Math.floor(nut / 3) * h * .01,
            Math.max(.18, w / 1500));
        }
        ellipse(c, cacheX, cacheY + 7, w * .035, h * .012, '#876641');
      }
      ellipse(c, x, y + 3, w * .04, h * .012, '#26312466');
      const size = Math.min(w / 560, h / 330) * (.75 + i * .09);
      squirrel(c, x, y, size, t, i, trip.stage === 'carrying', trip.facing, trip.moving);
      if (trip.stage === 'gathering') acorn(c, x + trip.facing * w * .032, y, Math.max(.3, w / 900));
      if (trip.stage === 'caching') { ellipse(c, w * trip.cacheX, h * trip.cacheY + 2, w * .02, h * .009, '#443729'); leaf(c, w * trip.cacheX, h * trip.cacheY, .7, i, '#c38c45'); }
      if (i === selected) {
        const labelY = y - size * 74;
        ellipse(c, x, labelY, 3.5, 3.5, '#f5d888');
        c.fillStyle = '#18251ed9'; c.font = 'bold 11px sans-serif';
        const labelWidth = c.measureText(names[i]).width + 12;
        c.fillRect(x - labelWidth / 2, labelY - 21, labelWidth, 16);
        c.fillStyle = '#f7e9bd'; c.fillText(names[i], x - labelWidth / 2 + 6, labelY - 9);
      }
    }
  }
  function closeup(c, w, h, t, mood, selected) {
    const { p, stage, moving, facing } = journey(t, selected);
    const stride = Math.sin(t * 10 + selected * 1.3);
    const sway = moving ? Math.sin(t * 5 + selected) : 0;
    const bob = moving ? (Math.abs(stride) - .5) * h * .035 : Math.sin(t * 2) * h * .002;
    const travel = stage === 'searching' ? p / .3 : stage === 'carrying' ? (p - .52) / .26 : stage === 'gathering' ? 1 : 0;
    // Near leaves move faster than the distant trees, giving the small viewpoint depth.
    c.save();
    c.translate(-w * .035 + sway * w * .012, -h * .025 + bob);
    c.scale(1.07, 1.06);
    background(c, w, h, t, mood);
    c.restore();
    const groundY = h * .72 + bob;
    ellipse(c, w * .5, groundY + h * .1, w * .3, h * .11, '#4c3a28aa');
    for (let i = 0; i < 22; i++) {
      const depth = (noise(i * 7 + selected * 31) + travel * 2.1) % 1;
      const spread = (noise(i * 13 + selected * 9 + 2) - .5) * 1.7;
      const x = w * (.5 + spread * (.12 + depth * .6) + sway * .012);
      const y = h * (.60 + depth * .48) + bob;
      leaf(c, x, y, Math.max(.35, Math.min(w, h) / 350) * (.35 + depth * 2),
        noise(i + 14) * tau + facing * depth * .4, ['#d79a4e', '#9c5a32', '#c87538', '#e4ba6a'][i % 4]);
    }
    if (stage === 'searching' || stage === 'gathering') {
      const approach = stage === 'searching' ? p / .3 : 1;
      acorn(c, w * .5 + sway * w * .015, h * (.59 + approach * .12) + bob,
        Math.min(w, h) / 180 * (.38 + approach * .62));
    } else if (stage === 'carrying') {
      acorn(c, w * .5 + sway * w * .012, h * .72 + bob, Math.min(w, h) / 145);
    } else {
      ellipse(c, w * .5, groundY + h * .02, w * .12, h * .06, '#392a20');
      const stored = Math.min(6, Math.floor(t / 16 + selected * .17));
      for (let i = 0; i <= stored; i++) acorn(c, w * (.5 + (i % 3 - 1) * .055), groundY - Math.floor(i / 3) * h * .025,
        Math.min(w, h) / 210);
      if (p > .9) leaf(c, w * .5, groundY - h * .015, 2.2, .8, '#c18a43');
    }
    for (const side of [-1, 1]) {
      const step = moving ? Math.sin(t * 10 + selected * 1.3 + (side > 0 ? Math.PI : 0)) : 0;
      const digging = stage === 'caching' ? Math.sin(t * 8 + side) : 0;
      const carrying = stage === 'carrying';
      const px = w * (.5 + side * (carrying ? .15 : .23) + sway * .018);
      const py = h * (carrying ? .91 : .92) - step * h * (carrying ? .035 : .1) - digging * h * .035 + bob * .35;
      const fur = ['#b36b37', '#98512c', '#cf8851', '#75462f'][selected];
      path(c, fur, [w * (.5 + side * .34), h * 1.08, px + side * w * .025, py], Math.min(w, h) * .14);
      ellipse(c, px, py, w * .09, h * .105, fur, side * .2);
      ellipse(c, px - side * w * .01, py - h * .025, w * .055, h * .05, '#dba578', side * .2);
      for (let i = -1; i <= 1; i++) ellipse(c, px + i * w * .03, py - h * .065, w * .013, h * .018, '#6c402b');
    }
    return stage;
  }
  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .1);
    last = animate ? now : null;
    const smoothing = 1 - Math.exp(-dt * 4);
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * smoothing;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * smoothing;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const mood = opts.form || 'amber', portrait = h > w * 1.05;
    const selected = Math.floor(time / 16) % names.length;
    c.save(); c.fillStyle = '#171c19'; c.fillRect(0, 0, w, h);
    const gap = Math.max(3, Math.min(w, h) * .008);
    const panels = portrait ? [[0, 0, w, h * .54 - gap / 2], [0, h * .54 + gap / 2, w, h * .46 - gap / 2]] :
      [[0, 0, w * .61 - gap / 2, h], [w * .61 + gap / 2, 0, w * .39 - gap / 2, h]];
    let stage;
    panels.forEach(([x, y, pw, ph], i) => {
      c.save(); c.beginPath(); c.rect(x, y, pw, ph); c.clip(); c.translate(x, y);
      if (i === 0) overview(c, pw, ph, time, mood, selected); else stage = closeup(c, pw, ph, time, mood, selected);
      const title = i ? `${names[selected].toUpperCase()}'S VIEW` : 'THE WOODLAND';
      c.font = '11px sans-serif'; c.fillStyle = '#1b2520cc'; c.fillRect(0, 0, Math.min(pw, c.measureText(title).width + 18), 22);
      c.fillStyle = '#f3e7c7'; c.fillText(title, 8, 15);
      if (i === 1 && time % 16 < 1.4) {
        c.fillStyle = '#f5d888'; c.font = 'bold 12px sans-serif';
        c.fillText(`Now following ${names[selected]}`, 8, 39);
      }
      c.restore();
    });
    c.restore();
    return { time, stage, portrait, squirrels: 4, selected: names[selected], journeys: names.map((_, i) => journey(time, i)),
      cacheCounts: names.map((_, i) => Math.floor(time / 16 + i * .17)), bass, treble };
  }
  return { recipes, draw, reset };
})();
