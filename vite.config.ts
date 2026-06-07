import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : "/simple-audio-crop/",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Simple Audio Crop",
        short_name: "Simple Audio Crop",
        description: "Crop audio files with a simple UI",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "./",
        scope: "./",
        icons: [
          {
            src: "./pwa-icon.png",
            sizes: "24x24",
            type: "image/png",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,mp3,wav}"],
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
