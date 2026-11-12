/* A fictional underground colony: specialist crews build a shared light. */
window.HellstromHive = (() => {
  const forms = [['amber','Amber Works'],['violet','Violet Relay'],['blue','The Cold Colony']];
  const recipes = forms.map(([,name],form)=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const palettes = [
    ['#101112','#30231e','#dc9c56','#ffe19c','#b76d58','#91c6ad'],
    ['#120e20','#312044','#be8deb','#ead5ff','#d98a99','#84d4cb'],
    ['#08131c','#173345','#69b9df','#dbf6ff','#e0ae76','#80d9c5'],
  ];
  const roles = ['EXTRACTORS','FITTERS','KEEPERS'];
  const captions = ['Extract the amber','Carry it to the fitters','Build the lantern','Relay the finished light','Light the new chamber','An intruder at the gate','The heat of the day'];
  const cuts = [0,4,8,12,16,20,28,38], duration = cuts[cuts.length-1], tau = Math.PI*2;
  const clamp = x=>Math.max(0,Math.min(1,x));
  const mix = (a,b,t)=>a+(b-a)*t;
  const smooth = x=>{x=clamp(x);return x*x*(3-2*x);};
  const fract = x=>x-Math.floor(x);
  let last,time,bass,mid,treble,burst,average,previous,form;
  function reset(){last=null;time=bass=mid=treble=burst=average=previous=0;form=null;}
  reset();
  function oval(c,x,y,rx,ry,color){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fillStyle=color;c.fill();
  }
  function line(c,pts,color,width){
    c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);
    c.strokeStyle=color;c.lineWidth=width;c.stroke();
  }
  function hex(c,x,y,rx,ry){
    c.beginPath();
    for(let i=0;i<6;i++){
      const a=i*tau/6;
      if(i)c.lineTo(x+Math.cos(a)*rx,y+Math.sin(a)*ry);
      else c.moveTo(x+Math.cos(a)*rx,y+Math.sin(a)*ry);
    }
    c.closePath();
  }
  function lamp(c,x,y,s,glow,p){
    c.save();c.translate(x,y);c.scale(s,s);
    if(glow>0){
      const g=c.createRadialGradient(0,0,0,0,0,66);g.addColorStop(0,p[3]);g.addColorStop(1,p[2]+'00');
      c.save();c.globalAlpha*=glow*.52;c.fillStyle=g;c.fillRect(-66,-66,132,132);c.restore();
    }
    hex(c,0,0,13,17);c.fillStyle=glow>.1?p[3]:p[2];c.fill();c.lineWidth=1.8;c.strokeStyle=p[5];c.stroke();
    line(c,[[-9,-9],[0,8],[9,-9]],p[1],1.2);c.restore();
  }
  function worker(c,x,y,t,role,p,working,facing=1){
    const step=Math.sin(t*9), reach=working?Math.sin(t*(role===0?7:5))*7:step*6;
    c.save();c.translate(x,y-Math.abs(step)*1.5);c.scale(facing,1);
    c.save();c.rotate(Math.sin(t*19)*.13);
    oval(c,-10,-13,11,5,p[5]+'67');oval(c,-9,-7,9,4,p[5]+'41');c.restore();
    line(c,[[-4,0],[-6+step*3,9],[-6+step*5,14]],p[3],3);
    line(c,[[4,0],[7-step*3,9],[7-step*5,14]],p[3],3);
    oval(c,0,-9,8,13,p[role===0?2:role===1?4:5]);
    line(c,[[-6,-9],[6,-9]],p[1],3.4);line(c,[[-6,-3],[6,-3]],p[1],2.6);
    oval(c,1,-23,6.8,7.5,p[3]);oval(c,4,-23,1.4,1.4,p[0]);
    line(c,[[-2,-29],[-4,-35]],p[3],1.2);line(c,[[4,-29],[7,-34]],p[3],1.2);
    line(c,[[4,-15],[11,-11],[17+reach,-15+reach*.5]],p[3],2.7);
    if(working){
      if(role===0) line(c,[[17+reach,-15+reach*.5],[24+reach,-19+reach*.5],[29+reach,-15+reach*.5]],p[5],2.5);
      else oval(c,18+reach,-15+reach*.5,3.5,3.5,p[2]);
    }
    c.restore();
  }
  function swarm(c,x,y,t,k,p,pressure=0){
    const expansion=(burst*28+bass*15)*(1-pressure)-pressure*17;
    for(let i=0;i<30;i++){
      const f=fract(i*.618+k*.21+t*(.20+i%5*.024+mid*.1));
      const angle=i*2.399+t*(.86+i%4*.15)+Math.sin(t*4+i)*treble*.65;
      const r=12+f*(33+expansion)+i%4*3;
      const bx=x+Math.cos(angle)*r, by=y+Math.sin(angle)*r*.55;
      const flap=.65+Math.abs(Math.sin(t*33+i))*1.65;
      c.save();c.globalAlpha*=smooth(f*12)*smooth((1-f)*8);
      c.translate(bx,by);c.rotate(angle+Math.PI*.5);
      oval(c,-1,-1.6,1.4,flap,p[5]+'a0');oval(c,1,1.6,1.4,flap,p[5]+'a0');
      oval(c,0,0,2.35,1.25,p[i%5?2:3]);c.restore();
    }
  }
  function wasp(c,x,y,t,direction,alpha){
    c.save();c.globalAlpha*=alpha;c.translate(x,y);c.scale(direction,1);
    const wing=Math.sin(t*42)*.24;
    c.save();c.rotate(wing);oval(c,2,-8,19,5,'#fff1bd99');c.restore();
    c.save();c.rotate(-wing);oval(c,4,7,15,4,'#fff1bd66');c.restore();
    oval(c,7,0,18,7,'#efa944');oval(c,-8,0,8,5,'#3a241d');
    oval(c,-16,-1,5,5,'#efa944');oval(c,-18,-2,1.5,1.5,'#251a1b');
    for(const z of [3,12])oval(c,z,0,2.5,6,'#3a241d');
    line(c,[[-18,-4],[-24,-10],[-29,-10]],'#f9d085',1.4);
    line(c,[[23,1],[29,1]],'#3a241d',1.4);c.restore();
  }
  function midday(c,w,h,s,t,u,p,portrait){
    c.save();
    const blend=smooth(u*9)*smooth((1-u)*8);
    c.globalAlpha*=blend;
    const sky=c.createLinearGradient(0,0,0,h);
    sky.addColorStop(0,'#5f3627');sky.addColorStop(.6,'#bd7745');sky.addColorStop(1,'#34231e');
    c.fillStyle=sky;c.fillRect(0,0,w,h);
    c.translate(w/2,h/2);c.scale(s,s);
    const sunY=portrait?-130:-87;
    const glow=c.createRadialGradient(76,sunY,9,76,sunY,112);
    glow.addColorStop(0,'#ffe28fc9');glow.addColorStop(1,'#ffe28f00');
    c.fillStyle=glow;c.fillRect(-36,sunY-112,224,224);
    oval(c,76,sunY,29,29,'#ffe19c');
    oval(c,0,71,portrait?117:253,69,'#77503b');
    oval(c,0,79,portrait?117:248,53,'#56362b');
    hex(c,0,53,60,32);c.fillStyle='#2b221e';c.fill();
    c.strokeStyle=p[2];c.lineWidth=2;c.stroke();
    line(c,[[-57,74],[57,74]],'#c28f5d',2);
    // Stationary fanners send translucent ribbons of warm air away from the entrance.
    for(let j=0;j<11;j++){
      const f=fract(t*.17+j/11);
      const x=(j%5-2)*20,y=59-f*(portrait?143:106);
      c.beginPath();c.moveTo(x-11,y);
      c.quadraticCurveTo(x+Math.sin(f*8+j+t)*(13+bass*4),y-11,x+12,y-6);
      c.lineWidth=1.1;c.strokeStyle='#ffe5b1';
      c.save();c.globalAlpha*=Math.sin(f*Math.PI)*(.28+mid*.26);c.stroke();c.restore();
    }
    for(let j=0;j<9;j++){
      const x=(j-4)*12, y=75+Math.abs(j-4)*1.3, flap=1+Math.abs(Math.sin(t*28+j))*5;
      oval(c,x-4,y-4,flap,2.3,'#ffedcaa0');oval(c,x+4,y-4,flap,2.3,'#ffedcaa0');
      oval(c,x,y,4,6,'#f5ba65');oval(c,x,y,4,1.4,'#684430');oval(c,x,y-6,2.6,2.6,'#51362b');
    }
    c.textAlign='center';c.fillStyle='#fff0ca';c.font='600 12px Arial';
    c.fillText("HELLSTROM'S HIVE",0,portrait?-200:-134);
    c.font='21px Georgia';c.fillText('The heat of the day',0,portrait?157:118);
    c.font='11px Arial';c.fillText('FANNING THE ENTRANCE',0,portrait?176:136);
    c.restore();
  }
  function draw(c,w,h,now,opts={}){
    const i=typeof opts.form==='number'?opts.form:forms.findIndex(([id])=>id===opts.form);
    const selected=forms[i]?i:0;
    if(selected!==form){reset();form=selected;}
    const running=opts.animate!==false;
    const dt=running&&last!==null?Math.min(.1,Math.max(0,(now-last)/1000)):0;
    last=running?now:null;
    if(dt){
      const low=clamp(Number(opts.bass)||0);
      if(low>Math.max(.19,average*1.2+.04) && low-previous>.025)burst=1;
      burst*=Math.exp(-dt*2.6);
      average+=(low-average)*(1-Math.exp(-dt*3));previous=low;
      const ease=1-Math.exp(-dt*10);
      bass+=(low-bass)*ease;mid+=(clamp(Number(opts.mid)||0)-mid)*ease;treble+=(clamp(Number(opts.treble)||0)-treble)*ease;
      time+=dt*Math.max(.4,Math.min(2.5,Number(opts.speed)||1));
    }
    const cycle=time%duration;
    let phase=0;while(cycle>=cuts[phase+1])phase++;
    const u=(cycle-cuts[phase])/(cuts[phase+1]-cuts[phase]);
    const p=palettes[form],portrait=h>w*1.09;
    const centres=portrait?[[0,-126],[0,0],[0,126]]:[[-172,15],[0,15],[172,15]];
    const s=Math.min(w/(portrait?260:560),h/(portrait?440:340));
    c.save();
    const bg=c.createRadialGradient(w*.5,h*.49,0,w*.5,h*.49,Math.max(w,h)*.68);
    bg.addColorStop(0,p[1]);bg.addColorStop(1,p[0]);c.fillStyle=bg;c.fillRect(0,0,w,h);
    c.translate(w/2,h/2);c.scale(s,s);c.lineJoin='round';c.lineCap='round';
    for(let j=0;j<120;j++){
      const x=(fract(j*.618)-.5)*(portrait?250:550), y=(fract(j*.414)-.5)*(portrait?405:306);
      oval(c,x,y,1+j%3*.55,1,p[2]+'24');
    }
    line(c,centres,p[0],36);line(c,centres,p[2]+'49',2.5);
    for(let k=0;k<3;k++){
      const [x,y]=centres[k];
      hex(c,x,y,80,portrait?55:72);
      c.fillStyle=p[0];c.fill();c.lineWidth=2;c.strokeStyle=p[2]+'a0';c.stroke();
      const lit=k===2&&phase>=4?(phase===4?smooth(u*3):1):0;
      if(lit){
        c.save();c.globalAlpha=lit*.26;hex(c,x,y,79,portrait?54:71);c.fillStyle=p[3];c.fill();c.restore();
      }
      for(let n=0;n<5;n++)line(c,[[x-42+n*19,y+28],[x-33+n*19,y+28]],p[2]+'63',1);
      c.fillStyle=p[3];c.font='600 10px Arial';c.textAlign='center';
      c.fillText(roles[k],x,y+(portrait?44:57));
    }
    const from=phase<=1?0:phase<=3?1:2;
    const to=phase===1?1:phase===3?2:from;
    const pos=[mix(centres[from][0],centres[to][0],smooth(u)),mix(centres[from][1],centres[to][1],smooth(u))];
    if(from!==to){
      for(let j=0;j<8;j++){
        const f=fract(u+j*.127);
        oval(c,mix(centres[from][0],centres[to][0],f),mix(centres[from][1],centres[to][1],f),1.6,1.6,p[2]+'a0');
      }
      worker(c,pos[0]-18,pos[1]+7,time,1,p,false);
    }
    const intruder=phase===5;
    const approach=smooth(u/.32), retreat=smooth((u-.57)/.35);
    const waspX=portrait?mix(141,29,approach)+retreat*125:mix(303,139,approach)+retreat*174;
    const waspY=(portrait?122:0)+Math.sin(time*7)*(3+burst*2);
    const muster=intruder?smooth((u-.16)/.30)*(1-smooth((u-.72)/.25)):0;
    for(let k=0;k<3;k++){
      const [x,y]=centres[k], working=phase===k*2;
      worker(c,x-33,y+11,time+k*.8,k,p,working);
      worker(c,x+32,y+13,time+k*.8+.32,k,p,working,-1);
      for(let j=0;j<2;j++){
        const a=(k*2+j)*tau/6+time*.9;
        swarm(c,mix(x+(j?31:-31),waspX+Math.cos(a)*22,muster),
          mix(y-14,waspY+Math.sin(a)*18,muster),time,k*2+j,p,muster);
      }
    }
    if(intruder)wasp(c,waspX,waspY,time,u<.58?1:-1,smooth(u*14)*smooth((1-u)*14));
    if(phase<=2){
      const assembly=phase===2?smooth(u):0;
      const r=phase===0?7+smooth(u)*4:11;
      c.save();c.globalAlpha*=1-assembly;
      hex(c,pos[0],pos[1]-5,r,r*.8);c.fillStyle=p[2];c.fill();
      line(c,[[pos[0]-r*.5,pos[1]-7],[pos[0],pos[1]-2],[pos[0]+r*.6,pos[1]-8]],p[3],1.5);
      c.restore();
      if(phase===2){
        c.save();c.globalAlpha*=assembly;
        lamp(c,pos[0],pos[1]-5,.84,assembly*.44,p);c.restore();
      }
    }else{
      lamp(c,pos[0],pos[1]-5,.84,phase===4?mix(.52,.77+bass*.23,smooth(u*3)):.52,p);
    }
    c.textAlign='center';c.fillStyle=p[3];c.font='600 12px Arial';
    c.fillText("HELLSTROM'S HIVE",0,portrait?-200:-134);
    c.font='10px Arial';c.fillText(forms[form][1].toUpperCase(),0,portrait?-183:-114);
    const caption=phase===6?'The chamber is lit':intruder&&u>.61?'Driven back by the swarm':captions[phase];
    c.font='21px Georgia';c.fillText(caption,0,portrait?196:127);
    c.strokeStyle=p[2]+'66';c.lineWidth=2;c.strokeRect(-82,portrait?207:141,164,3);
    c.fillStyle=p[3];c.fillRect(-82,portrait?207:141,164*cycle/duration,3);
    c.restore();
    if(phase===6)midday(c,w,h,s,time,u,p,portrait);
    return {time,phase,swarm:180,burst,form,intruder:intruder?(u>.61?'retreating':'approaching'):null,fanning:phase===6};
  }
  return {draw,reset,forms,recipes};
})();
