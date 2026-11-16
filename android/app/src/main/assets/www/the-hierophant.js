window.TheHierophant = (() => {
  const forms = [['rite', 'The Procession'], ['lesson', 'The Unwritten Lesson'], ['relay', 'Keepers of the Flame']];
  const recipes = forms.map(([form, name]) => ({ name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6 }));
  const tau = Math.PI * 2;
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x*x*(3-2*x); };
  function path(c, color, points, width) {
    c.beginPath(); c.moveTo(...points[0]);
    points.slice(1).forEach(p => c.lineTo(...p));
    if (width) { c.strokeStyle = color; c.lineWidth = width; c.stroke(); }
    else { c.closePath(); c.fillStyle = color; c.fill(); }
  }
  function disc(c, color, x, y, r) {
    c.fillStyle = color; c.beginPath(); c.arc(x,y,r,0,tau); c.fill();
  }
  function pentacle(c,x,y,r,t,bass,treble,color,angle=0) {
    c.save(); c.translate(x,y); c.rotate(angle);
    r*=1+bass*.19;
    c.beginPath();c.arc(0,0,r*1.17,0,tau);
    c.strokeStyle=color;c.lineWidth=r*(.025+bass*.026);c.stroke();
    const points=Array.from({length:5},(_,i)=>{
      const a=-Math.PI/2+i*tau*2/5;
      return [Math.cos(a)*r,Math.sin(a)*r];
    });
    path(c,color,[...points,points[0]],r*(.038+bass*.03));
    for(let i=0;i<5;i++) {
      const [px,py]=points[i];
      disc(c,'#fff5d4',px,py,r*(.025+treble*.07*Math.sin(t*4+i)**2));
    }
    c.restore();
  }
  function sky(c, X, Y, top, bottom) {
    const g = c.createLinearGradient(0,-Y,0,Y);
    g.addColorStop(0,top); g.addColorStop(1,bottom);
    c.fillStyle = g; c.fillRect(-X,-Y,2*X,2*Y);
  }
  function lamp(c,x,y,size,t,energy,light) {
    const r = size*(.38+energy*.31);
    const g = c.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,light+'b0'); g.addColorStop(1,light+'00');
    disc(c,g,x,y,r);
    path(c,light,[[x-size*.07,y+size*.11],[x+Math.sin(t*8)*size*.07,y-size*.14],
      [x+size*.09,y+size*.1],[x,y+size*.15]]);
  }
  function keeper(c,x,y,s,t,reach,color,elder=false) {
    c.save(); c.translate(x,y); c.scale(s,s);
    const step=Math.sin(t*5.6)*.085;
    path(c,'#191429',[[-.14,.39],[-.15-step,.63]],.067);
    path(c,'#191429',[[.13,.39],[.15+step,.63]],.067);
    path(c,color,[[-.22,-.25],[.22,-.25],[.36,.51],[.06,.58],[-.31,.5]]);
    path(c,'#f0bb7e',[[-.15,-.22],[.03,.1],[.12,.44]],.024);
    disc(c,'#ce9b85',0,-.37,.133);
    path(c,color,[[-.17,-.39],[-.13,-.54],[0,elder?-.76:-.62],[.14,-.53],[.17,-.39]]);
    if(elder) {
      path(c,'#e9cdc2',[[-.085,-.342],[.079,-.342],[.052,-.22],[0,-.16],[-.059,-.234]]);
      path(c,'#f2ca8f',[[.35,-.56],[.35,.61]],.022);
      path(c,'#f2ca8f',[[.26,-.47],[.44,-.47],[.30,-.60],[.42,-.60]],.025);
    }
    path(c,color,[[.14,-.16],[.28,.04],[.36+reach*.19,-.05-reach*.17]],.088);
    disc(c,'#ce9b85',.36+reach*.19,-.05-reach*.17,.046);
    c.restore();
  }

  function rite(c,X,Y,t,bass,mid,treble) {
    sky(c,X,Y,'#100d28','#593349');
    const p=t%18, progress=ease(p/11);
    for(let i=5;i>=0;i--){
      const x=Math.min(X*.97,2.04)*(.3+i*.14), top=-.92-i*.08;
      c.beginPath(); c.moveTo(-x,.89); c.lineTo(-x,-.31);
      c.quadraticCurveTo(-x*.8,top,0,top-.12); c.quadraticCurveTo(x*.8,top,x,-.31); c.lineTo(x,.89);
      c.strokeStyle=i%2?'#784e64':'#a36a70'; c.lineWidth=.045+i*.005; c.stroke();
    }
    path(c,'#2a1b36',[[-X,Y],[-X,1.01],[-.24,.12],[.24,.12],[X,1.01],[X,Y]]);
    for(let i=0;i<9;i++){
      const z=((i/9+progress*.8)%1)**2;
      path(c,'#a8798055',[[-X*z,.13+z*Y*.9],[X*z,.13+z*Y*.9]],.011);
    }
    const lit=Math.min(6,Math.floor(p/1.45));
    pentacle(c,0,-.65,.24,t,bass,treble,lit?'#ffc879':'#b17b77',Math.sin(t*.7)*.16+mid*.13);
    for(let i=0;i<lit;i++) for(const side of [-1,1]){
      const z=i/5, x=side * Math.min(X*.87,.38+z*.82), y=-.38+z*.98;
      lamp(c,x,y,.24+z*.21,t+i,bass,'#ffc879');
    }
    for(let i=2;i>=0;i--){
      const z=progress*.56+.13+i*.14;
      const x=(i-1)*Math.min(X*.37,.39)*(1+z*.3), y=.09+z*.62;
      keeper(c,x,y,.22+z*.43,t+i,.35+mid*.37,i===1?'#9a4263':'#654b80',i===1);
      lamp(c,x+.17,y-.055,.28,t+i,treble,'#ffe6a7');
    }
    return { lit };
  }

  const starVertices=Array.from({length:6},(_,i)=>{
    const a=-Math.PI/2+i*tau*2/5;
    return [Math.cos(a)*.55,Math.sin(a)*.55];
  });
  const stars=starVertices.flatMap((point,i)=>{
    if(i===5) return [starVertices[0]];
    const next=starVertices[(i+1)%5];
    return i<3 ? [point,[(point[0]+next[0])/2,(point[1]+next[1])/2]] : [point];
  });
  function lesson(c,X,Y,t,bass,mid,treble) {
    sky(c,X,Y,'#071d27','#1b4d4c');
    const p=t%18, count=Math.min(8,Math.floor(p/1.46));
    for(let i=0;i<53;i++){
      const x=Math.sin(i*12.31)*X*.96, y=Math.cos(i*8.02)*Y*.86;
      disc(c,i%4?'#8dceb956':'#edebbc83',x,y,.005+(i%3)*.004);
    }
    c.save(); c.translate(0,-.27); c.scale(Math.min(X*.88,1.2),1);
    for(let i=0;i<stars.length;i++){
      const [x,y]=stars[i]; disc(c,i<=count?'#e6f8cb':'#73a89969',x,y,.018+treble*.015);
      if(i>0 && i<=count) path(c,i>4?'#ffce92':'#a2f4d9',[stars[i-1],stars[i]],.012+bass*.012);
    }
    if(count===8){
      pentacle(c,0,0,.55,t,bass,treble,'#ffdc9d9c',Math.sin(t*.82)*mid*.085);
    }
    c.restore();
    path(c,'#123737',[[-X,Y],[-X,.93],[-.59,.65],[.62,.65],[X,.93],[X,Y]]);
    const d=Math.min(X*.57,.76);
    keeper(c,-d,.58,.52,t*.25,count<5?.8:.15,'#69918e',true);
    keeper(c,d,.68,.39,t*.25,count>=5?.97:.15,'#b38665');
    return { count };
  }

  function relay(c,X,Y,t,bass,mid,treble) {
    sky(c,X,Y,'#16142d','#784a51');
    const p=t%19, count=Math.min(6,1+Math.floor(p/2.65));
    disc(c,'#f4c99c',X*.68,-Y*.54,.24);
    for(let i=0;i<3;i++){
      const points=[[-X,Y]];
      for(let j=0;j<=28;j++){
        const x=(j/14-1)*X;
        points.push([x,.34+i*.27+Math.sin(j*.54+i*1.43)*(.22+i*.025)]);
      }
      points.push([X,Y]);path(c,['#664156','#402e4c','#251d37'][i],points);
    }
    for(let i=0;i<6;i++){
      const x=(i/5-.5)*2*X*.78, y=.68+Math.sin(i*1.71)*.31, size=.31+i*.018;
      keeper(c,x,y,size,t*.2+i,.8,'#8d5271',i===0);
      if(i<count) {
        lamp(c,x+size*.57,y-size*.27,.43,t+i,bass,'#ffba77');
        const charge=i===count-1?1:.72;
        pentacle(c,x,y-.32,.082*charge,t+i,bass*charge,treble,'#ffcd8b',Math.sin(t+i)*.14);
      }
      if(i===count-1&&i<5){
        const q=ease((p-i*2.65-.9)/1.75), nx=x+2*X*.78/5, ny=.68+Math.sin((i+1)*1.71)*.31;
        for(let j=0;j<8;j++){
          const a=clamp(q-j*.04);
          if(a>0) disc(c,j%2?'#ffc585':'#ed915c',x+(nx-x)*a,y+(ny-y)*a-Math.sin(a*Math.PI)*(.38+mid*.18)-.09,.013+treble*.014);
        }
      }
    }
    return { count };
  }

  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}) {
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)), t=Math.max(0,time/1000);
    const s=Math.min(w*.40,h*.36), X=w/(2*s), Y=h/(2*s);
    c.save(); c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const state=[rite,lesson,relay][cast](c,X,Y,t,bass,mid,treble);
    c.fillStyle='#ffebca';c.textAlign='center';
    c.font='bold 0.16px Georgia';c.fillText('V  /  THE HIEROPHANT',0,-Y*.78);
    c.font='0.11px Georgia';c.fillText(forms[cast][1],0,Y*.91);
    c.restore();
    return { scene: forms[cast][0], ...state };
  }
  return { forms, recipes, draw };
})();
