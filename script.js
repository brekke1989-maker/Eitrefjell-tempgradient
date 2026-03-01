
async function hentTemp(url){
  const proxy = "https://corsproxy.io/?" + encodeURIComponent(url);
  const res = await fetch(proxy);
  const txt = await res.text();
  const doc = new DOMParser().parseFromString(txt, "text/html");
  const rows=[...doc.querySelectorAll("table tr")];
  for(const r of rows){
    const th=r.querySelector("th");
    if(!th) continue;
    let t=th.innerText.trim();
    if(t==="07"||t==="07:00"){
      const cells=r.querySelectorAll("td");
      if(cells.length>=5){
        let v=cells[4].innerText.replace("°","").replace(",",".");
        return parseFloat(v);
      }
    }
  }
  return null;
}

async function hent(){
  const out=document.getElementById("out");
  out.textContent="Henter...";
  const urlE="https://www.yr.no/nb/historikk/tabell/5-59695/Norge/M%C3%B8re%20og%20Romsdal/%C3%98rsta/%C3%98rsta%20-%20Eitrefjell?q=siste-24-timer";
  const urlF="https://www.yr.no/nb/historikk/tabell/5-59680/Norge/M%C3%B8re%20og%20Romsdal/%C3%98rsta/%C3%98rsta-Volda%20lufthavn?q=siste-24-timer";
  try{
    const tE=await hentTemp(urlE);
    const tF=await hentTemp(urlF);
    if(tE===null||tF===null){ out.textContent="Fant ikke kl 07."; return;}
    const grad=((tF - tE) / (690-74)) * 100;
    let cls="", v="";
    if(grad <= -0.7){ cls="good"; v="God sjanse for termikk."; }
    else if(grad <= -0.4){ cls="medium"; v="Mulig termikk."; }
    else{ cls="bad"; v="Lite eller ingen termikk."; }
    out.className=cls;
    out.textContent=`Eitrefjell: ${tE} °C\nLufthamna: ${tF} °C\nGradient: ${grad.toFixed(2)} °C/100m\n\n${v}`;
  }catch(e){
    out.textContent="Feil: "+e;
  }
}

document.getElementById("btn").addEventListener("click", hent);
