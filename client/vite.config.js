import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    manifest: {
      name: 'Billing Habit',
      short_name: 'Billing Habit',
      start_url: "/",
      description: 'Quotation & Profit Automation ',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',

      icons: [
      {
      src: "icons/icon-48x48.png",
      sizes: "48x48",
      type: "image/png"
    },
    {
      src: "icons/icon-72x72.png",
      sizes: "72x72",
      type: "image/png"
    },
    {
      src: "icons/icon-96x96.png",
      sizes: "96x96",
      type: "image/png"
    },
    {
      src: "icons/icon-128x128.png",
      sizes: "128x128",
      type: "image/png"
    },
    {
      src: "icons/icon-144x144.png",
      sizes: "144x144",
      type: "image/png"
    },
    {
      src: "icons/icon-152x152.png",
      sizes: "152x152",
      type: "image/png"
    },
    {
      src: "icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "icons/icon-256x256.png",
      sizes: "256x256",
      type: "image/png"
    },
    {
      src: "icons/icon-384x384.png",
      sizes: "384x384",
      type: "image/png"
    },
    {
      src: "icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }, 
    {
      src: 'maskable-icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
  }],
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})