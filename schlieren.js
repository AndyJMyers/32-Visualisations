/* Artistic schlieren: signed gradients of a moving density field, not a fluid solver. */
window.Schlieren=(()=>{
  const TAU=Math.PI*2,W=960,H=600,FW=320,FH=200;
  const forms=['ballistics','velvet','equine','velocity'];
  const names=['The Shape of a Bang','Body Heat','Thoroughbred Atmosphere','Velocity Has Consequences'];
  const recipes=names.map((name,form)=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const palettes=[[[153,154,145],[246,245,222],[18,27,36]],[[17,10,35],[255,139,190],[37,190,213]],[[30,35,43],[255,208,116],[83,124,172]],[[8,23,30],[125,250,220],[244,78,100]]];
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),wrap=(x,n)=>(x%n+n)%n;
  let time=0,last=null,bass=0,mid=0,treble=0,active=null,field,image,surface,sc,shot=0;
  function reset(){time=0;last=null;bass=mid=treble=0;active=null;shot=0;field=image=surface=sc=null;}
  function ellipse(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
  function line(c,points,colour,width=2){c.strokeStyle=colour;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
  function shape(c,points,fill){c.fillStyle=fill;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
  function blob(x,y,rx,ry,a){
    x/=3;y/=3;rx/=3;ry/=3;
    const left=Math.max(1,Math.floor(x-rx*2)),right=Math.min(FW-2,Math.ceil(x+rx*2));
    const top=Math.max(1,Math.floor(y-ry*2)),bottom=Math.min(FH-2,Math.ceil(y+ry*2));
    for(let j=top;j<=bottom;j++){const dy=(j-y)/ry;for(let i=left;i<=right;i++){
      const dx=(i-x)/rx,d=dx*dx+dy*dy;if(d<4)field[j*FW+i]+=a*Math.exp(-d*2.5);
    }}
  }
  function plume(x,y,t,strength=1,drift=-1){
    for(let i=0;i<15;i++){
      const age=wrap(t*.48+i/15,1),rise=age*230;
      const xx=x+drift*age*105+Math.sin(age*11-t*2.3)*age*33;
      blob(xx,y-rise,9+age*43,13+age*28,(1-age)*strength);
      blob(xx+12+age*14,y-rise-6,8+age*28,12+age*22,-(1-age)*strength*.65);
    }
  }
  function wake(x,y,t,scale=1){
    for(let i=0;i<17;i++){
      const age=i/17,xx=x-age*440*scale,yy=y+Math.sin(age*17-t*4)*age*44*scale;
      blob(xx,yy,13+age*34,8+age*23,(1-age)*(.45+bass)*Math.cos(age*15-t*2));
    }
  }
  function gradient(c,form){
    const [base,light,dark]=palettes[forms.indexOf(form)],p=image.data;
    // Directional knife-edge response: the sign creates bright/dark paired boundaries.
    const angle=form==='equine'?.9:form==='velvet'?Math.sin(time*.15)*.7:0;
    const ax=Math.cos(angle),ay=Math.sin(angle);
    for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){
      const i=y*FW+x,j=i*4;
      const dx=x&&x<FW-1?field[i+1]-field[i-1]:0,dy=y&&y<FH-1?field[i+FW]-field[i-FW]:0;
      const v=Math.tanh((dx*ax+dy*ay)*5.8),target=v>0?light:dark,a=Math.abs(v);
      const grain=Math.sin(x*1.7+y*2.3)*1.2;
      for(let k=0;k<3;k++)p[j+k]=base[k]+(target[k]-base[k])*a+grain;p[j+3]=255;
    }
    sc.putImageData(image,0,0);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(surface,0,0,W,H);
  }
  function rings(c,x,y,age,colour,vertical=1){
    if(age<0||age>1)return;
    c.save();c.globalAlpha=(1-age)*.75;c.lineWidth=2;
    for(let i=0;i<3;i++){
      c.strokeStyle=i%2?'#080e1c':colour;c.beginPath();c.ellipse(x,y,8+age*600+i*3,(8+age*600+i*3)*vertical,0,0,TAU);c.stroke();
    }c.restore();
  }
  function gun(c,t){
    const phase=wrap(t,3.4),recoil=phase<.3?Math.sin(phase/.3*Math.PI)*12:0;
    c.save();c.translate(-recoil,0);
    shape(c,[[66,321],[303,321],[311,336],[235,340],[223,352],[203,352],[183,419],[139,419],[151,353],[66,352]],'#111c25');
    line(c,[[75,326],[295,326]],'#d0d0b1',3);line(c,[[210,352],[230,358],[225,376],[201,376]],'#293c48',5);
    shape(c,[[144,358],[181,362],[171,408],[133,408]],'#38424a');c.restore();
    if(phase<.17){c.save();c.globalAlpha=(1-phase/.17)*(.5+bass*.5);
      shape(c,[[307,326],[353,302],[342,325],[391,331],[344,339],[350,359],[307,338]],'#fff6d1');c.restore();}
    const age=phase/1.3;rings(c,311,333,age,'#ffffd8',.72);
    if(phase<1.5){const x=325+phase*490;line(c,[[x-27,333],[x,333]],'#eee7c8',3);line(c,[[x-50,295],[x,333],[x-50,371]],'#f6f0d5aa',1.5);}
  }
  function dancer(c,x,y,s,t,colour,flip=1){
    c.save();c.translate(x,y);c.scale(s*flip,s);c.rotate(Math.sin(t*1.6)*.07);
    const sway=Math.sin(t*2.1)*(12+bass*9),lift=Math.sin(t*2.1+1)*(27+mid*14);
    line(c,[[sway-10,70],[sway-22-lift*.4,126],[-35+lift*.5,168]],'#e0c6b9',10);
    line(c,[[sway+10,70],[22+lift*.6,119],[34-lift*.5,168]],'#e0c6b9',10);
    line(c,[[-35+lift*.5,167],[-20+lift*.5,169]],colour,7);line(c,[[34-lift*.5,167],[48-lift*.5,169]],colour,7);
    shape(c,[[sway-13,-38],[sway+14,-38],[sway+20,-6],[sway+12,18],[sway+37,80],[sway-35,80],[sway-12,15],[sway-20,-6]],'#11111d');
    line(c,[[sway-11,-31],[sway-5,12],[sway-26,68]],colour,2);
    line(c,[[sway-17,-28],[-42,-44-lift],[-57,-84-lift]],'#e0c6b9',8);
    line(c,[[sway+17,-28],[47,10+lift*.5],[64,-26+lift]],'#e0c6b9',8);
    ellipse(c,sway,-68,15,20,'#e0c6b9');ellipse(c,sway-8,-77,15,18,'#16121d');
    line(c,[[sway-5,-47],[sway-5,-35]],'#e0c6b9',8);
    line(c,[[sway+9,-67],[sway+13,-66]],'#16121d',1.5);line(c,[[sway+8,-59],[sway+13,-60]],colour,2);
    c.restore();
  }
  function horse(c,x,y,s,t,colour){
    c.save();c.translate(x,y);c.scale(s,s);c.rotate(Math.sin(t*7)*.025);
    ellipse(c,0,Math.sin(t*7)*4,69,30,'#121923');
    shape(c,[[33,0],[46,-66],[65,-76],[79,-51],[105,-37],[101,-21],[78,-27],[64,16]],'#121923');
    shape(c,[[52,-70],[53,-90],[63,-78],[67,-92],[72,-71]],'#121923');
    for(let side=0;side<2;side++)for(let leg=0;leg<2;leg++){
      const p=t*7+side*1.1+leg*2.4,hip=leg?44:-43;
      const kneeX=hip+Math.sin(p)*26,kneeY=48+Math.cos(p)*10;
      const footX=hip+Math.sin(p+1)*52,footY=75-Math.max(0,Math.cos(p))*30;
      line(c,[[hip,16],[kneeX,kneeY],[footX,footY]],side?'#36404a':'#111923',7);
      line(c,[[footX-4,footY],[footX+5,footY]],colour,3);
    }
    line(c,[[-59,-12],[-90,-25+Math.sin(t*6)*8],[-116,-4+Math.sin(t*6+1)*12]],'#111923',10);
    line(c,[[47,-60],[34,-19],[8,-23],[-39,-23]],colour,2);ellipse(c,77,-51,2,2,colour);
    // Rider crouches over the neck; reins connect hands to the bridle.
    line(c,[[-1,-23],[17,-55],[38,-64]],'#232532',12);ellipse(c,42,-73,10,11,colour);
    line(c,[[20,-53],[47,-34],[77,-38]],'#d5c9b7',4);line(c,[[7,-23],[-4,4],[13,21]],colour,5);
    c.restore();
  }
  function car(c,x,y,s,t,colour){
    c.save();c.translate(x,y);c.scale(s,s);
    shape(c,[[-146,15],[-133,-6],[-75,-19],[-36,-48],[38,-49],[79,-18],[135,-10],[151,12],[138,26],[-139,26]],'#07121c');
    shape(c,[[-59,-19],[-28,-41],[32,-42],[65,-17]],'#537684');
    line(c,[[-139,0],[-78,-14],[80,-13],[140,1]],colour,3);line(c,[[-4,-42],[-4,-18]],'#0a1c25',4);
    for(const xx of [-91,96]){ellipse(c,xx,23,23,23,'#060c12');ellipse(c,xx,23,15,15,'#8ba6aa');
      for(let i=0;i<5;i++){const a=i*TAU/5+t*17;line(c,[[xx,23],[xx+Math.cos(a)*13,23+Math.sin(a)*13]],'#122535',2);}}
    line(c,[[137,4],[150,4]],'#fff4be',5);line(c,[[-139,4],[-130,4]],'#ff5973',4);
    c.restore();
  }
  function draw(c,width,height,now,opts={}){
    const form=typeof opts.form==='number'?forms[wrap(opts.form,4)]:forms.includes(opts.form)?opts.form:'ballistics';
    if(!surface){surface=c.canvas.ownerDocument?c.canvas.ownerDocument.createElement('canvas'):new OffscreenCanvas(FW,FH);surface.width=FW;surface.height=FH;sc=surface.getContext('2d');image=sc.createImageData(FW,FH);field=new Float32Array(FW*FH);}
    if(active!==form){active=form;time=0;last=null;bass=mid=treble=0;shot=0;}
    const dt=opts.animate===false||last===null?0:clamp((now-last)/1000,0,.1);last=opts.animate===false?null:now;
    const ease=1-Math.exp(-dt*8);bass+=(clamp(+opts.bass||0)-bass)*ease;mid+=(clamp(+opts.mid||0)-mid)*ease;treble+=(clamp(+opts.treble||0)-treble)*ease;
    time+=dt*clamp(+opts.speed||1,.2,3);const t=time;
    field.fill(0);
    if(form==='ballistics'){
      const phase=wrap(t,3.4);shot=Math.floor(t/3.4);plume(310,326,t,.65+bass,-.4);
      for(let i=0;i<12;i++){const age=phase/1.8,xx=318+age*340+i*9;
        if(age<1)blob(xx,333+Math.sin(i*.9-t*4)*age*46,8+age*29,8+age*21,(1-age)*Math.sin(i)*1.5);}
    }else if(form==='velvet'){
      for(let i=0;i<3;i++)plume(245+i*238+Math.sin(t*2+i)*20,410,t+i*1.7,1+bass*.7,i%2?1:-1);
      for(let i=0;i<12;i++)blob(480+Math.sin(t*1.1+i)*250,260+Math.cos(t+i)*140,35,20,Math.sin(i+t)*(.3+mid));
    }else if(form==='equine'){
      for(let i=0;i<3;i++){const x=520+Math.sin(t*.6+i)*80+i*85;wake(x,350+i*30,t+i,1);plume(x-40,422+i*20,t+i,.3+bass,-1);}
    }else{
      for(let i=0;i<3;i++){const x=590+Math.sin(t*.5+i)*190;wake(x,345+i*45,t+i,1.4);plume(x-105,401+i*45,t+i,1+bass,-1);}
    }
    c.save();c.scale(width/W,height/H);c.lineCap='round';c.lineJoin='round';gradient(c,form);
    const accent= form==='ballistics'?'#e9eed1':form==='velvet'?'#ff9abf':form==='equine'?'#e9bd72':'#90ffe4';
    // Native-resolution contours keep the subjects crisp over the softer optical field.
    if(form==='ballistics'){
      line(c,[[30,434],[930,434]],'#303f44',2);gun(c,t);
      c.fillStyle='#1e2d34';c.fillRect(94,421,125,16);c.fillRect(115,437,16,82);c.fillRect(195,437,16,82);
    }else if(form==='velvet'){
      for(let i=0;i<3;i++){const x=245+i*238;ellipse(c,x,493,95,10,'#090b1c77');dancer(c,x,330,1,t*1.1+i*1.7,i%2?'#73e9ea':accent,i===1?-1:1);}
      for(let i=0;i<7;i++)rings(c,480,435,wrap(t*.19+i/7,1),accent,.2);
    }else if(form==='equine'){
      for(let i=0;i<18;i++){const x=wrap(i*65-t*160,1120)-80;line(c,[[x,409],[x-45,432]],'#d0ae7055',1);}
      horse(c,610+Math.sin(t*.6)*80,329,.65,t, '#91a8be');horse(c,450+Math.sin(t*.6+2)*90,390,1.05,t+.8,accent);
      horse(c,760+Math.sin(t*.6+1)*45,437,.78,t+1.8,'#e2d5af');
    }else{
      for(let i=0;i<22;i++){const x=wrap(i*70-t*(210+bass*90),1450)-200;line(c,[[x,520],[x+40,520]],'#a2e8d344',2);}
      car(c,670+Math.sin(t*.5+2)*170,322,.62,t,'#ff808e');car(c,570+Math.sin(t*.5)*190,425,1.25,t,accent);
      car(c,240+Math.sin(t*.5+4)*170,495,.6,t,'#d7d5ff');
    }
    const shade=c.createRadialGradient(480,300,140,480,300,610);shade.addColorStop(0,'#00000000');shade.addColorStop(1,'#020816b0');c.fillStyle=shade;c.fillRect(0,0,W,H);
    c.fillStyle=accent;c.font='12px Arial';c.fillText('SCHLIEREN / '+names[forms.indexOf(form)].toUpperCase(),26,37);
    c.globalAlpha=.65;c.font='10px Arial';c.fillText('IMAGINED DENSITY GRADIENTS / MUSIC IN THE AIR',26,565);
    line(c,[[W-130,555],[W-30,555]],accent,1);c.fillText('KNIFE EDGE',W-130,576);c.restore();
    return {time,form,shot,fieldWidth:FW,fieldHeight:FH,bass};
  }
  return {recipes,draw,reset};
})();
