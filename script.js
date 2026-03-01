
const CLIENT_ID = "82191934-10c8-4521-8cd6-b37beffacaa79";

async function fetchTemp(stationId) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth()+1).padStart(2,"0");
    const d = String(now.getDate()).padStart(2,"0");

    const times = [
        `${y}-${m}-${d}T07:00:00`,
        `${y}-${m}-${d}T06:00:00`,
        `${y}-${m}-${d}T08:00:00`
    ];

    for (let t of times) {
        const url = `https://frost.met.no/observations/v0.jsonld?sources=${stationId}&elements=air_temperature&referencetime=${t}`;
        const auth = btoa(`${CLIENT_ID}:`);

        try {
            const res = await fetch(url, { headers:{Authorization:`Basic ${auth}`}});
            const data = await res.json();
            if (data.data && data.data.length>0) {
                return data.data[0].observations[0].value;
            }
        } catch(e){}
    }
    return null;
}

async function hent(){
    const out = document.getElementById("out");
    out.textContent = "Henter…";

    const tE = await fetchTemp("SN59695");
    const tF = await fetchTemp("SN59680");

    if(tE===null || tF===null){
        out.textContent = "Kunne ikke hente temperaturer.";
        return;
    }

    const delta = tE - tF;
    let vurder = "";
    if (delta <= -4) vurder = "Svært god termikk";
    else if (delta <= -2) vurder = "God termikk";
    else if (delta <= 0) vurder = "Mulig svak termikk";
    else vurder = "Ingen termikk";

    out.textContent =
        `Eitrefjell: ${tE}°C\n` +
        `Lufthavn: ${tF}°C\n` +
        `Differanse: ${delta.toFixed(1)}°C\n\n${vurder}`;
}

document.getElementById("btn").onclick = hent;
