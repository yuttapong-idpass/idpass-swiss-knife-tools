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

import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </Provider>
  // </React.StrictMode>
);
