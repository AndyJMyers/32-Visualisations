/* Autumn 06: an imagined drive through the countryside in seven classic cockpits. */
window.AutumnDrive = (() => {
  const cars = [
    { id: 'chimaera', name: 'TVR Chimaera', dash: '#5e3929', trim: '#c7aa7f', body: '#9d3130', wheel: '#211b1b', gauges: 5, stripe: false },
    { id: 'cloud', name: 'Rolls-Royce Silver Cloud', dash: '#694225', trim: '#d4b677', body: '#c5c5b8', wheel: '#eee0c1', gauges: 4, stripe: false },
    { id: 'azure', name: 'Bentley Azure', dash: '#79502d', trim: '#e0c993', body: '#355b61', wheel: '#d8c39f', gauges: 6, stripe: false },
    { id: 'sagaris', name: 'TVR Sagaris', dash: '#232627', trim: '#a9bac1', body: '#6950a1', wheel: '#15181b', gauges: 5, stripe: false },
    { id: 'gt40', name: 'Ford GT40', dash: '#292b2a', trim: '#d0b9a0', body: '#5592a5', wheel: '#27201b', gauges: 6, stripe: true },
    { id: 'duesenberg', name: 'Duesenberg', dash: '#9f9b89', trim: '#d5b36c', body: '#6e3028', wheel: '#37271d', gauges: 5, stripe: false },
    { id: 'miura', name: 'Lamborghini Miura', dash: '#242321', trim: '#d5b989', body: '#d57b35', wheel: '#3a281e', gauges: 5, stripe: false },
  ];
  const recipes = cars.map((car, i) => ({ name: car.name, form: i, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 }));
  const regions = [
    { id: 'yorkshire', name: 'Yorkshire Moors', sky: ['#74818a', '#b4aaa0', '#d8bf91'], hill: '#77715f', field: '#7b7554', verge: '#696647', rain: 1 },
    { id: 'newengland', name: 'New England', sky: ['#638ca0', '#d5b38d', '#e5ce94'], hill: '#776b62', field: '#977642', verge: '#806d39', rain: .55 },
    { id: 'tokyo', name: 'Tokyo', sky: ['#7c91aa', '#d2a8a1', '#e5c9aa'], hill: '#777b80', field: '#7a796d', verge: '#686c62', rain: .3 },
    { id: 'tuscany', name: 'Tuscany', sky: ['#688eaa', '#e8be85', '#f0d5a0'], hill: '#978c6b', field: '#a18d5d', verge: '#858256', rain: .15 },
    { id: 'alps', name: 'Great St Bernard Pass', sky: ['#527993', '#afbdbe', '#e5d6ba'], hill: '#6d7d86', field: '#596c66', verge: '#77756c', rain: .35 },
  ];
  const regionDuration = 28;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const x = clamp(v, 0, 1); return x * x * (3 - 2 * x); };
  const fract = v => v - Math.floor(v);
  const rand = v => fract(Math.sin(v * 127.1 + 71.3) * 43758.5453);
  let time = 0, last = null, bass = 0, treble = 0;
  function reset() { time = 0; last = null; bass = 0; treble = 0; }
  function shape(c, color, points) {
    c.fillStyle = color; c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.closePath(); c.fill();
  }
  function oval(c, x, y, rx, ry, color) {
    c.fillStyle = color; c.beginPath(); c.ellipse(x, y, Math.max(.001, rx), Math.max(.001, ry), 0, 0, Math.PI * 2); c.fill();
  }
  function line(c, color, width, points) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.stroke();
  }
  function gauge(c, x, y, r, car, value, label, aspect) {
    c.save(); c.translate(x, y); c.scale(1, aspect); x = 0; y = 0;
    oval(c, x, y, r * 1.13, r * 1.13, car.trim);
    oval(c, x, y, r, r, car.id === 'cloud' || car.id === 'duesenberg' ? '#e1cf9d' : '#151b1c');
    const ink = car.id === 'cloud' || car.id === 'duesenberg' ? '#513a2d' : '#e7d6ae';
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (.75 + i * .1875);
      line(c, ink, .0018, [x + Math.cos(a) * r * .75, y + Math.sin(a) * r * .75, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9]);
    }
    const a = Math.PI * (.75 + clamp(value, 0, 1) * 1.5);
    line(c, '#d46e53', .003, [x, y, x + Math.cos(a) * r * .65, y + Math.sin(a) * r * .65]);
    oval(c, x, y, r * .08, r * .08, car.trim);
    c.fillStyle = ink; c.textAlign = 'center'; c.font = `600 ${r * .23}px sans-serif`; c.fillText(label, x, y + r * .45);
    c.restore();
  }
  function tree(c, x, y, s, seed, region) {
    if (region === 'alps') {
      line(c, '#493d32', s * .08, [x, y, x, y - s * .9]);
      for (let j = 0; j < 4; j++) {
        const level = j / 4;
        shape(c, j % 2 ? '#314c48' : '#436159',
          [x, y - s * (.34 + level * .16), x - s * (.28 - level * .045), y - s * (.2 + level * .17),
            x, y - s * (.95 + level * .04), x + s * (.28 - level * .045), y - s * (.2 + level * .17)]);
      }
      return;
    }
    if (region === 'tuscany' && seed % 3 !== 0) {
      line(c, '#564d36', s * .1, [x, y, x, y - s * .88]);
      for (let j = 0; j < 3; j++) oval(c, x, y - s * (.5 + j * .16), s * (.15 - j * .02), s * .26, '#354d3b');
      return;
    }
    if (region === 'yorkshire') {
      line(c, '#dfd5bd', s * .075, [x, y, x + s * .04, y - s * .83]);
      for (let j = 0; j < 5; j++) {
        const bx = x + (rand(seed * 8 + j) - .5) * s * .5;
        oval(c, bx, y - s * (.65 + rand(seed + j * 9) * .32), s * .19, s * .13,
          j % 2 ? '#a57843' : '#8e8046');
      }
      return;
    }
    line(c, '#4a3628', s * .11, [x, y, x, y - s * .8]);
    const hues = region === 'tokyo'
      ? (seed % 2 ? ['#d8a941', '#edc55e', '#c99c32'] : ['#9e383e', '#c94e43', '#e0774c'])
      : region === 'newengland'
        ? ['#a83832', '#cf4b2d', '#e19a2e', '#e4ba51']
        : ['#758154', '#84905c', '#9b985e'];
    for (let j = 0; j < 5; j++) {
      const spread = region === 'tokyo' && seed % 2 ? .46 : .7;
      oval(c, x + (rand(seed * 8 + j) - .5) * s * spread,
        y - s * (.64 + rand(seed + j * 9) * .4), s * .29, s * .2, hues[(seed + j) % hues.length]);
    }
  }
  function weather(c, shower, region) {
    for (let i = 0; i < 4; i++) {
      const x = fract(.12 + i * .29 + time * (.004 + i * .0015)) * 1.35 - .16;
      const y = .13 + (i % 3) * .065;
      const size = .065 + (i % 2) * .025;
      const shade = shower > .1 && i < 2 ? '#68777bc9' : region === 'tuscany' ? '#f6e3caaa' : '#e9e1ceaa';
      oval(c, x, y, size, .023, shade);
      oval(c, x - size * .42, y + .008, size * .65, .019, shade);
      oval(c, x + size * .45, y + .007, size * .73, .020, shade);
    }
    const flight = fract((time + 4) / 26);
    for (let i = 0; i < 5; i++) {
      const x = -.10 + flight * 1.25 - i * .026;
      const y = .11 + i * .018 + Math.sin(time * .6 + i) * .006;
      const wing = Math.sin(time * 8 + i * .9) * .008;
      line(c, '#283b3dcc', .0018, [x - .013, y + wing, x, y, x + .013, y + wing]);
    }
  }
  function rain(c, shower) {
    if (shower <= 0) return;
    for (let i = 0; i < 85; i++) {
      const x = fract(rand(i * 13 + 2) + time * (.08 + rand(i + 90) * .02));
      const y = fract(rand(i * 17 + 5) + time * (.5 + rand(i + 180) * .2));
      const length = .015 + rand(i * 3 + 20) * .025;
      line(c, `rgba(220, 239, 242, ${shower * (.13 + rand(i + 300) * .26)})`, .0013, [x, y, x - length * .32, y + length]);
    }
  }
  function landmarks(c, region, horizon, motion) {
    if (region === 'yorkshire') {
      for (const side of [-1, 1]) {
        for (let i = 0; i < 9; i++) {
          const z = fract(i / 9 + motion * .26);
          const x = horizon + side * (.07 + z * .54), y = .48 + z * z * .28;
          line(c, '#b5aa96', .004 + z * .013, [x, y, x + side * (.045 + z * .05), y + z * .02]);
          line(c, '#594f45', .002 + z * .003, [x, y + .008, x + side * (.045 + z * .05), y + .008 + z * .02]);
        }
      }
      for (let i = 0; i < 12; i++) oval(c, i * .09, .405 + Math.sin(i * 2) * .018, .035, .008, '#80647794');
    } else if (region === 'newengland') {
      shape(c, '#a44d3c', [.13,.37,.20,.37,.20,.45,.13,.45]);
      shape(c, '#e5d7bd', [.115,.375,.165,.34,.215,.375]);
      c.fillStyle = '#e5d7bd'; c.fillRect(.157,.405,.028,.045);
      line(c, '#d9c7a5', .003, [.03,.48,.12,.44,.26,.45]);
    } else if (region === 'tokyo') {
      for (let i = 0; i < 13; i++) {
        const x = i * .085 - .03, height = .08 + rand(i + 31) * .11;
        c.fillStyle = i % 3 ? '#566579' : '#7a6872';
        c.fillRect(x, .44 - height, .062, height);
        for (let j = 0; j < 3; j++) {
          c.fillStyle = '#e8d2a77a';
          c.fillRect(x + .012 + j * .014, .46 - height, .005, .01);
        }
      }
      line(c, '#555765', .003, [0,.39,.31,.39]);
      line(c, '#555765', .003, [.7,.39,1,.39]);
    } else if (region === 'tuscany') {
      for (let i = 0; i < 8; i++) {
        const x = i * .09;
        line(c, '#635f40a8', .003, [x,.4,x + .16,.49]);
        line(c, '#d0aa68a8', .002, [x + .035,.4,x + .19,.49]);
      }
      shape(c, '#b6a077', [.14,.335,.20,.335,.20,.395,.14,.395]);
      shape(c, '#815c45', [.13,.34,.17,.307,.21,.34]);
      c.fillStyle = '#725947'; c.fillRect(.166,.357,.017,.038);
      for (let i = 0; i < 3; i++) tree(c, .25 + i * .035, .41, .09, i + 1, 'tuscany');
    }
  }
  function alpineCenter(depth) {
    const openRoad = smooth(((time % regionDuration) - 18) / 6);
    const bendStrength = 1 - openRoad * .82;
    const sweep = (Math.sin(time * .23) * .2 + Math.sin(time * .47 + 1.2) * .12) * bendStrength;
    return .5 + (1 - depth) * sweep
      + Math.sin(time * .32 + (1 - depth) * Math.PI * 2.2) * Math.sin(Math.PI * depth) * .21 * bendStrength;
  }
  function alpineRoad(c, motion) {
    function strip(extra) {
      const points = [];
      for (let i = 0; i <= 32; i++) {
        const d = i / 32, half = .015 + .445 * d + extra;
        points.push(alpineCenter(d) - half, .43 + .57 * d);
      }
      for (let i = 32; i >= 0; i--) {
        const d = i / 32, half = .015 + .445 * d + extra;
        points.push(alpineCenter(d) + half, .43 + .57 * d);
      }
      return points;
    }
    shape(c, '#c4bcb0', strip(.016));
    shape(c, '#41484b', strip(0));
    for (let i = 0; i < 13; i++) {
      const z = fract(i / 13 + motion), z2 = Math.min(1, z + .026);
      const d1 = z * z, d2 = z2 * z2;
      shape(c, '#e3d7b2', [
        alpineCenter(d1) - .001 - z * .004, .43 + d1 * .57,
        alpineCenter(d1) + .001 + z * .004, .43 + d1 * .57,
        alpineCenter(d2) + .001 + z2 * .004, .43 + d2 * .57,
        alpineCenter(d2) - .001 - z2 * .004, .43 + d2 * .57,
      ]);
    }
    for (const side of [-1, 1]) {
      const rail = [];
      for (let i = 0; i <= 17; i++) {
        const d = .06 + i / 17 * .69;
        const x = alpineCenter(d) + side * (.036 + .46 * d), y = .43 + .57 * d;
        rail.push(x, y - .014 - d * .018);
        if (i % 2 === 0) line(c, '#665f56', .002 + d * .004, [x, y, x, y - .018 - d * .02]);
      }
      line(c, '#e6ddd0', .005, rail);
    }
  }
  function landscape(c, region, shower) {
    const sky = c.createLinearGradient(0, 0, 0, .63);
    sky.addColorStop(0, region.sky[0]); sky.addColorStop(.62, region.sky[1]); sky.addColorStop(1, region.sky[2]);
    c.fillStyle = sky; c.fillRect(0, 0, 1, 1);
    oval(c, .72, .2, .09, .085, region.id === 'yorkshire' ? '#eee1c27d' : '#f7dba2aa');
    weather(c, shower, region.id);
    if (region.id === 'alps') {
      shape(c, '#728895', [0,.43,.08,.18,.16,.34,.31,.12,.43,.32,.58,.13,.71,.34,.85,.16,1,.36,1,.63,0,.63]);
      shape(c, '#e8e7dc', [.255,.18,.31,.12,.35,.2,.31,.185,.29,.205]);
      shape(c, '#d5d9d5', [.535,.2,.58,.13,.64,.22,.59,.195]);
      shape(c, '#536970', [0,.44,.13,.33,.25,.43,.44,.32,.57,.44,.72,.31,1,.43,1,.67,0,.67]);
      shape(c, '#8d8b80', [.79,.27,1,.18,1,.75,.91,.58,.84,.52]);
    } else {
      shape(c, region.hill, [0,.39,.16,.31,.29,.39,.46,.29,.67,.38,.85,.30,1,.38,1,.62,0,.62]);
    }
    shape(c, region.field, [0,.45,.16,.38,.34,.45,.53,.36,.76,.43,1,.37,1,.7,0,.7]);
    const bend = Math.sin(time * .12) * .055, horizon = .5 + bend;
    shape(c, region.verge, [0,.47,horizon,.43,.33,1,0,1]);
    shape(c, region.field, [horizon,.43,1,.47,1,1,.67,1]);
    const motion = time * (.12 + bass * .025);
    landmarks(c, region.id, horizon, motion);
    if (region.id === 'alps') alpineRoad(c, motion);
    else {
      shape(c, '#464b47', [horizon-.015,.43,horizon+.015,.43,.96,1,.04,1]);
      shape(c, '#c6b58d', [horizon-.018,.43,horizon-.015,.43,.04,1,.028,1]);
      shape(c, '#c6b58d', [horizon+.015,.43,horizon+.018,.43,.972,1,.96,1]);
      for (let i = 0; i < 12; i++) {
        const z = fract(i / 12 + motion), z2 = Math.min(1, z + .035);
        const y1 = .43 + z * z * .57, y2 = .43 + z2 * z2 * .57;
        const x1 = horizon + (.5 - horizon) * z, x2 = horizon + (.5 - horizon) * z2;
        shape(c, '#e8d8a7', [x1-z*.005,y1,x1+z*.005,y1,x2+z2*.005,y2,x2-z2*.005,y2]);
      }
    }
    for (let i = 0; i < 16; i++) {
      const z = fract(i / 8 + motion * .45), side = i % 2 ? 1 : -1;
      const depth = z * z;
      const y = .44 + depth * .5;
      const x = region.id === 'alps'
        ? alpineCenter(depth) + side * (.045 + z * .64)
        : horizon + side * (.045 + z * .64);
      const size = .025 + z * .24;
      if ((region.id !== 'yorkshire' || i % 3 === 0) && (region.id !== 'alps' || i % 2 === 0)) {
        tree(c, x, y, size, i, region.id);
      }
    }
    if (region.id !== 'tuscany') for (let i = 0; i < 18; i++) {
      const x = fract(rand(i + 53) + time * (.007 + treble * .014));
      const y = fract(rand(i + 71) + time * (.012 + bass * .01)) * .62;
      oval(c, x, y, .0025 + treble * .002, .002, region.id === 'tokyo' ? '#edbd55aa' : '#bc783caa');
    }
    rain(c, shower);
  }
  function instruments(c, car, aspect) {
    // Inspired by period cockpits; layouts and finishes varied by year and individual car.
    const layouts = {
      chimaera: [[.70,.855,.042,'RPM'],[.83,.855,.042,'MPH'],[.43,.84,.021,'OIL'],[.49,.84,.021,'WATER'],[.55,.84,.021,'FUEL'],[.61,.84,.021,'VOLT']],
      cloud: [[.54,.85,.054,'MPH'],[.43,.855,.027,'FUEL'],[.64,.855,.027,'OIL'],[.34,.86,.023,'TEMP']],
      azure: [[.72,.855,.044,'RPM'],[.84,.855,.044,'MPH'],[.43,.84,.022,'FUEL'],[.49,.84,.022,'TEMP'],[.55,.84,.022,'OIL'],[.61,.84,.022,'CLOCK']],
      sagaris: [[.72,.845,.044,'RPM'],[.83,.845,.037,'MPH'],[.56,.86,.022,'TEMP']],
      gt40: [[.72,.85,.050,'RPM'],[.32,.85,.032,'MPH'],[.43,.85,.022,'FUEL'],[.49,.85,.022,'OIL'],[.55,.85,.022,'TEMP'],[.61,.85,.022,'WATER']],
      duesenberg: [[.51,.85,.052,'MPH'],[.36,.85,.030,'CLOCK'],[.63,.85,.030,'OIL'],[.28,.85,.021,'FUEL'],[.70,.85,.021,'TEMP']],
      miura: [[.18,.855,.042,'MPH'],[.30,.855,.042,'RPM'],[.51,.83,.022,'OIL'],[.57,.83,.022,'FUEL'],[.51,.91,.022,'WATER'],[.57,.91,.022,'VOLT']],
    };
    if (car.id === 'sagaris') {
      shape(c, '#14191c', [.63,.82,.65,.75,.88,.75,.91,.82,.89,.92,.64,.92]);
      shape(c, '#9faeb4', [.65,.80,.67,.765,.87,.765,.89,.80,.88,.91,.66,.91]);
      shape(c, '#30383c', [.665,.80,.68,.78,.86,.78,.875,.80,.87,.90,.67,.90]);
    } else if (car.id === 'miura') {
      shape(c, '#151919', [.46,.78,.62,.78,.65,.96,.46,.96]);
      line(c, '#c0b69a', .002, [.46,.79,.62,.79,.65,.96]);
    } else if (car.id === 'duesenberg') {
      shape(c, '#b5b3a4', [.19,.78,.75,.78,.75,.96,.19,.96]);
      for (let y = .79; y < .96; y += .027) for (let x = .2; x < .75; x += .019) {
        oval(c, x, y, .009, .009 * aspect, '#e4e3d535');
        oval(c, x+.003, y-.003, .005, .005 * aspect, '#5f605930');
      }
    }
    const gauges = layouts[car.id];
    for (let i = 0; i < gauges.length; i++) {
      const [x, y, r, label] = gauges[i];
      gauge(c, x, y, r, car, .25 + bass * .35 + Math.sin(time * 1.6 + i) * .04, label, aspect);
    }
    if (car.id === 'sagaris') {
      c.fillStyle = '#92ccd0'; c.fillRect(.70,.913,.14,.024);
      c.fillStyle = '#1a3436'; c.font = 'bold .013px monospace'; c.textAlign = 'center';
      c.fillText(`${Math.round(38 + bass * 25)}   MPH`, .77, .931);
    }
    if (car.id === 'gt40' || car.id === 'miura') {
      const start = car.id === 'gt40' ? .34 : .66;
      for (let i = 0; i < 5; i++) {
        const x = start + i * .035;
        oval(c, x, .95, .008, .008 * aspect, '#bab6a5');
        line(c, '#d5d0bd', .003, [x,.949,x+.003,.934]);
      }
    }
    if (car.id === 'azure' || car.id === 'cloud') {
      for (let i = 0; i < 3; i++) {
        const x = .39 + i * .045;
        oval(c, x, .95, .011, .011 * aspect, car.trim);
        oval(c, x, .95, .007, .007 * aspect, '#202b2b');
      }
      line(c, '#e5ca90', .002, [.57,.953,.65,.953]);
    }
  }
  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .1);
    last = animate ? now : null;
    const smoothing = 1 - Math.exp(-dt * 4);
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * smoothing;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * smoothing;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const car = cars.find(item => item.id === opts.form) || cars[0];
    const routeOffset = car.id === 'miura' ? regions.length - 1 : 0;
    const regionIndex = (Math.floor(time / regionDuration) + routeOffset) % regions.length;
    const region = regions[regionIndex], nextRegion = regions[(regionIndex + 1) % regions.length];
    const regionPhase = time % regionDuration;
    const transition = smooth((regionPhase - (regionDuration - 4)) / 4);
    const showerPhase = time % 34;
    const showerPulse = clamp(Math.min((showerPhase - 5) / 3, (20 - showerPhase) / 4), 0, 1);
    const shower = showerPulse * (region.rain * (1 - transition) + nextRegion.rain * transition);
    // A normalized scene keeps the cockpit readable in both landscape and portrait.
    c.save(); c.scale(w, h);
    landscape(c, region, shower);
    if (transition) {
      c.save(); c.globalAlpha = transition;
      landscape(c, nextRegion, shower);
      c.restore();
    }
    // The bonnet and dashboard frame the road, leaving the road itself visible.
    const bonnet = c.createLinearGradient(0, .64, 0, .83);
    bonnet.addColorStop(0, car.body); bonnet.addColorStop(.45, car.body); bonnet.addColorStop(1, '#101b20');
    shape(c, bonnet, [.12,.70,.26,.64,.74,.64,.88,.70,.95,.83,.05,.83]);
    if (car.stripe) shape(c, '#e8c484', [.47,.645,.53,.645,.56,.81,.44,.81]);
    line(c, '#f6e4ba66', .004, [.26,.67,.37,.65,.63,.65,.74,.67]);
    shape(c, '#16191a', [0,.79,.12,.76,.27,.77,.34,.74,.68,.74,.8,.77,1,.77,1,1,0,1]);
    const dash = c.createLinearGradient(0, .77, 0, 1);
    dash.addColorStop(0, car.dash); dash.addColorStop(.5, car.dash); dash.addColorStop(1, '#181716');
    shape(c, dash, [0,.81,.14,.79,.29,.80,.36,.77,.67,.77,.81,.80,1,.79,1,1,0,1]);
    line(c, car.trim, .005, [0,.81,.14,.79,.29,.80,.36,.77,.67,.77,.81,.80,1,.79]);
    if (car.id === 'azure' || car.id === 'cloud' || car.id === 'chimaera') {
      for (let i = 0; i < 12; i++) {
        const y = .8 + i * .017;
        line(c, i % 2 ? '#ebc38918' : '#29170f30', .001, [.32, y, .96, y + Math.sin(i * 3) * .004]);
      }
    }
    instruments(c, car, w / h);
    const wheelX = car.id === 'miura' ? .24 : .76, wheelY = .95, radius = .165;
    const turn = Math.sin(time * .24) * .2
      + (region.id === 'alps' ? (.5 - alpineCenter(0)) * .85 : Math.sin(time * .12) * .055);
    c.save(); c.translate(wheelX, wheelY); c.scale(1, w / h); c.rotate(turn);
    c.strokeStyle = '#0e1111'; c.lineWidth = .037; c.beginPath(); c.arc(0, 0, radius, 0, Math.PI * 2); c.stroke();
    c.strokeStyle = car.wheel; c.lineWidth = .026; c.beginPath(); c.arc(0, 0, radius, 0, Math.PI * 2); c.stroke();
    for (const angle of [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6]) line(c, car.trim, .012, [0,0,Math.cos(angle)*radius*.9,Math.sin(angle)*radius*.9]);
    oval(c, 0, 0, .034, .034, car.trim); oval(c, 0, 0, .025, .025, car.wheel);
    c.restore();
    c.textAlign = 'left'; c.font = '600 .018px sans-serif'; c.fillStyle = '#f9e8c8cc'; c.fillText(car.name.toUpperCase(), .025, .05);
    c.textAlign = 'right'; c.fillText((transition > .5 ? nextRegion : region).name.toUpperCase(), .975, .05);
    c.restore();
    return { time, car: car.id, region: region.id, transition, wheelSide: car.id === 'miura' ? 'left' : 'right',
      openRoad: region.id === 'alps' ? smooth((regionPhase - 18) / 6) : 0, bass, treble, shower };
  }
  return { cars, regions, recipes, draw, reset };
})();
