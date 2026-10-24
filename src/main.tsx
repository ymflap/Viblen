import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  applyLanguage,
  detectBrowserLanguage,
} from "./i18n";
import "./index.css";

const language = detectBrowserLanguage();

applyLanguage(language);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App language={language} />
  </React.StrictMode>,
);
