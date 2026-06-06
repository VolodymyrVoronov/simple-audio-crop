import { GooeyToaster } from "goey-toast";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "./providers/theme-provider.tsx";

import App from "./App.tsx";

import "goey-toast/styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <GooeyToaster richColors />
    </ThemeProvider>
  </StrictMode>,
);
