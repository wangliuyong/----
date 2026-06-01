import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import {
  qiankunDevServer,
  stripReactRefreshForQiankun,
} from '../_shared/viteStripReactRefresh';

export default defineConfig(({ mode }) => ({
  plugins: [
    react({ fastRefresh: false }),
    qiankun('app-links', { useDevMode: mode === 'development' }),
    stripReactRefreshForQiankun(),
  ],
  server: { port: 4006, ...qiankunDevServer },
  base: process.env.VITE_BASE || '/',
  build: { outDir: 'dist', assetsDir: 'static' },
}));
