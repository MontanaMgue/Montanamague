/* ==========
   DISC 50 preguntas (3 opciones)
   Escala: 1=En desacuerdo, 2=Neutral, 3=De acuerdo
   Incluye: Brújula/Radar DISC con Chart.js
   ==========
*/

const QUESTIONS = [
  // C — Analítico/Concienzudo (12)
  {t:"Me doy cuenta de errores pequeños en mapas, datos o equipo.",g:"C"},
  {t:"Antes de salir reviso listas y verifico que todo esté correcto.",g:"C"},
  {t:"Me gusta seguir procedimientos y estándares claros.",g:"C"},
  {t:"Prefiero tomar decisiones con datos y no por intuición.",g:"C"},
  {t:"Disfruto planificar rutas con precisión y alternativas.",g:"C"},
  {t:"Me concentro en mejorar sistemas y procesos del grupo.",g:"C"},
  {t:"Puedo ser crítico cuando noto fallas que afectan la seguridad.",g:"C"},
  {t:"Me siento bien cuando todo está ordenado y controlado.",g:"C"},
  {t:"Ante una duda técnica, investigo a fondo antes de actuar.",g:"C"},
  {t:"Me mantengo objetivo al evaluar riesgos en la montaña.",g:"C"},
  {t:"Valoro las lecciones aprendidas y los registros de cada salida.",g:"C"},
  {t:"Chequeo doble las condiciones del clima y del equipo.",g:"C"},

  // I — Influyente/Inspirador (13)
  {t:"Me entusiasma animar al equipo y mantener el ánimo alto.",g:"I"},
  {t:"Conecto fácilmente con personas nuevas en el grupo.",g:"I"},
  {t:"Me gusta proponer ideas creativas para actividades.",g:"I"},
  {t:"Disfruto contar historias y hacer amena la caminata.",g:"I"},
  {t:"Me nace reconocer los logros de los demás.",g:"I"},
  {t:"Valoro la cohesión social del grupo tanto como la meta.",g:"I"},
  {t:"Siento que puedo motivar cuando el grupo decae.",g:"I"},
  {t:"Suelo ofrecer ayuda incluso antes de que me la pidan.",g:"I"},
  {t:"Soy optimista y busco el lado positivo en dificultades.",g:"I"},
  {t:"Me energizan los proyectos nuevos y desafiantes.",g:"I"},
  {t:"Me adapto a distintos roles si eso ayuda al equipo.",g:"I"},
  {t:"Me gusta aprender de otros y compartir lo que sé.",g:"I"},
  {t:"Valoro que el ambiente sea alegre y bien comunicado.",g:"I"},

  // D — Dominante/Decisor (13)
  {t:"Asumo el mando cuando la situación lo requiere.",g:"D"},
  {t:"Tomo decisiones con rapidez en terreno.",g:"D"},
  {t:"No me incomoda la confrontación respetuosa si hace falta.",g:"D"},
  {t:"Me gustan los retos físicos y claros objetivos de cumbre.",g:"D"},
  {t:"Soy asertivo al expresar mis opiniones.",g:"D"},
  {t:"Busco resultados y medir avances del equipo.",g:"D"},
  {t:"Puedo seguir adelante aun con incertidumbre.",g:"D"},
  {t:"Defiendo al grupo y a quienes dependen de mí.",g:"D"},
  {t:"Me siento cómodo tomando responsabilidad por decisiones.",g:"D"},
  {t:"Pongo manos a la obra y movilizo recursos rápido.",g:"D"},
  {t:"Cuando llego a una meta, busco la siguiente.",g:"D"},
  {t:"Puedo negociar y conseguir lo que el grupo necesita.",g:"D"},
  {t:"Me enfoco en resolver y no quedarme en el problema.",g:"D"},

  // S — Estable/Sereno (12)
  {t:"Brindo apoyo emocional y práctico de manera constante.",g:"S"},
  {t:"Evito conflictos y prefiero el acuerdo común.",g:"S"},
  {t:"Me gusta que el plan sea previsible y sin sorpresas.",g:"S"},
  {t:"Escucho a todos antes de dar mi opinión.",g:"S"},
  {t:"Soy leal al grupo y a quien confío como líder.",g:"S"},
  {t:"Me tomo mi tiempo para decidir, evitando errores.",g:"S"},
  {t:"Avisar cambios con anticipación me da tranquilidad.",g:"S"},
  {t:"Ayudo a que todos se sientan incluidos en la conversación.",g:"S"},
  {t:"Estoy dispuesto a ceder por la armonía del grupo.",g:"S"},
  {t:"Pongo paz cuando hay tensiones.",g:"S"},
  {t:"Prefiero el ritmo parejo antes que los apuros.",g:"S"},
  {t:"Me enfoco en que cada salida sea segura y humana.",g:"S"},
];

// Índices por grupo
const MAP = {C:[], I:[], D:[], S:[]};
QUESTIONS.forEach((q, i)=> MAP[q.g].push(i));

