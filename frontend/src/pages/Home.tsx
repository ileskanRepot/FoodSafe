import React /*useEffect, useState*/ from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Link style={{ display: "block" }} to={`/localMap`}>
        MUSIC
      </Link>
    </>
  );
};

export default Home;
