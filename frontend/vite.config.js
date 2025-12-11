import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // this stays, because your project is under /ConnectivityCowork/
  base: "/ConnectivityCowork/",

  build: {
    // output *one level up* into /docs at the repo root
    outDir: "../docs",
    emptyOutDir: true, // clears old build in docs
  },

  plugins: [react(), tailwindcss()],
});
