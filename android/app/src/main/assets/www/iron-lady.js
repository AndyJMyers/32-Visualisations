window.IronLady = (() => {
  const chapters = [
    ['1925', 'GRANTHAM', 'The grocer\'s daughter watches the world go by'],
    ['1959', 'FINCHLEY', 'A new voice takes a seat in Parliament'],
    ['1976', 'THE IRON LADY', 'A name forged in the Cold War'],
    ['1979', 'NUMBER TEN', 'The first woman at the door'],
    ['1982', 'THE FALKLANDS', 'A fleet sails south into a hard sea'],
    ['1984', 'THE COALFIELDS', 'A country divided across the picket line'],
    ['1984', 'THE THAW', 'An adversary becomes someone to talk to'],
    ['1990', 'THE DEPARTURE', 'The door closes; the arguments remain'],
  ];
  const recipes = [
    { name: 'Blue Steel', form: 'steel', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Fleet Street Ink', form: 'ink', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Coal & Fire', form: 'coal', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Cold War Neon', form: 'neon', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    steel: { sky: '#526b87', horizon: '#889bad', ground: '#263649', dark: '#172333', paper: '#e7e2d4', light: '#f6d7a5', blue: '#286bb1', red: '#c9504c' },
    ink: { sky: '#b3ae9f', horizon: '#d2c9ad', ground: '#67635e', dark: '#242a2d', paper: '#f2ead6', light: '#eee0bc', blue: '#52697c', red: '#994638' },
    coal: { sky: '#472c2a', horizon: '#8a5340', ground: '#1d2128', dark: '#111924', paper: '#f3dcc6', light: '#ffc16f', blue: '#486ba2', red: '#ef7746' },
    neon: { sky: '#142b46', horizon: '#394b69', ground: '#101e32', dark: '#090e22', paper: '#e9def0', light: '#96edec', blue: '#3872ca', red: '#f07183' },
  };
  const TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  let time = 0;
  let last = null;
  function reset() { time = 0; last = null; }
  function rect(c, x, y, w, h, colour) { c.fillStyle = colour; c.fillRect(x, y, w, h); }
  function line(c, colour, width, points) {
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i+1]);
    c.stroke();
  }
  function oval(c, x, y, rx, ry, colour) {
    c.fillStyle = colour; c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, TAU); c.fill();
  }
  function poly(c, colour, points) {
    c.fillStyle = colour; c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i+1]);
    c.closePath(); c.fill();
  }
  function label(c, text, x, y, size, colour, align='left') {
    c.fillStyle = colour; c.font = `600 ${size}px Georgia, serif`; c.textAlign = align; c.fillText(text,x,y);
  }
  function background(c,p,t,pulse) {
    const g=c.createLinearGradient(0,0,0,452);
    g.addColorStop(0,p.sky); g.addColorStop(1,p.horizon);
    rect(c,0,0,960,540,g); rect(c,0,401,960,139,p.ground);
    for(let i=0;i<9;i++) {
      const x=(i*149+t*(6+i%3*3))%1110-80;
      oval(c,x,154+i%3*31,54+pulse*9,8,'rgba(240,237,219,.12)');
    }
  }
  function woman(c,x,y,scale,p,t,{child=false,handbag=true,gesture=false}={}) {
    c.save(); c.translate(x,y); c.scale(scale,scale);
    const bounce=Math.sin(t*3.5)*2;
    poly(c,p.blue,[-24,-23,22,-23,42,84,-45,84]);
    poly(c,p.paper,[-20,-23,-3,-5,-9,20]);
    poly(c,p.paper,[19,-23,3,-5,9,20]);
    oval(c,0,-56+bounce,18,23,p.paper);
    oval(c,-12,-74+bounce,17,14,p.dark);
    oval(c,4,-78+bounce,24,16,p.dark);
    oval(c,20,-69+bounce,13,15,p.dark);
    oval(c,7,-57+bounce,2,2,p.dark);
    line(c,p.red,2,[8,-43+bounce,17,-43+bounce]);
    line(c,p.blue,9,[-22,-15,-48,25,-39,49]);
    if(gesture) {
      const sweep=Math.sin(t*2)*9;
      line(c,p.blue,9,[22,-15,47,-54,76+sweep,-65]);
      oval(c,77+sweep,-65,7,6,p.paper);
    } else line(c,p.blue,9,[21,-15,46,19,39,48]);
    line(c,p.dark,12,[-20,82,-22,129]); line(c,p.dark,12,[19,82,23,129]);
    if(handbag) {
      line(c,p.dark,3,[-38,37,-56,37,-61,66]);
      rect(c,-72,57,33,29,p.dark);
      line(c,p.light,2,[-67,58,-45,58]);
    }
    if(child) {
      oval(c,0,-77,34,12,p.dark);
      rect(c,-24,49,48,6,p.paper);
    }
    c.restore();
  }
  function grantham(c,p,t,pulse) {
    rect(c,72,91,584,341,p.paper); rect(c,72,91,584,63,p.dark);
    label(c,'ROBERTS  ·  GROCER',364,135,27,p.light,'center');
    for(let i=0;i<4;i++) {
      rect(c,110+i*128,174,91,171,p.dark); rect(c,115+i*128,180,81,160,p.horizon);
      for(let row=0;row<3;row++) {
        rect(c,119+i*128,219+row*39,73,4,p.dark);
        for(let j=0;j<3;j++) oval(c,130+i*128+j*24,209+row*39,8+pulse*2,11,p.red);
      }
    }
    rect(c,153,352,422,17,p.dark);
    oval(c,705,335,64,17,p.ground);
    woman(c,705,326,.53,p,t,{child:true,handbag:false});
    for(let i=0;i<5;i++) oval(c,108+i*91,370+Math.sin(t+i)*4,5,3,p.light);
  }
  function parliament(c,p,t,pulse) {
    rect(c,0,311,960,146,p.dark);
    for(let side of [-1,1]) for(let row=0;row<3;row++) {
      const x=side<0?18:560;
      rect(c,x+row*34,192+row*68,340-row*25,36,p.blue);
      for(let i=0;i<5;i++) oval(c,x+28+i*61+row*27,173+row*68,13,15,p.paper);
    }
    rect(c,405,212,136,174,p.paper); rect(c,424,228,99,126,p.dark);
    line(c,p.light,5,[473,234,473,365]); oval(c,473,228,15+pulse*4,9,p.light);
    woman(c,470,300,.73,p,t,{gesture:true});
    for(let i=0;i<5;i++) line(c,p.light,2,[430,253+i*17,513,253+i*17]);
  }
  function iron(c,p,t,pulse) {
    for(let i=0;i<11;i++) {
      const x=55+i*88;
      rect(c,x,100,13,304,p.dark);
      oval(c,x+6,154+(i%3)*63,5+pulse*4,5+pulse*4,p.red);
    }
    rect(c,100,125,292,224,p.paper); rect(c,113,138,266,198,p.dark);
    label(c,'IRON',248,220,65,p.light,'center');
    label(c,'LADY',248,288,65,p.red,'center');
    woman(c,677,302,1.06,p,t,{gesture:true});
    for(let i=0;i<8;i++) {
      const x=390+i*72,y=91+(i%3)*48;
      line(c,p.light,1,[x,y,x+38+Math.sin(t*2+i)*14,y+16]);
    }
  }
  function numberTen(c,p,t,pulse) {
    rect(c,222,91,516,352,p.paper);
    for(let i=0;i<2;i++) for(let j=0;j<3;j++) {
      const x=264+i*317,y=135+j*88;
      rect(c,x,y,106,67,p.dark);
      line(c,p.light,3,[x+53,y,x+53,y+67]);
      line(c,p.light,3,[x,y+33,x+106,y+33]);
    }
    rect(c,395,187,169,260,p.dark); label(c,'10',479,268,69,p.paper,'center');
    oval(c,528,336,5+pulse*2,5+pulse*2,p.light);
    rect(c,394,181,170,8,p.light);
    woman(c,327,312,.73,p,t,{gesture:true});
    for(let i=0;i<12;i++) oval(c,45+i*83,395+(i%2)*17,8+pulse*5,5,p.red);
  }
  function falklands(c,p,t,pulse) {
    rect(c,0,282,960,182,p.sky);
    for(let row=0;row<5;row++) line(c,p.light,2,[0,310+row*31,960,310+row*31]);
    for(let i=0;i<4;i++) {
      const x=(i*295+t*(18+i*6))%1200-120,y=323+i%2*36;
      poly(c,p.dark,[x-105,y,x+115,y,x+84,y+29,x-80,y+29]);
      rect(c,x-28,y-46,60,46,p.dark); rect(c,x+2,y-71,8,25,p.dark);
      line(c,p.dark,2,[x+6,y-71,x+6,y-97]);
      for(let k=0;k<3;k++) oval(c,x-110-k*23,y+22+Math.sin(t*2+k)*4,13,3,p.paper);
    }
    rect(c,590,91,254,177,p.paper);
    poly(c,p.ground,[620,119,689,135,724,185,669,224,627,186]);
    poly(c,p.ground,[740,153,792,126,811,175,768,221]);
    line(c,p.red,4,[614,248,672,218,724,227,785,185]);
    label(c,'SOUTH ATLANTIC',715,113,16,p.dark,'center');
  }
  function coalfields(c,p,t,pulse) {
    rect(c,0,88,479,357,p.dark); rect(c,481,88,479,357,p.paper);
    for(let i=0;i<5;i++) {
      const x=52+i*91;
      rect(c,x,210+(i%2)*18,41,179,p.ground);
      poly(c,p.ground,[x-15,211+(i%2)*18,x+18,150+(i%2)*18,x+57,211+(i%2)*18]);
      oval(c,x+19,393,22+pulse*4,8,p.paper);
    }
    for(let i=0;i<9;i++) {
      const x=35+i*52;
      oval(c,x,296+Math.sin(t*2+i)*4,12,13,p.paper);
      line(c,p.paper,11,[x,310,x+Math.sin(t*2+i)*6,369]);
      if(i%3===0) line(c,p.red,4,[x+3,320,x+19,300]);
    }
    woman(c,691,310,.87,p,t,{gesture:true});
    line(c,p.red,5,[480,90,480,445]);
    label(c,'PICKET',240,129,25,p.light,'center');
    label(c,'POLICY',722,129,25,p.dark,'center');
    for(let i=0;i<6;i++) line(c,p.red,1,[493,185+i*31,947,185+i*31]);
  }
  function thaw(c,p,t,pulse) {
    rect(c,0,116,960,310,p.sky);
    for(let i=0;i<12;i++) {
      const x=i*90+Math.sin(t*1.3+i)*13;
      poly(c,i%2?p.light:p.paper,[x,116,x+38,171,x+47,247,x-4,208]);
    }
    line(c,p.red,5,[480,110,480,421]);
    for(let i=0;i<7;i++) {
      const y=147+i*36;
      line(c,p.light,2,[450-Math.sin(t+i)*i*5,y,515+Math.sin(t+i)*i*5,y]);
    }
    woman(c,330,312,.91,p,t,{gesture:true});
    rect(c,655,254,95,137,p.dark); oval(c,703,226,29,31,p.paper);
    rect(c,665,187,78,21,p.dark);
    line(c,p.paper,11,[667,303,583,289]);
    line(c,p.paper,11,[394,306,583,289]);
    oval(c,582,289,13+pulse*4,9,p.light);
    label(c,'TALK ACROSS THE DIVIDE',480,468,25,p.light,'center');
  }
  function departure(c,p,t,pulse) {
    rect(c,187,86,581,355,p.paper);
    rect(c,385,161,185,278,p.dark);
    rect(c,386,149,184,12,p.light);
    label(c,'10',478,245,75,p.paper,'center');
    oval(c,541,319,7,7,p.light);
    const walk=Math.min(t*22,210);
    woman(c,635-walk,305,.86,p,t,{handbag:true});
    for(let i=0;i<7;i++) {
      const x=24+i*151;
      oval(c,x,392,21,16,p.dark);
      line(c,p.dark,11,[x,405,x,449]);
    }
    for(let i=0;i<9;i++) {
      const x=35+i*114;
      rect(c,x,456,70,4,i%2?p.red:p.blue);
    }
    label(c,'THE ARGUMENTS CONTINUE',480,476,23,p.light,'center');
  }
  const scenes=[grantham,parliament,iron,numberTen,falklands,coalfields,thaw,departure];
  function draw(c,width,height,now,options={}) {
    const dt=last===null?0:clamp((now-last)/1000,0,.08);
    last=now;
    if(options.animate!==false) time+=dt*clamp(Number(options.speed)||1,.35,3);
    const chapter=Math.floor(time/8.7)%chapters.length;
    const local=time%8.7;
    const pulse=clamp((options.bass||0)*.8+(options.mid||0)*.5+(options.treble||0)*.3,0,1);
    const form=palettes[options.form]?options.form:'steel';
    const p=palettes[form];
    c.save(); c.scale(width/960,height/540);
    background(c,p,time,pulse);
    scenes[chapter](c,p,local,pulse);
    if(form==='ink') {
      c.globalAlpha=.19;
      for(let i=0;i<22;i++) line(c,p.dark,1,[0,i*23+Math.sin(time+i)*2,960,i*23+Math.sin(time+i)*2]);
      c.globalAlpha=1;
    } else if(form==='coal') {
      c.globalAlpha=.22;
      for(let i=0;i<35;i++) {
        const x=(i*177)%960,y=110+(i*113)%350;
        oval(c,x+Math.sin(time*2+i)*8,y,2+pulse*6,4+pulse*7,p.red);
      }
      c.globalAlpha=1;
    } else if(form==='neon') {
      c.globalAlpha=.2;
      for(let i=0;i<6;i++) line(c,i%2?p.blue:p.red,4,[i*191,80,i*191+Math.sin(time+i)*70,435]);
      c.globalAlpha=1;
    } else {
      c.globalAlpha=.12;
      for(let i=0;i<30;i++) rect(c,(i*239+time*14)%960,(i*117)%490,2,2,p.paper);
      c.globalAlpha=1;
    }
    rect(c,0,0,960,69,'rgba(7,12,22,.77)');
    label(c,chapters[chapter][0],24,44,24,p.light);
    label(c,chapters[chapter][1],480,44,30,p.paper,'center');
    rect(c,0,498,960,42,'rgba(7,12,22,.82)');
    label(c,chapters[chapter][2],22,525,17,p.paper);
    for(let i=0;i<chapters.length;i++) rect(c,707+i*29,518,20,5,i===chapter?p.red:p.light);
    c.restore();
    return {chapter:chapters[chapter][1],index:chapter,form,pulse,time};
  }
  return {recipes,chapters,draw,reset};
})();
