import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'WcLinks',
      fileName: 'wc-links',
      formats: ['es'],
    },
    outDir: resolve(__dirname, '../../next-host/public/wc'),
    emptyOutDir: false,
  },
  server: { port: 4006, cors: true },
});
