import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import {
  createQiankunDevServer,
  qiankunDevDefine,
  qiankunFullReload,
  stripReactRefreshForQiankun,
} from '../_shared/viteStripReactRefresh';

const PORT = 4003;

export default defineConfig(({ mode }) => ({
  plugins: [
    react({ fastRefresh: false }),
    qiankun('app-blog', { useDevMode: mode === 'development' }),
    stripReactRefreshForQiankun(),
    qiankunFullReload(),
  ],
  define: qiankunDevDefine(PORT, mode),
  server: createQiankunDevServer(PORT),
  base: process.env.VITE_BASE || '/',
  build: { outDir: 'dist', assetsDir: 'static' },
}));
