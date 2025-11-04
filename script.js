/* -----------------------------
   DISC – Montaña Malargüe
   50 preguntas • 3 opciones
   ----------------------------- */

const QUESTIONS = [
  // -------- C (13)
  { t: 'C', q: 'Me fijo en los detalles para que todo salga seguro.' },
  { t: 'C', q: 'Planifico rutas y alternativas antes de salir.' },
  { t: 'C', q: 'Me gusta documentar y dejar todo por escrito.' },
  { t: 'C', q: 'Prefiero procedimientos claros y checklist.' },
  { t: 'C', q: 'Verifico equipo y material minuciosamente.' },
  { t: 'C', q: 'Me siento cómodo con normas y protocolos.' },
  { t: 'C', q: 'Analizo riesgos con datos y evidencias.' },
  { t: 'C', q: 'Pido precisión en tiempos y tareas.' },
  { t: 'C', q: 'Soy crítico cuando detecto errores.' },
  { t: 'C', q: 'Me cuesta avanzar sin información completa.' },
  { t: 'C', q: 'Disfruto optimizar procesos y métodos.' },
  { t: 'C', q: 'Me organizo con mapas, tracks y waypoints.' },
  { t: 'C', q: 'Prefiero revisar dos veces antes de decidir.' },

  // -------- I (12)
  { t: 'I', q: 'Animo al equipo cuando hay cansancio.' },
  { t: 'I', q: 'Me es fácil conectar y hacer grupo.' },
  { t: 'I', q: 'Transmito entusiasmo antes de una salida.' },
  { t: 'I', q: 'Me gusta contar historias y motivar.' },
  { t: 'I', q: 'Celebro logros y reconozco a otros.' },
  { t: 'I', q: 'Propongo ideas creativas para mejorar.' },
  { t: 'I', q: 'Rompo el hielo con humor o calidez.' },
  { t: 'I', q: 'Invito a participar a quienes están callados.' },
  { t: 'I', q: 'Me gusta organizar momentos sociales.' },
  { t: 'I', q: 'Comunico con entusiasmo lo que viene.' },
  { t: 'I', q: 'Valoro que el ambiente sea divertido.' },
  { t: 'I', q: 'Soy optimista incluso con clima adverso.' },

  // -------- S (12)
  { t: 'S', q: 'Mantengo la calma en situaciones tensas.' },
  { t: 'S', q: 'Me gusta el ritmo constante y previsible.' },
  { t: 'S', q: 'Evito confrontaciones innecesarias.' },
  { t: 'S', q: 'Estoy atento al bienestar emocional del grupo.' },
  { t: 'S', q: 'Soy leal con mi equipo y sostengo acuerdos.' },
  { t: 'S', q: 'Prefiero cambios avisados con anticipación.' },
  { t: 'S', q: 'Escucho y busco puntos en común.' },
  { t: 'S', q: 'Me adapto al paso del grupo para acompañar.' },
  { t: 'S', q: 'Ayudo silenciosamente donde hace falta.' },
  { t: 'S', q: 'Priorizar la armonía del grupo me resulta natural.' },
  { t: 'S', q: 'Me tomo el tiempo para decidir con calma.' },
  { t: 'S', q: 'Sostengo rutinas que traen estabilidad.' },

  // -------- D (13)
  { t: 'D', q: 'Me gusta decidir rápido ante la incertidumbre.' },
  { t: 'D', q: 'Asumo el mando cuando el grupo lo necesita.' },
  { t: 'D', q: 'Disfruto retos físicos y objetivos exigentes.' },
  { t: 'D', q: 'Me mantengo firme frente a obstáculos.' },
  { t: 'D', q: 'Puedo ser directo al comunicar.' },
  { t: 'D', q: 'Me incomoda perder tiempo en vueltas.' },
  { t: 'D', q: 'Prefiero la acción a la discusión larga.' },
  { t: 'D', q: 'No me cuesta confrontar si es necesario.' },
  { t: 'D', q: 'Me oriento por resultados medibles.' },
  { t: 'D', q: 'Me entusiasman metas ambiciosas.' },
  { t: 'D', q: 'Lidero con claridad quién hace qué y cuándo.' },
  { t: 'D', q: 'Tomo decisiones bajo presión.' },
  { t: 'D', q: 'Me motivo cuando hay competencia o marca.' },
];

// Textos de salida por tipo principal
const DESCRIPTORS = {
  D: {
    titulo: 'Dominante (D)',
    aportes: 'Lidera decisiones rápidas, motivador ante retos físicos.',
    fuertes: 'Determinación, foco en resultados, valentía en la acción.',
    mejorar: 'Impaciencia; puede ignorar dudas de otros.',
    recs: 'Hablar claro y directo, reconocer sus logros; pedir feedback en forma breve.'
  },
  I: {
    titulo: 'Influyente (I)',
    aportes: 'Animador del equipo, mantiene la cohesión social.',
    fuertes: 'Carisma, optimismo, comunicación motivadora.',
    mejorar: 'Desorganizado; puede omitir detalles técnicos.',
    recs: 'Involucrarlo en la motivación del grupo; valorar sus ideas creativas.'
  },
  S: {
    titulo: 'Estable (S)',
    aportes: 'Fomenta la constancia, apoyo emocional y solidaridad.',
    fuertes: 'Paciencia, escucha, confiabilidad.',
    mejorar: 'Reacio al cambio; evita confrontaciones.',
    recs: 'Asegurar su tranquilidad, explicarle los cambios con anticipación; agradecer su apoyo.'
  },
  C: {
    titulo: 'Concienzudo (C)',
    aportes: 'Planifica rutas, cuida la seguridad y equipamiento; analítico.',
    fuertes: 'Precisión, método, control de riesgos.',
    mejorar: 'Excesivamente cauteloso; puede ralentizar al grupo.',
    recs: 'Proveerle información detallada, respetar su ritmo; solicitar su ayuda en organización.'
  }
};

