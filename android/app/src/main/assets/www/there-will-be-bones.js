window.ThereWillBeBones = (() => {
  const subjects = [
    { name: 'VOLE', caption: 'A small life, all delicate engineering', scale: 1.55, draw: vole },
    { name: 'DUCK', caption: 'The anatomy of an improbable walk', scale: 1.55, draw: duck },
    { name: 'HUMAN', caption: 'A familiar arrangement of calcium', scale: 1.75, draw: human },
    { name: 'DINOSAUR', caption: 'Old thunder, neatly articulated', scale: 1.15, draw: dinosaur },
    { name: 'HUNTER-KILLER', caption: 'Titanium remembers its orders', scale: 1.75, draw: android },
    { name: 'AFTER HOURS', caption: 'Stockings: a decision was made', scale: 1.75, draw: glamour },
  ];
  const recipes = [
    { name: 'Cabinet of Curiosities', form: 'cabinet', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'X-Ray Nocturne', form: 'xray', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Fossil Fever', form: 'fossil', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
    { name: 'Midnight Cabaret', form: 'cabaret', theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 0 },
  ];
  const palettes = {
    cabinet: { sky: '#132229', floor: '#1f302f', bone: '#eee2bc', shadow: '#7d9b91', accent: '#dfaa61', ink: '#07151b' },
    xray: { sky: '#05172c', floor: '#0a3250', bone: '#8de7ee', shadow: '#30758b', accent: '#c6fbff', ink: '#031222' },
    fossil: { sky: '#51372d', floor: '#86624a', bone: '#e7bd86', shadow: '#a17a5c', accent: '#ffd990', ink: '#34231d' },
    cabaret: { sky: '#331a35', floor: '#532940', bone: '#f5d5d8', shadow: '#a87596', accent: '#ff8db4', ink: '#271522' },
  };
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  let time = 0;
  let last = null;

  function reset() { time = 0; last = null; }
  function line(c, colour, width, points) {
    c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.stroke();
  }
  function ellipse(c, x, y, rx, ry, colour, filled = true) {
    c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, Math.PI * 2);
    if (filled) { c.fillStyle = colour; c.fill(); }
    else { c.strokeStyle = colour; c.stroke(); }
  }
  function bone(c, x1, y1, x2, y2, width, p) {
    line(c, p.shadow, width + 3, [x1, y1, x2, y2]);
    line(c, p.bone, width, [x1, y1, x2, y2]);
    ellipse(c, x1, y1, width * .61, width * .61, p.bone);
    ellipse(c, x2, y2, width * .61, width * .61, p.bone);
  }
  function skull(c, x, y, rx, ry, p, { beak = false, metal = false } = {}) {
    ellipse(c, x, y, rx, ry, metal ? p.shadow : p.bone);
    if (metal) {
      line(c, p.bone, 3, [x-rx*.8,y-ry*.25,x-rx*.6,y-ry*.75,x+rx*.6,y-ry*.75,x+rx*.8,y-ry*.25]);
    }
    ellipse(c, x-rx*.34, y-ry*.07, rx*.21, ry*.24, metal ? '#fa4b49' : p.ink);
    ellipse(c, x+rx*.34, y-ry*.07, rx*.21, ry*.24, metal ? '#fa4b49' : p.ink);
    if (beak) {
      line(c, p.bone, 8, [x+rx*.72,y+ry*.28,x+rx*1.85,y+ry*.39]);
      line(c, p.shadow, 3, [x+rx*.75,y+ry*.51,x+rx*1.55,y+ry*.52]);
    } else {
      ellipse(c, x, y+ry*.65, rx*.23, ry*.14, p.ink);
      line(c, p.shadow, 2, [x-rx*.48,y+ry*.71,x,y+ry*.82,x+rx*.48,y+ry*.71]);
      for (let i=-2; i<=2; i++) line(c, p.shadow, 1, [x+i*rx*.15,y+ry*.71,x+i*rx*.15,y+ry*.86]);
    }
  }
  function ribs(c, x, y, width, height, p, count = 6) {
    bone(c, x, y-height*.55, x, y+height*.55, 4, p);
    for (let i=0; i<count; i++) {
      const yy = y-height*.45+i*height*.17;
      const spread = width * Math.sin((i+1)/(count+1)*Math.PI);
      for (const side of [-1,1]) {
        c.beginPath(); c.moveTo(x, yy-3);
        c.quadraticCurveTo(x+side*spread, yy-11, x+side*spread*.9, yy+9);
        c.quadraticCurveTo(x+side*spread*.76, yy+14, x+side*3, yy+6);
        c.lineWidth = 3; c.strokeStyle = p.bone; c.stroke();
      }
    }
  }
  function vertebrae(c, points, p, count) {
    for (let i=0; i<count; i++) {
      const u=i/(count-1), segment=(points.length/2)-1, at=u*segment, j=Math.min(segment-1,Math.floor(at)), f=at-j;
      const x=points[j*2]*(1-f)+points[(j+1)*2]*f;
      const y=points[j*2+1]*(1-f)+points[(j+1)*2+1]*f;
      ellipse(c,x,y,4.2,3.4,p.bone);
    }
  }
  function humanFrame(c, p, t, pulse, { metal = false, stockings = false } = {}) {
    const sway = Math.sin(t*1.7)*4 + pulse*3;
    c.save(); c.translate(sway,Math.sin(t*3.1)*2);
    skull(c,0,-123,22,25,p,{metal});
    bone(c,0,-98,0,-88,4,p);
    ribs(c,0,-66,26,48,p);
    bone(c,-17,-20,0,-12,7,p); bone(c,17,-20,0,-12,7,p);
    const armSwing = Math.sin(t*2.7)*9;
    for (const side of [-1,1]) {
      bone(c,side*21,-88,side*(32+armSwing*side),-48,6,p);
      bone(c,side*(32+armSwing*side),-48,side*(37+armSwing*side),-9,5,p);
      for(let finger=0;finger<3;finger++) bone(c,side*(37+armSwing*side),-9,side*(40+finger*3+armSwing*side),2+finger*2,1.8,p);
      const step = Math.sin(t*2.7+side)*10;
      bone(c,side*10,-9,side*(14+step),37,8,p);
      bone(c,side*(14+step),37,side*(16+step*.6),82,6,p);
      if (stockings) {
        c.fillStyle = '#bd5790b8';
        c.beginPath(); c.moveTo(side*6,20); c.lineTo(side*(20+step),21);
        c.lineTo(side*(22+step*.6),82); c.lineTo(side*(10+step*.6),82); c.closePath(); c.fill();
        line(c,p.accent,3,[side*6,22,side*(20+step),22]);
        line(c,p.accent,2,[side*(17+step*.6),82,side*(21+step*.6),88]);
      }
      bone(c,side*(16+step*.6),82,side*(28+step*.6),85,3,p);
    }
    if (metal) {
      ellipse(c,0,-65,8+pulse*3,8+pulse*3,'#ec493e');
      line(c,p.accent,2,[-13,-78,13,-78]);
      line(c,p.accent,2,[-15,-40,15,-40]);
    }
    c.restore();
  }
  function human(c,p,t,pulse) { humanFrame(c,p,t,pulse); }
  function android(c,p,t,pulse) { humanFrame(c,p,t,pulse,{metal:true}); }
  function glamour(c,p,t,pulse) {
    humanFrame(c,p,t,pulse,{stockings:true});
    c.save(); c.translate(0,Math.sin(t*3.1)*2);
    c.strokeStyle=p.accent; c.lineWidth=4;
    c.beginPath(); c.arc(0,-126,30,Math.PI*1.15,Math.PI*1.85); c.stroke();
    c.restore();
  }
  function vole(c,p,t,pulse) {
    c.save(); c.translate(0,Math.sin(t*8)*3);
    vertebrae(c,[-78,-24,-35,-38,8,-36,43,-26],p,12);
    ribs(c,-10,-29,16,28,p,5);
    skull(c,49,-30,18,14,p);
    line(c,p.bone,3,[65,-30,78,-25,83,-20]);
    for(const x of [-43,13]) {
      bone(c,x,-25,x+Math.sin(t*8+x)*5,3,5,p);
      bone(c,x+Math.sin(t*8+x)*5,3,x+10,12,3,p);
    }
    vertebrae(c,[-74,-24,-103,-17,-129,-2,-143,17],p,9);
    c.restore();
  }
  function duck(c,p,t,pulse) {
    c.save(); c.translate(0,Math.sin(t*5)*5);
    ribs(c,-9,-25,43,53,p,7);
    vertebrae(c,[8,-47,24,-71,33,-97,42,-111],p,9);
    skull(c,46,-116,18,16,p,{beak:true});
    for(const side of [-1,1]) {
      bone(c,-9,-20,side*24,-41,5,p); bone(c,side*24,-41,side*42,-17,4,p);
      bone(c,side*7,8,side*(13+Math.sin(t*5+side)*7),44,6,p);
      bone(c,side*(13+Math.sin(t*5+side)*7),44,side*25,69,5,p);
      line(c,p.bone,3,[side*25,69,side*47,72,side*53,77]);
    }
    c.restore();
  }
  function dinosaur(c,p,t,pulse) {
    c.save(); c.translate(0,Math.sin(t*2.3)*4);
    vertebrae(c,[-115,-34,-58,-55,10,-55,76,-77],p,18);
    ribs(c,-8,-42,39,63,p,7);
    vertebrae(c,[-111,-32,-148,-23,-174,-5,-197,22],p,15);
    c.save(); c.translate(82,-83); c.rotate(Math.sin(t*3)*.1+pulse*.08);
    ellipse(c,16,-3,44,16,p.bone);
    line(c,p.shadow,8,[33,7,72,12]);
    for(let i=0;i<7;i++) line(c,p.bone,3,[i*13-18,8,i*13-14,17]);
    ellipse(c,27,-7,5,5,p.ink);
    c.restore();
    for(const side of [-1,1]) {
      bone(c,side*14,-18,side*(25+Math.sin(t*2+side)*12),28,10,p);
      bone(c,side*(25+Math.sin(t*2+side)*12),28,side*(39+Math.sin(t*2+side)*7),84,8,p);
      for(let claw=0;claw<3;claw++) line(c,p.bone,4,[side*39,84,side*(56+claw*4),87+claw*3]);
    }
    bone(c,40,-39,65,-20,4,p); bone(c,65,-20,74,-9,3,p);
    c.restore();
  }
  function backdrop(c,p,form,t,pulse) {
    const sky=c.createLinearGradient(0,0,0,500);
    sky.addColorStop(0,p.sky); sky.addColorStop(1,p.floor);
    c.fillStyle=sky; c.fillRect(0,0,900,500);
    if(form==='cabinet') {
      for(let i=0;i<5;i++) {
        const x=70+i*190;
        c.strokeStyle='#d5a87544'; c.lineWidth=4;
        c.beginPath(); c.moveTo(x-75,330); c.lineTo(x-75,90);
        c.quadraticCurveTo(x,15,x+75,90); c.lineTo(x+75,330); c.stroke();
      }
      line(c,p.accent,3,[30,361,870,361]);
    } else if(form==='xray') {
      c.strokeStyle='#85ddec20'; c.lineWidth=1;
      for(let x=0;x<900;x+=30) line(c,'#85ddec20',1,[x,0,x,500]);
      for(let y=0;y<500;y+=30) line(c,'#85ddec20',1,[0,y,900,y]);
      c.fillStyle='#a1edff16'; c.fillRect(0,(t*42)%540-30,900,30);
    } else if(form==='fossil') {
      for(let i=0;i<11;i++) line(c,'#f1c48824',3,[0,145+i*31+Math.sin(i)*8,900,145+i*31+Math.cos(i)*8]);
      for(let i=0;i<14;i++) ellipse(c,(i*163)%900,90+(i*73)%360,2+i%4,2,p.accent);
    } else {
      c.fillStyle='#170e20aa'; c.fillRect(0,0,125,500); c.fillRect(775,0,125,500);
      for(let i=0;i<5;i++) {
        line(c,'#e4639f66',5,[i*28,0,i*23+5,500]);
        line(c,'#e4639f66',5,[900-i*28,0,895-i*23,500]);
      }
      const spot=c.createRadialGradient(450,220,30,450,260,310);
      spot.addColorStop(0,'#ffb8dc34'); spot.addColorStop(1,'#ffb8dc00');
      c.fillStyle=spot; c.fillRect(130,0,640,500);
      line(c,p.accent,3,[160,378,740,378]);
    }
    for(let i=0;i<18;i++) {
      const x=(i*73+t*(8+i%3*9))%900;
      const y=75+(i*97)%300+Math.sin(t*2+i)*8;
      ellipse(c,x,y,1.3+pulse*(i%4===0?3:0),1.3,p.accent);
    }
  }
  function drawSubject(c,subject,x,y,scale,alpha,p,t,pulse,form) {
    c.save(); c.translate(x,y); c.scale(scale,scale); c.globalAlpha=alpha;
    if(form==='xray') { c.shadowColor=p.bone; c.shadowBlur=17; }
    subject.draw(c,p,t,pulse);
    c.restore();
  }
  function draw(c,w,h,now,opts={}) {
    const speed=clamp(Number(opts.speed)||1,.2,3);
    if(last===null) last=now;
    if(opts.animate!==false) time+=clamp((now-last)/1000,0,.08)*speed;
    last=now;
    const form=palettes[opts.form]?opts.form:'cabinet';
    const p=palettes[form], bass=clamp(Number(opts.bass)||0,0,1);
    const mid=clamp(Number(opts.mid)||0,0,1), treble=clamp(Number(opts.treble)||0,0,1);
    const pulse=bass*.65+mid*.25+treble*.1;
    const progress=time/9, index=Math.floor(progress)%subjects.length, phase=progress%1;
    const incoming=clamp((phase-.82)/.18,0,1);
    c.save(); c.scale(w/900,h/500);
    backdrop(c,p,form,time,pulse);
    ellipse(c,450,391,192+pulse*15,16,'#050b1290');
    const previous=subjects[(index+subjects.length-1)%subjects.length];
    const current=subjects[index];
    const next=subjects[(index+1)%subjects.length];
    drawSubject(c,previous,150,343,previous.scale*.4,.36,p,time,pulse,form);
    drawSubject(c,next,750,343,next.scale*.4,.36,p,time+.7,pulse,form);
    drawSubject(c,current,450-incoming*180,347,current.scale,1-incoming*.75,p,time,pulse,form);
    if(incoming>0) drawSubject(c,next,670-incoming*220,347,next.scale,incoming,p,time,pulse,form);
    c.fillStyle=p.accent; c.font='600 12px sans-serif';
    c.fillText('THERE WILL BE BONES',36,38);
    c.fillStyle=p.bone; c.font='600 24px sans-serif';
    c.fillText(subjects[index].name,36,71);
    c.font='13px sans-serif'; c.fillText(subjects[index].caption,36,93);
    c.fillStyle=p.shadow; c.font='12px monospace';
    c.fillText(`${String(index+1).padStart(2,'0')} / ${String(subjects.length).padStart(2,'0')}`,790,39);
    c.fillText(recipes.find(r=>r.form===form).name.toUpperCase(),36,465);
    c.restore();
    return { time, index, subject:subjects[index].name, form, pulse, incoming };
  }
  return { recipes, subjects, draw, reset };
})();
