import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
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
      "@": path.resolve(__dirname, "./src"), // 設定 @ 指向 src 資料夾
    },
  },
  server: {
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // ✅ 這裡請填你的 Spring Boot 後端位址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
