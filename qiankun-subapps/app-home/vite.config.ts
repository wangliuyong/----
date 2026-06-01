import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import {
  qiankunDevServer,
  stripReactRefreshForQiankun,
} from '../_shared/viteStripReactRefresh';

/** 首页子应用：固定 4001 端口，适配 Qiankun 开发/生产加载 */
export default defineConfig({
  plugins: [
    react({ fastRefresh: false }),
    qiankun('app-home', { useDevMode: true }),
    stripReactRefreshForQiankun(),
  ],
  server: {
    port: 4001,
    ...qiankunDevServer,
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'static',
  },
});
