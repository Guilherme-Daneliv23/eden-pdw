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
      includeAssets: ['logoApp'],
      manifest: {
        name: 'Gestão de Casamentos',
        short_name: 'Eden',
        description: 'Éden, o gestor do casamento dos seus sonhos!',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#D0653F',
        icons: [
          { src: 'logoApp.png', sizes: '192x192', type: 'image/png' },
        ]
      }
    })
  ],
  base: '/eden-pdw/' // <- descomente e ajuste se usar GitHub Pages
})
