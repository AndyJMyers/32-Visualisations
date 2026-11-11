/* Thirteen theatrical entrances; each prop is a cartoon silhouette. */
window.Clubs = (() => {
  const forms = [['ink',"Printer's Devil"],['lantern','Lantern Parade'],['velvet','Velvet Menace']];
  const recipes = forms.map(([,name],form)=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const deck = [
    ['A','Knobkerrie','The grand salute','knob'],
    ['2','Shillelagh','A jig and a bow','crook'],
    ['3','Cosh','The sideways glare','cosh'],
    ['4','Trench club','The shadow looms','trench'],
    ['5','Mammoth bone','The cave-stomp','bone'],
    ['6','Truncheon','The inspection','baton'],
    ['7','Cudgel','A weighty shrug','cudgel'],
    ['8','Juggling club','An airborne flourish','juggle'],
    ['9','Golf club','The imaginary tee','golf'],
    ['10','Cricket bat','An appeal to the gallery','bat'],
    ['J',"Giant's root club",'The giant takes a bow','root'],
    ['Q','Royal sceptre','A regal turn','royal'],
    ['K',"King's club",'The final flourish','king'],
  ];
  const colors = [
    ['#14181e','#292e32','#e8d4a8','#9f704d','#b34050'],
    ['#261619','#512a25','#ffd591','#be7546','#ff7963'],
    ['#17142b','#38294a','#e8cee8','#9074b7','#e967a4'],
  ];
  const act=5.6, total=act*deck.length;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const tau=Math.PI*2;
  let time,last,bass,active;
  function reset(){time=0;last=null;bass=0;active=null;}
  reset();
  function oval(c,x,y,rx,ry,color){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fillStyle=color;c.fill();
  }
  function poly(c,points,color){
    c.beginPath();c.moveTo(...points[0]);for(const pt of points.slice(1))c.lineTo(...pt);
    c.closePath();c.fillStyle=color;c.fill();
  }
  function line(c,points,color,width){
    c.beginPath();c.moveTo(...points[0]);for(const pt of points.slice(1))c.lineTo(...pt);
    c.strokeStyle=color;c.lineWidth=width;c.stroke();
  }
  function pip(c,x,y,s,color){
    c.save();c.translate(x,y);c.scale(s,s);
    oval(c,0,-10,8,8,color);oval(c,-7,0,8,8,color);oval(c,7,0,8,8,color);
    poly(c,[[-3,2],[3,2],[7,14],[-7,14]],color);c.restore();
  }
  function prop(c,id,p){
    const wood=p[3], light=p[2], dark=p[0];
    if(id==='bone'){
      line(c,[[0,11],[4,-55],[-2,-89]],light,14);
      for(const [x,y] of [[-9,-88],[5,-93],[-5,8],[6,10]])oval(c,x,y,9,8,light);
    }else if(id==='golf'){
      line(c,[[0,9],[0,-93]],light,4);line(c,[[0,-93],[18,-90]],wood,10);
    }else if(id==='bat'){
      line(c,[[0,10],[0,-37]],dark,8);
      poly(c,[[-7,-28],[8,-28],[13,-93],[-13,-93]],wood);
      line(c,[[2,-40],[5,-88]],light,2);
    }else if(id==='royal'){
      line(c,[[0,10],[0,-85]],wood,7);oval(c,0,-91,13,13,light);
      pip(c,0,-91,.48,dark);
    }else if(id==='crook'||id==='root'){
      line(c,[[0,12],[-3,-28],[7,-65],[-3,-86],[-16,-82]],wood,id==='root'?15:8);
      if(id==='root')line(c,[[3,-69],[22,-84]],wood,10);
    }else{
      const thick={knob:8,cosh:11,trench:18,baton:7,cudgel:16,juggle:12,king:22}[id];
      const length={knob:90,cosh:59,trench:85,baton:82,cudgel:90,juggle:82,king:105}[id];
      line(c,[[0,10],[0,-length]],wood,thick*.58);
      oval(c,0,-length+8,thick*.64,id==='juggle'?22:thick*.68,id==='juggle'?light:wood);
      if(id==='trench'||id==='king'){
        for(const dy of [0,10,20])poly(c,[[-8,-length+dy],[-19,-length+dy-7],[-9,-length+dy+6]],light);
      }
      if(id==='baton'||id==='cosh')line(c,[[-4,4],[4,4]],light,3);
      if(id==='knob')oval(c,-3,-length+5,3,3,light);
    }
  }
  function actor(c,i,x,t,walking,show,p){
    const gait=Math.sin(t*(i===1?19:12));
    const jig=i===1?Math.abs(Math.sin(t*13))*15:0;
    const stomp=i===4?Math.max(0,Math.sin(t*9))*19:0;
    const bob=walking?Math.abs(gait)*-7:-show*(3+bass*8+jig+stomp);
    const width=[1,.75,.87,1.12,1.32,.94,1.15,.76,.83,1,1.38,.95,1.27][i];
    const lean=walking?.12:show*[0,.18,-.24,.18,.11,-.08,-.2,0,.36,-.14,.48,.1,-.16][i];
    const coat=i%3===0?p[4]:i%3===1?p[3]:p[1];
    oval(c,x,110,48*width,8,p[0]+'ba');
    c.save();c.translate(x,104+bob);c.rotate(lean);c.scale(width*(i===11?.22+.78*Math.abs(Math.cos(show*tau)):1),1);
    for(const side of [-1,1]){
      const stride=walking?gait*side*20:side*(i===4?10:3)+(i===1?gait*side*show*15:0);
      line(c,[[side*13,-44],[side*17+stride*.55,-21],[side*17+stride,-1]],p[0],14);
      line(c,[[side*17+stride,-1],[side*17+stride+12,-1]],p[2],7);
    }
    poly(c,[[-29,-102],[26,-104],[36,-46],[-31,-43]],coat);
    line(c,[[-24,-92],[-38,-64],[i%2?-20:-35,-49]],p[2],10);
    line(c,[[-26,-50],[30,-50]],p[0],6);
    oval(c,0,-50,7,5,p[2]);pip(c,0,-50,.24,p[0]);
    const headY=-121-(i===10?12:0);
    oval(c,0,headY,21,i===4?22:19,p[2]);
    if(i>=10){
      poly(c,[[-24,headY-9],[-27,headY-31],[-12,headY-21],[0,headY-37],[11,headY-21],[27,headY-32],[23,headY-9]],p[3]);
      pip(c,0,headY-18,.34,p[2]);
    }else if(i===3||i===5){
      oval(c,-2,headY-12,24,12,p[1]);line(c,[[-23,headY-8],[23,headY-8]],p[3],4);
    }else{
      poly(c,[[-23,headY-7],[-17,headY-24],[8,headY-25],[24,headY-7]],p[0]);
      if(i===4)line(c,[[-12,headY+7],[4,headY+17],[14,headY+9]],p[3],8);
    }
    line(c,[[-13,headY-5],[-5,headY-2]],p[0],3);
    line(c,[[4,headY-2],[14,headY-5]],p[0],3);
    line(c,[[-6,headY+8],[6,headY+10],[12,headY+5]],p[0],2);
    const lift=i===7?Math.sin(Math.PI*show)*40:0;
    const handX=42+show*[5,6,-15,7,12,-8,9,9,13,-9,-6,1,5][i];
    const handY=-76+show*[-40,-12,4,-23,-8,-18,13,-16,31,-36,6,-28,-35][i];
    line(c,[[22,-91],[31,-68], [handX,handY]],coat,13);
    oval(c,handX,handY,7,7,p[2]);
    c.translate(handX,handY-lift);
    c.rotate(walking?.32+gait*.15:(i%2?.54:-.3)+show*[-.7,.8,1.42,-1.12,.55,.16,1.1,tau,2.5,-1.4,.92,-.74,-2.1][i]);
    prop(c,deck[i][3],p);c.restore();
  }
  function draw(c,w,h,now,opts={}){
    const selected=typeof opts.form==='number'?opts.form:forms.findIndex(([id])=>id===opts.form);
    const form=forms[selected]?selected:0;
    if(active!==form){reset();active=form;}
    const running=opts.animate!==false, dt=running&&last!==null?Math.max(0,Math.min(.1,(now-last)/1000)):0;
    last=running?now:null;
    time+=dt*Math.max(.4,Math.min(2.5,Number(opts.speed)||1));
    bass+=(clamp(Number(opts.bass)||0)-bass)*(1-Math.exp(-dt*12));
    const cycle=time%total,i=Math.min(12,Math.floor(cycle/act)), t=cycle-i*act, [rank,name,gag]=deck[i], p=colors[form];
    const phase=t<1.25?'entrance':t>=4.25?'exit':'act';
    const x=phase==='entrance'?-310+345*smooth(t/1.25):phase==='exit'?35+275*smooth((t-4.25)/1.35):35;
    const show=phase==='act'?Math.sin(Math.PI*clamp((t-1.25)/3))**2:0;
    c.save();
    const bg=c.createRadialGradient(w*.5,h*.49,0,w*.5,h*.49,Math.max(w,h)*.7);
    bg.addColorStop(0,p[1]);bg.addColorStop(1,p[0]);c.fillStyle=bg;c.fillRect(0,0,w,h);
    const s=Math.min(w/500,h/350);c.translate(w/2,h*.49);c.scale(s,s);
    c.beginPath();c.rect(-248,-174,496,348);c.clip();c.lineCap='round';c.lineJoin='round';
    const swing=Math.sin(time*.9)*22;
    poly(c,[[-30+swing,-151],[30+swing,-151],[192,112],[-172,112]],p[2]+'13');
    for(let j=0;j<18;j++)oval(c,Math.sin(j*38.2)*237,((j*37+time*7)%258)-149,.8+j%3*.3,.8,p[2]+'45');
    line(c,[[-238,111],[238,111]],p[3],1.5);
    for(let j=0;j<13;j++)pip(c,(j-6)*21,126,.42,j===i?p[2]:p[3]+'72');
    c.save();c.translate(-163,-18);c.rotate(-.10);
    c.beginPath();c.roundRect(-43,-63,86,126,8);c.fillStyle=p[2];c.fill();c.lineWidth=2;c.strokeStyle=p[3];c.stroke();
    c.fillStyle=p[0];c.font='bold 18px Georgia';c.fillText(rank,-34,-38);
    pip(c,-27,-27,.35,p[0]);pip(c,0,4,1.35,p[0]);
    c.rotate(Math.PI);c.fillText(rank,-34,-38);c.restore();
    if(phase==='act'){
      c.save();c.globalAlpha=show*.40;c.translate(62,2);c.scale(1.17,1.13);
      oval(c,0,-28,39+12*show,55,p[0]);c.restore();
      for(let j=0;j<9;j++){
        const a=j*tau/9+time*.75;
        oval(c,x+Math.cos(a)*(56+show*25),-4+Math.sin(a)*44,1.2+bass,1.2+bass,p[2]+'9a');
      }
    }
    actor(c,i,x,t,phase!=='act',show,p);
    c.textAlign='center';c.fillStyle=p[2];c.font='600 11px Arial';c.fillText('C L U B S   /   '+forms[form][1].toUpperCase(),0,-151);
    c.font='21px Georgia';c.fillText(name,0,151);
    c.font='10px Arial';c.fillText(rank+' OF CLUBS  /  '+gag.toUpperCase(),0,168);
    c.restore();
    return {rank,index:i,phase,time};
  }
  return {draw,reset,forms,recipes};
})();
