import React, { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
import settings from "../constants";

const LocalMap = () => {
  const [getDate, setDate] = useState<string>("");

  useEffect(() => {
    // let url = `${settings.backendUrl}/api/isLoggedIn`;
    let url = `/api/localMap`;
    console.log(url);
    fetch(url, {
      // credentials: "include",
      // mode: "navigate",
      // method: "get",
      // crossorigin: "*",
    })
      .then((resp) => {
        console.log(resp);
        return resp.json();
      })
      .then((resp) => {
        console.log(resp);
        setDate(resp["time"]);
      });
  }, []);

  return (
    <>
      <h1>LocalMap {getDate}</h1>
    </>
  );
};

export default LocalMap;
