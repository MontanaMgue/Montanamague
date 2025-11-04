/* =========================================================
   DISC — 56 ÍTEMS FIJOS (14 por factor)
   Escala: 0 (En desacuerdo) / 1 (Neutral) / 2 (De acuerdo)
   Ítems invertidos: r:true -> puntaje = 2 - valor
   ========================================================= */

function option(name,value,label){
  const id=`${name}_${value}`;
  return `<li><input type="radio" id="${id}" name="${name}" value="${value}"><label for="${id}">${label}</label></li>`;
}

/* ---------- ÍTEMS (14 por D/I/S/C) ---------- */
const ITEMS = [
  /* D — Dominancia (14) */
  {t:'D',q:'Cuando el grupo se traba, propongo un plan y pongo tiempos sobre la mesa.',r:false},
  {t:'D',q:'Prefiero decidir rápido aunque haya incertidumbre razonable.',r:false},
  {t:'D',q:'Si dos opciones son similares, pido que decidan otros.',r:true},
  {t:'D',q:'Ante un error mío, asumo la responsabilidad sin demoras.',r:false},
  {t:'D',q:'Evito confrontar decisiones aun si creo que afectan la seguridad.',r:true},
  {t:'D',q:'Cuando hay presión, me enfoco y ejecuto sin dispersarme.',r:false},
  {t:'D',q:'Si el terreno cambia, adapto el plan y doy instrucciones claras.',r:false},
  {t:'D',q:'Prefiero seguir antes que liderar, incluso si tengo un plan claro.',r:true},
  {t:'D',q:'Puedo decir “no” aunque a otros no les guste.',r:false},
  {t:'D',q:'Me paraliza decidir si falta información perfecta.',r:true},
  {t:'D',q:'Prefiero decisiones claras a debates extensos.',r:false},
  {t:'D',q:'Cuando algo no funciona, corto por lo sano y pruebo otra cosa.',r:false},
  {t:'D',q:'Con rachas de 70–80 km/h en el filo, organizo rápido y reduzco exposición.',r:false},
  {t:'D',q:'Whiteout complicado: espero que alguien más defina el rumbo.',r:true},

  /* I — Influencia (14) */
  {t:'I',q:'Ayudo a que las personas nuevas se sientan parte del grupo.',r:false},
  {t:'I',q:'Me sale celebrar avances para mantener la moral alta.',r:false},
  {t:'I',q:'Prefiero no hablar en voz alta aunque el ánimo esté bajo.',r:true},
  {t:'I',q:'Si hay tensión, puedo traducir y acercar posturas.',r:false},
  {t:'I',q:'Me cuesta reconocer el esfuerzo de los demás en el momento.',r:true},
  {t:'I',q:'Disfruto contar el plan de forma clara y motivante.',r:false},
  {t:'I',q:'Cuando el grupo está cansado, tiendo a aislarme.',r:true},
  {t:'I',q:'Me interesa que todos tengan espacio para opinar.',r:false},
  {t:'I',q:'Evito proponer ideas por temor a que las descarten.',r:true},
  {t:'I',q:'Puedo comunicar malas noticias cuidando el vínculo.',r:false},
  {t:'I',q:'Ascenso nocturno y frío: mantengo la moral con objetivos cortos y claros.',r:false},
  {t:'I',q:'Retiro por seguridad: comunico con empatía para sostener cohesión.',r:false},
  {t:'I',q:'Con fatiga alta, prefiero no hablar para “no gastar energía”.',r:true},
  {t:'I',q:'Antes de una pasada expuesta, alineo al grupo con check breve y positivo.',r:false},

  /* S — Estabilidad (14) */
  {t:'S',q:'Elijo ritmos constantes y previsibles antes que cambios bruscos.',r:false},
  {t:'S',q:'Ofrezco ayuda emocional cuando alguien la pasa mal.',r:false},
  {t:'S',q:'Los cambios de último minuto me resultan estimulantes.',r:true},
  {t:'S',q:'Prefiero acordar bien los roles para evitar roces.',r:false},
  {t:'S',q:'Si hay conflicto, me alejo y dejo que se arregle solo.',r:true},
  {t:'S',q:'Soy paciente con quienes vienen más lento.',r:false},
  {t:'S',q:'Aprecio las rutinas porque ordenan al equipo.',r:false},
  {t:'S',q:'Me cuesta sostener el apoyo cuando yo también estoy cansado.',r:true},
  {t:'S',q:'Intento que todos estén informados para bajar la ansiedad.',r:false},
  {t:'S',q:'Prefiero evitar conversaciones difíciles aunque sean necesarias.',r:true},
  {t:'S',q:'Sostengo tareas repetitivas sin perder la calma.',r:false},
  {t:'S',q:'La armonía del grupo no es un factor que considere.',r:true},
  {t:'S',q:'Ante un cambio brusco, pido una pausa breve para ordenar y sigo.',r:false},
  {t:'S',q:'Si hay tensión, saco el tema en privado antes que ignorarlo.',r:false},

  /* C — Concienzudo (14) */
  {t:'C',q:'Planifico rutas, riesgos y equipo con criterio y método.',r:false},
  {t:'C',q:'Reviso pronóstico y variantes antes de decidir.',r:false},
  {t:'C',q:'Me siento cómodo improvisando sin datos claros.',r:true},
  {t:'C',q:'Sigo listas y protocolos para no olvidar nada.',r:false},
  {t:'C',q:'Me pierdo en detalles y olvido el objetivo general.',r:true},
  {t:'C',q:'Registro aprendizajes para mejorar salidas futuras.',r:false},
  {t:'C',q:'Ignoro chequeos si el grupo tiene apuro.',r:true},
  {t:'C',q:'Me gusta medir (tiempos, desnivel, consumo) para decidir mejor.',r:false},
  {t:'C',q:'Evito documentar porque “desgana” el momento.',r:true},
  {t:'C',q:'En pasos dudosos, analizo opciones y explico el porqué.',r:false},
  {t:'C',q:'Me cuesta respetar procedimientos cuando hay presión.',r:true},
  {t:'C',q:'Mantengo orden en campamento y material común.',r:false},
  {t:'C',q:'Prefiero decidir por intuición aun cuando hay datos.',r:true},
  {t:'C',q:'Ajusto el plan si la evidencia contradice la idea original.',r:false},
];

