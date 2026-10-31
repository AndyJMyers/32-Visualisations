/* A small, music-led colony story: courtship, building, foraging, and dance. */
window.BusyAsABee = (() => {
  const TAU = Math.PI * 2;
  const chapters = [
    ['MATING FLIGHT', 'A new queen rises into the bright air.'],
    ['COLONY BUILD-UP', 'Comb grows; nurses, builders, and workers take their places.'],
    ['NECTAR & POLLEN', 'Foragers read the flowers and return with the season.'],
    ['WAGGLE DANCE', 'A dancer turns the hive into a map of the meadow.'],
  ];
  const recipes = [
    { name: 'Meadow Gold', form: 'meadow', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Orchard Bloom', form: 'bloom', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Inside the Hive', form: 'hive', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Moonflower Nocturne', form: 'moonflower', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    meadow: { sky: '#9acbd2', far: '#d7e5ae', ground: '#667d48', ink: '#28352c', gold: '#ffc94d', pale: '#fff0ba', flower: '#f8f3e4', wing: '#e7f7ef' },
    bloom: { sky: '#f2a8a1', far: '#efc1a8', ground: '#554d55', ink: '#382b3a', gold: '#ffd45e', pale: '#fff4d5', flower: '#fff5f3', wing: '#fff0f2' },
    hive: { sky: '#372d38', far: '#52414b', ground: '#241e29', ink: '#191720', gold: '#f6ad43', pale: '#f2d596', flower: '#c99751', wing: '#ffe6ae' },
    moonflower: { sky: '#171f49', far: '#343b69', ground: '#171b36', ink: '#101329', gold: '#f1c45e', pale: '#cbcef5', flower: '#c8b9fb', wing: '#e4e7ff' },
  };
  let time = 0, last = null, energy = 0, pulse = 0;
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  function reset() { time = 0; last = null; energy = 0; pulse = 0; }
  function disc(c, x, y, r, colour, stroke = null, width = 1) {
    c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, TAU);
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
    else { c.fillStyle = colour; c.fill(); }
  }
  function line(c, x1, y1, x2, y2, colour, width = 2) {
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2);
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.stroke();
  }
  function polygon(c, pts, colour) {
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath(); c.fillStyle = colour; c.fill();
  }
  function text(c, value, x, y, size, colour, align = 'left') {
    c.font = `600 ${size}px system-ui, sans-serif`; c.textAlign = align; c.fillStyle = colour; c.fillText(value, x, y);
  }
  function backdrop(c, p, beat, form) {
    const sky = c.createLinearGradient(0, 0, 0, 540);
    sky.addColorStop(0, p.sky); sky.addColorStop(.72, p.far); sky.addColorStop(1, p.ground);
    c.fillStyle = sky; c.fillRect(0, 0, 960, 540);
    if (form === 'moonflower') {
      for (let i = 0; i < 45; i++) disc(c, (i * 197) % 960, (i * 83) % 280, i % 9 === 0 ? 1.8 : .8, `${p.pale}a0`);
      disc(c, 805, 110, 37, p.pale); disc(c, 819, 101, 35, p.sky);
    }
    polygon(c, [[0,350],[160,286],[317,354],[492,271],[678,347],[818,291],[960,338],[960,540],[0,540]], `${p.ground}cc`);
    c.fillStyle = `${p.gold}${Math.round(16 + beat * 25).toString(16).padStart(2, '0')}`;
    c.fillRect(0, 330, 960, 210);
  }
  function flower(c, x, y, scale, p, bloom = 0) {
    const sway = Math.sin(time * .9 + x * .025) * 5;
    line(c, x, y, x + sway, y - 57 * scale, '#355c3c', 3 * scale);
    line(c, x + sway * .4, y - 26 * scale, x - 12 * scale, y - 39 * scale, '#48704a', 3 * scale);
    disc(c, x - 12 * scale, y - 40 * scale, 8 * scale, '#56834d');
    const fx = x + sway, fy = y - 58 * scale;
    for (let i = 0; i < 7; i++) {
      const a = i * TAU / 7 + time * .04;
      disc(c, fx + Math.cos(a) * 8 * scale, fy + Math.sin(a) * 8 * scale, (5 + bloom) * scale, p.flower);
    }
    disc(c, fx, fy, 4.5 * scale, p.gold);
    return { x: fx, y: fy };
  }
  function bee(c, x, y, scale, angle, p, beat, queen = false) {
    c.save(); c.translate(x, y); c.rotate(angle);
    const flap = Math.sin(time * 28 + x * .04) * (3 + beat * 4);
    c.globalAlpha = .72; disc(c, -2 * scale, -7 * scale + flap * scale, 5 * scale, p.wing); disc(c, 5 * scale, -6 * scale - flap * scale, 4.5 * scale, p.wing); c.globalAlpha = 1;
    c.fillStyle = queen ? p.gold : '#342b25';
    c.beginPath(); c.ellipse(0, 0, (queen ? 12 : 9) * scale, 5.5 * scale, 0, 0, TAU); c.fill();
    for (let i = -1; i <= 1; i++) line(c, i * 4 * scale, -4 * scale, i * 4 * scale, 4 * scale, p.gold, 2 * scale);
    disc(c, 7 * scale, -1 * scale, 1.2 * scale, p.pale);
    if (queen) { line(c, -5 * scale, 2 * scale, -12 * scale, 6 * scale, p.gold, 2 * scale); line(c, -7 * scale, 0, -14 * scale, 2 * scale, p.gold, 2 * scale); }
    c.restore();
  }
  function hive(c, p, beat, built) {
    const x = 734, y = 302, w = 137, h = 172;
    polygon(c, [[x-10,y+5],[x+12,y-25],[x+w-12,y-25],[x+w+10,y+5]], p.gold);
    c.fillStyle = p.pale; c.fillRect(x, y, w, h);
    c.fillStyle = p.gold; c.fillRect(x, y + h * (1 - built), w, h * built);
    c.strokeStyle = p.ink; c.lineWidth = 5; c.strokeRect(x, y, w, h);
    for (let row = 0; row < 4; row++) {
      const yy = y + 31 + row * 35;
      line(c, x + 10, yy, x + w - 10, yy, `${p.ink}aa`, 2);
      for (let k = 0; k < 5; k++) disc(c, x + 18 + k * 25, yy + 11, 4 + beat * 1.5, row < 4 * built ? p.gold : `${p.gold}75`);
    }
    c.fillStyle = p.ink; c.fillRect(x + 51, y + h - 8, 35, 12 + beat * 3);
    for (let i = 0; i < 5; i++) bee(c, x + 27 + ((i * 41 + time * (10 + i)) % 100), y + 28 + ((i * 29 + time * (6 + i % 2)) % 130), .55, Math.sin(time + i) * .4, p, beat);
  }
  function flight(c, p, beat, queen = false) {
    const t = (time * .09) % 1;
    c.beginPath(); c.moveTo(104, 242); c.bezierCurveTo(230, 40, 506, 91, 672, 211);
    c.strokeStyle = `${p.pale}85`; c.lineWidth = 2; c.setLineDash([5, 9]); c.stroke(); c.setLineDash([]);
    const x = 104 + 568 * t, y = 242 - 126 * Math.sin(Math.PI * t) + Math.sin(time * 3) * (4 + beat * 8);
    bee(c, x, y, queen ? 1.3 : .9, Math.atan2(-Math.cos(Math.PI * t) * .7, 1), p, beat, queen);
    for (let i = 0; i < 4; i++) {
      const offset = (t + i * .22) % 1;
      bee(c, 104 + 568 * offset, 242 - 126 * Math.sin(Math.PI * offset) + Math.sin(time * 2 + i) * 4, .66, 0, p, beat);
    }
  }
  function waggle(c, p, beat) {
    const cx = 430, cy = 291, swing = time * (1.8 + beat * 2.6);
    disc(c, cx, cy, 122, `${p.gold}20`, p.pale, 2);
    c.save(); c.translate(cx, cy); c.rotate(.43 + Math.sin(time * .2) * .18);
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -81); c.bezierCurveTo(47, -112, 78, -44, 0, 0); c.bezierCurveTo(-74, -43, -44, -112, 0, -81);
    c.strokeStyle = p.gold; c.lineWidth = 3; c.setLineDash([6, 7]); c.stroke(); c.setLineDash([]);
    bee(c, Math.sin(swing) * 15, -25 + Math.cos(swing * 2) * 12, 1.35, Math.sin(swing) * .7, p, beat, true);
    c.restore();
    for (let i = 0; i < 7; i++) {
      const a = i * TAU / 7 + time * .24;
      bee(c, cx + Math.cos(a) * (90 + Math.sin(time * 2 + i) * 7), cy + Math.sin(a) * 62, .68, a + Math.PI / 2, p, beat);
    }
    for (let i = 0; i < 3; i++) {
      const r = (time * (24 + beat * 28) + i * 40) % 150;
      disc(c, cx, cy, r, 'transparent', `${p.gold}${Math.round((1 - r / 150) * 70).toString(16).padStart(2, '0')}`, 2);
    }
  }
  function forage(c, p, beat) {
    const flowers = [];
    for (let i = 0; i < 12; i++) flowers.push(flower(c, 48 + i * 70, 462 - (i % 3) * 22, .8 + (i % 4) * .09, p, beat * .8));
    hive(c, p, beat, .82);
    for (let i = 0; i < 7; i++) {
      const progress = (time * (.07 + i * .001) + i * .143) % 1;
      const from = flowers[i % flowers.length];
      const x = from.x + (742 - from.x) * progress;
      const y = from.y - 22 - Math.sin(progress * Math.PI) * (82 + (i % 3) * 24);
      bee(c, x, y, .7, Math.atan2(Math.cos(progress * Math.PI) * -1.2, 1), p, beat);
      if (i % 2 === 0) disc(c, x - 8, y + 1, 2, p.gold);
      else disc(c, x - 8, y + 1, 2, p.pale);
    }
  }
  function build(c, p, beat) {
    for (let i = 0; i < 10; i++) {
      const x = 95 + i * 61, y = 117 + Math.sin(i * 1.7) * 14;
      c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x - 40, y + 90, x - 21, y + 203, x, y + 285); c.bezierCurveTo(x + 21, y + 203, x + 40, y + 90, x, y); c.closePath();
      c.fillStyle = i < 2 + Math.floor((time % 12) * .45) ? `${p.gold}b8` : `${p.pale}20`; c.fill();
      c.strokeStyle = `${p.ink}88`; c.lineWidth = 1; c.stroke();
      if (i % 2 === 0) disc(c, x, y + 48, 5, p.ink);
    }
    hive(c, p, beat, .25 + .72 * smooth((time % 12) / 12));
    for (let i = 0; i < 8; i++) {
      const x = 180 + ((i * 113 + time * (11 + i % 4)) % 530);
      const y = 160 + ((i * 59 + Math.sin(time * 1.4 + i) * 28) % 275);
      bee(c, x, y, .65, Math.sin(time * .8 + i) * .7, p, beat);
    }
  }
  function draw(c, width, height, now, options = {}) {
    const animate = options.animate !== false;
    const elapsed = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    if (animate) time += elapsed * clamp(Number(options.speed) || 1, .2, 3);
    const beat = clamp((options.bass || 0) * .65 + (options.mid || 0) * .25 + (options.treble || 0) * .3, 0, 1);
    energy += (beat - energy) * (1 - Math.exp(-elapsed * 4));
    pulse += elapsed * (.55 + energy * 2.3);
    const index = Math.floor(time / 11) % chapters.length, local = time % 11;
    const form = palettes[options.form] ? options.form : 'meadow', p = palettes[form];
    c.save(); c.scale(width / 960, height / 540);
    backdrop(c, p, energy, form);
    if (index === 0) { flight(c, p, energy, true); for (let i = 0; i < 6; i++) flower(c, 40 + i * 105, 490, .85, p, energy); }
    if (index === 1) build(c, p, energy);
    if (index === 2) forage(c, p, energy);
    if (index === 3) { hive(c, p, energy, 1); waggle(c, p, energy); }
    c.fillStyle = `${p.ink}df`; c.fillRect(0, 0, 960, 68);
    text(c, 'BUSY AS A BEE', 24, 43, 27, p.gold);
    text(c, chapters[index][0], 934, 42, 21, p.pale, 'right');
    c.fillStyle = `${p.ink}df`; c.fillRect(0, 489, 960, 51);
    text(c, chapters[index][1], 24, 521, 17, p.pale);
    for (let i = 0; i < 4; i++) disc(c, 851 + i * 25, 514, 4, i === index ? p.gold : `${p.pale}66`);
    c.restore();
    return { chapter: chapters[index][0], index, form, beat, energy, pulse, time, local };
  }
  return { chapters, recipes, draw, reset };
})();
