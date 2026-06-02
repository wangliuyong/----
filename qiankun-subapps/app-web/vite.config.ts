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

/** 前台统一子应用：首页 / 关于 / 博客 / 项目 / 联系 / 友链，按基座 pathname 切换页面 */
export default defineConfig(({ mode }) => ({
  plugins: [
    react({ fastRefresh: false }),
    qiankun('app-web', { useDevMode: mode === 'development' }),
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
