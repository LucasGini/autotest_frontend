import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // 后端服务器地址
        changeOrigin: true,  // 改变请求头中的源头，以避免 CORS 问题
        rewrite: (path) => path.replace(/^\/api/, ''),  // 可选：重写路径
      },
    },
  },
})
