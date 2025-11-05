/* =========================================================
   DISC Test - 48 preguntas, progreso real (0/48 al inicio)
   - Nada preseleccionado
   - Bloquea resultado si falta responder
   - Brújula: imagen estática + marcador calculado
   - Descarga PNG (canvas) y compartir WhatsApp (texto)
   ========================================================= */

const form = document.getElementById('discForm');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const btnVer = document.getElementById('btnVer');
const btnReset = document.getElementById('btnReset');

const resultBox = document.getElementById('result');
const lead = document.getElementById('lead');
const groupContribution = document.getElementById('groupContribution');
const strengths = document.getElementById('strengths');
const toImprove = document.getElementById('toImprove');
const marker = document.getElementById('marker');
const compassImg = document.getElementById('compassImg');
const btnDownload = document.getElementById('btnDownload');
const btnShareWA = document.getElementById('btnShareWA');
const closingMsg = document.getElementById('closingMsg');

/* ---------- Banco de preguntas (48) ----------
   t: 'D' | 'I' | 'S' | 'C'
   r: true -> ítem invertido (estar de acuerdo resta)
   Valor de respuesta: 0,1,2 (Desacuerdo, Neutral, De acuerdo)
   Puntuación: r ? (2 - v) : v
*/
const QUESTIONS = [
  // I (12)
  {q:'En actividades sociales, me energiza conocer personas nuevas.', t:'I'},
  {q:'En un grupo nuevo suelo romper el hielo con humor.', t:'I'},
  {q:'Cuando algo me entusiasma, lo comunico con facilidad al resto.', t:'I'},
  {q:'Prefiero entornos con conversación y movimiento antes que silencio prolongado.', t:'I'},
  {q:'Me resulta natural motivar a otros con palabras.', t:'I'},
  {q:'Me siento cómodo presentando ideas frente al grupo.', t:'I'},
  {q:'En reuniones, si nadie habla, suelo empezar yo.', t:'I'},
  {q:'Me aburre trabajar aislado por mucho tiempo.', t:'I'},
  {q:'Participo activamente en debates o brainstorming.', t:'I'},
  {q:'Me atraen trabajos con contacto frecuente con personas.', t:'I'},
  {q:'Para convencer, apelo a historias y ejemplos vividos.', t:'I'},
  {q:'Si el clima del grupo decae, intento levantarlo.', t:'I'},

  // S (12)
  {q:'Valoro la armonía y prefiero evitar conflictos innecesarios.', t:'S'},
  {q:'Mantengo la calma cuando otros se ponen nerviosos.', t:'S'},
  {q:'Me gusta que las cosas avancen con ritmo parejo y constante.', t:'S'},
  {q:'Cuando cambian los planes de golpe me cuesta adaptarme.', t:'S', r:true},
  {q:'Me considero una persona paciente con los procesos.', t:'S'},
  {q:'Antes de decidir, me gusta escuchar a todos.', t:'S'},
  {q:'Busco acuerdos y mediación ante posturas opuestas.', t:'S'},
  {q:'Me siento bien sosteniendo a otros en momentos difíciles.', t:'S'},
  {q:'Prefiero profundizar en pocas cosas a la vez.', t:'S'},
  {q:'En general, priorizo la cooperación antes que competir.', t:'S'},
  {q:'Me incomodan los cambios bruscos de última hora.', t:'S', r:true},
  {q:'La constancia diaria es una de mis fortalezas.', t:'S'},

  // C (12)
  {q:'Me fijo en los detalles y los errores suelen saltar a la vista.', t:'C'},
  {q:'Tiendo a seguir procedimientos y estándares con precisión.', t:'C'},
  {q:'Antes de actuar, recopilo y analizo los datos necesarios.', t:'C'},
  {q:'Prefiero tener instrucciones claras y criterios definidos.', t:'C'},
  {q:'Me siento cómodo planificando tareas con listas y controles.', t:'C'},
  {q:'Valoro la exactitud por encima de la velocidad.', t:'C'},
  {q:'Me resulta natural anticipar riesgos y preparar planes B.', t:'C'},
  {q:'Si no confío en la información, prefiero no avanzar.', t:'C'},
  {q:'Disfruto seguir buenas prácticas y mejorar procesos.', t:'C'},
  {q:'Las decisiones impulsivas rara vez me hacen sentir bien.', t:'C'},
  {q:'Me explico con datos, no solamente con intuiciones.', t:'C'},
  {q:'Prefiero revisar dos veces antes de entregar algo.', t:'C'},

  // D (12) (incluye situacionales que activan D/I)
  {q:'Cuando el tiempo apremia, decido rápido y asumo el resultado.', t:'D'},
  {q:'Ante un error importante, voy de frente y encaro el tema.', t:'D'},
  {q:'Si nadie toma la posta en una tarea, la tomo yo.', t:'D'},
  {q:'Bajo presión suelo volverme más directo y exigente.', t:'D'},
  {q:'En contextos competitivos me activo y busco objetivos más altos.', t:'D'},
  // Situacionales montaña / estrés (D/I)
  {q:'Con viento fuerte o frío extremo, prefiero decisiones cortas y firmes antes que debatir mucho.', t:'D'},
  {q:'Si el equipo está cansado y quedan 30´ de ruta, propongo una acción concreta y la ejecuto.', t:'D'},
  {q:'En una noche con poca visibilidad, priorizo señales claras y mando un plan simple.', t:'D'},
  {q:'Si aparece una urgencia, corto distracciones y ordeno tareas en 1-2 frases.', t:'D'},
  {q:'Cuando el grupo se dispersa hablando, recupero el foco con indicaciones breves.', t:'D'},
  {q:'Si hay dos caminos similares, elijo uno y pruebo, sin quedarme trabado comparando.', t:'D'},
  {q:'En altura o mal clima prefiero “menos charla, más acción segura”.', t:'D'}
];

