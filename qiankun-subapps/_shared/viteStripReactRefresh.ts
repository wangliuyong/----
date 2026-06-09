import type { IncomingMessage, ServerResponse } from 'node:http';
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
 * Qiankun 子应用开发服务器配置
 * - origin 指向子应用自身，保证 @vite/client 与资源 URL 正确
 * @param enableHmr 独立模式为 true；Qiankun 模式为 false，关闭 Vite HMR 以禁用 @vitejs/plugin-react Fast Refresh
 *（v4.7 无 fastRefresh 选项，plugin 在 server.hmr === false 时才会跳过 Refresh 注入）
 */
export function createQiankunDevServer(port: number, enableHmr = true) {
  return {
    port,
    strictPort: true,
    cors: true as const,
    origin: `http://localhost:${port}`,
    hmr: enableHmr
      ? {
          protocol: 'ws' as const,
          host: 'localhost',
          port,
        }
      : false,
    // 允许读取并监听 ../_shared 共享代码与样式
    fs: {
      allow: ['..'],
    },
  };
}

/**
 * 在 Qiankun 基座内不做 React Fast Refresh，文件变更时整页刷新基座（:3000）
 * - 独立模式（hmr 开启）：走 Vite hot.send
 * - Qiankun 模式（hmr 关闭）：走 SSE /__qiankun_reload，供基座页跨域订阅
 */
export function qiankunFullReload(): Plugin {
  return {
    name: 'qiankun-full-reload',
    apply: 'serve',
    configureServer(server) {
      const hmrEnabled = server.config.server.hmr !== false;
      const sseClients = new Set<ServerResponse>();

      if (!hmrEnabled) {
        server.middlewares.use('/__qiankun_reload', (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== 'GET') {
            res.statusCode = 405;
            res.end();
            return;
          }
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });
          res.write(': connected\n\n');
          sseClients.add(res);
          req.on('close', () => sseClients.delete(res));
        });
      }

      const reload = () => {
        if (hmrEnabled) {
          server.environments.client.hot.send({ type: 'full-reload', path: '*' });
          return;
        }
        for (const client of sseClients) {
          client.write('event: reload\ndata: 1\n\n');
        }
      };

      const shouldReload = (file: string) =>
        !file.includes('node_modules') && !file.includes('/.git/');

      server.watcher.on('change', (file) => {
        if (shouldReload(file)) reload();
      });
    },
  };
}

/** 开发模式下向子应用注入 dev 端口，供 Qiankun HMR 客户端使用 */
export function qiankunDevDefine(port: number, mode: string) {
  return {
    __SUBAPP_DEV_PORT__: mode === 'development' ? port : 0,
  };
}
