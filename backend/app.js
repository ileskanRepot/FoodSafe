// Initialize the map
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
var map = L.map("map").setView([51.505, -0.09], 13);

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

// Add a marker with a popup
var marker1 = L.marker([51.505, -0.09])
  .addTo(map)
  .bindPopup("<b>Hello World!</b><br/> I am a popup.");

fetch(url)
  .then((resp) => {
    return resp.json();
  })
  .then((resp) => {
    console.log(resp);
    L.geoJSON(resp).addTo(map);
  });
