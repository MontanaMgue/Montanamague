
document.getElementById("discTestForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    let scores = { D: 0, I: 0, S: 0, C: 0 };
    let total = 0;

    for (let [key, value] of formData.entries()) {
        let val = parseInt(value);
        total += val;
        if (key % 4 === 0) scores.C += val;
        else if (key % 4 === 1) scores.I += val;
        else if (key % 4 === 2) scores.D += val;
        else if (key % 4 === 3) scores.S += val;
    }

    let resultType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    const resultMap = {
        D: {
            type: "Dominante (D)",
            groupContribution: "Liderazgo en situaciones críticas de montaña.",
            strengths: "Decisión, coraje, iniciativa.",
            toImprove: "Escucha, empatía, delegar."
        },
        I: {
            type: "Influyente (I)",
            groupContribution: "Motiva al grupo y mantiene el ánimo alto.",
            strengths: "Comunicación, entusiasmo, sociabilidad.",
            toImprove: "Atención a detalles, constancia."
        },
        S: {
            type: "Estable (S)",
            groupContribution: "Brinda apoyo constante y genera confianza.",
            strengths: "Lealtad, colaboración, armonía.",
            toImprove: "Adaptación al cambio, iniciativa."
        },
        C: {
            type: "Concienzudo (C)",
            groupContribution: "Ordena, planifica y verifica antes de actuar.",
            strengths: "Precisión, lógica, análisis.",
            toImprove: "Flexibilidad, rapidez de decisión."
        }
    };

    let res = resultMap[resultType];
    document.getElementById("resultType").textContent = res.type;
    document.getElementById("groupContribution").textContent = res.groupContribution;
    document.getElementById("strengths").textContent = res.strengths;
    document.getElementById("toImprove").textContent = res.toImprove;
    document.getElementById("result").classList.remove("hidden");
});
