/* Wands: continuous flight through impossible, music-shaped geometry. */
window.SpaceTimeWarp = (() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const forms = ["vortex", "stargate", "horizon", "negative"];
  const recipes = [
    { name: "The Blue Vortex", form: 0, theme: 1, speed: 1, size: 1, count: 8, grasp: .5, smiles: .55, insanity: .55 },
    { name: "Beyond Jupiter", form: 1, theme: 3, speed: 1, size: 1, count: 8, grasp: .5, smiles: 0, insanity: 1 },
    { name: "Event Horizon", form: 2, theme: 2, speed: 1, size: 1, count: 8, grasp: .5, smiles: 0, insanity: .55 },
    { name: "Negative Eternity", form: 3, theme: 4, speed: 1, size: 1, count: 8, grasp: .5, smiles: 1, insanity: .55 },
  ];
  let time = 0, last = null, active = null, bass = 0, mid = 0, treble = 0, pulse = 0, previous = 0;
  const hue = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;
  const seed = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function reset() { time = 0; last = null; active = null; bass = mid = treble = pulse = previous = 0; }
  function path(c, points, color, width = 1, close = false, fill = false) {
    c.beginPath();
    points.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
    if (close) c.closePath();
    if (fill) { c.fillStyle = color; c.fill(); }
    else { c.strokeStyle = color; c.lineWidth = width; c.stroke(); }
  }
  function point(z, angle, form) {
    const depth = Math.max(.035, z);
    const radius = 37 / depth;
    const bend = Math.sin(time * .29 - z * 3.3);
    const cx = 500 + Math.sin(time * .19 + z * 2.2) * 105 * (1 - z) + bend * 46;
    const cy = 300 + Math.cos(time * .23 - z * 2.7) * 70 * (1 - z);
    const twist = time * .18 + z * (form === "negative" ? -4 : 3.8) + mid * .55;
    const a = angle + twist;
    const ripple = 1 + Math.sin(angle * 3 + z * 8 - time * 1.7) * (.075 + bass * .075);
    return { x: cx + Math.cos(a) * radius * 1.38 * ripple, y: cy + Math.sin(a) * radius * .92 * ripple };
  }
  function tunnel(c, form) {
    const negative = form === "negative";
    c.globalCompositeOperation = negative ? "source-over" : "lighter";
    const travel = time * (.11 + bass * .035);
    for (let ring = 34; ring >= 0; ring--) {
      const z = ((ring + 1) / 35 - travel % 1 + 1) % 1;
      if (z < .025) continue;
      const opacity = Math.min(.85, .12 + (1 - z) * .55);
      const base = negative ? 270 + ring * 2 : 185 + ring * 3 + Math.sin(time * .22) * 32;
      const vertices = Array.from({ length: 73 }, (_, i) => point(z, i / 72 * TAU, form));
      path(c, vertices, hue(base, negative ? 48 : 85, negative ? 28 : 58, opacity), (1 - z) * 2.1 + .4, true);
      if (ring % 3 === 0) {
        for (let rib = 0; rib < 18; rib++) {
          const a = rib / 18 * TAU;
          const start = point(z, a, form), end = point(Math.min(1.02, z + 3 / 35), a, form);
          path(c, [start, end], hue(base + rib * 4, 85, negative ? 36 : 67, opacity * .72), 1.1);
        }
      }
    }
    // Flowing filaments bend between the rings, not a stack of static circles.
    for (let strand = 0; strand < 22; strand++) {
      const points = [];
      for (let i = 0; i <= 50; i++) {
        const z = .055 + i / 50;
        const angle = strand / 22 * TAU + Math.sin(z * 5 - time * .7 + strand) * .18;
        points.push(point(z, angle, form));
      }
      path(c, points, hue(negative ? 300 + strand * 2 : 184 + strand * 5, 80, negative ? 30 : 65, .28 + treble * .27), strand % 4 ? 1 : 2.4);
    }
    c.globalCompositeOperation = "source-over";
  }
  function stargate(c) {
    const cx = 500 + Math.sin(time * .22) * 70, cy = 300 + Math.cos(time * .27) * 40;
    c.save(); c.translate(cx, cy); c.rotate(Math.sin(time * .16) * .16);
    c.globalCompositeOperation = "lighter";
    const travel = time * .14;
    for (let i = 0; i < 46; i++) {
      const z = ((i + 1) / 46 - travel % 1 + 1) % 1;
      if (z < .025) continue;
      const w = 31 / z, h = 17 / z;
      const turn = Math.sin(time * .35 + z * 4) * (.07 + mid * .1);
      c.save(); c.rotate(turn);
      c.strokeStyle = hue(i * 9 + time * 13, 96, 58, .1 + (1-z) * .55);
      c.lineWidth = 1 + (1-z) * 3;
      c.strokeRect(-w, -h, w * 2, h * 2);
      for (let side = -1; side <= 1; side += 2) {
        for (let tile = 0; tile < 5; tile++) {
          const f = seed(i * 13 + tile * 17);
          c.fillStyle = hue(i * 13 + tile * 43 + time * 7, 95, 42 + f * 22, (.16 + bass * .25) * (1-z));
          const length = w * (.09 + f * .13);
          c.fillRect(side < 0 ? -w : w - length, (tile / 5 * 2 - 1) * h, length, h * .32);
        }
      }
      c.restore();
    }
    c.restore();
    // Mirrored spectral slabs rush past the viewer on either side.
    for (let i = 0; i < 100; i++) {
      const p = (seed(i) + time * (.06 + seed(i+9)*.035)) % 1;
      const x = (30 + Math.pow(p, 2.3) * 650), y = seed(i+111) * 600;
      c.fillStyle = hue(seed(i+21)*360 + time*4, 95, 65, p * (.3 + treble*.3));
      for (const sign of [-1, 1]) c.fillRect(cx + sign*x, cy+(y-300)*p*2, sign*(4+p*55), 1+p*5);
    }
    c.globalCompositeOperation = "source-over";
  }
  function horizon(c) {
    const cx = 500 + Math.sin(time * .23) * 70, cy = 300 + Math.cos(time * .19) * 24;
    c.save(); c.translate(cx, cy); c.rotate(-.22 + Math.sin(time * .14) * .28);
    c.globalCompositeOperation = "lighter";
    for (let i = 100; i > 0; i--) {
      const r = 70 + i * 5.7;
      const color = hue(18 + i*.46 + Math.sin(time*.35)*16, 95, 52 + treble*12, .14 + bass*.07);
      c.strokeStyle = color; c.lineWidth = 1.2 + i*.012;
      c.beginPath(); c.ellipse(0, 0, r, r * (.12 + Math.sin(i*.08-time*.5)*.015), 0, 0, TAU); c.stroke();
      const a = time * (.5 + seed(i)*.8) + i * 2.399;
      const x = Math.cos(a)*r, y = Math.sin(a)*r*.13;
      c.fillStyle = hue(30+i*.4, 100, 80, .6);
      c.fillRect(x, y, 2+treble*3, 1.3);
    }
    c.globalCompositeOperation = "source-over";
    const shadow = c.createRadialGradient(0, 0, 54, 0, 0, 102 + bass*12);
    shadow.addColorStop(0, "#010107"); shadow.addColorStop(.82, "#010107"); shadow.addColorStop(1, "#ffbd4500");
    c.fillStyle = shadow; c.beginPath(); c.arc(0, 0, 108 + bass*12, 0, TAU); c.fill();
    c.strokeStyle = "#ffcc75"; c.lineWidth = 2 + bass * 2;
    c.beginPath(); c.arc(0, 0, 88+bass*9, Math.PI, TAU); c.stroke();
    c.restore();
  }
  function stars(c, form) {
    const negative = form === "negative", travel = time * (.055 + bass*.025);
    c.save(); c.globalCompositeOperation = negative ? "source-over" : "lighter";
    for (let i = 0; i < 175; i++) {
      const z = .03 + ((seed(i+400) - travel % 1 + 1) % 1);
      const angle = seed(i+700)*TAU + time*.025;
      const p = point(z, angle, form);
      const tail = point(Math.min(1.1,z+.008+treble*.012), angle, form);
      path(c, [tail,p], hue(negative ? 240 : 180+seed(i)*160, 80, negative ? 25 : 80, .15+(1-z)*.6), .5+(1-z)*1.6);
    }
    c.restore();
  }
  function draw(c, width, height, now, opts = {}) {
    const form = typeof opts.form === "number" ? forms[opts.form % forms.length] : forms.includes(opts.form) ? opts.form : forms[0];
    if (active !== form) { reset(); active = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now-last)/1000, 0, .08);
    last = animate ? now : null;
    const input = clamp(Number(opts.bass)||0, 0, 1), ease = 1-Math.exp(-dt*6);
    bass += (input-bass)*ease;
    mid += (clamp(Number(opts.mid)||0,0,1)-mid)*ease;
    treble += (clamp(Number(opts.treble)||0,0,1)-treble)*ease;
    if (dt && input > .62 && previous <= .62) pulse = 1;
    previous = input; pulse = Math.max(0,pulse-dt*2.4);
    time += dt * clamp(Number(opts.speed)||1,.2,3) * (1+bass*.2);
    c.save(); c.scale(width/1000,height/600);
    const negative = form === "negative";
    c.fillStyle = negative ? "#ece8df" : form === "horizon" ? "#08030e" : "#020514";
    c.fillRect(0,0,1000,600);
    const aura = c.createRadialGradient(500,300,10,500,300,620);
    aura.addColorStop(0,negative ? "#a8d5d6" : form==="horizon" ? "#5b163b" : "#202968");
    aura.addColorStop(1,negative ? "#f4eee000" : "#00001000");
    c.fillStyle = aura; c.fillRect(0,0,1000,600);
    stars(c,form);
    if (form === "stargate") stargate(c);
    else if (form === "horizon") horizon(c);
    else tunnel(c,form);
    // A dark, impossible doorway slips past, never becoming a permanent HUD.
    const chapter = time % 48;
    if (chapter > 29 && chapter < 36 && form !== "horizon") {
      const p = (chapter-29)/7, size = 12 + p*p*220;
      c.save(); c.translate(500+Math.sin(time*.2)*50-p*p*550,300+p*p*190); c.rotate(p*.8);
      c.fillStyle = negative ? "#eee8e1" : "#01020a"; c.fillRect(-size*.22,-size,size*.44,size*2);
      c.strokeStyle = negative ? "#bd4f7c" : "#ffcc85"; c.lineWidth = 1.2; c.strokeRect(-size*.22,-size,size*.44,size*2);
      c.restore();
    }
    // The audio pulse flexes space; avoid full-frame strobe flashes.
    if (pulse) {
      c.globalAlpha = pulse*.22;
      c.strokeStyle = negative ? "#46245a" : "#a9eaff"; c.lineWidth = 1+pulse*3;
      c.beginPath(); c.ellipse(500,300,55+(1-pulse)*700,30+(1-pulse)*420,Math.sin(time*.2)*.2,0,TAU); c.stroke();
    }
    c.restore();
    return { time, form, phase: form === "horizon" ? "event horizon" : chapter > 29 && chapter < 36 ? "threshold" : form === "stargate" ? "star gate" : "time vortex", bass, pulse };
  }
  return { recipes, draw, reset };
})();
