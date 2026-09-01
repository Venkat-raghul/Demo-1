import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://venkat-raghul.github.io/Demo-1/
export default defineConfig({
  plugins: [react()],
  base: process.env.PAGES_BASE ?? "/Demo-1/"
});
