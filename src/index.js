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
import Tasks from "./pages/Tasks";
import Boost from "./pages/Boost";
import Connect from "./pages/ConnectWallet";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl =
  "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <TapHome />,
      },
      {
        path:"/ref",
        element: <Ref />,
      },
      {
        path:"/connect",
        element: <Connect />,
      },
      {
        path:"/tasks",
        element: <Tasks />,
      },
      {
        path:"/boost",
        element: <Boost />,
      },
    ]

  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </TonConnectUIProvider>
);
