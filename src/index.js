import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/* Loading Animation */

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);

/* Performance Report */

reportWebVitals();

/* Console Message */

console.log(
  "%c Chemix-Encyclopedia Loaded Successfully 🚀",
  "color: #00e5ff; font-size: 18px; font-weight: bold;"
);

console.log(
  "%c Developed by timedcoder",
  "color: #7c4dff; font-size: 14px;"
);