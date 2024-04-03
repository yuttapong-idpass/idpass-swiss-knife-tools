import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./assets/fonts/ChakraPetch-Bold.ttf";
import "./assets/fonts/ChakraPetch-BoldItalic.ttf";
import "./assets/fonts/ChakraPetch-Italic.ttf";
import "./assets/fonts/ChakraPetch-Light.ttf";
import "./assets/fonts/ChakraPetch-LightItalic.ttf";
import "./assets/fonts/ChakraPetch-Medium.ttf";
import "./assets/fonts/ChakraPetch-MediumItalic.ttf";
import "./assets/fonts/ChakraPetch-Regular.ttf";
import "./assets/fonts/ChakraPetch-SemiBold.ttf";
import "./assets/fonts/ChakraPetch-SemiBoldItalic.ttf";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ThemeProvider from "./providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
  // </React.StrictMode>
);