// ---------- Render dinámico de preguntas
function renderQuestions() {
  const holder = document.getElementById('questions');
  holder.innerHTML = '';
  QUESTIONS.forEach((item, idx) => {
    const fs = document.createElement('fieldset');
    fs.className = 'question';

    const lg = document.createElement('legend');
    lg.textContent = `${idx + 1}. ${item.q}`;
    fs.appendChild(lg);

    const opts = document.createElement('div');
    opts.className = 'opts';

    // 0 = En desacuerdo | 1 = Neutral | 2 = De acuerdo
    [['0','En desacuerdo'], ['1','Neutral'], ['2','De acuerdo']].forEach(([val, label]) => {
      const lab = document.createElement('label');
      lab.className = 'opt';
      const inp = document.createElement('input');
      inp.type = 'radio';
      inp.name = `q${idx}`;
      inp.value = val;
      if (val === '1') inp.checked = true; // neutral por defecto
      lab.appendChild(inp);
      lab.appendChild(document.createTextNode(label));
      opts.appendChild(lab);
    });

    // Guardamos el trait en dataset para calcular después
    fs.dataset.trait = item.t;
    fs.appendChild(opts);
    holder.appendChild(fs);
  });
}

// ---------- Cálculo DISC
function computeScores() {
  const groups = { D:0, I:0, S:0, C:0 };
  const counts = { D:0, I:0, S:0, C:0 };

  document.querySelectorAll('.question').forEach((fs, idx) => {
    const trait = fs.dataset.trait;
    const selected = document.querySelector(`input[name="q${idx}"]:checked`);
    const val = selected ? Number(selected.value) : 1; // por si acaso -> neutral
    // 0,1,2 => suma directa
    groups[trait] += val;
    counts[trait] += 1;
  });

  // Normalización a % (0..100) con min=0, max=2*items
  const perc = {};
  ['D','I','S','C'].forEach(t => {
    const max = counts[t] * 2;
    perc[t] = max ? Math.round((groups[t] / max) * 100) : 0;
  });

  return perc;
}

// ---------- Brújula DISC (canvas)
function drawCompass(canvas, perc) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2, R = Math.min(W,H)/2 - 18;

  // Clear
  ctx.clearRect(0,0,W,H);

  // Fondo
  ctx.save();
  ctx.translate(cx, cy);

  // circunferencia
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,.25)';
  ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.stroke();

  // ejes
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.beginPath(); ctx.moveTo(-R,0); ctx.lineTo(R,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,-R); ctx.lineTo(0,R); ctx.stroke();

  // cuadrantes
  ctx.font = '700 14px system-ui';
  ctx.fillStyle = 'rgba(255,255,255,.8)';
  ctx.textAlign = 'center';
  ctx.fillText('D', R-14, -6);
  ctx.fillText('I', 6, -R+18);
  ctx.fillText('S', -R+14, 16);
  ctx.fillText('C', -6, R-10);

  // Punto: mapeo vectorial (D vs S) y (I vs C)
  // x -> (D - S), y -> (I - C)
  const x = (perc.D - perc.S) / 100; // -1..1
  const y = (perc.I - perc.C) / 100; // -1..1
  const px = x * R;
  const py = -y * R; // invertimos Y para canvas

  // línea desde centro
  ctx.strokeStyle = '#ffd08a';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(px,py); ctx.stroke();

  // punto
  ctx.fillStyle = '#ffd08a';
  ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.5)';
  ctx.lineWidth = 1; ctx.stroke();

  ctx.restore();
}

// ---------- Mostrar resultados
function showResult() {
  const perc = computeScores();
  // Set textos numéricos
  document.getElementById('pd').textContent = perc.D;
  document.getElementById('pi').textContent = perc.I;
  document.getElementById('ps').textContent = perc.S;
  document.getElementById('pc').textContent = perc.C;

  // Tipo principal
  const order = Object.entries(perc).sort((a,b)=>b[1]-a[1]);
  const winner = order[0][0];
  const d = DESCRIPTORS[winner];

  document.getElementById('resultTitle').textContent = `Resultado: ${d.titulo}`;
  document.getElementById('groupContribution').textContent = d.aportes;
  document.getElementById('strengths').textContent = d.fuertes;
  document.getElementById('toImprove').textContent = d.mejorar;
  document.getElementById('recs').textContent = d.recs;

  // Brújula
  drawCompass(document.getElementById('discCompass'), perc);

  // Mostrar sección
  document.getElementById('result').classList.remove('hidden');

  // Scroll suave
  document.getElementById('result').scrollIntoView({ behavior:'smooth', block:'start' });
}

// ---------- Reset
function resetForm() {
  document.getElementById('result').classList.add('hidden');
  // Reiniciar a Neutral
  QUESTIONS.forEach((_, idx) => {
    const neutral = document.querySelector(`input[name="q${idx}"][value="1"]`);
    if (neutral) neutral.checked = true;
  });
  window.scrollTo({top:0,behavior:'smooth'});
}

// ---------- Init
document.addEventListener('DOMContentLoaded', () => {
  renderQuestions();
  document.getElementById('seeResult').addEventListener('click', showResult);
  document.getElementById('resetForm').addEventListener('click', resetForm);
});
