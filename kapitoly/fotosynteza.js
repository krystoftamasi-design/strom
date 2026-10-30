(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('diagram-canvas'), ctx = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { step: 0, biology: false, playing: !reducedMotion.matches, light: true, co2: true, reserve: .65, time: 0, speed: 1 };
  const chapters = [
    {
      kicker: '01 / ZACHYTIT SVĚTLO',
      title: ['Slunce nabíjí dílnu.', 'Světelné reakce'],
      body: ['Představ si zelené váčky jako solární nabíjecí stanici. Zachytí světlo a s jeho pomocí připraví ATP a NADPH pro sousední dílnu. Při tom se štěpí voda a uvolňuje kyslík.',
        'V membránách thylakoidů chlorofyl zachycuje světlo. Přenos elektronů a protonový gradient umožňují vznik ATP a NADPH. Elektrony dodává voda, jejímž štěpením se uvolňuje O₂.'],
      takeaway: 'Kyslík, který list uvolňuje, pochází z vody. CO₂ dodává uhlík pro tvorbu sacharidů.'
    },
    {
      kicker: '02 / DORUČIT ENERGII',
      title: ['Dvě zásilky. Dvě role.', 'ATP a NADPH'],
      body: ['Do cukerné dílny putují dva pomocníci: ATP jako nabitá energetická baterie a NADPH jako kurýr s elektrony. Dílna potřebuje oba. Žádný z nich nenahrazuje uhlíkové dílky z CO₂.',
        'ATP poskytuje energii pro reakce a NADPH dodává elektrony potřebné k redukci uhlíkatých sloučenin. Vznikají při světelných reakcích a spotřebovávají se v Calvinově cyklu ve stromatu.'],
      takeaway: 'Světlo dodává energii; CO₂ dodává uhlík. Energie a stavební materiál mají různé úlohy.'
    },
    {
      kicker: '03 / STAVĚT Z UHLÍKU',
      title: ['Ze vzduchu stavební dílek.', 'Calvinův cyklus'],
      body: ['Dílna zachytí uhlík z CO₂ a s pomocí ATP a NADPH sestaví malý tříuhlíkový dílek G3P. Z něj rostlina vytváří sacharidy. Většina rozpracovaného materiálu zůstává v cyklu, aby mohl pokračovat.',
        'Enzym Rubisco váže CO₂ na RuBP. Následuje redukce za spotřeby ATP a NADPH a obnova RuBP. Čistým výstupem při fixaci tří CO₂ je jeden G3P; spotřebuje se devět ATP a šest NADPH.'],
      takeaway: 'Přímým výstupem je G3P, ne hotová glukóza. Z G3P vznikají další sacharidy.'
    },
    {
      kicker: '04 / VRÁTIT A OBNOVIT',
      title: ['Obaly se vracejí.', 'Obnova přenašečů'],
      body: ['Po předání energie a elektronů se pomocníci vracejí jako ADP, fosfát a NADP⁺. Nabíjecí stanice je znovu připraví k práci. Díky tomuto koloběhu jsou obě části dílny propojené.',
        'Při využití ATP vznikají ADP a anorganický fosfát Pᵢ; oxidací NADPH vzniká NADP⁺. Světelné reakce je znovu využívají k tvorbě ATP a NADPH. Nejde o stejný cyklus jako obnova RuBP.'],
      takeaway: 'Přenašeče obíhají. Energie přichází se světlem a část se ukládá do organických látek.'
    }
  ];
  function renderChapter() {
    const c = chapters[state.step], variant = Number(state.biology);
    $('step-kicker').textContent = c.kicker;
    $('step-title').textContent = c.title[variant];
    $('step-body').textContent = c.body[variant];
    $('step-takeaway').textContent = c.takeaway;
    $('step-count').textContent = `0${state.step + 1} / 04`;
    $('next').textContent = state.step === 3 ? 'Zpět na začátek ↺' : 'Další krok ↗';
    document.querySelectorAll('[data-step]').forEach(el => {
      const selected = Number(el.dataset.step) === state.step;
      el.classList.toggle('active', selected);
      el.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-story]').forEach(el => el.textContent = state.biology ? el.dataset.biology : el.dataset.story);
    $('story-mode').setAttribute('aria-pressed', String(!state.biology));
    $('biology-mode').setAttribute('aria-pressed', String(state.biology));
  }
  document.querySelectorAll('[data-step]').forEach(el => el.addEventListener('click', () => {state.step = Number(el.dataset.step); renderChapter();}));
  $('next').addEventListener('click', () => {state.step = (state.step + 1) % 4; renderChapter();});
  for (const [id, biology] of [['story-mode', false], ['biology-mode', true]]) $(id).addEventListener('click', () => {state.biology = biology; renderChapter();});
  function playback() {
    $('play').textContent = state.playing ? 'Ⅱ Pozastavit' : '▶ Přehrát';
    $('play').setAttribute('aria-pressed', String(!state.playing));
  }
  $('play').addEventListener('click', () => {state.playing = !state.playing; playback(); updateStatus();});
  $('speed').addEventListener('input', e => {state.speed = Number(e.target.value); $('speed-value').textContent = `${state.speed.toLocaleString('cs')}×`;});
  for (const id of ['light', 'co2']) $(id).addEventListener('click', () => {state[id] = !state[id]; updateStatus();});
  $('reset').addEventListener('click', () => {
    Object.assign(state, {step:0, biology:false, playing:!reducedMotion.matches, light:true, co2:true, reserve:.65, time:0, speed:1});
    $('speed').value = 1; $('speed-value').textContent = '1×'; transportTime = 0; chargeTime = 0;
    renderChapter(); playback(); updateStatus();
  });
  function updateStatus() {
    for (const id of ['light', 'co2']) {
      $(id).setAttribute('aria-pressed', String(state[id]));
      $(`${id}-state`).textContent = state[id] ? 'zapnuto' : 'vypnuto';
    }
    $('reserve').value = state.reserve;
    $('reserve-label').textContent = state.reserve < .02 ? 'vyčerpaná' : state.reserve < .35 ? 'dochází' : 'dostupná';
    let text, label;
    if (!state.light && !state.co2) {text = 'Chybí světlo i CO₂. Nové zásoby se netvoří a uhlíková dílna stojí.'; label = 'Chybí oba vstupy';}
    else if (!state.co2) {text = 'Bez CO₂ chybí uhlíkový materiál. G3P nevzniká a ATP s NADPH se zatím hromadí; model nabíjení postupně utlumí.'; label = 'Dílna čeká na CO₂';}
    else if (!state.light && state.reserve > .02) {text = 'Světlo zhaslo. Dílna v tomto modelu ještě chvíli využívá zásobu ATP a NADPH. Sleduj, jak ubývá.'; label = 'Dobíhá ze zásob';}
    else if (!state.light) {text = 'Zásoba došla. Bez nových ATP a NADPH se zastaví i tvorba G3P. Rozsviť a obě části se znovu propojí.'; label = 'Čeká na energii';}
    else {text = 'Světlo dodává energii, CO₂ uhlík. Přenašeče obíhají mezi oběma částmi a z dílny odchází G3P.'; label = 'Dílna pracuje';}
    $('result').textContent !== text && ($('result').textContent = text);
    $('running-label').textContent = state.playing ? label : 'Animace pozastavena';
  }
  // A cached painted layer keeps the animated scene inexpensive.
  const W = 1040, H = 700;
  const background = document.createElement('canvas'); background.width = W * 2; background.height = H * 2;
  const paint = background.getContext('2d'); paint.scale(2, 2);
  const brush = new Image(); brush.src = './web_assets/water_brush.png';
  const bubble = new Image(); bubble.src = './web_assets/oxygen_bubble_1.png';
  let seed = 749;
  function random() {seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296;}
  function paintedPath(g, points, color, width, opacity = 1) {
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = color;
    for (let i=0;i<20;i++) {
      g.globalAlpha = opacity * (i === 0 ? .22 : .055);
      g.lineWidth = i === 0 ? width : .6 + random() * 2;
      const drift = (random() - .5) * width;
      g.beginPath();
      points.forEach(([x,y],j) => j ? g.lineTo(x + drift + (random()-.5)*3, y + drift*.5 + (random()-.5)*4) : g.moveTo(x+drift,y+drift*.5));
      g.stroke();
    }
    g.restore();
  }
  function curvePoints(fn, n=90) {return Array.from({length:n+1},(_,i)=>fn(i/n));}
  const paths = {
    energy: t => [320+350*t, 305-135*Math.sin(Math.PI*t)],
    returns: t => [680-350*t, 410+105*Math.sin(Math.PI*t)],
    water: t => [312-20*t, 100+145*t],
    oxygen: t => [265-7*t, 396+170*t],
    carbon: t => [790, 104+128*t],
    sugar: t => [808+12*Math.sin(t*Math.PI), 448+125*t],
    photon: t => [110+133*t, 108+155*t],
    cycle: t => [780+115*Math.cos(t*Math.PI*2-Math.PI/2), 330+123*Math.sin(t*Math.PI*2-Math.PI/2)]
  };
  function stamp(g, x,y,length,width,angle,color) {
    if (!brush.complete || !brush.naturalWidth) return;
    const stampCanvas = document.createElement('canvas'); stampCanvas.width=90; stampCanvas.height=400;
    const s=stampCanvas.getContext('2d');
    s.drawImage(brush,493,40,45,880,0,0,90,400); s.globalCompositeOperation='source-in'; s.fillStyle=color; s.fillRect(0,0,90,400);
    g.save();g.translate(x,y);g.rotate(angle);g.drawImage(stampCanvas,-width/2,-length/2,width,length);g.restore();
  }
  function arrow(g,fn,t,color) {
    const p=fn(t), before=fn(t-.015),angle=Math.atan2(p[1]-before[1],p[0]-before[0]);
    g.save();g.translate(...p);g.rotate(angle);g.fillStyle=color;g.beginPath();g.moveTo(6,0);g.lineTo(-8,-5);g.lineTo(-5,0);g.lineTo(-8,5);g.fill();g.restore();
  }
  function buildBackground() {
    seed = 749; paint.clearRect(0,0,W,H);
    const envelope=curvePoints(t=>{const a=t*Math.PI*2;return [526+463*Math.cos(a),350+210*Math.sin(a)*(1+.035*Math.cos(5*a))];},180);
    paint.beginPath();envelope.forEach(([x,y],i)=>i?paint.lineTo(x,y):paint.moveTo(x,y));paint.closePath();paint.fillStyle='#d3dfc9';paint.fill();
    paintedPath(paint,envelope,'#58714d',11,.9);
    paintedPath(paint,envelope.map(([x,y])=>[526+(x-526)*.974,350+(y-350)*.955]),'#6f8056',3,.8);
    for(let i=0;i<1100;i++){paint.fillStyle=`rgba(74,102,50,${random()*.05})`;const x=75+random()*905,y=145+random()*408;if(((x-526)/450)**2+((y-350)/205)**2<1)paint.fillRect(x,y,1+random()*5,1);}
    // Distant thylakoids establish the interior without competing with labels.
    for(const [x,y,angle] of [[140,395,.4],[410,440,-.2],[898,373,-.55]]) {
      for(let j=0;j<4;j++)stamp(paint,x,y+j*12,85,19,Math.PI/2+angle,'#9bad76');
    }
    // Main stack uses the same original brush alpha as the tree's water line.
    for(let i=0;i<7;i++){
      const y=257+i*22;
      paintedPath(paint,[[197,y+8],[315,y+4],[354,y-1]],'#4a6b3b',22,.8);
      stamp(paint,275,y,170,32,Math.PI/2-.045,i%2?'#87a758':'#a6bd72');
    }
    for(const [name,color,width] of [['energy','#b79639',14],['returns','#7c9471',10],['water','#5399a9',12],['oxygen','#5399a9',10],['carbon','#6d8465',11],['sugar','#a2a355',13],['photon','#cbab4e',15],['cycle','#bc9950',30]]) {
      paintedPath(paint,curvePoints(paths[name]),color,width);
      arrow(paint,paths[name],name==='cycle'?.34:.82,color);
      if(name==='cycle')arrow(paint,paths[name],.82,color);
    }
    for(let i=0;i<48;i++) {
      const t=i/48,p=paths.cycle(t), q=paths.cycle(t+.002);
      stamp(paint,p[0],p[1],22,23,Math.atan2(q[1]-p[1],q[0]-p[0])-Math.PI/2,'#bfa05c');
    }
  }
  brush.onload = buildBackground; buildBackground();
  function resize() {
    const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);
  }
  new ResizeObserver(resize).observe(canvas); resize();
  let last = 0, transportTime = 0, chargeTime = 0, statusTime = 0;
  function particle(fn,t,color,r=4,kind='dot') {
    const [x,y]=fn(((t%1)+1)%1);ctx.save();ctx.translate(x,y);
    if(kind==='oxygen' && bubble.complete && bubble.naturalWidth){ctx.drawImage(bubble,-14,-14,28,28);}
    else if(kind==='sugar'){ctx.rotate(t*2);ctx.fillStyle=color;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc((i-1)*7,0,5,0,Math.PI*2);ctx.fill();}}
    else{ctx.fillStyle=color;ctx.globalAlpha=.17;ctx.beginPath();ctx.arc(0,0,r*2.5,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
  function draw(now) {
    const dt = last ? Math.min((now-last)/1000,.06) * state.speed : 0; last = now;
    const running=state.co2 && state.reserve>.012;
    const charging=state.light && (state.reserve<.98 || running);
    if(state.playing && !document.hidden) {
      state.time+=dt;
      if(running)transportTime+=dt;
      if(charging)chargeTime+=dt;
      state.reserve=Math.max(0,Math.min(1,state.reserve+dt*((state.light?.16:0)-(running?.11:0))));
      if (!state.light && state.co2 && state.reserve < .012) state.reserve = 0;
    }
    ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.clearRect(0,0,W,H);ctx.drawImage(background,0,0,W,H);
    // Separate clocks stop the appropriate material streams when a resource is absent.
    if(state.light)for(let i=0;i<4;i++)particle(paths.photon,state.time*.24+i/4,'#d7ad37',5);
    if(charging){for(let i=0;i<3;i++)particle(paths.water,chargeTime*.13+i/3,'#4c94b1',5);for(let i=0;i<2;i++)particle(paths.oxygen,chargeTime*.10+i/2,'#60a4bd',6,'oxygen');}
    if(running) {
      for(let i=0;i<5;i++) {
        particle(paths.energy,transportTime*.105+i/5,i%2?'#8eaa57':'#c49c32',i%2?4:5);
        particle(paths.returns,transportTime*.09+i/5,'#84977a',3);
      }
      for(let i=0;i<3;i++) {
        particle(paths.carbon,transportTime*.13+i/3,'#4b6552',5);
        particle(paths.cycle,transportTime*.065+i/3,'#8a743c',5);
      }
      for(let i=0;i<2;i++)particle(paths.sugar,transportTime*.075+i/2,'#8d9a3d',5,'sugar');
    }
    if(!state.light){ctx.fillStyle='#253d4210';ctx.fillRect(0,0,W,H);}
    if(now-statusTime>250){updateStatus();statusTime=now;}
    requestAnimationFrame(draw);
  }
  renderChapter(); playback(); updateStatus(); requestAnimationFrame(draw);
})();
