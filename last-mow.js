/* Autumn 04: a small garden story, with bounded, music-responsive weather. */
window.LastMow = (() => {
  const recipes = [
    { name: 'The Last Cut', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'A Little Late Sunshine', form: 1, theme: 0, speed: .85, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Tea Before the Rain', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Leaves on the Wind', form: 3, theme: 0, speed: 1.15, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const tau = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = v => { const x = clamp(v, 0, 1); return x * x * (3 - 2 * x); };
  const noise = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  let time = 0, last = null, bass = 0, treble = 0;
  function reset() { time = 0; last = null; bass = 0; treble = 0; }
  function oval(c, x, y, rx, ry, colour) {
    c.fillStyle = colour; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, tau); c.fill();
  }
  function line(c, x1, y1, x2, y2, colour, width) {
    c.strokeStyle = colour; c.lineWidth = width; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function robin(c, x, y, t) {
    const hop = Math.pow(Math.max(0, Math.sin(t * 2.1)), 8) * 9;
    c.save(); c.translate(x, y - hop);
    line(c, -5, 10, -7, 19, '#51422f', 2); line(c, 5, 10, 6, 19, '#51422f', 2);
    c.fillStyle = '#554b3b'; c.beginPath(); c.moveTo(-13, 0); c.lineTo(-30, -8); c.lineTo(-23, 5); c.fill();
    oval(c, 0, 0, 16, 13, '#625746'); oval(c, 8, 3, 10, 9, '#c54b2d'); oval(c, 5, -10, 9, 8, '#655747');
    c.fillStyle = '#d2ae69'; c.beginPath(); c.moveTo(12, -11); c.lineTo(21, -8); c.lineTo(12, -6); c.fill();
    oval(c, 8, -12, 1.7, 1.7, '#101a17'); c.restore();
  }
  function mower(c, x, y, t, running) {
    c.save(); c.translate(x, y);
    c.strokeStyle = '#485049'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(2, -18); c.lineTo(39, -73); c.lineTo(51, -73); c.stroke();
    c.fillStyle = '#b15435'; c.beginPath(); c.moveTo(-25, -14); c.quadraticCurveTo(0, -30, 27, -14); c.lineTo(31, 0); c.lineTo(-30, 0); c.closePath(); c.fill();
    c.fillStyle = '#3c4540'; c.fillRect(-8, -31, 20, 13); c.fillStyle = '#c7b695'; c.fillRect(-3, -35, 11, 4);
    for (const wheel of [-22, 22]) { oval(c, wheel, 0, 9, 9, '#252c2a'); oval(c, wheel, 0, 3, 3, '#a8a49a'); }
    if (running) { c.fillStyle = '#c6cbb180'; for (let i = 0; i < 3; i++) oval(c, 35 + i * 9, -3 - (t * 15 + i * 9) % 25, 2, 2, '#d5d6c080'); }
    c.restore();
  }
  function gardener(c, x, y, t, tea, leaving, drinking, walking, expression) {
    const stride = walking || leaving ? Math.sin(t * 6) * 12 : 0;
    c.save(); c.translate(x, y); c.lineCap = 'round';
    // Boots, trousers and an autumn jacket, rendered as a simple moving figure.
    line(c, -8, -48, -12 - stride, -8, '#3a433c', 13); line(c, 8, -48, 11 + stride, -8, '#39433c', 13);
    line(c, -15 - stride, -5, -3 - stride, -5, '#292d29', 9); line(c, 8 + stride, -5, 21 + stride, -5, '#292d29', 9);
    c.fillStyle = '#68765d'; c.beginPath(); c.moveTo(-18, -98); c.quadraticCurveTo(-24, -75, -18, -47); c.lineTo(20, -47); c.quadraticCurveTo(22, -76, 16, -98); c.closePath(); c.fill();
    line(c, 0, -96, 0, -50, '#3f5140', 2); oval(c, 0, -112, 15, 17, '#d1a47d');
    c.fillStyle = '#4d5b47'; c.beginPath(); c.arc(0, -119, 15, Math.PI, 0); c.lineTo(22, -116); c.lineTo(-15, -115); c.fill();
    if (expression === 'snake') {
      oval(c, -7, -113, 3, 2.4, '#c9c99a'); oval(c, 3, -113, 3, 2.4, '#c9c99a');
      line(c, -7, -115, -7, -111, '#293321', 1); line(c, 3, -115, 3, -111, '#293321', 1);
    } else {
      line(c, -10, -113, -4, -113, '#252923', expression === 'mellow' ? 2 : 3);
      line(c, 0, -113, 6, -113, '#252923', expression === 'mellow' ? 2 : 3);
    }
    if (expression === 'frown') {
      line(c, -11, -117, -4, -115, '#55473b', 2); line(c, 0, -115, 6, -117, '#55473b', 2);
    }
    c.strokeStyle = '#664b3d'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-10, -104); c.quadraticCurveTo(-4, expression === 'frown' ? -108 : -100, 2, -104); c.stroke();
    if (!tea && !leaving) {
      line(c, -9, -104, -21, -106, '#e2d2ae', 2.5); oval(c, -21, -106, 1.8, 1.8, '#e86d3b');
      for (let i = 0; i < 3; i++) {
        const rise = (t * 9 + i * 12) % 36;
        oval(c, -21 - rise * .22 + Math.sin(t * 2 + i) * 3, -109 - rise, 2 + rise * .06, 1.5 + rise * .04, '#dce2dc60');
      }
    }
    if (tea) {
      line(c, -15, -91, -25, -65, '#68765d', 11); oval(c, -25, -64, 5, 5, '#d1a47d');
      line(c, 15, -91, 24, -76, '#68765d', 11); line(c, 24, -76, 17, -98, '#68765d', 9);
      oval(c, 17, -98, 5, 5, '#d1a47d');
      c.fillStyle = '#ded4bd'; c.fillRect(13, -109, 14, 10); c.strokeStyle = '#ded4bd'; c.lineWidth = 2; c.beginPath(); c.arc(27, -104, 4, -Math.PI / 2, Math.PI / 2); c.stroke();
      c.strokeStyle = '#f5f4d880'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(20, -111); c.quadraticCurveTo(15, -120, 21, -127); c.stroke();
    } else {
      line(c, -15, -91, -27, -73, '#68765d', 11); line(c, -27, -73, -37, -70, '#68765d', 9);
      oval(c, -37, -70, 6, 5, leaving ? '#d1a47d' : '#bc9a62');
      if (drinking) {
        line(c, 15, -91, 23, -78, '#68765d', 11); line(c, 23, -78, 7, -103, '#68765d', 9);
        oval(c, 7, -103, 5, 5, '#bc9a62');
        c.save(); c.translate(3, -110); c.rotate(-.35); c.fillStyle = '#a6b1aa'; c.fillRect(-5, -8, 12, 15);
        c.fillStyle = '#d7d5b9'; c.fillRect(-2, -11, 6, 3); c.restore();
      } else {
        line(c, 15, -91, 22, -66, '#68765d', 11); oval(c, 22, -65, 5, 5, '#bc9a62');
      }
    }
    c.restore();
  }
  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .1);
    last = animate ? now : null;
    const smoothing = 1 - Math.exp(-dt * 4);
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * smoothing;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * smoothing;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const t = time % 76, form = opts.form || 'overcast';
    const stage = t < 20 ? 'mowing' : t < 39 ? 'tea' : t < 62 ? 'finishing' : 'home';
    const mowing = stage === 'mowing' || stage === 'finishing';
    const pass = stage === 'mowing' ? (t / 20) * 2 : stage === 'tea' ? 2 :
      stage === 'finishing' ? 2 + ((t - 39) / 23) * 2 : 4;
    const row = Math.min(3, Math.floor(pass)), progress = Math.min(1, pass - row);
    const mowed = .5 + pass * .125;
    const tea = stage === 'tea', removingGloves = tea && t < 22.5, leaving = stage === 'home';
    const direction = row % 2 === 0 ? 1 : -1;
    const mx = 530 + 410 * (direction === 1 ? progress : 1 - progress);
    const mowerY = 420 + 68 * (row - (row > 0 ? 1 - smooth(progress / .12) : 0));
    const teaWalkIn = smooth((t - 20) / 3), teaWalkOut = smooth((t - 36) / 3);
    const gardenerX = leaving ? 618 + smooth((t - 62) / 10) * 430 : tea ?
      (618 + 42 * teaWalkIn) * (1 - teaWalkOut) + 442 * teaWalkOut : mx - direction * 88;
    const gardenerY = tea ? (488 + 38 * teaWalkIn) * (1 - teaWalkOut) + 488 * teaWalkOut : mowerY;
    const drinking = mowing && Math.sin(time * .58) > .85;
    const expression = ['mellow', 'frown', 'snake'][Math.floor(t / 4) % 3];
    const gust = .25 + (form === 'wind' ? .4 : 0) + .24 * Math.pow(Math.max(0, Math.sin(t * .22)), 3) + bass * .15;
    const rain = form === 'rain' ? .72 : form === 'golden' ? .08 : .26;
    c.save(); c.scale(w / 1000, h / 650);
    const sky = c.createLinearGradient(0, 0, 0, 430);
    sky.addColorStop(0, form === 'golden' ? '#797e7b' : '#606e78');
    sky.addColorStop(1, form === 'golden' ? '#d3b998' : '#b5b9aa'); c.fillStyle = sky; c.fillRect(0, 0, 1000, 650);
    for (let i = 0; i < 10; i++) {
      const x = ((noise(i + 2) * 1200 + time * (3 + i % 3) * gust) % 1400) - 200;
      const y = 45 + noise(i + 10) * 150;
      oval(c, x, y, 110 + noise(i + 20) * 80, 25 + noise(i + 30) * 18, '#48576138');
    }
    // Distant rooftops, garden fence and a low, tangled hedge.
    c.fillStyle = '#6e6a60'; c.fillRect(610, 185, 205, 116); c.fillStyle = '#525957'; c.beginPath(); c.moveTo(590, 185); c.lineTo(711, 115); c.lineTo(838, 185); c.closePath(); c.fill();
    c.fillStyle = '#c3bba7'; c.fillRect(657, 217, 38, 48); c.fillRect(741, 217, 38, 48); line(c, 676, 217, 676, 265, '#777b72', 2); line(c, 760, 217, 760, 265, '#777b72', 2);
    c.fillStyle = '#596044'; c.fillRect(0, 285, 1000, 115);
    for (let i = 0; i < 40; i++) oval(c, i * 28, 290 + noise(i + 60) * 24, 28, 26, i % 3 ? '#58634a' : '#67704b');
    c.fillStyle = '#796e58'; c.fillRect(0, 350, 1000, 8);
    for (let x = 0; x < 1000; x += 65) { c.fillStyle = '#857963'; c.fillRect(x, 328, 8, 65); }
    // A tree frames the garden, with a loose canopy rather than a solid wall.
    c.strokeStyle = '#574c3e'; c.lineCap = 'round'; c.lineWidth = 25; c.beginPath(); c.moveTo(105, 360); c.quadraticCurveTo(112, 180, 80, 65); c.stroke();
    c.lineWidth = 9; c.beginPath(); c.moveTo(99, 205); c.lineTo(175, 100); c.moveTo(98, 160); c.lineTo(37, 80); c.stroke();
    for (let i = 0; i < 34; i++) oval(c, 35 + noise(i + 90) * 205, 36 + noise(i + 130) * 110, 21 + noise(i + 20) * 24, 13 + noise(i + 50) * 14, ['#9a703d', '#82663d', '#b98548', '#687248'][i % 4]);
    const lawn = c.createLinearGradient(0, 350, 0, 650); lawn.addColorStop(0, '#647952'); lawn.addColorStop(1, '#364f37'); c.fillStyle = lawn; c.fillRect(0, 378, 1000, 272);
    // Each returning pass leaves its own strip, rather than changing the whole lawn at once.
    c.fillStyle = '#789060'; c.fillRect(0, 378, 500, 272);
    for (let i = 0; i < 4; i++) {
      const fraction = clamp(pass - i, 0, 1);
      c.fillStyle = i % 2 ? '#617f55' : '#829a69';
      c.fillRect(i % 2 ? 1000 - 500 * fraction : 500, 378 + i * 68, 500 * fraction, 68);
      if (fraction > 0) {
        const left = i % 2 ? 1000 - 500 * fraction : 500;
        const right = left + 500 * fraction;
        for (const trackY of [397 + i * 68, 429 + i * 68]) {
          line(c, left, trackY, right, trackY, '#405a3e44', 4);
        }
        for (let j = 0; j < 28; j++) {
          const x = 504 + noise(i * 47 + j) * 488;
          if (x < left || x > right) continue;
          const y = 386 + i * 68 + noise(i * 91 + j) * 52;
          oval(c, x, y, 3 + noise(j * 23) * 3, 1.3, '#a7ac7399');
        }
      }
    }
    for (let i = 0; i < 150; i++) {
      const x = noise(i + 450) * 1000, y = 391 + noise(i + 600) * 255;
      const lawnRow = Math.min(3, Math.floor((y - 378) / 68));
      const fraction = clamp(pass - lawnRow, 0, 1);
      if (x < 500 || (lawnRow % 2 ? x > 1000 - 500 * fraction : x < 500 + 500 * fraction)) continue;
      line(c, x, y, x + 2, y - 6 - noise(i) * 6, '#a0a47388', 1);
    }
    // A wooden bench holds the gloves during the gardener's pause.
    c.fillStyle = '#6f5139'; c.fillRect(650, 426, 116, 8); c.fillRect(655, 442, 106, 10);
    c.fillRect(662, 452, 7, 38); c.fillRect(747, 452, 7, 38);
    if (tea && !removingGloves) { c.save(); c.translate(710, 437); c.rotate(-.15); oval(c, 0, 0, 10, 5, '#bd9a61'); oval(c, 13, 1, 10, 5, '#a98854'); c.restore(); }
    c.save(); c.translate(mx, 0); c.scale(-direction, 1); mower(c, 0, mowerY, time, mowing); c.restore();
    if (mowing) {
      c.save(); c.translate(gardenerX, 0); c.scale(-direction, 1); gardener(c, 0, mowerY, time, false, false, drinking, true, expression); c.restore();
    } else {
      gardener(c, gardenerX, gardenerY, time, tea && t >= 23 && t < 36, leaving, false, tea && (t < 23 || t >= 36), expression);
    }
    if (removingGloves) {
      const progress = smooth((t - 20) / 2.5);
      c.save(); c.translate(gardenerX + 22 + (710 - gardenerX - 22) * progress, mowerY - 65 + (437 - mowerY + 65) * progress);
      c.rotate(-.15 * progress); oval(c, 0, 0, 10, 5, '#bd9a61'); oval(c, 13, 1, 10, 5, '#a98854'); c.restore();
    }
    robin(c, clamp(mx + 85 + Math.sin(time * .5) * 25, 80, 930), 555, time);
    const leafColours = ['#a85f32', '#c38c43', '#805b37', '#d1a45e', '#754e32'];
    for (let i = 0; i < 58; i++) {
      const y = ((noise(i + 200) + time * (.035 + noise(i + 300) * .045)) % 1) * 700 - 20;
      const x = ((noise(i + 100) * 1000 + time * (12 + noise(i + 500) * 25) * gust + Math.sin(time * .7 + i) * 35 * gust) % 1100) - 50;
      c.save(); c.translate(x, y); c.rotate(time * (1 + noise(i)) + i);
      oval(c, 0, 0, 3 + noise(i + 1) * 4, 2 + noise(i + 2) * 2, leafColours[i % leafColours.length]); c.restore();
    }
    c.strokeStyle = `rgba(220,233,232,${rain * (.2 + treble * .2)})`; c.lineWidth = 1;
    for (let i = 0; i < 38; i++) {
      const x = ((noise(i + 800) * 1100 + time * 35 * gust) % 1100) - 50;
      const y = ((noise(i + 900) + time * (.35 + noise(i + 3) * .25)) % 1) * 500;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x - 5 - gust * 8, y + 13); c.stroke();
    }
    const vignette = c.createRadialGradient(500, 300, 170, 500, 300, 720);
    vignette.addColorStop(0, '#00000000'); vignette.addColorStop(1, '#1a201a88'); c.fillStyle = vignette; c.fillRect(0, 0, 1000, 650);
    c.restore();
    return { time, stage, mowed, cutPasses: pass, mowerX: mx, mowerY, direction, expression, drinking, leaves: 58, rain: 38, robin: true, tea, leaving };
  }
  return { draw, reset, recipes };
})();