// --- randomizamos el orden para todos ---
const shuffled = QUESTIONS.slice().sort(() => Math.random() - 0.5);

// ---- Render inicial (sin respuestas marcadas) ----
function render() {
  form.innerHTML = '';
  shuffled.forEach((item, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'question';
    wrap.innerHTML = `
      <h4>${idx+1}. ${item.q}</h4>
      <ul class="opts">
        <li><label><input type="radio" name="q${idx}" value="0"> En desacuerdo</label></li>
        <li><label><input type="radio" name="q${idx}" value="1"> Neutral</label></li>
        <li><label><input type="radio" name="q${idx}" value="2"> De acuerdo</label></li>
      </ul>
    `;
    form.appendChild(wrap);
  });

  // progreso arranca en 0
  updateProgress();

  // listeners para actualizar progreso
  form.querySelectorAll('input[type="radio"]').forEach(r => {
    r.addEventListener('change', updateProgress);
  });
}

function updateProgress() {
  const total = shuffled.length;
  let answered = 0;
  for (let i = 0; i < total; i++) {
    if (form.querySelector(`input[name="q${i}"]:checked`)) answered++;
  }
  progressBar.style.width = `${(answered/total)*100}%`;
  progressText.textContent = `${answered} / ${total}`;
}

// ---- Cálculo DISC ----
const quadrantOrder = ['D','I','S','C']; // círculo
const labels = {
  D: {title:'Dominante (D)', contrib:'Lidera decisiones rápidas; motivador ante retos físicos.', strengths:'Decisión, foco, ejecución.', improve:'Impaciencia; puede ignorar dudas de otros.'},
  I: {title:'Influyente (I)', contrib:'Anima al equipo y sostiene la cohesión social.', strengths:'Comunicación, entusiasmo, persuasión.', improve:'Desorganización; puede omitir detalles.'},
  S: {title:'Estable (S)', contrib:'Constancia, apoyo emocional y solidaridad.', strengths:'Calma, escucha, trabajo en equipo.', improve:'Evita confrontaciones; reacio al cambio.'},
  C: {title:'Concienzudo (C)', contrib:'Planifica rutas, cuida seguridad y equipamiento; analítico.', strengths:'Orden, método, prevención de riesgos.', improve:'Exceso de cautela; puede ralentizar al grupo.'}
};

function computeScores(){
  const totals = {D:0, I:0, S:0, C:0};
  const counts = {D:0, I:0, S:0, C:0};
  for (let i = 0; i < shuffled.length; i++) {
    const sel = form.querySelector(`input[name="q${i}"]:checked`);
    const v = sel ? Number(sel.value) : null;
    if (v == null) continue;
    const t = shuffled[i].t;
    const r = !!shuffled[i].r;
    const score = r ? (2 - v) : v; // invierte
    totals[t] += score;
    counts[t] += 2; // máximo posible por ítem (2)
  }
  // porcentajes
  const pct = {};
  for (const k of ['D','I','S','C']) {
    const max = counts[k] === 0 ? 1 : counts[k];
    pct[k] = Math.round(100 * totals[k] / max);
  }
  return {totals, pct};
}

