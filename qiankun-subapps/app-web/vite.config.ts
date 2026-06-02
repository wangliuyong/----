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

/** 独立启动（:4001 直连）时为 true；Qiankun 基座加载时为 false */
const isStandaloneDev = process.env.VITE_STANDALONE === '1';

/** 前台统一子应用：首页 / 关于 / 博客 / 项目 / 联系 / 友链，按基座 pathname 切换页面 */
export default defineConfig(({ mode }) => ({
  plugins: [
    // 独立模式保留 React Refresh；Qiankun eval 下关闭并整页刷新基座
    react({ fastRefresh: isStandaloneDev }),
    qiankun('app-web', { useDevMode: mode === 'development' }),
    ...(isStandaloneDev
      ? []
      : [stripReactRefreshForQiankun(), qiankunFullReload()]),
  ],
  define: qiankunDevDefine(PORT, mode),
  server: createQiankunDevServer(PORT),
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    assetsDir: 'static',
  },
}));
