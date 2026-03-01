function beregn() {
    const tE = parseFloat(document.getElementById("eitre").value);
    const tF = parseFloat(document.getElementById("fly").value);

    if (isNaN(tE) || isNaN(tF)) {
        document.getElementById("result").innerText = "Skriv inn begge temperaturene.";
        return;
    }

    const gradient = ((tF - tE) / (690 - 74)) * 100;

    let vurdering = "";
    let farge = "";

    if (gradient <= -0.7) {
        vurdering = "Gradienten er klar og atmosfæren er ustabil. Soloppvarming vil gi tydelige bobler og gode muligheter for termikk gjennom dagen.";
        farge = "gronn";
    } else if (gradient <= -0.4) {
        vurdering = "Gradienten er moderat. Lufta er delvis stabil, men soloppvarming kan likevel skape enkelte bobler – spesielt utover formiddagen.";
        farge = "gul";
    } else {
        vurdering = "Gradienten er svak og atmosfæren er stabil. Soloppvarming vil trolig ikke gi brukbare bobler før sent på dagen, og forholdene vil oppleves flate.";
        farge = "rod";
    }

    document.getElementById("result").className = farge;
    document.getElementById("result").innerText =
        `Gradient: ${gradient.toFixed(2)} °C/100m

${vurdering}`;
}
