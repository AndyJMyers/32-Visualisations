/* Autumn 13: music conducts layers of thrown paint across a fresh canvas. */
window.Pollocks = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const hash = n => { const v = Math.sin(n * 127.1 + 78.233) * 43758.5453; return v - Math.floor(v); };
  const recipes = [
    { name: 'Thrown Enamel', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Ink on Paper', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Molten Filaments', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Midnight Pour', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const materials = {
    enamel: { ground: '#ded9cb', edge: '#b7ad9b', colors: ['#242329', '#f4efe3', '#b94331', '#c8a436', '#526a78'], wash: '#e9e3d6' },
    ink: { ground: '#e9dfc8', edge: '#9e8a72', colors: ['#1c2a35', '#495b66', '#794c44', '#a48159', '#344b46'], wash: '#f4ead8' },
    molten: { ground: '#27242a', edge: '#534047', colors: ['#d99c45', '#ead9ae', '#aebac0', '#b95c37', '#7e8e9e'], wash: '#342e34' },
    midnight: { ground: '#080d1d', edge: '#263053', colors: ['#64e1ed', '#f06ac4', '#fee66d', '#a28dff', '#f5f5ed'], wash: '#151b34' },
  };
  let time = 0, last = null, bass = 0, mid = 0, treble = 0;
  let marks = [], nextId = 0, paintClock = 0, lastInputBass = 0, lastBeat = -10, activeForm = null;
  function reset() {
    time = 0; last = null; bass = mid = treble = 0;
    marks = []; nextId = 0; paintClock = 0; lastInputBass = 0; lastBeat = -10; activeForm = null;
  }
  function makeMark(form, energy, born) {
    const id = nextId++;
    const angle = hash(id * 11 + 2) * TAU;
    const length = 105 + hash(id * 13 + 4) * (230 + energy * 110);
    const x = 70 + hash(id * 17 + 6) * 760;
    const y = 60 + hash(id * 19 + 8) * 380;
    const curve = (hash(id * 23 + 10) - .5) * (95 + energy * 90);
    const points = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      const sideways = Math.sin(t * Math.PI) * curve
        + Math.sin(t * (15 + hash(id * 29 + 12) * 9) + id) * (2 + energy * 5);
      points.push({
        x: x + Math.cos(angle) * length * (t - .5) - Math.sin(angle) * sideways,
        y: y + Math.sin(angle) * length * (t - .5) + Math.cos(angle) * sideways,
      });
    }
    const droplets = [];
    const count = form === 'ink' ? 8 : form === 'molten' ? 5 : 13;
    for (let i = 0; i < count; i++) {
      const along = hash(id * 67 + i * 31 + 5);
      const anchor = points[Math.floor(along * 28)];
      const spread = (form === 'enamel' ? 40 : 26) * (.3 + energy);
      droplets.push({
        x: anchor.x + (hash(id * 71 + i * 37 + 7) - .5) * spread,
        y: anchor.y + (hash(id * 73 + i * 41 + 9) - .5) * spread,
        radius: .6 + hash(id * 79 + i * 43 + 11) * (form === 'ink' ? 3.4 : 2.5),
      });
    }
    const splashes = [];
    const splashCount = (id % 3 === 0 ? 1 : 0) + (energy > .55 ? 1 : 0);
    for (let i = 0; i < splashCount; i++) {
      const anchor = points[Math.floor(hash(id * 83 + i * 47 + 3) * 28)];
      const direction = hash(id * 89 + i * 53 + 7) * TAU;
      const distance = 22 + hash(id * 97 + i * 59 + 9) * (35 + energy * 35);
      const x = anchor.x + Math.cos(direction) * distance;
      const y = anchor.y + Math.sin(direction) * distance;
      const radius = (3.5 + hash(id * 101 + i * 61 + 11) * 5) * (1 + energy * .6);
      const flecks = [];
      for (let j = 0; j < 7; j++) {
        const angle = hash(id * 103 + i * 67 + j * 29 + 13) * TAU;
        const reach = radius * (1.7 + hash(id * 107 + i * 71 + j * 31 + 15) * 3.2);
        flecks.push({
          x: x + Math.cos(angle) * reach,
          y: y + Math.sin(angle) * reach,
          radius: .6 + hash(id * 109 + i * 73 + j * 37 + 17) * 2.3,
        });
      }
      splashes.push({ x, y, radius, flecks });
    }
    return {
      born, points, droplets, splashes, color: materials[form].colors[id % materials[form].colors.length],
      width: (1.7 + hash(id * 47 + 14) * 4.5 + energy * 3.5) * (form === 'molten' ? 1.35 : 1),
      reveal: .25 + hash(id * 53 + 16) * .65,
    };
  }
  function seedCanvas(form) {
    for (let i = 0; i < 9; i++) marks.push(makeMark(form, .18, -2));
  }
  function paintPath(c, mark, count, width, color, alpha) {
    const points = mark.points;
    c.beginPath(); c.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < count; i++) {
      const point = points[i], next = points[i + 1];
      c.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
    }
    c.lineTo(points[count].x, points[count].y);
    c.lineWidth = width; c.strokeStyle = color; c.globalAlpha = alpha; c.stroke();
  }
  function drawMark(c, mark, form) {
    const visible = mark.born < 0 ? 1 : clamp((time - mark.born) / mark.reveal, 0, 1);
    if (visible <= 0) return;
    const count = Math.max(1, Math.floor(visible * 28));
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    if (form === 'ink') {
      paintPath(c, mark, count, mark.width * 3.2, mark.color, .10);
      paintPath(c, mark, count, mark.width * 1.7, mark.color, .22);
      paintPath(c, mark, count, mark.width * .65, mark.color, .82);
    } else if (form === 'molten') {
      c.shadowColor = mark.color; c.shadowBlur = 15;
      paintPath(c, mark, count, mark.width * 2.1, '#0f1018', .8);
      paintPath(c, mark, count, mark.width, mark.color, .96);
      c.shadowBlur = 0;
      paintPath(c, mark, count, mark.width * .22, '#fff2d0', .54);
    } else if (form === 'midnight') {
      c.globalCompositeOperation = 'screen';
      c.shadowColor = mark.color; c.shadowBlur = 19;
      paintPath(c, mark, count, mark.width * 2.7, mark.color, .24);
      c.shadowBlur = 0;
      paintPath(c, mark, count, mark.width * .8, mark.color, .92);
    } else {
      paintPath(c, mark, count, mark.width * 1.45, '#353039', .23);
      paintPath(c, mark, count, mark.width, mark.color, .95);
      paintPath(c, mark, count, Math.max(.55, mark.width * .15), '#fff7e6', .16);
    }
    c.fillStyle = mark.color;
    c.globalAlpha = form === 'ink' ? .43 : .85;
    const droplets = Math.floor(mark.droplets.length * visible);
    for (let i = 0; i < droplets; i++) {
      const drop = mark.droplets[i];
      c.beginPath(); c.arc(drop.x, drop.y, drop.radius, 0, TAU); c.fill();
    }
    const splashes = Math.floor(mark.splashes.length * visible);
    for (let i = 0; i < splashes; i++) {
      const splash = mark.splashes[i];
      c.beginPath(); c.arc(splash.x, splash.y, splash.radius, 0, TAU); c.fill();
      for (const fleck of splash.flecks) {
        c.beginPath(); c.arc(fleck.x, fleck.y, fleck.radius, 0, TAU); c.fill();
      }
    }
    c.restore();
  }
  function draw(c, w, h, now, opts = {}) {
    const form = materials[opts.form] ? opts.form : 'enamel';
    if (form !== activeForm) { reset(); activeForm = form; seedCanvas(form); }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const eased = 1 - Math.exp(-dt * 5);
    const inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * eased;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * eased;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * eased;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    if (dt > 0) {
      paintClock += dt * (.6 + mid * 1.15 + treble * .7);
      while (paintClock >= 1) {
        marks.push(makeMark(form, (bass + mid + treble) / 3, time));
        paintClock -= 1;
      }
      if (inputBass > .56 && lastInputBass <= .56 && time - lastBeat > .35) {
        lastBeat = time;
        for (let i = 0; i < 2; i++) marks.push(makeMark(form, inputBass, time + i * .06));
      }
      if (marks.length > 150) marks.splice(9, marks.length - 150);
    }
    lastInputBass = inputBass;
    const p = materials[form];
    c.save(); c.scale(w / 900, h / 500);
    c.fillStyle = p.ground; c.fillRect(0, 0, 900, 500);
    c.fillStyle = p.wash; c.globalAlpha = form === 'ink' ? .45 : .15;
    for (let i = 0; i < 76; i++) {
      const x = hash(i * 31 + 2) * 900, y = hash(i * 37 + 4) * 500;
      c.fillRect(x, y, 14 + hash(i * 43 + 6) * 40, .45);
    }
    c.globalAlpha = 1;
    c.save();
    c.beginPath(); c.rect(9, 9, 882, 482); c.clip();
    const zoom = 1.012 + Math.sin(time * .12) * .014;
    c.translate(450 + Math.sin(time * .17) * 4, 250 + Math.cos(time * .13) * 3);
    c.scale(zoom, zoom); c.translate(-450, -250);
    for (const mark of marks) drawMark(c, mark, form);
    c.restore();
    c.strokeStyle = p.edge; c.globalAlpha = .7; c.lineWidth = 3;
    c.strokeRect(8, 8, 884, 484);
    c.restore();
    return { time, form, markCount: marks.length, bass, mid, treble };
  }
  return { recipes, draw, reset };
})();
