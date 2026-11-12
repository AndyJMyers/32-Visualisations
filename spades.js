/* A digging-tool parade, with billowing playing-card history intertitles. */
window.Spades = (() => {
  const forms = [['loam','The Loam Parade'],['moon','Midnight Dig'],['print','Ink and Earth']];
  const recipes = forms.map(([,name],form)=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const messages = [
    "Let's call a spade a spade.",
    "Let's see what we can dig up.",
    "The axe, flail, hammer and scythe all found their way into battle. The spade mostly kept its feet in the garden.",
    "The Ace of Spades has a reputation for death and the devil. But he's really not such a bad chap himself.",
    "Playing cards reached Europe in the 14th century. In the Latin suits, swords were spade in Italian and espadas in Spanish.",
    "The French pique looks like a spearhead and may echo the German leaf. English cards kept the French symbol and a name rooted in the older sword suit.",
  ];
  // Handle, blade width, length, tip, scoop motion, banner.
  const deck = [
    ['A','The Ace and his D-handle','D',20,30,.12,'flower',3],
    ['2','Square garden spade','D',21,30,0,'dig',0],
    ['3','Flat edging spade','T',26,16,.15,'edge',1],
    ['4','Wide landscaping spade','D',30,29,.17,'scoop',2],
    ['5','Narrow trenching spade','long',11,43,.72,'dig',4],
    ['6','Pointed digging spade','T',19,37,1,'dig',5],
    ['7','Border spade','D',16,23,.15,'flower',1],
    ['8','Transplanting spade','long',12,40,.35,'flower',4],
    ['9','Half-moon lawn edger','T',30,18,.65,'edge',0],
    ['10','Drain spade','D',10,49,.45,'dig',2],
    ['J','Jack with a folding spade','fold',17,24,.60,'scoop',5],
    ['Q','The Queen of borders','D',18,25,.35,'flower',3],
    ['K','The King of the allotment','T',29,31,.20,'scoop',0],
  ];
  const palettes = [
    ['#152b27','#524032','#c0c988','#e8d4a3','#b36a48','#b8c9c5'],
    ['#141b37','#362d4f','#a3ace2','#ede1ef','#c377a0','#c3daef'],
    ['#272218','#493527','#ca9857','#f7dfad','#9b4d37','#d3c9af'],
  ];
  const act=10, total=act*deck.length, tau=Math.PI*2;
  const clamp=v=>Math.max(0,Math.min(1,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
  let time,last,bass,active;
  function reset(){time=0;last=null;bass=0;active=null;}
  reset();
  function line(c,pts,colour,width){
    c.beginPath();c.moveTo(...pts[0]);for(const pt of pts.slice(1))c.lineTo(...pt);
    c.strokeStyle=colour;c.lineWidth=width;c.stroke();
  }
  function polygon(c,pts,colour){
    c.beginPath();c.moveTo(...pts[0]);for(const pt of pts.slice(1))c.lineTo(...pt);
    c.closePath();c.fillStyle=colour;c.fill();
  }
  function oval(c,x,y,rx,ry,colour){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fillStyle=colour;c.fill();
  }
  function pip(c,x,y,size,colour){
    c.save();c.translate(x,y);c.scale(size,size);c.beginPath();c.moveTo(0,-17);
    c.bezierCurveTo(-6,-8,-18,-4,-16,5);c.bezierCurveTo(-15,14,-5,13,0,7);
    c.bezierCurveTo(5,13,15,14,16,5);c.bezierCurveTo(18,-4,6,-8,0,-17);
    c.closePath();c.fillStyle=colour;c.fill();
    polygon(c,[[-2,3],[2,3],[7,17],[-7,17]],colour);c.restore();
  }
  function tool(c,entry,p){
    const [,,grip,width,length,tip]=entry;
    const top=grip==='long'?-69:grip==='fold'?-30:-51;
    line(c,[[0,top],[0,33]],p[3],5);
    if(grip==='D'||grip==='fold'){
      c.beginPath();c.moveTo(0,top+7);c.quadraticCurveTo(-10,top+4,-10,top-6);
      c.lineTo(10,top-6);c.quadraticCurveTo(10,top+4,0,top+7);c.strokeStyle=p[5];c.lineWidth=3;c.stroke();
    }else if(grip==='T')line(c,[[-12,top],[12,top]],p[3],6);
    if(grip==='fold')oval(c,0,15,6,5,p[4]);
    const grad=c.createLinearGradient(-width,0,width,0);
    grad.addColorStop(0,p[0]);grad.addColorStop(.43,p[5]);grad.addColorStop(1,p[2]);
    c.beginPath();c.moveTo(-width,29);c.lineTo(width,29);
    if(tip<.4){
      c.lineTo(width,29+length*.8);c.lineTo(width*(1-tip),29+length);
      c.lineTo(-width*(1-tip),29+length);c.lineTo(-width,29+length*.8);
    }else{
      c.quadraticCurveTo(width,29+length*(1-tip*.45),0,29+length);
      c.quadraticCurveTo(-width,29+length*(1-tip*.45),-width,29);
    }
    c.closePath();c.fillStyle=grad;c.fill();c.strokeStyle=p[5];c.lineWidth=1.2;c.stroke();
    line(c,[[0,31],[0,29+length*.58]],p[3]+'90',1.5);
  }
  function banner(c,text,t,p){
    const spread=.82+.18*smooth(t/1.4), wave=Math.sin(t*3.1)*2+bass*2.8;
    c.save();c.translate(0,-123);c.scale(spread,1);
    c.beginPath();c.moveTo(-224,-38);c.quadraticCurveTo(0,-44+wave,224,-38);
    c.lineTo(213,0);c.lineTo(224,40);c.quadraticCurveTo(0,46-wave,-224,40);
    c.lineTo(-213,0);c.closePath();c.fillStyle=p[3];c.fill();
    c.strokeStyle=p[4];c.lineWidth=1.3;c.stroke();
    const size=text.length<50?19:14;
    c.font=size+'px Georgia';c.textAlign='center';c.fillStyle=p[0];
    const lines=[];let row='';
    for(const word of text.split(' ')){
      const candidate=row?row+' '+word:word;
      if(row&&c.measureText(candidate).width>387){lines.push(row);row=word;}else row=candidate;
    }
    lines.push(row);
    for(const [i,phrase] of lines.entries())c.fillText(phrase,0,5+(i-(lines.length-1)/2)*(size+3)+wave*.55);
    c.restore();
  }
  function gardener(c,x,t,i,phase,p){
    const walking=phase!=='act', step=Math.sin(t*13), show=walking?0:Math.sin(Math.PI*clamp((t-1.6)/6.8))**2;
    const motion=show*Math.sin(t*(i%3+4)), dig=deck[i][6]==='dig', edge=deck[i][6]==='edge';
    oval(c,x,95,43,6,p[0]+'bb');
    c.save();c.translate(x,92-(walking?Math.abs(step)*6:show*bass*5));c.rotate(walking?.08:motion*.10);
    for(const side of [-1,1]){
      const stride=walking?side*step*16:side*motion*6;
      line(c,[[side*13,-30],[side*15+stride/2,-13],[side*18+stride,0]],p[0],10);
      line(c,[[side*18+stride,0],[side*18+stride+9,0]],p[3],5);
    }
    const coat=i%3===0?p[4]:i%3===1?p[2]:p[1];
    polygon(c,[[-23,-76],[22,-76],[29,-28],[-26,-28]],coat);
    line(c,[[-20,-36],[24,-36]],p[0],4);
    oval(c,0,-91,17,17,p[3]);
    if(i===0){
      polygon(c,[[-13,-99],[-19,-119],[-3,-105]],p[4]);
      polygon(c,[[10,-101],[18,-119],[17,-98]],p[4]);
      line(c,[[-26,-47],[-42,-55],[-44,-68]],p[4],3);
    }else if(i>=11){
      polygon(c,[[-19,-100],[-21,-117],[-10,-111],[0,-123],[11,-111],[21,-117],[19,-100]],p[2]);
    }else{
      oval(c,-3,-103,19+i%3*3,7,p[0]);
      line(c,[[-24,-101],[24,-101]],p[2],4);
    }
    oval(c,-5,-92,1.5,2,p[0]);oval(c,7,-92,1.5,2,p[0]);
    c.beginPath();c.moveTo(-5,-85);c.quadraticCurveTo(2,-79,9,-85);c.strokeStyle=p[0];c.lineWidth=1.5;c.stroke();
    const handX=31+motion*5, handY=-52+(dig?motion*23:motion*10);
    line(c,[[17,-68],[25,-58],[handX,handY]],coat,9);
    oval(c,handX,handY,5,5,p[3]);c.translate(handX,handY);
    c.rotate(walking?-.25+step*.15:edge?.38+motion*.7:-.22+motion*(dig?.5:1.05));
    tool(c,deck[i],p);c.restore();
    if(!walking && show>.15){
      for(let j=0;j<15;j++){
        const f=(t*.61+j/15)%1;
        oval(c,x+35+Math.cos(j*2.4)*f*53,92-Math.sin(f*Math.PI)*(14+j%4*7)*(1+bass),1+j%3,1+j%2,p[4]+'a5');
      }
    }
  }
  function draw(c,w,h,now,opts={}){
    const sel=typeof opts.form==='number'?opts.form:forms.findIndex(([id])=>id===opts.form);
    const form=forms[sel]?sel:0;
    if(active!==form){reset();active=form;}
    const running=opts.animate!==false, dt=running&&last!==null?Math.min(.1,Math.max(0,(now-last)/1000)):0;
    last=running?now:null;time+=dt*Math.max(.4,Math.min(2.5,Number(opts.speed)||1));
    bass+=(clamp(Number(opts.bass)||0)-bass)*(1-Math.exp(-dt*10));
    const cycle=time%total,i=Math.min(12,Math.floor(cycle/act)),t=cycle-i*act,p=palettes[form],entry=deck[i];
    const phase=t<1.6?'entrance':t>=8.4?'exit':'act';
    const x=phase==='entrance'?-310+336*smooth(t/1.6):phase==='exit'?26+285*smooth((t-8.4)/1.6):26;
    c.save();const g=c.createRadialGradient(w/2,h*.47,0,w/2,h*.47,Math.max(w,h)*.65);
    g.addColorStop(0,p[0]);g.addColorStop(1,'#0b0d15');c.fillStyle=g;c.fillRect(0,0,w,h);
    const s=Math.min(w/500,h/365);c.translate(w/2,h*.49);c.scale(s,s);
    c.beginPath();c.rect(-247,-180,494,360);c.clip();c.lineCap='round';c.lineJoin='round';
    oval(c,115,-53,30,30,p[2]+'23');
    c.fillStyle=p[1];c.fillRect(-246,96,492,83);
    line(c,[[-246,95],[246,95]],p[2],1.5);
    for(let j=0;j<45;j++)oval(c,Math.sin(j*32.9)*239,100+(j*17%72),1+j%4,1,p[4]+'6e');
    for(let j=0;j<13;j++)pip(c,(j-6)*20,114,.33,j===i?p[3]:p[2]+'6a');
    c.save();c.translate(-158,12);c.rotate(-.11);
    c.beginPath();c.roundRect(-40,-59,80,118,7);c.fillStyle=p[3];c.fill();
    c.fillStyle=p[0];c.font='bold 18px Georgia';c.fillText(entry[0],-32,-33);
    pip(c,0,0,1.4,p[0]);c.rotate(Math.PI);c.fillText(entry[0],-32,-33);c.restore();
    gardener(c,x,t,i,phase,p);
    if(entry[6]==='flower'){
      const growth=smooth((t-4)/1.4);
      if(growth>0){
        c.save();c.translate(114,95);c.scale(growth,growth);
        line(c,[[0,0],[3,-37]],p[2],2.5);oval(c,-3,-16,7,3,p[2]);
        for(let k=0;k<6;k++)oval(c,3+Math.cos(k*tau/6)*7,-38+Math.sin(k*tau/6)*7,4,4,p[3]);
        oval(c,3,-38,4,4,p[4]);c.restore();
      }
    }
    banner(c,messages[entry[7]],t,p);
    c.textAlign='center';c.fillStyle=p[3];c.font='600 10px Arial';c.fillText('S P A D E S   /   '+forms[form][1].toUpperCase(),0,-170);
    c.font='21px Georgia';c.fillText(entry[1],0,147);
    c.font='10px Arial';c.fillText(entry[0]+' OF SPADES',0,167);
    c.restore();
    return {rank:entry[0],index:i,phase,time,message:entry[7]};
  }
  return {draw,reset,forms,recipes};
})();
