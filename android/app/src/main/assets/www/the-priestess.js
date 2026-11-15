window.ThePriestess = (() => {
  const forms = [['cathedral', 'Cathedral of Circuits'], ['vault', 'The Lunar Vault'], ['pool', 'The Scrying Pool']];
  const recipes = forms.map(([form, name]) => ({ name, form, theme: 0, speed: 1, size: 1, count: 8, grasp: .4, smiles: 1, insanity: .6 }));
  const palettes = [
    ['#080a20', '#31194e', '#9c73ff', '#c9faff'],
    ['#080e18', '#243757', '#ffc985', '#fff4d6'],
    ['#041816', '#134c42', '#64ffbb', '#dafef0'],
  ];
  const tau = Math.PI * 2;
  function poly(c, color, points, stroke) {
    c.beginPath(); c.moveTo(...points[0]);
    points.slice(1).forEach(p => c.lineTo(...p));
    c.closePath(); c.fillStyle = color; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.stroke(); }
  }
  function oval(c, color, x, y, rx, ry, outline = false) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, tau);
    if (outline) { c.strokeStyle = color; c.stroke(); }
    else { c.fillStyle = color; c.fill(); }
  }
  function oracle(c, p, t, bass, treble, gesture) {
    const [ink, shade, neon, white] = p;
    c.save();
    c.translate(0, Math.sin(t * 1.1) * .035);
    c.lineWidth = .012;
    c.beginPath(); c.moveTo(.4, 1.01);
    c.bezierCurveTo(1.22, 1.05, 1.3, .24, .95 + Math.sin(t) * .12, .34);
    c.strokeStyle = shade; c.lineWidth = .14; c.stroke();
    c.strokeStyle = neon; c.lineWidth = .019; c.stroke();
    poly(c, shade, [[-.23,.15],[-.48,.37],[-.68,1.1],[.68,1.1],[.48,.37],[.23,.15]], neon);
    poly(c, ink, [[-.24,.25],[0,.72],[.27,.25],[.18,.94],[0,1.12],[-.18,.94]], neon);
    oval(c, neon, 0,.72,.053 + bass * .055,.053 + bass * .055, true);
    c.save();
    c.rotate(Math.sin(t * .85) * (.07 + bass * .05));
    poly(c, shade, [[-.48,-.38],[-.47,-.98],[-.14,-.59],[.14,-.59],[.47,-.98],[.48,-.38],
      [.43,-.09],[.22,.17],[0,.23],[-.22,.17],[-.43,-.09]], neon);
    for (const side of [-1,1]) {
      poly(c, ink, [[side*.42,-.83],[side*.36,-.49],[side*.23,-.56]], neon);
      poly(c, ink, [[side*.43,-.36],[side*.16,-.45],[side*.08,-.23],[side*.29,-.11],[side*.44,-.18]]);
      const eye = Math.cos(t * 1.35) > .987 ? .012 : .045 + treble * .055;
      oval(c, neon, side*.24,-.29,.115,eye);
      oval(c, ink, side*.24 + Math.sin(t*.78)*.036,-.29,.015,eye);
      for (let i = 0; i < 3; i++) {
        const y = -.04 + i * .065, x = side * (.69 + bass * .13);
        c.beginPath(); c.moveTo(side*.17,.045); c.lineTo(side*.46,y); c.lineTo(x,y-.035);
        c.strokeStyle = neon; c.stroke();
        oval(c, white, x,y-.035,.018,.018);
      }
    }
    poly(c, white, [[-.074,-.005],[.074,-.005],[0,.066]]);
    oval(c, white, 0,-.48,.052,.052,true);
    c.restore();
    if (gesture) {
      const [x,y] = gesture;
      poly(c, shade, [[.37,.43],[.48,.55],[x-.09,y+.08],[x+.09,y-.09],[x-.05,y-.19]], neon);
      oval(c, white, x,y,.047 + treble*.018,.04);
    }
    c.restore();
  }

  function draw(c, w, h, time, { form, bass = 0, mid = 0, treble = 0 } = {}) {
    const cast = Math.max(0, forms.findIndex(([id]) => id === form)), p = palettes[cast];
    const [ink, shade, neon, white] = p, t = time / 1000;
    const s = Math.min(h * .29, w * .36);
    c.save(); c.translate(w / 2,h * .48); c.scale(s,s);
    const X = w / (2*s), Y = h / s;
    const bg = c.createRadialGradient(0,0,.1,0,0,Math.max(X,Y*.6));
    bg.addColorStop(0,shade); bg.addColorStop(1,ink);
    c.fillStyle = bg; c.fillRect(-X,-Y*.48,X*2,Y);
    c.lineWidth = .018;
    if (cast === 0) {
      for (let i = 0; i < 7; i++) {
        const d = .7 + i * .18 + bass * .07;
        c.beginPath(); c.moveTo(-d,Y*.4); c.lineTo(-d,-.56);
        c.lineTo(0,-1.3-i*.062); c.lineTo(d,-.56); c.lineTo(d,Y*.4);
        c.strokeStyle = i % 2 ? neon + '55' : neon + '9a'; c.stroke();
        for (const side of [-1,1]) {
          const y = (t * (.36 + mid*.22) + i*.437) % 2.2 - .62;
          oval(c, white, side*d,y,.019 + treble*.022,.038);
        }
      }
      oracle(c,p,t,bass,treble);
    } else if (cast === 1) {
      const split = .04 + (.5 - .5 * Math.cos(t*.69)) * Math.min(1.19, X*.73) + bass*.12;
      oval(c, white, 0,-.15,.79,.79);
      oval(c, shade, .29,-.27,.71,.71);
      for (const side of [-1,1]) {
        const x = side * split;
        poly(c, ink, [[x,-1.15],[x+side*.57,-1.15],[x+side*.91,-.84],
          [x+side*.91,1.15],[x+side*.53,1.36],[x,1.36]], neon);
        for (let i = 0; i < 5; i++) {
          oval(c, neon, x+side*.42,-.79+i*.42,.044+mid*.024,.038,true);
        }
      }
      oracle(c,p,t,bass,treble,[.75,-.24 + Math.sin(t*.69)*.21]);
    } else {
      const touchX = .77 + Math.sin(t*1.18)*.12, touchY = .7 + Math.sin(t*2.3)*.05;
      oval(c, ink, .08,.94,Math.min(X*.94,2.7),.51);
      for (let i = 0; i < 8; i++) {
        const r = (t*(.53 + mid*.15) + i/8) % 1;
        oval(c, neon + '88', touchX*(1-r),.9,.06+r*Math.min(X*.93,2.48),.025+r*.43,true);
      }
      for (let i = 0; i < 30; i++) {
        const a = (t*.48 + i*.619) % 1;
        const x = Math.sin(i*4.82+t*.38)*Math.min(X*.87,1.85);
        c.fillStyle = neon + '99'; c.fillRect(x,.85-a*1.66,.015+treble*.025,.022+treble*.04);
      }
      oracle(c,p,t,bass,treble,[touchX,touchY]);
      oval(c, white, touchX,touchY+.04,.085+bass*.12,.03,true);
    }
    c.fillStyle = white; c.textAlign = 'center';
    c.font = 'bold .17px Georgia'; c.fillText('II  /  THE HIGH PRIESTESS',0,-Y*.37);
    c.font = '.112px Georgia'; c.fillText(forms[cast][1],0,Y*.43);
    c.restore();
    return { scene: forms[cast][0] };
  }
  return { forms, recipes, draw };
})();
