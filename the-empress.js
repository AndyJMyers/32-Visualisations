window.TheEmpress = (() => {
  const forms = [['dawn', 'The Golden Terrace'], ['grove', 'The Cypress Oracle'], ['storm', 'Aegean Tempest']];
  const recipes = forms.map(([form, name]) => ({ name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6 }));
  const palettes = [
    ['#35213f','#f6a877','#fff0bc','#502f58','#ffcd65','#fff0df'],
    ['#080e2d','#435680','#ccecff','#162946','#ffd375','#cbdafa'],
    ['#20112e','#925979','#ffd1da','#2c244d','#ffcd64','#fbcbd8'],
  ];
  const tau = Math.PI * 2;
  const release = 3.4, impact = 3.86;
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => { const x = clamp(n); return x*x*(3-2*x); };
  const wrap = (x, span) => ((x % span) + span) % span;
  function stroke(c, color, width, path) {
    c.beginPath(); path(c); c.strokeStyle = color; c.lineWidth = width; c.stroke();
  }
  function fill(c, color, path) {
    c.beginPath(); path(c); c.closePath(); c.fillStyle = color; c.fill();
  }
  function oval(c, color, x, y, rx, ry) {
    fill(c,color,p => p.ellipse(x,y,rx,ry,0,0,tau));
  }
  function landscape(c, cast, p, X, Y, t, bass, mid, treble) {
    const [sky, horizon, sun, rock] = p;
    const g = c.createLinearGradient(0,-Y*.5,0,Y*.5);
    g.addColorStop(0,sky); g.addColorStop(1,horizon);
    c.fillStyle=g; c.fillRect(-X,-Y*.5,2*X,Y);
    const sx = X*.52, sy = -Y*.22;
    oval(c,sun+'32',sx,sy,.52+bass*.17,.52+bass*.17);
    oval(c,sun,sx,sy,.36,.36);
    if(cast === 1) oval(c,sky,sx+.14,sy-.13,.33,.33);
    for(let j=0;j<3;j++) fill(c,rock+['66','a0','dc'][j],q=>{
      q.moveTo(-X,Y*.5);
      for(let i=0;i<=28;i++) q.lineTo(-X+2*X*i/28,.14+j*.23+Math.sin(i*.65+j+t*(.16+j*.22))*(.12+mid*.16));
      q.lineTo(X,Y*.5);
    });
    if(cast === 0) {
      for(const side of [-1,1]) {
        const x=wrap(side*X*.76 + X + .25 - t*.15,2*X+.5)-X-.25;
        c.fillStyle='#d89986'; c.fillRect(x-.12,-1.15,.24,2.22);
        c.fillStyle=sun; c.fillRect(x-.17,-1.23,.34,.1);
        c.fillRect(x-.14,1.04,.28,.08);
        for(let i=0;i<4;i++) c.fillRect(x-.09+i*.052,-1.09,.017,2.08);
      }
      for(let i=0;i<4;i++) {
        c.fillStyle=i%2?'#b47478':'#da9d8b'; c.fillRect(-X,1.07+i*.11,2*X,.115);
      }
    } else if(cast === 1) {
      for(let i=0;i<11;i++) {
        const x=wrap(i*(2*X+.7)/11-t*.23,2*X+.7)-X-.35, top=-.52-.63*Math.sin(i*4.17)**2;
        fill(c,i%2?'#142642':'#233955',q=>{
          q.moveTo(x-.14,1.21);q.quadraticCurveTo(x-.32,.4,x,top);
          q.quadraticCurveTo(x+.27,.4,x+.14,1.21);
        });
      }
      for(let i=0;i<27;i++) {
        const x=Math.sin(i*8.23)*X*.94;
        const y=Math.sin(i*2.27+t*.86)*.69+.19;
        oval(c,sun+'ad',x,y,.012+treble*.024,.018);
      }
    } else {
      for(let i=0;i<17;i++) {
        const y=.24+i*.064;
        stroke(c,sun+'61',.012+bass*.019,q=>{
          q.moveTo(-X,y);
          for(let k=0;k<=32;k++) q.lineTo(-X+X*k/16,y+Math.sin(k*.61+i-t*3)*(.06+mid*.08));
        });
      }
      fill(c,rock,q=>{q.moveTo(-X,Y*.5);q.lineTo(-X,1.12);q.lineTo(-.42,.99);q.lineTo(.64,1.14);q.lineTo(.82,Y*.5);});
    }
  }
  function quarryPose(X,t,phase,cast) {
    const elapsed = Math.min(phase,impact), clock = t-phase+elapsed;
    const dash=smooth((elapsed-3.04)/.9);
    return { x:Math.min(X-.36,Math.min(X-.48,X*.53+.38)+dash*Math.min(.32,X*.2))+Math.sin(clock*2.1)*.025,
      y:1-Math.abs(Math.sin(clock*8.4))*(.028+.048*dash), gait:clock*8.4, height:[.03,.21,.075][cast] };
  }
  function heart(c,color,x,y,s) {
    fill(c,color,q=>{
      q.moveTo(x,y+s*.65);q.bezierCurveTo(x-1.6*s,y-.4*s,x-.62*s,y-1.23*s,x,y-.46*s);
      q.bezierCurveTo(x+.62*s,y-1.23*s,x+1.6*s,y-.4*s,x,y+s*.65);
    });
  }
  function quarry(c,p,pose,phase,cast,bass) {
    const {x,y,gait}=pose, fall=smooth((phase-impact)/.55);
    c.save(); c.translate(x,y); c.rotate(fall*.79);
    c.globalAlpha=1-smooth((phase-impact-.56)/.87);
    const coat=['#765369','#a77d87','#82627a'][cast];
    if(cast===0) {
    oval(c,p[3],-.045,0,.108,.064);
    oval(c,p[3],.038,-.045,.053,.047);
    stroke(c,p[3],.034,q=>{
      q.moveTo(.021,-.066);q.lineTo(-.011,-.161);
      q.moveTo(.048,-.068);q.lineTo(.052,-.159);
      q.moveTo(-.075,.029);q.lineTo(-.115-Math.sin(gait)*.05,.083);
      q.moveTo(.025,.029);q.lineTo(.07+Math.sin(gait)*.04,.075);
    });
    oval(c,p[2],.057,-.051,.012,.012);
    oval(c,p[2]+'8c',-.147,-.025,.023,.023);
    } else {
      const deer=cast===1, body=deer?.135:.105, headX=deer?.19:.233;
      oval(c,coat,-.03,-body,.21,deer?.095:.11);
      stroke(c,coat,deer?.055:.084,q=>{q.moveTo(.105,-body);q.lineTo(headX,-body-(deer?.17:.023));});
      const hy=-body-(deer?.17:.023);
      oval(c,coat,headX,hy,deer?.078:.102,deer?.045:.054);
      for(let i=0;i<4;i++) stroke(c,coat,deer?.024:.037,q=>{
        const xx=(i-1.5)*.091, swing=Math.sin(gait+i*2.3)*.067*(1-fall);
        q.moveTo(xx,-body*.72);q.lineTo(xx+swing,.024);
      });
      if(deer) {
        for(const side of [-1,1]) stroke(c,p[4],.014,q=>{
          q.moveTo(headX-.027,hy-.023);q.lineTo(headX+side*.047,hy-.13);
          q.lineTo(headX+side*.026,hy-.188);
          q.moveTo(headX+side*.042,hy-.12);q.lineTo(headX+side*.081,hy-.16);
        });
      } else {
        oval(c,p[3],headX+.076,hy+.022,.043,.026);
        stroke(c,p[2],.015,q=>{q.moveTo(headX+.08,hy+.046);q.quadraticCurveTo(headX+.123,hy+.042,headX+.12,hy-.012);});
        for(let i=0;i<5;i++) stroke(c,p[3],.018,q=>{q.moveTo(-.17+i*.052,-.17);q.lineTo(-.2+i*.051,-.231);});
      }
      oval(c,p[2],headX+.029,hy-.012,.012,.01);
    }
    c.restore();
    const after=phase-impact;
    if(after>=0 && after<2.2) {
      c.save();
      for(let i=0;i<22;i++) {
        const age=after-i*.024;
        if(age<0 || age>1.65) continue;
        c.globalAlpha=(1-age/1.65)*.94;
        const xx=x+Math.sin(i*4.7+age*1.6)*age*(.07+i*.021);
        const yy=y-pose.height-age*(.29+i%6*.087);
        const size=.02+i%5*.008+bass*.017;
        if(cast===0) heart(c,i%2?'#ffe2ad':'#ff9eb3',xx,yy,size);
        else if(cast===1) {
          stroke(c,p[2],.012,q=>{q.moveTo(xx-size,yy);q.lineTo(xx+size,yy);q.moveTo(xx,yy-size);q.lineTo(xx,yy+size);});
        } else oval(c,i%2?p[4]:p[2],xx,yy,size,size*.65);
      }
      c.restore();
    }
  }
  function companions(c,p,X,t,figureX) {
    const x=Math.cos(t*.7)*Math.min(X*.76,2.5), y=-.87+Math.sin(t*.71)*.24;
    const wing=.08+Math.sin(t*8)*.15;
    c.save(); c.translate(x,y); c.scale(Math.sin(t*.7)>0?-1:1,1);
    fill(c,p[3],q=>{
      q.moveTo(-.21,.037);q.lineTo(.14,-.032);q.lineTo(.23,-.011);q.lineTo(.17,.032);
      q.lineTo(.04,.066);q.lineTo(-.205,.107);
    });
    for(const side of [-1,1]) fill(c,side<0?p[3]:p[4]+'ba',q=>{
      q.moveTo(.03,.015);q.lineTo(-.075,side*(.14+wing));q.lineTo(-.236,side*(.21+wing));q.lineTo(-.11,.049);
    });
    oval(c,p[2],.162,-.016,.013,.01);c.restore();
    const lx=Math.max(-X+.24,figureX-.68), ly=1.03, gait=t*6.9;
    c.save();c.translate(lx,ly);
    oval(c,'#aa7d64',0,-.085,.18,.077);oval(c,'#c79a73',.137,-.137,.072,.063);
    for(let i=0;i<4;i++) stroke(c,'#c79a73',.027,q=>{
      const xx=(i-1.5)*.08;q.moveTo(xx,-.059);q.lineTo(xx+Math.sin(gait+i*2.25)*.055,.03);
    });
    stroke(c,'#6f494e',.022,q=>{q.moveTo(.092,-.165);q.lineTo(.086,-.235);q.moveTo(.152,-.177);q.lineTo(.164,-.237);q.moveTo(-.16,-.085);q.lineTo(-.226,-.067);});
    for(let i=0;i<5;i++) oval(c,'#6f494e',-.1+i*.05,-.09+Math.sin(i)*.023,.012,.009);
    oval(c,p[2],.17,-.146,.011,.009);c.restore();
  }
  function figure(c,p,t,bass,mid,cast,phase,target) {
    const [, , light, dark, gold, silk] = p;
    const skin='#efb38d';
    c.save();
    const plant=smooth((phase-2.15)/.8)*(1-smooth((phase-3.64)/.55));
    const gait=t*4.25, step=1-plant;
    const bob=(1-Math.cos(gait*2))*.019*step;
    const fx=-.44+.14*Math.sin(phase*tau/7-.95), fy=.07-bob;
    const angle=.046*step+Math.sin(gait)*.016*step;
    c.translate(fx,fy); c.rotate(angle);
    const gust=Math.sin(t*2.1)*(.11+mid*.25)-.12*step;
    for(const side of [-1,1]) {
      const stride=side*Math.sin(gait)*.21*step;
      const lift=Math.max(0,side*Math.cos(gait))*.087*step;
      stroke(c,side<0?'#bd7c70':skin,.088,q=>{
        q.moveTo(side*.065,.51);q.lineTo(side*.085+stride*.63,.82-lift*.48);
        q.lineTo(side*.083+stride,1.035-lift+bob);
      });
      stroke(c,gold,.039,q=>{
        q.moveTo(side*.083+stride,1.035-lift+bob);q.lineTo(side*.083+stride+.13,1.043-lift+bob);
      });
    }
    for(let i=0;i<11;i++) {
      const dx=(i-5)*.046;
      stroke(c,i%3?gold:'#9d572e',.049,q=>{
        q.moveTo(.02+dx,-.9);q.bezierCurveTo(-.47+dx,-.99,-.24+dx,-.53,-.48+dx+gust,-.48+i*.019);
        q.quadraticCurveTo(-.66+dx+gust,-.42+i*.026,-.53+dx+gust,-.34+i*.024);
      });
    }
    fill(c,skin,q=>{
      q.moveTo(-.1,-.71);q.quadraticCurveTo(-.11,-.93,.11,-.85);
      q.lineTo(.18,-.73);q.lineTo(.232,-.685);q.lineTo(.177,-.654);
      q.quadraticCurveTo(.17,-.56,.069,-.571);q.lineTo(.052,-.43);q.lineTo(-.08,-.45);
    });
    stroke(c,dark,.014,q=>{q.moveTo(.123,-.731);q.lineTo(.16,-.722);});
    stroke(c,light,.022,q=>{q.moveTo(-.111,-.823);q.quadraticCurveTo(.017,-.904,.156,-.818);});
    fill(c,silk,q=>{
      q.moveTo(-.135,-.49);q.lineTo(.102,-.42);q.quadraticCurveTo(.193,-.24,.105,-.052);
      q.bezierCurveTo(.12,.18,.38,.65,.46,.96);
      q.quadraticCurveTo(.02,1.11,-.51+gust,.98);
      q.quadraticCurveTo(-.16,.47,-.174,.02);q.quadraticCurveTo(-.29,-.26,-.135,-.49);
    });
    for(let i=0;i<8;i++) stroke(c,i%2?gold+'79':light,.013,q=>{
      const x=(i-3)*.084;
      q.moveTo(x*.28,-.19);q.bezierCurveTo(x*.3,.12,x*.91+gust*.62,.65,x+gust,1.0);
    });
    stroke(c,gold,.041,q=>{q.moveTo(-.186,-.08);q.quadraticCurveTo(-.02,.012,.105,-.058);});
    fill(c,silk+'78',q=>{
      q.moveTo(-.12,-.49);q.bezierCurveTo(-.49,-.43,-.65+gust,.08,-1.13+gust,.42);
      q.quadraticCurveTo(-.62,.52,-.27,.1);
    });
    const draw=smooth((phase-1.7)/1.55)*(1-smooth((phase-3.4)/.26));
    const y=-.18-plant*(cast===2?.34:cast===1?.2:.1)+Math.sin(gait)*.03*step;
    const grip=.79, nock=grip-.17-draw*.48;
    stroke(c,skin,.11,q=>{q.moveTo(.08,-.4);q.lineTo(.42,y+.08);q.lineTo(grip,y);});
    stroke(c,skin,.087,q=>{q.moveTo(-.097,-.4);q.lineTo(-.21,y+.19);q.lineTo(nock,y);});
    stroke(c,gold,.046,q=>{
      q.moveTo(grip-.14,y-.47);q.quadraticCurveTo(grip+.24,y-.24,grip,y);
      q.quadraticCurveTo(grip+.22,y+.24,grip-.14,y+.47);
    });
    stroke(c,light,.012,q=>{q.moveTo(grip-.14,y-.47);q.lineTo(nock,y);q.lineTo(grip-.14,y+.47);});
    for(let i=0;i<3;i++) stroke(c,gold,.021,q=>{q.moveTo(-.18+i*.05,-.25);q.lineTo(-.43+i*.055,-.74);});
    if(phase<release) {
      const dx=target.x-fx,dy=target.y-target.height-fy;
      const aim=Math.atan2(dy,dx)-angle;
      arrow(c,light,gold,nock+Math.cos(aim)*.76,y+Math.sin(aim)*.76,aim);
    }
    c.restore();
    return fx;
  }
  function arrow(c,light,gold,x,y,angle) {
    c.save();c.translate(x,y);c.rotate(angle);
    stroke(c,light,.023,q=>{q.moveTo(-.76,0);q.lineTo(-.08,0);});
    fill(c,gold,q=>{q.moveTo(0,0);q.lineTo(-.14,-.056);q.lineTo(-.14,.056);});
    c.restore();
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}) {
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)), p=palettes[cast], t=time/1000;
    const s=Math.min(w*.37,h*.33), X=w/(2*s), Y=h/s;
    c.save(); c.translate(w/2,h/2); c.scale(s,s); c.lineCap='round';
    const phase=t%7;
    landscape(c,cast,p,X,Y,t,bass,mid,treble);
    const target=quarryPose(X,t,phase,cast);
    quarry(c,p,target,phase,cast,bass);
    const fx=figure(c,p,t,bass,mid,cast,phase,target);
    companions(c,p,X,t,phase,fx);
    if(phase>=release && phase<impact+.12) {
      const goal=quarryPose(X,t-phase+impact,impact,cast);
      const progress=clamp((phase-release)/(impact-release));
      const fromX=-.44+.14*Math.sin(release*tau/7-.95)+.14;
      const fromY=.07-.18-(cast===2?.34:cast===1?.2:.1);
      const a=Math.atan2(goal.y-goal.height-fromY,goal.x-fromX);
      const launchX=fromX+Math.cos(a)*.76, launchY=fromY+Math.sin(a)*.76;
      arrow(c,p[2],p[4],launchX+(goal.x-launchX)*progress,launchY+(goal.y-goal.height-launchY)*progress,a);
    }
    c.fillStyle=p[2]; c.textAlign='center';
    c.font='bold 0.16px Georgia'; c.fillText('III  /  THE EMPRESS',0,-Y*.385);
    c.font='0.108px Georgia'; c.fillText(forms[cast][1],0,Y*.45);
    c.restore();
    return { scene:forms[cast][0], quarry:['hare','deer','boar'][cast], hit:phase>=impact };
  }
  return { forms, recipes, draw };
})();
