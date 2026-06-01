/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // qiankun 含 ESM 依赖，需由 Next 转译；服务端不打包进 SSR
  transpilePackages: ['qiankun', 'import-html-entry', 'single-spa'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'qiankun'];
    }
    return config;
  },
};

export default nextConfig;