/* ---------- DOM ---------- */
const form = document.getElementById('discForm');
const qsWrap = document.getElementById('questions');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const btnResult = document.getElementById('btnResult');
const btnReset  = document.getElementById('btnReset');

const elType = document.getElementById('resultType');
const elPct  = document.getElementById('resultPct');
const elGC   = document.getElementById('groupContribution');
const elStr  = document.getElementById('strengths');
const elImp  = document.getElementById('toImprove');
const elClosing = document.getElementById('closingType');

/* ---------- Render fijo (56 ítems) ---------- */
function renderQuestions(){
  qsWrap.innerHTML = ITEMS.map((it,idx)=>`
    <div class="question">
      <h4>${idx+1}. ${it.q}</h4>
      <ul class="opts">
        ${option(`q${idx}`,0,'En desacuerdo')}
        ${option(`q${idx}`,1,'Neutral')}
        ${option(`q${idx}`,2,'De acuerdo')}
      </ul>
    </div>
  `).join('');

  form.querySelectorAll('input[type="radio"]').forEach(r=>r.addEventListener('change',updateProgress));
  updateProgress();
}
renderQuestions();

/* ---------- Progreso ---------- */
function updateProgress(){
  const total = ITEMS.length;
  const checked = new Set();
  form.querySelectorAll('input[type="radio"]:checked').forEach(r=>checked.add(r.name));
  const done = checked.size;
  progressBar.style.width = `${(done/total)*100}%`;
  progressText.textContent = `${done} / ${total}`;
}

/* ---------- Cálculo ---------- */
function computeScores(){
  const totals = {D:0,I:0,S:0,C:0};
  const counts = {D:0,I:0,S:0,C:0};

  for(let i=0;i<ITEMS.length;i++){
    const it = ITEMS[i];
    const node = form.querySelector(`input[name="q${i}"]:checked`);
    if(!node) return null;
    let v = parseInt(node.value,10); // 0-1-2
    if(it.r) v = 2 - v;
    totals[it.t]+=v; counts[it.t]+=1;
  }
  const pct={};
  for(const k of ['D','I','S','C']){
    const max = counts[k]*2;
    pct[k] = max? Math.round((totals[k]/max)*100):0;
  }
  return {pct};
}

/* ---------- Textos ---------- */
const PROFILE_TEXT = {
  D:{name:'Dominante (D)',contrib:'Lidera decisiones rápidas; empuja en retos físicos.',strengths:'Determinación, foco, coraje para decidir.',improve:'Impaciencia; puede pasar por alto dudas ajenas.'},
  I:{name:'Influyente (I)',contrib:'Anima y cohesiona al equipo.',strengths:'Energía, comunicación positiva, integración.',improve:'Puede omitir detalles o desordenarse.'},
  S:{name:'Estable (S)',contrib:'Constancia, apoyo emocional, solidaridad.',strengths:'Paciencia, empatía, ritmos sostenidos.',improve:'Evita confrontaciones; le cuestan cambios.'},
  C:{name:'Concienzudo (C)',contrib:'Planificación, seguridad, análisis.',strengths:'Orden, método, prevención de riesgos.',improve:'Exceso de cautela; puede enlentecer.'},
};

