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
import ThemeProvider from "./providers/ThemeProvider";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </NextThemesProvider>
  </NextUIProvider>
  // </React.StrictMode>
);
