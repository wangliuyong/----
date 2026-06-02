import type { Plugin } from 'vite';

/**
 * 移除 @vitejs/plugin-react 注入的 react-refresh 脚本。
 * 该脚本为 type="module" 的静态 import，qiankun 的 import-html-entry 用 eval 执行时会报错：
 * SyntaxError: Cannot use import statement outside a module
 */
export function stripReactRefreshForQiankun(): Plugin {
  return {
    name: 'strip-react-refresh-for-qiankun',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<script type="module">[\s\S]*?injectIntoGlobalHook[\s\S]*?<\/script>\s*/gi,
        '',
      );
    },
  };
}

/**
 * Qiankun 子应用开发服务器配置（按端口启用 HMR WebSocket）
 * - origin 指向子应用自身，保证 @vite/client 与资源 URL 正确
 * - hmr.port 与 dev server 一致，基座页面（:3000）通过 ws 连到对应子应用
 */
export function createQiankunDevServer(port: number) {
  return {
    port,
    strictPort: true,
    cors: true as const,
    origin: `http://localhost:${port}`,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port,
    },
    // 允许读取并监听 ../_shared 共享代码与样式
    fs: {
      allow: ['..'],
    },
  };
}

/**
 * 在 Qiankun 基座内不做 React Fast Refresh，文件变更时整页刷新基座（:3000）
 * Vite 6 需用 environment.hot.send，旧的 server.ws.send 已无效
 */
export function qiankunFullReload(): Plugin {
  return {
    name: 'qiankun-full-reload',
    apply: 'serve',
    configureServer(server) {
      const reload = () => {
        server.environments.client.hot.send({ type: 'full-reload', path: '*' });
      };
      const shouldReload = (file: string) =>
        !file.includes('node_modules') && !file.includes('/.git/');

      server.watcher.on('change', (file) => {
        if (shouldReload(file)) reload();
      });
    },
  };
}

/** @deprecated 请改用 createQiankunDevServer(port) */
export const qiankunDevServer = {
  cors: true as const,
  origin: 'http://localhost:3000',
  hmr: false,
};

/** 开发模式下向子应用注入 dev 端口，供 Qiankun HMR 客户端使用 */
export function qiankunDevDefine(port: number, mode: string) {
  return {
    __SUBAPP_DEV_PORT__: mode === 'development' ? port : 0,
  };
}
