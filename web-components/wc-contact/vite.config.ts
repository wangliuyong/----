import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'WcContact',
      fileName: 'wc-contact',
      formats: ['es'],
    },
    outDir: resolve(__dirname, '../../next-host/public/wc'),
    emptyOutDir: false,
  },
  server: { port: 4005, cors: true },
});
