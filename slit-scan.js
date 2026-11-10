/* A virtual camera sampled through a narrow aperture into a chronological strip buffer. */
window.SlitScan=(()=>{
  const TAU=Math.PI*2,W=640,H=360;
  const forms=['platform','velvet','stargate','negative'];
  const names=['Midnight Platform','Velvet Time','Infinity Aperture','Negative Exposure'];
  const recipes=names.map((name,form)=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:form===2?1:.55}));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const noise=n=>{const v=Math.sin(n*71.31+11)*43758.5;return v-Math.floor(v);};
  const wrap=(v,n)=>(v%n+n)%n;
  let camera,history,ordered,cc,hc,oc,time=0,last=null,sampled=0,cursor=0,active=null,bass=0,mid=0,treble=0,samples=0;
  let quality=1,samplingHz=30;
  function reset(){camera=history=ordered=cc=hc=oc=null;time=0;last=null;sampled=0;cursor=0;active=null;bass=mid=treble=0;samples=0;}
  function canvas(c){
    const result=c.canvas.ownerDocument?c.canvas.ownerDocument.createElement('canvas'):new OffscreenCanvas(W,H);
    result.width=W*quality;result.height=H*quality;return result;
  }
  const hue=(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`;
  function disc(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
  function line(c,x,y,xx,yy,fill,width=2){c.strokeStyle=fill;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();}
  function source(t,form){
    const c=cc;c.save();c.lineCap='round';
    c.fillStyle=form==='negative'?'#d3f9df':'#050719';c.fillRect(0,0,W,H);
    if(form==='platform'){
      const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#080d27');sky.addColorStop(1,'#38263a');c.fillStyle=sky;c.fillRect(0,0,W,H);
      // A moving camera makes vertical position and depth change during the exposure.
      // Sampling a purely horizontal train otherwise reconstructs a surprisingly normal train.
      const dolly=1.18+Math.sin(t*.54)*.3+Math.sin(t*.19)*.12;
      c.save();c.translate(320,185);c.rotate(Math.sin(t*.43)*.16);
      c.scale(dolly,dolly);c.translate(-320,-185+Math.sin(t*.67)*52);
      for(let i=0;i<26;i++){
        const x=i*28-35,top=50+noise(i)*110;
        c.fillStyle='#10172c';c.fillRect(x,top,25,235-top);
        for(let y=top+8;y<220;y+=14){c.fillStyle=hue(30+i*7,60,55+mid*18,.3+noise(i+y)*.6);c.fillRect(x+5,y,3,5);}
      }
      const x=wrap(t*105,1350)-650;
      for(let car=0;car<4;car++){
        const left=x+car*235;c.fillStyle='#263344';c.fillRect(left,134,228,120);
        c.fillStyle='#b4b8af';c.fillRect(left,142,228,6);
        for(let window=0;window<7;window++){
          const wx=left+12+window*30;c.fillStyle=hue(window%3?35:191,70,57+bass*24);c.fillRect(wx,157,23,58);
          c.fillStyle='#38404a';c.fillRect(wx+9,184+Math.sin(t+window)*3,10,31);
        }
        line(c,left,234,left+228,234,'#d97959',4);disc(c,left+45,254,16,9,'#080c15');disc(c,left+183,254,16,9,'#080c15');
      }
      c.fillStyle='#101321';c.fillRect(0,263,W,97);
      for(let i=0;i<45;i++)line(c,noise(i)*W,275+noise(i+20)*80,noise(i)*W+30+bass*45+Math.sin(t)*8,275+noise(i+20)*80,hue(i*9+t*5,65,58,.3),1);
      // Canopy ribs approach through depth; each strip catches them at a different scale.
      for(let rib=0;rib<12;rib++){
        const depth=wrap(rib/12+t*.085,1),s=.05+depth*depth*2.6;
        const left=320-220*s,right=320+220*s,top=245-195*s,bottom=245+75*s;
        const tint=hue(28+rib*4,65,45+mid*20,.3+depth*.65);
        line(c,left,bottom,left,top,tint,1+s*2.2);line(c,right,bottom,right,top,tint,1+s*2.2);
        line(c,left,top,right,top,tint,2+s*3);
        line(c,left+10*s,bottom,left+10*s,top,'#83dbed77',1+s);
      }
      const person=320+Math.sin(t*.71)*150;
      const distance=.4+wrap(t*.095,1)*1.45;
      c.save();c.translate(person,212);c.scale(distance,distance);c.translate(-person,-212);
      disc(c,person,183,10,13,'#121321');line(c,person,199,person+Math.sin(t*3)*3,247,'#171627',17);
      line(c,person,242,person-12-Math.sin(t*5)*9,277,'#191929',7);line(c,person,242,person+12+Math.sin(t*5)*9,277,'#191929',7);
      c.fillStyle='#ba4d73';c.beginPath();c.ellipse(person,169,41,18,0,Math.PI,TAU);c.fill();line(c,person,167,person,224,'#d8b5a4',1);
      c.restore();c.restore();
      for(let i=0;i<75;i++){const rx=noise(i+400)*W,ry=wrap(noise(i)*H+t*160,H);line(c,rx,ry,rx-3,ry+12,'#acdaec33',.7);}
    }else if(form==='velvet'){
      for(let i=0;i<5;i++){
        const x=80+i*120+Math.sin(t*.4+i)*65,g=c.createRadialGradient(x,160,2,x,160,220);
        g.addColorStop(0,hue(t*12+i*67,80,45,.28));g.addColorStop(1,'#02031300');c.fillStyle=g;c.fillRect(x-220,-60,440,440);
      }
      const x=320+Math.sin(t*.8)*165,y=170+Math.sin(t*2)*12,lean=Math.sin(t*1.3)*.24;
      c.save();c.translate(x,y);c.rotate(lean);
      disc(c,0,-72,22,28,'#e2c2c9');
      c.fillStyle='#27192b';c.beginPath();c.ellipse(-4,-80,24,28,-.3,Math.PI,TAU);c.fill();
      line(c,-18,-35,-80-Math.sin(t*1.7)*45,-80-Math.cos(t*1.1)*65,'#d5b7d1',12);
      line(c,18,-35,65+Math.cos(t*1.3)*55,-60+Math.sin(t*1.5)*65,'#f3c0c3',12);
      const skirt=75+Math.sin(t*2.1)*22+bass*25;
      c.fillStyle=hue(t*23,75,51);c.beginPath();c.moveTo(-24,-43);c.bezierCurveTo(-14,3,-10,8,-skirt,106);c.quadraticCurveTo(0,137,skirt,106);c.bezierCurveTo(20,22,10,-7,24,-43);c.closePath();c.fill();
      for(let i=-3;i<=3;i++)line(c,i*4,-25,i*skirt/4,107,hue(t*23+60,80,75,.5),1.5);
      line(c,-16,119,-30+Math.sin(t*2)*20,167,'#d2a5bb',11);line(c,16,119,35-Math.sin(t*2)*20,163,'#f4bfc5',11);
      c.restore();
    }else if(form==='stargate'){
      c.save();c.translate(320,180);
      for(let gate=18;gate>=0;gate--){
        const d=wrap(gate/19+t*.1,1),s=18+d*d*480;
        c.save();c.rotate(t*.17+gate*.11);c.strokeStyle=hue(gate*29+t*19,88,47+d*25);c.lineWidth=2+d*13+bass*5;
        c.strokeRect(-s,-s*.64,s*2,s*1.28);c.fillStyle=hue(gate*29+80,90,62);
        for(let j=0;j<5;j++)c.fillRect(-s+j*s*.4,-s*.64,4+d*5,14+d*25);
        c.restore();
      }c.restore();
    }else{
      const x=320+Math.sin(t*.57)*145,y=173+Math.sin(t*.83)*12;
      c.save();c.translate(x,y);c.rotate(Math.sin(t*.6)*.28);
      const skin=c.createLinearGradient(-100,0,100,0);skin.addColorStop(0,'#072b44');skin.addColorStop(.5,'#286465');skin.addColorStop(1,'#120c3d');
      disc(c,0,122,150,70,'#173b4f');disc(c,0,-15,91,126,skin);
      for(const side of [-1,1]){
        const blink=Math.pow(Math.max(0,Math.sin(t*1.4)),24);
        disc(c,side*35,-27,24,Math.max(1,11*(1-blink)),'#e2f6bb');disc(c,side*35+Math.sin(t)*6,-27,6+bass*4,8,'#b13184');
        line(c,side*14,-52,side*60,-59,'#b5ebbb',4);
      }
      line(c,0,-18,-9,25,'#c5b8de',4);
      c.strokeStyle='#ff8cc7';c.lineWidth=7;c.beginPath();c.moveTo(-29,56);c.quadraticCurveTo(0,72+Math.sin(t)*10,32,51);c.stroke();
      c.fillStyle='#241331';c.beginPath();c.moveTo(-91,-27);c.bezierCurveTo(-143,-167,106,-206,95,-33);c.bezierCurveTo(40,-66,44,-128,-2,-115);c.bezierCurveTo(-28,-83,-67,-88,-91,-27);c.fill();
      c.restore();
    }
    c.restore();
  }
  const aperture=t=>active==='platform'?
    clamp(320+Math.sin(t*.89)*200+Math.sin(t*1.7)*60,12,W-12):
    clamp(320+Math.sin(t*.51)*145+Math.sin(t*.17)*60,12,W-12);
  function expose(t,width){source(t,active);const x=aperture(t),slit=2+treble*6;hc.drawImage(camera,(x-slit/2)*quality,0,slit*quality,H*quality,cursor*quality,0,width*quality,H*quality);cursor=(cursor+width)%W;samples++;}
  function init(c,form,detail,rate){
    quality=detail;samplingHz=rate;
    active=form;camera=canvas(c);history=canvas(c);ordered=canvas(c);cc=camera.getContext('2d');hc=history.getContext('2d');oc=ordered.getContext('2d');
    cc.setTransform(quality,0,0,quality,0,0);
    for(let i=0;i<80;i++)expose(-W/60+(i+1)/80*W/60,8);
    source(0,form);
  }
  function draw(c,width,height,now,opts={}){
    const form=typeof opts.form==='number'?forms[opts.form%4]:forms.includes(opts.form)?opts.form:'platform';
    const displayWidth=c.canvas.clientWidth||width;
    const detail=opts.quality===1?1:opts.quality===2||displayWidth>=1400?2:1;
    const rate=opts.sampleRate===60?60:30;
    if(form!==active||!camera||quality!==detail||samplingHz!==rate){reset();init(c,form,detail,rate);}
    const animate=opts.animate!==false,dt=!animate||last===null?0:clamp((now-last)/1000,0,.1);last=animate?now:null;
    const ease=1-Math.exp(-dt*5);
    bass+=(clamp(Number(opts.bass)||0,0,1)-bass)*ease;mid+=(clamp(Number(opts.mid)||0,0,1)-mid)*ease;treble+=(clamp(Number(opts.treble)||0,0,1)-treble)*ease;
    time+=dt*clamp(Number(opts.speed)||1,.2,3);
    const step=1/samplingHz;
    while(sampled+step<=time){sampled+=step;expose(sampled,60/samplingHz);}
    oc.clearRect(0,0,W*quality,H*quality);
    oc.drawImage(history,cursor*quality,0,(W-cursor)*quality,H*quality,0,0,(W-cursor)*quality,H*quality);
    if(cursor)oc.drawImage(history,0,0,cursor*quality,H*quality,(W-cursor)*quality,0,cursor*quality,H*quality);
    c.save();c.scale(width/960,height/600);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.fillStyle='#030512';c.fillRect(0,0,960,600);
    if(form==='stargate'){
      const cx=480+Math.sin(time*.25)*24,cy=300+Math.cos(time*.21)*20;
      for(let wall=0;wall<4;wall++){
        c.save();c.translate(cx,cy);c.rotate(wall*Math.PI/2+Math.sin(time*.12)*.07);
        const slices=120*quality;
        for(let i=slices-1;i>=0;i--){
          const a=i/slices,b=(i+1)/slices,x=8+a*a*660,xx=8+b*b*660,h=16+a*870;
          c.drawImage(ordered,i/slices*(W*quality-3),0,3,H*quality,x,-h/2,xx-x+1/quality,h);
        }c.restore();
      }
    }else if(form==='platform'){
      c.drawImage(ordered,0,0,960,600);
    }else{
      const band=quality===2?1:3;
      for(let y=0;y<H;y+=band){
        const displacement=form==='velvet'?Math.sin(y*.025+time*.65)*(12+bass*24):form==='negative'?Math.sin(y*.04-time*.5)*7:0;
        c.drawImage(ordered,0,y*quality,W*quality,band*quality,displacement,y/H*600,960,band/H*600+1/quality);
      }
    }
    const shade=c.createRadialGradient(480,300,170,480,300,640);shade.addColorStop(0,'#00000000');shade.addColorStop(1,'#030511aa');c.fillStyle=shade;c.fillRect(0,0,960,600);
    c.save();c.globalAlpha=.035/quality;c.fillStyle='#d5f5ff';for(let y=0;y<600;y+=4)c.fillRect(0,y,960,1);c.restore();
    // The live view makes the time separation legible without asking for a real camera.
    c.save();c.globalAlpha=.82;c.fillStyle='#020713';c.fillRect(747,463,195,122);c.drawImage(camera,753,469,183,103);
    const slitX=753+aperture(sampled)/W*183;line(c,slitX,469,slitX,572,'#b1f5ff',1.4);
    c.font='10px Arial';c.fillStyle='#d5eff1';c.fillText('VIRTUAL CAMERA / NOW',758,582);c.restore();
    c.font='11px Arial';c.fillStyle='#d3e9e9aa';c.fillText('SLIT-SCAN / '+names[forms.indexOf(form)].toUpperCase(),22,578);
    c.restore();
    return {time,form,samples,cursor,historySeconds:W/60,aperture:aperture(sampled),sourceWidth:W*quality,sourceHeight:H*quality,samplingHz};
  }
  return {recipes,draw,reset};
})();
