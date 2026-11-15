window.TheMagician = (() => {
  const forms = [['table', 'The Conjuring Table'], ['mirror', 'A Crooked Reflection'], ['smoke', 'Smoke Familiar']];
  const recipes = forms.map(([form, name]) => ({ name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6 }));
  const palettes = [
    ['#110b19', '#783947', '#ffcf8d', '#ef9876', '#391c38'],
    ['#060e25', '#264474', '#83edff', '#af9adb', '#271e54'],
    ['#0d1810', '#385841', '#c8ffab', '#dcb276', '#263c30'],
  ];
  const tau = Math.PI * 2;

  function oval(c, color, x, y, rx, ry, rotation = 0) {
    c.fillStyle = color;
    c.beginPath(); c.ellipse(x, y, rx, ry, rotation, 0, tau); c.fill();
  }

  function trace(c, color, width, draw) {
    c.strokeStyle = color; c.lineWidth = width;
    c.beginPath(); draw(c); c.stroke();
  }

  function portrait(c, x, y, size, palette, t, bass, skew = 1) {
    const [dark, shade, glint, skin, coat] = palette;
    c.save();
    c.translate(x, y);
    c.rotate(-.12 + Math.sin(t * 1.6) * (.03 + bass * .16));
    c.scale(size * skew, size);
    c.lineCap = 'round';
    oval(c, coat, -.07, .76, .89, .52);
    oval(c, shade, -.53, .02, .115, .205, -.24);
    const face = c.createLinearGradient(-.52, 0, .5, 0);
    face.addColorStop(0, shade); face.addColorStop(.63, skin); face.addColorStop(1, glint);
    oval(c, face, -.02, -.045, .55 + bass * .055, .694, -.1);
    trace(c, glint, .029, p => {
      p.moveTo(-.55, -.31); p.lineTo(-.4, -.72);
      p.quadraticCurveTo(-.31, -.9, -.04, -.75);
      p.quadraticCurveTo(.05, -.63, -.3, -.67);
      p.lineTo(.05, -.72);
      p.quadraticCurveTo(.28, -.72, .47, -.56); p.lineTo(.5, -.39);
    });
    const blink = Math.cos(t * 1.71) > .985;
    for (const side of [-1, 1]) {
      const ex = side * .225 + .055;
      const ey = -.075 + side * .04;
      const lift = side < 0 ? .08 + bass * .12 : .015;
      trace(c, dark, .045, p => {
        p.moveTo(ex - .135, ey - .084 - lift);
        p.quadraticCurveTo(ex - .03, ey - .16 - lift, ex + .108, ey - .11);
      });
      oval(c, dark, ex, ey, .106, blink ? .011 : .043, .11);
      if (!blink) oval(c, glint, ex + .026 + Math.sin(t) * .026, ey, .026, .027);
    }
    trace(c, shade, .042, p => {
      p.moveTo(.12, -.053); p.quadraticCurveTo(.23 + bass * .12, .18, .096, .205);
    });
    for (const side of [-1, 1]) {
      oval(c, '#e4bf92', .103 + side * .105, .27, .148, .05, side * .32);
      for (let i = 0; i < 10; i++) {
        const px = .1 + side * (.035 + i * .021);
        trace(c, glint + '7a', .008, p => { p.moveTo(px, .244); p.lineTo(px + side * .024, .29 + i * .004); });
      }
    }
    trace(c, dark, .031, p => { p.moveTo(-.09, .343); p.quadraticCurveTo(.12, .39, .28, .333); });
    trace(c, dark, .068, p => { p.moveTo(.25, .34); p.quadraticCurveTo(.53, .44, .68, .65); p.lineTo(.83, .62); });
    oval(c, dark, .85, .605, .142, .112, -.21);
    oval(c, '#ff8d49', .87, .552, .105, .029, -.15);
    c.restore();
  }

  function draw(c, w, h, time, { form, bass = 0, mid = 0, treble = 0 } = {}) {
    const cast = Math.max(0, forms.findIndex(([id]) => id === form));
    const palette = palettes[cast];
    const [dark, shade, glint] = palette;
    const t = time / 1000;
    const s = Math.min(h * .3, w * .29);
    c.save();
    c.translate(w / 2, h * .49);
    const halo = c.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h) * .58);
    halo.addColorStop(0, shade); halo.addColorStop(1, dark);
    c.fillStyle = halo; c.fillRect(-w / 2, -h * .49, w, h);
    if (cast === 0) {
      for (let i = 0; i < 4; i++) {
        const a = t * .6 + i * tau / 4;
        const x = Math.cos(a) * Math.min(w * .39, s * 2.65);
        const y = Math.sin(a) * s * (.62 + .35 * bass);
        c.save(); c.translate(x, y); c.rotate(Math.sin(a) * .28);
        c.fillStyle = dark; c.fillRect(-s * .23, -s * .31, s * .46, s * .62);
        c.strokeStyle = glint; c.lineWidth = s * .014;
        c.strokeRect(-s * .23, -s * .31, s * .46, s * .62);
        c.fillStyle = glint; c.textAlign = 'center'; c.font = `${s * (.23 + treble * .08)}px Georgia`;
        c.fillText(['\u2665', '\u2660', '\u2666', '\u2663'][i], 0, s * .09);
        c.restore();
      }
      portrait(c, 0, 0, s, palette, t, bass);
      c.fillStyle = dark; c.fillRect(-w / 2, s * .82, w, h);
      trace(c, glint, s * .014, p => { p.moveTo(-w / 2, s * .82); p.lineTo(w / 2, s * .82); });
    } else if (cast === 1) {
      for (let i = -2; i <= 2; i++) {
        const x = i * Math.min(w * .22, s * 1.53);
        const y = Math.sin(t * 1.45 + i) * s * .24;
        const skew = (i % 2 ? -1 : 1) * (.76 + .36 * Math.sin(t * 2 + i) + mid * .25);
        c.save(); c.globalAlpha = i ? .62 : 1;
        trace(c, glint, s * .015, p => p.ellipse(x, y, s * .68, s * 1.08, i * .18, 0, tau));
        portrait(c, x, y, s * (i ? .69 : 1), palette, t - i * .69, bass, skew);
        c.restore();
      }
    } else {
      const x = -Math.min(w * .16, s * .8);
      portrait(c, x, s * .26, s, palette, t, bass);
      for (let i = 0; i < 9; i++) {
        const age = (t * (.31 + bass * .05) + i / 9) % 1;
        const rise = h * age * .88;
        const drift = Math.sin(age * 11 - t * .8 + i * .23) * s * age * (.72 + mid * .65);
        const px = x + s * .94 + age * Math.min(w * .19, s * 1.15) + drift;
        const py = s * .71 - rise;
        c.save(); c.globalAlpha = (1 - age) * (.62 + treble * .25);
        trace(c, glint, s * (.012 + bass * .019), p => {
          p.ellipse(px, py, s * (.055 + age * .39), s * (.027 + age * .17), t + i, .4, 5.8);
        });
        c.restore();
      }
    }
    c.fillStyle = glint; c.textAlign = 'center';
    c.font = `bold ${s * .18}px Georgia`; c.fillText('I  /  THE MAGICIAN', 0, -h * .36);
    c.font = `${s * .125}px Georgia`; c.fillText(forms[cast][1], 0, h * .41);
    c.restore();
    return { scene: forms[cast][0] };
  }
  return { forms, recipes, draw };
})();
