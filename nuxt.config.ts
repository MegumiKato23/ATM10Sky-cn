export default defineNuxtConfig({
  compatibilityDate: '2026-03-30',
  srcDir: 'app/',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  nitro: {
    serverAssets: [{
      baseName: 'quest-browser',
      dir: '../../support/quest-browser',
    }],
  },
})
