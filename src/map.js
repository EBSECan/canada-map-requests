import postalGeo from "../requests-geo.json";

const canadaCentre = [60.2404, -95.3468];

function createMap() {
  return new Promise((resolve) => {
    const options = {
      attributionControl: false,
      zoomControl: false,
    };
    const map = L.map("map", options).setView(canadaCentre, 4);
    const layer = L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 20,
      }
    ).addTo(map);
  
    // Wait for the tiles to load, then force a map resize to get
    // partially loaded/gray tiles to fully load. 
    layer.on('load', () => {
      map.invalidateSize();
      setTimeout(() => resolve(map), 2000);
    });
  })
}

function addPoints(map) {
  postalGeo.forEach((geo) => {
    if (!geo) {
      return;
    }

    try {
      L.circle([geo.lat, geo.lng], {
        color: "red",
        fillColor: "red",
        fillOpacity: 0.5,
        radius: 25000,
      }).addTo(map);
    } catch (err) {
      console.log({ err, geo });
    }
  });
}

// Let playwright know that the map is fully loaded
function done() {
  const elem = document.createElement("div");
  elem.id = "ready";
  elem.innerHTML = '&nbsp;';
  document.body.appendChild(elem);
}

async function start() {
  const map = await createMap();
  addPoints(map);
  done();
}

addEventListener("DOMContentLoaded", start);
