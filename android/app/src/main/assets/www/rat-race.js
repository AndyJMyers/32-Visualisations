/* Autumn 08: one long working day, sliding left until morning comes round again. */
window.RatRace = (() => {
  const recipes = [
    { name: 'Clockwork Dawn', form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Neon Commute', form: 1, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'After Hours', form: 2, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const scenes = [
    ['alarm', 8], ['coffee', 7], ['bathroom', 7], ['dress', 7], ['walkOut', 10],
    ['trainOut', 10], ['subwayOut', 9], ['office', 18], ['subwayHome', 9],
    ['trainHome', 10], ['walkHome', 10], ['home', 7], ['sleep', 9],
  ];
  const dayLength = scenes.reduce((total, [, length]) => total + length, 0);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const smooth = n => { const x = clamp(n, 0, 1); return x * x * (3 - 2 * x); };
  let time = 0, last = null, bass = 0, treble = 0;
  function reset() { time = 0; last = null; bass = 0; treble = 0; }
  function oval(c, x, y, rx, ry, colour) {
    c.fillStyle = colour; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill();
  }
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
  function clock(c, x, y, radius, hand, ring = '#e9b96d') {
    oval(c, x, y, radius + 4, radius + 4, ring);
    oval(c, x, y, radius, radius, '#f3e8c9');
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      line(c, '#624e43', 2, [x + Math.sin(a) * (radius - 8), y - Math.cos(a) * (radius - 8),
        x + Math.sin(a) * (radius - 3), y - Math.cos(a) * (radius - 3)]);
    }
    line(c, '#57463f', 3, [x, y, x + Math.sin(hand) * radius * .5, y - Math.cos(hand) * radius * .5]);
    line(c, '#bb644d', 2, [x, y, x + Math.sin(hand * 4) * radius * .72, y - Math.cos(hand * 4) * radius * .72]);
    oval(c, x, y, 3, 3, '#57463f');
  }
  function blinkAt(t) {
    const phase = t % 5.8;
    return smooth((phase - 5.22) / .12) * (1 - smooth((phase - 5.43) / .12));
  }
  function person(c, x, y, { step = 0, weary = 0, smile = 0, tick = 0, coat = false, bag = false, seated = false } = {}) {
    c.save(); c.translate(x, y);
    const stride = Math.sin(step) * (seated ? 3 : 12);
    oval(c, 0, 4, 42, 7, '#18243133');
    line(c, '#343943', 9, [-12,-71,-19 + stride,0]);
    line(c, '#343943', 9, [12,-71,18 - stride,0]);
    shape(c, coat ? '#466978' : '#5d6471', [-24,-151,17,-151,27,-76,-22,-76]);
    shape(c, '#f0e4cf', [-8,-149,8,-149,5,-117,-6,-117]);
    shape(c, '#c75d50', [-3,-138,3,-138,7,-104,0,-97,-7,-104]);
    line(c, '#d5a784', 9, [-20,-139,-33,-96 + stride * .45]);
    line(c, '#d5a784', 9, [19,-139,31,-98 - stride * .45]);
    oval(c, 0, -169, 19, 22, '#d9aa86');
    shape(c, '#38343a', [-19,-170,-16,-189,2,-195,18,-183,18,-174,8,-183,-10,-180]);
    const blink = blinkAt(tick + x * .013);
    const glance = Math.sin(tick * .6) * 1.1;
    const brow = Math.sin(tick * .8) * .6;
    line(c, '#60453e', 1.2, [-10,-177-brow,-3,-176+weary]);
    line(c, '#60453e', 1.2, [4,-176+weary,11,-177-brow]);
    oval(c, -6 + glance, -170, 1.5, Math.max(.3, 1.7 * (1 - blink)), '#342f31');
    oval(c, 7 + glance, -170, 1.5, Math.max(.3, 1.7 * (1 - blink)), '#342f31');
    line(c, '#76564b', 1.5, [-3,-158 - smile * 2 + weary,2,-158,7,-158 - smile * 2 + weary]);
    if (bag) {
      line(c, '#ae8459', 3, [30,-101,32,-76]);
      c.fillStyle = '#876649'; c.fillRect(17, -77, 35, 28);
      line(c, '#d7b276', 2, [17,-61,52,-61]);
    }
    c.restore();
  }
  function room(c, wall, floor) {
    c.fillStyle = wall; c.fillRect(0, 0, 900, 500);
    c.fillStyle = floor; c.fillRect(0, 370, 900, 130);
    line(c, '#f2d5ae66', 5, [0,370,900,370]);
  }
  function window(c, x, y, daylight, t) {
    c.fillStyle = '#4b5360'; c.fillRect(x - 5, y - 5, 170, 183);
    c.fillStyle = daylight; c.fillRect(x, y, 160, 172);
    oval(c, x + 116, y + 54, 19, 19, t > .5 ? '#ffd77e' : '#d9e1db');
    line(c, '#d4c5af', 5, [x + 80,y,x + 80,y + 172]);
    line(c, '#d4c5af', 5, [x,y + 86,x + 160,y + 86]);
  }
  function steam(c, x, y, tick, amount = 3) {
    for (let i = 0; i < amount; i++) {
      const drift = Math.sin(tick * 1.7 + i * 2) * 6;
      line(c, '#f9e8ccbb', 3, [x + i * 13, y, x + i * 13 + drift, y - 19,
        x + i * 13 - drift * .5, y - 37]);
    }
  }
  function palette(form, evening) {
    if (form === 'neon') return evening
      ? { sky: '#3c426a', wall: '#4d516d', floor: '#303c53', glow: '#ef7299' }
      : { sky: '#7890a5', wall: '#77909c', floor: '#4c6576', glow: '#f3b87b' };
    if (form === 'after') return evening
      ? { sky: '#263a52', wall: '#43495d', floor: '#34374b', glow: '#ffc979' }
      : { sky: '#7a8a91', wall: '#76878b', floor: '#5a6768', glow: '#ead1a0' };
    return evening
      ? { sky: '#515774', wall: '#686779', floor: '#474a5b', glow: '#f4bb77' }
      : { sky: '#a8b7aa', wall: '#bea98f', floor: '#716857', glow: '#f4d18a' };
  }
  function city(c, p, tick, evening) {
    const sky = c.createLinearGradient(0, 0, 0, 380);
    sky.addColorStop(0, p.sky); sky.addColorStop(1, evening ? '#bd8e7f' : '#e5c8a2');
    c.fillStyle = sky; c.fillRect(0,0,900,500);
    oval(c, evening ? 160 : 710, evening ? 125 : 92, 48, 48, p.glow);
    for (let i = 0; i < 9; i++) {
      const x = i * 127 - 60 - tick * 4 % 127;
      const height = 145 + (i * 41 % 120);
      c.fillStyle = i % 2 ? '#536374' : '#6b7978'; c.fillRect(x, 310 - height, 111, height + 60);
      for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) {
        c.fillStyle = evening ? '#f4cd8e99' : '#d5ddca77';
        c.fillRect(x + 13 + col * 31, 327 - height + row * 28, 15, 12);
      }
    }
    c.fillStyle = p.floor; c.fillRect(0, 370, 900, 130);
    line(c, '#e2bb83', 4, [0,374,900,374]);
  }
  function train(c, p, tick, subway, evening) {
    if (subway) room(c, '#52606c', '#424752');
    else city(c, p, tick, evening);
    if (subway) {
      for (let i = 0; i < 11; i++) {
        const x = i * 100 - tick * 20 % 100;
        line(c, '#829293', 12, [x,60,x,365]);
        oval(c, x + 40, 130, 5, 5, p.glow);
      }
    }
    c.fillStyle = '#b9c6bd'; c.fillRect(0, 0, 900, 48);
    c.fillStyle = '#a9c3c0'; c.fillRect(0, 48, 900, 36);
    for (let i = 0; i < 5; i++) {
      const x = 12 + i * 180;
      c.fillStyle = '#344f5d'; c.fillRect(x, 98, 155, 194);
      c.fillStyle = subway ? '#647887' : p.sky; c.fillRect(x + 8, 106, 139, 178);
      if (!subway) for (let j = 0; j < 3; j++) line(c, '#607263aa', 7,
        [x + j * 52 - tick * 12 % 52, 275, x + j * 52 - tick * 12 % 52, 218]);
    }
    for (let i = 0; i < 4; i++) {
      line(c, '#d8bd8c', 3, [183 + i*170,48,183 + i*170,160]);
      oval(c, 183 + i*170, 160, 9, 4, '#d8bd8c');
    }
    c.fillStyle = '#bbc8c0'; c.fillRect(0,290,900,105);
    for (let i=0;i<4;i++) {
      const x = 70+i*210;
      c.fillStyle = '#61727d'; c.fillRect(x,346,110,46);
      oval(c,x+55,324,12,15,'#c69b7d');
      shape(c,'#536171',[x+39,346,x+41,333,x+70,333,x+72,346]);
    }
    c.fillStyle = '#495566'; c.fillRect(0,395,900,105);
    for (let i=0;i<4;i++) line(c,'#d5bd91',4,[105+i*220,48,105+i*220,393]);
  }
  function drawScene(c, name, local, tick, form, sound) {
    const evening = ['subwayHome','trainHome','walkHome','home','sleep'].includes(name);
    const p = palette(form, evening);
    c.save(); c.beginPath(); c.rect(0,0,900,500); c.clip();
    if (name === 'alarm' || name === 'sleep') {
      room(c, name === 'alarm' ? '#33465a' : p.wall, '#4a4a57');
      window(c, 655, 90, name === 'alarm' ? '#455e75' : '#354761', evening ? 0 : .3);
      c.fillStyle = '#6b534b'; c.fillRect(90,300,545,90);
      c.fillStyle = '#8a6670'; c.fillRect(135,285,465,98);
      c.fillStyle = name === 'sleep' ? '#63799a' : '#d9a78f'; c.fillRect(240,283,330,85);
      oval(c, 238, 287, 42, 26, '#d8a985');
      shape(c, '#3e3d43', [198,279,216,260,248,261,263,277]);
      c.fillStyle = '#6e5b52'; c.fillRect(54,290,120,102);
      clock(c, 113, 277, 28, tick * 3, name === 'alarm' ? '#ed795d' : '#d7b976');
      if (name === 'alarm') {
        const ring = Math.sin(tick * 15) * (1 - smooth(local / 5));
        for (let i = 0; i < 4; i++) line(c, '#efa67a', 3,
          [113 + (i-1.5)*34, 230 + ring * 3, 113 + (i-1.5)*43, 213 + ring * 6]);
        const eyeY = 282 - Math.sin(tick * 14) * (1 - smooth(local / 5)) * 1.2;
        oval(c, 260, eyeY, 1.8, Math.max(.35, 1.8 * (1 - blinkAt(tick))), '#2c3038');
        line(c, '#755b50', 1.2, [257,277,263,277 - Math.sin(tick*.7)*.6]);
        line(c, '#946d5c', 1.3, [267,297,272,297]);
        const reach = smooth((local - 2) / 3);
        line(c, '#d8a985', 9, [262,313,225-reach*45,297-reach*20,150-reach*14,286-reach*10]);
      } else {
        line(c, '#6e5147', 1.4, [257,282,264,282]);
        line(c, '#946d5c', 1.2, [267,297,272,297]);
        for (let i = 0; i < 4; i++) oval(c, 470 + i*30, 225 - i*20 - tick*2%8, 2+i, 2+i, '#ecd4aa99');
      }
    } else if (name === 'coffee' || name === 'home') {
      room(c, p.wall, '#695d58'); window(c, 660, 58, evening ? '#554f69' : '#d4bc91', evening ? 0 : .8);
      person(c, 255,368,{weary: evening ? .8 : .45, smile: evening ? .55 : .3, tick, seated:true});
      c.fillStyle = '#514943'; c.fillRect(60,285,780,68); c.fillRect(95,345,24,125); c.fillRect(774,345,24,125);
      c.fillStyle = '#e2c39b'; c.fillRect(420,272,54,36); oval(c,473,286,12,12,'#e2c39b');
      steam(c, 427,265,tick, 3);
      oval(c, 255, 95, 32, 32, evening ? '#f1c78166' : '#f5e6ad99');
      if (name === 'home') {
        c.fillStyle = '#f1d09a'; c.fillRect(590,247,83,17);
        line(c, '#ad6450', 3, [605,247,610,229,665,229]);
      }
    } else if (name === 'bathroom') {
      room(c, '#9db3ae', '#82928a');
      c.fillStyle = '#d9e4d9'; c.fillRect(90,80,260,250);
      c.fillStyle = '#7a9a9b'; c.fillRect(110,100,220,210);
      oval(c, 215,205,17,20,'#d7ae8e');
      c.fillStyle = '#f3ede3'; c.fillRect(598,310,120,57);
      oval(c,658,310,60,19,'#fff6e9'); oval(c,658,310,37,9,'#9eb9b5');
      c.fillStyle = '#f3ede3'; c.fillRect(580,267,156,28);
      c.fillStyle = '#e8e0d1'; c.fillRect(563,165,193,16);
      oval(c,661,166,20,9,'#e8e0d1');
      line(c, '#d8e2dc', 4, [455,380,455,138,490,138]);
      steam(c, 458,280,tick,2);
    } else if (name === 'dress') {
      room(c, p.wall, '#74685d'); window(c, 659,65,'#e0c49c',.8);
      c.fillStyle = '#594d50'; c.fillRect(85,92,223,276);
      c.fillStyle = '#776064'; c.fillRect(97,103,194,248);
      line(c, '#e9c78e', 3, [193,103,193,351]);
      oval(c,179,230,4,4,'#f0d39c'); oval(c,207,230,4,4,'#f0d39c');
      person(c, 510,370,{tick, coat: local > 3, bag: local > 4});
      shape(c, '#c96051', [600,171,614,167,621,218,609,236,600,215]);
    } else if (name.startsWith('walk')) {
      city(c,p,tick,evening);
      const step = tick * (4 + sound * 4);
      person(c, 440,414,{step, weary: evening ? .9 : .2, smile: evening ? .2 : 0, tick, coat: true, bag:true});
      for (let i = 0; i < 6; i++) {
        const x = (i*180 - tick*20%1080 + 1080)%1080 - 90;
        line(c, '#b4a58d', 5, [x,365,x,329]); oval(c,x,320,13,12,'#c8a269');
      }
      if (evening) for (let i=0;i<8;i++) oval(c,100+i*100,210+(i%3)*27,2,2,'#f4c985');
    } else if (name.startsWith('train') || name.startsWith('subway')) {
      const subway = name.startsWith('subway');
      train(c,p,tick,subway,evening);
      person(c, 640,394,{weary: evening ? .85 : .4, smile: evening ? .1 : -.1, tick, bag:true});
      c.fillStyle = '#eee3ce'; c.fillRect(555,130,105,32);
      c.fillStyle = '#55626a'; c.font = 'bold 17px sans-serif'; c.fillText(subway ? 'NEXT' : 'LOCAL',575,152);
    } else if (name === 'office') {
      room(c, '#788796', '#485867');
      for (let i=0;i<4;i++) {
        const x = 32+i*215;
        c.fillStyle = '#4b5360'; c.fillRect(x-5,48,170,183);
        c.fillStyle = '#8299aa'; c.fillRect(x,53,160,172);
        c.fillStyle = '#677987'; c.fillRect(x+13,158-i%2*23,58,67+i%2*23);
        c.fillRect(x+95,179-i%3*16,45,46+i%3*16);
        line(c, '#d4c5af',5,[x+80,53,x+80,225]);
        line(c, '#d4c5af',5,[x,139,x+160,139]);
      }
      oval(c, 632, 102, 24, 24, '#f6d88e');
      person(c, 300,360,{seated:true,weary: .6,smile:-.2,tick});
      c.fillStyle = '#394754'; c.fillRect(80,314,740,38); c.fillRect(95,352,18,118); c.fillRect(782,352,18,118);
      c.fillStyle = '#293b48'; c.fillRect(460,196,215,126);
      c.fillStyle = '#79a9ad'; c.fillRect(474,208,187,97);
      for (let i=0;i<5;i++) line(c,'#d6c798',2,[485,229+i*14,600+i%2*20,229+i*14]);
      for (let i=0;i<4;i++) {
        const x = 720 + Math.sin(tick*.3+i*2)*40;
        const y = 277 - i*33 - (tick*7+i*11)%50;
        shape(c,'#f0e5d4aa',[x,y,x+20,y-8,x+10,y+16]);
      }
      clock(c,775,90,28,tick*.9);
      c.fillStyle = '#547967'; c.fillRect(120,279,39,38);
      line(c,'#527e5d',4,[140,280,130,232,146,242,154,219]);
      oval(c,130,230,12,7,'#6e9a70'); oval(c,154,220,12,7,'#6e9a70');
    }
    if (form === 'clockwork') {
      c.save(); c.globalAlpha = .7;
      clock(c, 832, 66, 23, tick * 2.4, '#d9a85b');
      for (let i = 0; i < 13; i++) {
        const x = i * 72 + (tick * 11 % 72);
        line(c, '#caa46a99', i % 3 ? 2 : 4, [x, 486, x, i % 3 ? 478 : 469]);
      }
      c.restore();
    } else if (form === 'neon') {
      const pulse = .55 + .35 * Math.sin(tick * 2.8);
      c.save(); c.shadowBlur = 18 + sound * 12; c.shadowColor = '#fb61c1';
      line(c, `rgba(255, 93, 192, ${pulse})`, 5, [0, 42, 900, 42]);
      line(c, '#61e7e0cc', 3, [0, 48, 900, 48]);
      if (name.startsWith('walk') || name.startsWith('train') || name.startsWith('subway') || name === 'office') {
        c.fillStyle = '#182b48'; c.fillRect(57, 100, 160, 65);
        c.strokeStyle = '#fb61c1'; c.lineWidth = 4; c.strokeRect(57, 100, 160, 65);
        c.fillStyle = '#a4fff3'; c.font = 'bold 28px sans-serif'; c.fillText('GO', 108, 143);
      }
      c.restore();
    } else if (form === 'after') {
      c.save();
      c.fillStyle = '#16253a29'; c.fillRect(0, 0, 900, 500);
      if (name.startsWith('walk') || name.startsWith('train') || name.startsWith('subway')) {
        c.strokeStyle = '#c5d9e399'; c.lineWidth = 1.5;
        for (let i = 0; i < 50; i++) {
          const x = (i * 173 + tick * 53) % 980 - 40;
          const y = (i * 107 + tick * 137) % 540 - 20;
          c.beginPath(); c.moveTo(x, y); c.lineTo(x - 7, y + 19); c.stroke();
        }
        for (let i = 0; i < 8; i++) oval(c, i * 130 + 20, 392, 27, 3, '#eac2a566');
      } else if (name === 'office') {
        c.fillStyle = '#dbc9a7';
        for (let i = 0; i < 4; i++) {
          const x = 98 + i * 35;
          shape(c, '#e6d8bc', [x, 308, x + 27, 304 - i * 3, x + 29, 312, x + 2, 315]);
        }
        oval(c, 685, 280, 48, 6, '#acd6dd66');
      }
      c.restore();
    }
    c.restore();
  }
  function sceneAt(t) {
    let elapsed = ((t % dayLength) + dayLength) % dayLength;
    for (let i = 0; i < scenes.length; i++) {
      const [name, duration] = scenes[i];
      if (elapsed < duration) {
        const transition = elapsed / duration;
        return { scene: name, index: i, elapsed, transition, next: scenes[(i + 1) % scenes.length][0], cycle: Math.floor(t / dayLength) };
      }
      elapsed -= duration;
    }
    return null;
  }
  function draw(c, w, h, now, opts = {}) {
    const animate = opts.animate !== false;
    const dt = !animate || last === null ? 0 : clamp((now - last) / 1000, 0, .1);
    last = animate ? now : null;
    bass += (clamp(Number(opts.bass) || 0,0,1) - bass) * (1 - Math.exp(-dt*4));
    treble += (clamp(Number(opts.treble) || 0,0,1) - treble) * (1 - Math.exp(-dt*4));
    time += dt * clamp(Number(opts.speed) || 1,.2,3);
    const form = ['clockwork','neon','after'].includes(opts.form) ? opts.form : 'clockwork';
    const story = sceneAt(time);
    c.save(); c.scale(w/900,h/500);
    const offset = story.transition * 900;
    c.save(); c.translate(-offset,0);
    drawScene(c, story.scene, story.elapsed, time, form, bass + treble*.5);
    c.restore();
    if (offset > 0) {
      c.save(); c.translate(900-offset,0);
      drawScene(c, story.next, 0, time, form, bass + treble*.5);
      c.restore();
    }
    // A narrow moving brass line stitches the panels into one endless day.
    line(c, '#f3ca83', 3 + bass*2, [0,474,900,474]);
    oval(c, 450 + Math.sin(time*.7)*12, 474, 3 + treble*3, 3 + treble*3, '#fff2c0');
    c.restore();
    return { time, form, bass, treble, dayLength, ...story };
  }
  return { recipes, scenes, draw, reset };
})();
