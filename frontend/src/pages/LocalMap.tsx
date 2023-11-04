import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Line,
} from "react-simple-maps";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import settings from "../constants";

// const geoUrl =
//   "https://gist.githubusercontent.com/markmarkoh/2969317/raw/15c2e3dee7769bb77b62d2a202548e7cce039bce/gistfile1.js";
const geoUrl = "/api/features.json";

const LocalMap = () => {
  const [getDate, setDate] = useState<string>("");
  let worldMapUrl = `/api/worldMap.json`;
  let geoJsonUrl = `/api/dummyGeo.json`;

  useEffect(() => {
    // let url = `${settings.backendUrl}/api/isLoggedIn`;
    console.log(worldMapUrl);
    // fetch(url, {
    //   // credentials: "include",
    //   // mode: "navigate",
    //   // method: "get",
    //   // crossorigin: "*",
    // })
    //   .then((resp) => {
    //     return resp.json();
    //   })
    //   .then((resp) => {
    //     console.log(resp);
    //     setDate(resp["time"]);
    //   });
  }, []);

  return (
    <>
      <h1>LocalMap {getDate}</h1>
      <ComposableMap>
        <Geographies geography={worldMapUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
        <Geographies geography={geoJsonUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // You can access `firstProperty` and `secondProperty`
              // via geo.properties.firstProperty and geo.properties.secondProperty

              return <Geography key={geo.rsmKey} geography={geo} />;
            })
          }
        </Geographies>
      </ComposableMap>
    </>
  );
};

export default LocalMap;
