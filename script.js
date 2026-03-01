
async function hentTemp(url){
    const proxy = "https://corsproxy.io/?" + encodeURIComponent(url);
    const res = await fetch(proxy);
    const data = await res.text();

    const doc = new DOMParser().parseFromString(data, "text/html");
    const rows = [...doc.querySelectorAll("table tr")];

    for(const r of rows){
        const th = r.querySelector("th");
        if(!th) continue;
        const tid = th.innerText.trim();
        if(tid === "07" || tid === "07:00"){
            const cells = r.querySelectorAll("td");
            if(cells.length >= 5){
                let t = cells[4].innerText.replace("°","").replace(",","." );
                return parseFloat(t);
            }
        }
    }
    return null;
}

async function hent(){
    const out = document.getElementById("out");
    out.textContent = "Henter data...";

    const urlE = "https://www.yr.no/nb/historikk/tabell/5-59695/Norge/Møre%20og%20Romsdal/Ørsta/Ørsta%20-%20Eitrefjell?q=siste-24-timer";
    const urlF = "https://www.yr.no/nb/historikk/tabell/5-59680/Norge/Møre%20og%20Romsdal/Ørsta/Ørsta-Volda%20lufthavn?q=siste-24-timer";

    try {
        const tE = await hentTemp(urlE);
        const tF = await hentTemp(urlF);

        if(tE === null || tF === null){
            out.className = "";
            out.textContent = "Fant ikke temperatur kl 07.";
            return;
        }

        const gradient = ((tF - tE) / (690 - 74)) * 100;

        let vurdering = "";
        let cls = "";

        if(gradient <= -0.7){
            vurdering = "God sjanse for termikk. Atmosfæren er ustabil og bobler kan utvikle seg tidlig.";
            cls = "good";
        } else if(gradient <= -0.4){
            vurdering = "Mulig termikk. Soloppvarming må til for at det skal løsne.";
            cls = "medium";
        } else {
            vurdering = "Lite eller ingen termikk. Atmosfæren er stabil.";
            cls = "bad";
        }

        out.className = cls;
        out.textContent =
            `Eitrefjell: ${tE} °C\n` +
            `Lufthamna: ${tF} °C\n` +
            `Gradient: ${gradient.toFixed(2)} °C/100m\n\n` +
            vurdering;

    } catch(e){
        out.className = "";
        out.textContent = "Feil: " + e;
    }
}

document.getElementById("hentBtn").addEventListener("click", hent);
