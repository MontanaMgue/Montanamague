/* =========================================================
   DISC 48 ítems – balanceados (12 por estilo) + invertidos
   Escala (3 ptos): En desacuerdo = 0, Neutral = 1, De acuerdo = 2
   En invertidas se invierte: 2→0, 1→1, 0→2
   ========================================================= */

const QUESTIONS = [
  /* ---------- D (Decisión) ---------- */
  {t:'D', q:'Ante un imprevisto suelo decidir rápido y pasar a la acción.', inv:false},
  {t:'D', q:'Si una consigna es confusa, tomo la iniciativa para definirla con claridad.', inv:false},
  {t:'D', q:'Cuando algo es injusto, hablo aunque haya tensión.', inv:false},
  {t:'D', q:'Prefiero delegar decisiones importantes a otra persona.', inv:true},
  {t:'D', q:'Bajo tiempo limitado me resulta natural priorizar y avanzar.', inv:false},
  {t:'D', q:'Me incomoda poner límites aunque sea necesario.', inv:true},
  {t:'D', q:'Disfruto la sensación de “resolver” y cerrar temas.', inv:false},
  {t:'D', q:'Evito competir incluso en juegos o dinámicas simples.', inv:true},
  {t:'D', q:'Si el plan A falla, propongo opciones sin quedarme bloqueado.', inv:false},
  {t:'D', q:'Me molesta asumir el rol de referencia cuando el grupo lo necesita.', inv:true},
  {t:'D', q:'Frente a riesgo moderado, evalúo y asumo para lograr el objetivo.', inv:false},
  {t:'D', q:'En emergencias espero a que otro lidere la situación.', inv:true},

  /* ---------- I (Interacción) ---------- */
  {t:'I', q:'Me sale motivar al grupo con mensajes y buen clima.', inv:false},
  {t:'I', q:'Me resulta sencillo iniciar conversaciones con gente nueva.', inv:false},
  {t:'I', q:'Suelo proponer ideas creativas para mejorar la experiencia.', inv:false},
  {t:'I', q:'Prefiero evitar hablar en grupo incluso en contextos informales.', inv:true},
  {t:'I', q:'Cuando hay tensión, ayudo a distender y conectar a las personas.', inv:false},
  {t:'I', q:'Me cuesta pedir ayuda o apoyo a otros.', inv:true},
  {t:'I', q:'En actividades sociales, me energiza conocer diferentes personas.', inv:false},
  {t:'I', q:'Evito contar mis ideas por temor a ser juzgado.', inv:true},
  {t:'I', q:'Uso el humor de forma cuidadosa para mantener el ánimo.', inv:false},
  {t:'I', q:'Me siento incómodo proponiendo actividades al grupo.', inv:true},
  {t:'I', q:'Valoro mucho celebrar pequeños logros con la gente.', inv:false},
  {t:'I', q:'Prefiero trabajar en silencio y sin intercambio con el equipo.', inv:true},

  /* ---------- S (Serenidad) ---------- */
  {t:'S', q:'Mantengo la calma y la constancia cuando el cansancio aparece.', inv:false},
  {t:'S', q:'Me es natural acompañar a quien va más lento sin perder la paciencia.', inv:false},
  {t:'S', q:'Prefiero sostener el plan antes que cambiarlo todo el tiempo.', inv:false},
  {t:'S', q:'Me cuesta escuchar activamente cuando alguien necesita hablar.', inv:true},
  {t:'S', q:'Busco acuerdos y evito escalar conflictos innecesarios.', inv:false},
  {t:'S', q:'Suelo abandonar tareas si no veo resultados inmediatos.', inv:true},
  {t:'S', q:'Cuando anochece o hay viento, mantengo el foco y el ritmo seguro.', inv:false},
  {t:'S', q:'Me irrito con facilidad frente a pequeñas demoras.', inv:true},
  {t:'S', q:'Me adapto al paso del grupo sin competir.', inv:false},
  {t:'S', q:'Si cambian las condiciones, me bloqueo por completo.', inv:true},
  {t:'S', q:'Aporto apoyo emocional cuando alguien lo necesita.', inv:false},
  {t:'S', q:'Me cuesta sostener rutinas simples durante varios días.', inv:true},

  /* ---------- C (Cumplimiento / Concienzudo) ---------- */
  {t:'C', q:'Reviso el equipo y la seguridad antes de salir.', inv:false},
  {t:'C', q:'Prefiero decisiones basadas en datos y señales del entorno.', inv:false},
  {t:'C', q:'Sigo procedimientos y checklist sin saltearme pasos.', inv:false},
  {t:'C', q:'Me siento cómodo improvisando sin información.', inv:true},
  {t:'C', q:'Me gusta registrar tiempos, distancias y altimetría.', inv:false},
  {t:'C', q:'Evito planificar porque me limita la espontaneidad.', inv:true},
  {t:'C', q:'Cuando hay riesgo, freno y re-evalúo con calma.', inv:false},
  {t:'C', q:'Ignoro detalles menores porque no afectan en nada.', inv:true},
  {t:'C', q:'Organizo el material para encontrar todo rápido.', inv:false},
  {t:'C', q:'Me molesta que me pidan precisión o estándares.', inv:true},
  {t:'C', q:'Mejoro procesos para que el grupo sea más seguro y eficiente.', inv:false},
  {t:'C', q:'Prefiero no cuestionar nada aunque note un error.', inv:true},
];

