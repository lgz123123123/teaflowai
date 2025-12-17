import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 关键修改：设置 base 为相对路径，
  // 这样无论部署在 https://user.github.io/repo/ 还是根目录，资源都能正确加载
  base: './', 
})