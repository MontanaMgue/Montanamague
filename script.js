/* =========================================================
   DISC — 50 ÍTEMS BALANCEADOS + REVERSE-SCORED
   Escala: 0 (En desacuerdo), 1 (Neutral), 2 (De acuerdo)
   Si reverse=true -> puntuación = 2 - valor
   ========================================================= */

const QUESTIONS = (() => {
  // 12 por factor (48) + 2 extra equilibrando D/I
  const D = [
    { t:'D', q:'Prefiero decidir rápido aunque no tenga toda la información.', r:false },
    { t:'D', q:'Ante un imprevisto en montaña, asumo el mando con naturalidad.', r:false },
    { t:'D', q:'Me siento cómodo/a confrontando decisiones que considero equivocadas.', r:false },
    { t:'D', q:'Si el grupo duda, avanzo y elijo una ruta con criterio propio.', r:false },
    { t:'D', q:'A veces me impaciento cuando se discute demasiado.', r:false },
    { t:'D', q:'Evito tomar decisiones críticas (por miedo a errar).', r:true  },
    { t:'D', q:'Me cuesta decir “no” incluso si la propuesta es riesgosa.', r:true  },
    { t:'D', q:'Postergaría una decisión importante para evitar conflictos.', r:true  },
    { t:'D', q:'Prefiero que otros tomen las decisiones difíciles.', r:true  },
    { t:'D', q:'Ante presión, mantengo el foco y resuelvo con determinación.', r:false },
    { t:'D', q:'Cuando la situación es tensa, me vuelvo pasivo/a.', r:true  },
    { t:'D', q:'Me resulta natural liderar la salida cuando hay incertidumbre.', r:false },
  ];
  const I = [
    { t:'I', q:'Me gusta motivar al grupo con metas y mensajes positivos.', r:false },
    { t:'I', q:'Busco integrar a personas nuevas para que se sientan parte.', r:false },
    { t:'I', q:'Si hay tensiones, tiendo a mediar desde la cercanía.', r:false },
    { t:'I', q:'Me entusiasmo y contagio energía en las subidas exigentes.', r:false },
    { t:'I', q:'Evito hablar en público o animar al grupo.', r:true  },
    { t:'I', q:'Me cuesta proponer ideas creativas en el campamento.', r:true  },
    { t:'I', q:'Suelo generar buen clima social durante la actividad.', r:false },
    { t:'I', q:'Prefiero aislarme del grupo aun cuando hace falta unión.', r:true  },
    { t:'I', q:'Disfruto reconocer y celebrar los logros del equipo.', r:false },
    { t:'I', q:'Me es indiferente si el grupo está desmotivado.', r:true  },
    { t:'I', q:'Tiendo a comunicar de forma clara y positiva.', r:false },
    { t:'I', q:'Evito dar mi opinión para no llamar la atención.', r:true  },
  ];
  const S = [
    { t:'S', q:'Me sale dar apoyo emocional cuando alguien la pasa mal.', r:false },
    { t:'S', q:'Prefiero ritmos constantes y predecibles en la marcha.', r:false },
    { t:'S', q:'Me cuesta confrontar; prefiero buscar armonía.', r:false },
    { t:'S', q:'Soy paciente con quienes vienen más lento.', r:false },
    { t:'S', q:'Me alteran los cambios repentinos de plan.', r:false },
    { t:'S', q:'Me es fácil adaptarme a cambios bruscos sin explicación.', r:true  },
    { t:'S', q:'Evito involucrarme cuando hay conflicto en el grupo.', r:true  },
    { t:'S', q:'Suelo sostener a otros para que no abandonen.', r:false },
    { t:'S', q:'Aprecio las rutinas porque dan estabilidad al equipo.', r:false },
    { t:'S', q:'No me preocupa la cohesión del grupo.', r:true  },
    { t:'S', q:'Aporto calma y constancia cuando aparecen dificultades.', r:false },
    { t:'S', q:'Prefiero “dejarlo pasar” antes que discutir.', r:false },
  ];
  const C = [
    { t:'C', q:'Planifico rutas, equipo y riesgos con detalle.', r:false },
    { t:'C', q:'Antes de avanzar, reviso datos de clima y terreno.', r:false },
    { t:'C', q:'Me incomoda improvisar sin analizar opciones.', r:false },
    { t:'C', q:'Chequeo redundancias de seguridad (plan B/C).', r:false },
    { t:'C', q:'Me entierro en detalles y pierdo la visión general.', r:true  },
    { t:'C', q:'Actúo sin verificar si hay riesgos objetivos.', r:true  },
    { t:'C', q:'Mantengo orden en campamento y material común.', r:false },
    { t:'C', q:'Prefiero “a ojo” antes que medir y registrar.', r:true  },
    { t:'C', q:'Sigo protocolos y listas para no olvidar nada.', r:false },
    { t:'C', q:'Evito documentar lo aprendido en salidas.', r:true  },
    { t:'C', q:'Analizo con calma antes de decidir un cruce dudoso.', r:false },
    { t:'C', q:'Me cuesta respetar procedimientos y normas.', r:true  },
  ];

  // 2 extras para compensar (menos sesgo hacia C)
  const EXTRA = [
    { t:'D', q:'Si el tiempo apremia, priorizo decidir y ejecutar.', r:false },
    { t:'I', q:'Me ocupo de que nadie quede afuera en el grupo.', r:false },
  ];

  return [...D, ...I, ...S, ...C, ...EXTRA]; // 50
})();

