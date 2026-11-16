window.BonkingBonobos = (() => {
  const forms = [['groom', 'The Grooming Circle'], ['bridge', 'Across the Gap'], ['duet', 'Bonobo After Dark']];
  const recipes = forms.map(([form,name]) => ({ name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6 }));
  const palettes = [['#142d37','#a8694f','#456952'],['#102e39','#9abd74','#385b4a'],['#110f32','#50508e','#243856']];
  const tau=Math.PI*2;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{ x=clamp(x);return x*x*(3-2*x); };
  const mix=(a,b,t)=>a+(b-a)*t;
  function shape(c,color,points,width=0) {
    c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p));
    if(width){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
    else{c.closePath();c.fillStyle=color;c.fill();}
  }
  function oval(c,color,x,y,rx,ry,tilt=0) {
    c.beginPath();c.ellipse(x,y,rx,ry,tilt,0,tau);c.fillStyle=color;c.fill();
  }
  function ape(c,x,y,s,dir,t,reach,arch=0,anger=0,yielding=0) {
    c.save();c.translate(x,y);c.scale(dir*s,s);c.rotate(arch);
    const sway=Math.sin(t)*.06, fur='#241d32', lit='#45364c', face='#a67877';
    oval(c,fur,-.06,-.32,.21,.28,-.19);
    shape(c,fur,[[-.16,-.27],[-.23,-.09],[-.14,-.03]],.115);
    shape(c,lit,[[.01,-.26],[.11,-.1],[.24,-.045]],.09);
    shape(c,lit,[[.055,-.46],[.20,-.28],reach || [.30+sway,-.12]],.083);
    if(reach) oval(c,face,...reach,.044,.037);
    oval(c,fur,.045,-.59,.166,.18);
    oval(c,face,-.076,-.59,.041,.055);
    oval(c,face,.116,-.562,.112,.096,-.16);
    oval(c,'#202035',.151,-.603+yielding*.017,.021,.023-yielding*.012);
    oval(c,'#ffe1a4',.158,-.61,.007,.007);
    if(anger>.18) {
      oval(c,'#382035',.165,-.524,.049,.013+anger*.026,.12);
      shape(c,'#ffe6c7',[[.132,-.539],[.196,-.535]],.012);
      shape(c,'#332038',[[.111,-.635],[.179,-.614]],.027);
    } else {
      shape(c,'#38273d',[[.131,-.53],[.178,-.52+yielding*.012],[.20,-.548]],.014);
    }
    shape(c,'#65516a',[[-.087,-.67],[-.034,-.72],[.05,-.739]],.018);
    c.restore();
  }
  function birds(c,X,Y,t,treble) {
    const x=Math.cos(t*.44)*X*.74,y=-Y*.52+Math.sin(t*.88)*.16;
    c.save();c.translate(x,y);c.scale(Math.sin(t*.44)>0?-1:1,1);
    const lift=.052+Math.sin(t*4.4)*.058;
    oval(c,'#f2dec4',0,0,.071,.039);
    for(const side of [-1,1]) shape(c,side===1?'#ecddc9':'#c9c6c4',
      [[.014,0],[-.051,side*.06],[-.165,side*(.12+lift)],[-.225,side*(.081+lift)],[-.075,side*.017]]);
    oval(c,'#742f4e',.062,-.013,.035,.026);
    shape(c,'#e4ad74',[[.081,-.03],[.12,-.007],[.081,.006]]);
    c.restore();
    const tx=-X*.69,ty=-.45;
    shape(c,'#443752',[[tx-.25,ty+.13],[tx+.24,ty+.1]],.041);
    c.save();c.translate(tx,ty);c.rotate(Math.sin(t*2.5)*(.06+treble*.13));
    oval(c,'#458aa7',-.016,.023,.08,.081,.25);
    oval(c,'#3b668e',-.103,.085,.11,.026,-.49);
    oval(c,'#a9b96a',.033,.049,.040,.043);
    oval(c,'#529bb6',.047,-.044,.049,.049);
    shape(c,'#264465',[[.012,-.06],[.015,-.133],[.065,-.076]]);
    shape(c,'#ffce68',[[.071,-.06],[.12,-.046],[.078,-.021]]);
    oval(c,'#192035',.063,-.056,.012,.012);c.restore();
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}) {
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)), [dark,light,leaf]=palettes[cast];
    const t=Math.max(0,time/1000), phase=t%20, s=Math.min(h*.39,w*.41), X=w/(2*s),Y=h/(2*s);
    c.save();c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const g=c.createLinearGradient(0,-Y,0,Y);g.addColorStop(0,dark);g.addColorStop(1,light);
    c.fillStyle=g;c.fillRect(-X,-Y,2*X,2*Y);
    oval(c,cast===2?'#dbc7f5':'#f4cb91',X*.63,-Y*.53,.19+bass*.052,.19+bass*.052);
    for(let i=0;i<35;i++){
      const x=Math.sin(i*13.11)*X,y=-Y*.58+Math.sin(i*2.7)*Y*.37;
      const r=.09+(i%5)*.05;
      oval(c,leaf+(i%2?'94':'c0'),x,y,r*(1.5+mid*.23),r,Math.sin(t*.6+i)*.3);
      if(i%4===0) shape(c,leaf+'aa',[[x,-Y],[x-.06,y+.21],[x+.041,Y]],.052);
    }
    birds(c,X,Y,t,treble);
    const d=Math.min(.91,X*.70), floor=.65;
    const pulse=Math.sin(t*(cast===2?6.4:4.3));
    const band=cast===0?Math.floor(phase/5):0;
    const beat=cast===0?phase%5:phase;
    const argument=smooth((beat-.2)/.45)*(1-smooth((beat-(cast===0?1.72:2.3))/.54));
    const yielding=smooth((beat-(cast===0?1.25:1.85))/.53)*(1-smooth((beat-(cast===0?2.57:3.7))/.85));
    const peace=smooth((beat-(cast===0?2.24:3.35))/.68)*(1-smooth((beat-(cast===0?4.43:15))/.54));
    const pair=cast===0?(band%2?[2,3]:[0,1]):cast===1?[0,4]:[1,2];
    const bridge=cast===1?smooth((phase-3)/5):1;
    if(cast===1) {
      for(const side of [-1,1]) shape(c,'#332a43',[[side*X,floor],[side*.40,floor],[side*.55,Y],[side*X,Y]]);
      const a=bridge*Math.PI*.48;
      shape(c,'#b4926a',[[-.43,floor],[-.43+Math.sin(a)*.9,floor-Math.cos(a)*.9]],.073);
    } else shape(c,'#503748',[[-X,floor+.05],[-X*.47,floor-.025],[.3,floor],[X,floor-.07]],.113);
    for(let i=0;i<5;i++){
      const lane=i-2;
      let x=lane*d*.47,y=floor,dir=i%2?-1:1,reach=null,arch=0,anger=0,bow=0;
      const role=pair.indexOf(i), leader=role===(cast===0?band%2:0);
      if(cast===0){
        x+=role>=0?(role? -1:1)*peace*.067:Math.sin(t*1.4+i)*.045;
        dir=role>=0?(role?-1:1):(x<0?1:-1);
        if(role>=0&&leader) reach=[.33+peace*.29,-.36-peace*.16+Math.sin(t*7.1)*(.035+treble*.07)*peace];
      } else if(cast===1){
        const u=smooth((phase-8-i*.78)/3.35);
        x=i===4?d*.78:mix(-d+(i%2)*.24,d-(i%3)*.16,u);
        y-=Math.sin(u*Math.PI)*(.044+bass*.035);
        if(i===0&&bridge<.98) reach=[.50,-.36];
        x+=Math.sin(t*2+i)*.032;
        dir=i===4?-1:1;
      } else {
        const close=smooth((phase-3)/2)*(1-smooth((phase-15)/2.5));
        if(i===1||i===2) {
          x=(i===1?-1:1)*mix(d*.43,.152,close);
          y-=close*(.035+.062*bass)*Math.max(0,pulse);
          dir=i===1?1:-1;
          reach=[.35+close*.07,-.29];
          arch=close*(.12+pulse*(.062+bass*.055));
        } else {x=lane*d*.48;dir=x<0?1:-1;y-=Math.max(0,Math.sin(t*5+i))*.06*bass;}
      }
      if(role>=0) {
        const accent=Math.sin(t*(5.1+bass*2.2)+role*.8);
        anger=argument*(leader?1:.62);
        bow=leader?0:yielding;
        x+=dir*(anger*(.04+.034*accent)*(leader?1:.45)-bow*.105);
        y+=bow*.081-anger*(leader?.064:.034);
        arch+=anger*(leader?.22:.11)-bow*.17;
        if(anger>.15) reach=[.36+anger*(.15+accent*.09),-.38-anger*.13];
      }
      ape(c,x,y,.52+(i%3)*.055,dir,t*5.1+i,reach,arch,anger,bow);
      if(role>=0&&anger>.25) for(let j=0;j<3;j++) {
        const dx=x+dir*(.18+j*.046), dy=y-.49-j*.057;
        shape(c,'#ff8e6f',[[dx,dy],[dx+dir*(.024+bass*.022),dy-.034]],.008+treble*.009);
      }
    }
    if(cast===2){
      for(let i=0;i<9;i++) {
        const x=(i-4)*.083,y=.64+Math.sin(i*2+t*2)*.043;
        oval(c,i%2?'#477359':'#31574f',x,y,.12,.038,-.8+i*.19);
      }
      if(phase>5&&phase<16) for(let i=0;i<12;i++){
        const age=(t*.66+i/12)%1,x=Math.sin(i*2.39+t)*(.06+age*.37),y=.11-age*.55;
        c.globalAlpha=(1-age)*(.45+bass*.47);
        const r=.011+treble*.018;
        oval(c,'#f6a8b8',x-r*.6,y,r,r);oval(c,'#f6a8b8',x+r*.6,y,r,r);
        shape(c,'#f6a8b8',[[x-r*1.5,y],[x+r*1.5,y],[x,y+r*1.8]]);
      }
      c.globalAlpha=1;
    }
    c.fillStyle='#fff1c7';c.textAlign='center';c.font='bold .145px Georgia';
    c.fillText('BONKING BONOBOS',0,-Y*.79);
    c.font='.105px Georgia';c.fillText(forms[cast][1],0,Y*.91);
    c.restore();
    return { scene:forms[cast][0], pair:cast===0?band%2:null, bridge, duet:cast===2&&phase>5&&phase<16,
      social:argument>.24?'argue':yielding>.24?'yield':peace>.24?'reconcile':'rest' };
  }
  return { forms,recipes,draw };
})();
