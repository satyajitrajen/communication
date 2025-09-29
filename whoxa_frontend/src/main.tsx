import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./assets/css/Scrollbar.css";
import "./assets/css/fonts.css";
import "./assets/css/ReactSlickSlider.css";
import "./assets/css/ButtonAnimation.css";
import "./assets/css/ReactDatePicker.css";
import "./assets/css/ReactTab.css";
import "./assets/css/Colors.css";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </React.StrictMode>
);
