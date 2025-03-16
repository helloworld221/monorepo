import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint2";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    eslint({ include: ["src/**/*.{ts,tsx,js,jsx}"] }),
    svgr({ include: "**/*.svg?react" }),
  ],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 3000,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
      },
    },
  },
});
