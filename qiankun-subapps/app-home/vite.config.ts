import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';

/** 首页子应用：固定 4001 端口，适配 Qiankun 开发/生产加载 */
export default defineConfig({
  plugins: [react(), qiankun('app-home', { useDevMode: true })],
  server: {
    port: 4001,
    cors: true,
    origin: 'http://localhost:3000',
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'static',
  },
});
