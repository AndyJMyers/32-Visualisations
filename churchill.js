window.Churchill = (() => {
  const chapters = [
    ['1874', 'BLENHEIM', 'A child arrives beneath the palace roof'],
    ['1898', 'OMDURMAN', 'The 21st Lancers charge; a Mauser, not a sword'],
    ['1899', 'THE CORRESPONDENT', 'Notebook, dust and the Boer War'],
    ['1899', 'CAPTURE / ESCAPE', 'The bars give way to the night'],
    ['1911', 'THE ADMIRALTY', 'Ships, charts and dangerous decisions'],
    ['1920s', 'CHARTWELL', 'Paint on canvas; brick upon brick'],
    ['1930s', 'THE WRITER', 'History worked out one page at a time'],
    ['1940', 'THE WAR ROOMS', 'Maps, voices and a country under fire'],
    ['AFTER', 'THE ENGLISHMAN', 'A complicated life remains in view'],
  ];
  const recipes = [
    { name: 'Imperial Newsreel', form: 'newsreel', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Ink & Dispatches', form: 'dispatches', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Chartwell Oils', form: 'oils', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Blackout & Dawn', form: 'blackout', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    newsreel: { sky: '#586477', floor: '#35434d', light: '#e6cf9d', dark: '#17222d', accent: '#c45c43', paper: '#e2d7b9' },
    dispatches: { sky: '#baa980', floor: '#867557', light: '#f4ead2', dark: '#342d27', accent: '#9f4336', paper: '#f5e9c9' },
    oils: { sky: '#365b86', floor: '#47684d', light: '#ffe0a0', dark: '#19334d', accent: '#dc703e', paper: '#f1d6a6' },
    blackout: { sky: '#131c31', floor: '#1c2940', light: '#f8c87f', dark: '#080f1c', accent: '#ef7b53', paper: '#d8c9ae' },
  };
  let time = 0;
  let last = null;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function reset() { time = 0; last = null; }
  function rect(c, x, y, w, h, colour) { c.fillStyle = colour; c.fillRect(x, y, w, h); }
  function line(c, colour, width, points) {
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.stroke();
  }
  function oval(c, x, y, rx, ry, colour) {
    c.fillStyle = colour; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
  }
  function poly(c, colour, points) {
    c.fillStyle = colour; c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.closePath(); c.fill();
  }
  function label(c, text, x, y, size, colour, align = 'left') {
    c.fillStyle = colour; c.font = `600 ${size}px Georgia, serif`; c.textAlign = align; c.fillText(text, x, y);
  }
  function sky(c, p, pulse, t) {
    const g = c.createLinearGradient(0, 0, 0, 460);
    g.addColorStop(0, p.sky); g.addColorStop(1, p.floor);
    rect(c, 0, 0, 960, 540, g);
    oval(c, 768, 128, 72 + pulse * 18, 72 + pulse * 18, p.light);
    for (let i = 0; i < 7; i++) {
      const x = (i * 179 + t * (8 + i % 3 * 5)) % 1180 - 110;
      oval(c, x, 125 + i % 3 * 39, 62, 10, 'rgba(250,244,220,.15)');
    }
    rect(c, 0, 405, 960, 135, p.floor);
  }
  function smoke(c, x, y, t, pulse, p) {
    for (let i = 0; i < 4; i++) {
      const rise = (t * 27 + i * 19) % 76;
      c.globalAlpha = .38 * (1 - rise / 85);
      oval(c, x + Math.sin(t * 1.8 + i) * (5 + rise * .18), y - rise, 4 + rise * .12 + pulse * 2, 3 + rise * .12, p.paper);
    }
    c.globalAlpha = 1;
  }
  function tumbler(c, x, y, scale, p, t, pulse) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    poly(c, p.paper, [-22,-39,22,-39,17,0,-17,0]);
    poly(c, p.accent, [-18,-17,18,-17,15,-3,-15,-3]);
    line(c, p.light, 3, [-16,-35,-13,-8]);
    oval(c, -2 + Math.sin(t * 3) * 2, -16, 5 + pulse * 3, 2, p.light);
    c.restore();
  }
  function figure(c, x, y, scale, p, t, { hat = true, arm = 0, cigar = false, command = false, pulse = 0 } = {}) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    const bob = Math.sin(t * 4) * 2;
    poly(c, p.dark, [-27,-30,27,-30,43,81,-43,81]);
    poly(c, p.paper, [-25,-30,-3,-8,-15,18]);
    poly(c, p.paper, [25,-30,3,-8,15,18]);
    poly(c, p.accent, [-4,-15,4,-15,8,17,0,29,-8,17]);
    rect(c, 19, -10, 13, 3, p.light);
    oval(c, 0, -61 + bob, 21, 26, p.paper);
    oval(c, 0, -55 + bob, 18, 18, p.paper);
    if (hat) { rect(c, -26, -100 + bob, 52, 21, p.dark); rect(c, -38, -80 + bob, 76, 7, p.dark); }
    oval(c, 8, -60 + bob, 2.5, 2, p.dark);
    line(c, p.dark, 2, [10,-47+bob,19,-48+bob]);
    line(c, p.dark, 10, [-22,-18,-51,-5 + arm, -43,23 + arm]);
    if (command) {
      const sweep = Math.sin(t * 2.2) * 14;
      line(c, p.dark, 10, [22,-18,48,-52,78+sweep,-69]);
      oval(c, 80+sweep, -70, 8, 6, p.paper);
    } else line(c, p.dark, 10, [22,-18,52,2 - arm, 48,30 - arm]);
    line(c, p.dark, 13, [-18,75,-21,127]); line(c, p.dark, 13, [18,75,21,127]);
    if (cigar) {
      line(c, p.accent, 7, [18,-47+bob,52,-43+bob]);
      oval(c, 52, -43+bob, 4 + Math.sin(t*5)*1.5 + pulse*2, 4, p.light);
      smoke(c, 55, -46+bob, t, pulse, p);
    }
    c.restore();
  }
  function blenheim(c, p, t, pulse) {
    const x = 120, y = 178;
    rect(c, x, y, 516, 247, p.paper);
    rect(c, x + 206, y - 42, 102, 42, p.paper);
    poly(c, p.dark, [x-30,y, x+258,y-74, x+546,y, x+536,y+12, x-20,y+12]);
    for (let i = 0; i < 9; i++) {
      const xx = x + 20 + i * 57;
      rect(c, xx, y + 42, 30, 64, p.dark);
      rect(c, xx, y + 135, 30, 62, p.dark);
      rect(c, xx + 10, y + 42, 10, 64, p.light);
    }
    rect(c, x + 224, y + 136, 68, 111, p.dark);
    for (let i = 0; i < 7; i++) oval(c, 704 + i * 29, 388 - Math.sin(t * 1.7 + i) * (6 + pulse * 9), 9, 6, p.accent);
    figure(c, 726, 337, .45, p, t, { hat: false });
  }
  function omdurman(c, p, t, pulse) {
    rect(c, 0, 319, 960, 125, '#a78155');
    poly(c, p.dark, [0,353,170,362,268,399,497,410,651,372,960,363,960,451,0,451]);
    for (let i = 0; i < 14; i++) {
      const x = 25 + i * 70;
      line(c, p.dark, 5, [x,353+(i%3)*9,x+8,318+(i%3)*6]);
      oval(c, x+8, 313+(i%3)*6, 8, 10, p.dark);
      if (i%3===0) line(c, p.accent, 3, [x+12,323,x+32,294]);
    }
    const gallop = t * 54;
    for (let i = 0; i < 5; i++) {
      const x = ((i * 215 + gallop) % 1180) - 130;
      const y = 304 + i%2*22 + Math.sin(t*8+i)*6;
      oval(c, x, y, 47, 24, p.dark);
      oval(c, x+44, y-14, 16, 13, p.dark);
      line(c, p.dark, 9, [x+37,y-10,x+47,y-21]);
      const stride = Math.sin(t*13+i*2)*19;
      line(c, p.dark, 8, [x-30,y+17,x-43-stride,y+65]);
      line(c, p.dark, 8, [x-8,y+18,x+5+stride,y+63]);
      line(c, p.dark, 8, [x+16,y+18,x+5-stride,y+63]);
      line(c, p.dark, 8, [x+34,y+17,x+48+stride,y+58]);
      oval(c, x-8, y-45, 13, 15, p.paper);
      line(c, p.dark, 13, [x-8,y-29,x-1,y-3]);
      if (i===2) {
        line(c, p.dark, 7, [x+1,y-26,x+28,y-41]);
        rect(c, x+25, y-46, 21, 7, p.dark);
        rect(c, x+39, y-49, 4, 13, p.dark);
        if (Math.sin(t*10)> .52) {
          oval(c, x+51, y-43, 7+pulse*9, 4+pulse*4, p.light);
          oval(c, x+62, y-43, 3+pulse*4, 2+pulse*2, p.accent);
        }
      } else line(c, p.dark, 5, [x+2,y-26,x+42,y-60]);
      for (let j=0;j<3;j++) oval(c, x-69-j*25, y+54+j*4, 11+pulse*3, 4, p.paper);
    }
    label(c, '21ST LANCERS', 26, 284, 18, p.light);
  }
  function correspondent(c, p, t, pulse) {
    for (let i = 0; i < 5; i++) poly(c, i % 2 ? p.dark : p.paper, [i*240-160,398,i*240+40,291,i*240+270,398]);
    line(c, p.dark, 7, [0,432,960,432]);
    for (let i = 0; i < 13; i++) line(c, p.dark, 4, [i*82,410,i*82+35,435]);
    const trainX = 130 + (t * 21) % 650;
    rect(c, trainX - 180, 313, 325, 90, p.dark);
    rect(c, trainX + 60, 267, 75, 47, p.dark);
    for (let i = 0; i < 5; i++) rect(c, trainX - 162 + i*60, 331, 40, 29, p.light);
    for (let i = 0; i < 5; i++) oval(c, trainX - 135 + i*63, 405, 19, 19, p.dark);
    figure(c, 700, 332, .72, p, t, { hat: true, cigar: true, pulse });
    rect(c, 721, 346, 78, 57, p.paper); line(c, p.dark, 3, [731,358,789,358,731,371,784,371,734,386,779,386]);
    for (let i = 0; i < 8; i++) oval(c, (i*137+t*33)%960, 391+(i%3)*12, 3+pulse*2, 2, p.paper);
  }
  function escape(c, p, t, pulse) {
    rect(c, 86, 105, 400, 300, p.dark);
    rect(c, 110, 129, 350, 254, p.sky);
    for (let i = 0; i < 5; i++) rect(c, 137+i*68, 119, 12, 276, p.dark);
    line(c, p.paper, 5, [466,302,688,413]);
    figure(c, 689 + Math.sin(t * .9)*85, 323, .68, p, t, { arm: Math.sin(t*7)*9 });
    line(c, p.accent, 5, [508,397,611,371,716,378,831,348]);
    poly(c, p.accent, [831,348,807,344,816,360]);
    for (let i=0; i<3; i++) {
      const xx = 550+i*130;
      poly(c, 'rgba(255,233,175,.17)', [xx,128,xx-54,410,xx+64,410]);
      oval(c, xx, 129, 14 + pulse*6, 14 + pulse*6, p.light);
    }
  }
  function admiralty(c, p, t, pulse) {
    rect(c, 0, 286, 960, 137, p.sky);
    for (let row=0; row<4; row++) line(c, p.light, 2, [0,310+row*28,960,310+row*28]);
    for (let i=0; i<3; i++) {
      const x = (i*360+t*(i+1)*15)%1240-150, y=316+i*34;
      poly(c, p.dark, [x-130,y,x+150,y,x+108,y+31,x-88,y+31]);
      rect(c,x-42,y-45,83,44,p.dark); rect(c,x+7,y-68,14,24,p.dark);
      line(c,p.dark,3,[x+13,y-68,x+13,y-109]);
      for(let k=0;k<4;k++) oval(c,x-135-k*25,y+18+Math.sin(t*2+k)*4,14,3,p.paper);
    }
    rect(c, 632, 372, 268, 112, p.paper);
    line(c, p.accent, 4, [651,456,690,420,724,436,772,397,836,431,885,389]);
    for(let i=0;i<4;i++) oval(c,685+i*62,416+Math.sin(t*2+i)*18,4+pulse*4,4+pulse*4,p.accent);
    label(c,'DARDANELLES 1915',670,470,15,p.dark);
    figure(c, 548, 306, .58, p, t, { hat: false, cigar: true, command: true, pulse });
    tumbler(c, 800, 386, .62, p, t, pulse);
    for (let i = 0; i < 3; i++) {
      const x = 189 + i * 177 + Math.sin(t * 1.3 + i) * 16;
      poly(c, p.accent, [x,260,x+26,270,x,280]);
    }
  }
  function chartwell(c, p, t, pulse) {
    rect(c,0,360,960,110,p.floor);
    for(let row=0;row<4;row++) for(let col=0;col<12;col++) {
      if (row===3 && col>6+Math.floor((t*1.3)%6)) continue;
      rect(c, 34+col*73+(row%2)*-33, 250+row*39, 68, 33, row%2?p.accent:p.paper);
      line(c,p.dark,2,[34+col*73+(row%2)*-33,283+row*39,102+col*73+(row%2)*-33,283+row*39]);
    }
    rect(c,506,114,266,194,p.dark); rect(c,521,127,236,167,p.paper);
    rect(c,539,161,201,119,p.sky);
    poly(c,p.floor,[539,250,606,208,649,231,711,186,740,218,740,280,539,280]);
    for(let i=0;i<16;i++) {
      const x=545+(i*41)%189, y=166+(i*37)%107;
      line(c,i%3?p.light:p.accent,2+pulse*3,[x,y,x+16+Math.sin(t*2+i)*7,y+5]);
    }
    line(c,p.dark,7,[490,111,490,321,790,321,790,111]);
    figure(c,339,260,.74,p,t,{hat:false,arm:Math.sin(t*3)*7,cigar:true,pulse});
    tumbler(c,420,318,.63,p,t,pulse);
  }
  function writer(c,p,t,pulse) {
    rect(c,110,98,740,310,p.dark);
    for(let i=0;i<7;i++) {
      rect(c,136+i*97,130,70,126,i%2?p.accent:p.paper);
      line(c,p.dark,3,[149+i*97,149,190+i*97,149]);
    }
    rect(c,175,324,610,25,p.paper); rect(c,210,348,25,94,p.dark); rect(c,730,348,25,94,p.dark);
    rect(c,350,255,264,70,p.paper);
    for(let i=0;i<6;i++) line(c,p.dark,2,[371,272+i*8,375+((t*27+i*51)%213),272+i*8]);
    figure(c,695,277,.59,p,t,{hat:false,cigar:true,pulse});
    tumbler(c,628,286,.75,p,t,pulse);
    for(let i=0;i<8;i++) label(c,i%2?'HISTORY':'DISPATCH',144+i*94,244,9,p.dark);
    oval(c,640,290,10+pulse*8,4,p.accent);
  }
  function warRooms(c,p,t,pulse) {
    rect(c,85,92,790,287,p.paper);
    for(let i=0;i<7;i++) line(c,p.dark,2,[125+i*108,104,125+i*108,363]);
    for(let i=0;i<5;i++) line(c,p.dark,2,[102,125+i*56,855,125+i*56]);
    for(let i=0;i<19;i++) {
      const x=134+(i*143)%684,y=137+(i*77)%213;
      oval(c,x,y,5+(i%4)*2+pulse*2,5+(i%4)*2,i%3?p.accent:p.dark);
    }
    line(c,p.accent,5,[190,287,315,248,433,279,562,207,702,223,781,160]);
    rect(c,0,405,960,135,p.dark);
    for(let i=0;i<10;i++) {
      const x=42+i*99;
      poly(c,p.sky,[x-31,405,x-31,342-(i%3)*23,x+25,342-(i%3)*23,x+25,405]);
      if (i%2) oval(c,x,364,5+pulse*2,5+pulse*2,p.light);
    }
    figure(c,728,322,.8,p,t,{hat:false,cigar:true,command:true,pulse});
    rect(c,789,275,9,104,p.dark); oval(c,794,271,23,13,p.dark);
    tumbler(c,844,376,.72,p,t,pulse);
    for(let i=0;i<4;i++) {
      const x=190+i*168+Math.sin(t*1.9+i)*24;
      poly(c,p.accent,[x,256-i*15,x+25,263-i*15,x,270-i*15]);
    }
    for(let i=0;i<7;i++) line(c,'rgba(255,243,205,.25)',1,[114+i*119,0,252+i*119,140]);
  }
  function englishman(c,p,t,pulse) {
    rect(c,0,340,960,110,p.floor);
    for(let i=0;i<11;i++) {
      const x=i*95;
      rect(c,x,300+(i%3)*12,91,37,p.paper);
      rect(c,x+((i%2)*-31),339+(i%2)*5,91,37,p.accent);
    }
    figure(c,483,252,1.1,p,t,{cigar:true,command:true,pulse});
    rect(c,626,339,106,12,p.dark); line(c,p.dark,8,[653,351,653,417,705,351,705,417]);
    oval(c,688,328,25,8,p.paper); rect(c,674,307,28,25,p.paper);
    tumbler(c,735,343,.9,p,t,pulse);
    rect(c,775,284,18,58,p.dark); rect(c,770,279,28,10,p.dark);
    for(let i=0;i<7;i++) {
      const x=100+i*122;
      oval(c,x,283+Math.sin(t+i)*5,6+pulse*3,12,p.light);
    }
    label(c,'PAINTER  /  BUILDER  /  WRITER  /  LEADER',480,482,19,p.light,'center');
  }
  const scenes = [blenheim,omdurman,correspondent,escape,admiralty,chartwell,writer,warRooms,englishman];
  function draw(c, width, height, now, options = {}) {
    const dt = last === null ? 0 : clamp((now-last)/1000,0,.08);
    last = now;
    if (options.animate !== false) time += dt * clamp(Number(options.speed)||1,.35,3);
    const chapter = Math.floor(time/8.4)%chapters.length;
    const local = time%8.4;
    const pulse = clamp((options.bass||0)*.85+(options.mid||0)*.45+(options.treble||0)*.25,0,1);
    const form = palettes[options.form] ? options.form : 'newsreel';
    const p = palettes[form];
    c.save(); c.scale(width/960,height/540);
    sky(c,p,pulse,time);
    scenes[chapter](c,p,local,pulse);
    if(form==='dispatches') {
      c.globalAlpha=.15; for(let i=0;i<18;i++) line(c,p.dark,1,[0,i*31+Math.sin(time+i)*2,960,i*31+Math.sin(time+i)*2]); c.globalAlpha=1;
    } else if(form==='oils') {
      c.globalAlpha=.17; for(let i=0;i<45;i++) {
        const x=(i*173)%960,y=(i*83)%400;
        line(c,i%3?p.light:p.accent,2+pulse*3,[x,y,x+20+Math.sin(time+i)*5,y-7]);
      } c.globalAlpha=1;
    } else if(form==='blackout') {
      rect(c,0,0,960,540,'rgba(4,9,23,.25)');
      for(let i=0;i<5;i++) poly(c,'rgba(255,232,166,.12)',[i*228-120,0,i*228-205,407,i*228+80,407]);
    } else {
      c.globalAlpha=.14; for(let i=0;i<40;i++) rect(c,(i*281+time*9)%960,(i*109)%540,2,2,p.paper); c.globalAlpha=1;
    }
    rect(c,0,0,960,67,'rgba(10,16,23,.72)');
    label(c,chapters[chapter][0],24,42,23,p.light);
    label(c,chapters[chapter][1],480,43,27,p.paper,'center');
    rect(c,0,499,960,41,'rgba(10,16,23,.79)');
    label(c,chapters[chapter][2],22,526,17,p.paper);
    for(let i=0;i<chapters.length;i++) rect(c,707+i*29,518,20,5,i===chapter?p.accent:p.light);
    c.restore();
    return { chapter:chapters[chapter][1], index:chapter, form, pulse, time };
  }
  return { recipes, chapters, draw, reset };
})();