/* ---------- Imagen + marcador ---------- */
function updateDiscMatrixMarker(scores){
  const img = document.getElementById('discMatrixImg');
  const marker = document.getElementById('discMarker');
  if(!img || !marker) return;

  const place = ()=>{
    const rect = img.getBoundingClientRect();
    const w=rect.width, h=rect.height, cx=w/2, cy=h/2;

    // Vector simple: derecha = I, izquierda = C, arriba = D, abajo = S
    const total = Math.max(1,(scores.D||0)+(scores.I||0)+(scores.S||0)+(scores.C||0));
    const vx = (scores.I||0)/total - (scores.C||0)/total; // -1 .. 1
    const vy = (scores.S||0)/total - (scores.D||0)/total; // -1 .. 1
    const R = Math.min(w,h)*0.36; // radio útil dentro de la imagen

    marker.style.left = `${cx + vx*R}px`;
    marker.style.top  = `${cy + vy*R}px`;
  };

  if(img.complete) place(); else img.onload = place;
}

/* Render PNG de la imagen + marker */
async function renderDiscMatrixPNG(){
  const img = document.getElementById('discMatrixImg');
  const marker = document.getElementById('discMarker');
  return new Promise(res=>{
    const go = ()=>{
      const r=img.getBoundingClientRect(), w=Math.max(320,Math.round(r.width)), h=Math.max(240,Math.round(r.height));
      const c=document.createElement('canvas'); c.width=w; c.height=h; const ctx=c.getContext('2d');
      const base=new Image(); base.crossOrigin='anonymous';
      base.onload=()=>{
        ctx.drawImage(base,0,0,w,h);
        // traducir marker
        const mx=parseFloat(marker.style.left)||r.width/2;
        const my=parseFloat(marker.style.top)||r.height/2;
        const rx=(mx/r.width)*w, ry=(my/r.height)*h;
        const rr=Math.max(7,Math.round(Math.min(w,h)*.012));
        ctx.beginPath(); ctx.arc(rx,ry,rr+5,0,Math.PI*2); ctx.fillStyle='rgba(255,208,138,.35)'; ctx.fill();
        ctx.beginPath(); ctx.arc(rx,ry,rr,0,Math.PI*2); ctx.fillStyle='#ffd08a'; ctx.fill();
        ctx.lineWidth=4; ctx.strokeStyle='rgba(0,0,0,.55)'; ctx.stroke();
        res(c.toDataURL('image/png'));
      };
      base.src = img.currentSrc || img.src;
    };
    if(img.complete) go(); else img.onload=go;
  });
}

/* ---------- Eventos ---------- */
document.getElementById('btnResult').addEventListener('click',()=>{
  const r=computeScores();
  if(!r){ alert('Te faltan respuestas.'); return; }
  const {pct}=r;
  const entries = Object.entries(pct).sort((a,b)=>b[1]-a[1]);
  const [topKey,topVal] = entries[0];
  const T=PROFILE_TEXT[topKey];

  document.getElementById('resultType').textContent=T.name;
  document.getElementById('resultPct').textContent=`${topVal}%`;
  document.getElementById('groupContribution').textContent=T.contrib;
  document.getElementById('strengths').textContent=T.strengths;
  document.getElementById('toImprove').textContent=T.improve;
  document.getElementById('closingType').textContent=T.name;

  updateDiscMatrixMarker({
    D:pct.D||0, I:pct.I||0, S:pct.S||0, C:pct.C||0
  });

  const card = document.getElementById('resultCard');
  card.classList.remove('hidden');
  card.scrollIntoView({behavior:'smooth',block:'start'});
});

document.getElementById('btnReset').addEventListener('click',()=>{
  document.getElementById('resultCard').classList.add('hidden');
  document.getElementById('discForm').reset();
  // reset progreso
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  progressBar.style.width='0%'; progressText.textContent='0 / 56';
});

document.getElementById('btnDownload').addEventListener('click',async()=>{
  const dataURL=await renderDiscMatrixPNG();
  const a=document.createElement('a'); a.href=dataURL; a.download='disc_resultado.png'; a.click();
});

document.getElementById('btnWhatsApp').addEventListener('click',()=>{
  // Nota: WhatsApp no acepta adjuntar imagen local desde web sin servidor.
  // Compartimos texto + link (si la página está publicada, se comparte la URL).
  const texto=encodeURIComponent(
    `Mi perfil DISC en Montaña Malargüe 💪🏔️\nProbá el test acá:\n${location.href}`
  );
  window.open(`https://wa.me/?text=${texto}`,'_blank');
});

/* Inicial: mostrar progreso en 0 */
updateProgress();
