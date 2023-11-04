// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Home from "./pages/Home";
import LocalMap from "./pages/LocalMap";
import "./App.css";
// import { useState } from "react";
import * as React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "../node_modules/react-router-dom/dist/index";

function App() {
  const router = createBrowserRouter([
    // { element: <Layout /> },
    {
      path: "/",
      // element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "localMap", element: <LocalMap /> },
        { path: "*", element: <NoPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
