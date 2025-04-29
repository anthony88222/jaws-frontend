import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/Library': {
        target: 'http://localhost:8080',  // 指向你的 Spring Boot 後端
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/Library/, '/Library'),
      },
    },
  },
})
