window.TheChariot = (() => {
  const forms = [['coast', 'Sails in the Mist'], ['run', 'The Ridge Run'], ['muster', 'Fires on the Ridge']];
  const recipes = forms.map(([form,name]) => ({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const tau=Math.PI*2, gold='#edba78';
  const wrap=(x,n)=>((x%n)+n)%n;
  const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  function line(c,color,width,points) {
    c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p));
    if(width){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
    else{c.closePath();c.fillStyle=color;c.fill();}
  }
  function oval(c,color,x,y,rx,ry,angle=0){
    c.beginPath();c.ellipse(x,y,rx,ry,angle,0,tau);c.fillStyle=color;c.fill();
  }
  function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(x,y,w,h);}
  function hills(c,X,Y,t,y,amp,color){
    const points=[[-X,Y]];
    for(let i=0;i<=48;i++){
      const x=-X+i*X/24;
      points.push([x,y+amp*(Math.sin(x*1.8+t)+.32*Math.sin(x*4+t*1.34))]);
    }
    points.push([X,Y]);line(c,color,0,points);
  }
  function person(c,x,y,s,cloak,t,driver){
    c.save();c.translate(x,y);c.scale(s,s);
    line(c,cloak,0,[[-.15,-.48],[.13,-.44],[.22,-.04],[-.28+Math.sin(t*3)*.055,-.04]]);
    oval(c,'#d5a781',.022,-.56,.092,.112);
    line(c,'#392533',0,[[-.08,-.52],[-.091,-.62],[.037,-.682],[.127,-.604],[.023,-.604]]);
    if(driver)line(c,'#d5a781',.042,[[.08,-.42],[.20,-.33],[.32,-.335]]);
    else{
      oval(c,'#72544b',.1,-.205,.144,.154,.22);
      oval(c,gold,.13,-.218,.041,.046);
    }
    c.restore();
  }
  function horse(c,x,y,gait,coat,stride){
    c.save();c.translate(x,y+Math.cos(gait*2)*.022*stride);
    line(c,'#362530',.044,[[-.25,-.37],[-.39,-.29+Math.sin(gait)*.05],[-.48,-.25]]);
    for(let i=0;i<4;i++){
      const a=gait+i*1.71, hx=i<2?-.167:.16;
      const step=Math.sin(a)*.135*stride, lift=Math.max(0,Math.cos(a))*.11*stride;
      line(c,i%2?coat:'#493032',.044,[[hx,-.32],[hx+step*.49,-.15-lift*.43],[hx+step,0-lift]]);
      line(c,'#2c2530',.033,[[hx+step,-lift],[hx+step+.042,-lift]]);
    }
    oval(c,coat,0,-.348,.28,.109);
    line(c,coat,.103,[[.168,-.365],[.234,-.53],[.29,-.577]]);
    line(c,'#382933',.038,[[.157,-.39],[.184,-.55],[.253,-.62]]);
    oval(c,coat,.315,-.556,.092,.051,.42);
    line(c,coat,.036,[[.267,-.585],[.263,-.657]]);
    oval(c,'#f4c58e',.307,-.571,.012,.01);
    line(c,'#dc995e',.018,[[.24,-.5],[.29,-.53],[.366,-.535]]);
    c.restore();
  }
  function chariot(c,x,y,s,t,bass,run){
    c.save();c.translate(x,y);c.scale(s,s);
    const gait=t*(run?12:6), stride=run?1:.43, bounce=Math.sin(gait*2)*.021*stride;
    horse(c,.64,-.055,gait+1.1,'#675064',stride);
    horse(c,.78,0,gait,'#ad765a',stride);
    line(c,'#9e734f',.038,[[-.42,-.24+bounce],[.82,-.36]]);
    line(c,gold,.012,[[-.43,-.55+bounce],[.34,-.48],[1.09,-.534]]);
    person(c,-.73,-.25+bounce,.91,'#377479',t,false);
    person(c,-.45,-.28+bounce,.83,'#aa5747',t,true);
    line(c,'#57333b',0,[[-.93,-.47+bounce],[-.34,-.45+bounce],[-.40,-.16+bounce],[-.85,-.14+bounce]]);
    line(c,gold,.029,[[-.91,-.452+bounce],[-.39,-.432+bounce]]);
    const wheel=-.64, r=.202;
    oval(c,'#413140',wheel,-r,r,r);
    c.beginPath();c.arc(wheel,-r,r,0,tau);c.strokeStyle=gold;c.lineWidth=.029;c.stroke();
    for(let i=0;i<8;i++){
      const a=t*(run?11:4)+i*tau/8;
      line(c,gold,.014,[[wheel,-r],[wheel+Math.cos(a)*r,-r+Math.sin(a)*r]]);
    }
    oval(c,'#fff0b2',wheel,-r,.037+bass*.012,.037+bass*.012);
    c.restore();
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}){
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)),t=Math.max(0,time/1000),p=t%18;
    const s=Math.min(h*.4,w*.43),X=w/(2*s),Y=h/(2*s);
    const colors=[['#30394e','#c69987'],['#273e58','#e4a86c'],['#15152d','#69505e']][cast];
    c.save();c.translate(w/2,h/2);c.scale(s,s);c.lineCap='round';
    const sky=c.createLinearGradient(0,-Y,0,Y);
    sky.addColorStop(0,colors[0]);sky.addColorStop(1,colors[1]);rect(c,sky,-X,-Y,2*X,2*Y);
    const floor=Math.min(.64,Y*.55);
    let state;
    if(cast===0){
      rect(c,'#627b88',-X,-.24,2*X,Y+.24);
      const sails=Math.min(5,Math.floor(p/2.2));
      for(let i=0;i<5;i++){
        const q=ease((p-i*2.2)/4), x=X*(.86-i*.31)-q*.26, y=-.19+i*.034+Math.sin(t+i)*.017;
        c.save();c.globalAlpha=q*.87;
        line(c,'#41374c',0,[[x-.16,y],[x+.18,y],[x+.09,y+.042],[x-.1,y+.042]]);
        line(c,'#e4ccb0',0,[[x-.081,y-.022],[x-.068,y-.191],[x+.085,y-.167],[x+.109,y-.026]]);
        c.restore();
      }
      for(let i=0;i<18;i++){
        const x=Math.sin(i*5.1+t*.3)*X, y=-.075+i*.033;
        line(c,'#ddd6bf65',.008+treble*.012,[[x-.15-mid*.14,y],[x+.2,y]]);
      }
      const cliffY=x=>floor+.05*Math.sin(x*1.7)+.025*Math.sin(x*4.1);
      const ridge=Array.from({length:41},(_,i)=>{
        const x=-X+2*X*i/40;
        return [x,cliffY(x)];
      });
      line(c,'#393b47',0,[...ridge,[X,Y],[-X,Y]]);
      line(c,'#b6a08a',.022,ridge.map(([x,y])=>[x,y-.015]));
      const ride=ease((p-3.1)/12.9);
      const riderX=-X*.53+(X*1.53+.62)*ride;
      chariot(c,riderX,cliffY(riderX),.60,t*(p>3.1?1:.21),bass,p>3.1);
      person(c,-X*.68,.31,.55,'#8d514a',t*.4,false);
      state={sails,riderX};
    }else if(cast===1){
      hills(c,X,Y,t*.17,.04,.15,'#827775');
      hills(c,X,Y,t*.49,.25,.17,'#596457');
      line(c,'#403b40',0,[[-X,floor],[X,floor],[X,Y],[-X,Y]]);
      const speed=1+bass*.36;
      for(let i=0;i<36;i++){
        const x=wrap(i*.194-t*1.62,2*X)-X, y=floor+.09+(i%5)*.071;
        line(c,'#bd946783',.011,[[x,y],[x-.046*speed,y]]);
      }
      const x=Math.sin(t*.73)*Math.min(.21,X*.13), y=floor+Math.sin(t*7.9)*.015;
      chariot(c,x,y,.79,t,bass,true);
      for(let i=0;i<30;i++){
        const age=wrap(t*1.4+i*.143,1), dx=x-.49-age*.83;
        c.globalAlpha=(1-age)*(.34+bass*.27);
        oval(c,'#f4c599',dx,floor-age*.28+Math.sin(i*5.9)*.062,.009+(i%4)*.006,.007+treble*.012);
      }
      c.globalAlpha=1;
      state={running:true};
    }else{
      oval(c,'#e9cc9d',X*.69,-Y*.51,.21,.21);
      for(let i=0;i<35;i++)oval(c,'#f8e2b680',Math.sin(i*4.9)*X,Math.cos(i*9.7)*Y*.72,.005+treble*.008,.006);
      hills(c,X,Y,.14,.33,.11,'#3a3445');
      hills(c,X,Y,.23,floor,.053,'#292632');
      const beacons=Math.min(6,1+Math.floor(p/2.4));
      for(let i=0;i<6;i++){
        const x=(i/5-.5)*X*1.67,y=.34+Math.sin(x*1.8+.14)*.10;
        if(i<beacons){
          const r=.14+bass*.08,candle=c.createRadialGradient(x,y,0,x,y,r);
          candle.addColorStop(0,'#ffc976bc');candle.addColorStop(1,'#ff8e4b00');oval(c,candle,x,y,r,r);
          line(c,'#ffbe78',0,[[x-.033,y+.015],[x+Math.sin(t*8+i)*.021,y-.059-bass*.029],[x+.032,y+.015]]);
        }
      }
      chariot(c,Math.sin(p*tau/18)*Math.min(.38,X*.28),floor,.61,t*.54,bass,false);
      const d=Math.min(X*.77,.89);
      person(c,-d,floor-.035,.53,'#544858',t*.4,false);
      person(c,d,floor-.014,.53,'#4e7073',t*.6,false);
      state={beacons};
    }
    c.textAlign='center';c.fillStyle='#ffe5b4';
    c.font='bold 0.15px Georgia';c.fillText('VII  /  THE CHARIOT',0,-Y*.79);
    c.restore();
    return {scene:forms[cast][0],...state};
  }
  return {forms,recipes,draw};
})();
