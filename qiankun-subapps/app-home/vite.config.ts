import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import {
  createQiankunDevServer,
  qiankunDevDefine,
  qiankunFullReload,
  stripReactRefreshForQiankun,
} from '../_shared/viteStripReactRefresh';

const PORT = 4001;

/** 首页子应用：固定 4001 端口，适配 Qiankun 开发/生产加载 */
export default defineConfig(({ mode }) => ({
  plugins: [
    react({ fastRefresh: false }),
    qiankun('app-home', { useDevMode: mode === 'development' }),
    stripReactRefreshForQiankun(),
    qiankunFullReload(),
  ],
  define: qiankunDevDefine(PORT, mode),
  server: createQiankunDevServer(PORT),
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    assetsDir: 'static',
  },
}));
