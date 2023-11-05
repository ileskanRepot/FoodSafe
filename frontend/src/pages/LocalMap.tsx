import React, { useEffect, useState } from "react";
// import { csv } from "d3-fetch";
// import { scaleLinear } from "d3-scale";
import { arc, pie, DSVRowArray, scaleLinear, csv, PieArcDatum } from "d3";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
  Line,
} from "react-simple-maps";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import settings from "../constants";

// const geoUrl =
//   "https://gist.githubusercontent.com/markmarkoh/2969317/raw/15c2e3dee7769bb77b62d2a202548e7cce039bce/gistfile1.js";
const geoUrl = "/api/worldMap.json";

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range([0xffedea, 0xff5233]);

const LocalMap = () => {
  const [data, setData] = useState<DSVRowArray<string>>();

  // let worldMapUrl = `/api/worldMap.json`;
  // let geoJsonUrl = `/api/dummyGeo.json`;

  useEffect(() => {
    csv(`/api/vuln.csv`).then((data) => {
      console.log(data);
      setData(data);
    });
  }, []);
  if (!data) {
    return <pre>loading...</pre>;
  }

  return (
    <>
      <h1>LocalMap</h1>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
      >
        <Sphere fill="#00000000" id="1" stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        {data.length > 0 && (
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = data.find((s) => s.ISO3 === geo.id);
                console.log(d);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    // fill={d ? colorScale(d["2017"]) : "#F5F4F6"}
                    fill="#ff00ff"
                  />
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>
    </>
  );
};

export default LocalMap;
