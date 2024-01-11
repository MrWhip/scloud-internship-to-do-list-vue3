import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/scloud-internship-to-do-list-vue3/',
  plugins: [
    vue(),
    vueJsx(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@/assets/styles/mainStyles.scss";
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
