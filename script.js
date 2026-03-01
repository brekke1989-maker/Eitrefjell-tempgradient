
async function hent(){
  const out=document.getElementById('out');
  out.textContent="Henter...";
  try{
    const eit = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=62.180&lon=6.310').then(r=>r.json());
    const fly = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=62.180&lon=6.074').then(r=>r.json());

    function finn07(d){
      return d.properties.timeseries.find(t=>t.time.includes("T07:00"));
    }

    const e = finn07(eit);
    const f = finn07(fly);

    const Te = e.data.instant.details.air_temperature;
    const Tf = f.data.instant.details.air_temperature;
    const Ce = e.data.instant.details.cloud_area_fraction;
    const Cf = f.data.instant.details.cloud_area_fraction;

    const grad = (Te - Tf) / (690-74) * 100;

    out.textContent =
      "Eitrefjell: " + Te + "°C, Skydekke " + Ce + "%\n" +
      "Flyplass: " + Tf + "°C, Skydekke " + Cf + "%\n" +
      "Gradient: " + grad.toFixed(2) + " °C/100m";
  } catch(err){
    out.textContent="Feil: "+err;
  }
}
