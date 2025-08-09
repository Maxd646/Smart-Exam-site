import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ReduxStateProvider from "../Contexts/Provider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxStateProvider>
      <App />
    </ReduxStateProvider>
  </React.StrictMode>
);
