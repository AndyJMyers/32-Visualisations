window.DmtVisions = (() => {
  const forms = [['melt', 'Blessing from Above'], ['haze', 'Sandstorm'], ['ice', 'Snowstorm']];
  const recipes = forms.map(([form, name]) => ({ name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6 }));
  const palettes = [
    ['#0a0725', '#e59b51', '#d473ba', '#9ae6fb', '#fff3bd'],
    ['#1b1010', '#f5be70', '#bd6535', '#bc8f5f', '#ffe3a0'],
    ['#081b30', '#9af0ff', '#426984', '#b4daed', '#f1fcff'],
  ];
  const tau = Math.PI * 2;
  const mix = (a,b,t) => a+(b-a)*t;
  const clamp = x => Math.max(0,Math.min(1,x));
  const smooth = x => { x=clamp(x);return x*x*(3-2*x); };
  const noise = n => Math.sin(n*127.1+25.97)*43758.5453%1;
  const facet = Array.from({length:900},(_,i)=>[noise(i),noise(i+79),Math.abs(noise(i+147))]);

  function polygon(c, points, fill, outline) {
    c.beginPath();c.moveTo(...points[0]);
    points.slice(1).forEach(point=>c.lineTo(...point));c.closePath();
    if(fill){c.fillStyle=fill;c.fill();}
    if(outline){c.strokeStyle=outline;c.stroke();}
  }
  function ellipse(c,x,y,rx,ry,color) {
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fillStyle=color;c.fill();
  }

  function entity(c,p,t,morph,bass,mid,treble,cast,crack) {
    const [dark,hot,pink,cold,white]=p;
    const wobble=(cast===0?.095:cast===1?.041:.024)*(1+mid);
    c.save();
    c.rotate(Math.sin(t*.55)*(.095+mid*.075));
    c.scale(1+bass*.09,1-bass*.04);
    if(cast===0) {
      const tide=Math.sin(t*2.1)*(.06+bass*.05);
      const span=mix(.23,.82,morph);
      c.beginPath();c.moveTo(0,-.75);
      c.bezierCurveTo(span,-.58+tide,span,.23,span*.72,.57);
      c.bezierCurveTo(span*.53,.93+tide,.17,.62,0,.87);
      c.bezierCurveTo(-.17,.62,-span*.53,.93-tide,-span*.72,.57);
      c.bezierCurveTo(-span,.23,-span,-.58-tide,0,-.75);
      c.closePath();
      const membrane=c.createLinearGradient(-span,0,span,0);
      membrane.addColorStop(0,hot+'25');membrane.addColorStop(.5,pink+'8a');membrane.addColorStop(1,cold+'48');
      c.fillStyle=membrane;c.fill();c.strokeStyle=pink;c.lineWidth=.009;c.stroke();
    } else if(cast===2) {
      const crown=mix(.26,.64,morph);
      c.lineWidth=.011;
      for(const side of [-1,1]) {
        polygon(c,[[0,-.48],[side*crown,-.89],[side*crown*1.25,-.37],[side*.17,.11]],cold+'50',white);
        polygon(c,[[side*.11,.18],[side*crown,.42],[side*.32,.84],[0,.71]],pink+'34',cold);
      }
    }
    for(const side of [-1,1]) for(let i=0;i<4;i++) {
      const phase=t*(1.95+i*.025)+i*.81;
      const root=[side*mix(.175,.23,morph),mix(-.35+i*.16,-.03+i*.077,morph)];
      const joint=[side*mix(.32+i*.10,.92-i*.09,morph),mix(-.56+i*.32,-.72+i*.29,morph)+Math.sin(phase)*wobble];
      const end=[side*mix(.52+i*.055,1.14-i*.08,morph),mix(-.65+i*.35,-.26+i*.24,morph)+Math.cos(phase)*wobble];
      c.beginPath();c.moveTo(...root);
      if(cast===0) c.quadraticCurveTo(joint[0]+side*wobble,joint[1]-.14,...end);
      else { c.lineTo(...joint);c.lineTo(...end); }
      c.lineWidth=mix(.034,.054,morph);c.strokeStyle=dark;c.stroke();
      c.lineWidth=.009+treble*.012;c.strokeStyle=i%2?hot:cold;c.stroke();
      ellipse(c,...joint,.028+bass*.012,.028+bass*.012,white);
      if(cast===0) ellipse(c,...end,.039+bass*.019,.029,pink);
      else polygon(c,[[end[0],end[1]-.043],[end[0]+side*(cast===2?.15:.076),end[1]],[end[0],end[1]+.043]],pink,cold);
    }
    const torso=mix(.24,.37,morph);
    c.lineWidth=.012;
    polygon(c,[[0,-.39],[torso,-.15],[torso*.87,.36],[0,mix(.62,.78,morph)],[-torso*.87,.36],[-torso,-.15]],dark,cold);
    for(let j=0;j<8;j++) {
      const a=t*.93+j*tau/8;
      const r=.12+bass*.075;
      polygon(c,[[0,.25],[Math.cos(a)*r,.25+Math.sin(a)*r],[Math.cos(a+.44)*r,.25+Math.sin(a+.44)*r]],j%2?hot:pink,cold);
    }
    const height=mix(-.45,-.31,morph);
    const corner=mix(.34,.25,morph);
    for(const side of [-1,1]) {
      const ear=height-mix(.37,.035,morph);
      polygon(c,[[0,height-.24],[side*corner,ear],[side*.32,height+.12],
        [side*.10,height+.27],[0,height+.19]],shade(side,hot,pink),cold);
      polygon(c,[[side*.055,height-.18],[side*corner*.85,height-.11+Math.sin(t*6)*wobble],
        [side*.23,height+.075],[side*.09,height+.13]],dark,hot);
      for(let i=0;i<4;i++){
        c.globalAlpha=i===0?1:morph;
        const xx=side*(.12+i*.043), yy=height-.05+Math.sin(i)*.08;
        ellipse(c,xx,yy,.036-i*.004,.016+treble*.012,white);
        ellipse(c,xx+Math.sin(t*1.4)*.009,yy,.009,.016,dark);
      }
    }
    c.globalAlpha=1;
    c.lineWidth=.007;
    polygon(c,[[0,height-.09],[.057,height+.029],[0,height+.09],[-.057,height+.029]],hot,white);
    if(crack>.01) {
      c.globalAlpha=crack*.82;
      c.strokeStyle=white;c.lineWidth=.006;
      for(let i=0;i<9;i++){
        const a=i*tau/9;
        c.beginPath();c.moveTo(0,height+.12);
        c.lineTo(Math.cos(a)*.25,height+.12+Math.sin(a)*.15);
        c.lineTo(Math.cos(a+.12)*(.38+crack*.25),height+.12+Math.sin(a+.12)*.36);c.stroke();
      }
    }
    c.restore();
  }
  function shade(side, hot, pink) { return (side<0?hot:pink)+'78'; }

  const wrap = (x, span) => x - Math.floor(x / span) * span;
  function sky(c,X,Y,top,bottom) {
    const g=c.createLinearGradient(0,-Y,0,Y);
    g.addColorStop(0,top);g.addColorStop(1,bottom);
    c.fillStyle=g;c.fillRect(-X,-Y,2*X,2*Y);
  }

  function drifts(c,X,Y,t,color,depth,lift) {
    c.beginPath();c.moveTo(-X,Y);
    for(let i=0;i<=40;i++) {
      const x=-X+2*X*i/40;
      c.lineTo(x,Y*depth+Math.sin(x*1.4+t*.24)*lift+Math.sin(x*3.2-t*.15)*lift*.28);
    }
    c.lineTo(X,Y);c.closePath();c.fillStyle=color;c.fill();
  }

  function snow(c,p,X,Y,t,morph,bass,treble) {
    sky(c,X,Y,p[0],'#587f99');
    drifts(c,X,Y,t,'#345870',.45,.21);
    drifts(c,X,Y,t,'#648fa5',.71,.16);
    const whiteout=smooth((t%14-4.7)/2.3)*(1-smooth((t%14-9)/2.7));
    c.save();c.globalAlpha=1-whiteout*.78;c.lineWidth=.013;
    const leg=mix(.32,.96,morph);
    for(const sign of [-1,1]) for(let i=0;i<4;i++){
      const y=-.44+i*.28;
      polygon(c,[[0,y],[sign*leg*.68,y-.21],[sign*leg,y+.16],[sign*leg*.61,y-.09]],i%2?'#42698480':'#9af0ff65',p[3]);
    }
    polygon(c,[[0,-.84],[.34,-.46],[.26,.35],[0,.8],[-.26,.35],[-.34,-.46]],'#b4daed50',p[4]);
    polygon(c,[[0,-.84],[.34,-.46],[0,.67],[-.07,-.06]],'#9af0ff73',p[1]);
    for(const sign of [-1,1]) ellipse(c,sign*.12,-.31,.031+treble*.023,.021,p[4]);
    c.restore();
    for(let i=0;i<360;i++){
      const [fx,fy,r]=facet[i];
      const x=wrap(fx*X+t*(.09+r*.34)+Math.sin(t*1.3+i)*.11+X,2*X)-X;
      const y=wrap(fy*Y+t*(.19+r*.86)+Y,2*Y)-Y;
      const size=.003+r*r*(.022+whiteout*.027);
      c.globalAlpha=(.26+r*.61)*(.71+whiteout*.27);
      if(i%37===0){
        c.strokeStyle=p[4];c.lineWidth=.007;c.beginPath();
        for(let j=0;j<3;j++){const a=j*tau/6+t*.4,dx=Math.cos(a)*size*2.4,dy=Math.sin(a)*size*2.4;
          c.moveTo(x-dx,y-dy);c.lineTo(x+dx,y+dy);}
        c.stroke();
      } else ellipse(c,x,y,size*(1+whiteout*.55),size,p[4]);
    }
    c.globalAlpha=1;
    drifts(c,X,Y,t,'#d0eaf3',.94-whiteout*.1,.069+bass*.025);
  }

  function sand(c,p,X,Y,t,morph,bass,mid,treble) {
    sky(c,X,Y,'#3e211f','#ac693f');
    ellipse(c,X*.58,-Y*.42,.33,.33,'#df9a57');
    drifts(c,X,Y,t,'#9b5c3a',.37,.18);
    drifts(c,X,Y,t,'#603325',.66,.225);
    const gust=smooth((t%14-3.9)/1.7)*(1-smooth((t%14-8.4)/2.4));
    for(let i=0;i<8;i++){
      const y=-.96+i*.24;
      c.save();c.translate(gust*i*.10*(.72+.18*Math.sin(t*2+i)),0);
      c.beginPath();c.rect(-X-1,y,2*X+2,.243);c.clip();
      entity(c,p,t,morph,bass,mid,treble,1,0);
      c.restore();
    }
    for(let i=0;i<245;i++){
      const [fx,fy,r]=facet[i];
      const x=wrap(fx*X+t*(.75+1.8*r)+gust*r*.95+X,2*X)-X;
      const y=fy*Y*.94+Math.sin(x*.84+t*.62+i)*.095;
      const length=(.02+r*r*.19)*(1+gust*2.2+bass*.38);
      c.globalAlpha=.23+r*.49;
      if(i%19===0) polygon(c,[[x-length*.8,y],[x+length*.32,y-.029],[x+length*.45,y+.015],[x,y+.036]],p[1+i%3]);
      else {
        c.strokeStyle=p[1+i%3];c.lineWidth=.004+r*.008;
        c.beginPath();c.moveTo(x-length,y-.021);c.lineTo(x,y);c.stroke();
      }
    }
    c.globalAlpha=1;
  }

  function blessing(c,p,X,Y,t,morph,bass,treble) {
    sky(c,X,Y,p[0],'#251437');
    const gather=smooth((t%14-1.25)/4.9)*(1-smooth((t%14-9.4)/3.7));
    for(let i=0;i<7;i++){
      const x=(i-3)*Math.min(X*.22,.45);
      polygon(c,[[x*.21-.036,-Y],[x*.21+.036,-Y],[x+.18,.74],[x-.18,.74]],
        i%2?'#e59b5128':'#fff3bd24');
    }
    for(let i=0;i<82;i++){
      const [fx,fy,r]=facet[i], age=wrap(t*(.17+r*.23)+Math.abs(fy),1);
      const x=fx*Math.min(X*.94,1.7)*(1-age*.81*gather);
      const y=mix(-Y,.21,age);
      const size=(.009+r*.023)*(1+treble*.48);
      c.globalAlpha=Math.sin(age*Math.PI)*(.44+r*.55);
      polygon(c,[[x,y-size*2],[x+size,y],[x,y+size*2],[x-size,y]],i%3?p[4]:p[3]);
    }
    c.globalAlpha=1;
    c.lineWidth=.011;
    for(const side of [-1,1])for(let i=0;i<4;i++){
      const rise=mix(.18,.94,morph), reach=mix(.46,.99,gather);
      c.beginPath();c.moveTo(side*.05,.48);
      c.bezierCurveTo(side*reach,i*.17-.03,side*reach*.89,-rise+i*.17,
        side*(.4+i*.09),-rise+i*.25);
      c.strokeStyle=i%2?p[4]+'b5':p[3]+'93';c.stroke();
    }
    polygon(c,[[0,-.57],[.24,-.35],[.17,.32],[0,.7],[-.17,.32],[-.24,-.35]],'#c8835775',p[4]);
    ellipse(c,0,-.35,.12,.16,'#fff3bddb');
    for(let i=0;i<3;i++){
      const r=.18+i*.085+bass*.045;
      c.beginPath();c.ellipse(0,-.54,r,r*.38,Math.sin(t+i)*.16,0,tau);
      c.strokeStyle=p[4];c.stroke();
    }
    ellipse(c,0,.18,.067+gather*.065,.067+gather*.065,'#fff3bde0');
  }

  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}) {
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)), p=palettes[cast];
    const t=Math.max(0,time/1000), phase=t%14;
    const morph=smooth((phase-1.6)/4)*(1-smooth((phase-9.1)/3.45));
    const s=Math.min(w*.41,h*.47), X=w/(2*s),Y=h/(2*s);
    c.save();c.translate(w/2,h/2);c.scale(s,s);
    if(cast===0) blessing(c,p,X,Y,t,morph,bass,treble);
    else if(cast===1) sand(c,p,X,Y,t,morph,bass,mid,treble);
    else snow(c,p,X,Y,t,morph,bass,treble);
    c.restore();
    return { scene:forms[cast][0], morph };
  }
  return { forms, recipes, draw };
})();
