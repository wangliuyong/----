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
    // 独立模式保留 React Refresh preamble；Qiankun eval 下关闭并整页刷新
    react({ fastRefresh: isStandaloneDev }),
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
