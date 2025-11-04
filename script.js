// script.js — Test DISC (versión montaña) con escala de 3 puntos
// Copiar y pegar tal cual junto a tu index.html (no requiere dependencias).

(function () {
  const form = document.getElementById("discTestForm");
  const resultBox = document.getElementById("result");
  const resultType = document.getElementById("resultType");
  const groupContribution = document.getElementById("groupContribution");
  const strengths = document.getElementById("strengths"); // aquí mostraremos Debilidades
  const toImprove = document.getElementById("toImprove"); // aquí mostraremos Recomendaciones

  // Mapeo de ítems -> escalas DISC (usa tus índices de preguntas)
  const SCALES = {
    C: [0,1,2,3,4,5,6,7,8,9,10, 37,38,39,40,41,42,43,44,45, 46,47,48,49,50,51,52,53],
    S: [11,12,13,14,15,16,17,18,19, 74,75,76,77,78,79,80,81, 82,83,84,85,86,87,88,89, 90,91,92,93,94,95,96,97,98],
    D: [21,22,23,24,25,26,27,28, 65,66,67,68,69,70,71,72,73],
    I: [29,30,31,32,33,34,35,36, 54,55,56,57,58,59,60,61,62,63,64],
  };

  // Ítems invertidos (si en el futuro agregas reversos, pon sus índices aquí)
  const REVERSED = new Set([]);

  // Etiquetas
  const LABELS = {
    D: { name: "Dominante (D)", short: "Dominante" },
    I: { name: "Influyente (I)", short: "Influyente" },
    S: { name: "Estable (S)",    short: "Estable"    },
    C: { name: "Concienzudo (C)",short: "Concienzudo"},
  };

  // Textos solicitados
  const CONTRIBUTIONS = {
    D: "Lidera decisiones rápidas, motivador ante retos físicos.",
    I: "Animador del equipo, mantiene la cohesión social.",
    S: "Fomenta la constancia, apoyo emocional y solidaridad.",
    C: "Planifica rutas, cuida la seguridad y el equipamiento, analítico."
  };

  const WEAKNESSES = {
    D: "Impaciente; puede ignorar dudas de otros.",
    I: "Desorganizado; puede omitir detalles técnicos.",
    S: "Reacio al cambio; evita confrontaciones.",
    C: "Excesivamente cauteloso; puede ralentizar al grupo."
  };

  const RECOMMEND = {
    D: "Hablar claro y directo; reconocer sus logros; pedir feedback en forma breve.",
    I: "Involucrarlo en la motivación del grupo; valorar sus ideas creativas.",
    S: "Asegurar su tranquilidad; explicar cambios con anticipación; agradecer su apoyo.",
    C: "Proveer información detallada; respetar su ritmo; solicitar su ayuda en organización."
  };

  // Utilidades
  function getAllQuestionNames() {
    const names = new Set();
    form.querySelectorAll('input[type="radio"]').forEach(r => {
      if (r.name && /^q\d+$/.test(r.name)) names.add(r.name);
    });
    return Array.from(names).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  }

  // Mapea valores 1–5 a 1–3 automáticamente (1–2=En desacuerdo, 3=Neutral, 4–5=De acuerdo).
  function toThreePoint(v) {
    if (v == null) return null;
    if (v >= 1 && v <= 3) return v;     // ya es 1–3
    if (v >= 1 && v <= 5) return v <= 2 ? 1 : (v === 3 ? 2 : 3);
    return null;
  }

  function readAnswers() {
    const values = {};
    form.querySelectorAll('input[type="radio"]:checked').forEach(r => {
      values[r.name] = toThreePoint(Number(r.value));
    });
    return values;
  }

  function validateComplete() {
    for (const n of getAllQuestionNames()) {
      if (!form.querySelector(`input[name="${n}"]:checked`)) return false;
    }
    return true;
  }

  function scoreScale(values, indices) {
    let sum = 0;
    const max = indices.length * 3; // escala 1–3
    indices.forEach(i => {
      const v = values[`q${i}`];
      if (typeof v === "number") {
        const adjusted = REVERSED.has(i) ? (4 - v) : v; // invierte en 1–3 si corresponde
        sum += adjusted;
      }
    });
    const pct = Math.round((sum / max) * 100);
    return { sum, max, pct };
  }

  function computeProfile(values) {
    const byScale = {};
    Object.keys(SCALES).forEach(k => byScale[k] = scoreScale(values, SCALES[k]));
    const ordered = Object.entries(byScale)
      .sort((a, b) => b[1].pct - a[1].pct)
      .map(([scale, stats]) => ({ scale, ...stats }));
    return { byScale, ordered };
  }

  function buildMessages(top1, top2) {
    const code = `${top1.scale}${top2 ? top2.scale : ""}`;
    const title = top2
      ? `${LABELS[top1.scale].short} + ${LABELS[top2.scale].short} (${code})`
      : `${LABELS[top1.scale].name}`;

    const contrib = [CONTRIBUTIONS[top1.scale], top2 ? CONTRIBUTIONS[top2.scale] : ""]
      .filter(Boolean).join(" ");
    const weak = WEAKNESSES[top1.scale];
    const recs = RECOMMEND[top1.scale];

    return { title, contrib, weak, recs, top1Pct: top1.pct, top2Pct: top2 ? top2.pct : null };
  }

  // Submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateComplete()) {
      alert("Faltan respuestas. Por favor, completá todas las preguntas.");
      const firstMissing = getAllQuestionNames()
        .find(n => !form.querySelector(`input[name="${n}"]:checked`));
      if (firstMissing) {
        const el = form.querySelector(`input[name="${firstMissing}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const values = readAnswers();
    const { ordered } = computeProfile(values);
    const top1 = ordered[0];
    const top2 = ordered[1];

    const { title, contrib, weak, recs, top1Pct, top2Pct } = buildMessages(top1, top2);

    resultType.textContent = top2Pct != null
      ? `${title} — ${top1Pct}% / ${top2Pct}%`
      : `${title} — ${top1Pct}%`;
    groupContribution.textContent = contrib;
    strengths.textContent = weak;   // Debilidades
    toImprove.textContent = recs;   // Recomendaciones

    resultBox.classList.remove("hidden");
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });

    console.info("DISC orientativo (3 puntos). No diagnóstico; varía por rol/contexto/estrés.");
  });
})();