/* ===== DOM ===== */
const qsWrap = document.getElementById('questions');
const form = document.getElementById('discForm');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const btnResult = document.getElementById('btnResult');
const btnReset = document.getElementById('btnReset');
const resultCard = document.getElementById('resultCard');

const elType = document.getElementById('resultType');
const elPct  = document.getElementById('resultPct');
const elGC   = document.getElementById('groupContribution');
const elStr  = document.getElementById('strengths');
const elImp  = document.getElementById('toImprove');
const elClosing = document.getElementById('closingType');

/* ===== UTILS ===== */
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function option(name, value, label){
  const id = `${name}_${value}`;
  return `
    <li>
      <input type="radio" id="${id}" name="${name}" value="${value}" />
      <label for="${id}">${label}</label>
    </li>
  `;
}

/* ===== RENDER PREGUNTAS ===== */
let renderedQuestions = [];
function renderQuestions(){
  const mixed = shuffle(QUESTIONS);
  renderedQuestions = mixed.map((item, idx) => ({...item, name:`q${idx}`}));

  qsWrap.innerHTML = renderedQuestions.map((it, i) => `
    <div class="question">
      <h4>${i+1}. ${it.q}</h4>
      <ul class="opts">
        ${option(it.name, 0, 'En desacuerdo')}
        ${option(it.name, 1, 'Neutral')}
        ${option(it.name, 2, 'De acuerdo')}
      </ul>
    </div>
  `).join('');

  // Actualiza progreso al cambiar
  form.querySelectorAll('input[type="radio"]').forEach(r=>{
    r.addEventListener('change', updateProgress);
  });
  updateProgress();
}
renderQuestions();

/* ===== PROGRESO ===== */
function updateProgress(){
  const total = renderedQuestions.length;
  const checked = new Set();
  form.querySelectorAll('input[type="radio"]:checked').forEach(r => checked.add(r.name));
  const done = checked.size;

  progressBar.style.width = `${(done/total)*100}%`;
  progressText.textContent = `${done} / ${total}`;
}

/* ===== CÁLCULO ===== */
function computeScores(){
  const totals = {D:0, I:0, S:0, C:0};
  const counts = {D:0, I:0, S:0, C:0};

  for(const it of renderedQuestions){
    const node = form.querySelector(`input[name="${it.name}"]:checked`);
    if(!node) return null; // faltan respuestas
    let v = parseInt(node.value,10); // 0,1,2
    if(it.r) v = 2 - v;              // invertido
    totals[it.t] += v;
    counts[it.t] += 1;
  }
  // % por factor (0..100)
  const pct = {};
  for(const k of ['D','I','S','C']){
    const max = counts[k] * 2;
    pct[k] = max>0 ? Math.round( (totals[k]/max)*100 ) : 0;
  }
  return {totals, counts, pct};
}

/* ===== TEXTO POR PERFIL ===== */
const PROFILE_TEXT = {
  D: {
    name: 'Dominante (D)',
    contrib: 'Lidera decisiones rápidas, motivador ante retos físicos.',
    strengths: 'Determinación, foco en objetivos, coraje para decidir.',
    improve: 'Impaciencia; puede ignorar dudas de otros.'
  },
  I: {
    name: 'Influyente (I)',
    contrib: 'Animador del equipo, mantiene la cohesión social.',
    strengths: 'Energía, comunicación positiva, integración.',
    improve: 'Desorganización; puede omitir detalles técnicos.'
  },
  S: {
    name: 'Estable (S)',
    contrib: 'Fomenta la constancia, apoyo emocional y solidaridad.',
    strengths: 'Paciencia, empatía, ritmos sostenidos.',
    improve: 'Reacio al cambio; evita confrontaciones.'
  },
  C: {
    name: 'Concienzudo (C)',
    contrib: 'Planifica rutas, cuida la seguridad y equipamiento, analítico.',
    strengths: 'Orden, método, prevención de riesgos.',
    improve: 'Exceso de cautela; puede ralentizar al grupo.'
  }
};

