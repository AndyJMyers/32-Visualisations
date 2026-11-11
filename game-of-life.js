/* Conway's rules drive occupancy; the cast and soundtrack are presentation. */
window.GameOfLife = (() => {
  const cols = 16, rows = 10;
  const forms = [['muster', 'The Last Muster'], ['moon', 'Moonlit Necropolis'], ['ember', 'Ember Court']];
  const recipes = forms.map(([, name], form) => ({name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6}));
  const palettes = [
    ['#101922','#253240','#d9b875','#8ed1b7','#baa4ea'],
    ['#111126','#272844','#a4b7ed','#9ed7dd','#d8a3ed'],
    ['#25141b','#402833','#f5ae68','#b9d498','#f2a8bd'],
  ];
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const hash = n => { const x = Math.sin(n * 71.3 + 6) * 43758.54; return x - Math.floor(x); };
  function next(board, width, height) {
    const result = new Uint8Array(board.length);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!(dx || dy) || x + dx < 0 || y + dy < 0 || x + dx >= width || y + dy >= height) continue;
        n += board[(y + dy) * width + x + dx];
      }
      const i = y * width + x;
      result[i] = Number(n === 3 || (n === 2 && board[i]));
    }
    return result;
  }
  let board, roles, born, dead, form, history, generation, round, cycle, time, last, lastStep, envelope, previous, pulse, cue;
  function reset() { board = null; last = null; }
  function seed() {
    board = new Uint8Array(cols * rows);
    roles = new Uint8Array(board.length);
    born = new Float64Array(board.length).fill(-10);
    dead = new Float64Array(board.length).fill(-10);
    const variant = (form + round - 1) % 3;
    const patterns = [
      [[1,0],[2,1],[0,2],[1,2],[2,2]],
      [[1,0],[3,1],[0,2],[1,2],[4,2],[5,2],[6,2]],
      [[1,0],[2,0],[0,1],[1,1],[1,2]],
    ];
    for (const [ox,oy,k] of [[2,2,variant],[8,5,(variant+1)%3],[9,1,(variant+2)%3],[3,6,(variant+2)%3]]) {
      for (const [x,y] of patterns[k]) {
        const i = (oy+y)*cols+ox+x;
        board[i] = 1; roles[i] = Math.floor(hash(i+round)*3); born[i] = time;
      }
    }
    history = [board.join('')]; cycle = 0;
  }
  function advance() {
    if (cycle >= 6 || !board.some(Boolean)) { round++; seed(); return; }
    const future = next(board, cols, rows);
    generation++;
    for (let i = 0; i < board.length; i++) {
      if (future[i] && !board[i]) { born[i] = time; roles[i] = Math.floor(hash(i+generation*19)*3); }
      if (!future[i] && board[i]) dead[i] = time;
    }
    board = future;
    const key = board.join('');
    cycle = history.includes(key) ? cycle + 1 : 0;
    history.push(key);
    if (history.length > 16) history.shift();
  }
  function path(c, points, color, width = 2, fill = false) {
    c.beginPath(); c.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) c.lineTo(...points[i]);
    if (fill) { c.closePath(); c.fillStyle = color; c.fill(); }
    else { c.strokeStyle = color; c.lineWidth = width; c.stroke(); }
  }
  function oval(c,x,y,rx,ry,color) {
    c.beginPath(); c.ellipse(x,y,rx,ry,0,0,Math.PI*2); c.fillStyle=color; c.fill();
  }
  function living(c, role, phase, palette) {
    const sway = Math.sin(phase), tint = palette[2+role];
    c.translate(0,sway*1.7);
    path(c,[[-6,5],[-8+sway*2,16],[-12+sway*2,17]],'#b2adb3',3);
    path(c,[[5,5],[7-sway*2,16],[11-sway*2,17]],'#b2adb3',3);
    path(c,[[-7,-10],[7,-10],[11,10],[-11,10]],tint,0,true);
    oval(c,0,-14,5,6,'#e6c7ae');
    if (role === 0) {
      path(c,[[-6,-14],[-5,-20],[4,-21],[7,-14]],'#b9c6cd',0,true);
      oval(c,-8,2,6,8,'#754453'); oval(c,-8,2,2,2,tint);
      c.save(); c.translate(9,-3); c.rotate(sway*.35); path(c,[[0,6],[0,-14]],'#eef3e6',2); path(c,[[-3,2],[3,2]],tint); c.restore();
    } else if (role === 1) {
      path(c,[[-8,-17],[-2,-28],[4,-24],[7,-17]],tint,0,true);
      path(c,[[10,15],[12,-14]],'#b2977c'); oval(c,12,-16,2.5+sway*.7,3,'#dcfff4');
    } else {
      path(c,[[-8,-15],[-3,-13],[-4,-9]],'#e6c7ae',0,true);
      path(c,[[8,-15],[3,-13],[4,-9]],'#e6c7ae',0,true);
      c.beginPath(); c.moveTo(9,-12); c.quadraticCurveTo(23,0,9,13); c.strokeStyle=tint; c.lineWidth=2; c.stroke();
      path(c,[[9,-12],[9,13]],'#e8e1cc',1);
    }
    oval(c,1,-15,1,1,'#251b29');
  }
  function fallen(c, age, phase, ghost) {
    c.globalAlpha *= clamp(1-age/1.45,0,1);
    c.translate(Math.sin(phase)*2,-age*8);
    if (ghost) {
      path(c,[[-9,11],[-9,-5],[-6,-12],[0,-15],[7,-12],[9,-4],[9,11],[4,7],[0,12],[-4,7]],'#b1e9ed',0,true);
      oval(c,-3,-5,1.5,2,'#314555'); oval(c,3,-5,1.5,2,'#314555');
    } else {
      oval(c,0,-12,6,7,'#e0d6c0');
      oval(c,-2,-13,1.3,1.7,'#242231'); oval(c,2,-13,1.3,1.7,'#242231');
      path(c,[[0,-5],[0,7],[-7,15]],'#e0d6c0'); path(c,[[0,7],[7,15]],'#e0d6c0');
      for (let y=-3;y<7;y+=4) path(c,[[-5,y],[5,y]],'#e0d6c0',1.5);
      path(c,[[-3,-2],[-10,3],[-11+Math.sin(phase)*2,8]],'#e0d6c0',1.5);
      path(c,[[3,-2],[10,3],[11,8]],'#e0d6c0',1.5);
    }
  }
  function draw(c, width, height, now, opts = {}) {
    const selected = typeof opts.form === 'number' ? opts.form : forms.findIndex(([id]) => id === opts.form);
    const chosen = Number.isInteger(selected) ? clamp(selected,0,2) : 0;
    if (!board || form !== chosen) {
      form=chosen; time=0; last=null; lastStep=-.5; envelope=previous=pulse=generation=0; round=1; cue='AWAITING THE BEAT'; seed();
    }
    const running = opts.animate !== false;
    const dt = running && last !== null ? clamp((now-last)/1000,0,.1) : 0;
    last = running ? now : null;
    time += dt;
    if (dt) {
      const low = clamp(Number(opts.kick ?? opts.bass)||0,0,1);
      const speed = clamp(Number(opts.speed)||1,.35,3);
      const since = time-lastStep;
      const beat = low > Math.max(.10,envelope*1.22+.015) && low-previous > .012 && since > .28/speed;
      const fallback = since > 1.65/speed && (low > .025 || opts.mid > .04);
      if (beat || fallback) { advance(); lastStep=time; pulse=1; cue=beat?'BEAT':'PULSE'; }
      pulse *= Math.exp(-dt*4);
      envelope += (low-envelope)*(1-Math.exp(-dt*2.5));
      previous=low;
    }
    const p=palettes[form], portrait=height>width*1.08, nx=portrait?rows:cols, ny=portrait?cols:rows;
    const cell=Math.min(width/(nx+1.4),height/(ny+2.6)), x0=(width-nx*cell)/2, y0=(height-ny*cell)/2+cell*.1;
    c.save(); c.fillStyle=p[0]; c.fillRect(0,0,width,height); c.lineCap='round'; c.lineJoin='round';
    for (let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
      const i=y*cols+x, xx=x0+(portrait?y:x)*cell, yy=y0+(portrait?x:y)*cell;
      c.fillStyle=(x+y)%2?p[1]:p[0]; c.fillRect(xx+1,yy+1,cell-2,cell-2);
      if (!board[i] && time-dead[i]>=1.45) continue;
      c.save(); c.translate(xx+cell/2,yy+cell*.58); c.scale(cell/49,cell/49);
      const phase=time*5+i*.63;
      if (board[i]) {
        const age=time-born[i], rise=clamp(age/.25,0,1);
        oval(c,0,16,17,4,p[2+roles[i]]+'44');
        if (age<.55) { c.globalAlpha=(1-age/.55)*.72; c.strokeStyle=p[2+roles[i]]; c.lineWidth=1; c.beginPath(); c.ellipse(0,15,8+age*24,2+age*8,0,0,Math.PI*2); c.stroke(); }
        c.globalAlpha=1; c.translate(0,(1-rise)*9); c.scale(.7+rise*.3,.7+rise*.3);
        living(c,roles[i],phase,p);
      } else fallen(c,time-dead[i],phase,(i+form)%2===0);
      c.restore();
    }
    c.strokeStyle=p[2]; c.globalAlpha=.35+pulse*.6; c.lineWidth=Math.max(1,cell*.04); c.strokeRect(x0,y0,nx*cell,ny*cell);
    c.globalAlpha=1; c.fillStyle=p[2]; c.font=`600 ${Math.max(11,cell*.33)}px Arial`;
    c.fillText('GAME OF LIFE / '+forms[form][1].toUpperCase(),x0,y0-cell*.45);
    c.font=`${Math.max(10,cell*.24)}px Arial`; c.fillStyle='#c7c9d3';
    c.fillText('GEN '+String(generation).padStart(3,'0')+'  /  MUSTER '+round+'  /  '+cue,x0,y0+ny*cell+cell*.65);
    c.restore();
    return {generation, round, time, cue, population: board.reduce((a,b)=>a+b,0)};
  }
  return {forms, recipes, next, draw, reset};
})();
