async function hent(){
 const out=document.getElementById("out");
 out.textContent="Henter...";
 async function getTemp(url){
  const r=await fetch("https://api.allorigins.win/get?url="+encodeURIComponent(url));
  const data=await r.json();
  const html=data.contents;
  const parser=new DOMParser();
  const doc=parser.parseFromString(html,"text/html");
  const rows=[...doc.querySelectorAll("table tr")];
  for(const row of rows){
    const td=row.querySelectorAll("td");
    if(td.length>4 && td[0].textContent.trim()=="07"){
       return parseFloat(td[4].textContent.replace("°","").replace(",",".")); 
    }
  }
  return null;
 }
 const eit= await getTemp("https://www.yr.no/nb/historikk/tabell/5-59695/Norge/Møre og Romsdal/Ørsta/Ørsta - Eitrefjell?q=siste-24-timer");
 const fly= await getTemp("https://www.yr.no/nb/historikk/tabell/5-59680/Norge/Møre og Romsdal/Ørsta/Ørsta-Volda lufthavn?q=siste-24-timer");
 if(eit==null || fly==null){ out.textContent="Feil: fant ikke data"; return;}
 const grad=((fly-eit)/ (74-690)*100).toFixed(2);
 out.textContent=`Eitrefjell: ${eit}°C\nFlyplass: ${fly}°C\nGradient: ${grad} °C/100m`;
}