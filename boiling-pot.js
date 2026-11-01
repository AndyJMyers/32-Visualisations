/* A music-led descent into the old tar pits and their sulphurous mine. */
window.BoilingPot = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const recipes = [
    { name: 'Tar Black', form: 'tar', theme: 0, speed: 1, size: 1, count: 8, grasp: .45, smiles: 0, insanity: 0 },
    { name: 'Sulphur Vein', form: 'sulphur', theme: 0, speed: 1, size: 1, count: 8, grasp: .45, smiles: 0, insanity: 0 },
    { name: 'Blue Fire', form: 'bluefire', theme: 0, speed: 1, size: 8, count: 8, grasp: .45, smiles: 0, insanity: 0 },
    { name: 'The Old Mine', form: 'mine', theme: 0, speed: 1, size: 1, count: 8, grasp: .45, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    tar: { sky: '#292522', haze: '#5e4837', ridge: '#201c19', pit: '#100e0d', tar: '#211a15', rim: '#bc793a', glow: '#e4a344', sulphur: '#e1c445', limb: '#171716', smoke: '#b9a38a', blast: '#ffb347' },
    sulphur: { sky: '#302b18', haze: '#6c6030', ridge: '#252214', pit: '#13120c', tar: '#242113', rim: '#c0a43b', glow: '#f2d849', sulphur: '#f8ef71', limb: '#1b1a13', smoke: '#ddd48a', blast: '#ffe878' },
    bluefire: { sky: '#101f30', haze: '#36586c', ridge: '#111a24', pit: '#080d13', tar: '#101923', rim: '#4489a0', glow: '#64e5ef', sulphur: '#c2fcf1', limb: '#0a1118', smoke: '#9bd3dd', blast: '#b8f8ff' },
    mine: { sky: '#24181c', haze: '#65392c', ridge: '#201619', pit: '#100b10', tar: '#1d1010', rim: '#a64a2e', glow: '#f06431', sulphur: '#ffb83e', limb: '#160e11', smoke: '#c69a86', blast: '#fff0a6' },
  };

  let time = 0;
  let last = null;
  let drive = 0;
  let phase = 0;
  let nextBlastAt = 39;
  let blastStartedAt = -Infinity;
  let birds = [];
  let birdForm = null;
  const behaviours = {
    tar: { vents: 3, period: 11, height: 195, width: 30, burn: 2.4, cloud: 1, flame: '#ff8b20' },
    sulphur: { vents: 6, period: 8.5, height: 245, width: 23, burn: 3.1, cloud: 2.6, flame: '#d9ff5c' },
    bluefire: { vents: 5, period: 6, height: 285, width: 13, burn: 2.8, cloud: .6, flame: '#38bdff' },
    mine: { vents: 2, period: 14, height: 310, width: 48, burn: 4.2, cloud: 1.8, flame: '#ff481a' },
  };

  function reset() {
    time = 0;
    last = null;
    drive = 0;
    phase = 0;
    nextBlastAt = 39;
    blastStartedAt = -Infinity;
    birds = [];
    birdForm = null;
  }

  function path(c, points, colour, width = 2, close = false) {
    c.beginPath();
    c.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
    if (close) c.closePath();
    c.strokeStyle = colour;
    c.lineWidth = width;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.stroke();
  }

  function polygon(c, points, colour) {
    c.beginPath();
    c.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
    c.closePath();
    c.fillStyle = colour;
    c.fill();
  }

  function disc(c, x, y, rx, ry, colour, stroke = null, lineWidth = 1) {
    c.beginPath();
    c.ellipse(x, y, Math.max(.2, rx), Math.max(.2, ry), 0, 0, TAU);
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = lineWidth;
      c.stroke();
    } else {
      c.fillStyle = colour;
      c.fill();
    }
  }

  function backdrop(c, p, form, beat) {
    const sky = c.createLinearGradient(0, 0, 0, 540);
    sky.addColorStop(0, p.sky);
    sky.addColorStop(.67, p.haze);
    sky.addColorStop(1, p.ridge);
    c.fillStyle = sky;
    c.fillRect(0, 0, 960, 540);

    for (let i = 0; i < 20; i++) {
      const x = (i * 97 + 22) % 960;
      const y = 130 + (i * 53) % 190;
      disc(c, x, y + Math.sin(time * .18 + i) * 3, 1.5 + i % 3, 1.5 + i % 3, `${p.sulphur}55`);
    }

    polygon(c, [[0, 324], [96, 286], [192, 313], [282, 263], [375, 304], [485, 271], [588, 316], [694, 260], [791, 300], [875, 267], [960, 300], [960, 540], [0, 540]], p.ridge);
    if (form === 'bluefire') {
      c.fillStyle = `${p.glow}14`;
      c.fillRect(0, 300, 960, 240);
    }
    if (form === 'mine' || form === 'tar') drawMine(c, p, beat);
    drawSulphurCrust(c, p, beat);
    drawTarPools(c, p, beat);
  }

  function drawMine(c, p, beat) {
    const x = 742;
    const y = 236;
    polygon(c, [[x - 73, y + 52], [x - 42, y - 83], [x + 41, y - 83], [x + 77, y + 52]], '#191716');
    path(c, [[x - 98, y + 54], [x - 50, y - 98], [x + 49, y - 98], [x + 103, y + 54]], p.rim, 10);
    path(c, [[x - 49, y - 88], [x + 51, y + 49]], `${p.smoke}9a`, 7);
    path(c, [[x + 49, y - 88], [x - 48, y + 49]], `${p.smoke}9a`, 7);
    path(c, [[x, y - 111], [x, y - 27]], p.rim, 7);
    disc(c, x, y - 111, 22, 22, p.rim, p.glow, 4);
    path(c, [[x, y - 133], [x, y - 89]], p.sulphur, 4);
    disc(c, x, y + 25, 52, 29, p.pit);
    disc(c, x, y + 18, 37, 18, p.limb);
    disc(c, x, y + 15, 20 + beat * 7, 7 + beat * 4, p.glow);
  }

  function drawSulphurCrust(c, p, beat) {
    for (let i = 0; i < 9; i++) {
      const x = 38 + i * 111;
      const y = 335 + Math.sin(i * 1.7 + time * .15) * 8;
      const size = 8 + (i % 3) * 4;
      polygon(c, [[x - size, y], [x - size * .62, y - size * (1.2 + beat * .2)], [x, y - size * 1.6], [x + size * .55, y - size * .8], [x + size, y]], `${p.sulphur}ad`);
      path(c, [[x, y - size * 1.25], [x + size * .4, y - size * .48]], `${p.glow}bf`, 2);
    }
  }

  function drawTarPools(c, p, beat) {
    const surface = x => 373 + Math.sin(x * .012 + time * .75) * (8 + beat * 6) + Math.sin(x * .031 - time * .44) * 5;
    c.beginPath();
    c.moveTo(0, surface(0));
    for (let x = 0; x <= 960; x += 16) c.lineTo(x, surface(x));
    c.lineTo(960, 540);
    c.lineTo(0, 540);
    c.closePath();
    c.fillStyle = p.pit;
    c.fill();
    path(c, Array.from({ length: 61 }, (_, i) => [i * 16, surface(i * 16)]), p.rim, 4 + beat * 2);

    for (let i = 0; i < 7; i++) {
      const x = 46 + i * 145;
      const y = surface(x) + 38 + (i % 2) * 40;
      const w = 62 + (i % 3) * 21;
      disc(c, x, y, w, 17 + (i % 2) * 8, p.tar);
      disc(c, x - 7, y - 3, w * .7, 4 + beat * 4, `${p.glow}45`);
      for (let crack = 0; crack < 3; crack++) {
        const start = x - w * .55 + crack * w * .5;
        path(c, [[start, y + 4], [start + 9, y + 11 + crack * 2], [start + 19, y + 6]], `${p.sulphur}75`, 1.5);
      }
    }
  }

  function drawBubble(c, p, x, y, radius, age, beat, index) {
    const rise = 1 - age;
    const alpha = clamp(Math.min(age * 5, (1 - age) * 7, .76) + beat * .13, .08, .9);
    c.globalAlpha = alpha;
    disc(c, x, y, radius, radius * (0.72 + Math.sin(time * 2 + index) * .08), p.tar, p.rim, Math.max(1.5, radius * .11));
    disc(c, x - radius * .25, y - radius * .25, radius * .27, radius * .14, p.sulphur);
    if (age > .88) {
      disc(c, x, y - 3, radius * (1 + (age - .88) * 3), radius * .55, 'transparent', `${p.glow}bb`, 2);
      for (let spark = 0; spark < 3; spark++) {
        const a = time * 4 + index + spark * TAU / 3;
        disc(c, x + Math.cos(a) * radius * 1.35, y + Math.sin(a) * radius * .8, 2 + beat * 2, 2 + beat * 2, p.sulphur);
      }
    }
    if (rise < .3 && p.glow !== p.sulphur) c.globalAlpha = alpha;
    c.globalAlpha = 1;
  }

  function drawLimbs(c, p, beat) {
    const limbs = [
      { x: 246, kind: 'hand', phase: (time * .12 + .08) % 1, side: -1 },
      { x: 480, kind: 'foot', phase: (time * .095 + .56) % 1, side: 1 },
      { x: 617, kind: 'hand', phase: (time * .1 + .68) % 1, side: 1 },
    ];
    limbs.forEach((limb, index) => {
      const emergence = Math.pow(Math.max(0, Math.sin(limb.phase * Math.PI)), 1.3);
      const surface = 374 + Math.sin(limb.x * .012 + time * .75) * 10;
      const lift = emergence * (57 + beat * 26);
      const x = limb.x + Math.sin(time * .65 + index * 2) * (8 + beat * 7);
      const jointY = surface - lift;
      c.globalAlpha = .45 + emergence * .55;
      if (limb.kind === 'hand') {
        path(c, [[x, surface + 9], [x + limb.side * 3, surface - 10], [x + limb.side * 1, jointY + 16]], p.limb, 16);
        disc(c, x, jointY + 9, 9, 12, p.limb);
        const spread = 9 + emergence * 7;
        for (let finger = 0; finger < 4; finger++) {
          const offset = (finger - 1.5) * spread * .42;
          const fingerLift = Math.sin(time * .9 + index + finger) * (2 + beat * 4);
          path(c, [[x + offset, jointY + 6], [x + offset * 1.18, jointY - 12 - emergence * 7 + fingerLift]], p.limb, 5.5);
        }
        path(c, [[x + limb.side * 6, jointY + 10], [x + limb.side * 19, jointY + 1 - emergence * 9]], p.limb, 6);
      } else {
        path(c, [[x, surface + 12], [x - 2, surface - 10], [x + limb.side * 3, jointY + 8]], p.limb, 18);
        c.save();
        c.translate(x + limb.side * 9, jointY + 8);
        c.rotate(limb.side * (.14 + emergence * .22));
        disc(c, 0, 0, 13, 8, p.limb);
        for (let toe = 0; toe < 4; toe++) disc(c, limb.side * (9 + toe * 3), -4 + toe * 2.7, 3.1, 2.2, p.limb);
        c.restore();
      }
      c.globalAlpha = 1;
      disc(c, x, surface + 2, 24 + emergence * 10, 4 + beat * 3, `${p.glow}66`);
    });
  }

  function drawSteam(c, p, beat) {
    for (let i = 0; i < 16; i++) {
      const cycle = (time * (.12 + (i % 4) * .018) + i * .137) % 1;
      const x0 = 92 + (i * 173) % 800;
      const y0 = 376 + Math.sin(x0 * .012 + time * .75) * 9;
      const x = x0 + Math.sin(time * .7 + i * 1.8) * (16 + cycle * 40);
      const y = y0 - cycle * (86 + beat * 54);
      const radius = 2 + cycle * (10 + beat * 6);
      const opacity = Math.round((1 - cycle) * 92).toString(16).padStart(2, '0');
      disc(c, x, y, radius, radius * .68, `${p.sulphur}${opacity}`);
      if (i % 3 === 0) disc(c, x + radius * .35, y, radius * .42, radius * .28, `${p.glow}${opacity}`);
    }
  }

  function drawMineBlast(c, p, beat) {
    const age = time - blastStartedAt;
    if (age < 0 || age > 2.25) return false;
    const impact = Math.exp(-age * 2.3) * (0.65 + beat * .6);
    const x = 742;
    const y = 257;
    c.globalAlpha = clamp(impact, 0, 1);
    disc(c, x, y + 7, 42 + age * 92, 23 + age * 54, p.blast);
    disc(c, x, y + 7, 22 + age * 66, 13 + age * 39, p.glow);
    for (let i = 0; i < 24; i++) {
      const angle = i * 2.399 + age * 2;
      const distance = age * (80 + (i % 5) * 37) * (0.7 + beat * .5);
      const sx = x + Math.cos(angle) * distance;
      const sy = y + 4 + Math.sin(angle) * distance * .62 + age * age * 42;
      disc(c, sx, sy, Math.max(.8, 3.5 * (1 - age / 2.5)), Math.max(.8, 2.5 * (1 - age / 2.5)), i % 4 === 0 ? p.sulphur : p.blast);
    }
    c.globalAlpha = 1;
    return true;
  }

  function drawGasJets(c, p, form, beat) {
    const b = behaviours[form];
    const jets = [];
    for (let i = 0; i < b.vents; i++) {
      const x = 125 + i * 710 / Math.max(1, b.vents - 1);
      const y = 416 + Math.sin(i * 2.1) * 29;
      const clock = (time + i * b.period * .37) % b.period;
      const ignition = b.period * .48;
      const age = clock - ignition;
      const envelope = age >= 0 && age < b.burn ? Math.pow(Math.sin(age / b.burn * Math.PI), .55) : 0;
      const height = b.height * envelope * (.8 + beat * .5);
      const width = b.width * (.8 + envelope * .6);
      jets.push({ x, y, height, width });
      disc(c, x, y + 4, width * 1.8, 9, p.tar, p.rim, 2);

      // Pressure visibly swells the surface before the gas breaks through.
      if (clock < ignition) {
        const pressure = clock / ignition;
        disc(c, x, y, width * (1 + pressure), 3 + pressure * 27, p.tar, p.sulphur, 2);
        disc(c, x - width * .3, y - pressure * 19, width * .45, 3, `${p.glow}75`);
      }
      for (let puff = 0; puff < 7; puff++) {
        const lift = (clock * .17 + puff / 7) % 1;
        const opacity = Math.round((1 - lift) * 46 * Math.min(1.5, b.cloud)).toString(16).padStart(2, '0');
        const drift = Math.sin(time * .7 + i + puff) * lift * 62;
        disc(c, x + drift, y - lift * (110 + b.cloud * 32), (12 + lift * 30) * b.cloud, 8 + lift * 18, `${p.sulphur}${opacity}`);
      }
      if (height < 1) continue;
      const halo = c.createRadialGradient(x, y - height * .4, 2, x, y - height * .4, height * .8);
      halo.addColorStop(0, `${b.flame}66`);
      halo.addColorStop(1, `${b.flame}00`);
      c.fillStyle = halo;
      c.fillRect(x - height, y - height * 1.3, height * 2, height * 1.6);
      for (let tongue = 0; tongue < 5; tongue++) {
        const offset = (tongue - 2) * width * .32;
        const reach = height * (1 - Math.abs(tongue - 2) * .13);
        const sway = Math.sin(time * (9 + tongue) + i * 3) * width * .65;
        c.beginPath();
        c.moveTo(x + offset - width * .38, y);
        c.bezierCurveTo(x + offset - width, y - reach * .4, x + sway - width * .3, y - reach * .8, x + offset + sway, y - reach);
        c.bezierCurveTo(x + offset + width * .4, y - reach * .58, x + offset + width, y - reach * .25, x + offset + width * .38, y);
        c.closePath();
        c.fillStyle = tongue % 2 ? p.blast : b.flame;
        c.fill();
      }
      polygon(c, [[x - width * .3, y], [x + Math.sin(time * 17) * width * .2, y - height * .66], [x + width * .3, y]], '#fff5c9');
      for (let spark = 0; spark < 9; spark++) {
        const rise = (time * .8 + spark / 9) % 1;
        disc(c, x + Math.sin(spark * 5 + time) * rise * width * 2, y - rise * height * 1.2, 1.2, 2.5, p.blast);
      }
    }
    return jets;
  }

  function drawBirds(c, p, form, jets, animate) {
    if (birdForm !== form) { birds = []; birdForm = form; }
    let falling = 0;
    for (let i = 0; i < 5; i++) {
      const duration = 13 + i * 1.7;
      const flightTime = time + i * 3.9;
      const cycle = Math.floor(flightTime / duration);
      if (!birds[i] || birds[i].cycle !== cycle) birds[i] = { cycle, hitAt: null };
      const bird = birds[i];
      const progress = flightTime % duration / duration;
      const direction = i % 2 ? -1 : 1;
      let x = direction > 0 ? -70 + progress * 1100 : 1030 - progress * 1100;
      let y = 155 + i * 30 + Math.sin(progress * TAU + i) * 22;
      if (animate && bird.hitAt === null && jets.some(jet => jet.height > 35 && Math.abs(x - jet.x) < jet.width * 1.4 && y > jet.y - jet.height && y < jet.y)) {
        bird.hitAt = time;
        bird.x = x;
        bird.y = y;
      }
      const age = bird.hitAt === null ? null : time - bird.hitAt;
      if (age !== null) {
        falling++;
        x = bird.x + direction * age * 28;
        y = bird.y - age * 25 + age * age * 90;
        if (y > 493) continue;
      }
      c.save();
      c.translate(x, y);
      c.rotate(age === null ? direction * -.08 : age * direction * 5);
      const wing = age === null ? Math.sin(time * (7 + i * .3) + i) * 10 : 5;
      path(c, [[-17, -wing], [-7, 0], [0, 3], [7, 0], [17, -wing]], '#141313', 3);
      disc(c, 0, 2, 5, 3, '#141313');
      path(c, [[direction * 3, 1], [direction * 9, -2]], p.smoke, 1.5);
      if (age !== null && age < .7) disc(c, 0, 0, 5, 9, `${p.blast}bb`);
      c.restore();
      if (age !== null) {
        for (let feather = 0; feather < 4; feather++) {
          const fy = bird.y + age * 28 + feather * 8;
          const fx = bird.x + Math.sin(age * 3 + feather) * age * 24;
          path(c, [[fx, fy], [fx + 4, fy + 5]], p.smoke, 1.5);
        }
      }
    }
    return falling;
  }

  function draw(c, width, height, now, options = {}) {
    const animate = options.animate !== false;
    const elapsed = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const speed = clamp(Number(options.speed) || 1, .2, 3);
    if (animate) time += elapsed * speed;
    const bass = clamp(Number(options.bass) || 0, 0, 1);
    const mid = clamp(Number(options.mid) || 0, 0, 1);
    const treble = clamp(Number(options.treble) || 0, 0, 1);
    const beat = clamp(bass * .88 + mid * .24 + treble * .12, 0, 1);
    drive += (beat - drive) * (1 - Math.exp(-elapsed * 4.5));
    phase += animate ? elapsed * speed * (.35 + drive * 1.4) : 0;

    if (animate && time >= nextBlastAt) {
      blastStartedAt = time;
      nextBlastAt = time + 39 + Math.min(.5, treble) * 19;
    }

    const form = palettes[options.form] ? options.form : 'tar';
    const p = palettes[form];
    c.save();
    c.scale(width / 960, height / 540);
    backdrop(c, p, form, drive);

    for (let i = 0; i < 27; i++) {
      const age = (time * (.05 + (i % 5) * .013) + i * .173) % 1;
      const x0 = 24 + (i * 137) % 914;
      const surface = 373 + Math.sin(x0 * .012 + time * .75) * 8;
      const x = x0 + Math.sin(time * .62 + i * 2.3) * (4 + drive * 8);
      const y = surface - age * (95 + drive * 70);
      const radius = (3 + (i % 6) * 2.4 + drive * 6) * (.45 + Math.sin(age * Math.PI) * .55);
      drawBubble(c, p, x, y, radius, age, drive, i);
    }

    drawSteam(c, p, drive);
    drawLimbs(c, p, drive);
    const jets = drawGasJets(c, p, form, drive);
    const birdsFalling = drawBirds(c, p, form, jets, animate);
    const blastActive = drawMineBlast(c, p, Math.max(drive, bass));
    if (blastActive) {
      c.globalAlpha = Math.max(0, 1 - (time - blastStartedAt) * 1.5) * .22;
      c.fillStyle = p.blast;
      c.fillRect(0, 0, 960, 540);
      c.globalAlpha = 1;
    }

    c.fillStyle = `${p.pit}eF`;
    c.fillRect(0, 0, 960, 62);
    c.font = '700 27px Georgia';
    c.textAlign = 'left';
    c.fillStyle = p.sulphur;
    c.fillText('BOILING POT', 24, 41);
    c.font = '600 15px system-ui, sans-serif';
    c.textAlign = 'right';
    c.fillStyle = p.smoke;
    c.fillText(form === 'tar' ? 'THE TAR PITS' : form === 'sulphur' ? 'SULPHUR BREATH' : form === 'bluefire' ? 'BLUE FIRE' : 'THE OLD MINE', 936, 39);
    c.fillStyle = `${p.pit}eF`;
    c.fillRect(0, 498, 960, 42);
    c.font = '500 16px system-ui, sans-serif';
    c.textAlign = 'left';
    c.fillStyle = p.smoke;
    c.fillText({ tar: 'Pressure below. An unwary sky above.', sulphur: 'Sulphur breath: the air itself is catching fire.', bluefire: 'Blue blowtorches, dancing on the downbeat.', mine: 'The old workings breathe. Then roar.' }[form], 24, 524);
    for (let i = 0; i < recipes.length; i++) {
      c.fillStyle = recipes[i].form === form ? p.glow : `${p.smoke}75`;
      c.fillRect(844 + i * 23, 516, 15, 5);
    }
    c.restore();
    return { form, beat, drive, time, blastActive, nextBlastAt, birdsFalling, jetCount: jets.length, activeJets: jets.filter(jet => jet.height > 1).length, limbPulse: (Math.sin(time * .12) + 1) / 2 };
  }

  return { recipes, draw, reset };
})();