/* ===== RESULTADOS + MATRIZ ===== */
btnResult.addEventListener('click', () => {
  const res = computeScores();
  if(!res){
    alert('Te faltan preguntas por responder.');
    return;
  }
  const {pct} = res;
  const entries = Object.entries(pct).sort((a,b)=>b[1]-a[1]);
  const [topKey, topVal] = entries[0];

  // Pintamos textos
  const T = PROFILE_TEXT[topKey];
  elType.textContent = `${T.name}`;
  elPct.textContent = `${topVal}%`;
  elGC.textContent = T.contrib;
  elStr.textContent = T.strengths;
  elImp.textContent = T.improve;
  elClosing.textContent = `${T.name}`;

  // Colocamos el marcador en la matriz
  updateDiscMatrixMarker(pct);

  resultCard.classList.remove('hidden');
  // scroll
  resultCard.scrollIntoView({behavior:'smooth', block:'start'});
});

btnReset.addEventListener('click', () => {
  form.reset();
  updateProgress();
  resultCard.classList.add('hidden');
  // reordenar preguntas para un nuevo intento
  renderQuestions();
});

/* ---------------- MATRIZ DISC CON MARCADOR ---------------- */
function updateDiscMatrixMarker(scores){
  const img = document.getElementById('discMatrixImg');
  const marker = document.getElementById('discMarker');
  if(!img || !marker) return;

  const place = () => {
    const wrap = img.getBoundingClientRect();
    const w = wrap.width, h = wrap.height;
    const cx = w/2, cy = h/2;

    const total = Math.max(1, (scores.D||0)+(scores.I||0)+(scores.S||0)+(scores.C||0));
    const D = (scores.D||0)/total;
    const I = (scores.I||0)/total;
    const S = (scores.S||0)/total;
    const C = (scores.C||0)/total;

    const vx = I - C;   // derecha - izquierda
    const vy = S - D;   // abajo   - arriba
    const radius = Math.min(w,h)*0.36;

    const x = cx + vx*radius;
    const y = cy + vy*radius;

    marker.style.left = `${x}px`;
    marker.style.top  = `${y}px`;
  };

  if (img.complete) place();
  else img.onload = place;
}

/* ----------- Exportar imagen y compartir ----------- */
async function renderDiscMatrixPNG(){
  const img = document.getElementById('discMatrixImg');
  const marker = document.getElementById('discMarker');
  return new Promise(resolve=>{
    const make = () => {
      const rect = img.getBoundingClientRect();
      const w = Math.max(320, Math.round(rect.width));
      const h = Math.max(240, Math.round(rect.height));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');

      const base = new Image();
      base.crossOrigin = 'anonymous';
      base.onload = () => {
        ctx.drawImage(base, 0, 0, w, h);

        const wrapRect = img.getBoundingClientRect();
        const mx = parseFloat(marker.style.left) || wrapRect.width/2;
        const my = parseFloat(marker.style.top)  || wrapRect.height/2;
        const rx = (mx / wrapRect.width) * w;
        const ry = (my / wrapRect.height) * h;

        const r = Math.max(7, Math.round(Math.min(w,h) * 0.012));
        ctx.beginPath();
        ctx.arc(rx, ry, r+5, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,208,138,0.35)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rx, ry, r, 0, Math.PI*2);
        ctx.fillStyle = '#ffd08a';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0,0,0,.55)';
        ctx.stroke();

        resolve(canvas.toDataURL('image/png'));
      };
      base.src = img.currentSrc || img.src;
    };
    if (img.complete) make(); else img.onload = make;
  });
}

document.getElementById('btnDownload').addEventListener('click', async ()=>{
  const dataURL = await renderDiscMatrixPNG();
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'disc_resultado.png';
  a.click();
});

document.getElementById('btnWhatsApp').addEventListener('click', async ()=>{
  // WhatsApp no permite adjuntar un PNG generado desde el navegador sin interacción nativa;
  // Compartimos el link + sugerimos descargar la imagen con el botón anterior.
  const texto = encodeURIComponent(
    `Mi perfil DISC en Montaña Malargüe 💪🏔️%0A` +
    `Hice el test y este es mi resultado. Hacé el tuyo acá:%0A` +
    `${location.href}`
  );
  window.open(`https://wa.me/?text=${texto}`, '_blank');
});
