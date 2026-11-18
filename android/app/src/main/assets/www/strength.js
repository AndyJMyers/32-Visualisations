window.Strength=(()=>{
  const forms=[['timber','Iron in the Greenwood'],['furrows','The Long Furrow'],['gate','Hold the Gate'],['stone','The Weight of Stone'],['arena','Allies for a Round']];
  const recipes=forms.map(([form,name])=>({form,name,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const palettes=[['#162438','#6e936b'],['#233b50','#d7ab73'],['#25213d','#98636e'],['#314854','#b89184'],['#1d1634','#856084']];
  const cast=[['#486f85','#afe9ef','#96e9ff'],['#764756','#e4aa88','#ffcf93'],['#51436c','#bbdaf2','#ff96da'],['#4b6561','#d8a27b','#fbd284']];
  const tau=Math.PI*2, cap=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=cap(x);return x*x*(3-2*x);};
  const mix=(a,b,t)=>a+(b-a)*t;
  function path(c,color,points,width=0){
    c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p));
    if(width){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
    else{c.closePath();c.fillStyle=color;c.fill();}
  }
  function disc(c,color,x,y,rx,ry){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fillStyle=color;c.fill();
  }
  function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(x,y,w,h);}
  function champion(c,id,x,y,s,t,{dir=1,lean=0,walk=0,hand=[.34,-.15],other=[-.25,.02]}={}){
    const [coat,face,trim]=cast[id], android=id%2===0, woman=id>=2;
    c.save();c.translate(x,y);c.scale(dir*s,s);c.rotate(lean);
    for(const side of [-1,1]){
      const stride=Math.sin(t*6)*walk*side;
      path(c,coat,[[side*.11,.29],[side*.13+stride*.05,.49],[side*.16+stride*.18,.67]],.105);
    }
    path(c,coat,[[-.19,-.36],[.18,-.36],[.15,.27],[-.18,.27]]);
    path(c,trim,[[-.14,.17],[.14,.17]],.025);
    if(woman&&!android)disc(c,'#342b3c',-.105,-.50,.10,.20);
    disc(c,face,0,-.50,.12,.15);
    if(android){
      path(c,coat,[[-.11,-.53],[.115,-.53]],.045);
      path(c,trim,[[-.074,-.527],[.092,-.527]],.017);
      disc(c,trim,0,-.15,.037,.037);
    }else{
      path(c,'#503447',[[-.105,-.56],[-.072,-.63],[.067,-.64],[.101,-.578]],.043);
      disc(c,'#302539',.056,-.515,.011,.013);
    }
    for(const [side,target] of [[-1,other],[1,hand]]){
      const bend=[mix(side*.15,target[0],.55),mix(-.31,target[1],.57)+.082];
      path(c,coat,[[side*.15,-.31],bend,target],.095);
      if(android)disc(c,trim,...bend,.027,.027);
      disc(c,face,...target,.048,.04);
    }
    c.restore();
  }
  function ground(c,X,Y,color,y=.72){rect(c,color,-X,y,2*X,Y-y);}
  function tree(c,x,y,kind,size){
    c.save();c.translate(x,y);c.scale(size,size);
    if(kind===0){
      path(c,'#584a45',[[0,0],[.013,-1.48]],.097);
      for(let i=0;i<5;i++){
        const yy=-.7-i*.205,r=.34-i*.049;
        path(c,i%2?'#476f62':'#34574f',[[-r,yy],[.008,yy-.48],[r,yy]]);
      }
    }else if(kind===1){
      path(c,'#ede0be',[[0,0],[-.033,-.87],[.05,-1.65]],.073);
      for(let i=0;i<8;i++)path(c,'#69616a',[[-.029,-.21-i*.16],[.031,-.22-i*.16]],.017);
      for(let i=0;i<6;i++)disc(c,i%2?'#a1a267':'#87955f',Math.sin(i*2)*.21,-1.13-i*.088,.18,.14);
    }else{
      path(c,'#765340',[[0,0],[-.026,-.76],[.05,-1.39]],.137);
      for(let i=0;i<5;i++){
        const side=i%2?1:-1, yy=-.81-i*.13;
        path(c,'#765340',[[0,yy],[side*.32,yy-.19]],.052);
        disc(c,i%2?'#65794a':'#536c47',side*.24,yy-.27,.29,.17);
      }
    }
    c.restore();
  }
  function troll(c,t,fall){
    c.save();c.translate(.39,.73);c.rotate(-fall*1.36);
    const shrug=Math.sin(t*3)*.055*(1-fall);
    path(c,'#5f7471',[[-.11,-.34],[-.13,-.06],[-.26,-.045]],.15);
    path(c,'#5f7471',[[.13,-.33],[.16,-.07],[.29,-.04]],.15);
    disc(c,'#657b67',0,-.57,.29,.38);
    for(const side of [-1,1]){
      path(c,'#849778',[[side*.19,-.72],[side*.33,-.54+shrug],[side*.34,-.33+shrug]],.145);
      path(c,'#a6ad7d',[[side*.12,-1.03],[side*.29,-1.18],[side*.23,-.98]]);
    }
    disc(c,'#90a07b',0,-.96,.202,.19);
    disc(c,'#c3df9d',-.077,-.993,.028,.025);
    disc(c,'#c3df9d',.062,-.994,.028,.025);
    path(c,'#414c54',[[-.078,-.875],[.014,-.886],[.077,-.857]],.025);
    c.restore();
  }
  function timber(c,X,Y,t,p,bass){
    for(let i=0;i<13;i++){
      const x=(i/6-1)*X;
      c.save();c.globalAlpha=.42+i%3*.10;
      tree(c,x,.7,(i+i%2)%3,.56+i%4*.14);c.restore();
    }
    ground(c,X,Y,'#394e43');
    const fall=ease((p-9)/2.1), hit=Math.max(0,Math.sin(t*4.5))**4*(1-fall);
    const bx=.37;
    const cycle=Math.floor(t/18), isTroll=cycle%4===3;
    if(isTroll)troll(c,t,fall);
    else{
      c.save();c.translate(bx,.73);c.rotate(-fall*1.31);tree(c,0,0,cycle%4,1);c.restore();
    }
    const hand=[.32+hit*.12,-.31-hit*.16], x=-.40,y=.11;
    champion(c,0,x,y,.91,t,{hand,other:[hand[0]-.13,hand[1]+.11]});
    const hx=x+hand[0]*.91,hy=y+hand[1]*.91;
    path(c,'#ab8765',[[hx-.18,hy-.12],[hx+.30,hy+.32]],.026);
    path(c,'#c9ecdf',[[hx+.22,hy+.22],[hx+.34,hy+.17],[hx+.42,hy+.31],[hx+.30,hy+.35]]);
    for(let i=0;i<9;i++) if(hit>.3)disc(c,isTroll?'#beecaa':'#e9bf8c',bx+Math.sin(i*4.7)*(.03+hit*.18),.46-Math.abs(Math.cos(i))*hit*.23,.009+bass*.009,.011);
    return {fall,target:isTroll?'troll':['pine','birch','oak'][cycle%4]};
  }
  function furrows(c,X,Y,t,p,bass){
    ground(c,X,Y,'#8b624f',.27);
    for(let i=0;i<22;i++){
      const q=(i/22+t*.16)%1,y=.28+q*q*(Y-.25);
      path(c,i%2?'#b58b61':'#664f48',[[-X,y],[X,y-.10*q]],.009+q*.022);
    }
    const bob=Math.sin(t*5)*.024, x=-.53;
    champion(c,1,x,.13+bob,.78,t,{walk:1,hand:[.34,.05],other:[.24,.16]});
    path(c,'#c49868',[[x+.18,.19],[x+.28,.56],[x+.75,.62]],.03);
    for(const offset of [-.12,.10]){
      const ox=.53+offset,oy=.54+offset*.25;
      disc(c,'#c79776',ox,oy,.29,.14);
      disc(c,'#ad785f',ox+.27,oy-.054,.101,.084);
      path(c,'#f4d8a1',[[ox+.25,oy-.10],[ox+.22,oy-.19],[ox+.30,oy-.13],[ox+.34,oy-.20]],.022);
      for(const side of [-1,1])path(c,'#6b5147',[[ox+side*.17,oy+.07],[ox+side*.17+Math.sin(t*5+side)*.06,oy+.22]],.049);
      path(c,'#624738',[[x+.27,.27],[ox+.14,oy-.09]],.013);
    }
    for(let i=0;i<14;i++)disc(c,'#e2ae7788',-.19-i*.04,.68-Math.sin(t*3+i)**2*(.08+bass*.09),.013,.013);
    for(let i=0;i<5;i++){
      const x=-X*.27+Math.sin(t*.67+i*2.2)*X*.43,y=-.56+Math.sin(t*1.35+i)*.12;
      const wing=Math.sin(t*(8+i*.37)+i)*(.035+bass*.028);
      path(c,i%2?'#ffe4c2':'#3e3f56',[[x-.091,y+wing],[x-.042,y-.022],[x,y],[x+.039,y-.024],[x+.083,y+wing]],.018);
    }
    for(let i=0;i<3;i++){
      const x=-.26-i*.16+Math.sin(t*.96+i)*.08,y=.81+i*.05;
      disc(c,'#654b51',x,y,.034,.019);
      const headY=y-.023+Math.sin(t*8+i)*.014;
      disc(c,'#dfb895',x+.027,headY,.014,.014);
      path(c,'#463743',[[x+.034,headY],[x+.058,headY+.007]],.008);
    }
    return {drawing:true,birds:8};
  }
  function weapon(c,x,y,s,angle,kind){
    c.save();c.translate(x,y);c.rotate(angle);c.scale(s,s);
    path(c,'#c59974',[[0,.14],[0,-.44]],.031);
    if(kind===0)path(c,'#e2dfd6',[[0,-.62],[.056,-.48],[0,-.39],[-.056,-.48]]);
    else if(kind===1)path(c,'#c2b4c9',[[0,-.49],[.17,-.54],[.22,-.42],[.14,-.35],[0,-.39]]);
    else{
      disc(c,'#aa90a6',0,-.45,.088,.077);
      for(let i=0;i<5;i++)disc(c,'#eacfb2',Math.sin(i*tau/5)*.065,-.45+Math.cos(i*tau/5)*.058,.016,.016);
    }
    c.restore();
  }
  function gate(c,X,Y,t,p,bass){
    ground(c,X,Y,'#583947');
    for(let i=-4;i<=4;i++){
      const x=i*.24;
      path(c,i%2?'#754e58':'#865860',[[x-.10,.74],[x-.10,-.57],[x,-.72],[x+.10,-.57],[x+.10,.74]]);
    }
    const shove=ease((p%5-1.6)/1.3)*(1-ease((p%5-3.1)/1.4));
    champion(c,2,-.36+shove*.14,.10,1,t,{lean:shove*.15,hand:[.33,-.17],other:[-.23,.06]});
    disc(c,'#354859',-.01+shove*.14,.04,.16,.22);
    disc(c,'#ffb9ea',-.01+shove*.14,.04,.061,.061);
    for(let i=0;i<3;i++){
      const x=.43+i*.22+shove*(.14+i*.041);
      champion(c,1,x,.20-i*.025,.67-i*.10,t+i,{dir:-1,walk:1,lean:-shove*.24,hand:[.28,-.08]});
      weapon(c,x-(.67-i*.10)*.28,.15-i*.025,.62-i*.08,-.40+i*.27+Math.sin(t*3.7+i)*.24+shove*.43,i);
    }
    if(shove>.65)for(let i=0;i<5;i++)disc(c,'#ffd0ae',.14+Math.sin(i*7)*bass*.1,-.11+i*.06,.012,.012);
    return {shove};
  }
  function stone(c,X,Y,t,p,bass){
    ground(c,X,Y,'#675555');
    for(const side of [-1,1])rect(c,'#ad8c7b',side*.58-.12,-.52,.24,1.26);
    const lift=ease((p-2.7)/5.1), y=mix(.33,-.57,lift);
    champion(c,3,0,.17-lift*.025,1,t,{hand:[.29,y-.13],other:[-.29,y-.13],lean:Math.sin(t*3)*.029*(1-lift)});
    rect(c,'#c4a691',-.69,y-.16,1.38,.17);
    path(c,'#e7c3a0',[[-.67,y-.15],[.68,y-.15]],.025);
    for(let i=0;i<17;i++)disc(c,'#e4c3a581',Math.cos(i*7)*.63,y+.04+(t*.51+i*.13)%1*.36,.007+bass*.006,.008);
    return {lift};
  }
  const pairings=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]];
  function arena(c,X,Y,t,p,bass,treble){
    for(let i=0;i<29;i++){
      const x=(i/14-1)*X;
      disc(c,i%2?'#a37a98':'#b78b93',x,-.57+Math.sin(i*2.1)*.09,.029,.029);
    }
    disc(c,'#4d3c65',0,.37,X*.95,.53);disc(c,'#77546e',0,.41,X*.88,.44);
    const round=Math.floor(p/6)%3, progress=ease((p%6)/1.65), link=ease((p%6-.92)/1.13);
    const current=pairings[round], previous=pairings[(round+2)%3], d=Math.min(X*.57,.83);
    const corners=[[-d,.17],[-d*.39,.38],[d*.39,.38],[d,.17]];
    const find=(pairs,id)=>pairs.flat().indexOf(id);
    const positions=cast.map((_,id)=>{
      const a=corners[find(previous,id)],b=corners[find(current,id)];
      return [mix(a[0],b[0],progress),mix(a[1],b[1],progress)-Math.sin(progress*Math.PI)*.17*(id%2?1:-1)];
    });
    for(const [pair,ids] of current.entries()){
      const [a,b]=ids.map(id=>positions[id]), pulse=.018+bass*.017;
      c.save();c.globalAlpha=link*.84;
      path(c,pair?'#f8a7cd':'#9df9ee',[[a[0],a[1]+.42],[b[0],b[1]+.42]],pulse);
      c.restore();
    }
    for(let id=0;id<4;id++){
      const [x,y]=positions[id], signal=link*Math.max(0,Math.sin(p*4+id));
      champion(c,id,x,y-.047*signal,.64,t+id,{dir:x<0?1:-1,lean:signal*.12,hand:[.31+signal*.05,-.17-signal*.14]});
      if(link>.5)disc(c,find(current,id)<2?'#b8fff4':'#febdde',x,y+.42,.045+treble*.02,.019);
    }
    return {alliances:current};
  }
  function draw(c,w,h,time,{form,bass=0,treble=0}={}){
    const id=Math.max(0,forms.findIndex(([key])=>key===form)),t=Math.max(0,time/1000),p=t%18;
    const s=Math.min(w*.43,h*.40),X=w/(2*s),Y=h/(2*s);
    c.save();c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const g=c.createLinearGradient(0,-Y,0,Y);g.addColorStop(0,palettes[id][0]);g.addColorStop(1,palettes[id][1]);
    rect(c,g,-X,-Y,2*X,2*Y);
    const state=[timber,furrows,gate,stone,arena][id](c,X,Y,t,p,bass,treble);
    c.fillStyle='#ffe8c1';c.textAlign='center';c.font='bold 0.15px Georgia';c.fillText('XI  /  STRENGTH',0,-Y*.82);
    c.restore();return {scene:forms[id][0],...state};
  }
  return {forms,recipes,draw};
})();
