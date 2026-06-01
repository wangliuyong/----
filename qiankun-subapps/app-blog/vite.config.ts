import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [react(), qiankun('app-blog', { useDevMode: true })],
  server: { port: 4003, cors: true, origin: 'http://localhost:3000' },
  base: '/',
  build: { outDir: 'dist', assetsDir: 'static' },
});
