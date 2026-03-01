async function hentTemp(url) {
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const rows = Array.from(doc.querySelectorAll("table tbody tr"));
    const row07 = rows.find(r => r.querySelector("th")?.innerText.trim() === "07");

    if (!row07) return null;

    const cells = row07.querySelectorAll("td");
    const measured = parseFloat(cells[cells.length - 2].innerText.replace("°",""));
    return measured;
}

async function main() {
    const eitrefjell = await hentTemp("https://www.yr.no/nb/historikk/tabell/5-59695/");
    const flyplass = await hentTemp("https://www.yr.no/nb/historikk/tabell/5-59680/");

    const gradient = ((flyplass - eitrefjell) / (690 - 74)) * 100;

    document.getElementById("output").innerText =
        `Eitrefjell: ${eitrefjell}°C\n` +
        `Flyplass: ${flyplass}°C\n` +
        `Gradient: ${gradient.toFixed(2)} °C/100m`;
}

main();
