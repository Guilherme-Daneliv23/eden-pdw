import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// Se for publicar no GitHub Pages, troque o base para '/NOME-DO-REPO/'
// Ex.: base: '/eden-pwa/'
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'favicon.ico'],
      manifest: {
        name: 'Gestão de Casamentos',
        short_name: 'Casamentos',
        description: 'PWA básico em React com Vite',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4CAF50',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  base: '/eden-pdw/' // <- descomente e ajuste se usar GitHub Pages
})
