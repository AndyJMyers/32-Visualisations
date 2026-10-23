/* Autumn 18: animated, non-explicit charcoal figure studies. */
window.LifeStudies = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const forms = ['atelier', 'nocturne', 'vermilion', 'bluewash'];
  const recipes = [
    { name: 'Warm Atelier', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Nocturne', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Vermilion', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Blue Wash', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    atelier: { paper: '#ede4d1', edge: '#c4af91', ink: '#332f2d', ghost: '#6e6159', accent: '#bd6150', second: '#d2ab64' },
    nocturne: { paper: '#17232b', edge: '#394149', ink: '#e5d5bd', ghost: '#9bafbb', accent: '#e8b985', second: '#758aa2' },
    vermilion: { paper: '#e9ddcf', edge: '#bdaa94', ink: '#34292b', ghost: '#786268', accent: '#de533b', second: '#eaa461' },
    bluewash: { paper: '#dbe5df', edge: '#a5b9b9', ink: '#263642', ghost: '#69828b', accent: '#4d8fa9', second: '#b6a0ae' },
  };
  // Each pose is a sequence of open gesture strokes, never a filled anatomical rendering.
  const poses = [
    { name: 'turning', strokes: [
      ['M', -4,-132, -21,-147, -38,-127, -30,-100],
      ['M', -4,-132, 22,-128, 27,-102, 8,-91], ['M', 8,-91, 35,-78, 48,-46, 40,-8],
      ['M', 40,-8, 19,9, 24,36, 42,72], ['M', 42,72, 40,98, 35,118, 26,139],
      ['M', -4,-132, -31,-111, -29,-90, -14,-77], ['M', -14,-77, -40,-51, -39,-15, -25,6],
      ['M', -25,6, -40,38, -34,70, -24,88], ['M', -24,88, -35,112, -40,127, -31,141],
      ['M', -14,-77, -3,-68, 3,-53, 4,-37], ['M', 4,-37, 8,-21, 23,-21, 34,-30],
      ['M', 38,-72, 60,-43, 63,-14, 54,8], ['M', -30,-56, -52,-21, -50,2, -40,21],
    ] },
    { name: 'back study', strokes: [
      ['M', -20,-132, -37,-139, -41,-115, -29,-96],
      ['M', -20,-132, -4,-146, 22,-138, 27,-111], ['M', 27,-111, 15,-92, 7,-88, 0,-85],
      ['M', -20,-132, -34,-109, -22,-90, -14,-85], ['M', -14,-85, -43,-62, -48,-39, -44,-16],
      ['M', 0,-85, 28,-82, 46,-57, 43,-25], ['M', -44,-16, -36,8, -30,32, -40,61],
      ['M', 43,-25, 26,6, 25,29, 38,59], ['M', -40,61, -34,74, -13,78, 0,72],
      ['M', 0,72, 13,78, 33,73, 38,59], ['M', -16,-70, -22,-34, -14,-9, -3,4],
      ['M', 21,-69, 24,-30, 13,-8, -3,4], ['M', -40,61, -38,92, -32,116, -29,140],
      ['M', 38,59, 42,88, 35,116, 29,140], ['M', -44,-48, -63,-20, -66,5, -59,25],
      ['M', 43,-49, 63,-20, 66,3, 58,24],
    ] },
    { name: 'reclining', strokes: [
      ['M', -133,32, -146,15, -132,-20, -118,-24],
      ['M', -133,32, -115,13, -99,8, -82,13], ['M', -82,13, -62,0, -44,-2, -27,7],
      ['M', -27,7, 0,-9, 25,-19, 54,-8], ['M', 54,-8, 77,-9, 101,5, 132,18],
      ['M', -133,32, -139,46, -127,62, -112,62], ['M', -112,62, -86,53, -72,45, -56,41],
      ['M', -56,41, -26,65, 1,53, 28,42], ['M', 28,42, 57,56, 82,45, 103,34],
      ['M', 103,34, 121,35, 137,37, 147,43], ['M', -82,13, -87,-10, -103,-19, -118,-15],
      ['M', -118,-15, -135,-6, -137,12, -133,32], ['M', -44,-2, -38,-29, -24,-50, -5,-64],
      ['M', -5,-64, 13,-65, 31,-53, 39,-34], ['M', 54,-8, 70,-38, 77,-59, 69,-74],
      ['M', -56,41, -56,66, -45,79, -26,78],
    ] },
    { name: 'front gesture', strokes: [
      ['M', -16,-129, -33,-138, -38,-108, -27,-89],
      ['M', -16,-129, -3,-144, 16,-140, 25,-119], ['M', 25,-119, 25,-99, 12,-88, 0,-86],
      ['M', 0,-86, -19,-92, -29,-108, -16,-129], ['M', -11,-82, -36,-76, -45,-49, -37,-18],
      ['M', 9,-84, 39,-78, 46,-53, 38,-19], ['M', -37,-18, -29,0, -21,17, -35,42],
      ['M', 38,-19, 28,2, 20,19, 35,43], ['M', -35,42, -17,55, 18,55, 35,43],
      ['M', -35,42, -44,79, -43,112, -39,141], ['M', 35,43, 42,78, 42,109, 36,140],
      ['M', -17,-61, -8,-49, -1,-42, 2,-39], ['M', 18,-63, 8,-48, 2,-39, 2,-39],
      ['M', -43,-58, -61,-22, -58,12, -52,39], ['M', 44,-57, 59,-21, 59,11, 51,40],
    ] },
    { name: 'seated profile', strokes: [
      ['M', 11,-139, -14,-142, -18,-111, -3,-91],
      ['M', 11,-139, 35,-136, 44,-116, 30,-99], ['M', 30,-99, 25,-89, 10,-86, 1,-92],
      ['M', 1,-92, -12,-71, -10,-43, 3,-17], ['M', 3,-17, -11,5, -21,23, -23,45],
      ['M', -23,45, 10,54, 38,53, 73,56], ['M', 73,56, 98,63, 105,80, 111,99],
      ['M', -23,45, -37,65, -32,94, -21,122], ['M', -21,122, 1,132, 17,131, 31,126],
      ['M', 3,-17, 29,-21, 43,-34, 50,-57], ['M', 50,-57, 41,-73, 27,-82, 10,-86],
      ['M', -8,-55, -31,-32, -35,-7, -27,11], ['M', 40,-44, 59,-18, 64,3, 56,17],
      ['M', 56,17, 76,29, 81,43, 73,56], ['M', 19,58, 47,82, 53,107, 53,129],
    ] },
  ];
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, previousBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = previousBass = 0; beats = 0; activeForm = null; }
  function stroke(c, spec, ink, width, alpha = 1) {
    c.globalAlpha = alpha; c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(spec[1], spec[2]); c.bezierCurveTo(...spec.slice(3)); c.stroke(); c.globalAlpha = 1;
    if (width > 1.5) {
      c.save(); c.translate(1.3, -.8); c.globalAlpha = alpha * .17;
      c.lineWidth = width * 1.5; c.setLineDash([3, 2, 9, 3]);
      c.stroke(); c.restore();
    }
  }
  function splash(c, x, y, radius, color, alpha) {
    c.save(); c.globalAlpha = alpha; c.fillStyle = color;
    c.beginPath(); c.ellipse(x, y, radius * 1.7, radius * .8, -.35, 0, TAU); c.fill();
    for (let i = 0; i < 6; i++) {
      const a = i * 2.399 + x * .013;
      c.beginPath(); c.arc(x + Math.cos(a) * radius * (1.4 + i * .24), y + Math.sin(a) * radius * (.8 + i * .16), radius * (.05 + i % 3 * .04), 0, TAU); c.fill();
    }
    c.restore();
  }
  function draw(c, w, h, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'atelier';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    const inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && inputBass > .62 && previousBass <= .62) { beats++; accent = 1; }
    previousBass = inputBass;
    accent = Math.max(0, accent - dt * 1.7);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const duration = 10, page = Math.floor(time / duration), local = time % duration;
    const poseIndex = (page + forms.indexOf(form)) % poses.length;
    const pose = poses[poseIndex], p = palettes[form];
    c.save(); c.scale(w / 900, h / 500);
    c.fillStyle = p.paper; c.fillRect(0, 0, 900, 500);
    const paperLight = c.createLinearGradient(0, 0, 900, 500);
    paperLight.addColorStop(0, form === 'nocturne' ? '#ffffff0d' : '#ffffff60');
    paperLight.addColorStop(.5, '#ffffff00'); paperLight.addColorStop(1, '#0000001c');
    c.fillStyle = paperLight; c.fillRect(0, 0, 900, 500);
    c.strokeStyle = p.edge; c.lineWidth = 3; c.strokeRect(22, 19, 856, 460);
    for (let i = 0; i < 90; i++) {
      const x = (i * 521 % 853) + 24, y = (i * 317 % 457) + 21;
      c.fillStyle = i % 3 ? '#0000000b' : '#ffffff19'; c.fillRect(x, y, 2, 1);
    }
    // The fresh page gathers loose studies before the primary figure arrives.
    c.save(); c.translate(183, 282); c.rotate(-.16);
    for (let i = 0; i < pose.strokes.length; i++) if (i < Math.floor(pose.strokes.length * .45)) {
      stroke(c, pose.strokes[i], p.ghost, 1.1, .13);
    }
    c.restore();
    c.save(); c.translate(708, 256); c.rotate(.14);
    const next = poses[(poseIndex + 1) % poses.length];
    for (let i = 0; i < next.strokes.length; i++) if (i % 2 === 0) stroke(c, next.strokes[i], p.ghost, 1.3, .12);
    c.restore();
    c.save(); c.translate(450 + Math.sin(time * .45) * (2 + mid * 4), 255);
    c.scale(1.34, 1.34); c.rotate(Math.sin(time * .34) * .025);
    const reveal = animate ? clamp((local + .6) / (2.4 - bass * .4), 0, 1) : 1;
    const visible = Math.ceil(pose.strokes.length * reveal);
    for (let i = 0; i < visible; i++) {
      const spec = pose.strokes[i];
      stroke(c, spec, p.ghost, 6 + bass * 1.5, .08);
      stroke(c, spec, p.ink, i % 5 === 0 ? 2.8 : 1.6, .78 + accent * .16);
      if (i % 4 === 0) stroke(c, spec, p.ink, .65, .35);
    }
    // Fleeting colour falls across the paper, not over detailed anatomy.
    const bloom = clamp((local - 1.8) / 1.6, 0, 1) * clamp((duration - local) / 1.2, 0, 1);
    splash(c, -32, -22, 35 + bass * 28, p.accent, bloom * (.23 + accent * .2));
    splash(c, 48, 54, 24 + mid * 21, p.second, bloom * .23);
    c.restore();
    for (let i = 0; i < 7; i++) {
      const x = 85 + i * 113, y = 90 + (i * 71 % 330);
      splash(c, x, y, 2 + treble * 3, i % 2 ? p.accent : p.second, .18 + accent * .15);
    }
    // Soft page turn, with no abrupt hard cut at the end of a pose.
    const turn = Math.max(0, (local - 9.35) / .65);
    if (turn) { c.fillStyle = p.paper; c.globalAlpha = turn * turn; c.fillRect(0, 0, 900, 500); c.globalAlpha = 1; }
    c.restore();
    return { time, phase: pose.name, form, beats };
  }
  return { recipes, draw, reset };
})();
