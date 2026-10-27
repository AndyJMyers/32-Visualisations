/* Autumn 31: a music-led journey through search, verification and uncertainty. */
window.PEqualsNP = (() => {
  const TAU = Math.PI * 2;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const chapters = [
    ['THE SEARCH', 'An answer may hide among an expanding forest of possibilities'],
    ['THE CHECK', 'A proposed answer can be tested in a moment'],
    ['THE ORACLE', 'An instant answer might hide a vast bill elsewhere'],
    ['THE QUESTION', 'Is finding always harder than checking? Nobody knows'],
  ];
  const recipes = [
    { name: 'Blueprint Labyrinth', form: 'blueprint', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Chalk Conjecture', form: 'chalk', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Clockwork Oracle', form: 'clockwork', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Simulation Sky', form: 'cosmos', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    blueprint: { top: '#03172b', bottom: '#0b3b65', ink: '#d4f5ff', dim: '#4b8daf', accent: '#ffd979', second: '#44e2df' },
    chalk: { top: '#122821', bottom: '#284b3d', ink: '#f0eee0', dim: '#719786', accent: '#f5d882', second: '#a5cdbc' },
    clockwork: { top: '#241511', bottom: '#67412d', ink: '#f6e3bc', dim: '#a97147', accent: '#ffc95e', second: '#81c8c1' },
    cosmos: { top: '#080b27', bottom: '#3d175e', ink: '#efe9ff', dim: '#7466a9', accent: '#ff8dc3', second: '#6fe5fa' },
  };
  let time = 0;
  let last = null;

  function reset() { time = 0; last = null; }
  function line(c, x1, y1, x2, y2, colour, width = 2) {
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2);
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.stroke();
  }
  function circle(c, x, y, radius, colour, stroke = false, width = 2) {
    c.beginPath(); c.arc(x, y, radius, 0, TAU);
    if (stroke) { c.strokeStyle = colour; c.lineWidth = width; c.stroke(); }
    else { c.fillStyle = colour; c.fill(); }
  }
  function label(c, value, x, y, size, colour, align = 'center') {
    c.fillStyle = colour; c.textAlign = align; c.font = `bold ${size}px Arial`;
    c.fillText(value, x, y);
  }
  function backdrop(c, p, form, beat) {
    const gradient = c.createLinearGradient(0, 0, 960, 540);
    gradient.addColorStop(0, p.top); gradient.addColorStop(1, p.bottom);
    c.fillStyle = gradient; c.fillRect(0, 0, 960, 540);
    if (form === 'blueprint') {
      for (let x = 0; x <= 960; x += 40) line(c, x, 0, x, 540, `${p.dim}31`, 1);
      for (let y = 0; y <= 540; y += 40) line(c, 0, y, 960, y, `${p.dim}31`, 1);
      for (let i = 0; i < 5; i++) circle(c, 480, 278, 110 + i * 72, `${p.second}20`, true);
    } else if (form === 'chalk') {
      for (let i = 0; i < 52; i++) {
        const x = (i * 187) % 960, y = (i * 113) % 540;
        line(c, x, y, x + 18, y - 3, `${p.ink}18`, 2);
      }
      label(c, 'Q.E.D. ?', 838, 117, 30, `${p.ink}4d`);
    } else if (form === 'clockwork') {
      for (const [x, y, radius] of [[94, 309, 118], [844, 285, 151]]) {
        circle(c, x, y, radius, `${p.dim}72`, true, 13);
        circle(c, x, y, radius * .72, `${p.accent}31`, true, 3);
        for (let i = 0; i < 24; i++) {
          const angle = i * TAU / 24 + time * .12 * (x < 400 ? 1 : -1);
          line(c, x + Math.cos(angle) * (radius - 11), y + Math.sin(angle) * (radius - 11),
            x + Math.cos(angle) * (radius + 9), y + Math.sin(angle) * (radius + 9), `${p.accent}66`, 5);
        }
      }
    } else {
      for (let i = 0; i < 95; i++) {
        const x = (i * 269 + Math.sin(time * .2 + i) * 16) % 960;
        const y = (i * 137) % 540;
        circle(c, x, y, (i % 5 === 0 ? 2.2 : 1) + beat * .8, `${i % 3 ? p.ink : p.second}a8`);
      }
      for (let i = 0; i < 4; i++) circle(c, 480, 285, 65 + i * 88 + Math.sin(time * .6 + i) * 8, `${p.second}20`, true, 2);
    }
  }
  function search(c, p, local, beat, form) {
    const bits = [1, 0, 1, 1, 0, 1];
    const reveal = clamp(local * .65 + beat * .6, 0, 6);
    let chosenEnd = [105, 282];
    function branch(level, x, y, chosen) {
      if (level === 6) {
        if (chosen) chosenEnd = [x, y];
        circle(c, x, y, chosen ? 5 + beat * 4 : 2, chosen ? p.accent : `${p.ink}75`);
        return;
      }
      if (level > reveal) return;
      const nextX = x + 119;
      const spread = 88 / Math.pow(2, level);
      for (let side = 0; side < 2; side++) {
        const nextY = y + (side ? spread : -spread);
        const gold = chosen && side === bits[level];
        line(c, x, y, nextX, nextY, gold ? p.accent : `${p.dim}95`, gold ? 6 + beat * 5 : 2);
        if (level < reveal - .6) branch(level + 1, nextX, nextY, gold);
      }
    }
    branch(0, 105, 282, true);
    circle(c, 105, 282, 18 + beat * 7, p.second, true, 3);
    const travel = local * .78 % 6;
    const x = 105 + travel * 119;
    const y = 282 + Math.sin(travel * 4 + time) * 18;
    circle(c, x, y, 7 + beat * 5, p.accent);
    label(c, '2^n', 854, 346, form === 'chalk' ? 54 : 61, p.ink);
    label(c, 'POSSIBLE ROUTES', 854, 378, 17, p.second);
    circle(c, chosenEnd[0], chosenEnd[1], 13 + beat * 7, `${p.accent}88`, true, 2);
  }
  function check(c, p, local, beat) {
    const points = [[126, 371], [245, 303], [328, 345], [426, 238], [520, 279], [621, 197], [731, 240]];
    for (let i = 0; i < 27; i++) {
      const x = 95 + (i * 137) % 752, y = 163 + (i * 79) % 243;
      circle(c, x, y, 2, `${p.dim}aa`);
    }
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1], [x2, y2] = points[i];
      line(c, x1, y1, x2, y2, `${p.ink}4d`, 15);
      line(c, x1, y1, x2, y2, p.accent, 5 + beat * 3);
    }
    for (let i = 0; i < points.length; i++) circle(c, points[i][0], points[i][1], 8, p.accent);
    const index = Math.floor(local * 1.4) % (points.length - 1);
    const fraction = local * 1.4 % 1;
    circle(c, points[index][0] + (points[index + 1][0] - points[index][0]) * fraction,
      points[index][1] + (points[index + 1][1] - points[index][1]) * fraction, 14 + beat * 8, p.second);
    circle(c, 789, 241, 55 + beat * 7, p.ink, true, 8);
    line(c, 762, 241, 782, 262, p.accent, 11);
    line(c, 782, 262, 816, 217, p.accent, 11);
    label(c, 'CHECKED', 789, 342, 27, p.ink);
    label(c, 'ONE CANDIDATE', 246, 214, 22, p.second);
  }
  function oracle(c, p, local, beat, form) {
    const centreX = 480, centreY = 275;
    for (let i = 5; i >= 0; i--) {
      const radius = 91 + i * 55 + Math.sin(time * .7 + i) * 5;
      circle(c, centreX, centreY, radius, i % 2 ? `${p.second}72` : `${p.accent}61`, true, 2 + beat * 3);
      const angle = time * (.19 + i * .045) * (i % 2 ? -1 : 1) + i;
      circle(c, centreX + Math.cos(angle) * radius, centreY + Math.sin(angle) * radius, 4 + beat * 4, p.accent);
    }
    circle(c, centreX, centreY, 83 + beat * 8, p.top);
    circle(c, centreX, centreY, 83 + beat * 8, p.ink, true, 4);
    label(c, '?', centreX, centreY + 37, 112, p.accent);
    label(c, form === 'cosmos' ? 'SIMULATOR' : 'BLACK BOX', centreX, 129, 27, p.ink);
    label(c, 'ANSWER INSTANTLY', centreX, 430, 27, p.ink);
    label(c, 'BUT WHERE WAS THE WORK DONE?', centreX, 462, 18, p.second);
    for (let i = 0; i < 16; i++) {
      const angle = i * TAU / 16 + time * .13;
      const radius = 217 + Math.sin(local * 2 + i) * (4 + beat * 13);
      line(c, centreX + Math.cos(angle) * radius, centreY + Math.sin(angle) * radius,
        centreX + Math.cos(angle) * (radius + 25), centreY + Math.sin(angle) * (radius + 25), p.accent, 3);
    }
  }
  function question(c, p, local, beat) {
    const shift = Math.sin(time * .7) * 13;
    circle(c, 306 - shift, 279, 101 + beat * 12, p.second, true, 6);
    circle(c, 654 + shift, 279, 101 + beat * 12, p.accent, true, 6);
    label(c, 'P', 306 - shift, 317, 111, p.ink);
    label(c, 'NP', 654 + shift, 312, 91, p.ink);
    label(c, '= ?', 480, 307, 63 + beat * 15, p.accent);
    for (let i = 0; i < 17; i++) {
      const y = 141 + i * 17;
      const bend = Math.sin(time * .8 + i * 1.7) * (12 + beat * 27);
      line(c, 404, y, 452, y + bend, `${p.second}3d`, 2);
      line(c, 508, y + bend, 556, y, `${p.accent}3d`, 2);
    }
    label(c, 'NO PROOF. NO COUNTEREXAMPLE.', 480, 455, 24, p.ink);
    const mark = Math.floor(local * 3) % 4;
    for (let i = 0; i < 4; i++) circle(c, 451 + i * 20, 391, i === mark ? 6 : 3, i === mark ? p.accent : p.dim);
  }
  const scenes = [search, check, oracle, question];
  function draw(c, width, height, now, options = {}) {
    const elapsed = last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = now;
    if (options.animate !== false) time += elapsed * clamp(Number(options.speed) || 1, .2, 3);
    const index = Math.floor(time / 14) % chapters.length;
    const local = time % 14;
    const beat = clamp((options.bass || 0) * .75 + (options.mid || 0) * .42 + (options.treble || 0) * .28, 0, 1);
    const form = palettes[options.form] ? options.form : 'blueprint';
    const p = palettes[form];
    c.save(); c.scale(width / 960, height / 540);
    backdrop(c, p, form, beat);
    scenes[index](c, p, local, beat, form);
    c.fillStyle = `${p.top}e8`; c.fillRect(0, 0, 960, 72);
    label(c, 'P = NP ?', 34, 47, 31, p.accent, 'left');
    label(c, chapters[index][0], 480, 47, 28, p.ink);
    c.fillStyle = `${p.top}ed`; c.fillRect(0, 492, 960, 48);
    label(c, chapters[index][1], 26, 522, 17, p.ink, 'left');
    for (let i = 0; i < chapters.length; i++) {
      c.fillStyle = i === index ? p.accent : p.dim;
      c.fillRect(820 + i * 31, 515, 21, 6);
    }
    c.restore();
    return { chapter: chapters[index][0], index, form, beat, time };
  }
  return { chapters, recipes, draw, reset };
})();
