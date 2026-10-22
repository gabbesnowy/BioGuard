(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ---------- Dados das espécies ---------- */
  const SPECIES = [
    {id:'galego', nome:'Macaco-prego-galego', sci:'Sapajus flavius', st:'EN', bioma:'Mata Atlântica',
     onde:'Fragmentos da Zona da Mata Norte e Sul', ameaca:'Perda de habitat, caça e tráfico',
     ia:'Armadilhas fotográficas com visão computacional', pts:[[-35.05,-7.85],[-35.25,-8.55]]},
    {id:'tartaruga', nome:'Tartaruga-de-pente', sci:'Eretmochelys imbricata', st:'CR', bioma:'Marinho',
     onde:'Praias de Ipojuca, litoral sul e Noronha', ameaca:'Ocupação de praias, luz artificial, pesca',
     ia:'Drones e IA para contar ninhos e rastros na areia', pts:[[-35.0,-8.45],['noronha']]},
    {id:'peixeboi', nome:'Peixe-boi-marinho', sci:'Trichechus manatus', st:'EN', bioma:'Marinho',
     onde:'Estuários do litoral norte, como Itamaracá', ameaca:'Assoreamento, colisão com barcos, redes',
     ia:'Drones e hidrofones com detecção automática', pts:[[-34.9,-7.72]]},
    {id:'mero', nome:'Mero', sci:'Epinephelus itajara', st:'CR', bioma:'Marinho',
     onde:'Recifes e naufrágios da costa', ameaca:'Pesca ilegal e destruição de manguezais',
     ia:'Vídeo subaquático e reconhecimento individual por manchas', pts:[[-34.86,-8.08]]},
    {id:'tatu', nome:'Tatu-bola', sci:'Tolypeutes tricinctus', st:'EN', bioma:'Caatinga',
     onde:'Sertão e Agreste', ameaca:'Caça e desmatamento da Caatinga',
     ia:'Armadilhas fotográficas e modelos de distribuição', pts:[[-38.6,-8.35],[-40.2,-8.7]]},
    {id:'choquinha', nome:'Choquinha-de-alagoas', sci:'Myrmotherula snowi', st:'CR', bioma:'Mata Atlântica',
     onde:'Matas de altitude da divisa com Alagoas', ameaca:'Fragmentação extrema da floresta',
     ia:'Gravadores com bioacústica para reconhecer o canto', pts:[[-35.85,-8.72]]},
    {id:'cabure', nome:'Caburé-de-pernambuco', sci:'Glaucidium mooreorum', st:'CR', bioma:'Mata Atlântica',
     onde:'Últimos registros no litoral sul', ameaca:'Sem registro confirmado há anos',
     ia:'Busca acústica contínua para confirmar se ainda existe', pts:[[-35.3,-8.65]]},
    {id:'maracaja', nome:'Gato-maracajá', sci:'Leopardus wiedii', st:'VU', bioma:'Mata Atlântica',
     onde:'Brejos de altitude e matas do Agreste', ameaca:'Atropelamento e perda de floresta',
     ia:'Reconhecimento individual pelo padrão de manchas', pts:[[-36.05,-8.3]]},
  ];
  const stColor = s => css(s==='CR'?'--cr':s==='EN'?'--en':'--vu');

  /* ---------- Mapa ---------- */
  const PE = [[-41.35,-7.95],[-40.7,-7.45],[-40.0,-7.6],[-39.3,-7.35],[-38.6,-7.55],[-38.0,-7.35],[-37.3,-7.5],[-36.6,-7.35],[-35.9,-7.4],[-35.3,-7.4],[-34.83,-7.55],
    [-34.85,-7.95],[-34.92,-8.3],[-35.05,-8.62],[-35.18,-8.9],[-35.6,-9.0],[-36.2,-8.98],[-36.9,-9.2],[-37.6,-9.25],[-38.1,-9.15],[-38.6,-9.05],[-39.2,-9.3],[-39.8,-9.05],[-40.4,-9.4],[-40.95,-9.2],[-41.05,-8.8],[-41.4,-8.45]];
  const P = (lon,lat) => [ (lon+41.6)*128 + 20, (-7.05-lat)*128 + 40 ];
  const NORONHA = [930, 80];
  const ptXY = p => p[0]==='noronha' ? NORONHA : P(p[0],p[1]);
  const svg = document.getElementById('map');
  const NS = 'http://www.w3.org/2000/svg';
  const el = (t,a={},parent=svg) => { const e=document.createElementNS(NS,t); for(const k in a) e.setAttribute(k,a[k]); parent.appendChild(e); return e; };
  let activeId = null;

  function drawMap(){
    svg.innerHTML='';
    const ink=css('--ink'), muted=css('--muted'), line=css('--line'), bg=css('--bg');
    // regiões (faixas de longitude aproximadas)
    const clip = el('clipPath',{id:'peclip'}, el('defs'));
    el('polygon',{points:PE.map(p=>P(...p).join(',')).join(' ')},clip);
    const g = el('g',{'clip-path':'url(#peclip)'});
    const bands = [
      {x0:-42,x1:-37.9,c:css('--caatinga'),o:.28,n:'SERTÃO'},
      {x0:-37.9,x1:-35.9,c:css('--caatinga'),o:.15,n:'AGRESTE'},
      {x0:-35.9,x1:-34,c:css('--mata'),o:.25,n:'ZONA DA MATA'},
    ];
    bands.forEach(b=>{ const [x0]=P(b.x0,-7), [x1]=P(b.x1,-7); el('rect',{x:x0,y:0,width:x1-x0,height:400,fill:b.c,'fill-opacity':b.o},g); });
    el('polygon',{points:PE.map(p=>P(...p).join(',')).join(' '),fill:'none',stroke:ink,'stroke-width':2,'stroke-linejoin':'round'});
    const lab = (x,y,t,extra={}) => { const e=el('text',{x,y,fill:muted,'font-family':'JetBrains Mono, monospace','font-size':13,'letter-spacing':2,...extra}); e.textContent=t; return e; };
    lab(P(-40.2,-7)[0],P(0,-9.75)[1],'SERTÃO');
    lab(P(-37.4,-7)[0],P(0,-9.62)[1],'AGRESTE');
    lab(P(-35.95,-7)[0],P(0,-7.18)[1],'ZONA DA MATA');
    // Recife
    const [rx,ry]=P(-34.9,-8.05);
    el('rect',{x:rx-4,y:ry-4,width:8,height:8,fill:ink});
    lab(rx+10,ry+22,'Recife',{fill:ink,'letter-spacing':0,'font-size':12});
    // Oceano
    lab(P(-34.7,-7)[0],P(0,-9.3)[1],'OCEANO',{transform:`rotate(-90 ${P(-34.55,-7)[0]} ${P(0,-9.3)[1]})`});
    // Noronha inset
    el('circle',{cx:NORONHA[0],cy:NORONHA[1],r:34,fill:'none',stroke:line,'stroke-dasharray':'4 4'});
    el('ellipse',{cx:NORONHA[0],cy:NORONHA[1],rx:12,ry:5,fill:css('--mata'),'fill-opacity':.5,stroke:ink});
    lab(NORONHA[0]-44,NORONHA[1]+52,'F. NORONHA',{'font-size':11,'letter-spacing':1});
    lab(NORONHA[0]-44,NORONHA[1]+66,'(fora de escala)',{'font-size':10,'letter-spacing':0});
    // pontos
    SPECIES.forEach(s=>{
      const dim = activeId && activeId!==s.id;
      s.pts.forEach(p=>{
        const [x,y]=ptXY(p);
        const c = el('circle',{cx:x,cy:y,r:activeId===s.id?10:7,fill:stColor(s.st),stroke:bg,'stroke-width':2,opacity:dim?.2:1,style:'cursor:pointer'});
        const t = el('title',{},c); t.textContent = `${s.nome} (${s.st})`;
        c.addEventListener('click',()=>setActive(s.id));
      });
    });
    pulses = el('g');
  }
  let pulses;
  function pulseAt(x,y){
    const c = el('circle',{cx:x,cy:y,r:8,fill:'none',stroke:css('--colete'),'stroke-width':2.5,class:reduce?'':'pulse'},pulses);
    const d = el('circle',{cx:x,cy:y,r:3,fill:css('--colete')},pulses);
    setTimeout(()=>{c.remove(); d.remove();}, reduce?1500:2400);
  }

  /* ---------- Feed simulado ---------- */
  const SENSORS = {galego:'Câmera',tartaruga:'Drone',peixeboi:'Hidrofone',mero:'Vídeo sub.',tatu:'Câmera',choquinha:'Gravador',cabure:'Gravador',maracaja:'Câmera'};
  const PLACES = {galego:['Igarassu','Sirinhaém','Goiana'],tartaruga:['Ipojuca','Tamandaré','Noronha'],peixeboi:['Itamaracá','Goiana'],mero:['Recife','Cabo de S. Agostinho'],tatu:['Serra Talhada','Petrolina','Floresta'],choquinha:['Jaqueira','Frei Caneca'],cabure:['Sirinhaém'],maracaja:['Bonito','Caruaru']};
  const feed = document.getElementById('feedList'), count = document.getElementById('count');
  let n = 0;
  const pad = v => String(v).padStart(2,'0');
  function addEvent(forceId){
    let s;
    if(forceId) s = SPECIES.find(x=>x.id===forceId);
    else { // o caburé aparece raramente — é uma busca
      const pool = SPECIES.filter(x=>x.id!=='cabure' || Math.random()<.08);
      s = pool[Math.floor(Math.random()*pool.length)];
    }
    if(activeId && !forceId && Math.random()<.6) s = SPECIES.find(x=>x.id===activeId);
    const conf = s.id==='cabure' ? 61+Math.floor(Math.random()*12) : 80+Math.floor(Math.random()*19);
    const place = PLACES[s.id][Math.floor(Math.random()*PLACES[s.id].length)];
    const d = new Date();
    const li = document.createElement('li');
    li.innerHTML = `<span>${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}</span>
      <span>${s.nome}<small>${SENSORS[s.id]} · ${place}${conf<75?' · enviar p/ revisão':''}</small></span>
      <span class="${conf<75?'low':'conf'}">${conf}%</span>`;
    feed.prepend(li);
    while(feed.children.length>7) feed.lastElementChild.remove();
    n++; count.textContent = `${n} eventos`;
    const p = s.pts[Math.floor(Math.random()*s.pts.length)];
    let [x,y] = ptXY(p);
    if(p[0]!=='noronha'){ x += (Math.random()-.5)*30; y += (Math.random()-.5)*24; }
    pulseAt(x,y);
  }

  /* ---------- Cartões de espécies ---------- */
  const grid = document.getElementById('speciesGrid');
  const LBL = {CR:'CR · Crit. em perigo',EN:'EN · Em perigo',VU:'VU · Vulnerável'};
  function renderCards(filter='todos'){
    grid.innerHTML='';
    SPECIES.filter(s=>filter==='todos'||s.bioma===filter).forEach(s=>{
      const b = document.createElement('button');
      b.className = 'sp' + (activeId===s.id?' on':'');
      b.setAttribute('aria-pressed', activeId===s.id);
      b.innerHTML = `<div class="top"><div><h3>${s.nome}</h3><div class="sci">${s.sci}</div></div><span class="badge b-${s.st}">${LBL[s.st]}</span></div>
        <dl><dt>Ambiente</dt><dd>${s.bioma==='Marinho'?'Litoral e mar':s.bioma}</dd><dt>Onde</dt><dd>${s.onde}</dd><dt>Ameaça</dt><dd>${s.ameaca}</dd></dl>
        <div class="ia"><b>Como a IA ajuda:</b> ${s.ia}</div>`;
      b.addEventListener('click',()=>{ setActive(s.id); document.getElementById('mapa').scrollIntoView({behavior:reduce?'auto':'smooth'}); });
      grid.appendChild(b);
    });
  }
  let currentFilter='todos';
  document.querySelectorAll('[data-f]').forEach(c=>c.addEventListener('click',()=>{
    document.querySelectorAll('[data-f]').forEach(x=>x.setAttribute('aria-pressed',x===c));
    currentFilter=c.dataset.f; renderCards(currentFilter);
  }));
  function setActive(id){
    activeId = activeId===id ? null : id;
    drawMap(); renderCards(currentFilter);
    if(activeId) addEvent(activeId);
  }

  /* ---------- Cenas de armadilha fotográfica (canvas) ---------- */
  function scene(cv, kind, t=0){
    const c = cv.getContext('2d'), W=cv.width, H=cv.height;
    const g = c.createRadialGradient(W*.5,H*.55,20,W*.5,H*.55,W*.75);
    g.addColorStop(0,'#5d6b63'); g.addColorStop(1,'#111614');
    c.fillStyle=g; c.fillRect(0,0,W,H);
    // vegetação de fundo
    let seed = 7; const rnd = () => (seed = (seed*9301+49297)%233280)/233280;
    c.strokeStyle='rgba(20,28,24,.75)';
    for(let i=0;i<26;i++){ const x=rnd()*W; c.lineWidth=4+rnd()*14; c.beginPath(); c.moveTo(x,H); c.quadraticCurveTo(x+(rnd()-.5)*80,H*.5,x+(rnd()-.5)*60,-10); c.stroke(); }
    c.fillStyle='rgba(170,185,175,.16)';
    for(let i=0;i<60;i++){ c.beginPath(); c.ellipse(rnd()*W,rnd()*H*.7,8+rnd()*20,3+rnd()*6,rnd()*3,0,7); c.fill(); }
    // chão
    c.fillStyle='#2b332e'; c.beginPath(); c.moveTo(0,H*.78); c.quadraticCurveTo(W*.5,H*.72,W,H*.8); c.lineTo(W,H); c.lineTo(0,H); c.fill();
    // animal (silhueta clara, como no infravermelho)
    c.fillStyle='#d7e1da'; c.strokeStyle='#d7e1da';
    const s=W/640;
    c.save(); c.translate(0,Math.sin(t/400)*1.5);
    if(kind==='macaco'){
      c.beginPath(); c.ellipse(330*s,300*s,48*s,62*s,-.2,0,7); c.fill();
      c.beginPath(); c.arc(300*s,225*s,30*s,0,7); c.fill();
      c.lineWidth=12*s; c.lineCap='round';
      c.beginPath(); c.moveTo(370*s,330*s); c.bezierCurveTo(450*s,360*s,470*s,260*s,420*s,240*s); c.stroke();
      c.beginPath(); c.moveTo(300*s,280*s); c.lineTo(260*s,340*s); c.stroke();
      c.beginPath(); c.moveTo(320*s,350*s); c.lineTo(305*s,372*s); c.moveTo(350*s,352*s); c.lineTo(360*s,372*s); c.stroke();
      c.fillStyle='#f4f7f5'; c.beginPath(); c.arc(292*s,220*s,4*s,0,7); c.arc(306*s,220*s,4*s,0,7); c.fill();
    } else if(kind==='tatu'){
      c.beginPath(); c.ellipse(330*s,350*s,70*s,42*s,0,Math.PI,0); c.fill();
      c.fillRect(262*s,348*s,136*s,12*s);
      c.beginPath(); c.moveTo(262*s,350*s); c.lineTo(232*s,360*s); c.lineTo(262*s,362*s); c.fill();
      c.strokeStyle='#8e9a93'; c.lineWidth=3*s;
      [300,330,360].forEach(x=>{c.beginPath(); c.moveTo(x*s,310*s); c.lineTo(x*s,350*s); c.stroke();});
    } else if(kind==='gato'){
      c.beginPath(); c.ellipse(320*s,320*s,80*s,32*s,0,0,7); c.fill();
      c.beginPath(); c.arc(235*s,295*s,26*s,0,7); c.fill();
      c.beginPath(); c.moveTo(218*s,276*s); c.lineTo(222*s,256*s); c.lineTo(234*s,272*s); c.moveTo(240*s,272*s); c.lineTo(252*s,256*s); c.lineTo(255*s,278*s); c.fill();
      c.lineWidth=12*s; c.lineCap='round';
      c.beginPath(); c.moveTo(398*s,318*s); c.bezierCurveTo(450*s,320*s,470*s,370*s,440*s,390*s); c.stroke();
      [260,290,350,380].forEach(x=>{c.beginPath(); c.moveTo(x*s,340*s); c.lineTo(x*s,375*s); c.stroke();});
      c.fillStyle='#6f7a74';
      for(let i=0;i<14;i++){ c.beginPath(); c.ellipse((260+rnd()*120)*s,(305+rnd()*30)*s,6*s,4*s,0,0,7); c.fill(); }
      c.fillStyle='#fff'; c.beginPath(); c.arc(228*s,292*s,4*s,0,7); c.arc(244*s,292*s,4*s,0,7); c.fill();
    }
    c.restore();
    // ruído do sensor
    const img = c.getImageData(0,0,W,H), d = img.data;
    for(let i=0;i<d.length;i+=4){ const v=(Math.random()-.5)*26; d[i]+=v; d[i+1]+=v; d[i+2]+=v; }
    c.putImageData(img,0,0);
    // carimbo
    c.fillStyle='rgba(0,0,0,.55)'; c.fillRect(0,H-26*s,W,26*s);
    c.fillStyle='#cfe3d6'; c.font=`${13*s}px JetBrains Mono, monospace`;
    c.fillText('IR  ·  BIOGUARD  ·  23°C  ·  BAT 78%', 12*s, H-8*s);
  }
  function box(cv,b,label){
    const c = cv.getContext('2d'), s=cv.width/640;
    c.strokeStyle=css('--colete')||'#D9561F'; c.lineWidth=3*s;
    c.strokeRect(b[0]*s,b[1]*s,b[2]*s,b[3]*s);
    c.font=`600 ${14*s}px JetBrains Mono, monospace`;
    const w=c.measureText(label).width+14*s;
    c.fillStyle=c.strokeStyle; c.fillRect(b[0]*s,(b[1]-24)*s,w,24*s);
    c.fillStyle='#fff'; c.fillText(label,(b[0]+7)*s,(b[1]-7)*s);
  }

  // hero: cena animada com caixa de detecção
  const hero = document.getElementById('heroCanvas');
  const heroClock = document.getElementById('heroClock');
  let hs = 9;
  function heroFrame(t){ scene(hero,'macaco',t); box(hero,[250,180,230,210],'Sapajus flavius 0.94'); }
  heroFrame(0);
  if(!reduce) setInterval(()=>heroFrame(performance.now()), 160);
  setInterval(()=>{ hs=(hs+1)%60; heroClock.textContent=`02:14:${pad(hs)}`; },1000);

  // demo
  const DEMO = {
    macaco:{meta:'CT-12 · Sirinhaém · 03:41',box:[250,180,230,210],res:[['Macaco-prego-galego',.91],['Macaco-prego (outra espécie)',.06],['Sagui-de-tufo-branco',.02],['Nenhum animal',.01]],
      v:'Espécie ameaçada (EN) detectada. Alerta enviado à equipe e ponto adicionado ao mapa.'},
    tatu:{meta:'CT-31 · Serra Talhada · 22:08',box:[220,290,190,90],res:[['Tatu-bola',.84],['Tatu-peba',.12],['Preá',.03],['Nenhum animal',.01]],
      v:'Provável tatu-bola (EN). Confiança boa, mas o tatu-peba é parecido: a foto vai para revisão rápida.'},
    gato:{meta:'CT-05 · Bonito · 01:17',box:[200,240,280,160],res:[['Gato-maracajá',.72],['Jaguatirica',.21],['Gato-do-mato',.06],['Nenhum animal',.01]],
      v:'Felino detectado. A diferença entre maracajá e jaguatirica é pequena nesta foto: um especialista decide.'},
    vazio:{meta:'CT-12 · Sirinhaém · 04:02',box:null,res:[['Nenhum animal',.97],['Macaco-prego-galego',.02],['Gato-maracajá',.01],['Tatu-bola',.00]],
      v:'Foto vazia (vento mexeu a folhagem). Descartada automaticamente, sem gastar tempo da equipe.'}
  };
  const demoCv = document.getElementById('demoCanvas');
  const bars = document.getElementById('bars'), verdict = document.getElementById('verdict');
  const status = document.getElementById('demoStatus'), meta = document.getElementById('demoMeta'), runBtn = document.getElementById('runBtn');
  let cur='macaco';
  function renderBars(res, show){
    bars.innerHTML = res.map((r,i)=>`<div class="bar ${i===0&&show?'top':''}"><div class="lbl"><span>${r[0]}</span><span class="mono">${show?Math.round(r[1]*100)+'%':'–'}</span></div><div class="track"><div class="fill"></div></div></div>`).join('');
    if(show) requestAnimationFrame(()=>bars.querySelectorAll('.fill').forEach((f,i)=>f.style.width=(res[i][1]*100)+'%'));
  }
  function loadSample(k){
    cur=k; const d=DEMO[k];
    scene(demoCv, k==='vazio'?'none':k);
    meta.textContent=d.meta; status.textContent='aguardando'; status.className='rec';
    renderBars(d.res,false);
    verdict.innerHTML='<p>Clique em <strong>Analisar com IA</strong> para ver a classificação.</p>';
  }
  document.querySelectorAll('[data-s]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('[data-s]').forEach(x=>x.setAttribute('aria-pressed',x===b));
    loadSample(b.dataset.s);
  }));
  runBtn.addEventListener('click',()=>{
    const d=DEMO[cur]; runBtn.disabled=true; status.textContent='analisando…';
    const c=demoCv.getContext('2d'); let y=0;
    scene(demoCv, cur==='vazio'?'none':cur);
    const snap = c.getImageData(0,0,demoCv.width,demoCv.height);
    const sweep = () => {
      c.putImageData(snap,0,0);
      c.fillStyle='rgba(217,86,31,.25)'; c.fillRect(0,y,demoCv.width,18);
      y+=demoCv.height/24;
      if(y<demoCv.height && !reduce) requestAnimationFrame(sweep);
      else {
        c.putImageData(snap,0,0);
        if(d.box) box(demoCv,d.box,`${d.res[0][0]} ${d.res[0][1].toFixed(2)}`);
        status.textContent = d.box ? 'animal detectado' : 'vazia · descartada';
        renderBars(d.res,true);
        verdict.innerHTML = `<p>${d.v}</p>`;
        runBtn.disabled=false;
      }
    };
    sweep();
  });

  /* ---------- Início ---------- */
  drawMap(); renderCards();
  loadSample('macaco');
  ['galego','tatu','tartaruga','choquinha','peixeboi'].forEach(id=>addEvent(id));
  setInterval(()=>addEvent(), reduce?5000:2600);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>drawMap());
  new MutationObserver(()=>drawMap()).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
