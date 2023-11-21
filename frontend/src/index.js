import React from "react";
import ReactDOM from "react-dom/client";
import AuthProvider from "./shared/context/AuthProvider";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
