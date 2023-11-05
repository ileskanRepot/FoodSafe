// Initialize the map
let url = "http://localhost:5000/dummyGeo.json";

let nn = 0.0027;
fetch(url).then((resp) => {
  console.log(resp);
});
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
var map = L.map("map").setView([51.505, -0.09], 17);

// Add the tile layer (you can choose a different map style by changing the URL)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

console.log(L.geoJSON(geojsonFeature));
L.geoJSON(geojsonFeature).addTo(map);

// Add a circle overlay with a specific radius and color
// var circle = L.circle([51.508, -0.11], {
//   color: "red",
//   radius: 500, // Radius in meters
// }).addTo(map);

// Add a marker with a popup
var marker1 = L.marker([51.505, -0.09])
  .addTo(map)
  .bindPopup("<b>Hello World!</b><br/> I am a popup.");

var marker2 = L.marker([0, 0])
  .addTo(map)
  .bindPopup("<b>Hello World 2!</b><br/> I am a popup.");
