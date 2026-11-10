/* Original spy-cinema tableaux projected through a breathing anamorphic squeeze. */
window.AnamorphicSqueeze=(()=>{
  const TAU=Math.PI*2,W=1280,H=536;
  const forms=['barrel','casino','alpine','abyss'];
  const names=['Licence to Illuminate','Velvet, Gold & Dangerous Company','The Alpine Arrangement','Deep Cover'];
  const recipes=names.map((name,form)=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),wrap=(x,n)=>(x%n+n)%n;
  const noise=i=>{const n=Math.sin(i*71.17+8)*43758.54;return n-Math.floor(n);};
  let time=0,last=null,active=null,bass=0,mid=0,treble=0,surface,sc;
  function reset(){time=0;last=null;active=null;bass=mid=treble=0;surface=sc=null;}
  function ellipse(c,x,y,rx,ry,colour){c.fillStyle=colour;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
  function line(c,p,colour,w=2){c.strokeStyle=colour;c.lineWidth=w;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
  function shape(c,p,colour){c.fillStyle=colour;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
  function sky(c,top,bottom){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(1,bottom);c.fillStyle=g;c.fillRect(0,0,W,H);}
  function flare(c,x,y,colour,amount=1){
    c.save();c.globalCompositeOperation='screen';c.globalAlpha=clamp(amount);
    const g=c.createLinearGradient(x-620,y,x+620,y);g.addColorStop(0,'#00000000');g.addColorStop(.45,colour+'22');g.addColorStop(.5,colour+'cc');g.addColorStop(.55,colour+'22');g.addColorStop(1,'#00000000');
    c.fillStyle=g;c.fillRect(x-620,y-1.5,1240,3);
    const halo=c.createRadialGradient(x,y,0,x,y,55);halo.addColorStop(0,colour+'bb');halo.addColorStop(.1,colour+'55');halo.addColorStop(1,colour+'00');
    c.save();c.translate(x,y);c.scale(3.5,.25);c.fillStyle=halo;c.fillRect(-55,-55,110,110);c.restore();
    for(let i=0;i<4;i++)ellipse(c,x+(640-x)*(.35+i*.45),y+(268-y)*.2,4+i*3,12+i*6,colour+'16');c.restore();
  }
  function spy(c,x,y,s,t,aim=false){
    c.save();c.translate(x,y);c.scale(s,s);
    const stride=aim?0:Math.sin(t*4)*16,breath=Math.sin(t*1.6)*2;
    line(c,[[-11,4],[-20+stride,49],[-27+stride,95]],'#10121b',16);
    line(c,[[10,4],[19-stride,48],[25-stride,95]],'#10121b',16);
    line(c,[[-31+stride,95],[-13+stride,95]],'#181b26',8);line(c,[[20-stride,95],[38-stride,95]],'#181b26',8);
    shape(c,[[-23,-62],[21,-62],[27,-8],[15,18],[-16,18],[-26,-8]],'#11131f');
    shape(c,[[-10,-59],[10,-59],[0,-18]],'#e1dfd3');shape(c,[[-9,-57],[0,-53],[9,-57],[9,-49],[0,-53],[-9,-49]],'#0d1420');
    ellipse(c,0,-88+breath,14,19,'#b9b1a2');ellipse(c,-3,-99+breath,14,9,'#181b24');
    line(c,[[-22,-52],[-32,-20+stride*.5],[-26,5+stride]],'#151925',12);
    const hand=aim?[66,-60]:[32,-4-stride*.4];
    line(c,[[21,-51],aim?[39,-64]:[35,-27],hand],'#151925',12);
    ellipse(c,hand[0],hand[1],5,5,'#bab1a1');
    c.save();c.translate(...hand);c.rotate(aim?0:-.9);c.fillStyle='#1a2430';c.fillRect(-2,-7,30,7);c.fillRect(0,-1,7,13);c.restore();c.restore();
  }
  function woman(c,x,y,s,t,colour){
    c.save();c.translate(x,y);c.scale(s,s);const sway=Math.sin(t*1.3)*7;
    line(c,[[sway-9,15],[-22+Math.sin(t)*6,86],[-31,130]],'#c9a695',9);
    line(c,[[sway+7,15],[22,80],[17,130]],'#c9a695',9);
    line(c,[[-32,130],[-18,130]],colour,6);line(c,[[15,130],[30,130]],colour,6);
    shape(c,[[sway-14,-78],[sway+13,-78],[sway+21,-55],[sway+12,-24],[sway+29,19],[sway+19,76],[sway+5,62],[sway-7,21],[sway-32,77],[sway-27,9],[sway-12,-24],[sway-21,-55]],colour);
    line(c,[[sway-15,-71],[-36,-43],[-22,-18]],'#c9a695',7);
    line(c,[[sway+16,-70],[40,-54+Math.sin(t)*7],[51,-90+Math.sin(t)*7]],'#c9a695',7);
    line(c,[[51,-91+Math.sin(t)*7],[51,-111+Math.sin(t)*7]],'#d4cba4',1);
    line(c,[[41,-122+Math.sin(t)*7],[51,-111+Math.sin(t)*7],[61,-122+Math.sin(t)*7],[41,-122+Math.sin(t)*7]],'#eed99c',1);
    line(c,[[sway-2,-83],[sway-2,-70]],'#c9a695',7);ellipse(c,sway,-108,13,19,'#c9a695');ellipse(c,sway-8,-115,14,17,'#19121a');
    line(c,[[sway+6,-108],[sway+11,-107]],'#181423',1.5);line(c,[[sway+7,-100],[sway+11,-101]],'#e77885',2);
    c.restore();
  }
  function barrel(c,t){
    sky(c,'#101723','#9aadb0');const turn=t*.13;
    for(let i=0;i<8;i++){
      const a=i*TAU/8+turn;c.save();c.translate(640,268);c.rotate(a);
      const g=c.createLinearGradient(-200,-350,450,250);g.addColorStop(0,'#040912');g.addColorStop(.45,'#35464e');g.addColorStop(.58,'#b7c0b9');g.addColorStop(1,'#101a25');
      c.fillStyle=g;c.beginPath();c.moveTo(230,-30);c.bezierCurveTo(345,-123,474,-179,740,-148);c.lineTo(850,430);c.bezierCurveTo(492,51,339,45,230,30);c.closePath();c.fill();c.restore();
    }
    ellipse(c,640,268,224,224,'#d1d6cc');ellipse(c,640,268,218,218,'#e3e4d7');
    c.save();c.beginPath();c.arc(640,268,214,0,TAU);c.clip();
    const cycle=wrap(t,14),aim=cycle>7,x=aim?640:450+cycle*27;
    line(c,[[390,448],[880,448]],'#939e9a',2);spy(c,x,337,1.04,t,aim);
    if(cycle>8&&cycle<8.25){c.globalAlpha=1-(cycle-8)/.25;ellipse(c,x+96,273,24+bass*24,8,'#fff9cb');}
    c.restore();
    const flash=Math.max(0,1-Math.abs(wrap(t-8,14))/.65);
    flare(c,640+Math.sin(t*.7)*230,182,'#a8d6ff',.4+bass*.5+flash*.4);
  }
  function casino(c,t){
    sky(c,'#160d1d','#493120');
    for(let i=0;i<34;i++){
      const x=noise(i)*W,y=noise(i+45)*310,twinkle=.2+.3*Math.sin(t*.6+i)+treble*.3;
      c.save();c.globalAlpha=clamp(twinkle);ellipse(c,x,y,4+noise(i+2)*7,12+noise(i+3)*19,'#f2c76a');c.restore();
    }
    for(let i=0;i<6;i++){const x=i*255-35;line(c,[[x,0],[x,397]],'#b5894e55',3);line(c,[[x+10,0],[x+10,397]],'#d8b17222',1);}
    ellipse(c,640,427,315,96,'#0a252b');ellipse(c,640,412,319,86,'#b79a60');ellipse(c,640,410,305,76,'#163c3c');
    for(let i=0;i<14;i++){const a=i*TAU/14+t*.17;ellipse(c,640+Math.cos(a)*120,410+Math.sin(a)*31,10,3,i%2?'#d8d1b0':'#912e43');}
    for(let i=0;i<5;i++){c.save();c.translate(600+i*26,381+i%2*8);c.rotate(Math.sin(t*.4+i)*.2);c.fillStyle='#e7dfc9';c.fillRect(-10,-15,20,30);c.fillStyle=i%2?'#a93143':'#121e2a';c.font='13px Georgia';c.fillText(i%2?'A':'K',-7,0);c.restore();}
    spy(c,370+Math.sin(t*.3)*11,305,1.23,t*.15,true);woman(c,922+Math.sin(t*.4)*8,302,1.3,t,'#b88b4e');
    line(c,[[105,455],[235,455]],'#c9a65d',2);line(c,[[170,455],[170,405]],'#c9a65d',2);line(c,[[130,368],[170,405],[210,368],[130,368]],'#d9bc7c',2);
    flare(c,780+Math.sin(t*.23)*360,142,'#f6c26b',.5+bass*.5);
  }
  function sportscar(c,x,y,s,t,colour,rear=false){
    c.save();c.translate(x,y);c.scale(s,s);
    shape(c,[[-116,20],[-109,-17],[-69,-33],[-46,-64],[45,-64],[72,-33],[113,-18],[120,22],[93,35],[-94,35]],colour);
    shape(c,[[-61,-31],[-38,-56],[36,-56],[61,-31]],'#15303c');line(c,[[-90,-21],[-69,16],[70,16],[92,-21]],'#d5e2dc88',2);
    for(const xx of [-94,94]){ellipse(c,xx,20,17,24,'#06101a');ellipse(c,xx,20,10,15,'#889a9d');}
    const lights=rear?'#ff634d':'#e8fbf8';line(c,[[-90,-14],[-62,-12]],lights,7);line(c,[[65,-12],[94,-14]],lights,7);
    c.fillStyle='#14222c';c.fillRect(-36,17,72,13);line(c,[[-19,27],[20,27]],'#c6bc89',3);
    c.restore();
  }
  function alpine(c,t){
    sky(c,'#12344d','#e9c6a7');ellipse(c,1040,88,47,47,'#eed8a6');
    for(let layer=0;layer<3;layer++){
      const p=[[0,H]];for(let i=0;i<=15;i++)p.push([i*105-70+Math.sin(t*.12)*layer*9,180+layer*65-Math.sin(i*1.7+layer)*80-noise(i+layer*15)*100]);p.push([W,H]);shape(c,p,['#6d8394','#52697d','#334f62'][layer]);
      if(!layer)for(let i=0;i<8;i++){const x=i*180+20,y=80+noise(i)*60;shape(c,[[x-38,y+31],[x,y],[x+48,y+28],[x+9,y+16],[x-8,y+25]],'#e4e4d6');}
    }
    const bend=Math.sin(t*.32)*190+Math.sin(t*.13)*80,road=[];
    for(let i=0;i<=50;i++){const z=i/50,y=235+z*z*330,centre=640+bend*(1-z)*Math.sin(z*3+1);road.push({y,x:centre,half:7+z*z*540});}
    shape(c,[...road.map(p=>[p.x-p.half-13,p.y]),...road.slice().reverse().map(p=>[p.x+p.half+13,p.y])],'#c5c2b2');
    shape(c,[...road.map(p=>[p.x-p.half,p.y]),...road.slice().reverse().map(p=>[p.x+p.half,p.y])],'#263342');
    for(let i=0;i<30;i++){
      const z=wrap(i/30+t*.16,1),p=road[Math.floor(z*50)],size=2+z*12;
      line(c,[[p.x,p.y],[p.x-bend*.013,p.y+size]],'#e2d4ad',1+z*4);
      for(const side of [-1,1]){const x=p.x+side*(p.half+20);line(c,[[x,p.y],[x,p.y-size*2]],'#ccd5cd',1+z*2);}
    }
    sportscar(c,640+bend*.43,389+Math.sin(t*2)*2,.82,t,'#c5d1cd',true);
    sportscar(c,825+bend*.24,490,1.15,t,'#263140');
    for(let i=0;i<14;i++){const z=wrap(i/14+t*.09,1),x=640+Math.sin(i*5)*650*z,y=240+z*z*330;ellipse(c,x,y,2+z*5,1+z*2,'#f3efe3aa');}
    flare(c,340+Math.sin(t*.32)*230,301,'#91caff',.5+bass*.4);
  }
  function diver(c,x,y,s,t,flip=1){
    c.save();c.translate(x,y);c.scale(s*flip,s);c.rotate(Math.sin(t*.8)*.08);
    ellipse(c,0,0,32,12,'#071b28');ellipse(c,38,-1,12,11,'#081722');line(c,[[42,-5],[51,-4]],'#73cfc7',5);
    line(c,[[-24,1],[-54,-6+Math.sin(t*3)*15],[-88,-10+Math.sin(t*3+1)*19]],'#091c2a',9);
    line(c,[[-24,5],[-56,14-Math.sin(t*3)*15],[-85,21-Math.sin(t*3+1)*19]],'#102d3c',8);
    shape(c,[[-84,-15+Math.sin(t*3+1)*19],[-106,-14+Math.sin(t*3+1)*19],[-86,Math.sin(t*3+1)*19]],'#b6a966');
    line(c,[[11,4],[35,24],[70,14]],'#102d3b',7);ellipse(c,-1,-10,21,7,'#697d7e');
    for(let i=0;i<8;i++){const a=wrap(t*.3+i/8,1);c.strokeStyle='#a3e9e777';c.lineWidth=.8;c.beginPath();c.ellipse(48-a*25+Math.sin(t+i)*6,-13-a*130,1+a*4,3+a*5,0,0,TAU);c.stroke();}
    c.restore();
  }
  function abyss(c,t){
    sky(c,'#0b4c63','#020d20');
    for(let i=0;i<16;i++){
      c.save();c.globalAlpha=.03+mid*.035;shape(c,[[120+i*95+Math.sin(t*.2+i)*20,0],[40+i*95,536],[220+i*95,536]],'#6ce6dc');c.restore();
    }
    const base=[[0,H]];for(let i=0;i<=30;i++)base.push([i*45,450+Math.sin(i*.8+t*.07)*30]);base.push([W,H]);shape(c,base,'#052032');
    for(let i=0;i<40;i++){const x=wrap(i*43-t*14,1400)-60,y=450+noise(i)*80;line(c,[[x,y],[x+Math.sin(t*.8+i)*12,y-20-noise(i+1)*60]],'#16474c',2+noise(i)*4);}
    // A low wedge-shaped amphibious escape car, glimpsed between the divers.
    c.save();c.translate(660+Math.sin(t*.2)*110,314+Math.sin(t*.6)*20);c.rotate(Math.sin(t*.3)*.04);
    shape(c,[[-185,14],[-118,-19],[-35,-46],[72,-44],[125,-12],[191,6],[118,28],[-141,30]],'#c4d9cf');
    shape(c,[[-90,-17],[-25,-39],[65,-36],[105,-13]],'#1b525e');line(c,[[-180,15],[179,8]],'#89eff1',2);
    for(let i=0;i<8;i++){const age=wrap(t*.8+i/8,1);ellipse(c,-180-age*160,15+Math.sin(t*2+i)*age*18,2+age*5,1+age*3,'#8cdddd55');}c.restore();
    diver(c,350+Math.sin(t*.3)*150,180+Math.sin(t*.5)*25,1.3,t);diver(c,1000+Math.sin(t*.24)*120,390+Math.sin(t*.4)*20,.9,t+1,-1);
    for(let i=0;i<65;i++){const x=wrap(noise(i)*W-t*(6+noise(i+1)*12),W),y=wrap(noise(i+3)*H-t*7,H);ellipse(c,x,y,1,2,'#a5f1e544');}
    flare(c,740+Math.sin(t*.26)*300,270,'#5eeaff',.4+bass*.5);
  }
  function draw(c,width,height,now,opts={}){
    const form=typeof opts.form==='number'?forms[wrap(opts.form,4)]:forms.includes(opts.form)?opts.form:'barrel';
    const resolution=Math.round(clamp(width,960,1920));
    if(!surface||surface.width!==resolution){surface=c.canvas.ownerDocument?c.canvas.ownerDocument.createElement('canvas'):new OffscreenCanvas(resolution,Math.round(resolution*H/W));surface.width=resolution;surface.height=Math.round(resolution*H/W);sc=surface.getContext('2d');}
    if(form!==active){active=form;time=0;last=null;bass=mid=treble=0;}
    const dt=opts.animate===false||last===null?0:clamp((now-last)/1000,0,.1);last=opts.animate===false?null:now;
    const ease=1-Math.exp(-dt*6);bass+=(clamp(+opts.bass||0)-bass)*ease;mid+=(clamp(+opts.mid||0)-mid)*ease;treble+=(clamp(+opts.treble||0)-treble)*ease;
    time+=dt*clamp(+opts.speed||1,.2,3);const t=time;
    sc.save();sc.setTransform(surface.width/W,0,0,surface.height/H,0,0);sc.lineCap='round';sc.lineJoin='round';
    if(form==='barrel')barrel(sc,t);else if(form==='casino')casino(sc,t);else if(form==='alpine')alpine(sc,t);else abyss(sc,t);
    const shade=sc.createRadialGradient(640,268,170,640,268,760);shade.addColorStop(0,'#00000000');shade.addColorStop(1,'#02051099');sc.fillStyle=shade;sc.fillRect(0,0,W,H);sc.restore();
    c.save();c.fillStyle='#02040a';c.fillRect(0,0,width,height);
    // Fit a constant cinema aspect ratio without stretching subjects on a portrait handset.
    const frameWidth=width,frameHeight=width/2.39,scale=Math.min(1,height*.82/frameHeight),fw=frameWidth*scale,fh=frameHeight*scale;
    const x=(width-fw)/2,y=(height-fh)/2,squeeze=.84+.16*Math.sin(t*.28-.5),reveal=.55+.45*clamp(t/2);
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(surface,x+fw*(1-squeeze*reveal)/2,y,fw*squeeze*reveal,fh);
    c.fillStyle='#dfd6b7';c.font=`${Math.max(10,width/100)}px Arial`;c.fillText('ANAMORPHIC SQUEEZE',x+fw*.025,Math.max(24,y-22));
    c.globalAlpha=.65;c.font=`${Math.max(9,width/120)}px Arial`;c.fillText(names[forms.indexOf(form)].toUpperCase(),x+fw*.025,Math.min(height-16,y+fh+29));
    const titlePhase=wrap(t,22),opacity=clamp((titlePhase-2)/1.2)*clamp((10-titlePhase)/2);
    if(opacity>0){
      c.save();c.globalAlpha=opacity*.88;c.fillStyle=form==='casino'?'#efce87':'#daecec';c.font=`italic ${Math.max(19,fw*.037)}px Georgia`;
      const captions={barrel:['A QUESTION','OF PERSPECTIVE'],casino:['DANGEROUS','COMPANY'],alpine:['TAKE THE','SCENIC ROUTE'],abyss:['UNDER','THE RADAR']};
      c.fillText(captions[form][0],x+fw*.06,y+fh*.22);c.fillText(captions[form][1],x+fw*.06,y+fh*.32);c.restore();
    }c.restore();return {time,form,squeeze,sourceWidth:surface.width,aspect:2.39,bass};
  }
  return {recipes,draw,reset};
})();
