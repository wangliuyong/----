import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import {
  qiankunDevServer,
  stripReactRefreshForQiankun,
} from '../_shared/viteStripReactRefresh';

/** 管理后台子应用：固定 4007 端口，路由 /admin */
export default defineConfig(({ mode }) => ({
  plugins: [
    react({ fastRefresh: false }),
    qiankun('app-admin', { useDevMode: mode === 'development' }),
    stripReactRefreshForQiankun(),
  ],
  server: { port: 4007, ...qiankunDevServer },
  base: process.env.VITE_BASE || '/',
  build: { outDir: 'dist', assetsDir: 'static' },
}));
