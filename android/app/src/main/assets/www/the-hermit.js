window.TheHermit = (() => {
  const forms = [['study','By Lamplight'],['watch','The Patient Watch'],['woods','The Woodland Path'],['fungi','A Basket of Autumn'],['bees','The Quiet Apiary']];
  const recipes = forms.map(([form,name])=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const tau=Math.PI*2, linen='#f6dfb4';
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const wrap=(x,d)=>x-Math.floor(x/d)*d;
  const mix=(a,b,t)=>a+(b-a)*t;
  function rect(c,col,x,y,w,h){c.fillStyle=col;c.fillRect(x,y,w,h);}
  function oval(c,col,x,y,rx,ry,angle=0){
    c.beginPath();c.ellipse(x,y,rx,ry,angle,0,tau);c.fillStyle=col;c.fill();
  }
  function path(c,col,points,width=0){
    c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p));
    if(width){c.lineWidth=width;c.strokeStyle=col;c.stroke();}
    else{c.closePath();c.fillStyle=col;c.fill();}
  }
  function glow(c,x,y,r,color){
    const g=c.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,color+'a6');g.addColorStop(1,color+'00');oval(c,g,x,y,r,r);
  }
  function hermit(c,x,y,s,t,pose={}){
    const {lean=0,reach=[.28,-.16],walk=0,coat='#485d55',hands,look=0,glasses=0,adjust=0}=pose;
    c.save();c.translate(x,y);c.scale(s,s);c.rotate(lean);
    const gait=Math.sin(t*5.1)*.19*walk;
    for(const side of [-1,1]){
      const foot=side*.119+gait*side;
      path(c,'#292a32',[[side*.107,.28],[side*.119+gait*side*.45,.49],[foot,.71]],.105);
      path(c,'#48373d',[[foot,.71],[foot+.098,.71]],.069);
    }
    path(c,coat,[[-.19,-.39],[.16,-.38],[.25,.38],[-.26,.38]]);
    path(c,'#9f7c69',[[-.13,-.36],[-.02,-.23],[.12,-.37]],.076);
    path(c,'#dbb791',[[.03,-.26],[.01,.32]],.013);
    const local=([xx,yy])=>[
      ((xx-x)*Math.cos(lean)+(yy-y)*Math.sin(lean))/s,
      (-(xx-x)*Math.sin(lean)+(yy-y)*Math.cos(lean))/s,
    ];
    const headAngle=look+Math.sin(t*1.15)*.024;
    const spectaclesY=-.551-glasses*.111;
    const temple=[.124,spectaclesY];
    const dx=temple[0]-.028,dy=temple[1]+.35;
    const frameGrip=[.028+dx*Math.cos(headAngle)-dy*Math.sin(headAngle),
      -.35+dx*Math.sin(headAngle)+dy*Math.cos(headAngle)];
    for(const side of [-1,1]){
      const target=hands?.[side<0?0:1];
      let hand=target?local(target):side>0?reach:[-.31+gait*.68,.13+walk*.08];
      if(side>0&&adjust>0) hand=hand.map((v,i)=>mix(v,frameGrip[i],adjust));
      const sx=side*.148,sy=-.31;
      const elbow=[mix(sx,hand[0],.45)+side*.095,mix(sy,hand[1],.62)+.19];
      c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(...elbow,...hand);
      c.strokeStyle='#293541';c.lineWidth=.115;c.stroke();
      c.strokeStyle=coat;c.lineWidth=.084;c.stroke();
      oval(c,'#d7a78b',hand[0],hand[1],.049,.039);
    }
    c.save();c.translate(.028,-.35);c.rotate(headAngle);c.translate(-.028,.35);
    oval(c,'#d7a78b',.021,-.546,.15,.181);
    oval(c,'#a7786d',-.11,-.528,.041,.062);
    path(c,'#55515c',[[-.118,-.561],[-.138,-.66],[-.08,-.727],[.052,-.741],[.153,-.678],[.159,-.618],[.062,-.653],[-.063,-.609]]);
    for(let i=0;i<12;i++){
      const a=i*.021-.101, y=-.716+Math.abs(i-5)*.008;
      path(c,i%3?'#b8b6b9':'#6d6570',[[a,y+.051],[a+.019,y]],.009);
    }
    for(const xx of [-.047,.082]){
      oval(c,'#342d3a',xx+.015,-.544,.009,Math.cos(t*1.4)>.985?.003:.011);
      c.strokeStyle='#30313d';c.lineWidth=.015;c.strokeRect(xx-.041,spectaclesY-.02,.082,.058);
    }
    path(c,'#30313d',[[-.091,spectaclesY],[-.131,-.562-glasses*.068]],.016);
    path(c,'#30313d',[[-.006,spectaclesY],[.04,spectaclesY]],.012);
    path(c,'#95665e',[[.06,-.53],[.083,-.492],[.054,-.486]],.012);
    oval(c,'#62505a',.017,-.468,.048,.019,-.37);
    oval(c,'#81727c',.084,-.468,.049,.02,.34);
    c.restore();
    c.restore();
  }
  function forest(c,X,Y,t,near,back,drift=0){
    for(let layer=0;layer<2;layer++)for(let i=0;i<14;i++){
      const x=wrap(i*2*X/14-drift*(layer+.4),2*X)-X;
      const top=-Y-.08, y=.48+layer*.11, thick=(.021+i%4*.018)*(layer?.95:.52), bend=Math.sin(i*3.4)*.12;
      path(c,layer?near:back,[[x-thick,y],[x+bend-thick*.52,top],[x+bend+thick*.45,top],[x+thick,y]]);
      path(c,layer?near:back,[[x+bend*.53,-.35],[x+.12,-.54],[x+.19,-.67]],thick*.67);
      if(i%2===0)oval(c,layer?near:back,x+.1,-.67,.23,.12,Math.sin(t*.3+i)*.21);
    }
  }
  function study(c,X,Y,t,p,bass,mid,treble){
    for(let i=0;i<4;i++){
      const y=-Y+.2+i*.29;
      rect(c,'#492f40',-X,y,2*X,.047);
      for(let j=0;j<22;j++){
        const x=-X+j*2*X/22;
        rect(c,['#734f52','#915b50','#596269','#6e5267'][j%4],x,y-.12-(j%4)*.026,Math.min(.09,X*.078),.12+(j%4)*.026);
      }
    }
    const lx=-Math.min(X*.72,.94);
    glow(c,lx,.01,.58+bass*.23,'#ffc17e');
    const glasses=smooth((p-6.75)/.52)*(1-smooth((p-10.4)/.5));
    const adjust=Math.max(smooth((p-6.08)/.62)*(1-smooth((p-7.27)/.7)),
      smooth((p-9.64)/.64)*(1-smooth((p-10.93)/.66)));
    const turn=smooth((p%5.8-3.7)/1.3)*(1-glasses);
    const pageX=.035+.22*Math.cos(turn*Math.PI), pageY=.383-Math.sin(turn*Math.PI)*(.11+mid*.045);
    hermit(c,-.36,.24+Math.sin(t*1.8)*.009,.91,t,{
      lean:.17+turn*.08,look:.13+Math.sin(t*1.2)*.085,
      glasses,adjust,hands:[[-.32,.405],[pageX,pageY]],
    });
    rect(c,'#513345',-X,.49,2*X,.17);
    path(c,'#ffebc0',[[-.28,.38],[.015,.35],[.29,.39],[.22,.47],[-.018,.44],[-.33,.47]]);
    path(c,'#d8ac87',[[0,.4],[.24*Math.cos(turn*Math.PI),.385-Math.sin(turn*Math.PI)*(.11+mid*.045)],[.21*Math.cos(turn*Math.PI),.464],[0,.45]]);
    oval(c,'#d7a78b',-.32,.405,.037,.025);
    if(adjust===0) oval(c,'#d7a78b',pageX,pageY,.036,.025);
    rect(c,'#643d43',lx-.075,.10,.15,.37);oval(c,'#ffda93',lx,.113,.057,.068+treble*.028);
    return {action:'reading',turn,glasses};
  }
  function watch(c,X,Y,t,p,bass,mid,treble){
    forest(c,X,Y,t,'#294c50','#4c666b');
    rect(c,'#435d74',-X,.32,2*X,Y-.32);
    for(let i=0;i<22;i++){
      const y=.34+i*.043, x=Math.sin(i*5.1+t)*X*.69;
      path(c,'#bcddc181',[[x-.14-mid*.09,y],[x+.17,y]],.008+treble*.012);
    }
    const bx=X*.23+Math.sin(t*.72)*X*.29, by=-.32+Math.sin(t*1.73)*.093;
    const lift=smooth((p-2)/1.4)*(1-smooth((p-11)/2)), d=Math.min(X*.56,.74);
    const gx=-d+mix(.18,.102,lift)+Math.sin(t*1.1)*.034*lift;
    const gy=.29+mix(-.11,-.385,lift)+Math.sin(t*1.73)*.028*lift;
    hermit(c,-d,.29,.72,t,{lean:.08+lift*.11,look:-(.13+Math.sin(t*1.73)*.10)*lift,
      hands:[[gx-.075,gy+.017],[gx+.076,gy+.009]]});
    oval(c,'#232f3c',gx,gy,.086,.039);
    oval(c,'#577b8a',gx+.061,gy-.002,.023,.029);
    oval(c,'#395260',bx,by,.076,.033);oval(c,'#dcad76',bx+.064,by-.02,.03,.028);
    const flap=Math.sin(t*9)*(.08+bass*.057);
    path(c,'#c7e2d5',[[bx,by],[bx-.11,by-.078-flap],[bx-.16,by-.065],[bx-.069,by+.021]]);
    return {action:'watching',lift};
  }
  function woods(c,X,Y,t,p,bass,mid){
    forest(c,X,Y,t,'#374a42','#737961',t*.23);
    path(c,'#6e6652',[[-X,Y],[-.56,.52],[-.2,.27],[.14,.27],[.64,.56],[X,Y]]);
    for(let i=0;i<21;i++){
      const x=wrap(i*.18-t*.42,2*X)-X,y=.53+(i%6)*.1;
      path(c,'#c2a47b70',[[x-.028,y],[x+.031,y+.005]],.014);
    }
    const x=Math.sin(t*.48)*Math.min(X*.19,.36), y=.33-Math.abs(Math.sin(t*5.1))*.045;
    const step=Math.sin(t*5.1), sx=x+.34+step*.083, sy=y-.17+Math.cos(t*5.1)*.032;
    hermit(c,x,y,.94,t,{walk:1,lean:.056+step*.034,look:step*.045,hands:[null,[sx,sy]]});
    path(c,'#c09771',[[sx,sy],[x+.44-step*.082,y+.68]],.027);
    glow(c,x-.29,y-.72,.28+bass*.18+mid*.04,'#ffd691');
    return {action:'walking'};
  }
  const fungiPositions=[.15,.37,.58,.76];
  function mushroom(c,x,y,s,col){
    rect(c,'#dfc4a1',x-.024*s,y-.08*s,.048*s,.09*s);
    oval(c,col,x,y-.072*s,.098*s,.046*s);
    for(let j=0;j<3;j++)oval(c,'#f8d9af',x+(j-1)*.041*s,y-.08*s,.01*s,.006*s);
  }
  function fungi(c,X,Y,t,p,bass,mid,treble){
    forest(c,X,Y,t,'#544a54','#71637a');
    oval(c,'#5c4848',0,.91,X*1.18,.42);
    const slot=Math.min(4,Math.floor(p/3.3)), age=p%3.3, bx=-X*.69;
    const grip=slot<4 && age>=1.35, carried=grip && age<2.75;
    const count=slot+Number(grip&&!carried);
    const index=Math.min(slot,3), size=.85+index*.18;
    const pickX=Math.min(X*.79,1)*fungiPositions[index], groundY=.90-index*.061;
    const pickY=groundY-.04*size, basketX=bx+(index-1.3)*.06;
    const bend=slot<4?smooth((age-.26)/1.09)*(1-smooth((age-1.35)/1.16)):0;
    const transfer=smooth((age-1.35)/1.4), settle=smooth((age-2.75)/.55);
    const px=grip?mix(mix(pickX,basketX,transfer),bx+.14,settle):mix(bx+.14,pickX,bend);
    const py=grip?mix(mix(pickY,.71-.04*size,transfer)-Math.sin(transfer*Math.PI)*.29,.62,settle):mix(.62,pickY,bend);
    const colors=['#d57767','#bb8274','#cd9e69','#bd6d63'];
    for(let i=0;i<4;i++) if(i>=count&&!(carried&&i===slot))
      mushroom(c,Math.min(X*.79,1)*fungiPositions[i],.90-i*.061,.85+i*.18,colors[i]);
    hermit(c,-.48+bend*.19,.48+bend*.13,.81,t,{
      lean:.13+bend*.48,look:.08+bend*.17,hands:[[bx+.09,.69],[px,py]],coat:'#68625c',
    });
    for(let i=0;i<count;i++) mushroom(c,bx+(i-1.3)*.06,.71,.85+i*.18,colors[i]);
    if(carried) mushroom(c,px,py+.04*size,size,colors[index]);
    path(c,'#bb936e',[[-X*.69-.18,.707],[-X*.69+.18,.707],[-X*.69+.125,.893],[-X*.69-.13,.893]]);
    for(let i=0;i<16;i++){
      const q=wrap(t*.22+i*.161,1);
      oval(c,'#e9bb8c74',Math.sin(i*5.3+q)*X*.86,.88-q*(.46+mid*.12),.006+treble*.008,.006+bass*.005);
    }
    return {action:'gathering',count,carried,ground:4-count-Number(carried)};
  }
  function bees(c,X,Y,t,p,bass,mid,treble){
    forest(c,X,Y,t,'#536b53','#799477');
    rect(c,'#435947',-X,.83,2*X,Y-.83);
    const lift=smooth((p-2)/3)*(1-smooth((p-10)/3.1)), hx=Math.min(.42,X*.36);
    const fx=mix(hx,-.145,lift), fy=.25-lift*.48, tilt=-lift*.19;
    const grip=side=>[fx+side*.20*Math.cos(tilt),fy+side*.20*Math.sin(tilt)];
    hermit(c,mix(-.15,-.49,lift),.20+Math.sin(t*1.4)*.012,.87,t,{lean:.31-lift*.15,look:.18-lift*.39,
      hands:[grip(-1),grip(1)],coat:'#87877c'});
    for(let i=0;i<4;i++){
      rect(c,i%2?'#ab7d53':'#c4945c',hx-.24,.26+i*.123,.48,.113);
      rect(c,'#765d50',hx-.24,.37+i*.123,.48,.018);
    }
    c.save();c.translate(fx,fy);c.rotate(tilt);
    rect(c,'#865344',-.217,-.01,.434,.12);
    rect(c,'#e2ac64',-.184,.008,.368,.086);
    for(let i=0;i<9;i++)oval(c,'#a47251',-.152+i*.039,.05,.014,.019);
    c.restore();
    for(const side of [-1,1]) oval(c,'#d7a78b',...grip(side),.036,.027);
    for(let i=0;i<29;i++){
      const a=t*(1.3+(i%4)*.21)+i*2.39996,r=(.17+(i%8)*.038)*(1+lift*.41+bass*.24);
      const x=hx+Math.cos(a)*r, y=.24-lift*.25+Math.sin(a)*r*.78;
      oval(c,'#eac16c',x,y,.011+mid*.005,.008);
      oval(c,'#f1eed2aa',x-.008,y-.009,.008+treble*.013,.004);
    }
    return {action:'keeping bees',lift};
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}){
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)),t=Math.max(0,time/1000),p=t%16;
    const s=Math.min(w*.39,h*.41),X=w/(2*s),Y=h/(2*s);
    const palette=[['#312338','#a17155'],['#243954','#b89f84'],['#384a58','#c8ad7e'],['#433648','#a4776b'],['#344d56','#d0b980']][cast];
    c.save();c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const g=c.createLinearGradient(0,-Y,0,Y);g.addColorStop(0,palette[0]);g.addColorStop(1,palette[1]);
    rect(c,g,-X,-Y,2*X,2*Y);
    const state=[study,watch,woods,fungi,bees][cast](c,X,Y,t,p,bass,mid,treble);
    c.fillStyle=linen;c.font='bold 0.15px Georgia';c.textAlign='center';c.fillText('IX  /  THE HERMIT',0,-Y*.81);
    c.restore();
    return {scene:forms[cast][0],...state};
  }
  return {forms,recipes,draw};
})();
