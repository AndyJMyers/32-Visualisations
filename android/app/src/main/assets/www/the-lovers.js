window.TheLovers = (() => {
  const forms=[['solitaire','Bond & Solitaire'],['naxos','Ariadne & Dionysus'],['verona','Romeo & Juliet']];
  const recipes=forms.map(([form,name])=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const tau=Math.PI*2, gold='#ffd88d', skin='#e5a986';
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  function path(c,color,points,width=0){
    c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p));
    if(width){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
    else{c.closePath();c.fillStyle=color;c.fill();}
  }
  function oval(c,color,x,y,rx,ry,tilt=0){
    c.beginPath();c.ellipse(x,y,rx,ry,tilt,0,tau);c.fillStyle=color;c.fill();
  }
  function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(x,y,w,h);}
  function sky(c,X,Y,a,b){
    const g=c.createLinearGradient(0,-Y,0,Y);
    g.addColorStop(0,a);g.addColorStop(1,b);rect(c,g,-X,-Y,2*X,2*Y);
  }
  function label(c,words,x,y,size,color){
    c.font=`bold ${size}px Georgia`;c.textAlign='center';c.fillStyle=color;c.fillText(words,x,y);
  }
  function figure(c,x,y,s,dir,coat,hair,tilt,reach,style){
    c.save();c.translate(x,y);c.scale(dir*s,s);c.rotate(tilt);
    const gown=style==='gown';
    if(gown) oval(c,hair,-.102,-.44,.158,.25,-.3);
    path(c,coat,[[-.19,-.33],[.14,-.30],[.13,-.08],[gown?.31:.23,.43],[-.28,.43],[-.15,-.07]]);
    path(c,coat,[[.065,-.25],[.22,-.14],[reach[0],reach[1]]],.082);
    oval(c,skin,reach[0],reach[1],.044,.031);
    oval(c,skin,.023,-.492,.121,.15,.09);
    path(c,skin,[[.111,-.503],[.157,-.461],[.11,-.452]]);
    path(c,hair,[[-.09,-.47],[-.11,-.57],[-.029,-.656],[.104,-.602],[.122,-.547],[.033,-.564],[-.042,-.529]]);
    path(c,'#432638',[[.067,-.514],[.103,-.507]],.011);
    if(style==='tux'){
      path(c,'#fff0db',[[-.073,-.314],[.09,-.303],[.028,-.08]]);
      path(c,'#241b32',[[-.038,-.287],[.033,-.252],[.084,-.289],[.08,-.233],[.032,-.253],[-.041,-.234]]);
    }else if(style==='vine'){
      for(let i=0;i<5;i++) oval(c,'#babe68',-.11+i*.048,-.602+Math.abs(i-2)*.014,.042,.017,(i-2)*.31);
    }else{
      path(c,gold,[[-.109,-.568],[.074,-.601]],.014);
      oval(c,gold,.073,-.394,.024,.029);
    }
    c.restore();
  }
  function card(c,x,y,scale,tilt,flip){
    c.save();c.translate(x,y);c.rotate(tilt);c.scale(scale*Math.max(.025,Math.abs(flip)),scale);
    rect(c,'#160f28',-.14,-.198,.30,.42);
    rect(c,flip<0?'#794b62':'#ffe4b6',-.143,-.21,.286,.408);
    c.strokeStyle=gold;c.lineWidth=.009;c.strokeRect(-.118,-.185,.236,.358);
    if(flip<0) path(c,gold,[[0,-.122],[.064,-.013],[0,.096],[-.064,-.013],[0,-.122]],.009);
    else{
      label(c,'VI',0,-.105,.063,'#60223d');
      oval(c,'#a8465b',-.033,-.016,.042,.038);oval(c,'#a8465b',.033,-.016,.042,.038);
      path(c,'#a8465b',[[-.073,-.008],[.073,-.008],[0,.083]]);
      label(c,'THE LOVERS',0,.147,.028,'#60223d');
    }
    c.restore();
  }
  function solitaire(c,X,Y,t,p,bass,mid,treble){
    sky(c,X,Y,'#150b2d','#653552');
    for(const side of [-1,1]){
      const x=side*X*.83;
      path(c,'#451c3c',[[x,-Y],[x+side*.5,-Y],[x+side*.42,Y],[x-side*.12,Y]]);
      for(let i=0;i<7;i++) oval(c,i%3?'#a45b7444':'#ffd69386',side*(X*.44+i*X*.084),-.59+Math.sin(i*2.6)*.2,.018+treble*.015,.023);
    }
    const reveal=ease((p-2.4)/1.1), fan=ease((p-6)/2.5)*(1-ease((p-15)/2));
    const d=Math.min(X*.47,.65);
    figure(c,-d,.075,.97,1,'#242139','#302133',.07+reveal*.13,[.42+mid*.042,.01],'tux');
    figure(c,d,.085,.96,-1,'#883661','#452139',.09-reveal*.16,[.46,-.014],'gown');
    oval(c,'#25132d',0,.42,Math.min(X*.96,1.45),.36);
    oval(c,'#39605c',0,.36,Math.min(X*.94,1.42),.31);
    for(let i=0;i<7;i++){
      const offset=i-3, open=fan*(.4+.6*ease((p-6-i*.16)/2));
      card(c,offset*.014+offset*open*.19,.33+Math.abs(offset)*open*.046,.65+open*.13,offset*open*.17,-Math.cos(open*Math.PI));
    }
    card(c,Math.sin(t*1.6)*.029,.25-reveal*.35,.88+reveal*.31+bass*.10,.11+mid*.14,-Math.cos(reveal*Math.PI));
    return { reveal, fan };
  }
  function naxos(c,X,Y,t,p,bass,mid,treble){
    sky(c,X,Y,'#403454','#f0a478');
    oval(c,'#ffcf8c66',X*.61,-.37,.41+bass*.08,.41+bass*.08);
    oval(c,'#ffe3a4',X*.61,-.37,.28,.28);
    rect(c,'#597f91',-X,.14,2*X,Y-.14);
    for(let i=0;i<18;i++){
      const y=.17+i*.036, x=Math.sin(t*.85+i*.72)*X*.55+X*.27;
      path(c,i%3?'#a1b9b0a5':'#ffd392c7',[[x-.05-i*.03,y],[x+.05+i*.03+mid*.12,y]],.009+bass*.006);
    }
    path(c,'#a96a68',[[-X,Y],[-X,.82],[-X*.57,.48],[.3,.51],[X*.63,.76],[X,.88],[X,Y]]);
    const wake=ease((p-2.3)/3), meet=ease((p-5)/4), crown=ease((p-8)/2.2)*(1-ease((p-15)/2));
    const d=Math.min(X*.53,.7), ax=-d+meet*.18, dx=d-meet*.23;
    figure(c,ax,.68-wake*.23,.87,1,'#e6af9b','#6b382b',-1.04*(1-wake)+meet*.06,[.33+meet*.26,-.04],'gown');
    figure(c,dx,.45,.96,-1,'#743e63','#442943',.14-meet*.07,[.32+meet*.22,-.14-crown*.19],'vine');
    for(let i=0;i<11;i++){
      if(crown<=0)break;
      const a=i*tau/11+t*.62, r=(.16+bass*.09)*crown;
      oval(c,i%3?'#fff3c3':'#fbde8a',ax+Math.cos(a)*r,.04-wake*.32+Math.sin(a)*r*.35,.008+treble*.016,.009+treble*.014);
    }
    return { wake, meet, crown };
  }
  function verona(c,X,Y,t,p,bass,mid,treble){
    sky(c,X,Y,'#111633','#48315b');
    oval(c,'#e8c7b0',-X*.66,-Y*.44,.22,.22);
    for(let i=0;i<25;i++) oval(c,'#f1d6bd92',Math.sin(i*6.93)*X,Math.cos(i*4.13)*Y*.86,.004+treble*.009,.005);
    const wall=X*.21, ledge=.13;
    rect(c,'#332746',wall,-Y,X-wall,Y*2);
    for(let i=0;i<7;i++) for(let j=0;j<5;j++) rect(c,'#76557258',wall+j*.27-(i%2)*.12,-Y+i*.23,.19,.009);
    const x=wall+Math.min(.36,X*.24);
    rect(c,'#9f6e85',x-.26,-.83,.52,.82);
    oval(c,'#e4a776',x,-.68,.211,.172);
    rect(c,'#d29675',x-.21,-.69,.42,.63);
    const appear=ease((p-.75)/2.2), reach=ease((p-4)/3.8)*(1-ease((p-13)/2.45));
    figure(c,x-reach*.15,-.10,.76,-1,'#cb7c93','#653248',appear*.18,[.24+reach*.43,-.09+reach*.44],'gown');
    figure(c,-X*.46+reach*X*.34,.74,.9,1,'#60568b','#352545',-.19*reach,[.29+reach*.32,-.2-reach*.49],'doublet');
    rect(c,'#765b80',wall-.38,ledge,.74,.062);
    for(let i=0;i<7;i++) rect(c,'#b58a9c',wall-.34+i*.106,ledge+.058,.024,.21);
    rect(c,'#63476e',wall-.41,ledge+.26,.8,.083);
    for(let i=0;i<24;i++){
      const y=.91+Math.sin(t*.4+i*.81)*.108;
      const xx=-X+(i/23)*X*.95;
      oval(c,'#272536',xx,y,.046+mid*.028,.102,-.48);
      if(i%3===0)oval(c,'#ffdca9aa',xx,y-.12,.007+bass*.014,.009);
    }
    return { appear, reach };
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}){
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)),t=Math.max(0,time/1000),p=t%18;
    const s=Math.min(w*.36,h*.4),X=w/(2*s),Y=h/(2*s);
    c.save();c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const state=[solitaire,naxos,verona][cast](c,X,Y,t,p,bass,mid,treble);
    label(c,'VI  /  THE LOVERS',0,-Y*.79,.15,'#fff0ca');
    label(c,forms[cast][1],0,Y*.9,.108,'#fff0ca');
    c.restore();
    return { scene:forms[cast][0],...state };
  }
  return { forms,recipes,draw };
})();