// orientación primaria/secundaria y “con rasgos de”
function describeProfile(pct){
  const entries = Object.entries(pct).sort((a,b)=>b[1]-a[1]); // desc
  const [pKey,pVal] = entries[0];
  const [sKey,sVal] = entries[1];

  // ¿son adyacentes en el círculo?
  const idxP = quadrantOrder.indexOf(pKey);
  const adj1 = quadrantOrder[(idxP+1)%4];
  const adj2 = quadrantOrder[(idxP+3)%4];
  const isAdj = (sKey===adj1 || sKey===adj2);

  const title = `${labels[pKey].title} — ${pVal}%` + (isAdj ? ` (con rasgos de ${labels[sKey].title.split(' ')[0]})` : '');
  return {pKey, sKey, title};
}

// ubicar marcador en la brújula (vectorial)
function placeMarker(pct){
  // asignamos ángulos por cuadrante (D=90°, I=0°, S=270°, C=180°)
  const angles = {D:90, I:0, S:270, C:180};
  let vx=0, vy=0;
  for(const k of ['D','I','S','C']){
    const ang = angles[k]*Math.PI/180;
    const r = pct[k]/100; // 0..1
    vx += Math.cos(ang)*r;
    vy -= Math.sin(ang)*r; // -sin por coords de pantalla
  }
  // normalizamos a la caja del contenedor
  const cx = 50 + vx*40; // 40% radio útil
  const cy = 50 + vy*40;
  marker.style.left = `${cx}%`;
  marker.style.top = `${cy}%`;
}

// generar PNG de la brújula + marcador
function downloadCompassPNG(filename='brujula_disc.png'){
  const canvas = document.createElement('canvas');
  const w = 1216, h = 722; // ~2x de 608x361
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.fillStyle = '#0b0d12';
    ctx.fillRect(0,0,w,h);
    // imagen centrada con márgenes
    const pad = 40;
    const iw = w - pad*2, ih = h - pad*2;
    ctx.drawImage(img, pad, pad, iw, ih);
    // marcador (usar la misma posición visual)
    const rect = compassImg.getBoundingClientRect();
    const mRect = marker.getBoundingClientRect();
    // porcentuales relativos
    const px = ( (mRect.left + mRect.width/2) - rect.left ) / rect.width;
    const py = ( (mRect.top  + mRect.height/2) - rect.top  ) / rect.height;

    const mx = pad + iw*px;
    const my = pad + ih*py;

    ctx.fillStyle = '#58a6ff';
    ctx.beginPath(); ctx.arc(mx,my,10,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#58a6ff55'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(mx,my,16,0,Math.PI*2); ctx.stroke();

    const a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  img.src = compassImg.src;
}

// --------- Eventos ----------
btnVer.addEventListener('click', () => {
  // Validar completitud
  for (let i = 0; i < shuffled.length; i++){
    if (!form.querySelector(`input[name="q${i}"]:checked`)){
      alert("Por favor respondé todas las preguntas para ver el resultado.");
      return;
    }
  }

  const {pct} = computeScores();
  const desc = describeProfile(pct);

  lead.innerHTML = `Perfil principal: <strong>${desc.title}</strong>`;
  groupContribution.textContent = labels[desc.pKey].contrib;
  strengths.textContent = labels[desc.pKey].strengths;
  toImprove.textContent = labels[desc.pKey].improve;

  // frase de cierre
  closingMsg.textContent =
    "Tu energía hoy combina tus preferencias predominantes. En altura manda el equipo: paso firme, comunicación clara y foco en la seguridad — las expediciones empiezan en casa.";

  // marcador
  placeMarker(pct);

  // compartir WA (texto)
  btnShareWA.onclick = () => {
    const txt = `Mi perfil DISC: ${desc.title}
D:${pct.D}%  I:${pct.I}%  S:${pct.S}%  C:${pct.C}%`;
    const url = `https://wa.me/?text=${encodeURIComponent(txt)}`;
    window.open(url, '_blank');
  };

  // descargar imagen
  btnDownload.onclick = () => downloadCompassPNG();

  resultBox.classList.remove('hidden');
  resultBox.scrollIntoView({behavior:'smooth', block:'start'});
});

btnReset.addEventListener('click', () => {
  // recarga limpia
  window.location.reload();
});

// Inicialización
render();

