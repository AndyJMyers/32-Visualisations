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
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
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
  function tree(c, x, y, s, seed) {
    line(c, '#4a3628', s * .11, [x, y, x, y - s * .8]);
    const hues = ['#a65631', '#ca853b', '#b86c30', '#ddaa50'];
    for (let j = 0; j < 4; j++) oval(c, x + (rand(seed * 8 + j) - .5) * s * .65, y - s * (.65 + rand(seed + j * 9) * .38), s * .32, s * .22, hues[(seed + j) % hues.length]);
  }
  function weather(c, shower) {
    for (let i = 0; i < 4; i++) {
      const x = fract(.12 + i * .29 + time * (.004 + i * .0015)) * 1.35 - .16;
      const y = .13 + (i % 3) * .065;
      const size = .065 + (i % 2) * .025;
      const shade = shower > .1 && i < 2 ? '#68777bc9' : '#e9e1ceaa';
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
    const showerPhase = time % 34;
    const shower = clamp(Math.min((showerPhase - 5) / 3, (20 - showerPhase) / 4), 0, 1);
    // A normalized scene keeps the cockpit readable in both landscape and portrait.
    c.save(); c.scale(w, h);
    const sky = c.createLinearGradient(0, 0, 0, .63);
    sky.addColorStop(0, '#69858e'); sky.addColorStop(.62, '#edb976'); sky.addColorStop(1, '#e9ce91');
    c.fillStyle = sky; c.fillRect(0, 0, 1, 1);
    oval(c, .72, .2, .09, .085, '#f7dba2aa');
    weather(c, shower);
    shape(c, '#78816a', [0,.39,.16,.31,.29,.39,.46,.29,.67,.38,.85,.30,1,.38,1,.62,0,.62]);
    shape(c, '#a88958', [0,.45,.16,.38,.34,.45,.53,.36,.76,.43,1,.37,1,.7,0,.7]);
    const bend = Math.sin(time * .12) * .055;
    const horizon = .5 + bend;
    shape(c, '#677b46', [0,.47,horizon,.43,.33,1,0,1]);
    shape(c, '#7e8349', [horizon,.43,1,.47,1,1,.67,1]);
    shape(c, '#464b47', [horizon-.015,.43,horizon+.015,.43,.96,1,.04,1]);
    shape(c, '#c6b58d', [horizon-.018,.43,horizon-.015,.43,.04,1,.028,1]);
    shape(c, '#c6b58d', [horizon+.015,.43,horizon+.018,.43,.972,1,.96,1]);
    const motion = time * (.12 + bass * .025);
    for (let i = 0; i < 12; i++) {
      const z = fract(i / 12 + motion), z2 = Math.min(1, z + .035);
      const y1 = .43 + z * z * .57, y2 = .43 + z2 * z2 * .57;
      const x1 = horizon + (.5 - horizon) * z, x2 = horizon + (.5 - horizon) * z2;
      shape(c, '#e8d8a7', [x1-z*.005,y1,x1+z*.005,y1,x2+z2*.005,y2,x2-z2*.005,y2]);
    }
    for (let i = 0; i < 16; i++) {
      const z = fract(i / 8 + motion * .45), side = i % 2 ? 1 : -1;
      const y = .44 + z * z * .5, x = horizon + side * (.045 + z * .64);
      tree(c, x, y, .025 + z * .24, i);
    }
    rain(c, shower);
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
    const wheelX = car.id === 'miura' ? .24 : .76, wheelY = .95, radius = .165, turn = Math.sin(time * .24) * .2 + bend;
    c.save(); c.translate(wheelX, wheelY); c.scale(1, w / h); c.rotate(turn);
    c.strokeStyle = '#0e1111'; c.lineWidth = .037; c.beginPath(); c.arc(0, 0, radius, 0, Math.PI * 2); c.stroke();
    c.strokeStyle = car.wheel; c.lineWidth = .026; c.beginPath(); c.arc(0, 0, radius, 0, Math.PI * 2); c.stroke();
    for (const angle of [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6]) line(c, car.trim, .012, [0,0,Math.cos(angle)*radius*.9,Math.sin(angle)*radius*.9]);
    oval(c, 0, 0, .034, .034, car.trim); oval(c, 0, 0, .025, .025, car.wheel);
    c.restore();
    c.textAlign = 'left'; c.font = '600 .018px sans-serif'; c.fillStyle = '#f9e8c8cc'; c.fillText(car.name.toUpperCase(), .025, .05);
    c.restore();
    return { time, car: car.id, wheelSide: car.id === 'miura' ? 'left' : 'right', bass, treble, shower };
  }
  return { cars, recipes, draw, reset };
})();
