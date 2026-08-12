import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000 },
  plugins: [wasm(), react(), tailwindcss()],
  base: '/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }

})
