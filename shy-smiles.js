/* Autumn 23: five fleeting smiles move from first light to slow fireworks. */
window.ShySmiles = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  const forms = ['firstlight', 'sorbet', 'amber', 'nocturne'];
  const recipes = [
    { name: 'First Light', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Summer Sorbet', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Amber Memory', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Firework Nocturne', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const moods = {
    firstlight: { skies: [['#162850', '#f9a990'], ['#426895', '#f8c98e'], ['#393862', '#f69b6f'], ['#312b61', '#da8caa'], ['#131e4e', '#b778aa']], land: '#333b67', gleam: '#ffe5b1', dresses: ['#b9a6d5', '#f6cf86', '#d99781', '#b49bc6', '#e4b89a'], ink: '#2a2241', sparkle: '#fff1c9' },
    sorbet: { skies: [['#6f72ba', '#ffc2aa'], ['#72c3d7', '#ffe29f'], ['#c887aa', '#ffbc82'], ['#a685c7', '#f8c4c2'], ['#4b5a9b', '#ed9fcb']], land: '#697c9f', gleam: '#fff4c6', dresses: ['#e3a7bc', '#f7d97a', '#e79799', '#a9bee0', '#f2b88e'], ink: '#422c63', sparkle: '#fff4db' },
    amber: { skies: [['#513a58', '#ffc382'], ['#a67a6c', '#f6cb87'], ['#76405e', '#ffac5d'], ['#6e4161', '#eea16c'], ['#2e3158', '#e39a70']], land: '#613f54', gleam: '#ffe19a', dresses: ['#c389ad', '#f0b96e', '#cb6f69', '#a86d99', '#e7a66a'], ink: '#321f3d', sparkle: '#fff0bf' },
    nocturne: { skies: [['#132253', '#ad78bb'], ['#213d74', '#e68bbb'], ['#22225b', '#dd739c'], ['#201f54', '#ab78c3'], ['#0b1b47', '#754ca1']], land: '#202a58', gleam: '#9ce9f0', dresses: ['#a69cdd', '#81c2d8', '#c07da3', '#a894dc', '#d6a5c6'], ink: '#171733', sparkle: '#f8dcff' },
  };
  const vignettes = [
    { title: 'BEHIND THE FAN', note: 'first light', x: 400, skin: '#d8a080', hair: '#211a35' },
    { title: 'AN ICE CREAM SUMMER', note: 'sun on bare shoulders', x: 405, skin: '#ae7459', hair: '#372037' },
    { title: 'LOOKING BACK', note: 'the last of the sun', x: 465, skin: '#e5b79c', hair: '#402632' },
    { title: 'HALF A SECRET', note: 'a hand, a veil, a smile', x: 420, skin: '#b37d69', hair: '#211930' },
    { title: 'SHOES OFF', note: 'the golden moments', x: 435, skin: '#dca38b', hair: '#30203d' },
  ];
  let time = 0, last = null, bass = 0, mid = 0, treble = 0, accent = 0, previousBass = 0, beats = 0, activeForm = null;
  function reset() { time = 0; last = null; bass = mid = treble = accent = previousBass = 0; beats = 0; activeForm = null; }
  function line(c, x1, y1, x2, y2, color, width = 1) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function dot(c, x, y, r, color) {
    c.fillStyle = color; c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, TAU); c.fill();
  }
  function glow(c, x, y, radius, color, strength = 1) {
    const g = c.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `${color}${Math.round(90 * strength).toString(16).padStart(2, '0')}`);
    g.addColorStop(1, `${color}00`);
    c.fillStyle = g; c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function landscape(c, scene, p, local) {
    const [top, bottom] = p.skies[scene];
    const sky = c.createLinearGradient(0, 0, 0, 500);
    sky.addColorStop(0, top); sky.addColorStop(.76, bottom); sky.addColorStop(1, p.land);
    c.fillStyle = sky; c.fillRect(0, 0, 900, 500);
    const sunX = [675, 705, 666, 745, 690][scene], sunY = [155, 118, 265, 195, 168][scene];
    glow(c, sunX, sunY, 240, p.gleam, .8 + bass * .4);
    c.save(); c.translate(sunX, sunY);
    for (let i = 0; i < 14; i++) {
      const angle = i * TAU / 14 + Math.sin(local * .16) * .08;
      c.save(); c.rotate(angle); c.globalAlpha = .06 + treble * .055;
      c.fillStyle = p.gleam; c.beginPath(); c.moveTo(42, -4);
      c.lineTo(810, -22); c.lineTo(810, 22); c.closePath(); c.fill(); c.restore();
    }
    dot(c, 0, 0, scene === 2 ? 36 : 29, `${p.gleam}d7`);
    c.restore();
    c.fillStyle = `${p.land}b0`;
    c.beginPath(); c.moveTo(0, 385);
    c.bezierCurveTo(170, 347, 290, 388, 470, 362);
    c.bezierCurveTo(665, 336, 735, 378, 900, 345);
    c.lineTo(900, 500); c.lineTo(0, 500); c.closePath(); c.fill();
    for (let i = 0; i < 8; i++) {
      const y = 387 + i * 14;
      line(c, 55 + i * 20, y, 855 - i * 15, y, `${p.gleam}${(35 + i * 5).toString(16)}`, 1);
    }
    for (let i = 0; i < 34; i++) {
      const x = (i * 173.7 + local * (5 + i % 4)) % 960 - 30;
      const y = (i * 97.4 + Math.sin(local * .6 + i) * 12) % 470;
      dot(c, x, y, 1 + (i % 4) * .45 + treble * 1.5, `${p.sparkle}92`);
    }
  }
  function fireworks(c, p, local, weight = 1) {
    for (let burst = 0; burst < 4; burst++) {
      const cycle = (local * .13 + burst * .29) % 1;
      const radius = 8 + cycle * 106, opacity = (1 - cycle) * weight;
      const x = [705, 235, 794, 570][burst], y = [125, 162, 215, 91][burst];
      c.save(); c.globalAlpha = opacity * (.35 + treble * .4 + accent * .2);
      for (let ray = 0; ray < 22; ray++) {
        const angle = ray * TAU / 22 + burst;
        const length = radius * (.78 + (ray % 4) * .07);
        line(c, x + Math.cos(angle) * length * .64, y + Math.sin(angle) * length * .64,
          x + Math.cos(angle) * length, y + Math.sin(angle) * length,
          ray % 3 ? p.sparkle : p.gleam, 1.5 + mid * 1.5);
        dot(c, x + Math.cos(angle) * length, y + Math.sin(angle) * length,
          1.6 + bass * 2, p.sparkle);
      }
      c.restore();
    }
  }
  function hair(c, variant, color, local) {
    const wave = Math.sin(local * 1.25) * 4;
    c.fillStyle = color;
    c.beginPath(); c.moveTo(-45, -26);
    c.bezierCurveTo(-54, -80, 42, -89, 47, -33);
    if (variant === 0) {
      c.bezierCurveTo(54, 3, 44, 76, 26, 92);
      c.quadraticCurveTo(10, 72, -2, 80);
      c.quadraticCurveTo(-39, 108, -51, 56);
    } else if (variant === 1 || variant === 4) {
      c.bezierCurveTo(50, 9, 34, 64, 10, 64);
      c.lineTo(-29, 54); c.quadraticCurveTo(-55, 24, -45, -26);
    } else if (variant === 2) {
      c.bezierCurveTo(74 + wave, 39, 45, 133, 77, 186);
      c.quadraticCurveTo(20, 176, 20, 92);
      c.quadraticCurveTo(-57, 107, -45, -26);
    } else {
      c.bezierCurveTo(58 + wave, 25, 69, 116, 39, 143);
      c.quadraticCurveTo(18, 118, 10, 72);
      c.quadraticCurveTo(-40, 122, -54, 33);
    }
    c.closePath(); c.fill();
    if (variant === 1 || variant === 4) {
      c.beginPath(); c.ellipse(44, -39, variant === 4 ? 30 : 25, 21, .35, 0, TAU); c.fill();
    }
  }
  function woman(c, scene, p, local) {
    const person = vignettes[scene], sway = Math.sin(local * .84 + scene) * (3 + mid * 5);
    const dress = p.dresses[scene], hem = scene === 4 ? 224 : 280;
    c.save(); c.translate(person.x + sway, 185 + Math.sin(local * 1.1) * (2 + bass * 3));
    c.scale(1.14, 1.14);
    if (scene === 2) c.rotate(-.12 + Math.sin(local * .7) * .025);
    if (scene === 4) {
      line(c, -28, 212, -41, 276, person.skin, 16);
      line(c, 24, 212, 41 + Math.sin(local * 1.5) * 8, 262, person.skin, 16);
      c.fillStyle = person.skin;
      c.beginPath(); c.ellipse(-43, 275, 17, 8, -.2, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(49, 263, 17, 8, .35, 0, TAU); c.fill();
    }
    c.fillStyle = person.skin;
    c.beginPath(); c.moveTo(-48, 78); c.quadraticCurveTo(-67, 89, -65, 109);
    c.lineTo(-52, 155); c.lineTo(-38, 151); c.lineTo(-45, 100);
    c.quadraticCurveTo(0, 119, 45, 100); c.lineTo(38, 151);
    c.lineTo(52, 155); c.lineTo(65, 109);
    c.quadraticCurveTo(67, 87, 48, 78); c.closePath(); c.fill();
    c.fillRect(-12, 46, 24, 40);
    c.fillStyle = dress; c.strokeStyle = `${p.sparkle}bd`; c.lineWidth = 1.8;
    c.beginPath(); c.moveTo(-39, 88);
    c.quadraticCurveTo(0, scene === 2 ? 122 : 103, 39, 88);
    c.bezierCurveTo(52, 116, 43, 141, 32, 164);
    c.bezierCurveTo(42, 191, 72, hem - 21, scene === 4 ? 64 : 91, hem);
    c.quadraticCurveTo(0, hem + 23, scene === 4 ? -72 : -93, hem);
    c.bezierCurveTo(-72, hem - 26, -42, 192, -32, 164);
    c.bezierCurveTo(-44, 137, -51, 112, -39, 88); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = `${p.sparkle}42`; c.beginPath(); c.moveTo(-33, 169);
    c.quadraticCurveTo(0, 180, 33, 167);
    c.lineTo(scene === 4 ? 60 : 85, hem - 5);
    c.quadraticCurveTo(7, hem + 7, -42, hem - 7); c.closePath(); c.fill();
    line(c, -32, 162, 32, 162, `${p.sparkle}b8`, 2);
    if (scene === 2) {
      c.fillStyle = p.ink; c.beginPath(); c.ellipse(0, 105, 20, 25, 0, 0, TAU); c.fill();
      line(c, -49, 78, -21, 89, p.sparkle, 2);
      line(c, 49, 78, 21, 89, p.sparkle, 2);
    } else {
      line(c, -39, 88, -17, 70, p.sparkle, 2);
      line(c, 39, 88, 17, 70, p.sparkle, 2);
    }
    hair(c, scene, person.hair, local);
    c.save(); if (scene === 2) { c.translate(-18, -7); c.rotate(.17); }
    c.fillStyle = person.skin; c.strokeStyle = `${p.ink}9a`; c.lineWidth = 1.4;
    c.beginPath(); c.ellipse(0, -7, 35, 53, .03, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = `${p.sparkle}17`; c.beginPath(); c.ellipse(-13, 4, 12, 31, -.3, 0, TAU); c.fill();
    c.fillStyle = person.hair; c.beginPath(); c.moveTo(-47, -32);
    c.bezierCurveTo(-43, -83, 20, -79, 43, -44);
    c.quadraticCurveTo(21, -49, 7, -61);
    c.quadraticCurveTo(-12, -32, -47, -32); c.fill();
    const blink = Math.sin(local * 1.7 + scene * 2) > .985, gaze = scene === 2 ? -2 : 1;
    for (const x of [-14, 15]) {
      c.beginPath(); c.moveTo(x - 8, -14);
      c.quadraticCurveTo(x, blink ? -14 : -19, x + 8, -14);
      c.strokeStyle = p.ink; c.lineWidth = 1.7; c.stroke();
      if (!blink) dot(c, x + gaze, -13, 1.7, p.ink);
      line(c, x - 8, -25, x + 6, -27, `${p.ink}bd`, 1.3);
    }
    c.beginPath(); c.moveTo(0, -7); c.quadraticCurveTo(4, 6, 0, 11);
    c.strokeStyle = `${p.ink}95`; c.stroke();
    const smile = 3 + Math.sin(local * .9 + scene) * 1.5 + bass * 2;
    c.beginPath(); c.moveTo(-11, 24); c.quadraticCurveTo(0, 25 + smile, 12, 23);
    c.strokeStyle = '#8e4e5e'; c.lineWidth = 1.8; c.stroke();
    c.fillStyle = `${dress}5a`;
    c.beginPath(); c.ellipse(-25, 17, 8, 4, 0, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(24, 17, 8, 4, 0, 0, TAU); c.fill();
    c.restore();
    dot(c, -31, 4, 2.5, p.sparkle); dot(c, 31, 4, 2.5, p.sparkle);
    line(c, -14, 66, 0, 74, p.sparkle, 1.6);
    line(c, 0, 74, 14, 66, p.sparkle, 1.6);
    if (scene === 0) fan(c, p, local);
    if (scene === 1) iceCream(c, p, local);
    if (scene === 2) {
      c.beginPath(); c.moveTo(-55, 86); c.quadraticCurveTo(-78, 125, -50, 166);
      c.strokeStyle = person.skin; c.lineWidth = 12; c.stroke();
      dot(c, -49, 165, 8, person.skin);
    }
    if (scene === 3) {
      const veilMix = smooth((local % 16 - 6) / 4);
      c.save(); c.globalAlpha = 1 - veilMix; veil(c, p, local); c.restore();
      c.save(); c.globalAlpha = veilMix; shyHand(c, person.skin, local); c.restore();
    }
    if (scene === 4) {
      line(c, -49, 85, -82, 30 + Math.sin(local) * 7, person.skin, 12);
      line(c, 49, 85, 84, 22 + Math.cos(local) * 7, person.skin, 12);
      dot(c, -82, 30 + Math.sin(local) * 7, 8, person.skin);
      dot(c, 84, 22 + Math.cos(local) * 7, 8, person.skin);
    }
    c.restore();
  }
  function fan(c, p, local) {
    c.save(); c.translate(3, 92); c.rotate(Math.sin(local * 2.1) * (.06 + mid * .08));
    c.fillStyle = `${p.sparkle}e8`; c.strokeStyle = p.ink; c.lineWidth = 2;
    c.beginPath(); c.moveTo(0, 12); c.arc(0, 12, 83, Math.PI * 1.06, Math.PI * 1.94);
    c.closePath(); c.fill(); c.stroke();
    for (let i = 0; i < 11; i++) {
      const angle = Math.PI * (1.06 + i * .088);
      line(c, 0, 12, Math.cos(angle) * 82, 12 + Math.sin(angle) * 82,
        `${p.ink}70`, 1);
    }
    dot(c, 0, 12, 4, p.ink); c.restore();
  }
  function iceCream(c, p, local) {
    line(c, 42, 91, 84, 39 + Math.sin(local) * 3, '#bd8269', 11);
    c.fillStyle = '#d6a773'; c.beginPath(); c.moveTo(66, 23); c.lineTo(105, 23);
    c.lineTo(85, 92); c.closePath(); c.fill();
    dot(c, 84, 13, 23, p.sparkle); dot(c, 76, 1, 9, p.dress);
    line(c, 82, -4, 102, -39, '#724733', 5);
    line(c, 94, -23, 105, -32, '#fff3d9', 2);
  }
  function veil(c, p, local) {
    c.fillStyle = `${p.sparkle}50`; c.beginPath(); c.moveTo(-48, -50);
    c.quadraticCurveTo(0, -112, 50, -48);
    c.quadraticCurveTo(66, 25, 43, 69);
    c.quadraticCurveTo(0, 88, -48, 66); c.closePath(); c.fill();
    for (let y = -40; y < 64; y += 13) for (let x = -39; x < 40; x += 14) {
      dot(c, x + Math.sin(local + y) * 2, y, 1.2, `${p.ink}84`);
    }
    line(c, -48, -48, 49, -48, p.sparkle, 1.5);
  }
  function shyHand(c, skin, local) {
    const lift = Math.sin(local * 1.3) * 3;
    line(c, 45, 100, 69, 82, skin, 11);
    line(c, 69, 82, 28, 37 + lift, skin, 10);
    c.fillStyle = skin; c.save(); c.translate(15, 28 + lift);
    c.beginPath(); c.ellipse(0, 5, 17, 11, -.2, 0, TAU); c.fill();
    for (let i = 0; i < 4; i++) line(c, -13 + i * 7, 0, -15 + i * 7, -14, skin, 4.5);
    c.restore();
  }
  function tossedShoes(c, p, local) {
    for (let i = 0; i < 2; i++) {
      const t = (local * .15 + i * .43) % 1;
      const x = 510 + i * 100 + t * 195, y = 405 - Math.sin(t * Math.PI) * (104 + i * 36);
      c.save(); c.translate(x, y); c.rotate((t * 2 + i) * Math.PI);
      c.fillStyle = p.ink; c.strokeStyle = p.sparkle; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-24, 5); c.quadraticCurveTo(-21, -12, -8, -11);
      c.lineTo(10, 1); c.quadraticCurveTo(27, 1, 28, 11);
      c.lineTo(-18, 11); c.closePath(); c.fill(); c.stroke();
      line(c, -19, 10, -25, 21, p.sparkle, 2); c.restore();
    }
  }
  function moodLight(c, form, p, local) {
    if (form === 'sorbet') {
      for (let i = 0; i < 18; i++) {
        const x = (i * 97 + local * (7 + i % 3)) % 980 - 40;
        const y = (i * 67 + Math.sin(local + i) * 18) % 420;
        c.save(); c.translate(x, y); c.rotate(local * .28 + i);
        c.fillStyle = i % 2 ? `${p.dresses[1]}80` : `${p.dresses[2]}80`;
        c.beginPath(); c.ellipse(0, 0, 8 + bass * 3, 3, 0, 0, TAU); c.fill(); c.restore();
      }
    } else if (form === 'amber') {
      for (let i = 0; i < 13; i++) {
        const x = (i * 139 + local * 14) % 970 - 30;
        const y = (i * 83 + Math.sin(local * .6 + i) * 25) % 450;
        glow(c, x, y, 22 + treble * 17, p.gleam, .36);
        line(c, x - 12, y, x + 12, y, `${p.sparkle}8c`, 1);
      }
    }
  }
  function scene(c, index, p, local, opacity, form) {
    c.save(); c.globalAlpha = opacity;
    landscape(c, index, p, local);
    moodLight(c, form, p, local);
    if (index === 4) fireworks(c, p, local, 1);
    else if (form === 'nocturne') fireworks(c, p, local, .56);
    else if (index === 2 || index === 3) fireworks(c, p, local, .19);
    woman(c, index, p, local);
    if (index === 4) tossedShoes(c, p, local);
    c.restore();
  }
  function draw(c, width, height, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'firstlight';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5), incomingBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (incomingBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && incomingBass > .62 && previousBass <= .62) { beats++; accent = 1; }
    previousBass = incomingBass; accent = Math.max(0, accent - dt * 2.2);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const local = time % 80, index = Math.floor(local / 16), step = local % 16;
    const blend = smooth((step - 13) / 3), p = moods[form];
    c.save(); c.scale(width / 900, height / 500);
    scene(c, index, p, local, 1, form);
    if (blend) scene(c, (index + 1) % 5, p, local, blend, form);
    const shown = blend > .5 ? (index + 1) % 5 : index;
    c.fillStyle = `${p.ink}b8`; c.fillRect(27, 27, 333, 70);
    c.fillStyle = p.sparkle; c.font = '700 20px Georgia, serif'; c.fillText('SHY SMILES', 42, 56);
    c.fillStyle = p.gleam; c.font = 'italic 13px Georgia, serif';
    c.fillText(`${vignettes[shown].title.toLowerCase()} / ${vignettes[shown].note}`, 42, 79);
    c.strokeStyle = `${p.sparkle}8c`; c.lineWidth = 2; c.strokeRect(13, 13, 874, 474);
    c.fillStyle = `${p.ink}84`; c.fillRect(37, 466, 826, 3);
    c.fillStyle = p.sparkle; c.fillRect(37, 466, 826 * local / 80, 3);
    c.restore();
    return { time, scene: shown, form, beats, blend };
  }
  return { recipes, draw, reset };
})();
