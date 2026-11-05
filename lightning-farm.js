/* A pastoral Lightning alchemy; all coordinates are in a 1000 x 600 field. */
window.LightningFarm = (() => {
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  let state;
  function reset() { state = null; }
  function line(c, points, color, width = 3) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  }
  function oval(c, x, y, rx, ry, color) {
    c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
  }
  function initialise(now) {
    state = {
      last: now, time: 0, next: 2, strikes: 0, turn: Math.floor(Math.random() * 5), whistle: 0,
      man: { kind: "shepherd", x: 195, y: 465, shock: 0 },
      tree: { kind: "tree", x: 840, y: 360, shock: 0, hits: 0 },
      tractor: { kind: "tractor", x: 50, y: 365, shock: 0, running: false, cooldown: 0 },
      sheep: Array.from({ length: 9 }, (_, i) => ({
        kind: "sheep", x: 440 + (i % 3) * 53, y: 410 + Math.floor(i / 3) * 35,
        vx: 0, vy: 0, face: 1, shock: 0, panic: 0, phase: i * 1.7,
      })),
      dogs: [0, 1].map(i => ({ kind: "dog", x: 350 + i * 330, y: 470, vx: 0, vy: 0, face: i ? -1 : 1, shock: 0, phase: i * Math.PI })),
    };
  }
  function skeleton(c, actor, human, t) {
    const gas = ["#ff7247", "#e8a1ff", "#77f4ff", "#ff64c5"][Math.floor(t * 7) % 4];
    c.shadowColor = gas; c.shadowBlur = 16;
    if (human) {
      oval(c, 0, -74, 10, 12, gas);
      oval(c, -4, -77, 2.5, 3, "#152238"); oval(c, 4, -77, 2.5, 3, "#152238");
      line(c, [[0, -62], [0, -27], [-12, -5]], gas, 3);
      line(c, [[0, -27], [14, -4]], gas, 3);
      line(c, [[-22, -59], [0, -52], [25, -66]], gas, 3);
      for (let i = 0; i < 4; i++) line(c, [[-10, -53 + i * 6], [0, -49 + i * 6], [10, -53 + i * 6]], gas, 2);
      line(c, [[-8, -29], [8, -29]], gas, 4);
    } else {
      line(c, [[-24, -23], [-12, -30], [14, -29], [29, -35]], gas, 3);
      for (let i = 0; i < 4; i++) {
        const x = -15 + i * 9;
        line(c, [[x, -29], [x - 3, -20], [x + 1, -15]], gas, 2);
      }
      for (const x of [-18, 15]) {
        line(c, [[x, -23], [x - 4, -10], [x + 3, 0]], gas, 3);
        line(c, [[x + 7, -23], [x + 11, -9], [x + 7, 0]], gas, 2);
      }
      oval(c, 30, -35, 10, 8, gas); oval(c, 33, -38, 3, 3, "#152238");
    }
    c.shadowBlur = 0;
  }
  function animal(c, a, t, bass) {
    const dog = a.kind === "dog", speed = Math.hypot(a.vx, a.vy);
    const stride = Math.sin(t * (dog ? 16 : 12) + a.phase) * Math.min(9, speed * .14);
    c.save(); c.translate(a.x, a.y);
    oval(c, 0, 3, dog ? 30 : 33, 5, "#0c1e2466");
    c.scale(a.face, 1);
    if (a.shock > 0) {
      oval(c, 0, -22, 33, 20, "#13222b");
      skeleton(c, a, false, t);
      c.restore(); return;
    }
    const coat = dog ? "#19242b" : "#d6d0b8";
    for (const x of [-18, 18]) {
      line(c, [[x, -20], [x + stride, -9], [x - stride, 0]], dog ? "#e7e4d0" : "#343d3c", 5);
      line(c, [[x + 5, -20], [x - stride, -9], [x + stride, 0]], coat, 4);
    }
    oval(c, 0, -25 - Math.abs(stride) * .15, dog ? 29 : 33, dog ? 13 : 21, coat);
    if (!dog) for (let j = 0; j < 7; j++) oval(c, -23 + j * 8, -38 + Math.sin(j * 2) * 4, 11, 10, "#e8e1c9");
    else oval(c, 17, -27, 10, 12, "#eee7d4");
    oval(c, 30, -29, dog ? 15 : 11, dog ? 10 : 13, dog ? "#252d32" : "#41423e");
    oval(c, 34, -32, 2, 2, "#fff8da");
    line(c, [[24, -35], [18, -45], [29, -38]], coat, 6);
    line(c, [[-23, -25], [-38, -34 - Math.sin(t * 8 + a.phase) * 8]], coat, 7);
    if (dog && speed < 12) {
      c.fillStyle = "#ee9e9d"; c.fillRect(37, -25, 6, 5 + bass * 3);
    }
    c.restore();
  }
  function shepherd(c, a, t, whistle) {
    c.save(); c.translate(a.x, a.y);
    oval(c, 0, 3, 25, 6, "#0b202666");
    if (a.shock > 0) { skeleton(c, a, true, t); c.restore(); return; }
    line(c, [[-6, -32], [-11, -4], [-20, -3]], "#202c35", 8);
    line(c, [[7, -32], [13, -4], [22, -3]], "#202c35", 8);
    c.fillStyle = "#747b46"; c.fillRect(-16, -62, 32, 36);
    line(c, [[-14, -57], [-27, -43], [-27, -70]], "#89905a", 8);
    line(c, [[-27, -77], [-27, 0]], "#b0a27c", 3);
    line(c, [[13, -56], [25, -47], [whistle ? 12 : 28, whistle ? -73 : -33]], "#89905a", 8);
    oval(c, 0, -76, 12, 15, "#e5b68d");
    oval(c, 0, -89, 18, 5, "#353d34"); oval(c, -3, -93, 12, 8, "#4e5748");
    oval(c, 6, -80, 1.7, 1.8, "#17252a");
    if (whistle) {
      c.font = "bold 19px Georgia"; c.fillStyle = "#f4e6a1";
      const age = (t % 6.5) / 1.8;
      c.fillText("FWEE-EEP!", 29 + age * 15, -91 - age * 12);
      line(c, [[20, -76], [32, -81]], "#fff0b0", 2);
      line(c, [[22, -71], [35, -70]], "#fff0b0", 2);
    }
    c.restore();
  }
  function tractor(c, a, t) {
    c.save(); c.translate(a.x, a.y);
    const bump = a.running ? Math.sin(t * 22) * 1.4 : 0;
    c.translate(0, bump);
    for (const [x, r] of [[0, 28], [85, 19]]) {
      oval(c, x, -r, r, r, "#131e24"); oval(c, x, -r, r * .48, r * .48, "#cba566");
      for (let j = 0; j < 8; j++) {
        const angle = j * TAU / 8 + (a.running ? t * 6 : 0);
        line(c, [[x + Math.cos(angle) * r * .6, -r + Math.sin(angle) * r * .6], [x + Math.cos(angle) * r * .86, -r + Math.sin(angle) * r * .86]], "#526169", 3);
      }
    }
    c.fillStyle = "#a63b38"; c.fillRect(12, -70, 78, 39);
    c.fillStyle = "#df7360"; c.fillRect(15, -72, 77, 8);
    c.fillStyle = "#47676e"; c.fillRect(-12, -97, 40, 43);
    c.fillStyle = "#abc6bd"; c.fillRect(-7, -92, 28, 28);
    c.fillStyle = "#24373c"; c.fillRect(-22, -102, 60, 8); c.fillRect(68, -100, 7, 30);
    if (a.running) {
      for (let i = 0; i < 5; i++) {
        const p = (t * .7 + i * .2) % 1;
        oval(c, 72 - p * 60, -104 - p * 45, 5 + p * 10, 5 + p * 7, `rgba(166,175,166,${(1-p)*.5})`);
      }
      c.fillStyle = "#fff0a0"; c.fillRect(89, -61, 5, 9);
    }
    if (a.shock > 0) {
      line(c, [[-22, -107], [5, -119], [32, -108], [51, -121], [76, -100]], "#87edff", 4);
      c.fillStyle = "#fff2a0"; c.font = "bold 20px Georgia"; c.fillText("BRR-RUM!", -4, -135);
    }
    c.restore();
  }
  function draw(c, width, height, now, opts = {}) {
    if (!state) initialise(now);
    const s = state, dt = clamp((now - s.last) / 1000, 0, .08);
    s.last = now; s.time += dt;
    const t = s.time, bass = opts.bass || 0, mid = opts.mid || 0;
    s.whistle = t % 6.5 < 1.8;
    const centre = { x: 510 + Math.sin(t * .13) * 90, y: 460 + Math.sin(t * .18) * 22 };
    s.dogs.forEach((a, i) => {
      const pause = Math.sin(t * .7 + i * 3) > .86;
      const angle = t * (.62 + mid * .15) + a.phase;
      const target = { x: centre.x + Math.cos(angle) * (175 + Math.sin(t * .4) * 30), y: centre.y + Math.sin(angle) * 74 };
      a.vx = pause ? 0 : clamp((target.x - a.x) * 2, -115, 115);
      a.vy = pause ? 0 : clamp((target.y - a.y) * 2, -80, 80);
      a.x += a.vx * dt; a.y += a.vy * dt;
      if (Math.abs(a.vx) > 2) a.face = Math.sign(a.vx);
    });
    s.sheep.forEach((a, i) => {
      a.panic = Math.max(0, a.panic - dt * .2);
      const targetX = centre.x + Math.sin(i * 2.4) * 73 + Math.sin(t * .65 + a.phase) * 15;
      const targetY = centre.y + Math.cos(i * 2.4) * 35;
      let vx = (targetX - a.x) * .7, vy = (targetY - a.y) * .7;
      for (const dog of s.dogs) {
        const dx = a.x - dog.x, dy = a.y - dog.y, d = Math.hypot(dx, dy);
        if (d < 110) { vx += dx / Math.max(d, 1) * (110 - d); vy += dy / Math.max(d, 1) * (110 - d) * .6; }
      }
      for (const other of s.sheep) {
        if (other === a) continue;
        const dx = a.x - other.x, dy = a.y - other.y, d = Math.hypot(dx, dy);
        if (d < 48) { vx += dx / Math.max(d, 1) * (48 - d); vy += dy / Math.max(d, 1) * (48 - d); }
      }
      vx += Math.sin(t * 4 + i) * a.panic * 55;
      a.vx += (vx - a.vx) * Math.min(1, dt * 3);
      a.vy += (vy - a.vy) * Math.min(1, dt * 3);
      a.x = clamp(a.x + a.vx * dt, 310, 755); a.y = clamp(a.y + a.vy * dt, 405, 540);
      if (Math.abs(a.vx) > 3) a.face = Math.sign(a.vx);
    });
    const tr = s.tractor;
    if (tr.running) {
      tr.x += dt * (88 + bass * 20);
      if (tr.x > 1100) { tr.running = false; tr.cooldown = 8; }
    } else if (tr.cooldown > 0) {
      tr.cooldown -= dt;
      if (tr.cooldown <= 0) tr.x = 50;
    }
    const actors = [s.man, s.tree, tr, ...s.sheep, ...s.dogs];
    actors.forEach(a => { a.shock = Math.max(0, a.shock - dt); });
    if (t >= s.next) {
      // Rotate target classes so the smaller actors also get their moment.
      const groups = [[s.man], s.sheep, s.dogs, tr.cooldown <= 0 && !tr.running ? [tr] : [s.tree], [s.tree]];
      const group = groups[s.turn++ % groups.length];
      const a = group[Math.floor(Math.random() * group.length)];
      a.shock = 1.35;
      if (a.kind === "tractor") tr.running = true;
      if (a.kind === "tree") a.hits++;
      s.sheep.forEach(sheep => { sheep.panic = 1; });
      s.strikes++;
      opts.strike?.({
        x: (a.x + (a.kind === "tractor" ? 20 : 0)) * width / 1000,
        y: (a.y - (a.kind === "shepherd" ? 94 : a.kind === "tree" ? 180 : a.kind === "tractor" ? 102 : 44)) * height / 600,
      });
      s.next = t + 3.8 + Math.random() * 2 - Math.min(.8, bass);
    }
    c.save(); c.scale(width / 1000, height / 600);
    c.fillStyle = "#3a5146"; c.beginPath(); c.moveTo(0, 345); c.quadraticCurveTo(350, 260, 1000, 345); c.lineTo(1000, 600); c.lineTo(0, 600); c.fill();
    c.fillStyle = "#4e6950"; c.beginPath(); c.moveTo(0, 440); c.quadraticCurveTo(470, 332, 1000, 405); c.lineTo(1000, 600); c.lineTo(0, 600); c.fill();
    line(c, [[0, 374], [1000, 374]], "#8f9c7a", 2);
    for (let x = 0; x < 1000; x += 65) line(c, [[x, 360], [x, 392]], "#6b7057", 5);
    // A pollarded willow, deliberately unlike the churchyard's spreading tree.
    c.save(); c.translate(s.tree.x, s.tree.y);
    line(c, [[0, 0], [-5, -85], [4, -150]], s.tree.hits ? "#302c31" : "#6e6550", 20);
    for (let i = 0; i < 13; i++) {
      const x = (i - 6) * 15;
      line(c, [[0, -115], [x * .5, -178], [x, -163], [x + Math.sin(t * .9 + i) * 9, -55 - Math.sin(i) * 20]], s.tree.shock ? "#f3abff" : "#849660", 3);
      for (let j = 0; j < 5; j++) oval(c, x + Math.sin(t * .9 + i) * j, -145 + j * 19, 4, 9, s.tree.hits ? "#998a51" : "#adad65");
    }
    c.restore();
    const layers = [s.man, ...s.sheep, ...s.dogs, tr].sort((a, b) => a.y - b.y);
    for (const a of layers) {
      if (a.kind === "shepherd") shepherd(c, a, t, s.whistle);
      else if (a.kind === "tractor") tractor(c, a, t);
      else animal(c, a, t, bass);
    }
    c.restore();
    return { strikes: s.strikes, running: tr.running, tractorX: tr.x, shocks: actors.filter(a => a.shock > 0).map(a => a.kind), dogs: s.dogs.map(a => ({ x: a.x, y: a.y })) };
  }
  return { draw, reset };
})();
