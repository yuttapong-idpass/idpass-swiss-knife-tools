import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./assets/fonts/NotoSansThai-Black.ttf";
import "./assets/fonts/NotoSansThai-Bold.ttf";
import "./assets/fonts/NotoSansThai-ExtraBold.ttf";
import "./assets/fonts/NotoSansThai-ExtraLight.ttf";
import "./assets/fonts/NotoSansThai-Light.ttf";
import "./assets/fonts/NotoSansThai-Medium.ttf";
import "./assets/fonts/NotoSansThai-Regular.ttf";
import "./assets/fonts/NotoSansThai-SemiBold.ttf";
import "./assets/fonts/NotoSansThai-Thin.ttf";
import { Toaster } from "@/components/ui/sonner"
import { Provider } from "react-redux";
import { ThemeProvider } from "./providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App />
    <Toaster />
  </ThemeProvider>
  // </React.StrictMode>
);
