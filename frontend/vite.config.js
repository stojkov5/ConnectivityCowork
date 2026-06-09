import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Served from the domain root (custom domain konnectivity.mk).
  base: "/",

  // Default output dir "dist". Vercel serves this (see vercel.json
  // outputDirectory: "frontend/dist"). Previously this built into ../docs
  // for GitHub Pages, which we no longer use.
  plugins: [react(), tailwindcss()],
});
