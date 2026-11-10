/* Pentacles: a monumental tiled torus against a flickering universe. */
window.Orbital = (() => {
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const smooth = x => { x = clamp(x, 0, 1); return x*x*(3-2*x); };
  const noise = n => { const x = Math.sin(n*91.27+18.7)*43758.54; return x-Math.floor(x); };
  const forms = ["garden", "midnight", "ocean", "machine"];
  const recipes = [
    { name: "Garden in the Sky", form: 0, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: 0 },
    { name: "Midnight Circumference", form: 1, theme: 1, speed: 1, size: 1, count: 8, grasp: .4, smiles: .55, insanity: .55 },
    { name: "Ocean Without End", form: 2, theme: 3, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .55 },
    { name: "Chrome Beyond the Frame", form: 3, theme: 4, speed: 1, size: 1, count: 8, grasp: .4, smiles: 0, insanity: 1 },
  ];
  const palettes = {
    garden: { sky: "#071d36", haze: "#608e9e", land: [84, 40, 32], sea: [195, 56, 31], light: "#ffdf9c", city: "#dad2ad", night: false },
    midnight: { sky: "#020615", haze: "#171c43", land: [165, 27, 12], sea: [224, 55, 17], light: "#b8dcff", city: "#64708c", night: true },
    ocean: { sky: "#061d31", haze: "#5a9b9a", land: [145, 40, 39], sea: [184, 67, 38], light: "#c2fff1", city: "#c9dbd4", night: false },
    machine: { sky: "#0d061d", haze: "#4a244f", land: [259, 27, 18], sea: [284, 66, 23], light: "#ffc46d", city: "#887b99", night: true },
  };
  let time=0,last=null,active=null,bass=0,mid=0,treble=0;
  function reset(){time=0;last=null;active=null;bass=mid=treble=0;}
  const color=(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`;
  function line(c,a,b,color,width=1){
    if(!a||!b)return;
    c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();
  }
  function sky(c,p){
    c.fillStyle="#02030c";c.fillRect(0,0,1000,600);
    c.save();
    const opacity=c.globalAlpha;
    for(let cloud=0;cloud<15;cloud++){
      const x=cloud*83-90,y=300+Math.sin(cloud*.48)*155;
      const g=c.createRadialGradient(x,y,0,x,y,150+noise(cloud)*100);
      const hue=(p.night?265:205)+Math.sin(cloud*.8)*55;
      g.addColorStop(0,color(hue,65,28,.12+Math.sin(time*.12+cloud)*.025));
      g.addColorStop(1,color(hue,70,15,0));
      c.fillStyle=g;c.fillRect(x-260,y-260,520,520);
    }
    for(let i=0;i<1250;i++){
      const x=noise(i)*1000,y=noise(i+400)*570;
      const pulse=.55+Math.sin(time*(.3+noise(i+70)*1.4)+i)*.28;
      c.globalAlpha=opacity*pulse;
      c.fillStyle=i%9===0?"#f5c9a1":i%7===0?"#b9a7ff":"#d3eaff";
      const size=i%61===0?1.8:i%5===0?1:.55;
      c.fillRect(x,y,size,size);
      if(i%61===0){
        c.globalAlpha=opacity*pulse*.22;
        c.fillRect(x-3,y+.5,7,.5);c.fillRect(x+.5,y-3,.5,7);
      }
    }
    c.restore();
  }
  const shapes=["composite torus","serpentine hose","interwoven knot","cable tangle"];
  const add=(a,b)=>a.map((n,i)=>n+b[i]);
  const scale=(v,s)=>v.map(n=>n*s);
  const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const unit=v=>scale(v,1/Math.max(1e-9,Math.hypot(...v)));
  function morphology(form){
    const position=time/30+forms.indexOf(form),index=Math.floor(position)%4;
    const blend=smooth((position%1-.35)/.65),weights=[0,0,0,0];
    weights[index]=1-blend;weights[(index+1)%4]=blend;
    return {index,blend,weights};
  }
  function centre(u,weights,strand){
    const coil=3*u+strand*TAU/3;
    const r=185+80*Math.cos(3*u);
    const paths=[
      [320*Math.cos(u),320*Math.sin(u),0],
      [(265+50*Math.cos(3*u))*Math.cos(u),205*Math.sin(u),100*Math.sin(2*u)],
      [r*Math.cos(2*u),r*Math.sin(2*u),85*Math.sin(3*u)],
      [(245+62*Math.cos(coil))*Math.cos(u),(210+62*Math.cos(coil))*Math.sin(u),75*Math.sin(coil)],
    ];
    return paths.reduce((v,path,i)=>add(v,scale(path,weights[i])),[0,0,0]);
  }
  function theatre(){
    const cycle=time%96;
    const reveal=smooth((cycle-36)/15)*(1-smooth((cycle-79)/17));
    const beat=(time%7)/7,attacker=Math.floor(time/7)%2;
    const windup=smooth((beat-.12)/.18)*(1-smooth((beat-.32)/.1));
    const strike=smooth((beat-.32)/.085)*(1-smooth((beat-.46)/.19));
    const impact=smooth((beat-.40)/.025)*(1-smooth((beat-.44)/.12));
    return {reveal,attacker,windup,strike,impact,flick:Math.floor(time/7)%3===2};
  }
  function socialEvent(t){
    const turn=Math.floor(t/9),p=(t%9)/9;
    const [actor,target]=[[0,1],[1,2],[2,1],[1,0]][turn%4];
    const kind=['nudge','kiss','flick'][turn%3];
    const approach=smooth((p-.18)/.18)*(1-smooth((p-.57)/.19));
    const contact=smooth((p-.37)/.04)*(1-smooth((p-.47)/.06));
    const reaction=smooth((p-.41)/.06)*(1-smooth((p-.9)/.1));
    const recover=smooth((p-.71)/.12)*(1-smooth((p-.94)/.06));
    const expressions=[0,1,2].map(figure=>figure===actor?
      (kind==='kiss'&&approach>.4?'pucker':approach>.1?'cheeky':recover>.1?'smug':'relaxed'):
      figure===target?(reaction>.02?(p<.62?'startled':recover>.15?'amused':kind==='kiss'?'blushing':'annoyed'):'relaxed'):
      reaction>.2?'amused':'watchful');
    return {actor,target,kind,approach,contact,reaction,recover,expressions};
  }
  function exterior(c,p,form,morph,width,gordian=false){
    const drama=theatre(),reveal=gordian?1:drama.reveal;
    const social=socialEvent(time);
    const metal=form==="machine",framing=gordian?1.12:metal?1.12:1,centreX=gordian?500:metal?650-150*reveal:500;
    const spin=time*.018,tilt=.52+Math.sin(time*.014)*.065;
    const cameraDistance=gordian?1120+150*Math.cos(time*.13):(1200+270*Math.cos(time*.055))*(1+reveal*1.1),focalLength=1120;
    const lift=Math.sqrt(1-tilt*tilt),roll=-.22+Math.sin(time*.008)*.035;
    const turn=v=>[v[0]*Math.cos(spin)-v[1]*Math.sin(spin),v[0]*Math.sin(spin)+v[1]*Math.cos(spin),v[2]];
    const project=v=>{
      const [x,y,z]=turn(v);
      const depth=y*lift-z*tilt,scale=focalLength/(cameraDistance+depth);
      const sy=(y*tilt+z*lift)*scale,sx=x*scale;
      return {x:centreX+(sx*Math.cos(roll)-sy*Math.sin(roll))*framing,y:300+(sx*Math.sin(roll)+sy*Math.cos(roll))*framing,depth,scene:[x,y,z]};
    };
    const faces=[],{weights}=morph,eyes=[],androidHeads=[];
    const strands=weights[3]>.002?3:1;
    const entities=[];
    for(let rival=0;rival<2;rival++){
      const side=rival?1:-1,attacks=rival===drama.attacker;
      const lunge=attacks?drama.strike*62-drama.windup*20:-drama.impact*24;
      const origin=[side*(220-lunge),attacks?0:Math.sin(time*29)*drama.impact*13,100];
      eyes.push({origin,side,attacks});
      entities.push({rival,side,origin,radiusScale:.57,strands,segments:width<700?96:144,lanes:16,
        path:(u,strand)=>add(origin,scale(centre(u,weights,strand),.57))});
      // A long flexible arm winds up, sweeps at its neighbour, then curls dismissively away.
      const reach=drama.strike*(attacks?1:0),curl=drama.windup*(attacks?1:0);
      const tip=[origin[0]-side*(165+reach*145),-55-reach*20+curl*120,135+reach*25];
      entities.push({rival,side,origin,radius:10,strands:1,segments:36,lanes:12,open:true,
        path:u=>{
          const t=u/TAU;
          return [origin[0]+(tip[0]-origin[0])*t,
            45+(tip[1]-45)*t+Math.sin(t*Math.PI)*(60-curl*160),
            100+(tip[2]-100)*t+Math.sin(t*Math.PI)*30];
        }});
      for(let finger=0;finger<3;finger++)entities.push({rival,side,radius:4,strands:1,segments:14,lanes:8,open:true,
        path:u=>{
          const t=u/TAU,fan=(finger-1)*(drama.flick?15:10);
          return [tip[0]-side*t*(24+finger*7),tip[1]+fan*t+Math.sin(t*Math.PI)*(drama.flick?-25:9),tip[2]+t*9];
        }});
    }
    if(!gordian&&reveal>.002)for(let tendril=0;tendril<9;tendril++){
      const phase=tendril*2.399;
      entities.push({rival:tendril%2,radius:(17+tendril%3*5)*reveal,strands:1,segments:96,lanes:12,
        path:u=>{
          const r=310+70*Math.sin(u*3+phase+time*.035);
          return [Math.cos(u*2+phase)*r*reveal,
            (150+Math.sin(u*3+phase)*(195+tendril*11))*reveal,
            (-70+Math.cos(u*3+phase)*85)*reveal];
        }});
    }
    if(!gordian&&reveal>.002)for(const eye of eyes)entities.push({rival:eye.side>0?1:0,radius:13*reveal,strands:1,segments:32,lanes:12,open:true,
      path:u=>{
        const t=u/TAU;
        return [eye.origin[0]*(1-t)+Math.sin(t*Math.PI)*eye.side*50,
          eye.origin[1]*(1-t)+t*230,100*(1-t)-t*50];
      }});
    if(gordian){
      entities.length=0;eyes.length=0;
      for(let tendril=0;tendril<5;tendril++){
        const phase=tendril*2.399;
        entities.push({rival:tendril%2,radius:18+tendril%3*5,strands:1,segments:112,lanes:12,
          path:u=>{
            const wave=time*.24+phase,twist=time*.10;
            const r=235+65*Math.sin(u*3+wave)+bass*9*Math.sin(u*5-time);
            return [Math.cos(u*2+phase+twist)*r,
              Math.sin(u*3+phase-twist*.7)*(195+48*Math.cos(u*2-wave)),
              110*Math.cos(u*3+phase+time*.19)+55*Math.sin(u*2-time*.16)];
          }});
      }
      for(let figure=0;figure<3;figure++){
        const phase=figure*2.1;
        const head=[(figure-1)*165+Math.sin(time*.32+phase)*22,-120+Math.sin(time*.28+phase)*26,140];
        const direction=Math.sign(social.target-social.actor);
        if(figure===social.actor){
          head[0]+=direction*social.approach*(social.kind==='kiss'?112:96);
          head[1]-=social.approach*12;
        }else if(figure===social.target){
          head[0]+=direction*(social.reaction*17-social.approach*(social.kind==='kiss'?13:0));
          head[1]+=social.contact*9+Math.sin(time*23)*social.contact*4;
        }
        androidHeads.push({head,phase,figure});
        entities.push({rival:figure%2,radius:19,strands:1,segments:96,lanes:14,open:true,metal:true,
          radiusAt:t=>.7+.75*Math.exp(-(((t-.91)/.055)**2))+.48*Math.exp(-(((t-.72)/.065)**2)),
          path:u=>{
            const t=u/TAU,envelope=1-t;
            return [head[0]+envelope*135*Math.sin(t*TAU*2.5+time*.36+phase),
              head[1]+envelope*365+envelope*30*Math.sin(t*TAU*3-time*.4+phase),
              head[2]+envelope*105*Math.sin(t*TAU*2+time*.29+phase)];
          }});
      }
      if(social.kind==='flick'&&social.approach>.02){
        const from=androidHeads[social.actor].head,to=androidHeads[social.target].head;
        entities.push({rival:social.actor%2,radius:4*social.approach,strands:1,segments:32,lanes:8,open:true,metal:true,
          radiusAt:t=>1-t*.85,
          path:u=>{
            const t=u/TAU,reach=social.approach;
            return [from[0]+(to[0]-from[0])*t*reach,
              from[1]+60*(1-t)-23*t+Math.sin(t*Math.PI)*(35-75*social.contact),
              from[2]+(to[2]-from[2])*t+8];
          }});
      }
    }
    for(const entity of entities){
    const {segments,lanes}=entity;
    // Parallel-transport frames avoid a hose twisting abruptly when its tangent turns vertical.
    for(let strand=0;strand<entity.strands;strand++){
      const radius=entity.radius??(strand?14*weights[3]:64*weights[0]+36*weights[1]+24*weights[2]+14*weights[3])*entity.radiusScale;
      const frames=[];
      let previous;
      for(let i=0;i<=segments;i++){
        const u=i/segments*TAU,point=entity.path(u,strand);
        const tangent=unit(add(entity.path(u+.001,strand),scale(entity.path(u-.001,strand),-1)));
        const normal=previous?unit(add(previous,scale(tangent,-dot(previous,tangent)))):unit(cross(tangent,[0,0,1]));
        frames.push({point,tangent,normal});previous=normal;
      }
      const first=frames[0],lastFrame=frames[segments];
      const correction=entity.open?0:Math.atan2(dot(cross(lastFrame.normal,first.normal),first.tangent),dot(lastFrame.normal,first.normal));
      for(let i=0;i<=segments;i++){
        const f=frames[i],angle=correction*i/segments;
        f.normal=add(scale(f.normal,Math.cos(angle)),scale(cross(f.tangent,f.normal),Math.sin(angle)));
        f.binormal=unit(cross(f.tangent,f.normal));
        const u=i/segments*TAU;
        const muscle=Math.sin(u*3-time*1.15-strand*.8);
        const crest=Math.pow(Math.max(0,muscle),5);
        // Slow breathing beneath the tiles, with a muscular wave travelling down each strand.
        const breathing=Math.sin(time*.72-strand*.6)*.022;
        const profile=entity.radiusAt?entity.radiusAt(i/segments):1;
        const localRadius=radius*profile*(1+breathing+crest*(.055+bass*.075)-Math.max(0,-muscle)*.025);
        f.vertices=Array.from({length:lanes},(_,j)=>{
          const b=j/lanes*TAU,n=add(scale(f.normal,Math.cos(b)),scale(f.binormal,Math.sin(b)));
          return {point:project(add(f.point,scale(n,localRadius))),normal:turn(n)};
        });
      }
      for(let i=0;i<segments;i++)for(let j=0;j<lanes;j++){
      const world=i/segments*TAU,b=j/lanes*TAU,next=(j+1)%lanes;
      const vertex=frames[i].vertices[j],n=vertex.normal;
      const normal=n[1]*lift-n[2]*tilt+dot(n,vertex.point.scene)/cameraDistance;
      if(normal>.12)continue;
      const pts=[vertex.point,frames[i+1].vertices[j].point,frames[i+1].vertices[next].point,frames[i].vertices[next].point];
      const seed=noise(i*37+j*191+strand*519+entity.rival*971);
      const wave=Math.pow(Math.max(0,Math.sin(world*3-time*1.15-strand*.8)),5);
      const sparkle=Math.pow(Math.max(0,Math.sin(time*(.5+seed)+seed*91)),22);
      const facing=clamp(-normal,0,1),shine=Math.pow(facing,10);
      const hue=form==="garden"?155+Math.sin(world*5+b)*75:
        form==="midnight"?255+Math.sin(world*3-b)*55:
        form==="ocean"?185+Math.sin(world*4+b*2)*32:35+strand*25+Math.sin(world*5-b)*23;
      const light=12+facing*18+seed*12+shine*21+wave*(9+bass*15)+sparkle*(7+treble*14);
      const depth=pts.reduce((n,q)=>n+q.depth,0)/4;
      const distance=smooth((cameraDistance+depth-650)/1150);
      // An artistic spectral distance cue: warm nearby facets recede into cool radiation haze.
      const hueDelta=target=>((target-hue+540)%360)-180;
      const spectralHue=hue+hueDelta(250)*distance*.6+hueDelta(35)*(1-distance)*.16+entity.rival*52;
      const reflection=Math.pow(1-Math.abs(Math.sin(Math.atan2(n[2],n[0])*2.8+n[1]*1.7+time*.07)),9);
      const brass=j%12===0;
      const metalLight=clamp(9+facing*19+reflection*65+shine*18+seed*5+wave*(4+bass*5),7,96);
      faces.push({pts,depth,distance,
        fill:metal||entity.metal?color(brass?42:212+distance*20,brass?36:8,metalLight*(1-distance*.12)):
          color(spectralHue,50*(1-distance*.3),light*(1-distance*.3)),glint:seed>.94&&sparkle>.55});
      }
    }
    }
    faces.sort((a,b)=>b.depth-a.depth);
    for(const face of faces){
      c.beginPath();face.pts.forEach((q,i)=>i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y));c.closePath();
      c.fillStyle=face.fill;c.fill();
      c.strokeStyle=color(235,30,8,.53-face.distance*.25);c.lineWidth=.32;c.stroke();
      // Each enormous tile contains a second finer mosaic, shrinking towards the horizon.
      c.beginPath();
      for(let k=1;k<3;k++){
        const t=k/3,a=face.pts[0],b=face.pts[1],d=face.pts[3],e=face.pts[2];
        c.moveTo(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t);c.lineTo(d.x+(e.x-d.x)*t,d.y+(e.y-d.y)*t);
        c.moveTo(a.x+(d.x-a.x)*t,a.y+(d.y-a.y)*t);c.lineTo(b.x+(e.x-b.x)*t,b.y+(e.y-b.y)*t);
      }
      c.strokeStyle=color(205,45,80,.19-face.distance*.1);c.lineWidth=.35;c.stroke();
      if(face.glint){
        const q=face.pts[0];line(c,{x:q.x-2,y:q.y},{x:q.x+2,y:q.y},face.distance>.5?"#bbbfff":p.light,.6);
      }
    }
    for(const eye of eyes){
      const q=project(eye.origin),size=focalLength/(cameraDistance+q.depth)*framing;
      c.save();c.translate(q.x,q.y);c.scale(size,size);
      const look=(1-reveal)*(eye.attacks?-eye.side*9:eye.side*12);
      c.fillStyle=metal?"#d9e5ed":"#dcecff";
      c.beginPath();c.ellipse(0,0,24,20,0,0,TAU);c.fill();
      c.fillStyle=eye.side<0?"#388ba5":"#a975b5";
      c.beginPath();c.arc(look,2,13,0,TAU);c.fill();
      c.fillStyle="#030917";c.beginPath();c.arc(look,2,7,0,TAU);c.fill();
      c.fillStyle="#ffffff";c.fillRect(look-4,-4,3,3);
      line(c,{x:-29,y:-28-eye.side*6*(1-reveal)},{x:29,y:-28+eye.side*6*(1-reveal)},p.light,5);
      c.restore();
    }
    for(const {head,phase,figure} of androidHeads){
      const q=project(head),size=focalLength/(cameraDistance+q.depth)*framing;
      const expression=social.expressions[figure];
      const other=androidHeads[figure===social.actor?social.target:social.actor];
      const gaze=clamp((project(other.head).x-q.x)/80,-1,1)*2.3;
      const roll=Math.sin(time*.32+phase)*.06+(figure===social.target?social.contact*.15:0);
      c.save();c.translate(q.x,q.y);c.scale(size*1.1,size*1.1);c.rotate(roll);
      const chrome=c.createLinearGradient(-20,0,20,0);
      chrome.addColorStop(0,'#354451');chrome.addColorStop(.25,'#c1d0d7');chrome.addColorStop(.48,'#f3f5ed');chrome.addColorStop(.6,'#5b6d7a');chrome.addColorStop(1,'#c1c9d1');
      c.fillStyle=chrome;c.beginPath();c.ellipse(0,-23,17,25,0,0,TAU);c.fill();
      // Swept metallic hair, lashes and lips keep the serpentine figures recognisably android women.
      c.fillStyle='#a6afb9';c.beginPath();c.moveTo(-19,-16);c.bezierCurveTo(-28,-63,30,-69,22,-12);
      c.bezierCurveTo(18,-32,8,-36,4,-43);c.bezierCurveTo(-1,-31,-13,-28,-19,-16);c.fill();
      line(c,{x:-17,y:-43},{x:9,y:-52},'#f3dc9d',1.4);
      const blink=expression==='startled'?0:Math.pow(Math.max(0,Math.sin(time*1.1+phase)),28);
      const eyeHeight=expression==='startled'?3.9:expression==='annoyed'?1:expression==='blushing'?1.2:2;
      c.fillStyle='#10232e';
      for(const side of [-1,1]){
        const wink=expression==='cheeky'&&side===1?.85:0;
        c.beginPath();c.ellipse(side*7,-25,4,Math.max(.45,eyeHeight*(1-Math.max(blink,wink))),0,0,TAU);c.fill();
        line(c,{x:side*10,y:-27},{x:side*14,y:-30},'#15222d',1.2);
        if(!wink){c.fillStyle='#a2efff';c.fillRect(side*7-1+gaze,-26,1.5,1.5);c.fillStyle='#10232e';}
        const browY=expression==='startled'?-37:expression==='annoyed'?-31:-33;
        line(c,{x:side*12,y:browY-2},{x:side*3,y:browY+(expression==='annoyed'?4:0)},'#354654',1.5);
      }
      if(expression==='startled'||expression==='pucker'){
        c.fillStyle=expression==='pucker'?'#c44c85':'#342335';c.beginPath();
        c.ellipse(expression==='pucker'?gaze:0,-10,expression==='pucker'?3:4,expression==='pucker'?2.5:5,0,0,TAU);c.fill();
      }else{
        c.beginPath();c.moveTo(-7,-11);
        c.quadraticCurveTo(0,expression==='annoyed'?-18:expression==='amused'?-1:-7,8,expression==='smug'?-16:-12);
        c.strokeStyle='#bf598b';c.lineWidth=2.4;c.stroke();
      }
      if(expression==='blushing'||expression==='amused'){
        c.save();c.globalAlpha=expression==='blushing'?.6:.25;c.fillStyle='#ee789e';
        for(const side of [-1,1]){c.beginPath();c.ellipse(side*11,-17,4,2.8,0,0,TAU);c.fill();}c.restore();
      }
      line(c,{x:0,y:-23},{x:2,y:-16},'#677985',1);
      c.fillStyle='#abedff';c.beginPath();c.arc(-17,-16,2+bass,0,TAU);c.fill();
      c.restore();
    }
    if(gordian&&social.contact>.01){
      const target=androidHeads[social.target].head;
      const markerSide=Math.sign(social.target-social.actor);
      const q=project(add(target,[markerSide*45,-65,20]));
      c.save();c.globalAlpha=social.contact;c.translate(q.x,q.y);
      if(social.kind==='kiss'){
        c.fillStyle='#f39cc3';c.beginPath();c.moveTo(0,9);
        c.bezierCurveTo(-23,-5,-10,-23,0,-10);c.bezierCurveTo(10,-23,23,-5,0,9);c.fill();
      }else for(let i=0;i<5;i++){
        const a=i*TAU/5;line(c,{x:Math.cos(a)*12,y:Math.sin(a)*12},{x:Math.cos(a)*23,y:Math.sin(a)*23},p.light,1.5);
      }c.restore();
    }
    if(drama.impact>.01&&reveal<.8){
      const target=eyes[1-drama.attacker],q=project(add(target.origin,[-target.side*120,-65,40]));
      c.save();c.globalAlpha=drama.impact*(1-reveal);
      for(let ray=0;ray<8;ray++){
        const a=ray*TAU/8+time*.1;
        line(c,{x:q.x+Math.cos(a)*12,y:q.y+Math.sin(a)*12},
          {x:q.x+Math.cos(a)*35,y:q.y+Math.sin(a)*35},p.light,2);
      }c.restore();
    }
    return cameraDistance;
  }
  function draw(c,width,height,now,opts={}){
    const form=typeof opts.form==="number"?forms[opts.form%4]:forms.includes(opts.form)?opts.form:"garden";
    if(active!==form){reset();active=form;}
    const animate=opts.animate!==false,dt=!animate||last===null?0:clamp((now-last)/1000,0,.08);
    last=animate?now:null;
    const ease=1-Math.exp(-dt*4);
    bass+=(clamp(Number(opts.bass)||0,0,1)-bass)*ease;
    mid+=(clamp(Number(opts.mid)||0,0,1)-mid)*ease;
    treble+=(clamp(Number(opts.treble)||0,0,1)-treble)*ease;
    time+=dt*clamp(Number(opts.speed)||1,.2,3)*(1+bass*.08);
    const p=palettes[form];
    const morph=morphology(form);
    c.save();c.scale(width/1000,height/600);
    sky(c,p);
    const cameraDistance=exterior(c,p,form,morph,width,opts.gordian===true);
    const vignette=c.createRadialGradient(500,300,240,500,300,650);
    vignette.addColorStop(0,"#00000000");vignette.addColorStop(1,"#01061770");
    c.fillStyle=vignette;c.fillRect(0,0,1000,600);c.restore();
    const drama=theatre();
    return {time,form,phase:opts.gordian?'writhing Gordian knot':shapes[morph.index],morphBlend:morph.blend,strands:opts.gordian?8:morph.weights[3]>.002?3:1,bass,rotation:time*.018,distanceKm:time*.012*180000,cameraDistance,reveal:drama.reveal,attacker:drama.attacker,impact:drama.impact,interaction:opts.gordian?socialEvent(time):null};
  }
  return {recipes,draw,reset};
})();
