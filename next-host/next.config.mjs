/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  // qiankun 含 ESM 依赖，需由 Next 转译；服务端不打包进 SSR
  transpilePackages: ['qiankun', 'import-html-entry', 'single-spa'],
  webpack: (config, { isServer }) => {
    // _shared 源码在 next-host 外，pnpm 严格模式下需显式指向基座 node_modules
    config.resolve.modules = [
      path.join(__dirname, 'node_modules'),
      ...(config.resolve.modules || []),
    ];

    if (isServer) {
      config.externals = [...(config.externals || []), 'qiankun'];
    }
    return config;
  },
};

export default nextConfig;
