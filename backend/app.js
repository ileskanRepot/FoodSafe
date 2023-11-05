let startColor = "#11d6ea";
let endColor = "#114dec";

var homeIcon = L.icon({
  iconUrl: "./home.png",
  iconSize: [32, 32], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
});

let startPos = [2.8615, 31.5595];
let startZoom = 9;
let floodUrl = "https://ows.globalfloods.eu/glofas-ows/ows?";

getGradientColor = function (start_color, end_color, percent) {
  // strip the leading # if it's there
  start_color = start_color.replace(/^\s*#|\s*$/g, "");
  end_color = end_color.replace(/^\s*#|\s*$/g, "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (start_color.length == 3) {
    start_color = start_color.replace(/(.)/g, "$1$1");
  }

  if (end_color.length == 3) {
    end_color = end_color.replace(/(.)/g, "$1$1");
  }

  // get colors
  var start_red = parseInt(start_color.substr(0, 2), 16),
    start_green = parseInt(start_color.substr(2, 2), 16),
    start_blue = parseInt(start_color.substr(4, 2), 16);

  var end_red = parseInt(end_color.substr(0, 2), 16),
    end_green = parseInt(end_color.substr(2, 2), 16),
    end_blue = parseInt(end_color.substr(4, 2), 16);

  // calculate new color
  var diff_red = end_red - start_red;
  var diff_green = end_green - start_green;
  var diff_blue = end_blue - start_blue;

  diff_red = (diff_red * percent + start_red).toString(16).split(".")[0];
  diff_green = (diff_green * percent + start_green).toString(16).split(".")[0];
  diff_blue = (diff_blue * percent + start_blue).toString(16).split(".")[0];

  // ensure 2 digits by color
  if (diff_red.length == 1) diff_red = "0" + diff_red;
  if (diff_green.length == 1) diff_green = "0" + diff_green;
  if (diff_blue.length == 1) diff_blue = "0" + diff_blue;

  return "#" + diff_red + diff_green + diff_blue;
};

getGeojson = async function (curUrl) {
  return fetch(curUrl)
    .then((resp) => {
      return resp.json();
    })
    .then((resp) => {
      return L.geoJSON(resp, {
        style: {
          color: "red",
        },
      });
    });
};

getHumidity = async function (curUrl) {
  return fetch(curUrl)
    .then((resp) => {
      return resp.json();
    })
    .then((resp) => {
      return L.geoJSON(resp, {
        pane: "bottomPane",
        style: function (feature) {
          humidity = feature.properties["DN"];
          colour = getGradientColor(startColor, endColor, (humidity - 70) / 30);
          return {
            color: colour,
            fillOpacity: 0.6,
            opacity: 0.6,
          };
        },
      });
    });
};

getStorage = async function (curUrl, map) {
  return fetch(curUrl)
    .then((resp) => {
      return resp.json();
    })
    .then((resp) => {
      return L.geoJSON(resp, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: homeIcon });
        },
        onEachFeature: function (feature, layer) {
          popupHtml = ''
          if (feature.properties.URL !== '') {
            popupHtml = "<img src='" + feature.properties.URL + "' width='300'/>"
          }
          popupHtml += "<h2>" +
              feature.properties.name +
              '</h2><p style="font-size:14px;">' +
              feature.properties.Descr +
              "</p>"
          layer.bindPopup(popupHtml);
          layer.on({
            click: function (e) {
              map.setView(e.latlng, 13);
            },
          });
          layer.getPopup().on("remove", function () {
            map.setZoom(10);
          });
        },
      });
    });
};

