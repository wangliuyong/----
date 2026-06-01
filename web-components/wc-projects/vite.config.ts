import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'WcProjects',
      fileName: 'wc-projects',
      formats: ['es'],
    },
    outDir: resolve(__dirname, '../../next-host/public/wc'),
    emptyOutDir: false,
  },
  server: { port: 4004, cors: true },
});