// Textos por tipo
const TEXT = {
  D:{t:"Dominante (D)",
     a:"Lidera decisiones rápidas, motivador ante retos físicos.",
     d:"Impaciente, puede ignorar dudas de otros.",
     r:"Hablar claro y directo; reconocer sus logros; pedir feedback breve."},
  I:{t:"Influyente (I)",
     a:"Animador del equipo, genera cohesión social.",
     d:"Puede omitir detalles técnicos u orden.",
     r:"Valorar sus ideas creativas; darle espacio social y de comunicación."},
  S:{t:"Estable (S)",
     a:"Aporta constancia, apoyo emocional y solidaridad.",
     d:"Evita confrontaciones y cambios bruscos.",
     r:"Explicar cambios con anticipación; agradecer su apoyo y continuidad."},
  C:{t:"Concienzudo (C)",
     a:"Planifica rutas, cuida seguridad y equipamiento; analítico.",
     d:"Excesivamente cauteloso; puede ralentizar.",
     r:"Proveer información detallada y pedir ayuda en la organización."}
};

// Render dinámico del formulario
const form = document.getElementById("discTestForm");
QUESTIONS.forEach((q, i)=>{
  const wrap = document.createElement("div");
  wrap.className = "q";
  wrap.innerHTML = `
    <p class="title">${i+1}. ${q.t}</p>
    <ul class="options">
      <li>
        <label class="option">
          <input type="radio" name="q${i}" value="1">
          En desacuerdo
        </label>
      </li>
      <li>
        <label class="option">
          <input type="radio" name="q${i}" value="2" checked>
          Neutral
        </label>
      </li>
      <li>
        <label class="option">
          <input type="radio" name="q${i}" value="3">
          De acuerdo
        </label>
      </li>
    </ul>
  `;
  form.appendChild(wrap);
});

// Cálculo DISC
function calcularPerfil(){
  const vals = {};
  for(let i=0;i<QUESTIONS.length;i++){
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    vals[i] = sel ? Number(sel.value) : 2;
  }
  const sum = {D:0,I:0,S:0,C:0};
  for(const g of Object.keys(MAP)){
    MAP[g].forEach(idx=> sum[g] += vals[idx]);
  }
  const max = {D:MAP.D.length*3, I:MAP.I.length*3, S:MAP.S.length*3, C:MAP.C.length*3};
  const pct = {
    D: Math.round(sum.D/max.D*100),
    I: Math.round(sum.I/max.I*100),
    S: Math.round(sum.S/max.S*100),
    C: Math.round(sum.C/max.C*100),
  };
  const orden = Object.entries(pct).sort((a,b)=>b[1]-a[1]);
  return {pct, top:orden[0][0]};
}

// DOM referencias
const resultBox = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");
const legend = document.getElementById("chartLegend");

// Chart.js – Brújula
let discChart = null;
function renderChart(pct){
  const ctx = document.getElementById("discChart");
  const data = [pct.D, pct.I, pct.S, pct.C];
  if(discChart){
    discChart.data.datasets[0].data = data;
    discChart.update();
  }else{
    discChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["D", "I", "S", "C"],
        datasets: [{
          label: "Perfil DISC (%)",
          data,
          borderWidth: 2,
          borderColor: "rgba(233,107,0,0.9)",
          backgroundColor: "rgba(233,107,0,.18)",
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: [
            getComputedStyle(document.documentElement).getPropertyValue('--d').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--i').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--s').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--c').trim()
          ],
          pointBorderColor: "#fff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 100,
            angleLines: { color: "rgba(255,255,255,.18)" },
            grid: { color: "rgba(255,255,255,.12)" },
            pointLabels: {
              color: "#fff",
              font: { weight:"700", size:13 }
            },
            ticks: {
              backdropColor: "transparent",
              color: "rgba(255,255,255,.8)",
              stepSize: 20
            }
          }
        },
        plugins: {
          legend: { display:false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.formattedValue}%`
            }
          }
        }
      }
    });
  }

  // Leyenda con colores y %
  legend.innerHTML = `
    <li><span class="dot d"></span><strong>D</strong> — ${pct.D}%</li>
    <li><span class="dot i"></span><strong>I</strong> — ${pct.I}%</li>
    <li><span class="dot s"></span><strong>S</strong> — ${pct.S}%</li>
    <li><span class="dot c"></span><strong>C</strong> — ${pct.C}%</li>
  `;
}

// Mostrar resultado
submitBtn.addEventListener("click", ()=>{
  const {pct, top} = calcularPerfil();
  const T = TEXT[top];
  document.getElementById("resultType").textContent = `${T.t} — ${pct[top]}%`;
  document.getElementById("groupContribution").textContent = T.a;
  document.getElementById("strengths").textContent = T.d;
  document.getElementById("toImprove").textContent = T.r;

  renderChart(pct);
  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({behavior:"smooth"});
});

// Reiniciar
restartBtn.addEventListener("click", ()=>{
  document.querySelectorAll('input[type="radio"][value="2"]').forEach(r=> r.checked = true);
  resultBox.classList.add("hidden");
  if(discChart){
    discChart.data.datasets[0].data = [0,0,0,0];
    discChart.update();
    legend.innerHTML = "";
  }
  window.scrollTo({top:0, behavior:"smooth"});
});


