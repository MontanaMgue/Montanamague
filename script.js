/* =========================================================
   DISC Test – Montaña Malargüe
   - 50 preguntas (mezcladas)
   - 3 opciones (0/1/2)
   - Barra de progreso
   - Brújula (Chart.js Radar)
   - Compartir por WhatsApp (con imagen si el navegador lo permite)
   ========================================================= */

const QUESTIONS = [
  // === D (Dominancia) ===
  { t:"D", q:"Cuando el grupo tarda en organizarse, tomo el control sin pensarlo demasiado." },
  { t:"D", q:"Prefiero decidir rápido aunque no tenga toda la información." },
  { t:"D", q:"Si alguien avanza lento, me frustra y tiendo a apurar." },
  { t:"D", q:"Me cuesta aceptar que otro lidere si creo que lo puedo hacer mejor." },
  { t:"D", q:"Soy directo/a, incluso si puede sonar brusco." },
  { t:"D", q:"Los desafíos físicos me motivan más que las actividades suaves." },
  { t:"D", q:"En situaciones tensas, actúo primero y pienso después." },
  { t:"D", q:"Si hay un error, voy al punto sin rodeos." },
  { t:"D", q:"En montaña, prefiero ritmo firme y decidido." },
  { t:"D", q:"No me gusta depender del ritmo o decisión de otros." },
  { t:"D", q:"Si alguien se queja mucho, pierdo paciencia." },
  { t:"D", q:"Me molestan las dudas prolongadas antes de avanzar." },

  // === I (Influencia) ===
  { t:"I", q:"Busco que el grupo esté animado, incluso si estoy cansado/a." },
  { t:"I", q:"Prefiero caminar acompañado/a y conversando." },
  { t:"I", q:"Si hay tensión, intento hacer reír o distender." },
  { t:"I", q:"Me cuesta decir que no para no caer mal." },
  { t:"I", q:"Me entusiasman las salidas más por la gente que por el lugar." },
  { t:"I", q:"Con gente nueva en montaña conecto fácil." },
  { t:"I", q:"Me gusta compartir historias o anécdotas durante la salida." },
  { t:"I", q:"Si alguien se siente mal, lo motivo emocionalmente primero." },
  { t:"I", q:"Si veo silencio o incomodidad, trato de romperlo." },
  { t:"I", q:"Me siento cómodo/a liderando actividades sociales del grupo." },
  { t:"I", q:"Disfruto recibir reconocimiento del grupo." },
  { t:"I", q:"No disfruto salidas totalmente solitarias por varios días." },

  // === S (Estabilidad) ===
  { t:"S", q:"Me adapto al ritmo de quienes necesitan ir más lento." },
  { t:"S", q:"Prefiero grupos donde ya conozco a la mayoría." },
  { t:"S", q:"Si hay conflicto, intento mediar sin tomar partido." },
  { t:"S", q:"A veces callo una opinión para evitar problemas." },
  { t:"S", q:"Me gusta que cada salida tenga un plan tranquilo y claro." },
  { t:"S", q:"Cuando alguien necesita apoyo, soy constante y presente." },
  { t:"S", q:"Prefiero progreso lento pero seguro." },
  { t:"S", q:"Aprecio la montaña como espacio para paz y calma." },
  { t:"S", q:"Me incomoda cuando hay cambios inesperados en el plan." },
  { t:"S", q:"Disfruto acompañar a otros más que liderar." },
  { t:"S", q:"Me afecta si alguien del grupo tiene un mal día." },
  { t:"S", q:"Valoro mucho la armonía y el respeto en el grupo." },

  // === C (Concienzudo) ===
  { t:"C", q:"Reviso equipo y previsiones más de una vez antes de salir." },
  { t:"C", q:"Si el clima cambia, analizo toda la información posible." },
  { t:"C", q:"Me cuesta arrancar si siento que falta algo o hay riesgo." },
  { t:"C", q:"Prefiero rutas que conozco o investigué en detalle." },
  { t:"C", q:"Tomo decisiones solo después de evaluar pros y contras." },
  { t:"C", q:"Me incomoda improvisar sin datos." },
  { t:"C", q:"Aporto más cuando puedo organizar o planificar." },
  { t:"C", q:"Me frustra cuando otros deciden de forma impulsiva." },
  { t:"C", q:"Priorizo procedimientos de seguridad aunque demoren." },
  { t:"C", q:"Me gusta registrar tracks, horarios y condiciones." },
  { t:"C", q:"A veces tardo más en decidir para asegurarme." },
  { t:"C", q:"Me cuesta delegar sin supervisar detalles." },

  // === Balance / Mixtas (no suman a un solo eje, las usamos para minor ajuste) ===
  { t:"D", q:"Si hay desacuerdo, puedo tomar postura y empujar la decisión." },
  { t:"I", q:"Puedo cambiar el humor del grupo con mi energía." },
  { t:"S", q:"Si el grupo está tenso, priorizo calmar las aguas." },
  { t:"C", q:"Ante lo inesperado, busco rápidamente un plan alternativo." },
  { t:"D", q:"Ante terreno difícil, prefiero avanzar y resolver sobre la marcha." },
  { t:"I", q:"Me gusta motivar al grupo con metas y mensajes positivos." }
];

