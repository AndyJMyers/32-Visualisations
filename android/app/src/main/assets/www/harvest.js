/* Autumn 07: a small harvest story, from the first climb to the last load. */
window.HarvestTime = (() => {
  const recipes = [
    { name: 'Amber Acre', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Blue Hour', form: 1, theme: 0, speed: .85, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Storm Gold', form: 2, theme: 0, speed: 1.1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const smooth = n => { const p = clamp(n, 0, 1); return p * p * (3 - 2 * p); };
  const cubic = (a, b, c, d, t) => a * (1 - t) ** 3 + 3 * b * t * (1 - t) ** 2 + 3 * c * t * t * (1 - t) + d * t ** 3;
  const noise = n => { const v = Math.sin(n * 127.1 + 93.7) * 43758.5453; return v - Math.floor(v); };
  let time = 0, last = null, bass = 0, treble = 0;
  function reset() { time = 0; last = null; bass = 0; treble = 0; }
  function shape(c, colour, points) {
    c.fillStyle = colour; c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.closePath(); c.fill();
  }
  function path(c, colour, width, points) {
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.stroke();
  }
  function oval(c, x, y, rx, ry, colour) {
    c.fillStyle = colour; c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, Math.PI * 2); c.fill();
  }
  function birdsAt(t) {
    const orbit = t * .075;
    const kiteX = 450 + Math.cos(orbit) * 310;
    const kiteY = 91 + Math.sin(orbit) * 27 + Math.sin(t * .4) * 5;
    const kiteBank = Math.sin(orbit) * .32;
    const kiteFlap = Math.max(0, 1 - Math.abs(t % 9 - 3) / 1.5) * Math.sin(t * 12);
    const hover = t % 27;
    const diveIndex = Math.floor(t / 27);
    const combineXAtDive = storyAt(diveIndex * 27 + 17.5).combineX;
    const mouseX = clamp(combineXAtDive + (combineXAtDive < 450 ? 210 : -210), 250, 720);
    const catchDive = diveIndex % 10 === 0;
    const dive = hover > 15 && hover < 20 ? Math.sin((hover - 15) * Math.PI / 5) : 0;
    const orbitX = 530 + Math.cos(t * .25) * 85 + Math.sin(t * 1.1) * 8;
    const kestrelX = orbitX + (mouseX - orbitX) * dive;
    const kestrelY = 153 + Math.sin(t * 1.3) * 4 + dive * 128;
    const kestrelBank = Math.sin(t * .25) * .28;
    const robinStage = t < 12 ? 'perched' : t < 18 ? 'departing' : 'gone';
    const caught = catchDive && hover >= 17.5 && hover < 20;
    const mouseVisible = hover >= 12 && hover < 22 && (!catchDive || hover < 20);
    const escape = !catchDive ? smooth((hover - 17.5) / 1.4) * 85 : 0;
    return { kiteX, kiteY, kiteBank, kiteFlap, kestrelX, kestrelY, kestrelBank, robinStage,
      diveIndex, catchDive, caught, mouseVisible,
      mouseX: caught ? kestrelX : mouseX + escape,
      mouseY: caught ? kestrelY + 17 : 298 };
  }
  function kite(c, x, y, bank, flap) {
    c.save(); c.translate(x, y); c.rotate(bank);
    const tip = 5 + flap * 10;
    shape(c, '#443d35', [-3,0,-20,-8,-34,-4+flap*4,-51,tip,-29,2,-11,6,0,4,11,6,29,2,51,tip,34,-4+flap*4,20,-8,3,0]);
    shape(c, '#56483a', [-4,3,-3,12,0,17,3,12,4,3]);
    shape(c, '#443d35', [-3,12,-9,21,0,17,9,21,3,12]);
    c.restore();
  }
  function kestrel(c, x, y, flap, bank) {
    c.save(); c.translate(x, y); c.rotate(bank);
    const tip = 5 + flap * 7;
    shape(c, '#624b3b', [-2,0,-12,-tip,-24,-tip-4,-14,2,-4,5,0,3,4,5,14,2,24,-tip-4,12,-tip,2,0]);
    shape(c, '#765945', [-3,4,-5,16,0,12,5,16,3,4]);
    oval(c, 0, 1, 3, 5, '#d7b881');
    path(c, '#b49a6d', 1.5, [-3,8,-5,17]);
    path(c, '#b49a6d', 1.5, [3,8,5,17]);
    c.restore();
  }
  function mouse(c, x, y, running, carried = false) {
    c.save(); c.translate(x, y);
    if (carried) c.rotate(.22);
    const step = running ? Math.sin(time * 18) * 2 : 0;
    path(c, '#8f7962', 1.5, [-5,2,-13,1 + step,-17,-3]);
    oval(c, 0, 0, 7, 4, '#8e7863');
    oval(c, 6, -2, 3.5, 3, '#a18a70');
    oval(c, 4, -5, 1.8, 2, '#bd9d80');
    oval(c, 8, -2, .8, .8, '#1c1a18');
    path(c, '#675844', 1, [-2,3,-4,5 + step]);
    path(c, '#675844', 1, [3,3,5,5 - step]);
    c.restore();
  }
  function robin(c, t) {
    if (t >= 18) return;
    const departing = t >= 12, flight = departing ? smooth((t - 12) / 6) : 0;
    const x = 610 + flight * 105, y = 245 - flight * 84;
    if (!departing) path(c, '#594e3b', 2, [610,263,610,246]);
    c.save(); c.translate(x, y); c.rotate(-flight * .32);
    shape(c, '#655141', [-3,0,-13,-5,-10,2,-4,5]);
    oval(c, 0, 0, 8, 5, '#684f3e');
    oval(c, 5, -3, 4, 4, '#684f3e');
    oval(c, 5, 1, 3.4, 3, '#cf653d');
    shape(c, '#c7a96d', [9,-3,14,-2,9,-1]);
    oval(c, 6, -4, .8, .8, '#201e1a');
    if (departing) {
      const wing = Math.sin(t * 16) * 5;
      shape(c, '#5a4537', [-2,-2,-8,-13-wing,3,-6]);
    }
    c.restore();
  }
  const dogRoutes = [
      [[0,145,462,'sniff'],[3,250,475,'run'],[5,355,455,'run'],[7,355,455,'look'],
        [9,280,476,'play'],[11,340,461,'play'],[14,470,477,'run'],[16,470,477,'look'],
        [19,585,456,'run'],[21,585,456,'sniff'],[24,475,478,'retreat'],
        [27,320,458,'run'],[29,220,477,'play'],[32,145,462,'sniff']],
      [[0,610,478,'sniff'],[3,535,455,'run'],[6,440,476,'run'],[8,375,460,'play'],
        [10,325,476,'play'],[12,305,460,'retreat'],[14,415,477,'run'],
        [16,415,477,'look'],[19,505,458,'run'],[22,655,476,'run'],
        [24,655,476,'look'],[27,510,455,'retreat'],[30,590,477,'sniff'],
        [32,610,478,'sniff']]
  ];
  function dogsAt(t) {
    const phase = t % 32;
    return dogRoutes.map((route, i) => {
      const index = route.findIndex((point, n) => n < route.length - 1 && phase < route[n + 1][0]);
      const from = route[index], to = route[index + 1];
      const progress = smooth((phase - from[0]) / (to[0] - from[0]));
      const dx = to[1] - from[1], dy = to[2] - from[2];
      const moving = Math.abs(dx) + Math.abs(dy) > 1;
      const action = to[3];
      return { x: from[1] + dx * progress, y: from[2] + dy * progress,
        facing: dx ? Math.sign(dx) : (i ? -1 : 1), gait: t * (i ? 12 : 10),
        moving, action, turn: clamp(dy / 35, -.35, .35) * Math.sin(progress * Math.PI) };
    });
  }
  function dog(c, state, colour) {
    c.save(); c.translate(state.x, state.y);
    if (state.action === 'play') c.translate(0, -Math.max(0, Math.sin(state.gait * .7)) * 5);
    c.rotate(state.turn); c.scale(state.facing, 1);
    const stride = state.moving ? Math.sin(state.gait) * 5 : 0;
    const tailWag = Math.sin(state.gait * (state.action === 'play' ? 1.4 : .45)) * 5;
    oval(c, 0, 3, 29, 4, '#47382355');
    path(c, colour, 5, [-12,-12,-17 + stride,0]);
    path(c, colour, 5, [10,-12,15 - stride,0]);
    path(c, colour, 4, [-20,-19,-31,-30 + tailWag]);
    oval(c, 0, -19, 22, 11, colour);
    const headTilt = state.action === 'look' ? Math.sin(time * 2) * 3 :
      state.action === 'sniff' ? 4 : state.action === 'play' ? -2 : 0;
    oval(c, 20, -24 + headTilt, 9, 8, colour);
    shape(c, colour, [16,-29 + headTilt,15,-40 + headTilt,22,-33 + headTilt]);
    oval(c, 28, -21 + headTilt, 4, 3, '#2d2b2a');
    oval(c, 23, -26 + headTilt, 1.5, 1.5, '#f5e6c5');
    if (state.action === 'play') {
      path(c, '#3a2925', 1.5, [26,-17 + headTilt,31,-15 + headTilt]);
      oval(c, 29, -16 + headTilt, 1, 1, '#f5e6c5');
    }
    c.restore();
  }
  function wheat(c, x, y, scale, sway, colour) {
    path(c, colour, Math.max(.8, scale), [x, y, x + sway, y - 9 * scale]);
    oval(c, x + sway, y - 10 * scale, 1.7 * scale, 4 * scale, colour);
  }
  function farmer(c, x, y, scale, stride) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    path(c, '#463b31', 3, [-2, -12, -6 + stride, 1]);
    path(c, '#463b31', 3, [2, -12, 7 - stride, 1]);
    shape(c, '#39556a', [-7,-32,6,-32,10,-13,-8,-13]);
    path(c, '#d1a278', 3, [-5,-29,-12,-16]); path(c, '#d1a278', 3, [6,-29,12,-17]);
    oval(c, 0, -38, 6, 7, '#d1a278');
    shape(c, '#786947', [-10,-43,-5,-47,7,-47,12,-42]);
    c.restore();
  }
  function combine(c, x, y, size, facing, climbing, reelPhase, unloading) {
    c.save(); c.translate(x, y); c.scale(size * facing, size);
    oval(c, 0, 7, 120, 12, '#49371e55');
    // Header, reel and cutter stay ahead of the machine whichever way it travels.
    shape(c, '#5d6959', [55,-20,117,-18,129,-7,54,-7]);
    path(c, '#282d2c', 5, [59,-31,121,-31]);
    for (let i = 0; i < 7; i++) {
      const xx = 64 + i * 9;
      path(c, '#d4a347', 2, [xx,-31,xx + Math.sin(reelPhase + i * .3) * 3,-12]);
    }
    shape(c, '#3e4f3d', [-77,-53,42,-56,72,-31,55,-9,-80,-9]);
    shape(c, '#ddbb63', [-68,-51,34,-53,46,-39,-72,-36]);
    path(c, '#f6d887aa', 3, [-65,-47,29,-49]);
    shape(c, '#243c42', [-24,-89,16,-91,37,-57,-28,-55]);
    shape(c, '#8bb9ba99', [-17,-84,12,-85,27,-61,-24,-61]);
    path(c, '#d8c176', 4, [-24,-88,16,-90,37,-57]);
    for (const [wx, wy, r] of [[-43,-7,19],[37,-6,14]]) {
      oval(c, wx, wy, r, r, '#292c2b'); oval(c, wx, wy, r * .57, r * .57, '#a9a196');
      oval(c, wx, wy, r * .2, r * .2, '#4d5650');
    }
    for (let i = 0; i < 4; i++) path(c, '#b7b5a0', 2, [-29,-54 + i * 10,-42,-54 + i * 10]);
    path(c, '#777d70', 3, [-34,-55,-34,-8]);
    if (climbing < 1) {
      const step = smooth(climbing);
      farmer(c, -37, -8 - 49 * step, .7, Math.sin(step * Math.PI * 7) * 3);
    } else {
      oval(c, -1, -74, 4, 5, '#d1a278');
      shape(c, '#39556a', [-6,-69,4,-69,9,-59,-8,-59]);
    }
    if (unloading) {
      path(c, '#d6c37c', 7, [25,-76,106,-99,123,-91]);
      path(c, '#506655', 3, [25,-79,105,-102,124,-94]);
    }
    c.restore();
  }
  function lorrySide(c, load) {
    oval(c, 0, 5, 117, 11, '#40362455');
    shape(c, '#5c7165', [-91,-41,34,-41,43,-12,-92,-12]);
    shape(c, '#c5a355', [-86,-39,30,-39,37,-24,-86,-24]);
    if (load > 0) {
      shape(c, '#e1bc69', [-82,-39,-73,-39 - load * 13,24,-39 - load * 13,33,-39]);
    }
    shape(c, '#395c62', [43,-55,91,-55,105,-35,105,-11,43,-11]);
    shape(c, '#91afb0', [53,-50,85,-50,96,-35,53,-35]);
    path(c, '#e8c47c', 3, [43,-13,106,-13]);
    for (const wx of [-58, 69]) {
      oval(c, wx, -6, 15, 15, '#272e2d'); oval(c, wx, -6, 7, 7, '#b4b1a0');
    }
  }
  function lorryRear(c, load) {
    oval(c, 0, 5, 68, 9, '#40362455');
    shape(c, '#344e54', [-32,-67,32,-67,39,-45,-39,-45]);
    shape(c, '#9ab0aa', [-24,-62,24,-62,29,-49,-29,-49]);
    shape(c, '#5c7165', [-57,-54,57,-54,53,-13,-53,-13]);
    shape(c, '#d5ad5c', [-50,-50,50,-50,46,-19,-46,-19]);
    if (load > 0) shape(c, '#e1bc69', [-45,-48,-38,-48 - load * 12,38,-48 - load * 12,45,-48]);
    shape(c, '#53695c', [-55,-26,55,-26,52,-13,-52,-13]);
    path(c, '#e3c67d', 2, [-49,-25,49,-25]);
    oval(c, -43, -13, 6, 4, '#c85b3b'); oval(c, 43, -13, 6, 4, '#c85b3b');
    for (const wx of [-37, 37]) {
      oval(c, wx, -5, 12, 11, '#272e2d'); oval(c, wx, -5, 5, 5, '#b4b1a0');
    }
  }
  function lorry(c, x, y, size, load, turn = 0) {
    c.save(); c.translate(x, y); c.scale(size, size);
    if (turn < 1) {
      c.save(); c.globalAlpha *= 1 - turn; c.scale(1 - turn * .45, 1);
      lorrySide(c, load); c.restore();
    }
    if (turn > 0) {
      c.save(); c.globalAlpha *= turn; lorryRear(c, load); c.restore();
    }
    c.restore();
  }
  function workAt(phase, fieldIndex) {
    if (phase < 32) {
      const pass = Math.floor(phase / 16), progress = smooth((phase % 16) / 16);
      const start = pass === 1 ? 735 : 135, end = pass === 1 ? 135 : 735;
      return { stage: 'cutting', fieldIndex, pass, progress, cut: [0,1,2].map(i => i < pass ? 1 : i === pass ? progress : 0),
        combineX: start + (end - start) * progress, combineY: 300 + pass * 42,
        facing: pass === 1 ? -1 : 1, lorryX: 1040, lorryY: 342, lorrySize: 1, load: 0 };
    }
    if (phase < 49) {
      const progress = smooth((phase - 32) / 17), combineX = 135 + 580 * progress;
      return { stage: 'unloading', fieldIndex, pass: 2, progress, cut: [1,1,progress], combineX, combineY: 384,
        facing: 1, lorryX: combineX + 150 + 200 * (1 - smooth((phase - 32) / 4)),
        lorryY: 342, lorrySize: 1, load: smooth((phase - 36) / 12) };
    }
    const progress = (phase - 49) / 14;
    return { stage: 'delivery', fieldIndex, pass: 2, progress, cut: [1,1,1], combineX: 715, combineY: 384,
      facing: 1, lorryX: cubic(865,885,820,808,progress), lorryY: cubic(342,342,278,268,progress),
      lorrySize: 1 - .7 * smooth(progress), lorryTurn: smooth(progress / .48),
      barnEntry: smooth((progress - .78) / .22), load: 1 };
  }
  function storyAt(t) {
    if (t < 7) return { stage: 'boarding', fieldIndex: 0, pass: -1, progress: smooth(t / 7), cut: [0,0,0], combineX: 135, combineY: 300, facing: 1, lorryX: 1040, lorryY: 342, lorrySize: 1, load: 0 };
    if (t < 70) return workAt(t - 7, 0);
    const elapsed = t - 70, fieldIndex = 1 + Math.floor(elapsed / 69), phase = elapsed % 69;
    if (phase >= 6) return workAt(phase - 6, fieldIndex);
    const travel = smooth((phase - 1) / 4);
    const facing = phase < 1 ? Math.cos(Math.PI * smooth(phase))
      : phase < 5 ? -1 : -Math.cos(Math.PI * smooth(phase - 5));
    return { stage: 'reposition', fieldIndex, previousFieldIndex: fieldIndex - 1,
      scroll: smooth(phase / 6), pass: -1, progress: travel, cut: [1,1,1], combineX: 715 - 580 * travel,
      combineY: 384 - 84 * travel, facing, lorryX: 1040, lorryY: 342, lorrySize: 1, load: 0 };
  }
  function field(c, cut, fieldIndex) {
    const gold = fieldIndex % 2 ? '#cfa258' : '#c79c52';
    shape(c, gold, [0,265,900,265,900,500,0,500]);
    for (let i = 0; i < 5; i++) {
      const near = 265 + i * 61;
      shape(c, i % 2 ? '#d4aa5b' : '#bc924c', [0,near,900,near + 8,900,near + 41,0,near + 31]);
    }
    // Tramlines converge towards the far side of the field.
    for (const offset of [-160,-126,64,99,230,265]) path(c, '#7d704477', 3, [450 + offset * .43,263,450 + offset,500]);
    for (let row = 0; row < 10; row++) for (let i = 0; i < 56; i++) {
      const x = i * 17 + noise(row * 100 + i + fieldIndex * 31) * 13;
      const y = 280 + row * 24 + noise(row * 63 + i + fieldIndex * 17) * 9;
      wheat(c, x, y, .65 + row * .07, Math.sin(time * .7 + i * .3) * (1 + bass), row % 2 ? '#e8c57888' : '#f6d18188');
    }
    for (const offset of [-16, 16]) {
      c.strokeStyle = '#716644aa'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath();
      c.moveTo(865 + offset, 350);
      c.bezierCurveTo(885 + offset, 350, 820 + offset * .7, 278, 808 + offset * .45, 268);
      c.stroke();
    }
    for (let pass = 0; pass < 3; pass++) {
      const amount = cut[pass];
      if (!amount) continue;
      const left = pass === 1 ? 735 - 600 * amount : 135;
      const right = pass === 1 ? 735 : 135 + (pass === 2 ? 580 : 600) * amount;
      const y = 286 + pass * 42;
      shape(c, '#796e46', [left,y,right,y + 4,right,y + 43,left,y + 39]);
      for (let i = 0; i < 30; i++) {
        const x = left + (i + .5) / 30 * (right - left);
        path(c, '#dbc17b77', 1.3, [x,y + 12,x + 2,y + 18]);
      }
    }
  }
  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .1);
    last = animate ? now : null;
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * (1 - Math.exp(-dt * 4));
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * (1 - Math.exp(-dt * 4));
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const mood = ['amber', 'blue', 'storm'].includes(opts.form) ? opts.form : 'amber';
    const story = storyAt(time);
    const birds = birdsAt(time);
    const dogs = dogsAt(time);
    c.save(); c.scale(w / 900, h / 500);
    const sky = c.createLinearGradient(0, 0, 0, 300);
    const colours = mood === 'blue' ? ['#41576d','#b29f86','#c7a661'] : mood === 'storm' ? ['#495557','#ac9872','#d4ad58'] : ['#71878a','#eac189','#e9b963'];
    sky.addColorStop(0, colours[0]); sky.addColorStop(.68, colours[1]); sky.addColorStop(1, colours[2]);
    c.fillStyle = sky; c.fillRect(0, 0, 900, 500);
    if (mood === 'blue') {
      for (let i = 0; i < 32; i++) {
        const x = 20 + noise(i * 37) * 850, y = 12 + noise(i * 71) * 155;
        oval(c, x, y, 1 + noise(i * 13), 1 + noise(i * 13), '#fff4d4aa');
      }
    }
    oval(c, 640, 98, mood === 'blue' ? 32 : 72, mood === 'blue' ? 32 : 69,
      mood === 'storm' ? '#d0bd8b55' : mood === 'blue' ? '#f3ebca' : '#ffe5a6aa');
    for (let i = 0; i < 4; i++) {
      const x = (i * 265 + time * (2 + i * .4)) % 1200 - 120;
      const cloud = mood === 'storm' ? '#364447cc' : mood === 'blue' ? '#8996a199' : '#ddd0b890';
      oval(c, x, 70 + i * 22, mood === 'storm' ? 135 : 91, mood === 'storm' ? 27 : 15, cloud);
      oval(c, x + 39, 66 + i * 22, 58, mood === 'storm' ? 29 : 19, cloud);
    }
    shape(c, '#76816b', [0,245,150,199,310,231,460,186,650,224,800,195,900,227,900,330,0,330]);
    shape(c, '#576d58', [0,255,220,224,455,246,677,217,900,240,900,330,0,330]);
    kite(c, birds.kiteX, birds.kiteY, birds.kiteBank, birds.kiteFlap);
    // The store and its lane stay in sight throughout the harvest.
    shape(c, '#ddd0a0', [748,214,818,193,869,213,869,268,748,268]);
    shape(c, '#6b5140', [736,214,819,177,880,212]);
    shape(c, '#374947', [789,230,827,230,827,268,789,268]);
    if (story.stage === 'reposition') {
      c.save(); c.beginPath(); c.rect(0, 265, 900, 235); c.clip();
      c.save(); c.translate(0, -235 * story.scroll);
      field(c, [1,1,1], story.previousFieldIndex); c.restore();
      c.save(); c.translate(0, 235 * (1 - story.scroll));
      field(c, [0,0,0], story.fieldIndex); c.restore();
      c.restore();
    } else {
      field(c, story.cut, story.fieldIndex);
    }
    const deliveredLoads = story.fieldIndex + (story.stage === 'delivery' && story.barnEntry > .9 ? 1 : 0);
    // Each completed trip leaves a visible stack beside the grain store.
    for (let i = 0; i < Math.min(deliveredLoads, 7); i++) {
      const x = 753 + i % 4 * 25, y = 286 + Math.floor(i / 4) * 15;
      shape(c, '#a98149', [x,y,x + 19,y,x + 22,y + 12,x - 2,y + 12]);
      path(c, '#e9c984', 2, [x + 1,y + 2,x + 17,y + 2]);
    }
    if (birds.mouseVisible) mouse(c, birds.mouseX, birds.mouseY,
      !birds.caught && time % 27 >= 17.5, birds.caught);
    kestrel(c, birds.kestrelX, birds.kestrelY, Math.sin(time * 12), birds.kestrelBank);
    robin(c, time);
    if (story.stage === 'unloading' || story.stage === 'delivery') lorry(c, story.lorryX, story.lorryY, story.lorrySize, story.load, story.lorryTurn || 0);
    combine(c, story.combineX, story.combineY, story.pass < 0 ? 1 : 1 + story.pass * .04,
      story.facing, story.stage === 'boarding' ? story.progress : 1,
      time * (3 + bass * 4), story.stage === 'unloading' && story.progress > .3);
    if (mood === 'blue') {
      const beam = c.createRadialGradient(story.combineX + story.facing * 85, story.combineY - 25, 2,
        story.combineX + story.facing * 85, story.combineY - 25, 115);
      beam.addColorStop(0, '#fff3c899'); beam.addColorStop(1, '#fff3c800');
      c.fillStyle = beam; c.fillRect(story.combineX - 130, story.combineY - 140, 320, 230);
      oval(c, story.combineX + story.facing * 85, story.combineY - 25, 6, 5, '#fff4d5');
      for (let i = 0; i < 12; i++) {
        const x = noise(i * 41) * 900, y = 265 + noise(i * 17) * 210;
        oval(c, x, y + Math.sin(time * 2 + i) * 4, 1.5, 1.5, '#efdc9aaa');
      }
    }
    if (story.stage === 'cutting' || story.stage === 'unloading') for (let i = 0; i < 65; i++) {
      const age = (time * (.42 + bass * .24 + noise(i + 17) * .12) + noise(i * 11)) % 1;
      const spread = 35 + age * (85 + noise(i + 29) * 45);
      const x = story.combineX - story.facing * (75 + spread);
      const y = story.combineY - 26 - age * (22 + treble * 17) + Math.sin(time * 4 + i * 1.7) * age * 10;
      const alpha = (.12 + bass * .27) * (1 - age);
      oval(c, x, y, 1.2 + noise(i * 3) * 2.3, 1 + noise(i + 9) * 2,
        `rgba(245, 214, 143, ${alpha})`);
      if (i % 3 === 0) path(c, `rgba(246, 221, 156, ${alpha})`, 1,
        [x, y, x - story.facing * (3 + age * 7), y - age * 3]);
    }
    if (story.stage === 'unloading' && story.load > 0 && story.lorryX - story.combineX < 170) {
      const flow = story.load < 1 ? story.load : 1;
      for (let i = 0; i < 15; i++) {
        const falling = (time * (1.5 + bass) + noise(i)) % 1;
        oval(c, story.combineX + 126 + noise(i * 7) * 9, story.combineY - 94 + falling * 47,
          2, 3, `rgba(246, 209, 119, ${flow * .8})`);
      }
    }
    if (story.stage === 'delivery') {
      // The front wall masks the truck outside the opening as it enters the store.
      shape(c, '#ddd0a0', [748,214,789,214,789,268,748,268]);
      shape(c, '#ddd0a0', [827,214,869,214,869,268,827,268]);
      shape(c, '#ddd0a0', [789,214,827,214,827,230,789,230]);
      shape(c, '#6b5140', [736,214,819,177,880,212]);
      c.fillStyle = `rgba(26, 42, 41, ${story.barnEntry * .9})`;
      c.fillRect(789, 230, 38, 38);
    }
    dog(c, dogs[0], '#5b4533');
    dog(c, dogs[1], '#dbbb82');
    if (mood === 'storm') {
      c.save(); c.strokeStyle = '#dce5e888'; c.lineWidth = 1.5;
      for (let i = 0; i < 95; i++) {
        const x = (noise(i * 23) * 1000 + time * (95 + bass * 80)) % 1000 - 50;
        const y = (noise(i * 47) * 570 + time * (220 + treble * 90)) % 570 - 35;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x - 10, y + 24); c.stroke();
      }
      const flash = Math.max(0, 1 - Math.abs(time % 17 - 11) * 7) * (.3 + bass * .4);
      if (flash > 0) {
        path(c, `rgba(242, 245, 222, ${flash})`, 3, [427,0,449,43,432,68,467,106,451,144]);
        c.fillStyle = `rgba(238, 234, 192, ${flash * .2})`; c.fillRect(0, 0, 900, 500);
      }
      c.restore();
    }
    c.restore();
    return { time, mood, bass, treble, ...story, deliveredLoads, birds, dogs };
  }
  return { recipes, draw, reset };
})();
