let startPos = [3.0, 31.166667];
// Initialize the map
let floodUrl = "https://ows.globalfloods.eu/glofas-ows/ows?";
// let floodUrl = "http://ows.mundialis.de/services/service?";
let url = "/dummyGeo.json";

let nn = 0.0027;

// var geojsonFeature = {
//   type: "Feature",
//   // properties: {
//   //   name: "Coors Field",
//   //   amenity: "Baseball Stadium",
//   //   popupContent: "This is where the Rockies play!",
//   // },
//   geometry: {
//     type: "Polygon",
//     coordinates: [
//       [
//         [-0.09 + nn, 51.505 + nn],
//         [-0.09 + nn, 51.505 - nn],
//         [-0.09 - nn, 51.505 - nn],
//         [-0.09 - nn, 51.505 + nn],
//       ],
//     ],
//   },
// };

// var map = L.map("map").setView([51.505, -0.09], 15);
var map = L.map("map").setView(startPos, 5);

// Add the tile layer (you can choose a different map style by changing the URL)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// console.log(L.geoJSON(geojsonFeature));
// L.geoJSON(geojsonFeature).addTo(map);

// Add a circle overlay with a specific radius and color
// var circle = L.circle([51.508, -0.11], {
//   color: "red",
//   radius: 500, // Radius in meters
// }).addTo(map);
var wmsLayer = L.tileLayer
  .wms(floodUrl, {
    transparent: true,
    format: "image/png",
    layers: "FloodSummary1_30",
  })
  .addTo(map);

var legend = L.control({ position: "bottomleft" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  div.style.backgroundColor = "#ff00ff50";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.padding = "5%";
  div.innerHTML += "<h4>INFORMATION</h4>";
  div.innerHTML += '<button onclick="removeLayer()">TOGGLE FLOODS</button>';

  return div;
};

legend.addTo(map);

// Add a marker with a popup
var marker1 = L.marker(startPos)
  .addTo(map)
  .bindPopup("<b>Hello World!</b><br/> I am a popup.");

let layerToggle = true;
const removeLayer = () => {
  if (layerToggle) {
    map.removeLayer(wmsLayer);
    layerToggle = false;
  } else {
    map.addLayer(wmsLayer);
    layerToggle = true;
  }
};

// console.log(map.setView());
// fetch(url)
//   .then((resp) => {
//     return resp.json();
//   })
//   .then((resp) => {
//     console.log(resp);
//     L.geoJSON(resp).addTo(map);
//   });
