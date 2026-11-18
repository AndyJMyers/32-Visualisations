window.TheHangedMan = (() => {
  const forms=[['shadow','The Drop'],['inversion','The World Inverted'],['ink','The Last Tremor']];
  const recipes=forms.map(([form,name])=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const tau=Math.PI*2;
  const cap=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=cap(x);return x*x*(3-2*x);};
  function shape(c,color,points,width=0){
    c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p));
    if(width){c.lineWidth=width;c.strokeStyle=color;c.stroke();}
    else{c.closePath();c.fillStyle=color;c.fill();}
  }
  function oval(c,color,x,y,rx,ry){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fillStyle=color;c.fill();
  }
  function expression(c,rotation,t,elapsed,jolt,accent){
    const slack=ease((elapsed-4)/.72), grimace=elapsed>=0 ? 1-ease((elapsed-.32)/3.65) : 0;
    const dread=elapsed<0?ease((elapsed+3)/2.9):0;
    const blink=slack===0&&Math.cos(t*2.36)>.989;
    oval(c,accent,.004,.006,.102,.141);
    for(const side of [-1,1]){
      const x=side*.046, y=-.037+jolt*.018*side;
      const open=(.011+dread*.015)*(1-grimace*.72)*(1-slack);
      oval(c,'#2d2033',x,y,.025,blink?.003:Math.max(.003,open));
      if(open>.014&&!blink)oval(c,'#eed4bc',x+Math.sin(t*3.1)*.006,y-.002,.006,.006);
      shape(c,'#392632',[[x-side*.023,y-.029-dread*.014+grimace*.022],
        [x+side*.021,y-.037+slack*.013]],.011);
    }
    shape(c,'#513744',[[-.002,-.025],[.017,.011],[.004,.02]],.009);
    const mouthY=.063+slack*.023;
    oval(c,'#32202f',0,mouthY,.031+dread*.011+grimace*.019,.007+grimace*.015+slack*.016);
    if(slack>0){
      c.save();c.translate(.011,mouthY);c.rotate(-rotation+Math.sin(t*2.1)*.10);
      oval(c,'#b97887',0,.027*slack,.015*slack,.042*slack);
      c.restore();
    }
  }
  function figure(c,x,y,rotation,jolt,color,accent,t,elapsed){
    c.save();c.translate(x,y);c.rotate(rotation);
    oval(c,color,0,0,.137,.176);
    expression(c,rotation,t,elapsed,jolt,accent);
    shape(c,color,[[-.10,.14],[.105,.14],[.238,.25],[.16,.64],[-.16,.64],[-.238,.25]]);
    shape(c,accent,[[-.13,.29],[-.015,.55],[.091,.49]],.032);
    shape(c,color,[[-.15,.28],[-.23-jolt*.16,.53],[-.12,.58]],.092);
    shape(c,color,[[.15,.28],[.23+jolt*.16,.51],[.085,.60]],.088);
    for(const side of [-1,1]){
      shape(c,color,[[side*.085,.59],[side*(.095+jolt*.16),.78],[side*(.105-jolt*.13),.94]],.112);
    }
    c.restore();
  }
  function spectator(c,x,y,s,coat,role,face,t,gesture,trim='#e2bc79'){
    c.save();c.translate(x,y);c.scale(s*face,s);
    const skin='#ba877b', sway=Math.sin(t*2.7)*.025;
    shape(c,coat,[[-.12,-.28],[.1,-.27],[.17,.07],[-.18,.07]]);
    oval(c,skin,.01,-.36+sway,.072,.085);
    shape(c,'#392533',[[.042,-.365+sway],[.062,-.365+sway]],.014);
    if(role==='rozzer'){
      shape(c,'#242736',[[-.093,-.418+sway],[.077,-.416+sway],[.13,-.392+sway],[-.094,-.396+sway]]);
      oval(c,'#bda17b',.026,-.262,.023,.013);
      shape(c,'#bc9a70',[[.023,-.22],[.091,-.16]],.016);
    }else if(role==='worker'){
      oval(c,'#4f2b3e',-.049,-.418+sway,.074,.031);
      shape(c,'#d197a0',[[-.074,-.424+sway],[-.083,-.53+sway],[-.125,-.558+sway]],.023);
      shape(c,'#e2b3a4',[[.09,-.257],[.142,-.183],[.195+gesture*.096,-.218-gesture*.064]],.027);
      oval(c,'#f1c0a2',.06,-.398+sway,.009,.011);
    }else if(role==='landsknecht'){
      for(const side of [-1,1]){
        oval(c,coat,side*.132,-.241,.079,.064);
        for(let i=0;i<3;i++){
          const xx=side*.132+(i-1)*.033;
          shape(c,trim,[[xx,-.274],[xx+.015,-.227]],.015);
        }
      }
      shape(c,trim,[[-.09,-.247],[.084,-.119]],.018);
      oval(c,'#2c2939',0,-.42+sway,.137,.027);
      oval(c,coat,-.034,-.449+sway,.074,.041);
      const plume=Math.sin(t*3.1)*.045;
      shape(c,trim,[[-.054,-.44+sway],[-.107,-.566+sway],[-.183+plume,-.611+sway],[-.138+plume,-.524+sway]]);
    }else{
      shape(c,role==='thief'?'#564053':'#543742',[[-.077,-.403+sway],[-.06,-.46+sway],[.051,-.457+sway],[.103,-.405+sway]]);
      if(role==='thief') shape(c,skin,[[.09,-.24],[.15,-.125],[.26+gesture*.064,-.15-gesture*.02]],.025);
    }
    c.restore();
  }
  function crowd(c,X,t,phase,bass,cast){
    const width=Math.min(X,2.7), flinch=ease((phase-4.19)/.20)*(1-ease((phase-4.5)/.68));
    const coats=cast===0?['#b04253','#815146','#a97738','#4b5649','#854751']
      :['#357668','#628e78','#aa8959','#3d666a','#758b55'];
    const trims=cast===0?['#ecb759','#e4c7a1','#6aabc1']:['#f4e2b8','#cb91a2','#b5dba3'];
    for(const side of [-1,1]) for(let i=0;i<9;i++){
      const depth=(i%3)/3, x=side*(.43+(width-.45)*(i+.55)/9);
      const y=.86+depth*.12+Math.sin(t*2.5+i)*(.011+bass*.013)+flinch*((i%3)-1)*.041;
      spectator(c,x,y,.39+depth*.15,coats[(i+side+1)%5],i%3===1?'watch':'landsknecht',-side,t+i,0,trims[i%3]);
    }
    const left=-width*.73,right=width*.69, cycle=phase%8;
    const chat=(1+Math.sin(t*3.1))/2;
    spectator(c,left-.15,1.11,.66,'#a55772','worker',1,t,chat);
    spectator(c,left+.14-chat*.037,1.09,.60,'#624e63','watch',-1,t+.4,0);
    const approach=ease((cycle-.7)/1.7), away=ease((cycle-3.25)/1.72);
    spectator(c,right+.13,1.10,.63,'#866257','watch',-1,t+.4,0);
    const thiefX=right-.36+approach*.27-away*.26;
    spectator(c,thiefX,1.12,.55,'#4a3850','thief',away>.48?-1:1,t+1,approach*(1-away));
    if(cycle>3.25&&cycle<6.6) oval(c,'#d0a37c',thiefX-.135,1.04,.025,.034);
    const look=ease((cycle-4.25)/.72)*(1-ease((cycle-6.9)/.65));
    spectator(c,right+.29-look*.066,.93,.51,'#46506a','rozzer',-1,t*.68,0);
    spectator(c,left+.38+Math.sin(t*.67)*.07,.96,.54,'#50566a','rozzer',1,t*.71+1.4,0);
    return {crowdSize:24};
  }
  function dog(c,x,y,s,face,t,coat,beg,bass){
    c.save();c.translate(x,y);c.scale(s*face,s);
    const wag=Math.sin(t*(7+bass*3)), step=Math.sin(t*5)*.027*(1-beg);
    oval(c,coat,-.025,-.072,.124,.062,-beg*.24);
    oval(c,coat,.093,-.103-beg*.048,.059,.052);
    oval(c,coat,.134,-.095-beg*.048,.036,.027);
    oval(c,'#241926',.095,-.126-beg*.048,.01,.011);
    oval(c,'#50374b',.072,-.091-beg*.048,.024,.042);
    shape(c,coat,[[-.13,-.087],[-.18,-.135],[-.219,-.128+wag*.035]],.025);
    shape(c,coat,[[-.085,-.04],[-.094+step,.013]],.029);
    shape(c,coat,[[.06,-.04],[.079-step+beg*.037,.014-beg*.056]],.025);
    c.restore();
  }
  function sausageStall(c,X,t,bass,treble){
    const x=Math.min(X*.68,1.82), y=.99, ask=(1+Math.sin(t*1.7))/2;
    const steam=Math.sin(t*2)*.018;
    spectator(c,x+.028,y+.01,.62,'#854b4a','watch',-1,t,0);
    shape(c,'#563443',[[x-.22,y+.22],[x-.22,y-.12],[x+.22,y-.12],[x+.22,y+.22]],.021);
    shape(c,'#bb815c',[[x-.267,y-.13],[x+.26,y-.13],[x+.22,y-.07],[x-.23,y-.07]]);
    for(let i=0;i<5;i++){
      const xx=x-.17+i*.077;
      oval(c,i%2?'#cb735c':'#e89668',xx,y-.148,.036,.016);
      shape(c,'#ffe0a780',[[xx,y-.173],[xx+steam,y-.22],[xx-.012,y-.264-treble*.026]],.009);
    }
    const serve=Math.max(0,Math.sin(t*1.7-.28))**3;
    shape(c,'#ba877b',[[x+.03,y-.18],[x-.09,y-.16],[x-.11-serve*.16,y-.137+serve*.09]],.026);
    oval(c,'#de8e63',x-.114-serve*.16,y-.146+serve*.09,.052,.011);
    dog(c,x-.32,y+.28,.77,1,t,'#c1977a',ask,bass);
    dog(c,x+.16+Math.sin(t*1.33)*.083,y+.30,.67,-1,t+.65,'#917b88',0,bass);
    return {dogs:2, vendor:true};
  }
  function storm(c,X,Y,t,phase,bass,treble){
    for(let i=0;i<9;i++){
      const x=((i*X*.51-t*.16+X)%(2.6*X)+2.6*X)%(2.6*X)-1.3*X;
      oval(c,i%2?'#364c61bb':'#19283dbb',x,-Y*.57+Math.sin(i*1.6)*.16,X*.31,.15+i%3*.049);
    }
    const age=Math.min(Math.abs(phase-3.58),Math.abs(phase-8.84));
    if(age<.16){
      const x=phase<5?X*.66:-X*.70;
      c.save();c.globalAlpha=(1-age/.16)*(.49+treble*.29);
      shape(c,'#e6deca',[[x,-Y],[x-.16,-Y*.72],[x-.061,-Y*.63],[x-.29,-Y*.34]],.023);
      c.restore();
    }
    c.save();c.globalAlpha=.47;
    for(let i=0;i<96;i++){
      const progress=(t*(.71+(i%5)*.1)+i*.38197)%1;
      const x=Math.sin(i*17.84)*X*1.14-progress*(.24+bass*.47), y=-Y+2*Y*progress;
      const length=.04+(i%7)*.014+bass*.047;
      shape(c,i%5?'#92a8b8':'#dce4d9',[[x,y],[x-length*(.42+bass*.31),y+length]],.008);
    }
    c.restore();
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}){
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)),t=Math.max(0,time/1000);
    const phase=t%16, elapsed=phase-4, drop=cap(elapsed/.34)**2;
    const decay=elapsed<.34?0:Math.exp(-(elapsed-.34)*.54);
    const recoil=Math.sin(Math.max(0,elapsed-.34)*19)*decay*(.041+bass*.065);
    const jolt=Math.sin(t*14)*decay*(.30+mid*.42);
    const s=Math.min(w*.38,h*.35),X=w/(2*s),Y=h/(2*s);
    const palettes=[['#260e19','#883b32','#ffc977','#331827'],['#092a2b','#2c7766','#fff1c8','#123633'],['#0d1827','#526777','#edbb91','#202537']];
    const [dark,field,light,body]=palettes[cast];
    c.save();c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const sky=c.createRadialGradient(0,-.1,.04,0,0,Math.hypot(X,Y));
    sky.addColorStop(0,field);sky.addColorStop(1,dark);
    c.fillStyle=sky;c.fillRect(-X,-Y,2*X,2*Y);
    if(cast===0){
      for(const side of [-1,1]){
        const x=side*Math.min(X*.81,1.33);
        shape(c,'#211926',[[x,-Y],[x+side*.21,-Y],[x+side*.32,Y],[x-side*.16,Y]]);
        const r=.11+bass*.045;
        oval(c,'#ffc98320',x,.78,r*2,r*2);
        oval(c,light,x,.78+Math.sin(t*9)*.019,.029,.059+treble*.02);
      }
      if(drop<1)shape(c,'#362632',[[-.48,.68],[.48,.68],[.41,.78],[-.47,.78]]);
    }else if(cast===1){
      for(let i=0;i<7;i++){
        const r=.29+i*.17+bass*.033;
        c.beginPath();c.ellipse(0,.45,r,r*.32,t*.12+i*.1,0,tau);
        c.strokeStyle=i%2?'#9bbad145':'#c6daef58';c.lineWidth=.011;c.stroke();
      }
      for(let i=0;i<35;i++)oval(c,'#d0e4f580',Math.sin(i*12.71)*X,Math.cos(i*5.3)*Y*.89,.004+treble*.012,.009);
    }else{
      storm(c,X,Y,t,phase,bass,treble);
    }
    const gust=cast===2?(.028+bass*.058)*Math.sin(t*3.7):0;
    const swing=Math.sin(t*2.8)*decay*(.07+bass*.12)+gust;
    const y=-.38+drop*.64+recoil, angle=cast===1?Math.PI*ease((phase-4.08)/1.6):swing+jolt*.14;
    const attachmentY=cast===1?y+Math.cos(angle)*.94:y-.11;
    const ropeX=cast===1?-Math.sin(angle)*.94:0;
    c.beginPath();c.moveTo(0,-Y*.66);
    c.quadraticCurveTo(swing*.72,-.55,swing+ropeX,attachmentY);
    c.strokeStyle=light+'be';c.lineWidth=.023+bass*.015*decay;c.stroke();
    figure(c,swing,y,angle,jolt,body,light+'80',t,elapsed);
    if(cast!==1&&elapsed>.38){
      for(let i=0;i<(cast===2?30:11);i++){
        const age=elapsed-.38-i*.085;
        if(age<0||age>2.4)continue;
        const yy=y+.67+age*age*.21, x=swing+Math.sin(i*5.7)*age*(.09+bass*.09);
        c.globalAlpha=(1-age/2.4)*(.38+treble*.27);
        oval(c,cast===2?(i%2?'#b87863':'#91a9bb'):'#aa744f',x,yy,.015+treble*.019,.024+age*.017);
      }
      c.globalAlpha=1;
    }
    const crowdState=cast!==2?{...crowd(c,X,t,phase,bass,cast),...sausageStall(c,X,t,bass,treble)}:{storm:true};
    c.fillStyle=light;c.textAlign='center';c.font='bold 0.15px Georgia';
    c.fillText('XII  /  THE HANGED MAN',0,-Y*.80);
    c.restore();
    return {scene:forms[cast][0],stage:elapsed<0?'waiting':elapsed<.34?'drop':elapsed<4?'tremor':'still',...crowdState};
  }
  return {forms,recipes,draw};
})();
