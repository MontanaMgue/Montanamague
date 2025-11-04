// 1) Transforma cada <label + select> en un fieldset con 3 radios
(function toThreeOptions(){
  const form = document.getElementById('discTestForm');
  if(!form) return;

  // Recolectamos pares label+select en orden
  const nodes = Array.from(form.children);
  for (let i = 0; i < nodes.length; i++) {
    const label = nodes[i];
    const select = nodes[i+1];
    if (!label || !select || label.tagName !== 'LABEL' || select.tagName !== 'SELECT') continue;

    const name = select.getAttribute('name');
    const legendText = label.textContent.trim();

    // Fieldset
    const fs = document.createElement('fieldset');
    fs.className = 'question-block';
    fs.innerHTML = `<legend>${legendText}</legend>`;

    // Lista de opciones
    const ul = document.createElement('ul');
    ul.className = 'options';
    const opts = [
      { value: '1', label: 'En desacuerdo' },
      { value: '2', label: 'Neutral' },
      { value: '3', label: 'De acuerdo' },
    ];
    opts.forEach((o, idx) => {
      const li = document.createElement('li');
      const id = `${name}_${o.value}`;
      li.innerHTML = `
        <label for="${id}">
          <input type="radio" id="${id}" name="${name}" value="${o.value}" ${idx===1?'checked':''} required />
          ${o.label}
        </label>`;
      ul.appendChild(li);
    });

    fs.appendChild(ul);

    // Reemplazo en el DOM
    form.insertBefore(fs, label);
    form.removeChild(label);
    form.removeChild(select);
  }

  // Botón enviar (si no existe)
  if (!form.querySelector('button[type="submit"]')) {
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Ver Resultado';
    form.appendChild(submit);
  }
})();

// 2) Mapeo de preguntas a escalas DISC
// Heurística basada en los bloques temáticos del cuestionario original
const R = (a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const MAP = {
  C: [ ...R(0,10), ...R(37,45) ],                     // Detalle, análisis, objetividad
  S: [ ...R(46,53), ...R(74,89) ],                    // Seguridad/estabilidad + armonía/paz
  I: [ ...R(11,20), ...R(29,36), ...R(54,64), ...R(90,98) ], // Afecto, creatividad, sociabilidad, ayuda
  D: [ ...R(21,28), ...R(65,73) ]                     // Logro/ambición + decisión/liderazgo
};

// 3) Textos del resultado (tu versión montaña)
const TEXTS = {
  D: {
    titulo: 'Dominante (D)',
    aporte: 'Lidera decisiones rápidas, motivador ante retos físicos.',
    debil: 'Impaciente, puede ignorar dudas de otros.',
    recs: 'Hablar claro y directo, reconocer sus logros; pedir feedback en forma breve.'
  },
  I: {
    titulo: 'Influyente (I)',
    aporte: 'Animador del equipo, mantiene la cohesión social.',
    debil: 'Desorganizado, puede omitir detalles técnicos.',
    recs: 'Involucrarlo en la motivación del grupo; valorar sus ideas creativas.'
  },
  S: {
    titulo: 'Estable (S)',
    aporte: 'Fomenta la constancia, apoyo emocional y solidaridad.',
    debil: 'Reacio al cambio, evita confrontaciones.',
    recs: 'Asegurar su tranquilidad, explicar cambios con anticipación; agradecer su apoyo.'
  },
  C: {
    titulo: 'Concienzudo (C)',
    aporte: 'Planifica rutas, cuida la seguridad y equipamiento; analítico.',
    debil: 'Excesivamente cauteloso, puede ralentizar al grupo.',
    recs: 'Proveerle información detallada, respetar su ritmo; pedir ayuda en organización.'
  }
};

// 4) Scoring
function calcScores() {
  const scores = {D:0, I:0, S:0, C:0};
  const totalBy = {D:MAP.D.length, I:MAP.I.length, S:MAP.S.length, C:MAP.C.length};

  // Recorremos todas las respuestas
  const form = document.getElementById('discTestForm');
  const inputs = form.querySelectorAll('input[type="radio"]:checked');
  const values = {}; // name -> value
  inputs.forEach(i => { values[i.name] = Number(i.value); });

  // Función que suma un set de ítems a una escala
  function sumSet(scale, arr){
    arr.forEach(idx=>{
      const name = 'q'+idx;
      const v = values[name];
      if (v==null) return;
      // v: 1 (En desacuerdo), 2 (Neutral), 3 (De acuerdo)
      scores[scale] += v;
    });
  }

  sumSet('C', MAP.C);
  sumSet('S', MAP.S);
  sumSet('I', MAP.I);
  sumSet('D', MAP.D);

  // Normalizamos 0..100 para mostrar bonito
  const norm = {};
  Object.keys(scores).forEach(k=>{
    const max = totalBy[k]*3;
    norm[k] = Math.round((scores[k] / max) * 100);
  });

  // Mayoría
  const top = Object.entries(norm).sort((a,b)=>b[1]-a[1])[0][0];
  return {top, norm};
}

// 5) Render resultado
function renderResult({top, norm}){
  const res = document.getElementById('result');
  const t = TEXTS[top];

  document.getElementById('resultType').textContent = `${t.titulo} — ${norm[top]}%`;
  document.getElementById('groupContribution').textContent = t.aporte;
  document.getElementById('strengths').textContent = t.debil;
  document.getElementById('toImprove').textContent = t.recs;

  res.classList.remove('hidden');
  res.scrollIntoView({behavior:'smooth'});
}

// 6) Envío y reinicio
document.getElementById('discTestForm').addEventListener('submit', function(e){
  e.preventDefault();
  renderResult(calcScores());
});

document.getElementById('result').addEventListener('click', function(e){
  if (e.target.id === 'restartBtn'){
    // Reset form (marca Neutral)
    const form = document.getElementById('discTestForm');
    form.querySelectorAll('input[type="radio"][value="2"]').forEach(r=>{
      r.checked = true;
    });
    document.getElementById('result').classList.add('hidden');
    window.scrollTo({top:0, behavior:'smooth'});
  }
});

