import { combinePresetAndAppleSplashScreens, minimal2023Preset } from '@vite-pwa/assets-generator/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = '/drumroll-pwa/'

// https://vite.dev/config/
export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'audio/drumroll-start.wav',
        'audio/drumroll-loop.wav',
        'audio/drumroll-end.wav',
      ],
      manifest: {
        id: base,
        name: 'drumroll',
        short_name: 'drumroll',
        description: 'When you need a drumroll on demand 🥁',
        start_url: base,
        scope: base,
        display: 'standalone',
        theme_color: '#A1000A',
        background_color: '#000000',
      },
      pwaAssets: {
        image: 'public/logo.svg',
        overrideManifestIcons: true,
        injectThemeColor: false,
        preset: combinePresetAndAppleSplashScreens(minimal2023Preset, {
          padding: 0.28,
          resizeOptions: { fit: 'contain', background: '#FFFFFF' },
          darkResizeOptions: { fit: 'contain', background: '#000000' },
        }),
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wav}'],
        navigateFallback: null,
      },
    }),
  ],
})
