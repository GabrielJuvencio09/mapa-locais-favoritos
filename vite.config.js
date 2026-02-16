import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mapa-locais-favoritos.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
