async function fetchTemp(url) {
    const res = await fetch(url);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const rows = Array.from(doc.querySelectorAll("table tr"));
    for (const row of rows) {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0 && cells[0].textContent.trim() === "07") {
            return cells[3].textContent.trim();
        }
    }
    return null;
}

document.getElementById("fetchBtn").onclick = async () => {
    const out = document.getElementById("output");
    out.textContent = "Henter...";

    const eitrefjellURL = "https://www.yr.no/nb/historikk/tabell/5-59695?q=siste-24-timer";
    const flyplassURL = "https://www.yr.no/nb/historikk/tabell/5-59680?q=siste-24-timer";

    try {
        const tE = await fetchTemp(eitrefjellURL);
        const tF = await fetchTemp(flyplassURL);

        if (!tE || !tF) {
            out.textContent = "Fant ikke temperatur kl 07.";
            return;
        }

        const numE = parseFloat(tE.replace(",", "."));
        const numF = parseFloat(tF.replace(",", "."));
        const gradient = (numF - numE) / 6.16;

        let vurdering = "";
        if (gradient < -0.9) vurdering = "Svært god termikk";
        else if (gradient < -0.7) vurdering = "God termikk";
        else if (gradient < -0.5) vurdering = "Moderat termikk";
        else if (gradient < -0.3) vurdering = "Svak termikk";
        else vurdering = "Ingen termikk";

        out.textContent =
            `Eitrefjell kl 07: ${tE}\n` +
            `Flyplass kl 07: ${tF}\n` +
            `Gradient: ${gradient.toFixed(2)} °C/100m\n\n` +
            `Vurdering: ${vurdering}`;
    } catch (e) {
        out.textContent = "Feil under henting.";
    }
};
