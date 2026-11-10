/* Wands: a continuous, polarised surface seen from inside a living tube. */
window.Wormhole = (() => {
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const forms = ["prism", "liquid", "velvet", "opal"];
  const recipes = [
    { name: "Prismatic Peristalsis", form: 0, theme: 3, speed: 1, size: 1, count: 8, grasp: .5, smiles: .55, insanity: 1 },
    { name: "Liquid Polarisation", form: 1, theme: 1, speed: 1, size: 1, count: 8, grasp: .5, smiles: .55, insanity: .55 },
    { name: "Velvet Singularity", form: 2, theme: 4, speed: 1, size: 1, count: 8, grasp: .5, smiles: 0, insanity: 1 },
    { name: "Opalescent Inversion", form: 3, theme: 0, speed: 1, size: 1, count: 8, grasp: .5, smiles: 1, insanity: .55 },
  ];
  const modes = {
    prism: { sides: 5, twist: 4.4, bend: 1, hue: 190, light: 38, saturation: 88, back: "#060316" },
    liquid: { sides: 2, twist: -6.2, bend: 1.35, hue: 150, light: 42, saturation: 82, back: "#021a25" },
    velvet: { sides: 3, twist: 8.5, bend: .75, hue: 275, light: 19, saturation: 78, back: "#07020c" },
    opal: { sides: 7, twist: -3.3, bend: 1.15, hue: 28, light: 75, saturation: 49, back: "#eee7df" },
  };
  let time = 0, last = null, active = null, bass = 0, mid = 0, treble = 0, beat = 0, previous = 0;
  const color = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;
  const noise = n => { const x = Math.sin(n * 91.73 + 14.2) * 43758.54; return x - Math.floor(x); };
  function reset() { time = 0; last = null; active = null; bass = mid = treble = beat = previous = 0; }
  function surface(z, a, mode) {
    const roll = time * .16 + Math.sin(time * .21) * .7;
    const turn = a + roll + z * mode.twist;
    const phase = z * 8 - time * 1.7;
    const breathing = 1 + Math.sin(phase) * (.1 + bass * .12);
    const lobes = 1 + Math.sin(a * mode.sides + phase * .6) * (.12 + mid * .15);
    const r = 57 / Math.max(.028, z) * breathing * lobes;
    const cx = 500 + Math.sin(time * .22 - z * 4.8) * 110 * mode.bend
      + Math.sin(z * 11 + time * .32) * z * 38;
    const cy = 300 + Math.cos(time * .18 - z * 4) * 85 * mode.bend;
    const flatten = active === "liquid" ? .65 + Math.sin(z * 6 + time * .4) * .18 : .86;
    return { x: cx + Math.cos(turn) * r * 1.35, y: cy + Math.sin(turn) * r * flatten };
  }
  function polygon(c, points, fill) {
    c.beginPath(); c.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i].x, points[i].y);
    c.closePath(); c.fillStyle = fill; c.fill();
    // Same-colour overlap seals subpixel seams between the flowing facets.
    c.strokeStyle = fill; c.lineWidth = .8; c.stroke();
  }
  function draw(c, width, height, now, opts = {}) {
    const form = typeof opts.form === "number" ? forms[opts.form % forms.length] : forms.includes(opts.form) ? opts.form : "prism";
    if (active !== form) { reset(); active = form; }
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .08);
    last = animate ? now : null;
    const incoming = clamp(Number(opts.bass) || 0, 0, 1), ease = 1 - Math.exp(-dt * 5);
    bass += (incoming - bass) * ease;
    mid += (clamp(Number(opts.mid) || 0, 0, 1) - mid) * ease;
    treble += (clamp(Number(opts.treble) || 0, 0, 1) - treble) * ease;
    if (dt && incoming > .64 && previous <= .64) beat = 1;
    previous = incoming; beat = Math.max(0, beat - dt * 1.6);
    time += dt * clamp(Number(opts.speed) || 1, .2, 3) * (1 + bass * .22);
    const mode = modes[form], pale = form === "opal";
    c.save(); c.scale(width / 1000, height / 600);
    c.fillStyle = mode.back; c.fillRect(0, 0, 1000, 600);
    const heart = surface(1.15, 0, mode);
    const glow = c.createRadialGradient(heart.x, heart.y, 0, heart.x, heart.y, 240);
    glow.addColorStop(0, pale ? "#fff8df" : form === "velvet" ? "#e64fbd" : "#7ee8ed");
    glow.addColorStop(.18, pale ? "#e5cee9" : "#412282");
    glow.addColorStop(1, mode.back);
    c.fillStyle = glow; c.fillRect(0, 0, 1000, 600);
    const rings = 38, sectors = 56, travel = time * (2.1 + bass * .7);
    const offset = travel % 1, world = Math.floor(travel);
    const mesh = [];
    for (let ring = 0; ring <= rings; ring++) {
      const z = Math.max(.024, (ring + 1 - offset) / rings);
      mesh.push(Array.from({ length: sectors + 1 }, (_, j) => surface(z, j / sectors * TAU, mode)));
    }
    for (let ring = rings - 1; ring >= 0; ring--) {
      const z = (ring + 1 - offset) / rings;
      for (let sector = 0; sector < sectors; sector++) {
        const a = sector / sectors * TAU;
        const wave = Math.sin(a * mode.sides - z * 12 + time * .7);
        const polar = Math.cos(a * 2 + time * .43 + z * 5);
        const transmission = polar * polar;
        const hue = mode.hue + a * 43 + Math.sin(z * 8 - time * .52) * 85
          + wave * (form === "liquid" ? 28 : 62) + time * 5;
        const ribbon = Math.pow(Math.max(0, Math.cos(a * 3 + z * mode.twist * 2 - time * .55)), 12);
        const light = clamp(mode.light + wave * 9 + transmission * 14 + ribbon * (19 + treble * 9)
          - z * (pale ? 9 : 22) + bass * 5, 7, pale ? 93 : 83);
        const tint = color(hue, mode.saturation - z * 12, light);
        polygon(c, [mesh[ring][sector], mesh[ring][sector+1], mesh[ring+1][sector+1], mesh[ring+1][sector]], tint);
        if (form === "velvet" && (ring + world) % 4 === 0 && sector % 3 === 0) {
          c.strokeStyle = color(hue + 45, 90, 69, .55);
          c.lineWidth = .7 + (1-z) * 1.4;
          c.beginPath(); c.moveTo(mesh[ring][sector].x, mesh[ring][sector].y);
          c.lineTo(mesh[ring][sector+1].x, mesh[ring][sector+1].y); c.stroke();
        }
      }
    }
    // Helical seams change handedness and apparent depth as polarisation rolls.
    c.save(); c.globalCompositeOperation = pale ? "multiply" : "screen";
    for (let strand = 0; strand < 8; strand++) {
      c.beginPath();
      for (let i = 0; i <= 65; i++) {
        const z = .04 + i / 65;
        const a = strand / 8 * TAU + Math.sin(z * 6 - time * .35) * .45;
        const p = surface(z, a, mode);
        if (i) c.lineTo(p.x, p.y); else c.moveTo(p.x, p.y);
      }
      c.strokeStyle = color(mode.hue + strand * 44 + time * 7, 80, pale ? 38 : 78, .18 + treble * .2);
      c.lineWidth = strand % 2 ? 1.2 : 3;
      c.stroke();
    }
    for (let i = 0; i < 85; i++) {
      const z = .03 + ((noise(i) - time * .075) % 1 + 1) % 1;
      const a = noise(i+100) * TAU + time * .06;
      const p = surface(z, a, mode), tail = surface(z+.012+treble*.008, a, mode);
      c.strokeStyle = color(mode.hue + i * 13, 90, pale ? 27 : 88, .15 + (1-z)*.55);
      c.lineWidth = .5 + (1-z) * 1.6;
      c.beginPath(); c.moveTo(tail.x, tail.y); c.lineTo(p.x, p.y); c.stroke();
    }
    c.restore();
    const vignette = c.createRadialGradient(500, 300, 190, 500, 300, 690);
    vignette.addColorStop(0, "#00000000");
    vignette.addColorStop(1, pale ? "#4f316b33" : "#01000c99");
    c.fillStyle = vignette; c.fillRect(0, 0, 1000, 600);
    c.restore();
    return { time, form, bass, mid, treble, beat, polarisation: time * .43 };
  }
  return { recipes, draw, reset };
})();
