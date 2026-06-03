import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import {
  createQiankunDevServer,
  qiankunDevDefine,
  qiankunFullReload,
  stripReactRefreshForQiankun,
} from '../_shared/viteStripReactRefresh';

const PORT = 4007;

/** 独立启动（:4007 直连）时为 true；Qiankun 基座加载时为 false */
const isStandaloneDev = process.env.VITE_STANDALONE === '1';

export default defineConfig(({ mode }) => ({
  plugins: [
    // 独立模式默认启用 React Refresh；Qiankun 模式由 stripReactRefreshForQiankun 移除 preamble
    react(),
    qiankun('app-admin', { useDevMode: mode === 'development' }),
    ...(isStandaloneDev
      ? []
      : [stripReactRefreshForQiankun(), qiankunFullReload()]),
  ],
  define: qiankunDevDefine(PORT, mode),
  server: createQiankunDevServer(PORT),
  base: process.env.VITE_BASE || '/',
  build: { outDir: 'dist', assetsDir: 'static' },
}));
