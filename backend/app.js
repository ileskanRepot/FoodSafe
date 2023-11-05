let startColor = "#11d6ea";
let endColor = "#114dec";

let startPos = [2.8615, 31.6595];
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
  }).setView(startPos, 8);

  map.createPane("bottomPane");
  map.getPane("bottomPane").style.zIndex = 300;

  // Humidity
  let humidityUrl = "./humidity.json";
  let humidity = await this.getHumidity(humidityUrl);

  map.addLayer(humidity);

  // Layers
  let overlays = {
    Rats: day.getLayers()[0],
    Floods: floodsWmsLayer,
    Humidity: humidity,
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
    for (let ii = 0; ii < 11; ii++) {
      div.innerHTML += `<div style="background-color:${getGradientColor(
        startColor,
        endColor,
        ii / 10
      )};">${ii * 3 + 70}</div>`;
    }

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
