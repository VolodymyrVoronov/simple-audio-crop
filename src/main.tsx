import { GooeyToaster } from "goey-toast";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "goey-toast/styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <GooeyToaster />
  </StrictMode>,
);

