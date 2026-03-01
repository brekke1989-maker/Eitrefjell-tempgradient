
async function fetchHTML(url) {
    const proxy = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
    const r = await fetch(proxy);
    const j = await r.json();
    return j.contents;
}

function parseTemp(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rows = [...doc.querySelectorAll("table tr")];

    for (const row of rows) {
        const th = row.querySelector("th");
        if (!th) continue;

        let tid = th.innerText.trim();
        if (tid === "07" || tid === "07:00") {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 5) {
                let v = cells[4].innerText.replace("°", "").replace(",", ".");
                return parseFloat(v);
            }
        }
    }
    return null;
}

async function hent() {
    const out = document.getElementById("out");
    out.textContent = "Henter...";

    const eit = "https://www.yr.no/nb/historikk/tabell/5-59695?q=siste-24-timer";
    const fly = "https://www.yr.no/nb/historikk/tabell/5-59680?q=siste-24-timer";

    try {
        const h1 = await fetchHTML(eit);
        const tE = parseTemp(h1);

        const h2 = await fetchHTML(fly);
        const tF = parseTemp(h2);

        if (tE === null || tF === null) {
            out.textContent = "Fant ikke temperatur kl 07.";
            return;
        }

        const gradient = ((tF - tE) / (690 - 74)) * 100;
        let vurdering = "";

        if (gradient < -1.1) vurdering = "Svært god termikk.";
        else if (gradient < -0.7) vurdering = "God termikk.";
        else if (gradient < -0.5) vurdering = "Moderat termikk.";
        else if (gradient < -0.3) vurdering = "Svak termikk.";
        else vurdering = "Ingen termikk.";

        out.textContent =
            `Eitrefjell: ${tE} °C\n` +
            `Lufthamna: ${tF} °C\n` +
            `Gradient: ${gradient.toFixed(2)} °C/100m\n\n` +
            `Vurdering: ${vurdering}`;

    } catch (e) {
        out.textContent = "Feil: " + e;
    }
}

document.getElementById("btn").onclick = hent;
