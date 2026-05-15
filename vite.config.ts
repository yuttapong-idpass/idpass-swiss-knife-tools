import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000 },
  plugins: [wasm(), topLevelAwait(), react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }

})