all = async function () {
  var base_map = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  // Floods
  var floodsWmsLayer = L.tileLayer.wms(floodUrl, {
    transparent: true,
    format: "image/png",
    layers: "FloodHazard100y",
  });

  // Rats
  var ratsUrl = "./rat1.png",
    ratBounds = [
      [3.831, 30.572],
      [1.892, 32.747],
    ];
  ratsLayer = L.imageOverlay(ratsUrl, ratBounds /*{ zIndex: 999 }*/);
  // var ratsUrl2 = "./rat2.png",
  //   ratsLayer2 = L.imageOverlay(ratsUrl2, ratBounds);
  // var ratsUrl3 = "./rat3.png",
  //   ratsLayer3 = L.imageOverlay(ratsUrl3, ratBounds);

  // var ratsUrl = "./rat1.json",
  //   ratBounds = [
  //     [3.831, 30.572],
  //     [1.892, 32.747],
  //   ];
  // ratsLayer = await getGeojson(ratsUrl);
  var ratsUrl2 = "./rat2.png",
    ratsLayer2 = L.imageOverlay(ratsUrl2, ratBounds);
  var ratsUrl3 = "./rat3.png",
    ratsLayer3 = L.imageOverlay(ratsUrl3, ratBounds);
  // Layer groups
  // TODO: Humidity
  var day = L.layerGroup([ratsLayer]);
  var day2 = L.layerGroup([ratsLayer2]);
  var day3 = L.layerGroup([ratsLayer3]);

  // Basemap
  var map = L.map("map", {
    layers: [base_map, floodsWmsLayer, day],
  }).setView(startPos, startZoom);

  map.createPane("bottomPane");
  map.getPane("bottomPane").style.zIndex = 300;

  // Humidity
  let humidityUrl = "./humidity.json";
  let humidity = await this.getHumidity(humidityUrl);
  map.addLayer(humidity);

  // Storage
  let storageUrl = "./storage.json";
  let storage = await this.getStorage(storageUrl, map);
  map.addLayer(storage);

  // Layers
  let overlays = {
    Rats: day.getLayers()[0],
    Floods: floodsWmsLayer,
    Humidity: humidity,
  };

  let layerControl = L.control.layers(null, overlays).addTo(map);

  // Legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.style.backgroundColor = "#d9d9d9a0";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.paddingLeft = "12%";
    div.style.paddingRight = "12%";
    div.style.textAlign = "center";
    // div.style.padding = "10%";
    div.style.width = "100px";
    div.innerHTML += "<h2>LEGEND</h2>";
    div.innerHTML +=
      '<b style="margin:4%;padding:10%;color:white;background-color:#c31f22;">Rodent alert</b>';
    div.innerHTML +=
      '<b style="margin:4%;padding:10%;color:black;background-color:#6ae0e9;">Mould alert</b>';
    div.innerHTML +=
      '<b style=";margin:4% 4% 15% 4%;padding:10%;color:white;background-color:#3338ff;">Flood alert</b>';

    return div;
  };
  legend.addTo(map);
  // console.log(getGradientColor(startColor, endColor, 4 / 10));

  let curDay = day.getLayers()[0];
  // Calendar
  let datePicker = document.getElementById("dayPicker");
  datePicker.onchange = (evt) => {
    if (datePicker.valueAsDate.getDate() == 7) {
      map.removeLayer(curDay);
      overlays.Rats = day.getLayers()[0];

      layerControl.addOverlay(day.getLayers()[0], "Rats");
      day.getLayers()[0].addTo(map);

      layerControl.removeLayer(curDay);
      curDay = day.getLayers()[0];
    } else if (datePicker.valueAsDate.getDate() == 18) {
      map.removeLayer(curDay);
      overlays.Rats = day2.getLayers()[0];

      layerControl.addOverlay(day2.getLayers()[0], "Rats");
      day2.getLayers()[0].addTo(map);

      layerControl.removeLayer(curDay);
      curDay = day2.getLayers()[0];
    } else if (datePicker.valueAsDate.getDate() == 29) {
      map.removeLayer(curDay);
      overlays.Rats = day3.getLayers()[0];

      layerControl.addOverlay(day3.getLayers()[0], "Rats");
      day3.getLayers()[0].addTo(map);

      layerControl.removeLayer(curDay);
      curDay = day3.getLayers()[0];
    }
  };
};

all();
