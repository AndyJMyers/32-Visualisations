/* Two independently animated plates, recombined as digital bipack-inspired exposures. */
window.Bipack=(()=>{
  const TAU=Math.PI*2,W=1200,H=675;
  const forms=['contact','glass','velvet','silver'];
  const names=['Sacred / Profane','Stained Glass After Dark','Velvet Double Exposure','Silver Nitrate Sunday'];
  const recipes=names.map((name,form)=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),wrap=(x,n)=>(x%n+n)%n;
  const noise=i=>{const n=Math.sin(i*83.31+9)*43758.54;return n-Math.floor(n);};
  let time=0,last=null,active=null,bass=0,mid=0,treble=0,plates=[],contexts=[],backdrop=null,backdropForm=null;
  const glows=new Map();
  function reset(){time=0;last=null;active=null;bass=mid=treble=0;plates=[];contexts=[];backdrop=backdropForm=null;glows.clear();}
  function ellipse(c,x,y,rx,ry,colour){c.fillStyle=colour;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
  function line(c,p,colour,w=2){c.strokeStyle=colour;c.lineWidth=w;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
  function shape(c,p,colour){c.fillStyle=colour;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
  function arch(c,x,y,w,h,colour,stroke=3){
    c.strokeStyle=colour;c.lineWidth=stroke;c.beginPath();c.moveTo(x-w/2,y+h);c.lineTo(x-w/2,y+h*.4);c.quadraticCurveTo(x-w/2,y+h*.12,x,y);c.quadraticCurveTo(x+w/2,y+h*.12,x+w/2,y+h*.4);c.lineTo(x+w/2,y+h);c.stroke();
  }
  function haze(c,x,y,size,colour){
    if(!glows.has(colour)){
      const p=c.canvas.ownerDocument?c.canvas.ownerDocument.createElement('canvas'):new OffscreenCanvas(128,128);p.width=p.height=128;
      const ctx=p.getContext('2d'),g=ctx.createRadialGradient(64,64,0,64,64,64);
      g.addColorStop(0,colour+'66');g.addColorStop(.3,colour+'22');g.addColorStop(1,colour+'00');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);glows.set(colour,p);
    }
    c.drawImage(glows.get(colour),x-size,y-size,size*2,size*2);
  }
  function candle(c,x,y,t,colour){
    line(c,[[x,y],[x,y-18]],'#dbd8b9',3);ellipse(c,x+Math.sin(t*6+x)*1.5,y-23,2,6+treble*3,colour);haze(c,x,y-23,21,colour);
  }
  function cleric(c,x,y,s,t,colour,celebrant=false){
    c.save();c.translate(x,y);c.scale(s,s);
    const lift=celebrant?(Math.sin(t*.47)+1)*.5:0;
    ellipse(c,0,-59,8,11,'#d2b6a0');ellipse(c,-2,-66,8,5,'#8c8779');
    shape(c,[[-12,-45],[12,-45],[25,35],[-25,35]],colour);
    line(c,[[0,-38],[0,21]],'#d9ba65',3);line(c,[[-9,-15],[9,-15]],'#d9ba65',2);
    const handY=-17-lift*49;
    line(c,[[-12,-36],[-29,-13-lift*15],[-12,handY]],colour,10);
    line(c,[[12,-36],[29,-13-lift*15],[12,handY]],colour,10);
    ellipse(c,-12,handY,4,4,'#d2b6a0');ellipse(c,12,handY,4,4,'#d2b6a0');
    if(celebrant){line(c,[[0,handY-2],[0,handY-14]],'#f7d681',2);ellipse(c,0,handY-19,11,7,'#f7d681');line(c,[[-7,handY-2],[7,handY-2]],'#f7d681',2);}
    c.restore();
  }
  function cathedral(c,t,form,staticPass=false){
    const silver=form==='silver',gold=silver?'#cfced5':form==='glass'?'#8bdbc8':'#d6b46c';
    const stone=silver?'#5b5e6b':form==='velvet'?'#5e5269':'#475971';
    if(!staticPass){
      if(!backdrop||backdrop.width!==c.canvas.width||backdropForm!==form){
        backdrop=c.canvas.ownerDocument?c.canvas.ownerDocument.createElement('canvas'):new OffscreenCanvas(c.canvas.width,c.canvas.height);
        backdrop.width=c.canvas.width;backdrop.height=c.canvas.height;backdropForm=form;
        const ctx=backdrop.getContext('2d');ctx.setTransform(backdrop.width/W,0,0,backdrop.height/H,0,0);ctx.lineCap='round';ctx.lineJoin='round';cathedral(ctx,0,form,true);
      }
      c.drawImage(backdrop,0,0,W,H);
    }
    if(staticPass){
    const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,silver?'#121726':'#06172f');g.addColorStop(1,'#152334');c.fillStyle=g;c.fillRect(0,0,W,H);
    // Repeated arches recede towards a shared altar, rather than floating as symbols.
    for(let i=0;i<7;i++){
      const k=i/7,s=1-k*.105,wide=1120*s,top=12+k*139,bottom=605-k*17;
      arch(c,600,top,wide,bottom-top,stone,Math.max(2,14-i*1.7));
      for(const side of [-1,1]){const x=600+side*wide/2;line(c,[[x,top+(bottom-top)*.4],[x,bottom]],stone,18-i*1.9);line(c,[[x-side*13,bottom],[600+side*100,446]],'#82939b22',1);}
    }
    }
    if(!staticPass){
    const roseY=178,spin=t*.014;
    ellipse(c,600,roseY,77,77,'#142c47');
    for(let i=0;i<16;i++){
      const a=i*TAU/16+spin,rx=600+Math.cos(a)*44,ry=roseY+Math.sin(a)*44;
      ellipse(c,rx,ry,10,17,silver?'#a6b0b7':['#8b668d','#c89857','#4c9fb0','#6e8f70'][i%4]);
      line(c,[[600,roseY],[600+Math.cos(a)*76,roseY+Math.sin(a)*76]],'#172330',2);
    }
    c.strokeStyle=gold;c.lineWidth=3;c.beginPath();c.arc(600,roseY,79,0,TAU);c.stroke();ellipse(c,600,roseY,13,13,gold);
    c.save();c.globalAlpha=.07+mid*.06;
    shape(c,[[554,217],[645,217],[980,615],[220,615]],gold);c.restore();
    }
    if(staticPass){
    for(const side of [-1,1])for(let i=0;i<5;i++){
      const x=600+side*(150+i*84);arch(c,x,133,47,145,stone,3);
      for(let j=0;j<5;j++)ellipse(c,x,174+j*16,12,6,silver?'#7c8a99':['#8c697b','#526b95','#b9a46c'][j%3]);
    }
    shape(c,[[520,420],[680,420],[1130,675],[70,675]],'#283348');
    for(let i=0;i<9;i++){const y=450+i*i*3.5;line(c,[[520-(y-420)*1.75,y],[680+(y-420)*1.75,y]],'#9a92942a',1);}
    for(const side of [-1,1])for(let i=0;i<8;i++){
      const z=i/8,y=466+z*z*183,x=600+side*(124+z*176),length=85+z*230;
      line(c,[[x,y],[x+side*length,y+8]],'#111827',12+z*12);
      for(let j=0;j<5;j++){
        const xx=x+side*j*length/5;ellipse(c,xx,y-15,4+z*4,5+z*5,'#343949');line(c,[[xx,y-9],[xx+Math.sin(t*.25+j)*.8,y+2]],'#20283a',7+z*5);
      }
    }
    c.fillStyle='#766e62';c.fillRect(485,431,230,14);c.fillRect(500,413,200,16);c.fillStyle='#d2cbb4';c.fillRect(514,381,172,31);
    line(c,[[600,373],[600,300]],gold,4);line(c,[[579,323],[621,323]],gold,4);
    return;
    }
    for(let i=0;i<6;i++)candle(c,531+i*28,379,t,gold);
    cleric(c,600,401,.83,t,silver?'#d2d4d7':'#dfc08a',true);
    cleric(c,460+Math.sin(t*.18)*12,445,.8,t,'#aab6b8');cleric(c,736,445,.8,t,'#aab6b8');
    const thuribleX=739+Math.sin(t*1.7)*42,thuribleY=451+Math.cos(t*1.7)*8;
    line(c,[[748,413],[thuribleX,thuribleY]],gold,1);ellipse(c,thuribleX,thuribleY,7,4,gold);
    for(let i=0;i<14;i++){
      const age=wrap(t*.16+i/14,1),x=thuribleX-age*75+Math.sin(age*10+t*.7)*age*37,y=thuribleY-age*210;
      c.save();c.globalAlpha=(1-age)*.14;ellipse(c,x,y,8+age*30,7+age*18,silver?'#d8dcdf':'#cad8cc');c.restore();
    }
  }
  function dancer(c,pole,y,s,t,index,colour,skin){
    c.save();c.translate(pole,y);c.scale(s,s);
    const phase=t*(.85+index*.12)+index*2,orbit=Math.sin(phase),turn=.68+.32*Math.abs(Math.cos(phase));
    const x=orbit*33,lean=Math.sin(phase*.7)*.17;
    // The pole hand remains fixed while the body orbits; legs alternate a hooked pose.
    line(c,[[0,-210],[0,144]],'#ddc9da',3);line(c,[[3,-210],[3,144]],'#ffffff44',1);
    c.save();c.translate(x,0);c.rotate(lean);c.scale(turn,1);
    const knee=Math.sin(phase*1.3),reach=18+Math.max(0,Math.sin(phase))*29;
    line(c,[[-9,15],[-27+reach*.2,62],[-32+reach*.4,113]],skin,10);
    line(c,[[9,15],[35+knee*13,44],[14+knee*20,77]],skin,10);
    line(c,[[-32+reach*.4,113],[-17+reach*.4,113]],colour,7);line(c,[[14+knee*20,77],[31+knee*20,77]],colour,7);
    line(c,[[-26+reach*.2,64],[-32+reach*.4,105]],'#292039',10);line(c,[[34+knee*13,46],[14+knee*20,70]],'#292039',10);
    shape(c,[[-14,-65],[14,-65],[22,-43],[11,-17],[22,15],[8,29],[-9,29],[-23,14],[-11,-17],[-22,-43]],colour);
    line(c,[[-12,-57],[-6,-21],[-15,9]],'#f9c7e299',1.5);
    line(c,[[13,-57],[42,-25+Math.sin(phase)*10],[47,-59+Math.sin(phase)*16]],skin,7);
    line(c,[[0,-71],[0,-61]],skin,6);ellipse(c,0,-94,12,18,skin);
    ellipse(c,-8,-104,14,15,index===1?'#e2c087':'#24152e');
    line(c,[[-10,-110],[-27,-91],[-22-Math.sin(phase)*8,-66]],index===1?'#d5a45d':'#24152e',8);
    line(c,[[6,-95],[11,-94]],'#25162a',1.5);line(c,[[7,-86],[11,-87]],'#f39bb5',2);c.restore();
    line(c,[[x-15,-56],[x-27,-100],[0,-146]],skin,7);ellipse(c,0,-146,4,6,skin);c.restore();
  }
  function cabaret(c,t,form){
    const silver=form==='silver',pink=silver?'#c7d2db':form==='glass'?'#ffb45c':'#ed72b4',blue=silver?'#7d98b0':'#67cfe2';
    c.fillStyle='#080818';c.fillRect(0,0,W,H);
    for(let i=0;i<20;i++){
      const x=i*66+Math.sin(t*.3+i)*7;line(c,[[x,0],[x+12,470]],'#6b244c22',10);
    }
    for(let i=0;i<7;i++){
      const x=120+i*160+Math.sin(t*.36+i)*45;
      c.save();c.globalAlpha=.05+bass*.06;shape(c,[[x-12,44],[x+12,44],[x+140,514],[x-140,514]],i%2?pink:blue);c.restore();
      haze(c,x,58,70,i%2?pink:blue);
    }
    c.strokeStyle=pink;c.lineWidth=2;c.strokeRect(405,43,390,70);c.font='italic 33px Georgia';c.fillStyle=pink;c.fillText('THE OTHER SERVICE',427,89);
    ellipse(c,600,543,550,88,'#0d1024');c.strokeStyle=pink;c.lineWidth=2;c.beginPath();c.ellipse(600,543,550,88,0,0,TAU);c.stroke();
    for(let i=0;i<3;i++){
      const pole=255+i*345,tt=t+indexOffset(i);haze(c,pole,406,140,i%2?blue:pink);
      dancer(c,pole,400,1.13,tt,i,i%2?blue:pink,silver?'#d1d7db':['#dcaf9c','#ecc5ad','#bb8e80'][i]);
    }
    for(let i=0;i<10;i++){
      const x=55+i*123,y=612+Math.sin(i)*13;ellipse(c,x,y,18,19,'#111525');shape(c,[[x-17,y+15],[x+17,y+15],[x+29,675],[x-29,675]],'#0b1020');
    }
  }
  const indexOffset=i=>i*1.91;
  function filmEdges(c,t,form){
    c.fillStyle='#050610';c.fillRect(0,0,30,H);c.fillRect(W-30,0,30,H);
    for(let i=-1;i<13;i++){
      const y=i*62+wrap(t*23,62);c.fillStyle=form==='silver'?'#828896':'#d5c6a4';c.fillRect(8,y,14,26);c.fillRect(W-22,y,14,26);
    }
    c.fillStyle='#e9dcc6';c.font='10px Arial';c.fillText('BIPACK / '+names[forms.indexOf(form)].toUpperCase(),48,28);
    c.fillStyle='#d6d3c199';c.fillText('TWO STRIPS / ONE EXPOSURE',48,H-21);
    c.save();c.globalAlpha=.07;
    for(let i=0;i<6;i++){const x=wrap(noise(i)*W+t*(2+i),W);line(c,[[x,0],[x+Math.sin(t+i)*2,H]],'#e7d6be',.7);}c.restore();
  }
  function draw(c,width,height,now,opts={}){
    const form=typeof opts.form==='number'?forms[wrap(opts.form,4)]:forms.includes(opts.form)?opts.form:'contact';
    const resolution=Math.round(clamp(width,960,1600));
    if(!plates.length||plates[0].width!==resolution){
      plates=[0,1].map(()=>{const p=c.canvas.ownerDocument?c.canvas.ownerDocument.createElement('canvas'):new OffscreenCanvas(resolution,Math.round(resolution*H/W));p.width=resolution;p.height=Math.round(resolution*H/W);return p;});contexts=plates.map(p=>p.getContext('2d'));
    }
    if(form!==active){active=form;time=0;last=null;bass=mid=treble=0;}
    const dt=opts.animate===false||last===null?0:clamp((now-last)/1000,0,.1);last=opts.animate===false?null:now;
    const ease=1-Math.exp(-dt*7);bass+=(clamp(+opts.bass||0)-bass)*ease;mid+=(clamp(+opts.mid||0)-mid)*ease;treble+=(clamp(+opts.treble||0)-treble)*ease;
    time+=dt*clamp(+opts.speed||1,.2,3);const t=time;
    contexts.forEach((ctx,i)=>{ctx.save();ctx.setTransform(resolution/W,0,0,plates[i].height/H,0,0);ctx.lineCap='round';ctx.lineJoin='round';if(i)cabaret(ctx,t*1.08,form);else cathedral(ctx,t,form);ctx.restore();});
    c.save();c.fillStyle='#03050c';c.fillRect(0,0,width,height);
    const scale=Math.min(width/W,height/H),left=(width-W*scale)/2,top=(height-H*scale)/2;
    c.translate(left,top);c.scale(scale,scale);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.drawImage(plates[0],0,0,W,H);
    const exposure=.42+Math.sin(t*.35)*.16+bass*.12,registration=Math.sin(t*.73)*(2+treble*6);
    if(form==='glass'){
      c.save();c.beginPath();
      // Moving Gothic lancets act as travelling mattes into the second strip.
      for(let i=0;i<5;i++){
        const x=130+i*235+Math.sin(t*.3+i)*36,w=160+Math.sin(t*.4+i)*40;
        c.moveTo(x-w/2,H);c.lineTo(x-w/2,230);c.quadraticCurveTo(x-w/2,135,x,73);c.quadraticCurveTo(x+w/2,135,x+w/2,230);c.lineTo(x+w/2,H);c.closePath();
      }c.clip();c.globalAlpha=.83;c.drawImage(plates[1],registration,0,W,H);c.restore();
      c.save();c.globalCompositeOperation='screen';c.globalAlpha=.18;c.drawImage(plates[1],0,0,W,H);c.restore();
    }else if(form==='velvet'){
      const split=600+Math.sin(t*.23)*320,band=170;
      c.save();c.beginPath();c.rect(split-band,0,W,H);c.clip();c.globalAlpha=.85;c.drawImage(plates[1],registration,0,W,H);c.restore();
      c.save();c.globalCompositeOperation='screen';c.globalAlpha=.32;c.drawImage(plates[1],registration+Math.sin(t*.3)*40,0,W,H);c.restore();
      const seam=c.createLinearGradient(split-band,0,split+band,0);seam.addColorStop(0,'#e5aace00');seam.addColorStop(.5,'#e5aace22');seam.addColorStop(1,'#e5aace00');c.fillStyle=seam;c.fillRect(split-band,0,band*2,H);
    }else{
      c.save();c.globalCompositeOperation=form==='silver'?'lighten':'screen';c.globalAlpha=form==='silver'?.7:exposure;
      c.drawImage(plates[1],registration,Math.sin(t*.47)*2,W,H);c.restore();
      if(form==='silver'){c.save();c.globalCompositeOperation='difference';c.globalAlpha=.15+mid*.1;c.fillStyle='#d8e4ef';c.fillRect(0,0,W,H);c.restore();}
    }
    // Tiny contact prints preserve the identity of both source plates during overlap.
    for(let i=0;i<2;i++){
      const x=866+i*145;c.fillStyle='#060815dd';c.fillRect(x-4,560,137,91);c.drawImage(plates[i],x,564,129,73);
      c.fillStyle=i?'#f1a6cd':'#d9d5a5';c.font='8px Arial';c.fillText(i?'B / THE NIGHT SERVICE':'A / HIGH MASS',x,647);
    }
    filmEdges(c,t,form);c.restore();
    return {time,form,exposure,registration,sourceWidth:resolution,plates:2,bass};
  }
  return {recipes,draw,reset};
})();