/* ========= Render dinámico ========= */
const form = document.getElementById('discForm');
const btnVer = document.getElementById('btnVer');
const btnReset = document.getElementById('btnReset');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

const resultBox = document.getElementById('result');
const headline = document.getElementById('resultHeadline');
const pContrib = document.getElementById('groupContribution');
const pStrengths = document.getElementById('strengths');
const pImprove = document.getElementById('toImprove');
const dot = document.getElementById('compassDot');
const compass = document.getElementById('compass');

/* Mezcla las preguntas para evitar sesgos de orden */
const shuffled = QUESTIONS
  .map((x,i)=>({x, r:Math.random(), i}))
  .sort((a,b)=>a.r-b.r)
  .map(o=>o.x);

function render() {
  form.innerHTML = '';
  shuffled.forEach((item, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'question';
    wrap.innerHTML = `
      <h4>${idx+1}. ${item.q}</h4>
      <ul class="opts">
        <li><label><input type="radio" name="q${idx}" value="0"> En desacuerdo</label></li>
        <li><label><input type="radio" name="q${idx}" value="1" checked> Neutral</label></li>
        <li><label><input type="radio" name="q${idx}" value="2"> De acuerdo</label></li>
      </ul>
    `;
    form.appendChild(wrap);
  });
  updateProgress();
}

function updateProgress() {
  const total = shuffled.length;
  let answered = 0;
  shuffled.forEach((_, i) => {
    const sel = form.querySelector(`input[name="q${i}"]:checked`);
    if (sel) answered++;
  });
  progressBar.style.width = `${Math.round(answered/total*100)}%`;
  progressText.textContent = `${answered} / ${total}`;
}

form.addEventListener('change', updateProgress);
btnReset.addEventListener('click', () => { render(); resultBox.classList.add('hidden'); window.scrollTo({top:0,behavior:'smooth'}); });

btnVer.addEventListener('click', () => {
  const scores = {D:0,I:0,S:0,C:0};
  const perItemMax = 2;

  shuffled.forEach((item, i) => {
    const val = Number(form.querySelector(`input[name="q${i}"]:checked`)?.value ?? 1);
    const v = item.inv ? (perItemMax - val) : val; // invertir donde aplica
    scores[item.t] += v;
  });

  // Normalización a porcentaje por eje (cada eje tiene 12 ítems → máx 24 puntos)
  const MAX = 12*2;
  const pct = {
    D: Math.round((scores.D / MAX) * 100),
    I: Math.round((scores.I / MAX) * 100),
    S: Math.round((scores.S / MAX) * 100),
    C: Math.round((scores.C / MAX) * 100),
  };

  // Top 2
  const order = Object.entries(pct).sort((a,b)=>b[1]-a[1]); // [['C',88], ...]
  const [p1,p2] = order.slice(0,2);

  // Texto técnico-profesional
  const texts = buildTechnicalTexts();
  const k = `${p1[0]}-${p2[0]}`;
  const t = texts[k] ?? texts[`${p2[0]}-${p1[0]}`] ?? texts[p1[0]];

  headline.innerHTML = `
    <strong>Dominante:</strong> ${labelOf(p1[0])} (${p1[1]}%) &nbsp; | &nbsp;
    <strong>Secundario:</strong> ${labelOf(p2[0])} (${p2[1]}%)
  `;
  pContrib.textContent = t.contrib;
  pStrengths.textContent = t.strengths;
  pImprove.textContent = t.improve;

  // Colocar marcador en la brújula (coordenadas en la imagen)
  placeDotOnCompass(pct);

  resultBox.classList.remove('hidden');
  resultBox.scrollIntoView({behavior:'smooth'});
});

/* ---------------------------------------------
   Coloca el punto sobre la imagen 'disc.png'
   Cuadrantes (x,y) respecto al centro:
   D = (-1,-1), I = ( +1,-1), S = (-1,+1), C = (+1,+1)
   Hacemos un centroide ponderado por porcentajes
   y lo mapeamos a [0..100]%
   --------------------------------------------- */
function placeDotOnCompass(pct){
  // pesos 0..1
  const wD = pct.D/100, wI = pct.I/100, wS = pct.S/100, wC = pct.C/100;
  const sum = wD+wI+wS+wC || 1;

  const x = (-1*wD + 1*wI -1*wS + 1*wC) / sum; // -1..1
  const y = (-1*wD -1*wI +1*wS + 1*wC) / sum; // -1..1 (arriba negativo)

  // de [-1..1] a [0..100] con margen para no pegar al borde
  const margin = 6; // %
  const toPct = v => 50 + v*44; // 44% ≈ deja ~6% de margen
  const left = toPct(x);
  const top  = toPct(y);

  dot.style.left = `${left}%`;
  dot.style.top  = `${top}%`;
}

