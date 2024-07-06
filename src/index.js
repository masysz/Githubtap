import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import Stats from "./pages/Stats";
import TapHome from "./pages/TapHome";
import Tasks from "./pages/Tasks"

const router = createBrowserRouter([
  {
    path: "/",
    element: <TapHome />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <Home />,
      },
      {
        path:"/ref",
        element: <Ref />,
      },
      {
        path:"/tasks",
        element: <Tasks />,
      },
      {
        path:"/stats",
        element: <Stats />,
      },
    ]

  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
