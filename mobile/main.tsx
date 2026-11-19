import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReferenceApp } from "@/components/reference-app";
import "./app.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing root");

window.addEventListener("error", (event) => {
  if (root.childElementCount > 0) return;
  root.textContent = event.message || "The reference failed to start.";
});

createRoot(root).render(
  <StrictMode>
    <ReferenceApp />
  </StrictMode>,
);

const host = location.hostname;
if (host !== "localhost" && host !== "127.0.0.1" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("sw.js", document.baseURI).href).catch(() => {});
  });
}
