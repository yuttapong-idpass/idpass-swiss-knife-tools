import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
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
import { AppProviders } from "@/app/providers/AppProviders";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <AppProviders>
    <App />
  </AppProviders>
  // </React.StrictMode>
);
