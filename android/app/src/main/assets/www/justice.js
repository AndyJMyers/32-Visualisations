window.Justice = (() => {
  const forms = [['weight','The Weight of Gold'],['sealed','Verdict Under Seal'],['witness','The Last Witness'],['sentences','Five Sentences']];
  const recipes = forms.map(([form,name]) => ({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const tau = Math.PI*2, gold = '#ffd28a', paper = '#ffedd5';
  const cap = x => Math.max(0,Math.min(1,x));
  const ease = x => {x=cap(x);return x*x*(3-2*x);};
  function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(x,y,w,h);}
  function oval(c,color,x,y,rx,ry){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fillStyle=color;c.fill();
  }
  function line(c,color,width,points){
    c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p));
    if(width){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
    else{c.closePath();c.fillStyle=color;c.fill();}
  }
  function text(c,words,x,y,size,color){
    c.fillStyle=color;c.font=`bold ${size}px Georgia`;c.textAlign='center';c.fillText(words,x,y);
  }
  function document(c,x,y,scale,stamp=false){
    c.save();c.translate(x,y);c.scale(scale,scale);
    rect(c,'#0d142b70',-.27,-.34,.58,.75);
    line(c,paper,0,[[-.28,-.37],[.18,-.37],[.28,-.27],[.28,.36],[-.28,.36]]);
    line(c,'#d3b799',0,[[.18,-.37],[.18,-.27],[.28,-.27]]);
    for(let i=0;i<7;i++) rect(c,'#8c6f75',-.18,-.20+i*.061,i===6?.19:.35,.012);
    if(stamp){
      oval(c,'#a62d50',.138,.245,.062,.062);
      oval(c,'#dc7883',.138,.245,.037,.037);
    }
    c.restore();
  }
  function scales(c,a,arm,top,bass,treble,p){
    for(const side of [-1,1]){
      const x=side*arm*Math.cos(a), y=top+side*arm*Math.sin(a);
      line(c,gold,.037,[[0,top],[x,y]]);
      const pan=arm*.56;
      line(c,'#efad80',.014,[[x-pan*.86,y+.4],[x,y],[x+pan*.86,y+.4]]);
      line(c,gold,0,[[x-pan,y+.4],[x+pan,y+.4],[x-pan*.65,y+.47],[x+pan*.65,y+.47]]);
      if(p===null) continue;
      if(side<0) document(c,x,y+.26,.36);
      else for(let i=0;i<8;i++){
        const settle=ease((p-4.5-i*.48)/.38);
        if(p<4.5+i*.48)continue;
        oval(c,i%2?'#e89d55':gold,x+(i%3-1)*.067,y+.385-Math.floor(i/3)*.048-(1-settle)*.76,.048,.018+treble*.011);
      }
    }
    oval(c,gold,0,top,.052+bass*.022,.052+bass*.022);
  }
  function lady(c,x,y,s,t,bass,mid,treble,p=null){
    c.save();c.translate(x,y);c.scale(s,s);
    const bronze='#a86558', marble='#ffe0c4', shadow='#774456';
    oval(c,'#d8a9823b',0,-.41,.46,.46);
    oval(c,'#523046',-.037,-.45,.199,.254);
    line(c,bronze,0,[[-.148,-.31],[.12,-.31],[.224,-.224],[.145,.105],[.35,.76],[-.36,.76],[-.155,.106],[-.224,-.20]]);
    line(c,'#d39779',0,[[-.153,-.281],[.163,-.259],[-.057,.08],[-.18,.39],[-.254,.7],[-.094,.69],[.088,.15]]);
    line(c,shadow,.017,[[.064,.15],[.121,.37],[.264,.725]]);
    line(c,gold,.028,[[-.153,.089],[.145,.095]]);
    oval(c,marble,0,-.443,.14,.184);
    line(c,shadow,.012,[[.034,-.437],[.056,-.384],[.012,-.378]]);
    line(c,'#784752',.012,[[-.024,-.34],[.061,-.349]]);
    const ribbon=Math.sin(t*2.4)*(.027+mid*.048);
    line(c,'#33233e',0,[[-.148,-.504],[.15,-.485],[.16,-.434],[-.145,-.449],[-.306,-.399+ribbon],[-.274,-.476],[-.334,-.507+ribbon]]);
    const hx=.67, hy=-.23;
    line(c,bronze,.115,[[.151,-.215],[.394,-.127],[hx,hy]]);
    oval(c,marble,hx,hy,.049,.049);
    line(c,gold,.019,[[hx,hy+.015],[hx,hy+.16]]);
    const bought=p===null?0:ease((p-5)/4);
    const a=.42*bought+Math.sin(t*3.2)*(.023+mid*.037)*(1-bought*.63);
    c.save();c.translate(hx,hy+.16);scales(c,a,.36,0,bass,treble,p);c.restore();
    line(c,bronze,.115,[[-.157,-.209],[-.374,-.126],[-.48,.086]]);
    oval(c,marble,-.48,.086,.044,.049);
    c.save();c.translate(-.48,.086);c.rotate(-.22);
    line(c,'#abacc6',0,[[-.037,.057],[.037,.057],[.028,.62],[0,.733],[-.028,.62]]);
    line(c,'#e0eaff',.014,[[0,.077],[0,.68]]);
    line(c,gold,.037,[[-.104,.062],[.104,.062]]);
    oval(c,gold,0,-.097,.033,.033);
    c.restore();c.restore();
  }
  function weight(c,X,Y,p,t,bass,mid,treble){
    for(let i=-4;i<=4;i++){
      const x=i*X*.23;
      rect(c,'#55374155',x-.044,-Y,.088,Y*1.72);
    }
    lady(c,-.29,0,Math.min(1.17,X*.88),t,bass,mid,treble,p);
    const bought=ease((p-5)/4);
    return { verdict:bought>.8?'bought':'weighing' };
  }
  function sealed(c,X,Y,p,t,bass,mid,treble){
    const shut=ease((p-8)/3.5), ribbons=Math.min(7,Math.max(0,Math.floor((p-3)/.79)));
    for(let i=-4;i<=4;i++){
      const x=i*X*.26;
      line(c,'#38334d',.025,[[x,-Y],[x*.76,Y]]);
    }
    lady(c,-X*.56,-.22,.57,t,bass,mid,treble);
    document(c,X*.17,.11,1.28,true);
    for(let i=0;i<ribbons;i++){
      const y=-.36+i*.135, end=ease((p-3-(i+1)*.79)/.46);
      line(c,i%2?'#9e294b':'#c13e58',.066+bass*.018,[[X*.17-.37,y+Math.sin(t+i)*.04],[X*.17-.37+.74*end,y+mid*.023]]);
    }
    const width=.48, bar=width*shut, centre=X*.17;
    for(const side of [-1,1]){
      rect(c,'#171723',side<0?centre-width:centre+width-bar,-.43,bar,1.04);
      if(bar>0){
        const edge=centre+side*(width-bar);
        rect(c,'#785066',edge-(side<0?.025:0),-.43,.025,1.04);
        oval(c,'#ba807b',edge+side*.095,.18,.019+treble*.015,.031);
      }
    }
    return { verdict:shut>.96?'buried':'being sealed' };
  }
  function witness(c,X,Y,p,t,bass,mid,treble){
    const reveal=ease((p-2)/3.3), multiply=ease((p-7)/3.8);
    const gx=-Math.min(X*.63,.74), gy=.71;
    line(c,'#192339',0,[[-X,Y],[-X,.68],[X,.68],[X,Y]]);
    lady(c,X*.41,-.25,.60,t,bass,mid,treble);
    line(c,'#284355',0,[[gx-.28,gy],[gx-.23,.12],[gx,.009],[gx+.22,.18],[gx+.31,gy]]);
    oval(c,'#c79282',gx+.018,.002,.104,.137);
    line(c,'#284355',0,[[gx-.11,.054],[gx-.126,-.081],[gx,-.16],[gx+.12,-.068],[gx+.041,-.072]]);
    line(c,'#597b8a',.08,[[gx+.11,.26],[gx+.28,.45],[gx+.46,.37-reveal*.17]]);
    const x=gx+.55,y=.37-reveal*.17;
    const r=.45+bass*.13;
    const g=c.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'#ffe9a2a3');g.addColorStop(1,'#ffc57000');
    oval(c,g,x,y,r,r);
    document(c,x+.12,y+.15,.56,true);
    for(let i=0;i<5;i++){
      const q=cap(multiply*1.7-i*.16);
      if(q===0)continue;
      const dx=x+(X*.72-x)*q, dy=y-q*(.32+i*.094)+Math.sin(t+i)*mid*.035;
      c.save();c.globalAlpha=q*.89;
      document(c,dx,dy,.29+treble*.055);
      c.restore();
    }
    return { verdict:multiply>.8?'preserved':'witnessing' };
  }
  function sentences(c,X,Y,p,t,bass,mid,treble){
    const beat=t%25, index=Math.floor(beat/5), age=beat%5;
    const x=Math.min(X*.34,.66);
    lady(c,-X*.56,-.04,.58,t,bass,mid,treble);
    const r=.65+bass*.13;
    const glow=c.createRadialGradient(x,.13,0,x,.13,r);
    glow.addColorStop(0,'#df98695e');glow.addColorStop(1,'#df986900');
    oval(c,glow,x,.13,r,r);
    c.save();c.translate(x,.08);c.globalAlpha=Math.min(ease(age/.55),ease((5-age)/.48));
    const figure=(xx,yy,color='#21192b')=>{
      oval(c,color,xx,yy-.24,.081,.096);
      line(c,color,0,[[xx-.095,yy-.145],[xx+.085,yy-.145],[xx+.125,yy+.18],[xx-.124,yy+.18]]);
    };
    let outcome;
    if(index===0){
      const strike=ease((age-2.25)/.29);
      const fall=ease((age-2.53)/.92);
      rect(c,'#271a2b',-.51,.35,1.02,.12);
      c.save();c.translate(0,.19);
      line(c,'#21192b',0,[[-.095,-.145],[.085,-.145],[.125,.18],[-.124,.18]]);
      oval(c,'#21192b',fall*.44,-.24+fall*.56,.081,.096);
      c.restore();
      c.save();c.translate(-.22,-.49);c.rotate(-.78+strike*2.28);
      line(c,'#181525',.042,[[0,0],[0,.53]]);
      line(c,'#181525',0,[[0,.40],[.19,.38],[.21,.54],[0,.51]]);
      c.restore();
      outcome='Execution';
    }else if(index===1||index===4){
      const swing=ease((age-1.25)/1.34);
      const opening=index===4?swing:1-swing;
      const walk=index===4?ease((age-2.1)/2):0;
      rect(c,index===4?'#e9b77d':'#745275',-.37,-.46,.74,.87);
      figure(-.055+walk*.49,.13-walk*.035);
      const width=.67*(1-opening);
      c.save();c.beginPath();c.rect(-.35,-.45,width,.86);c.clip();
      for(let i=0;i<7;i++)rect(c,'#291e35',-.35+i*.107,-.45,.035,.86);
      rect(c,'#291e35',-.35,.07,.68,.064);c.restore();
      c.strokeStyle='#49354b';c.lineWidth=.049;c.strokeRect(-.38,-.47,.76,.89);
      outcome=index===4?'Released':'Imprisoned';
    }else if(index===2){
      const drift=ease((age-.6)/4), sx=-.32+drift*.65, sy=.16+Math.sin(t*2)*.034;
      for(let i=0;i<9;i++){
        const y=.19+i*.042, shift=Math.sin(t*1.8+i)*.08;
        line(c,'#9eacbc80',.013,[[-.58+shift,y],[.59+shift,y]]);
      }
      c.save();c.translate(sx,sy);c.scale(1-drift*.40,1-drift*.40);
      line(c,'#281f34',0,[[-.31,.01],[.38,.01],[.25,.13],[-.21,.13]]);
      line(c,'#493650',.027,[[.025,.02],[.025,-.43]]);
      line(c,'#e1c09e',0,[[-.17,-.34],[.025,-.42],[.235,-.29],[.17,-.065],[-.16,-.065]]);
      c.restore();
      outcome='Transported';
    }else{
      rect(c,'#151428',-.49,-.41,.98,.83);
      const shutter=ease((age-1.18)/2.2);
      line(c,'#ddac85',0,[[-.12,-.34],[.13,-.34],[.40-shutter*.16,.40],[-.38+shutter*.16,.40]]);
      figure(0,.20);
      rect(c,'#151428',-.5,-.42,.98,shutter*.78);
      outcome='Under Duress';
    }
    text(c,outcome,0,.68,.10,paper);
    c.restore();
    return {verdict:outcome};
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}){
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)), t=Math.max(0,time/1000), p=t%17;
    const s=Math.min(w*.39,h*.41), X=w/(2*s), Y=h/(2*s);
    const colors=[['#261629','#805153'],['#13152b','#57384c'],['#0c1b31','#32505e'],['#17152b','#65394a']][cast];
    c.save();c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const sky=c.createLinearGradient(0,-Y,0,Y);
    sky.addColorStop(0,colors[0]);sky.addColorStop(1,colors[1]);rect(c,sky,-X,-Y,2*X,2*Y);
    const state=[weight,sealed,witness,sentences][cast](c,X,Y,p,t,bass,mid,treble);
    text(c,'VIII  /  JUSTICE',0,-Y*.78,.15,paper);
    c.restore();
    return {scene:forms[cast][0],...state};
  }
  return {forms,recipes,draw};
})();
