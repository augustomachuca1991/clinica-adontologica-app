import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          charts: ["recharts"],
          i18n: ["i18next", "react-i18next"],
          forms: ["formik", "yup"],
          ui: ["lucide-react", "sonner", "clsx", "tailwind-merge", "class-variance-authority"],
        },
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon/**"],
      manifest: {
        name: "Orion Software",
        short_name: "Orion",
        description: "Orion Software – Soluciones digitales para clínicas",
        theme_color: "#534AB7",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          { src: "/favicon/favicon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/favicon/favicon-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/favicon/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/itbgzglbjbiyljibchdf\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "supabase-storage", expiration: { maxEntries: 50, maxAgeSeconds: 86400 * 30 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts", expiration: { maxEntries: 10, maxAgeSeconds: 86400 * 365 } },
          },
        ],
      },
    }),
  ],
  server: {
    port: 4028,
    host: "0.0.0.0",
    strictPort: true,
  },
});
