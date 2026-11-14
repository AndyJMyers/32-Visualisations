window.TheFool = (() => {
  const forms = [['dawn', 'First Light'], ['moon', 'Moonlit Crossing'], ['gold', 'A Fool at the Fair']];
  const recipes = forms.map(([, name], form) => ({ name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6 }));
  const colors = [
    ['#192641', '#ec8d73', '#ffe4a0', '#2d3545', '#f25b55'],
    ['#090b30', '#52458b', '#baf8ec', '#171934', '#87a7ff'],
    ['#35122d', '#b44a4b', '#fff492', '#391e36', '#ff993f'],
  ];
  const clamp = x => Math.max(0, Math.min(1, x));
  function shape(c, color, points) {
    c.fillStyle = color;
    c.beginPath(); c.moveTo(...points[0]);
    points.slice(1).forEach(p => c.lineTo(...p));
    c.closePath(); c.fill();
  }
  function crossing(c, w, h, u, t, bass, mid, light, rock) {
    const water = h * .57;
    c.fillStyle = '#101b3e';
    c.fillRect(0, water, w, h - water);
    for (let i = 0; i < 32; i++) {
      const y = water + i * (h - water) / 32;
      const x = w * .76 + Math.sin(t * 2 + i * .61) * u * (.38 + mid * i * .075);
      const length = u * (.14 + i * .037) * (1 + bass);
      c.fillStyle = i % 3 ? light + '43' : light + '88';
      c.fillRect(x - length / 2, y, length, u * .026);
    }
    for (const side of [0, 1]) {
      const x = side ? w : 0;
      shape(c, rock, [[x, water - u * .35], [x + (side ? -1 : 1) * u * 1.25, water + u * .24], [x, water + u * .51]]);
    }
    const x = w * (.13 + t / 26 * .74), y = h * .73 + Math.sin(t * 3) * u * (.045 + bass * .10);
    c.save();
    c.translate(x, y); c.rotate(Math.sin(t * 2.7) * (.035 + bass * .08)); c.scale(u, u);
    c.strokeStyle = light; c.lineWidth = .045;
    const stroke = Math.sin(t * 4);
    c.beginPath(); c.moveTo(-.35 + stroke * .28, -.49); c.lineTo(.56 - stroke * .32, .53); c.stroke();
    shape(c, '#6594b8', [[.42 - stroke * .32, .44], [.62 - stroke * .32, .40], [.75 - stroke * .32, .62], [.57 - stroke * .32, .69]]);
    shape(c, '#38617f', [[-.89, .31], [.86, .26], [.5, .59], [-.62, .59]]);
    c.fillStyle = light; c.fillRect(-.7, .34, 1.38, .037);
    c.restore();
    return { x, y, stride: stroke * .075, phase: 'row' };
  }
  function fair(c, w, h, u, t, bass, mid, light) {
    const floor = h * .76;
    for (let i = 0; i < 5; i++) {
      const x = (i + .5) * w / 5, width = w / 5 * .45;
      const roof = floor - u * (1.25 + (i % 2) * .48);
      shape(c, i % 2 ? '#572f55' : '#7b3a42', [[x - width, roof], [x, roof - u * .73], [x + width, roof], [x + width, floor], [x - width, floor]]);
      shape(c, '#ffb96f', [[x, roof - u * .73], [x - width * .22, roof], [x + width * .25, roof]]);
      c.fillStyle = '#351c34'; c.fillRect(x - width * .25, roof + u * .12, width * .5, floor - roof - u * .12);
    }
    c.fillStyle = '#382033'; c.fillRect(0, floor, w, h - floor);
    const x = w * .5 + Math.sin(t * .66) * Math.min(w * .11, u * .84);
    const y = floor - u * .48 - Math.abs(Math.sin(t * 3.2)) * u * (.12 + bass * .24);
    c.fillStyle = '#8d4f55'; c.fillRect(w * .25, floor, w * .5, u * .22);
    for (let i = 0; i < 17; i++) {
      const xx = w * (.05 + i * .9 / 16);
      const yy = h * .29 + Math.sin(Math.PI * i / 16) * u * .55;
      c.fillStyle = i % 2 ? light : '#ff9c9c';
      c.fillRect(xx, yy, u * (.042 + mid * .054), u * .06);
    }
    for (let i = 0; i < 3; i++) {
      const p = (t * (.74 + i * .09) + i / 3) % 1;
      const xx = x + (p - .5) * u * 1.28 * (i % 2 ? -1 : 1);
      const yy = y - u * (.38 + 4 * p * (1 - p) * (1 + bass * .36));
      c.fillStyle = ['#fa7a72', light, '#a4f2c5'][i];
      c.beginPath(); c.arc(xx, yy, u * .083, 0, Math.PI * 2); c.fill();
    }
    return { x, y, stride: Math.sin(t * 6.4) * .18, phase: 'juggle' };
  }
  function draw(c, w, h, time, { form, bass = 0, mid = 0, treble = 0 } = {}) {
    const cast = Math.max(0, forms.findIndex(([id]) => id === form));
    const [sky, horizon, light, rock, cloth] = colors[cast];
    const t = (time / 1000) % 26;
    const u = Math.min(w / 11, h / 8);
    const edge = w * .55, ground = h * .68;
    const glow = c.createLinearGradient(0, 0, 0, h);
    glow.addColorStop(0, sky);
    glow.addColorStop(1, horizon);
    c.fillStyle = glow;
    c.fillRect(0, 0, w, h);
    const diskX = w * .76, diskY = h * .28;
    for (let i = 4; i >= 0; i--) {
      c.fillStyle = i ? light + '16' : light;
      c.beginPath();
      c.arc(diskX, diskY, u * (.63 + i * (.14 + bass * .045)), 0, Math.PI * 2);
      c.fill();
    }
    for (let i = 0; i < 64; i++) {
      const x = ((i * .618033 + t * .009) % 1) * w;
      const y = (i * .38197 % 1) * h * .76;
      const r = u * (.014 + .035 * treble) * (1 + Math.sin(t * 2 + i) * .5);
      c.fillStyle = light + 'ab';
      c.fillRect(x, y, r * 2, r);
    }
    for (let layer = 0; layer < 3; layer++) {
      c.beginPath();
      c.moveTo(0, h);
      for (let i = 0; i <= 36; i++) {
        const phase = i * .69 + layer * 2 + t * .23;
        c.lineTo(i * w / 36, h * (.5 + layer * .115) + Math.sin(phase) * u * (.38 + mid * .44));
      }
      c.lineTo(w, h); c.closePath();
      c.fillStyle = rock + ['69', 'a0', 'd5'][layer];
      c.fill();
    }
    let pose;
    if (cast === 1) pose = crossing(c, w, h, u, t, bass, mid, light, rock);
    else if (cast === 2) pose = fair(c, w, h, u, t, bass, mid, light);
    else {
      shape(c, rock, [[0, ground - u * .15], [edge - u * .48, ground],
        [edge, ground - u * .08], [edge - u * .28, h], [0, h]]);
      const walk = clamp(t / 13), leap = clamp((t - 15) / 8);
      pose = {
        x: edge - u * (2.5 - 2.13 * walk) + leap * (w - edge) * .77,
        y: ground - u * .63 - Math.sin(leap * Math.PI * .8) * u * 2.1,
        stride: Math.sin(t * 7) * (t < 13 ? .16 : .055),
        phase: t < 13 ? 'walk' : t < 15 ? 'pause' : t < 23 ? 'leap' : 'fade',
      };
    }
    const { x, y, stride, phase } = pose;
    c.save();
    c.globalAlpha = cast === 0 ? 1 - clamp((t - 23) / 3) : 1;
    c.translate(x, y); c.scale(u, u);
    function line(color, size, points) {
      c.strokeStyle = color; c.lineWidth = size; c.lineCap = 'round';
      c.beginPath(); c.moveTo(...points[0]);
      points.slice(1).forEach(p => c.lineTo(...p)); c.stroke();
    }
    if (cast !== 1) {
      line(rock, .075, [[-.06, .16], [-.13 + stride, .58]]);
      line(rock, .075, [[.06, .16], [.12 - stride, .57]]);
    }
    if (cast === 0) line(light, .036, [[-.24, -.31], [.36, -.04]]);
    if (cast === 1) line(light, .06, [[.09, -.18], [.32 + stride, .06]]);
    if (cast === 2) {
      line(light, .057, [[-.07, -.18], [-.3, .02], [-.46, -.18 + stride]]);
      line(light, .057, [[.07, -.18], [.32, .02], [.45, -.18 - stride]]);
    }
    c.fillStyle = cloth;
    c.beginPath(); c.moveTo(-.09, -.22); c.lineTo(-.49, -.11 + .15 * Math.sin(t * 5) - bass * .2);
    c.lineTo(-.14, .18); c.lineTo(.16, .21); c.lineTo(.1, -.23); c.closePath(); c.fill();
    c.fillStyle = light;
    c.beginPath(); c.arc(.06, -.33, .126, 0, Math.PI * 2); c.fill();
    c.fillStyle = cloth;
    c.fillRect(-.1, -.48, .26, .082);
    c.restore();
    c.save();
    c.fillStyle = light;
    c.textAlign = 'center';
    c.font = `bold ${u * .28}px Georgia`;
    c.fillText('0  /  THE FOOL', w / 2, h * .13);
    c.font = `${u * .19}px Georgia`;
    c.fillText(forms[cast][1], w / 2, h * .13 + u * .32);
    c.restore();
    return { cast, phase };
  }
  return { forms, recipes, draw };
})();