// Mezclar preguntas (Fisher–Yates)
function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

const form = document.getElementById('discForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

const resultBox = document.getElementById('result');
const resultType = document.getElementById('resultType');
const resultPercent = document.getElementById('resultPercent');
const groupContribution = document.getElementById('groupContribution');
const strengths = document.getElementById('strengths');
const toImprove = document.getElementById('toImprove');
const closingNote = document.getElementById('closingNote');

const downloadImgBtn = document.getElementById('downloadImg');
const shareWABtn = document.getElementById('shareWA');
const chartCanvas = document.getElementById('discChart');

let mixed = [];
let chartRef = null;

// Render dinámico de preguntas
function render(){
  mixed = shuffle(QUESTIONS).slice(0,50); // aseguramos 50
  form.innerHTML = mixed.map((item, idx)=>`
    <div class="question">
      <h4>${idx+1}. ${item.q}</h4>
      <ul class="opts">
        <li><label><input type="radio" name="q${idx}" value="0" /> En desacuerdo</label></li>
        <li><label><input type="radio" name="q${idx}" value="1" /> Neutral</label></li>
        <li><label><input type="radio" name="q${idx}" value="2" /> De acuerdo</label></li>
      </ul>
    </div>
  `).join('');

  // listeners para progreso
  form.querySelectorAll('input[type="radio"]').forEach(r=>{
    r.addEventListener('change', handleProgress);
  });

  handleProgress();
  resultBox.classList.add('hidden');
}
render();

function handleProgress(){
  const answered = new Set();
  for(let i=0;i<mixed.length;i++){
    const val = form.querySelector(`input[name="q${i}"]:checked`);
    if(val) answered.add(i);
  }
  const pct = Math.round((answered.size / mixed.length)*100);
  progressBar.style.width = pct + '%';
  progressText.textContent = `${answered.size} / ${mixed.length}`;
  submitBtn.disabled = answered.size !== mixed.length;
}

resetBtn.addEventListener('click', ()=>{
  render();
  window.scrollTo({top:0, behavior:'smooth'});
});

submitBtn.addEventListener('click', ()=>{
  const scores = {D:0, I:0, S:0, C:0};
  const counts = {D:0, I:0, S:0, C:0};

  mixed.forEach((item, i)=>{
    const v = Number(form.querySelector(`input[name="q${i}"]:checked`).value); // 0..2
    // Suma directa al rasgo del ítem
    scores[item.t] += v;
    counts[item.t] += 2; // escala máxima por ítem (2)
  });

  // % por eje
  const perc = {
    D: Math.round((scores.D / counts.D) * 100),
    I: Math.round((scores.I / counts.I) * 100),
    S: Math.round((scores.S / counts.S) * 100),
    C: Math.round((scores.C / counts.C) * 100),
  };

  // Ordenar para tipo principal y segundo
  const order = Object.entries(perc).sort((a,b)=>b[1]-a[1]);
  const mainType = order[0][0];
  const mainPct  = order[0][1];
  const secondType = order[1][0];

  paintResult(mainType, mainPct, secondType, perc);
  resultBox.classList.remove('hidden');
  resultBox.scrollIntoView({behavior:'smooth'});
});

// Textos por tipo (según lo que pediste)
const TEXTS = {
  D:{
    contrib:"Lidera decisiones rápidas, motivador ante retos físicos.",
    strong:"Decisión, empuje, foco en objetivos.",
    improve:"Impaciencia; puede ignorar dudas de otros.",
    coach:"Hablar claro y directo, reconocer sus logros; pedir feedback breve."
  },
  I:{
    contrib:"Animador del equipo, mantiene la cohesión social.",
    strong:"Carisma, comunicación, motivación.",
    improve:"Desorden; puede omitir detalles técnicos.",
    coach:"Involucrarlo en motivación del grupo; valorar ideas creativas."
  },
  S:{
    contrib:"Fomenta la constancia, apoyo emocional y solidaridad.",
    strong:"Paciencia, escucha, acompañamiento.",
    improve:"Reacio al cambio; evita confrontaciones.",
    coach:"Asegurar tranquilidad y explicar cambios con anticipación; agradecer su apoyo."
  },
  C:{
    contrib:"Planifica rutas, cuida la seguridad y equipamiento; analítico.",
    strong:"Orden, método, prevención de riesgos.",
    improve:"Exceso de cautela; puede ralentizar al grupo.",
    coach:"Proveer info detallada, respetar su ritmo; solicitar ayuda en organización."
  }
};

function paintResult(mainType, mainPct, secondType, perc){
  resultType.textContent = nameOf(mainType);
  resultPercent.textContent = `${mainPct}%`;
  groupContribution.textContent = TEXTS[mainType].contrib;
  strengths.textContent       = TEXTS[mainType].strong;
  toImprove.textContent       = TEXTS[mainType].improve;

  // Cierre emocional montañista
  closingNote.textContent =
    `Tu energía hoy se parece a ${nameOf(mainType)} (con rasgos de ${nameOf(secondType)}). ` +
    `Recordá: en altura manda el equipo. Usa tus fortalezas y compensá tus puntos ciegos. ` +
    `Paso firme, comunicación clara y foco en la seguridad — las expediciones empiezan en casa.`;

  drawChart(perc);
}

function nameOf(t){
  return ({
    D:"Dominante (D)",
    I:"Influyente (I)",
    S:"Estable (S)",
    C:"Concienzudo (C)"
  })[t];
}

function drawChart(perc){
  const data = [perc.D, perc.I, perc.S, perc.C];
  const labels = ["D", "I", "S", "C"];

  if(chartRef){ chartRef.destroy(); }

  chartRef = new Chart(chartCanvas, {
    type:'radar',
    data:{
      labels,
      datasets:[{
        label:'Perfil DISC',
        data,
        fill:true,
        // colores por defecto (Chart.js los setea), no definimos para cumplir guía
        pointRadius:3,
        borderWidth:2,
      }]
    },
    options:{
      responsive:true,
      animation:{ duration:600 },
      scales:{
        r:{
          beginAtZero:true,
          suggestedMax:100,
          ticks:{ display:true, stepSize:20, color:'#ddd' },
          grid:{ color:'#ffffff33' },
          angleLines:{ color:'#ffffff33' },
          pointLabels:{ color:'#fff', font:{ weight:'bold' } }
        }
      },
      plugins:{
        legend:{ display:false },
        tooltip:{
          callbacks:{
            label:(ctx)=>`${ctx.label}: ${ctx.formattedValue}%`
          }
        }
      }
    }
  });
}

/* ====== Descargar imagen del gráfico ====== */
downloadImgBtn.addEventListener('click', ()=>{
  if(!chartRef) return;
  const url = chartCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'brujula-disc.png';
  a.click();
});

/* ====== Compartir por WhatsApp ======
   1) Intenta usar Web Share API con archivo (móvil soportado).
   2) Si no, descarga imagen y abre WhatsApp con texto.
*/
shareWABtn.addEventListener('click', async ()=>{
  if(!chartRef) return;

  const text =
    `Mi perfil DISC en montaña:\n`+
    `• D: ${chartRef.data.datasets[0].data[0]}%\n`+
    `• I: ${chartRef.data.datasets[0].data[1]}%\n`+
    `• S: ${chartRef.data.datasets[0].data[2]}%\n`+
    `• C: ${chartRef.data.datasets[0].data[3]}%\n\n`+
    `Hecho con Montaña Malargüe 🏔️`;

  try{
    const blob = await new Promise(res => chartCanvas.toBlob(res, 'image/png'));
    const file = new File([blob], 'brujula-disc.png', {type:'image/png'});

    if(navigator.canShare && navigator.canShare({ files:[file] })){
      await navigator.share({
        files:[file],
        text,
        title:'Mi Brújula DISC'
      });
      return;
    }
  }catch(e){
    // continua a fallback
  }

  // Fallback: descarga imagen y abre WhatsApp con texto
  const url = chartCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url; a.download = 'brujula-disc.png'; a.click();

  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(wa, '_blank');
});
