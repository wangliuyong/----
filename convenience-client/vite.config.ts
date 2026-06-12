import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { execSync } from 'node:child_process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // 启动/构建前将 .env 中的高德地图 Key 写入 manifest.json
  execSync('node scripts/apply-manifest-env.mjs', {
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });

  return {
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
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  };
});