/* Etiquetas amigables */
function labelOf(k){
  return ({D:'Decisión (D)', I:'Interacción (I)', S:'Serenidad (S)', C:'Cumplimiento (C)'}[k]);
}

/* Bloque de textos técnico-profesionales por combinación */
function buildTechnicalTexts(){
  // Base por eje (fallback)
  const base = {
    D: {
      contrib:'Impulsa decisiones claras y oportunas; sostiene el foco del objetivo.',
      strengths:'Dirección, priorización, tolerancia al riesgo controlado.',
      improve:'Modular la urgencia y escuchar objeciones antes de cerrar.'
    },
    I: {
      contrib:'Activa la comunicación y la cohesión social del grupo.',
      strengths:'Influencia positiva, creatividad, motivación.',
      improve:'Cuidar la dispersión y terminar lo empezado.'
    },
    S: {
      contrib:'Aporta ritmo constante, soporte emocional y estabilidad.',
      strengths:'Paciencia, escucha, trabajo en equipo.',
      improve:'Evitar postergar decisiones necesarias en momentos críticos.'
    },
    C: {
      contrib:'Eleva estándares de seguridad, orden y calidad.',
      strengths:'Planificación, control de riesgos, precisión.',
      improve:'No sobrerretrasar por exceso de análisis cuando el tiempo apremia.'
    }
  };

  // Combinaciones Top1–Top2
  const combo = {
    'D-I': {
      contrib:'Decide y además contagia movimiento; útil en arranques y cambios.',
      strengths:'Velocidad con comunicación; liderazgo visible en situaciones abiertas.',
      improve:'Proteger la calidad y cerrar detalles antes de ejecutar.'
    },
    'D-S': {
      contrib:'Combina determinación con estabilidad; mantiene el rumbo sin sobresaltos.',
      strengths:'Firmeza serena, priorización segura en condiciones variables.',
      improve:'Pedir y dar feedback para no caer en rigidez.'
    },
    'D-C': {
      contrib:'Decide con marco técnico; útil en maniobras críticas y protocolos.',
      strengths:'Foco + estándares; excelente en riesgos moderados-altos.',
      improve:'Evitar exceso de control que frene al equipo.'
    },
    'I-D': {
      contrib:'Activa al grupo y moviliza hacia el objetivo.',
      strengths:'Influencia + impulso; ideal para motivar con claridad.',
      improve:'Asegurar procedimientos y revisar riesgos antes de avanzar.'
    },
    'I-S': {
      contrib:'Conecta personas y cuida el clima, sosteniendo el ritmo.',
      strengths:'Empatía práctica; comunicación clara y amable.',
      improve:'Evitar la sobre-adaptación que diluya las decisiones.'
    },
    'I-C': {
      contrib:'Comunica con datos; traslada estándares de forma accesible.',
      strengths:'Persuasión informada, buena didáctica.',
      improve:'No quedar en presentaciones eternas: pasar a la acción.'
    },
    'S-D': {
      contrib:'Ritmo constante con capacidad de decidir cuando hace falta.',
      strengths:'Calma bajo presión + foco.',
      improve:'No ceder demasiado en pos de la armonía.'
    },
    'S-I': {
      contrib:'Estabilidad con integración social; ideal para trabajos continuos.',
      strengths:'Escucha + acompañamiento; cohesiona sin estridencias.',
      improve:'Marcar límites y tiempos cuando el grupo se dispersa.'
    },
    'S-C': {
      contrib:'Orden y constancia; sostiene checklists y rutinas seguras.',
      strengths:'Paciencia metódica, prevención.',
      improve:'Evitar la rigidez si el contexto cambia rápido.'
    },
    'C-D': {
      contrib:'Protocolos claros que habilitan decisiones firmes.',
      strengths:'Análisis + ejecución segura.',
      improve:'No sobredimensionar el riesgo cuando el tiempo apremia.'
    },
    'C-I': {
      contrib:'Precisión comunicada; vuelve simple lo complejo.',
      strengths:'Claridad técnica, pedagogía.',
      improve:'Evitar la sobreexplicación que retrase el avance.'
    },
    'C-S': {
      contrib:'Calidad sostenida en el tiempo; base segura del equipo.',
      strengths:'Orden, documentación, prevención de errores.',
      improve:'Sumar flexibilidad en cambios repentinos.'
    }
  };

  // Devuelve combinación o base por eje
  const out = {};
  // Combos
  Object.keys(combo).forEach(k=>out[k]=combo[k]);
  // Ejes
  Object.entries(base).forEach(([k,v])=>out[k]=v);
  return out;
}

/* Inicio */
render();

