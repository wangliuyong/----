import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'WcAbout',
      fileName: 'wc-about',
      formats: ['es'],
    },
    outDir: resolve(__dirname, '../../next-host/public/wc'),
    emptyOutDir: false,
  },
  server: { port: 4002, cors: true },
});
