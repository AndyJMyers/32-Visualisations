/* Autumn 14: a helpdesk whose answer is always another question. */
window.YourCall = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const forms = ['menu', 'verify', 'queue', 'agent'];
  const recipes = [
    { name: 'The Endless Menu', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Identity Theatre', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'First in the Queue', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'An Actual Human', form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = [
    { ink: '#e9f4f4', soft: '#91b5bb', accent: '#55e2cf', warning: '#ff8b72', panel: '#152b36' },
    { ink: '#f8edf4', soft: '#c7aabf', accent: '#f4a6d5', warning: '#ffc477', panel: '#332538' },
    { ink: '#fff3dd', soft: '#d4bc95', accent: '#ffd26c', warning: '#ff826f', panel: '#342c28' },
    { ink: '#e9eeff', soft: '#a5afd6', accent: '#9aaeff', warning: '#ff8eaf', panel: '#202741' },
  ];
  let time = 0, last = null, bass = 0, mid = 0, treble = 0;
  let lastBass = 0, beats = 0, activeForm = null;
  function reset() {
    time = 0; last = null; bass = mid = treble = 0;
    lastBass = 0; beats = 0; activeForm = null;
  }
  function box(c, x, y, w, h, radius, fill, stroke, line = 1) {
    const r = Math.min(radius, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y);
    c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = line; c.stroke(); }
  }
  function label(c, text, x, y, size, color, weight = 500, align = 'left') {
    c.fillStyle = color; c.font = `${weight} ${size}px "Segoe UI", Arial, sans-serif`;
    c.textAlign = align; c.fillText(text, x, y);
  }
  function line(c, x1, y1, x2, y2, color, width = 2) {
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2);
    c.strokeStyle = color; c.lineWidth = width; c.stroke();
  }
  function ring(c, x, y, r, color, width = 2) {
    c.beginPath(); c.arc(x, y, r, 0, TAU);
    c.strokeStyle = color; c.lineWidth = width; c.stroke();
  }
  function backdrop(c, p) {
    const alpha = c.globalAlpha;
    const g = c.createLinearGradient(0, 0, 900, 500);
    g.addColorStop(0, '#07131c'); g.addColorStop(.58, p.panel); g.addColorStop(1, '#0b121d');
    c.fillStyle = g; c.fillRect(0, 0, 900, 500);
    c.globalAlpha = alpha * .12;
    for (let i = 0; i < 14; i++) line(c, 0, i * 42 - 40, 900, i * 42 + 160, p.accent, 1);
    c.globalAlpha = alpha;
    ring(c, 796, 83, 84 + Math.sin(time * .7) * 5, p.accent, 1);
    ring(c, 796, 83, 108 + Math.sin(time * .5) * 8, p.soft, 1);
    label(c, 'YOUR CALL IS IMPORTANT TO US', 48, 54, 27, p.ink, 800);
    label(c, 'PLEASE REMAIN ON THE LINE', 50, 78, 11, p.soft, 700);
    box(c, 692, 42, 156, 28, 14, '#15252f', p.soft);
    c.fillStyle = p.warning; c.beginPath(); c.arc(710, 56, 5 + bass * 2, 0, TAU); c.fill();
    label(c, 'STILL CONNECTED', 722, 60, 11, p.ink, 700);
  }
  function shell(c, p, heading, number) {
    box(c, 46, 104, 808, 344, 24, '#101b28', p.soft, 1.4);
    box(c, 60, 118, 780, 44, 13, p.panel, null);
    label(c, `${number} / 04`, 78, 147, 14, p.accent, 800);
    label(c, heading, 164, 147, 17, p.ink, 700);
    label(c, 'ESCAPE IS NOT A VALID OPTION', 824, 147, 10, p.soft, 600, 'right');
    c.save(); c.globalAlpha *= .48;
    c.beginPath();
    for (let i = 0; i <= 90; i++) {
      const x = 68 + i * 8.5;
      const y = 395 + Math.sin(i * .39 - time * 4) * (2 + mid * 7)
        + Math.sin(i * .9 + time * 7) * treble * 3;
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.strokeStyle = p.accent; c.lineWidth = 1.5 + bass * 1.5; c.stroke(); c.restore();
    line(c, 68, 412, 832, 412, p.soft, 1);
  }
  function menu(c, p, local) {
    shell(c, p, 'CHOOSE FROM THE FOLLOWING', '01');
    const cx = 259, cy = 286;
    for (let i = 0; i < 3; i++) ring(c, cx, cy, 72 + i * 18 + bass * (4 - i), i === 1 ? p.accent : p.soft, 1.5);
    c.save(); c.translate(cx, cy); c.rotate(time * .11);
    for (let i = 0; i < 10; i++) {
      const a = i * TAU / 10;
      c.fillStyle = i === (beats % 10) ? p.warning : p.accent;
      c.beginPath(); c.arc(Math.cos(a) * 92, Math.sin(a) * 92, i === (beats % 10) ? 6 : 3, 0, TAU); c.fill();
    }
    c.restore();
    label(c, String((beats % 9) + 1), cx, cy + 18, 62, p.ink, 800, 'center');
    label(c, 'PRESS', cx, cy - 25, 12, p.soft, 700, 'center');
    const choices = [
      '1  Speak to a person',
      '2  Hear these options again',
      '3  Return to the main menu',
    ];
    for (let i = 0; i < 3; i++) {
      const x = 445 + Math.sin(local * .65 + i) * (4 + treble * 12);
      box(c, x, 182 + i * 62, 335, 49, 12, '#1c303b', i === beats % 3 ? p.accent : p.soft);
      label(c, choices[i], x + 17, 213 + i * 62, 16, p.ink, 600);
    }
    label(c, 'To speak to a person, press 7.', 80, 436, 13, p.ink, 600);
    label(c, 'There is no option 7.', 818, 436, 13, p.warning, 700, 'right');
  }
  function verify(c, p, local) {
    shell(c, p, 'IDENTITY THEATRE', '02');
    const step = 3 + Math.floor(local / 3) % 4 + beats % 2;
    label(c, `STEP ${step} OF ${Math.max(2, step - 1)}`, 86, 215, 33, p.ink, 800);
    label(c, 'We need to verify that you were verified.', 88, 244, 16, p.soft);
    const prompts = ['I have already confirmed this', 'I am not a recording', 'I remember the next question'];
    for (let i = 0; i < 3; i++) {
      const y = 270 + i * 41;
      box(c, 90, y, 25, 25, 4, i === (Math.floor(local * 1.2) % 3) ? p.accent : '#1b2b37', p.soft);
      label(c, prompts[i], 132, y + 19, 16, p.ink);
    }
    box(c, 555 + Math.sin(local * 1.3) * 14, 235, 235, 58, 11, p.accent, null);
    label(c, 'CONTINUE', 672 + Math.sin(local * 1.3) * 14, 273, 18, '#15212a', 800, 'center');
    label(c, 'Reference number:', 556, 331, 13, p.soft);
    box(c, 554, 343, 235, 42, 8, '#17232e', p.warning);
    label(c, 'issued after submission', 567, 370, 14, p.warning);
    label(c, 'You must finish the next step first.', 80, 436, 13, p.warning, 700);
  }
  function queue(c, p, local) {
    shell(c, p, 'FIRST IN THE QUEUE', '03');
    label(c, 'YOUR POSITION', 92, 222, 14, p.soft, 700);
    const position = (Math.floor(local / 2) + beats) % 4 === 0 ? '001' : String(408 + (beats % 87)).padStart(3, '0');
    label(c, position, 82, 338, 108, p.ink, 800);
    label(c, 'ESTIMATED WAIT', 523, 222, 14, p.soft, 700);
    const minutes = 49 + (Math.floor(local / 4) % 2);
    label(c, `${minutes}:${String(59 - Math.floor(local * 2) % 60).padStart(2, '0')}`, 518, 310, 62, p.warning, 700);
    box(c, 94, 358, 695, 20, 10, '#22313d', p.soft);
    const progress = 1 - (local % 12) / 12;
    box(c, 98, 362, Math.max(10, 687 * progress), 12, 6, p.accent, null);
    label(c, 'Thank you. Your place is being recalculated.', 80, 436, 13, p.ink, 600);
  }
  function agent(c, p, local) {
    shell(c, p, 'CONNECTING YOU TO A HUMAN', '04');
    ring(c, 246, 275, 93 + bass * 7, p.accent, 2);
    c.fillStyle = p.soft; c.beginPath(); c.arc(246, 252, 34, 0, TAU); c.fill();
    box(c, 180, 287, 132, 73, 55, p.soft, null);
    c.strokeStyle = p.accent; c.lineWidth = 4; c.beginPath();
    c.arc(246, 259, 49, Math.PI * .92, Math.PI * 2.08); c.stroke();
    box(c, 422, 184, 364, 108, 18, '#22313d', p.accent);
    label(c, Math.floor(local / 3) % 2 ? 'I CAN HELP YOU.' : 'JUST ONE MORE THING...', 447, 230, 22, p.ink, 700);
    label(c, 'Please repeat the answer you gave earlier.', 448, 262, 14, p.soft);
    box(c, 470 + Math.sin(local * 1.8) * 25, 329, 280, 51, 11, p.accent, null);
    label(c, 'CONNECT NOW', 610 + Math.sin(local * 1.8) * 25, 363, 17, '#15212a', 800, 'center');
    label(c, 'Transferring you back to the main menu...', 80, 436, 13, p.warning, 700);
  }
  const scenes = [menu, verify, queue, agent];
  function draw(c, w, h, now, opts = {}) {
    const form = forms.includes(opts.form) ? opts.form : 'menu';
    if (form !== activeForm) { reset(); activeForm = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const ease = 1 - Math.exp(-dt * 5);
    const inputBass = clamp(Number(opts.bass) || 0, 0, 1);
    bass += (inputBass - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    time += dt * clamp(Number(opts.speed) || 1, .2, 3);
    if (dt > 0 && inputBass > .6 && lastBass <= .6) beats++;
    lastBass = inputBass;
    const slot = Math.floor(time / 12), local = time % 12;
    const chapter = (forms.indexOf(form) + slot) % scenes.length;
    const p = palettes[chapter];
    c.save(); c.scale(w / 900, h / 500);
    backdrop(c, p);
    scenes[chapter](c, p, local);
    if (local > 10.8) {
      const fade = (local - 10.8) / 1.2;
      c.globalAlpha = fade;
      const next = (chapter + 1) % scenes.length;
      backdrop(c, palettes[next]);
      scenes[next](c, palettes[next], 0);
      c.globalAlpha = 1;
    }
    c.restore();
    return { time, chapter, form, beats };
  }
  return { recipes, draw, reset };
})();
