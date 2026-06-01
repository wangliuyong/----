import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import {
  qiankunDevServer,
  stripReactRefreshForQiankun,
} from '../_shared/viteStripReactRefresh';

export default defineConfig({
  plugins: [
    react({ fastRefresh: false }),
    qiankun('app-projects', { useDevMode: true }),
    stripReactRefreshForQiankun(),
  ],
  server: { port: 4004, ...qiankunDevServer },
  base: '/',
  build: { outDir: 'dist', assetsDir: 'static' },
});
