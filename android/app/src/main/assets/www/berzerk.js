window.Berzerk = (() => {
  const forms = [['vector', 'Vector Lockdown'], ['lounge', 'Marvin: Existential Crisis'], ['amber', 'Robby: Forbidden Circuit'], ['terminator', 'Terminator: Chrome Patrol']];
  const palettes = [['#050911', '#446fff', '#89ffbc', '#ff665c', '#ff8fd4'], ['#180717', '#ae539a', '#ffe4a0', '#ff654c', '#ff9eee'], ['#140e04', '#ab731f', '#ffe498', '#ff5739', '#f7a7ff'], ['#0b1118', '#526a82', '#9effdd', '#ff494e', '#ffa49d']];
  const recipes = forms.map(([, name], form) => ({ name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6 }));
  const rooms = [
    ['###########', '#....#....#', '#.##.#.##.#', '#.........>', '#.##.#.##.#', '#....#....#', '###########'],
    ['###########', '#.........#', '#.#.###.#.#', '#.#.......>', '#.#.###.#.#', '#.........#', '###########'],
    ['###########', '#...#.....#', '#.#.#.###.#', '#.#.......>', '#.#.###.#.#', '#.........#', '###########'],
    ['###########', '#.....#...#', '#.###.#.#.#', '#.........>', '#.#.#.###.#', '#...#.....#', '###########'],
  ];
  const dirs = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const actor = (x, y) => ({ x, y, px: x, py: y });
  const rendezvousTicks = 30;
  const aimTicks = 7;
  const burstTicks = 9;
  const rewardTicks = 20;
  let state, last, accumulator, manual, engage, fireQueued, keys, columns, rows, cast;

  function room(number, score = 0) {
    const template = rooms[(cast + number) % rooms.length];
    const map = Array.from({ length: rows }, (_, y) => {
      if (y === 0 || y === rows - 1) return '#'.repeat(columns);
      const left = y < 6 ? template[y].slice(0, -1)
        : '#' + (y % 2 ? '.........' : '.##.##.#.');
      const extension = Array.from({ length: columns - 11 }, (_, i) => {
        const phase = i + number;
        const walls = [
          y === 3 ? i % 6 === 3 : y % 2 && phase % 4 === 1,
          y === 3 ? phase % 7 === 2 : y % 4 === 1 && phase % 7 < 3,
          y === 3 ? phase % 8 === 4 : y % 3 === 2 && y !== 2 && phase % 8 < 5,
          y === 3 ? phase % 5 === 2 : y % 2 === 0 && y !== 2 && phase % 5 > 1,
        ];
        return walls[cast] && !(y === 3 && i === columns - 12) ? '#' : '.';
      }).join('');
      return left + extension + (y === 3 ? '>' : '#');
    });
    return { number, score, map, exit: { x: columns - 1, y: 3 }, player: actor(1, 3), partner: actor(1, 1),
      bots: [actor(7, 1), actor(9, 3), actor(7, 5)], shots: [], sparks: [],
      face: [1, 0], tick: 0, lock: 0, shield: 0, fire: 0, lost: 0, reward: 0, used: false };
  }
  function reset() {
    columns = 11;
    rows = 7;
    cast = 0;
    state = room(0);
    last = null;
    accumulator = 0;
    manual = engage = fireQueued = false;
    keys = new Set();
  }
  reset();
  const open = (x, y) => !!state.map[y]?.[x] && state.map[y][x] !== '#';
  function route(from, to) {
    const queue = [{ ...from, first: null }], seen = new Set([from.y * columns + from.x]);
    for (const { x, y, first } of queue) {
      if (x === to.x && y === to.y) return first;
      for (const d of Object.values(dirs)) {
        const nx = x + d[0], ny = y + d[1], id = ny * columns + nx;
        if (!open(nx, ny) || seen.has(id)) continue;
        seen.add(id);
        queue.push({ x: nx, y: ny, first: first || d });
      }
    }
    return null;
  }
  function move(a, d) {
    if (d && open(a.x + d[0], a.y + d[1])) {
      a.x += d[0];
      a.y += d[1];
    }
  }
  function shoot(a, d, hostile) {
    state.shots.push({ ...actor(a.x, a.y), d, hostile });
  }
  function hit() {
    if (state.lost) return;
    state.sparks.push({ x: state.player.x, y: state.player.y, life: burstTicks });
    if (state.shield > 0) { state.shield = 0; return; }
    state.lost = burstTicks + 3;
    state.lock = 0;
    state.reward = 0;
    fireQueued = false;
  }
  function update() {
    const s = state, p = s.player;
    s.tick++;
    s.sparks = s.sparks.filter(spark => --spark.life > 0);
    s.reward = Math.max(0, s.reward - 1);
    if (s.lost) {
      if (!--s.lost) state = room(s.number, s.score);
      return;
    }
    for (const a of [p, ...s.bots, ...s.shots]) { a.px = a.x; a.py = a.y; }
    s.fire = Math.max(0, s.fire - 1);
    s.shield = Math.max(0, s.shield - 1);
    const near = distance(p, s.partner) <= 1;
    const locked = s.lock > 0;
    if (!s.used && near && !locked && (engage || !manual)) {
      s.lock = rendezvousTicks;
      s.used = true;
      fireQueued = false;
    } else if (!locked) {
      const target = !s.used ? s.partner : s.exit;
      const d = manual ? dirs[[...keys].reverse().find(k => dirs[k])] : s.tick % 4 === 0 ? route(p, target) : null;
      if (d) { s.face = d; move(p, d); }
      const targetBot = !manual && s.bots.find(bot => bot.x === p.x || bot.y === p.y);
      if (!s.fire && (fireQueued || keys.has('Space') || targetBot)) {
        if (targetBot && distance(p, targetBot)) s.face = [Math.sign(targetBot.x - p.x), Math.sign(targetBot.y - p.y)];
        shoot(p, s.face, false);
        s.fire = 3;
        fireQueued = false;
      }
      if (!distance(p, s.exit)) { state = room(s.number + 1, s.score + 100); return; }
    }
    engage = false;
    const opening = s.number === 0;
    const pursuitTick = s.tick - (opening ? 32 : 12);
    for (const [i, bot] of s.bots.entries()) {
      if (pursuitTick < 0) continue;
      if (bot.aim) {
        if (!--bot.windup) {
          shoot(bot, bot.aim, true);
          bot.aim = null;
        }
      } else if (pursuitTick > 0 && (pursuitTick + i * 8) % (opening ? 48 : 34) === 0
        && (bot.x === p.x || bot.y === p.y) && distance(bot, p)) {
        bot.aim = [Math.sign(p.x - bot.x), Math.sign(p.y - bot.y)];
        bot.windup = aimTicks;
      } else if ((pursuitTick + i * 3) % (opening ? 16 : 11) === 0) {
        move(bot, route(bot, p));
      }
      if (!distance(bot, p)) {
        if (s.shield) s.bots = s.bots.filter(a => a !== bot);
        hit();
      }
    }
    s.shots = s.shots.filter(shot => {
      const x = shot.x + shot.d[0], y = shot.y + shot.d[1];
      if (!open(x, y)) return false;
      move(shot, shot.d);
      if (shot.hostile && !distance(shot, p)) { hit(); return false; }
      const bot = !shot.hostile && s.bots.find(a => !distance(shot, a));
      if (!bot) return true;
      s.bots = s.bots.filter(a => a !== bot);
      s.sparks.push({ x, y, life: burstTicks });
      s.score += 50;
      return false;
    });
    if (locked && !s.lost && !--s.lock) {
      s.shield = 42;
      s.score += 150;
      s.reward = rewardTicks;
    }
  }
  function key(code, down, repeat = false) {
    if (code === 'KeyB') {
      if (down && !repeat) { manual = !manual; clearKeys(); }
      return true;
    }
    if (!manual || (!dirs[code] && code !== 'Space' && code !== 'KeyE')) return false;
    if (code === 'KeyE') { if (down && !repeat) engage = true; }
    else if (down) {
      keys.add(code);
      if (code === 'Space' && !repeat && !state.lock && !state.lost) fireQueued = true;
    }
    else keys.delete(code);
    return true;
  }
  function clearKeys() { keys.clear(); engage = fireQueued = false; }

  function draw(c, w, h, now, options = {}) {
    const { form, bass = 0, mid = 0, treble = 0, speed = 1, animate = true, desktop = false } = options;
    const aspect = w / Math.max(1, h);
    const nextColumns = Math.max(11, Math.min(35, Math.round(7 * aspect)));
    const nextRows = Math.max(7, Math.min(27, Math.round(11 / Math.max(.1, aspect))));
    const nextCast = Math.max(0, forms.findIndex(([id]) => id === form));
    if (columns !== nextColumns || rows !== nextRows || cast !== nextCast) {
      columns = nextColumns;
      rows = nextRows;
      cast = nextCast;
      state = room(state.number, state.score);
      clearKeys();
    }
    const step = .13;
    if (animate && last !== null) {
      accumulator += Math.max(0, Math.min(.1, (now - last) / 1000)) * speed;
      while (accumulator >= step) { update(); accumulator -= step; }
    }
    last = animate ? now : null;
    const s = state, blend = accumulator / step;
    const [bg, wall, hero, danger, pink] = palettes[cast];
    c.save();
    c.fillStyle = bg;
    c.fillRect(0, 0, w, h);
    c.scale(w / columns, h / rows);
    function block(color, x, y, ww, hh) {
      c.fillStyle = color;
      c.fillRect(x, y, ww, hh);
    }
    function line(color, size, x, y, xx, yy) {
      c.strokeStyle = color; c.lineWidth = size;
      c.beginPath(); c.moveTo(x, y); c.lineTo(xx, yy); c.stroke();
    }
    function label(words, x, y, size, color, align = 'center') {
      c.font = 'bold ' + size + 'px monospace'; c.fillStyle = color; c.textAlign = align;
      c.fillText(words, x, y);
    }
    function oval(color, x, y, rx, ry) {
      c.fillStyle = color;
      c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill();
    }
    function characterBot(x, y, color, kind, beat, gait, glance) {
      const friendly = kind === 'partner';
      const accent = friendly ? pink : danger;
      if (cast === 1) {
        // Big head and low shoulders; even the hostile cast looks put upon.
        const slump = Math.sin(beat * .17 + x) * .025;
        oval(color, x, y - .16 + slump, .235, .19);
        oval('#fff7e4', x - .065, y - .25 + slump, .12, .048);
        for (const side of [-1, 1]) {
          block(bg, x + side * .082 + glance - .052, y - .18 + slump, .104, .04);
          line(color, .065, x + side * .12, y + .045, x + side * .22, y + .25);
          line(color, .07, x + side * .069, y + .15, x + side * (.1 + gait), y + .31);
        }
        block(color, x - .13, y + .014, .26, .16);
        label(friendly ? '\u2665' : '...', x, y + .13, .14, bg);
      } else if (cast === 2) {
        oval(color, x, y - .155, .18, .23);
        oval(bg, x, y - .17, .135, .174);
        for (let i = -1; i <= 1; i++) {
          const glow = .019 + .014 * (1 + Math.sin(beat * .5 + i * 2)) + treble * .02;
          line(color, .022, x + i * .065, y - .27, x + i * .065, y - .115);
          oval(accent, x + i * .065, y - .234, glow, glow * .75);
        }
        for (const side of [-1, 1]) {
          oval(color, x + side * .195, y - .16, .055, .06);
          for (let i = 0; i < 4; i++) {
            oval(color, x + side * (.16 + i * .043), y + .026 + i * (.034 + gait * .25), .058, .043);
          }
          oval(color, x + side * .1, y + .26 + side * gait, .09, .075);
        }
        oval(color, x, y + .093, .177, .127);
        block(bg, x - .08, y + .045, .16, .075);
        block(accent, x - .057, y + .067, .114 * (.4 + bass * .6), .031);
      } else {
        const steel = '#bdcfdb', darkSteel = '#617887';
        block(darkSteel, x - .155, y - .33, .31, .197);
        block(steel, x - .125, y - .35, .25, .127);
        block(bg, x - .13, y - .252, .26, .058);
        for (const side of [-1, 1]) {
          block(friendly ? pink : '#ff3038', x + side * .064 + glance - .027, y - .243, .054, .031);
          block(steel, x + side * .22 - .055, y - .067, .11, .12);
          line(darkSteel, .105, x + side * .23, y + .02, x + side * .29, y + .19);
          line(steel, .068, x + side * .1, y + .13, x + side * (.14 + gait), y + .31);
        }
        block(steel, x - .088, y - .184, .176, .055);
        block(darkSteel, x - .145, y - .085, .29, .23);
        for (let i = 0; i < 3; i++) block(steel, x - .112, y - .062 + i * .047, .224, .022);
        block(accent, x - .034, y + .1, .068, .035);
      }
    }
    for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
      if (s.map[y][x] !== '#') {
        if (cast) block(wall + '24', x + .47, y + .47, .06, .06);
        continue;
      }
      function trace(color, width) {
        if (s.map[y][x + 1] === '#') line(color, width, x + .5, y + .5, x + 1.5, y + .5);
        if (s.map[y + 1]?.[x] === '#') line(color, width, x + .5, y + .5, x + .5, y + 1.5);
        block(color, x + .5 - width / 2, y + .5 - width / 2, width, width);
      }
      if (cast === 0) {
        trace('#4166ff', .10);
        trace('#9dbbff', .026);
      } else if (cast === 1) {
        const phase = (s.tick + blend) * .13 - x * .52 + y * .83;
        const pulse = (.5 + .5 * Math.sin(phase)) * (.48 + .52 * bass);
        const hue = (phase * 45 + mid * 100) % 360;
        trace(`hsla(${hue}, 90%, 45%, .32)`, .34 + pulse * .53);
        trace(`hsl(${hue + 36}, 92%, ${48 + 27 * pulse}%)`, .085 + pulse * .29);
        oval(`hsla(${hue + 70}, 95%, 74%, .65)`, x + .5, y + .5, .06 + pulse * .18, .06 + pulse * .18);
      } else if (cast === 2) {
        trace('#653518', .23);
        oval('#5c3316', x + .5, y + .5, .35, .32);
        oval('#bb7532', x + .5, y + .5, .26, .22);
        oval('#ffcf80', x + .43, y + .43, .065 + treble * .09, .044);
      } else {
        block('#293948', x + .045, y + .14, .91, .72);
        block('#71899a', x + .08, y + .18, .84, .045);
        block('#111820', x + .17, y + .62, .66, .13);
        block(danger, x + .21, y + .65, .12 + bass * .22, .043);
      }
    }
    label('>', s.exit.x + .5, s.exit.y + .66, .48 + bass * .08, hero);
    function sprite(a, color, kind) {
      const x = a.px + (a.x - a.px) * blend + .5, y = a.py + (a.y - a.py) * blend + .5;
      const beat = s.tick + blend;
      const noticing = distance(s.player, s.partner) <= 3;
      const gait = (a.x !== a.px || a.y !== a.py) ? Math.sin((s.tick + blend) * Math.PI) * .10 : 0;
      const nod = kind === 'partner' && noticing ? Math.sin(beat * .29) * .035 : 0;
      const glance = kind === 'hero' && s.lock ? Math.sign(s.partner.x - a.x) * .035
        : kind !== 'hero' ? Math.sign(s.player.x - a.x) * .035 : s.face[0] * .035;
      const blink = (beat + a.x * 3) % 25 < 1.4;
      if (cast && kind !== 'hero') {
        characterBot(x, y + nod, kind === 'bot' ? '#e1c8ac' : color, kind, beat, gait, glance);
      } else {
        block(color, x - .14, y - .29 + nod, .28, .17);
        for (const side of [-1, 1]) {
          block(bg, x + side * .055 + glance - .021, y - .241 + nod, .042, blink ? .014 : .052);
        }
        if (kind === 'partner' && noticing) {
          line(bg, .018, x - .035, y - .167 + nod, x, y - .15 + nod);
          line(bg, .018, x, y - .15 + nod, x + .035, y - .167 + nod);
        }
        block(color, x - .21, y - .09, .42, .22);
        line(color, .07, x - .1, y + .11, x - .17 - gait, y + .29);
        line(color, .07, x + .1, y + .11, x + .17 + gait, y + .29);
      }
      if (kind === 'bot') {
        if (!cast) {
          line(color, .06, x - .2, y, x - .32, y + .13);
          line(color, .06, x + .2, y, x + .32, y + .13);
        }
        if (a.aim) {
          const reach = .45 + .28 * (1 - (a.windup - blend) / aimTicks);
          line('#ffe093', .045, x, y, x + a.aim[0] * reach, y + a.aim[1] * reach);
          label('!', x, y - .36, .24, '#ffe093');
        }
      } else if (kind === 'partner') {
        const wave = noticing ? Math.sin(beat * .57) * .09 : 0;
        line(pink, .055, x + .16, y, x + .31, y - .2 + wave);
        label('\u2665', x, y - .44 - (s.lock ? (1 - s.lock / rendezvousTicks) * .22 : 0), .24 + mid * .12, pink);
      } else {
        line(color, .07, x, y, x + s.face[0] * .34, y + s.face[1] * .34);
      }
      return [x, y];
    }
    if (!s.used || s.lock) sprite(s.partner, pink, 'partner');
    s.bots.forEach(bot => sprite(bot, danger, 'bot'));
    for (const a of s.shots) {
      const x = a.px + (a.x - a.px) * blend + .5, y = a.py + (a.y - a.py) * blend + .5;
      line(a.hostile ? danger : hero, .08 + treble * .12, x, y, x - a.d[0] * .42, y - a.d[1] * .42);
    }
    if (!s.lost || s.lost % 2) {
      const [x, y] = sprite(s.player, s.lost ? danger : hero, 'hero');
      if (s.lock || s.shield) {
        c.strokeStyle = s.lock ? pink : hero; c.lineWidth = .04 + bass * .07;
        c.beginPath(); c.arc(x, y, .4 + mid * .09, 0, 2 * Math.PI * (s.lock ? s.lock / rendezvousTicks : 1)); c.stroke();
      }
    }
    const pixels = [.0625, '#fff4c0', '#ffbf47', danger, wall];
    const pixel = pixels[0];
    for (const spark of s.sparks) {
      const age = burstTicks - spark.life + blend;
      const snap = value => Math.round(value / pixel) * pixel;
      const x = spark.x + .5, y = spark.y + .5;
      if (age < 3) {
        const span = snap(.35 + age * .17);
        block(pixels[2], x - span, y - pixel, span * 2, pixel * 2);
        block(pixels[2], x - pixel, y - span, pixel * 2, span * 2);
        block(pixels[1], x - .125, y - .125, .25, .25);
      }
      for (let i = 0; i < 32; i++) {
        const a = i * Math.PI / 16;
        const reach = (.22 + age * (.065 + (i % 5) * .018)) * (1 + bass * .16);
        const size = pixel * (age < 4 && i % 3 ? 2 : 1);
        block(pixels[1 + ((i + Math.floor(age / 2)) % 4)],
          x + snap(Math.cos(a) * reach), y + snap(Math.sin(a) * reach + age * age * .006), size, size);
      }
    }
    if (s.reward) {
      const age = rewardTicks - s.reward + blend;
      const x = s.player.x + .5, y = s.player.y - .18 - age * .026;
      label('1-UP', x + .035, y + .035, .34, bg);
      label('1-UP', x, y, .34, Math.floor(age / 3) % 2 ? pink : '#fff4c0');
    }
    label('BERZERK', columns / 2, .66, .37, hero);
    label('SECTOR ' + (s.number + 1) + '   ' + String(s.score).padStart(5, '0'), columns - .25, .66, .31, hero, 'right');
    const patrol = ['EXTERMINATORS ACTIVE', 'MARVIN: OH, NOT AGAIN', 'ROBBY: PATROL PROTOCOL', 'TERMINATOR: TARGET ACQUIRED'];
    const status = s.lost ? 'SIGNAL LOST' : s.lock ? 'RENDEZVOUS / OFFLINE ' + (s.lock * step).toFixed(1) + 's'
      : s.shield ? 'SHIELD ONLINE' : !s.used && distance(s.player, s.partner) <= 1 ? 'RENDEZVOUS AVAILABLE' : patrol[cast];
    label(status, columns / 2, rows - .3, .32, s.lock ? pink : s.lost ? danger : hero);
    if (desktop) {
      c.globalAlpha = .62;
      label('B ' + (manual ? 'AUTO' : 'TAKE CONTROL'), .24, .27, .21, '#fff4dd', 'left');
      label('ARROWS MOVE / SPACE FIRE / E ENGAGE', .24, .78, .19, '#fff4dd', 'left');
    }
    c.restore();
    return { manual, sector: s.number + 1, score: s.score, lock: s.lock, shield: s.shield, lost: s.lost,
      position: [s.player.x, s.player.y], bots: s.bots.map(a => [a.x, a.y]), shots: s.shots.length,
      aiming: s.bots.filter(bot => bot.aim).length, bursts: s.sparks.length, reward: s.reward, columns, rows };
  }
  return { forms, recipes, reset, draw, key, clearKeys };
})();
