import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 导入 Node.js 的 path 和 url 模块，用于解析路径
import { URL, fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()
  ],
  server: {
    proxy: {
      // 使用 proxy 实例
      '/api': {
        target: 'http://localhost:8080', // 你的后端服务地址
        changeOrigin: true, // 需要虚拟主机站点
        rewrite: (path) => path.replace(/^\/api/, '') // 重写URL，去掉/api前缀
      }
    }
  },
  // 添加 resolve 配置
  resolve: {
    alias: {
      // 设置 '@' 指向 'src' 目录
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
