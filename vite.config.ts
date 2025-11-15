import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000 },
  plugins: [react(), tailwindcss(),],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }

})
