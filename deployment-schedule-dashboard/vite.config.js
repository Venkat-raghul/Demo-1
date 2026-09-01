import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<org>.github.io/disc-fe-discover-devops-utlilities/
export default defineConfig({
  plugins: [react()],
  base: process.env.PAGES_BASE ?? "/disc-fe-discover-devops-utlilities/"
});
