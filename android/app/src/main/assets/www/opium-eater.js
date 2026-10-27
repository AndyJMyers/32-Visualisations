/* An impression of De Quincey's journey, from London streets into dreams. */
window.OpiumEater = (() => {
  const recipes = [
    { name: 'London Gaslight', form: 'london', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Scottish Gothic', form: 'scotland', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Grecian Reverie', form: 'greece', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Paris Nocturne', form: 'paris', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Roman Fever Dream', form: 'rome', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const chapters = [
    { id: 'street', name: 'OXFORD STREET', length: 13 },
    { id: 'apothecary', name: 'THE APOTHECARY', length: 12 },
    { id: 'music', name: 'THE PLEASURES', length: 14 },
    { id: 'city', name: 'THE CITY UNFOLDS', length: 14 },
    { id: 'dream', name: 'THE PAINS', length: 16 },
    { id: 'dawn', name: 'THE RETURN', length: 13 },
  ];
  const duration = chapters.reduce((sum, chapter) => sum + chapter.length, 0);
  const palettes = {
    london: { sky: '#172033', ground: '#1c2230', wall: '#45536a', ink: '#101522', light: '#ffd080', accent: '#a55356', mist: '#8996ab' },
    scotland: { sky: '#302943', ground: '#282538', wall: '#66718b', ink: '#191828', light: '#efc5b5', accent: '#a578b9', mist: '#c6c5dc' },
    greece: { sky: '#174777', ground: '#d4b68b', wall: '#f0e4ca', ink: '#213d61', light: '#fff5cf', accent: '#4da3c5', mist: '#c5e6f0' },
    paris: { sky: '#5a345c', ground: '#32263d', wall: '#a9899c', ink: '#271b35', light: '#ffdda8', accent: '#f08c90', mist: '#e9b8d9' },
    rome: { sky: '#884452', ground: '#59434a', wall: '#d4a276', ink: '#352439', light: '#ffcf87', accent: '#dc6951', mist: '#efbd9b' },
  };
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  const fract = n => n - Math.floor(n);
  const noise = n => fract(Math.sin(n * 127.1 + 78.233) * 43758.5453);
  let time = 0, last = null, bass = 0, mid = 0, treble = 0;
  function reset() { time = 0; last = null; bass = 0; mid = 0; treble = 0; }
  function line(c, colour, width, points) {
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.stroke();
  }
  function shape(c, colour, points) {
    c.fillStyle = colour; c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.closePath(); c.fill();
  }
  function oval(c, x, y, rx, ry, colour) {
    c.fillStyle = colour; c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, Math.PI * 2); c.fill();
  }
  function figure(c, x, y, scale, tick, p, bowed = false) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    const step = Math.sin(tick * 5) * 6;
    line(c, p.ink, 8, [-9,-48,-13 + step,0]);
    line(c, p.ink, 8, [7,-48,13 - step,0]);
    shape(c, p.ink, [-14,-104,12,-104,20,-46,-21,-46]);
    line(c, p.ink, 7, [-13,-96,-24,-58 - step]);
    line(c, p.ink, 7, [11,-95,24,-58 + step]);
    oval(c, bowed ? 7 : 0, -116, 15, 18, p.ink);
    shape(c, p.ink, [-21,-132,21,-132,14,-137,-14,-137]);
    c.fillStyle = p.light; c.fillRect(-11, -140, 22, 9);
    c.restore();
  }
  function architecture(c, p, form, tick, pulse, horizon = 340) {
    const drift = tick * (form === 'scotland' ? 5 : 9) % 170;
    if (form === 'greece') {
      c.fillStyle = '#3983a488'; c.fillRect(0, horizon - 33, 900, 37);
      shape(c, '#f6dfb88c', [0,horizon - 62,130,horizon - 90,320,horizon - 56,520,horizon - 110,900,horizon - 65,900,horizon]);
    } else if (form === 'scotland') {
      shape(c, '#3d49688c', [0,horizon - 80,150,horizon - 161,320,horizon - 96,515,horizon - 174,715,horizon - 84,900,horizon - 140,900,horizon]);
    } else if (form === 'rome') {
      oval(c, 758, 108, 53 + pulse * 5, 53 + pulse * 5, '#ffb97199');
      shape(c, '#a8706288', [0,horizon - 80,170,horizon - 132,380,horizon - 94,620,horizon - 158,900,horizon - 87,900,horizon]);
    }
    c.fillStyle = p.ground; c.fillRect(0, horizon, 900, 500 - horizon);
    for (let i = -1; i < 7; i++) {
      const x = i * 170 - drift, y = horizon - 205 - i % 3 * 17;
      if (form === 'london') {
        c.fillStyle = i % 2 ? p.wall : '#364256'; c.fillRect(x, y, 155, horizon - y);
        shape(c, p.ink, [x - 4,y,x + 158,y,x + 146,y - 14,x + 9,y - 14]);
        c.fillStyle = p.ink; c.fillRect(x + 21, y - 44, 17, 31); c.fillRect(x + 120, y - 37, 15, 25);
        for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
          const wx = x + 21 + col * 48, wy = y + 28 + row * 52;
          c.fillStyle = p.ink; c.fillRect(wx - 3, wy - 3, 28, 37);
          c.fillStyle = (row + col + i) % 3 ? `${p.light}94` : '#253149'; c.fillRect(wx, wy, 22, 31);
          line(c, p.wall, 2, [wx + 11,wy,wx + 11,wy + 31]);
        }
      } else if (form === 'scotland') {
        c.fillStyle = i % 2 ? '#505a76' : p.wall; c.fillRect(x, y - 20, 155, horizon - y + 20);
        shape(c, p.ink, [x - 6,y - 20,x + 80,y - 76,x + 160,y - 20]);
        for (const tower of [x + 10, x + 125]) {
          c.fillStyle = p.wall; c.fillRect(tower, y - 67, 20, 51);
          shape(c, p.ink, [tower - 5,y - 67,tower + 10,y - 94,tower + 25,y - 67]);
        }
        for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
          const wx = x + 26 + col * 47, wy = y + 10 + row * 53;
          c.fillStyle = p.ink; c.fillRect(wx, wy, 16, 37);
          oval(c, wx + 8, wy, 8, 9, p.ink);
          c.fillStyle = `${p.light}${(i + row) % 3 ? 'a0' : '29'}`; c.fillRect(wx + 3, wy + 5, 10, 29);
        }
      } else if (form === 'greece') {
        const base = horizon - 22, roof = y + 55;
        c.fillStyle = '#f7e6c9'; c.fillRect(x - 10, base, 175, 25);
        c.fillStyle = p.wall; c.fillRect(x, roof, 155, base - roof);
        shape(c, '#fff4dd', [x - 18,roof,x + 78,roof - 58,x + 173,roof]);
        line(c, p.accent, 4, [x - 13,roof + 6,x + 166,roof + 6]);
        for (let col = 0; col < 4; col++) {
          const cx = x + 13 + col * 38;
          c.fillStyle = '#fffbeb'; c.fillRect(cx, roof + 12, 13, base - roof - 12);
          c.fillRect(cx - 5, roof + 8, 23, 7);
          line(c, '#b3c7cf', 1, [cx + 4,roof + 18,cx + 4,base - 3]);
        }
      } else if (form === 'paris') {
        c.fillStyle = i % 2 ? '#a3859d' : p.wall; c.fillRect(x, y, 156, horizon - y);
        shape(c, '#44304b', [x - 3,y,x + 21,y - 55,x + 133,y - 55,x + 159,y]);
        for (let col = 0; col < 3; col++) {
          const dx = x + 22 + col * 49;
          c.fillStyle = `${p.light}77`; c.fillRect(dx, y - 34, 20, 23);
          shape(c, '#37263d', [dx - 4,y - 34,dx + 10,y - 50,dx + 24,y - 34]);
          for (let row = 0; row < 3; row++) {
            const wy = y + 22 + row * 54;
            c.fillStyle = '#34253e'; c.fillRect(dx - 3, wy, 29, 35);
            c.fillStyle = `${p.light}${(i + row + col) % 3 ? '8e' : '32'}`; c.fillRect(dx, wy + 3, 23, 27);
            line(c, p.ink, 3, [dx - 9,wy + 37,dx + 32,wy + 37]);
            for (let bar = 0; bar < 4; bar++) line(c, p.ink, 1, [dx - 6 + bar * 11,wy + 25,dx - 6 + bar * 11,wy + 37]);
          }
        }
      } else {
        c.fillStyle = i % 2 ? '#bc846c' : p.wall; c.fillRect(x, y + 15, 155, horizon - y - 15);
        c.fillStyle = '#e4b789'; c.fillRect(x - 4, y + 11, 163, 13);
        if (i % 3 === 0) {
          c.fillStyle = '#c6846a'; c.fillRect(x + 25, y - 26, 111, 40);
          oval(c, x + 80, y - 26, 56, 45, '#e3ae82');
        }
        for (let col = 0; col < 3; col++) for (let row = 0; row < 2; row++) {
          const ax = x + 13 + col * 47, ay = y + 41 + row * 85;
          c.fillStyle = '#633e46'; c.fillRect(ax, ay + 13, 30, 49);
          oval(c, ax + 15, ay + 13, 15, 17, '#633e46');
          c.fillStyle = (row + col + i) % 3 ? `${p.light}82` : '#3f3443'; c.fillRect(ax + 5, ay + 17, 20, 41);
        }
      }
    }
    if (form === 'rome') {
      c.fillStyle = '#704350';
      c.fillRect(620, horizon - 126, 266, 119);
      oval(c, 753, horizon - 126, 133, 28, '#a9695b');
      c.fillStyle = '#d89e76'; c.fillRect(620, horizon - 135, 266, 11);
      for (let row = 0; row < 2; row++) for (let col = 0; col < 7; col++) {
        const x = 629 + col * 37, y = horizon - 114 + row * 53;
        c.fillStyle = '#392a3e'; c.fillRect(x, y + 12, 24, 29);
        oval(c, x + 12, y + 12, 12, 13, '#392a3e');
        line(c, '#e2ab7d', 2, [x - 4,y + 44,x + 28,y + 44]);
      }
    }
    if (form === 'london' || form === 'paris') for (let i = 0; i < 5; i++) {
      const x = 80 + i * 190 - tick * 14 % 190;
      line(c, p.ink, 6, [x, horizon, x, horizon - 180]);
      oval(c, x, horizon - 183, 11 + pulse * 3, 16 + pulse * 3, `${p.light}bb`);
    }
    if (form === 'scotland') for (let i = 0; i < 8; i++) {
      oval(c, i * 130 + Math.sin(tick + i) * 18, horizon - 130 + i % 3 * 22, 85, 17, '#d7d0e02b');
    }
  }
  function street(c, p, tick, pulse, form) {
    architecture(c, p, form, tick, pulse, 340);
    c.fillStyle = `${p.mist}77`; c.fillRect(0, 341, 900, 3);
    figure(c, 405 + Math.sin(tick * .4) * 22, 407, 1.03, tick, p, true);
    figure(c, 690, 392, .78, tick + 2, p);
  }
  function apothecary(c, p, tick, pulse, form) {
    street(c, p, tick, pulse, form);
    c.fillStyle = p.ink; c.fillRect(466, 119, 314, 236);
    c.fillStyle = p.wall; c.fillRect(479, 132, 288, 207);
    c.fillStyle = p.ink; c.fillRect(553, 204, 152, 135);
    c.fillStyle = p.light; c.font = '16px Georgia, serif'; c.fillText('APOTHECARY', 521, 160);
    for (let i = 0; i < 8; i++) {
      const x = 494 + i % 4 * 65, y = 188 + Math.floor(i / 4) * 50;
      c.fillStyle = i % 2 ? p.accent : p.light; c.fillRect(x, y, 20, 30);
      c.fillStyle = p.ink; c.fillRect(x + 6, y - 5, 8, 5);
    }
    oval(c, 628, 238, 62 + pulse * 15, 62 + pulse * 15, `${p.light}1e`);
  }
  function concert(c, p, tick, pulse, form) {
    architecture(c, p, form, tick, pulse, 275);
    c.fillStyle = p.ink; c.fillRect(0, 275, 900, 225);
    for (let i = 0; i < 8; i++) {
      const x = 55 + i * 117;
      shape(c, p.wall, [x,275,x + 27,75,x + 67,75,x + 93,275]);
      oval(c, x + 47, 75, 50, 25, p.wall);
    }
    for (let i = 0; i < 14; i++) {
      const x = 28 + i * 67;
      oval(c, x, 399, 23, 27, p.wall);
      c.fillStyle = p.wall; c.fillRect(x - 21, 404, 42, 97);
    }
    for (let i = 0; i < 6; i++) {
      const x = 195 + i * 92, y = 180 + Math.sin(tick * (1.5 + i % 2) + i) * (13 + pulse * 18);
      oval(c, x, y, 5 + pulse * 4, 5 + pulse * 4, p.light);
      line(c, p.light, 3, [x + 4,y,x + 4,y - 34]);
    }
    oval(c, 464, 260, 130 + pulse * 28, 45, `${p.accent}55`);
    figure(c, 435, 315, .75, tick, p);
  }
  function city(c, p, tick, pulse, form) {
    architecture(c, p, form, tick * 1.6, pulse, 365);
    for (let i = 0; i < 9; i++) {
      const r = 70 + i * 44 + pulse * 5;
      c.strokeStyle = `${p.light}${i % 2 ? '34' : '61'}`; c.lineWidth = 2;
      c.beginPath(); c.ellipse(455, 262, r, r * .6, 0, 0, Math.PI * 2); c.stroke();
    }
    figure(c, 455, 425, .95, tick, p);
  }
  function dream(c, p, tick, pulse, form) {
    architecture(c, p, form, tick * 1.8, pulse, 406);
    for (let i = 0; i < 8; i++) {
      const depth = i / 8, x = i * 130 - tick * 15 % 130;
      const height = 205 + noise(i * 12) * 190 + pulse * 45;
      c.fillStyle = i % 2 ? p.wall : p.ink;
      c.fillRect(x, 407 - height, 36 + depth * 37, height);
      oval(c, x + 18, 407 - height, 19 + depth * 19, 17, p.wall);
      line(c, p.accent, 2, [x,407 - height * .54,x + 39,407 - height * .54]);
    }
    for (let i = 0; i < 5; i++) {
      const x = 96 + i * 178 + Math.sin(tick + i) * 14;
      const y = 115 + Math.sin(tick * .8 + i * 2) * 23;
      oval(c, x, y, 43 + pulse * 10, 14, `${p.accent}74`);
      oval(c, x, y, 11, 11, p.ink);
    }
    shape(c, p.ink, [320,407,430,205,469,205,581,407]);
    for (let i = 0; i < 7; i++) line(c, p.light, 2, [365 + i * 26, 360 - i * 24, 530 - i * 12, 360 - i * 24]);
    figure(c, 464, 410, .87, tick, p, true);
  }
  function dawn(c, p, tick, pulse, form) {
    const sun = c.createRadialGradient(692, 196, 10, 692, 196, 270 + pulse * 48);
    sun.addColorStop(0, `${p.light}b8`); sun.addColorStop(1, `${p.light}00`);
    c.fillStyle = sun; c.fillRect(340, 0, 560, 460);
    oval(c, 692, 196, 45 + pulse * 5, 45 + pulse * 5, p.light);
    architecture(c, p, form, tick * .5, pulse, 357);
    figure(c, 485, 430, 1, tick, p);
    for (let i = 0; i < 17; i++) {
      const x = noise(i * 8) * 900, y = 38 + noise(i * 19) * 280;
      oval(c, x, y, 1.5 + pulse * 2, 1.5 + pulse * 2, `${p.light}88`);
    }
  }
  function worldSignature(c, p, form, tick, pulse, chapter) {
    if (form === 'london') {
      for (let i = 0; i < 5; i++) {
        const x = 45 + i * 205 + Math.sin(tick * .27 + i) * 19;
        oval(c, x, 350 + i % 2 * 23, 120 + pulse * 24, 27, '#a6a5a222');
      }
      for (let i = 0; i < 4; i++) {
        const x = 103 + i * 221;
        oval(c, x, 286, 21 + pulse * 10, 53 + pulse * 15, `${p.light}20`);
        line(c, p.ink, 5, [x, 500, x, 289]);
      }
    } else if (form === 'scotland') {
      for (let i = 0; i < 55; i++) {
        const x = (noise(i * 11) * 1100 + tick * 75) % 1050 - 75;
        const y = (noise(i * 19) * 570 + tick * 155) % 540 - 20;
        line(c, `${p.mist}67`, 1.2, [x, y, x - 12, y + 28]);
      }
      for (let i = 0; i < 3; i++) {
        const x = 112 + i * 310;
        shape(c, '#181b30b0', [x,350,x + 22,284,x + 42,350]);
      }
    } else if (form === 'greece') {
      for (let i = 0; i < 9; i++) {
        const x = (i * 137 + tick * 7) % 1010 - 40;
        const y = 380 + i % 3 * 34;
        line(c, '#fff3d277', 2, [x,y,x + 35 + pulse * 20,y - 3]);
      }
      for (let i = 0; i < 6; i++) {
        const x = 80 + i * 160, y = 54 + i % 3 * 35;
        oval(c, x + Math.sin(tick + i) * 8, y, 5 + pulse * 3, 2, '#f7e8c5aa');
      }
    } else if (form === 'paris') {
      for (let i = 0; i < 8; i++) {
        const x = i * 135 + Math.sin(tick * .3 + i) * 12;
        line(c, `${p.light}59`, 3, [x,361,x - 19,500]);
        oval(c, x - 8, 427, 12 + pulse * 8, 41, `${p.accent}33`);
      }
      if (chapter === 'music' || chapter === 'city') {
        for (let i = 0; i < 11; i++) {
          const x = (tick * 24 + i * 91) % 950;
          oval(c, x, 80 + Math.sin(tick + i) * 30, 2 + pulse * 3, 2 + pulse * 3, p.light);
        }
      }
    } else {
      for (let i = 0; i < 18; i++) {
        const x = (noise(i * 17) * 950 + Math.sin(tick * .43 + i) * 26) % 920;
        const y = 70 + noise(i * 23) * 340;
        oval(c, x, y, 2 + pulse * 2, 2, `${p.light}70`);
      }
      for (let i = 0; i < 4; i++) {
        const x = 100 + i * 239;
        c.strokeStyle = `${p.light}4c`; c.lineWidth = 2;
        c.beginPath(); c.ellipse(x, 405, 78 + pulse * 12, 13, 0, 0, Math.PI * 2); c.stroke();
      }
    }
  }
  const scenes = { street, apothecary, music: concert, city, dream, dawn };
  function chapterAt(t) {
    let elapsed = ((t % duration) + duration) % duration;
    for (let i = 0; i < chapters.length; i++) {
      if (elapsed < chapters[i].length) return { index: i, phase: elapsed / chapters[i].length };
      elapsed -= chapters[i].length;
    }
    return { index: 0, phase: 0 };
  }
  function panel(c, chapter, p, form, tick, pulse) {
    const sky = c.createLinearGradient(0, 0, 0, 500);
    sky.addColorStop(0, p.sky); sky.addColorStop(1, p.wall);
    c.fillStyle = sky; c.fillRect(0, 0, 900, 500);
    scenes[chapter.id](c, p, tick, pulse, form);
    worldSignature(c, p, form, tick, pulse, chapter.id);
    const haze = c.createLinearGradient(0, 0, 900, 0);
    haze.addColorStop(0, `${p.mist}00`); haze.addColorStop(.5, `${p.mist}19`); haze.addColorStop(1, `${p.mist}00`);
    c.fillStyle = haze; c.fillRect(0, 0, 900, 500);
  }
  function draw(c, width, height, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    bass += (clamp(Number(opts.bass) || 0, 0, 1) - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    const form = palettes[opts.form] ? opts.form : 'london';
    const p = palettes[form], story = chapterAt(time);
    const chapter = chapters[story.index];
    const next = chapters[(story.index + 1) % chapters.length];
    const slide = smooth((story.phase - .79) / .21) * 900;
    const beat = time * (1.9 + mid * .8) % 1;
    const accent = [0, .31, .7].reduce((peak, hit) => Math.max(peak, Math.max(0, 1 - Math.abs(beat - hit) * 12)), 0);
    const pulse = clamp(bass * .65 + treble * .24 + accent * .22, 0, 1);
    c.save(); c.scale(width / 900, height / 500);
    c.save(); c.translate(-slide, 0); panel(c, chapter, p, form, time, pulse); c.restore();
    if (slide > 0) { c.save(); c.translate(900 - slide, 0); panel(c, next, p, form, time, pulse); c.restore(); }
    c.fillStyle = `${p.ink}dd`; c.fillRect(17, 17, 373, 77);
    c.fillStyle = p.light; c.font = 'bold 20px Georgia, serif'; c.fillText('CONFESSIONS OF AN OPIUM EATER', 31, 46);
    c.fillStyle = p.mist; c.font = 'italic 16px Georgia, serif'; c.fillText(chapter.name, 32, 73);
    c.fillStyle = `${p.ink}dd`; c.fillRect(728, 17, 155, 37);
    c.fillStyle = p.light; c.font = 'bold 15px Georgia, serif'; c.textAlign = 'center';
    c.fillText(form.toUpperCase(), 805, 42); c.textAlign = 'start';
    c.fillStyle = `${p.ink}aa`; c.fillRect(28, 479, 844, 4);
    c.fillStyle = p.light; c.fillRect(28, 479, 844 * (time % duration) / duration, 4);
    c.restore();
    return { time, chapter: chapter.id, index: story.index, phase: story.phase, slide, form, pulse, bass, mid, treble };
  }
  return { recipes, chapters, duration, draw, reset };
})();
