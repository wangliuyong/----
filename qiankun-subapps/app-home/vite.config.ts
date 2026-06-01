import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import {
  qiankunDevServer,
  stripReactRefreshForQiankun,
} from '../_shared/viteStripReactRefresh';

/** 首页子应用：固定 4001 端口，适配 Qiankun 开发/生产加载 */
export default defineConfig(({ mode }) => ({
  plugins: [
    react({ fastRefresh: false }),
    // 开发模式需 useDevMode 以兼容 qiankun 加载（与 HMR 冲突，故关闭 fastRefresh）
    qiankun('app-home', { useDevMode: mode === 'development' }),
    stripReactRefreshForQiankun(),
  ],
  server: {
    port: 4001,
    ...qiankunDevServer,
  },
  // 生产环境通过 VITE_BASE 指定子路径（如 /micro/home/）
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    assetsDir: 'static',
  },
}));
