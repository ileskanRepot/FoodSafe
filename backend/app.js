let startPos = [1.349508, 32.775744];
let floodUrl = "https://ows.globalfloods.eu/glofas-ows/ows?";

var base_map = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

var map = L.map("map", { layers: [base_map] }).setView(startPos, 8);

// Floods
var floodsWmsLayer = L.tileLayer.wms(floodUrl, {
  transparent: true,
  format: "image/png",
  layers: "FloodSummary1_30",
});

// Rats
var ratsUrl = '.\\map_data\\rats\\rats_2022-02-11_-_2022-02-13.png',
    ratBounds = [[3.831, 30.572], [1.892, 32.747]];
ratsLayer = L.imageOverlay(ratsUrl, ratBounds);
var ratsUrl2 = '.\\map_data\\rats\\rats_2022-04-12_-_2022-04-14.png',
ratsLayer2 = L.imageOverlay(ratsUrl2, ratBounds);
var ratsUrl3 = '.\\map_data\\rats\\rats_2022-05-12_-_2022-05-14.png',
ratsLayer3 = L.imageOverlay(ratsUrl3, ratBounds);

// Layer groups
// TODO: Humidity
var day = L.layerGroup([ratsLayer]);
var day2 = L.layerGroup([ratsLayer2]);
var day3 = L.layerGroup([ratsLayer3]);

// Layers
let overlays = {
  "Floods": floodsWmsLayer,
  // TODO: Toggle layer control
  "Rats": day.getLayers()[0],
};

let layerControl = L.control.layers(null, overlays).addTo(map);

// Legend
var legend = L.control({ position: "bottomleft" });
legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  div.style.backgroundColor = "#ff00ff50";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.padding = "5%";
  div.innerHTML += "<h4>INFORMATION</h4>";
  div.innerHTML += "<p>More info</p>";

  return div;
};
legend.addTo(map);

// Calendar
document.getElementById("dayPicker").onchange = (evt) => {
  console.log(evt.type);
  console.log(document.getElementById("dayPicker").valueAsDate);
};

// TODO: Humidity
let url = ".\\map_data\\humidity_features_version2.geojson";
fetch(url)
  .then((resp) => {
    return resp.json();
  })
  .then((resp) => {
    console.log(resp);
    L.geoJSON(resp,
    {style: function (feature) {
      return {color: feature.properties.color};
    }

    }).addTo(map);
  });

// let geo = L.geoJSON(data, {
//     style: function (feature) {
//         return {color: feature.properties.color};
//     }
// }).bindPopup(function (layer) {
//     return layer.feature.properties.description;
// }).addTo(map);

// let layerToggle = true;
// const removeLayer = () => {
//   if (layerToggle) {
//     map.removeLayer(floodsWmsLayer);
//     layerToggle = false;
//   } else {
//     map.addLayer(floodsWmsLayer);
//     layerToggle = true;
//   }
// };
