/* A continuous little romance, from anatomy to icon and back. */
window.Hearts = (() => {
  const forms = [['valentine','Paper Valentine'],['nocturne','Midnight Hearts'],['gilded','Gilded Repair']];
  const recipes = forms.map(([,name],form)=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const palettes = [
    ['#29131f','#090911','#ff6586','#a31846','#ffcaab','#fff1df'],
    ['#251741','#080817','#c5a0ff','#6630a5','#97e3eb','#efe7ff'],
    ['#3a1d17','#110a10','#ff9673','#a52e3f','#ffce70','#fff0d1'],
  ];
  const chapters = ['The pump','A language of love','The suit of hearts','Two hearts','Cupid takes aim','Asunder','Reconciliation','Back to the beat'];
  const cuts = [0,5,9,15,21,30,36,43,47];
  // Both silhouettes share the same cubic path topology, so the outline can interpolate.
  const icon = [[0,49],[-82,-4,-60,-72,-25,-55],[-12,-53,-6,-43,0,-34],[15,-62,48,-69,59,-40],[79,-5,34,27,0,49]];
  const organ = [[14,56],[-30,45,-58,12,-47,-19],[-46,-35,-34,-47,-12,-43],[12,-63,39,-42,41,-22],[65,7,40,45,14,56]];
  const mix=(a,b,t)=>a+(b-a)*t;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const TAU=Math.PI*2;
  let time,last,energy,mid,treble,active;
  function reset(){time=0;last=null;energy=mid=treble=0;active=null;}
  reset();
  function line(c,points,col,width=2){
    c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);
    c.strokeStyle=col;c.lineWidth=width;c.stroke();
  }
  function dot(c,x,y,r,color){
    c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=color;c.fill();
  }
  function outline(c,morph){
    c.beginPath();c.moveTo(...icon[0].map((v,i)=>mix(v,organ[0][i],morph)));
    for(let j=1;j<icon.length;j++)c.bezierCurveTo(...icon[j].map((v,i)=>mix(v,organ[j][i],morph)));
    c.closePath();
  }
  function heart(c,x,y,size,p,{morph=0,tilt=0,alpha=1,half=0}={}){
    c.save();c.globalAlpha*=alpha;c.translate(x,y);c.rotate(tilt);c.scale(size,size);
    if(half){
      const edge=[[0,-80],[0,-34],[-10,-17],[8,-4],[-6,11],[6,24],[0,49],[0,80]];
      const end=half*85;c.beginPath();c.moveTo(end,-80);
      for(const pt of edge)c.lineTo(...pt);
      c.lineTo(end,80);c.closePath();c.clip();
    }
    if(morph>.005){
      c.save();c.globalAlpha*=morph;
      c.beginPath();c.moveTo(-13,-34);c.bezierCurveTo(-17,-98,22,-98,31,-59);c.strokeStyle=p[3];c.lineWidth=17;c.stroke();
      c.beginPath();c.moveTo(3,-35);c.bezierCurveTo(1,-58,20,-70,46,-63);c.strokeStyle=p[2];c.lineWidth=11;c.stroke();
      c.restore();
    }
    const fill=c.createLinearGradient(-44,-57,35,51);
    fill.addColorStop(0,p[4]);fill.addColorStop(.24,p[2]);fill.addColorStop(1,p[3]);
    outline(c,morph);c.fillStyle=fill;c.fill();
    c.lineWidth=1.35;c.strokeStyle=p[4]+'a0';c.stroke();
    if(morph>.005){
      c.save();c.globalAlpha*=morph;outline(c,morph);c.clip();
      for(const [ox,oy] of [[0,0],[-10,-5],[10,10]]){
        c.beginPath();c.moveTo(-7+ox,-40+oy);c.bezierCurveTo(29+ox,-13+oy,-19+ox,5+oy,19+ox,51+oy);
        c.strokeStyle=p[3];c.lineWidth=1.8;c.stroke();
      }c.restore();
    }
    c.restore();
  }
  function card(c,x,y,s,angle,p,rank,alpha){
    c.save();c.translate(x,y);c.rotate(angle);c.scale(s,s);c.globalAlpha*=alpha;
    c.beginPath();c.roundRect(-43,-61,86,122,8);c.fillStyle=p[5];c.fill();
    c.strokeStyle=p[4];c.lineWidth=2;c.stroke();
    heart(c,0,3,.45,p);c.fillStyle=p[3];c.font='bold 18px Georgia';c.fillText(rank,-34,-36);
    c.rotate(Math.PI);c.fillText(rank,-34,-36);c.restore();
  }
  function cupid(c,x,y,t,p,aim){
    c.save();c.translate(x,y);
    for(let k=0;k<2;k++){
      c.save();c.rotate(Math.sin(t*13+k)*.26-k*.65);
      c.beginPath();c.moveTo(-7,-6);c.bezierCurveTo(-38,-42,-53,-11,-32,6);c.quadraticCurveTo(-22,17,-7,3);
      c.fillStyle=p[5];c.fill();c.restore();
    }
    line(c,[[0,12],[-13,26],[-23,22]],p[4],6);
    dot(c,2,2,13,p[4]);dot(c,11,-20,12,p[4]);dot(c,8,-27,8,p[2]);dot(c,16,-21,1.5,p[0]);
    line(c,[[5,1],[25,4],[35,aim]],p[4],5);
    c.beginPath();c.moveTo(31,-22+aim);c.quadraticCurveTo(62,aim,31,22+aim);c.strokeStyle=p[2];c.lineWidth=3;c.stroke();
    line(c,[[31,-22+aim],[20,aim],[31,22+aim]],p[5],1);
    c.restore();
  }
  function arrow(c,x,y,a,p){
    c.save();c.translate(x,y);c.rotate(a);
    line(c,[[-32,0],[0,0]],p[5],2);
    line(c,[[-8,-5],[0,0],[-8,5]],p[4],2);
    line(c,[[-32,-4],[-26,0],[-32,4]],p[2],2);c.restore();
  }
  function sparks(c,x,y,t,p,amount=16){
    if(t<0||t>=1.35)return;
    c.save();c.globalAlpha*=1-t/1.35;
    for(let i=0;i<amount;i++){
      const a=i*2.399, r=t*(19+i%7*8);
      dot(c,x+Math.cos(a)*r,y+Math.sin(a)*r+t*t*15,1+i%3*.65,i%2?p[4]:p[2]);
    }c.restore();
  }
  function draw(c,w,h,now,opts={}){
    const pick=typeof opts.form==='number'?opts.form:forms.findIndex(([id])=>id===opts.form);
    const form=Number.isInteger(pick)&&forms[pick]?pick:0;
    if(active!==form){reset();active=form;}
    const running=opts.animate!==false;
    const dt=running&&last!==null?Math.max(0,Math.min(.1,(now-last)/1000)):0;
    last=running?now:null;
    const pace=Math.max(.4,Math.min(2.5,Number(opts.speed)||1));
    time+=dt*pace;
    const ease=1-Math.exp(-dt*11);
    energy+=(clamp(Number(opts.bass)||0)-energy)*ease;
    mid+=(clamp(Number(opts.mid)||0)-mid)*ease;
    treble+=(clamp(Number(opts.treble)||0)-treble)*ease;
    const t=time%47,p=palettes[form];
    let scene=0;while(t>=cuts[scene+1])scene++;
    const local=t-cuts[scene],u=local/(cuts[scene+1]-cuts[scene]);
    const beatPhase=(time*1.27)%1;
    const beat=Math.exp(-beatPhase*17)+.44*Math.exp(-Math.abs(beatPhase-.2)*30);
    const pulse=1+beat*(.045+energy*.10);
    c.save();
    const bg=c.createRadialGradient(w*.5,h*.46,0,w*.5,h*.46,Math.max(w,h)*.65);
    bg.addColorStop(0,p[0]);bg.addColorStop(1,p[1]);c.fillStyle=bg;c.fillRect(0,0,w,h);
    const s=Math.min(w/470,h/330);c.translate(w/2,h*.46);c.scale(s,s);c.lineCap='round';c.lineJoin='round';
    for(let i=0;i<52;i++){
      const x=Math.sin(i*83.7)*215,y=((i*83.7-time*(4+i%4))%290+290)%290-145;
      dot(c,x,y,.65+i%4*.28,p[i%2?2:4]+(i%3?'33':'66'));
    }
    const halo=69+beat*9+energy*9;
    for(let i=0;i<3;i++){
      c.beginPath();c.arc(0,0,halo+i*12,0,TAU);c.strokeStyle=p[2]+['25','14','0c'][i];c.lineWidth=1;c.stroke();
    }
    if(scene===0 || scene===1 || scene===7){
      const morph=scene===0?1:scene===1?1-smooth(u):smooth(u);
      heart(c,0,4,1.35*pulse,p,{morph});
      if(morph>.03){
        c.save();c.globalAlpha=morph;
        for(let i=0;i<14;i++){
          const f=(time*.48+i/14)%1;
          dot(c,Math.sin(f*7.6+i%2)*f*165,-47+Math.cos(f*7.6+i%2)*f*62,1.2+(1-f)*1.2,p[2]+'85');
        }c.restore();
      }
    }else if(scene===2){
      const open=smooth(u*4)*(1-smooth((u-.72)/.28));
      for(let i=-2;i<=2;i++) card(c,i*44*open,4+Math.abs(i)*13*open,1.02+pulse*.04,i*.20*open,p,['10','J','Q','K','A'][i+2],open);
      if(open<1)heart(c,0,4,1.35*pulse,p,{alpha:1-open});
    }else if(scene===3 || scene===4){
      const spacing=scene===3
        ? mix(112,32,smooth(u/.62))+17*smooth((u-.72)/.28)
        : 49;
      const inPair=scene===3?smooth(u*3):1;
      if(inPair<1)heart(c,0,4,1.35*pulse,p,{alpha:1-inPair});
      for(const side of [-1,1])heart(c,side*spacing,4,.76*pulse,p,{tilt:-side*.12,alpha:inPair});
      if(scene===3)sparks(c,0,0,local-2.5,p);
      if(scene===4){
        const cx=-166, cy=-37+Math.sin(time*3)*6;
        const shot=Math.min(3,Math.floor(local/2.25)), a=local-shot*2.25;
        const hit=shot%2===0, tx=shot===2?48:-49, ty=hit?0:shot===1?-86:-100;
        cupid(c,cx,cy,time,p,hit?4:-10);
        if(a>.42 && a<1.27){
          const f=(a-.42)/.85;
          const arc=shot===2?72:0, dy=ty-cy-(hit?4:-10), dx=(hit?tx:166)-cx-43;
          arrow(c,cx+43+f*dx,cy+(hit?4:-10)+f*dy-arc*4*f*(1-f),Math.atan2(dy-arc*4*(1-2*f),dx),p);
        }
        sparks(c,hit?tx:166,ty,a-1.27,p,hit?20:5);
        if(a>=1.27 && a<2.2){
          c.save();c.globalAlpha=clamp((2.2-a)*3);c.fillStyle=p[4];c.font='600 10px Arial';c.textAlign='center';c.fillText(hit?'HIT':'MISS',hit?tx:151,hit?ty-38:ty-12);c.restore();
        }
      }
    }else{
      const broken=scene===5?smooth(u*2):1-smooth(u*1.35);
      const pairFade=scene===5?1-smooth(u*5):0;
      if(pairFade)for(const side of [-1,1])heart(c,side*49,4,.76*pulse,p,{alpha:pairFade,tilt:-side*.12});
      const repaired=scene===6?smooth((u-.63)/.37):0;
      for(const side of [-1,1])heart(c,side*broken*74,4+side*broken*12,1.35*pulse,p,{half:side,tilt:side*broken*.29,alpha:(1-pairFade)*(1-repaired)});
      if(scene===5)sparks(c,0,5,local-.5,p,25);
      if(scene===6){
        heart(c,0,4,1.35*pulse,p,{alpha:repaired});
        c.save();c.globalAlpha=(1-broken)*(1-repaired)*.95;
        line(c,[[0,-34],[-10,-17],[8,-4],[-6,11],[6,24],[0,49]].map(([x,y])=>[x*1.35*pulse,y*1.35*pulse+4]),p[4],2.4);c.restore();
        sparks(c,0,1,local-4.7,p,25);
      }
    }
    const wave=[];for(let i=0;i<=100;i++){
      const x=-187+i*3.74,f=(i/100+1-beatPhase)%1;
      const spike=Math.exp(-Math.pow((f-.43)*43,2))*24-Math.exp(-Math.pow((f-.46)*49,2))*12;
      wave.push([x,119-spike*(.65+energy*.65)+Math.sin(i*.31+time*4)*mid*3]);
    }
    line(c,wave,p[2]+(treble>.4?'b0':'69'),1.1);
    c.textAlign='center';c.fillStyle=p[4];c.font='600 10px Arial';c.fillText('H E A R T S   /   '+forms[form][1].toUpperCase(),0,-124);
    c.fillStyle=p[5];c.font='20px Georgia';c.fillText(chapters[scene],0,150);c.restore();
    return {scene,chapter:chapters[scene],time,pulse,form};
  }
  return {draw,reset,forms,recipes};
})();
