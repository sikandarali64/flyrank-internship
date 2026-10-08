import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev mein /api ki requests Express server (port 3001) ko jati hain.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:3001" } },
});
