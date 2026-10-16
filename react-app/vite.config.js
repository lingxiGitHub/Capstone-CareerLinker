import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Flask runs on 5001 in development (macOS reserves 5000 for AirPlay).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: { "/api": "http://127.0.0.1:5001" },
  },
});
