import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app";

import "@/styles/index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

ReactDOM.createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
