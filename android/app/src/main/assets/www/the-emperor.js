window.TheEmperor = (() => {
  const forms = [['builder', 'The Builder'], ['claimants', 'Too Many Emperors'], ['audience', 'The Last Audience']];
  const recipes = forms.map(([form, name]) => ({ name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6 }));
  const tau = Math.PI * 2;
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x*x*(3-2*x); };
  const gold = '#ffd18a', ink = '#22152a';
  function rect(c,color,x,y,w,h) { c.fillStyle=color;c.fillRect(x,y,w,h); }
  function path(c,color,points,width=0) {
    c.beginPath();c.moveTo(...points[0]);
    points.slice(1).forEach(p=>c.lineTo(...p));
    if(width){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
    else {c.closePath();c.fillStyle=color;c.fill();}
  }
  function orb(c,color,x,y,r) { c.beginPath();c.arc(x,y,r,0,tau);c.fillStyle=color;c.fill(); }
  function crown(c,x,y,s,color) {
    path(c,color,[[x-s,y],[x-s*1.1,y-s*.72],[x-s*.43,y-s*.43],[x,y-s],[x+s*.43,y-s*.43],[x+s*1.1,y-s*.72],[x+s,y]]);
  }
  function throne(c,x,y,s,pose,robe='#87394d',crownDrop=0) {
    c.save();c.translate(x,y);c.scale(s,s);
    path(c,'#632f3a',[[-.7,.56],[-.64,-.67],[-.46,-.91],[.46,-.91],[.64,-.67],[.7,.56]]);
    rect(c,'#9e4b4a',-.63,-.7,.08,1.14);rect(c,'#9e4b4a',.55,-.7,.08,1.14);
    rect(c,'#361e2c',-.78,.50,1.56,.15);rect(c,'#733a44',-.87,.64,1.74,.11);
    path(c,robe,[[-.28,-.34],[.24,-.34],[.41,.31],[.51,.53],[-.5,.53],[-.36,.2]]);
    path(c,gold,[[-.23,-.28],[.09,-.08],[.25,.44]],.043);
    orb(c,'#e6ac83',0,-.48,.155);
    path(c,'#b38179',[[-.11,-.45],[0,-.31],[.11,-.45],[.08,-.53],[-.08,-.53]]);
    path(c,ink,[[.024,-.52],[.086,-.52]],.015);
    crown(c,0,-.59-crownDrop,.17,gold);
    const hand=[.52+pose*.11,-.42+pose*.64];
    path(c,robe,[[.22,-.24],[.36,.015],hand],.135);
    orb(c,'#e6ac83',...hand,.053);
    path(c,gold,[[hand[0]+.04,hand[1]+.28],[hand[0]-.12*pose,hand[1]-.31]],.027);
    orb(c,gold,hand[0]-.12*pose,hand[1]-.31,.057);
    c.restore();
  }
  function sky(c,X,Y,top,bottom) {
    const g=c.createLinearGradient(0,-Y,0,Y);
    g.addColorStop(0,top);g.addColorStop(1,bottom);
    rect(c,g,-X,-Y,2*X,2*Y);
  }
  function builder(c,X,Y,t,bass,mid,treble) {
    const phase=t%16, command=ease((phase-1.2)/1.35), roads=ease((phase-2.35)/2.5);
    sky(c,X,Y,'#291d3c','#bc7152');
    orb(c,'#ffcc8360',X*.63,-Y*.48,.38+bass*.15);
    path(c,'#573248',[[-X,Y],[-X,.31],[-X*.65,-.12],[-X*.32,.28],[X*.22,.13],[X*.56,-.09],[X,.28],[X,Y]]);
    for(let i=-3;i<=3;i++){
      const x=i*X*.36;
      path(c,'#e5ae74',[[0,.05],[x*roads,.05+(Y-.05)*roads]],.022+bass*.016);
    }
    const spacing=Math.min(.27,X/5.15);
    for(let i=-4;i<=4;i++){
      const x=i*spacing, build=ease((phase-4.75-Math.abs(i)*.48)/1.25);
      if(build>0) {
        c.save();c.translate(x,.61);c.scale(1,build);
        c.beginPath();c.moveTo(-spacing*.49,.24);c.lineTo(-spacing*.49,.03);
        c.quadraticCurveTo(0,-.26,spacing*.49,.03);c.lineTo(spacing*.49,.24);
        c.strokeStyle='#ffbd84';c.lineWidth=.037;c.stroke();c.restore();
      }
    }
    for(let i=0;i<38;i++){
      const delay=(i%11)*.29, rise=ease((phase-7.1-delay)/1.5);
      const x=Math.sin(i*4.3)*X*.94, y=.97+(i%7)*.035, height=(.06+i%5*.056)*rise;
      rect(c,'#38243b',x,y-height,.069,height);
      if(rise>.75 && (i%4 || Math.sin(t*4+i)+treble>0)) rect(c,gold,x+.022,y-height+.024,.02,.023);
    }
    throne(c,0,-Y*.34,.66,command*(1-ease((phase-11)/2)));
    return { phase: phase<2.35?'command':phase<4.75?'roads':phase<7.1?'aqueduct':'city' };
  }
  function claimants(c,X,Y,t,bass,mid) {
    const phase=t%19, count=Math.min(5,1+Math.floor(phase/3.15));
    const pull=ease(phase/14), half=Math.min(X*.95,.6+pull*2.8);
    const cell=2*half/count;
    sky(c,X,Y,'#281b37','#7c574c');
    rect(c,'#514435',-half,-.46,2*half,1.35);
    for(let i=0;i<count;i++){
      const x=-half+(i+.5)*cell, age=phase-i*3.15;
      const appear=ease(age/.85), drop=(1-ease(age/1.4))*.52;
      const color=['#a8574e','#af764b','#816357','#67547d','#905068'][i];
      const width=cell*(.96-bass*.025);
      path(c,color,[[x-width/2,-.46],[x+width/2,-.46],[x+width/2,.89],[x-width/2,.89]]);
      const edge=x-cell/2;
      if(i>0) {
        const jag=.027+mid*.05;
        path(c,gold,[[edge,-.58],[edge-jag,-.12],[edge+jag,.33],[edge,.94]],.017);
      }
      const s=Math.min(.87-pull*.22,cell*.49);
      if(appear>0) throne(c,x,-.15,s*appear,.26+Math.sin(t*1.7+i)*.16,color,drop);
      const pedestal=Math.min(width*.43,.33+i*.045);
      rect(c,'#392838',x-pedestal,.77,2*pedestal,.15);
      const statue=(.14+i*.088)*appear;
      rect(c,'#cfad87',x-.052,.75-statue,.104,statue);
      if(appear>.02){orb(c,'#f0c79c',x,.75-statue,.055+i*.011);crown(c,x,.72-statue,.057+i*.013,gold);}
    }
    return { count };
  }
  function audience(c,X,Y,t,bass,mid,treble) {
    sky(c,X,Y,'#080b20','#2a2031');
    for(const side of [-1,1])for(let i=0;i<4;i++){
      const x=side*(.84+i*X*.16);
      rect(c,'#332038',x-.08,-Y,.16,Y*1.45);
      path(c,'#532c45',[[x-.13,-Y],[x+.13,-Y],[x+.14,.15+Math.sin(t*2+i)*(.025+mid*.08)],[x,.07],[x-.13,.16]]);
    }
    rect(c,'#151526',-X,.46,2*X,Y-.46);
    const memory=ease((t%15-4)/2)*(1-ease((t%15-10)/2));
    c.save();c.globalAlpha=memory*.45;c.translate(0,.53);c.scale(1,.51);
    for(let i=0;i<18;i++){
      const x=(i/17-.5)*Math.min(X*1.72,3.4), h=.23+i%4*.07;
      rect(c,i%3?'#825d7d':'#b08a93',x-.051,0,.102,h);
      orb(c,'#d9a7a4',x,h,.048);
    }
    c.restore();
    path(c,'#a5859860',[[-X,.47],[X,.47]],.016);
    const gesture=(1-ease((t%15-2)/2))+ease((t%15-10.8)/2.5);
    throne(c,0,-.16,.82,1-clamp(gesture),'#694056');
    const x=Math.min(X*.73,.93), y=.41;
    const g=c.createRadialGradient(x,y,0,x,y,.45+bass*.12);
    g.addColorStop(0,'#ffc96c76');g.addColorStop(1,'#ff994400');
    rect(c,g,x-.63,y-.63,1.26,1.26);
    rect(c,'#a3836c',x-.053,y,.106,.13);
    orb(c,gold,x+Math.sin(t*6)*.012,y-.028,.036+treble*.022);
    return { memory };
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}) {
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)), t=Math.max(0,time/1000);
    const s=Math.min(w*.39,h*.36), X=w/(2*s), Y=h/(2*s);
    c.save();c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const action=cast===0?builder(c,X,Y,t,bass,mid,treble):cast===1?claimants(c,X,Y,t,bass,mid):audience(c,X,Y,t,bass,mid,treble);
    c.fillStyle=gold;c.textAlign='center';
    c.font='bold 0.16px Georgia';c.fillText('IV  /  THE EMPEROR',0,-Y*.78);
    c.font='0.11px Georgia';c.fillText(forms[cast][1],0,Y*.91);
    c.restore();
    return { scene:forms[cast][0], ...action };
  }
  return { forms, recipes, draw };
})();
