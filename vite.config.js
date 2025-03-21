import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns : ['**/*.{js,css,html,svg,ttf}'],
      },
      includeAssets: ['apple-touch-icon.png', 'favicon-96x96.png', 'favicon.ico', 'happal.svg', 'web-app-manifest-192x192.png', 'web-app-manifest-512x512.png'],
      manifest: {
        name: 'Happal',
        short_name: 'Happal',
        description: 'Happal - Simple SRS Web App',
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
      },
    }),
    visualizer({open: true, filename:'bundle-visualization.html'}),
  ],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost+2-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost+2.pem')),
    },
  },
  define: { global: "window" },
})