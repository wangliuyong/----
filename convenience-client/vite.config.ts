import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // uview-plus 主题变量预加载
        additionalData: '@import "uview-plus/theme.scss";',
        api: 'modern-compiler',
        silenceDeprecations: true,
      },
    },
  },
  optimizeDeps: {
    include: ['uview-plus'],
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
});
