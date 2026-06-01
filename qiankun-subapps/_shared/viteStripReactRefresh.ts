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

/** 子应用 Vite 开发服务器通用配置（Qiankun useDevMode 需关闭 HMR） */
export const qiankunDevServer = {
  cors: true as const,
  origin: 'http://localhost:3000',
  hmr: false,
};
