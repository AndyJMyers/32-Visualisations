window.WheelOfFortune = (() => {
  const forms = [['habitat','Habitat Light'],['docks','Docking Choreography'],['machine','Machine Night']];
  const recipes = forms.map(([form,name])=>({name,form,theme:0,speed:1,size:1,count:8,grasp:.4,smiles:1,insanity:.6}));
  const palettes = [
    ['#03091b','#1b3956','#385970','#84e0eb','#ffe1a1'],
    ['#0d0818','#3c2947','#715044','#ffb96f','#b6e7ff'],
    ['#030c1a','#252d60','#51367d','#a991ff','#81fff0'],
  ];
  const tau=Math.PI*2;
  const designs=[
    {sectors:144,spokes:6,inner:.76,depth:.078,near:.405},
    {sectors:72,spokes:4,inner:.948,depth:.041,near:.32},
    {sectors:156,spokes:9,inner:.897,depth:.046,near:.449},
  ];
  const cap=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=cap(x);return x*x*(3-2*x);};
  const mix=(a,b,t)=>a+(b-a)*t;
  const frac=x=>x-Math.floor(x);
  const stars=Array.from({length:244},(_,i)=>[frac(Math.sin(i*12.9898)*43758.546),frac(Math.sin(i*48.233+1)*27478.861),frac(i*.618034)]);
  const polar=(a,r,z=0)=>[Math.cos(a)*r,Math.sin(a)*r,z];
  function oval(c,color,x,y,rx,ry){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fillStyle=color;c.fill();
  }
  function polygon(c,color,points,edge,width=1){
    c.beginPath();c.moveTo(points[0].x,points[0].y);
    for(let i=1;i<points.length;i++) c.lineTo(points[i].x,points[i].y);
    if(color){c.closePath();c.fillStyle=color;c.fill();}
    if(edge){c.strokeStyle=edge;c.lineWidth=width;c.stroke();}
  }
  function apartment(c,w,h,phase,bass){
    const u=Math.min(w,h), away=ease((phase-3)/9), returnHome=ease((phase-36)/4);
    const scale=mix(1,.035,away*(1-returnHome));
    const opacity=1-ease((phase-8)/4)*(1-returnHome);
    if(opacity<=0)return;
    c.save();c.globalAlpha=opacity;c.translate(w*.5,h*.515);c.scale(u*scale,u*scale);
    function pane(color,x,y,width,height){
      c.fillStyle=color;c.fillRect(x,y,width,height);
    }
    for(let row=-8;row<=8;row++)for(let col=-12;col<=12;col++){
      const x=col*.82,y=row*.62;
      pane('#26374d',x-.41,y-.31,.82,.62);
      pane(col===0&&row===0?'#ffdaa0':(row+col)%3?'#b69065':'#142138',x-.34,y-.23,.68,.46);
      pane('#51617b',x-.36,y+.232,.72,.02);
    }
    pane('#5c4552',-.34,.102,.68,.127);
    pane('#f6a75d',.15,-.126,.095,.108);
    oval(c,'#734e54',-.095,-.032,.033,.045);
    oval(c,'#61444e',-.088,.061,.062,.068);
    pane('#35354b',.029,.045,.096,.009+bass*.013);
    pane('#26374d',-.017,-.23,.034,.46);
    c.restore();
  }
  function draw(c,w,h,time,{form,bass=0,mid=0,treble=0}={}){
    const cast=Math.max(0,forms.findIndex(([id])=>id===form)),p=palettes[cast];
    const [dark,metal,panel,signal,light]=p,t=Math.max(0,time/1000),phase=t%40;
    const {sectors,spokes,inner,depth:thickness,near:closeSize}=designs[cast];
    const near=cast===0?1-ease((phase-8)/15)*(1-ease((phase-35)/5)):
      ease((phase-.5)/(cast===1?20:25))*(1-ease((phase-31)/9));
    const reveal=cast===0?.96:ease((phase-(cast===1?4:1))/ (cast===1?16:22))*(1-ease((phase-29)/11));
    const elevation=cast===2?mix(-.23,1.53,reveal):mix(.025,1.52,reveal);
    const radius=Math.min(w,h)*mix(cast===0?.225:.085,closeSize,near);
    const spin=t*.113, yaw=-.20+reveal*.25, cy=h*.515,cx=w*.50, unit=Math.min(w,h);
    const sin=Math.sin(elevation),cos=Math.cos(elevation), rollX=Math.cos(yaw),rollY=Math.sin(yaw);
    function project([x,y,z]){
      const depth=y*cos+z*sin, yy=y*sin-z*cos, q=1/(1-depth*.22);
      return {x:cx+radius*q*(x*rollX-yy*rollY),y:cy+radius*q*(x*rollY+yy*rollX),depth};
    }
    c.save();
    c.fillStyle=dark;c.fillRect(0,0,w,h);
    const nebula=c.createRadialGradient(w*.73,h*.34,0,w*.73,h*.34,Math.max(w,h)*.65);
    nebula.addColorStop(0,metal+'8c');nebula.addColorStop(.46,panel+'29');nebula.addColorStop(1,dark+'00');
    c.fillStyle=nebula;c.fillRect(0,0,w,h);
    for(const [x,y,seed] of stars){
      const r=.35+seed**4*unit*.0032;
      c.globalAlpha=.35+.32*seed+.23*Math.sin(seed*81+t*.68)**2;
      oval(c,seed>.84?light:'#aabbd3',frac(x+near*.037*seed)*w,y*h,r,r);
    }
    c.globalAlpha=1;

    const surfaces=[];
    function face(points,color,edge,paint){
      const projected=points.map(project);
      surfaces.push({points:projected,depth:projected.reduce((sum,v)=>sum+v.depth,0)/projected.length,color,edge,paint});
    }
    for(let i=0;i<sectors;i++){
      const a=i*tau/sectors+spin,b=a+tau/sectors;
      const shimmer=.5+.5*Math.sin(i*.32-t*2.2);
      face([polar(a,1.065,-thickness),polar(b,1.065,-thickness),polar(b,1.065,thickness),polar(a,1.065,thickness)],i%6?metal:panel,dark,()=>{
        if(Math.sin((a+b)/2)<.12 && i%2===0)return;
        for(let k=0;k<3;k++){
          const pos=project(polar(mix(a,b,.22+k*.26),1.066,.012));
          oval(c,k%2?signal:light,pos.x,pos.y,.32+near*.55,.34+near*.44);
        }
      });
      face([polar(a,inner,thickness),polar(a,1.065,thickness),polar(b,1.065,thickness),polar(b,inner,thickness)],
        i%12===0?signal+'a0':i%3===0?panel:metal,dark,()=>{
          for(let row=0;row<3;row++) for(let j=0;j<3;j++){
            const on=cast===2?shimmer>.52-row*.11:frac(i*.41+row*.23+j*.17)>.22;
            if(!on) continue;
            const v=project(polar(mix(a,b,.18+j*.31),mix(inner,1.065,.19+row*.29),thickness+.002));
            const r=Math.max(.38,radius*(.0024+treble*.0017));
            oval(c,(i+j)%4===0?light:signal+'ba',v.x,v.y,r,r*(.52+sin*.48));
          }
        });
      if(i%(cast===1?9:6)===0){
        const end=a+tau/sectors*(cast===1?1.45:.82);
        const outer=cast===1?1.33:1.09;
        face([polar(a,inner-.025,thickness+.008),polar(a,outer,thickness+.008),
          polar(end,outer,thickness+.008),polar(end,inner-.025,thickness+.008)],panel,signal+'85');
      }
    }
    if(cast===2)for(let ring=0;ring<2;ring++)for(let i=0;i<90;i++){
      const a=i*tau/90+spin*(ring? .66:-1.21), b=a+tau/90, r=ring?.68:.46, z=ring?-.052:.084;
      face([polar(a,r-.025,z),polar(a,r+.025,z),polar(b,r+.025,z),polar(b,r-.025,z)],
        i%5?panel:signal,panel,()=>{
          if(frac(i*.074-t*.62+ring*.22)>.31+bass*.22)return;
          const p=project(polar((a+b)*.5,r,z+.003));oval(c,light,p.x,p.y,.65+treble,.55+treble);
        });
    }
    for(let i=0;i<spokes;i++){
      const a=i*tau/spokes+spin, tip=inner+.022;
      face([polar(a-.21,.118,.02),polar(a-.032,tip,.025),polar(a+.032,tip,.025),polar(a+.21,.118,.021)],panel,signal+'73',()=>{
        for(let j=0;j<16;j++){
          const r=.16+j*.039;
          const chase=cast!==2||frac(j*.12-t*.68+i*.08)<.37+bass*.23;
          if(chase){
            const pos=project(polar(a,r,.033));
            oval(c,j%3?signal+'c0':light,pos.x,pos.y,.40+near*.59,.37+near*.58);
          }
        }
      });
    }
    surfaces.sort((a,b)=>a.depth-b.depth);
    for(const surface of surfaces){
      polygon(c,surface.color,surface.points,surface.edge,Math.max(.42,radius*.003));
      surface.paint?.();
    }
    const hub=project([0,0,.09]), ringHeight=Math.max(.018,sin);
    oval(c,dark,hub.x,hub.y,radius*.162,radius*(.055+.106*ringHeight));
    oval(c,panel,hub.x,hub.y,radius*.137,radius*(.041+.085*ringHeight));
    oval(c,signal,hub.x,hub.y,radius*.065,radius*.04*(.45+ringHeight)+bass*radius*.006);
    oval(c,light,hub.x,hub.y,radius*.022,radius*.018);

    const traffic=cast===1?16:cast===0?8:4;
    for(let i=0;i<traffic;i++){
      const travel=frac(i*.618+t*(.042+i%4*.007)), a=i*2.399+spin*.55+travel*.78;
      const r=mix(1.5,.22,ease(travel)), z=.16+Math.sin(i*3)*.115;
      const ship=project(polar(a,r,z)), wake=project(polar(a-.035,r+.051,z));
      c.globalAlpha=Math.sin(travel*Math.PI)*(.74+bass*.24);
      polygon(c,null,[wake,ship],signal,Math.max(.65,radius*.005));
      oval(c,light,ship.x,ship.y,Math.max(1,radius*.006),Math.max(.7,radius*.0037));
    }
    c.globalAlpha=1;
    if(cast===0)apartment(c,w,h,phase,bass);
    c.fillStyle=light;c.textAlign='center';c.font=`bold ${Math.max(12,unit*.033)}px Georgia`;
    c.fillText('X  /  WHEEL OF FORTUNE',w*.5,h*.085);
    c.restore();
    return {scene:forms[cast][0],elevation,radius,traffic,habitatSectors:sectors,spokes,rings:cast===2?3:1,
      view:cast===0&&phase<8?'window':cast===0?'pullback':'approach'};
  }
  return {forms,recipes,draw};
})();
