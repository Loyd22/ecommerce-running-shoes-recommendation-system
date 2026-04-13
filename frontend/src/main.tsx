// frontend/src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Render the React app into the browser
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);