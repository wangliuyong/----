'use client';

import { API_BASE } from './api';

/** 子应用开发环境 entry（生产环境通过环境变量覆盖） */
const ENTRIES = {
  home: process.env.NEXT_PUBLIC_MICRO_HOME ?? 'http://localhost:4001',
  about: process.env.NEXT_PUBLIC_MICRO_ABOUT ?? 'http://localhost:4002',
  blog: process.env.NEXT_PUBLIC_MICRO_BLOG ?? 'http://localhost:4003',
  projects: process.env.NEXT_PUBLIC_MICRO_PROJECTS ?? 'http://localhost:4004',
  contact: process.env.NEXT_PUBLIC_MICRO_CONTACT ?? 'http://localhost:4005',
  links: process.env.NEXT_PUBLIC_MICRO_LINKS ?? 'http://localhost:4006',
};

/** 基座向联系子应用暴露的回调（由 ContactCallbacks 写入） */
export type HostCallbacks = {
  onMessageSuccess?: (msg: string) => void;
};

declare global {
  interface Window {
    __HOST_CALLBACKS__?: HostCallbacks;
  }
}

/** Qiankun 全局状态 actions（客户端懒加载后赋值） */
export type GlobalActions = {
  setGlobalState: (state: Record<string, unknown>) => void;
  onGlobalStateChange: (
    callback: (state: Record<string, unknown>, prev: Record<string, unknown>) => void,
    fireImmediately?: boolean,
  ) => void;
};

let globalActions: GlobalActions | null = null;
let qiankunStarted = false;
let qiankunRegistered = false;
let qiankunLoading: Promise<void> | null = null;

const microApps = [
  {
    name: 'app-home',
    entry: ENTRIES.home,
    container: '#micro-container',
    activeRule: (location: Location) => location.pathname === '/',
  },
  {
    name: 'app-about',
    entry: ENTRIES.about,
    container: '#micro-container',
    activeRule: '/about',
  },
  {
    name: 'app-blog',
    entry: ENTRIES.blog,
    container: '#micro-container',
    activeRule: (location: Location) => location.pathname.startsWith('/blog'),
  },
  {
    name: 'app-projects',
    entry: ENTRIES.projects,
    container: '#micro-container',
    activeRule: '/projects',
  },
  {
    name: 'app-contact',
    entry: ENTRIES.contact,
    container: '#micro-container',
    activeRule: '/contact',
    props: {
      apiBase: API_BASE,
      get onMessageSuccess() {
        return window.__HOST_CALLBACKS__?.onMessageSuccess;
      },
    },
  },
  {
    name: 'app-links',
    entry: ENTRIES.links,
    container: '#micro-container',
    activeRule: '/links',
  },
];

/**
 * 仅在浏览器端动态加载 qiankun，避免 Next 打包/SSR 触发
 * "Cannot use import statement outside a module"
 */
async function ensureQiankun(theme: string) {
  if (typeof window === 'undefined') return;

  if (qiankunLoading) {
    await qiankunLoading;
    return;
  }

  qiankunLoading = (async () => {
    const { initGlobalState, registerMicroApps, start } = await import('qiankun');
    const resolved = theme === 'dark' ? 'dark' : 'light';

    if (!globalActions) {
      globalActions = initGlobalState({ theme: resolved });
    } else {
      globalActions.setGlobalState({ theme: resolved });
    }

    if (!qiankunRegistered) {
      registerMicroApps(
        microApps.map((app) => ({
          ...app,
          props: {
            theme: resolved,
            apiBase: API_BASE,
            ...(typeof app.props === 'object' ? app.props : {}),
          },
        })),
      );
      qiankunRegistered = true;
    }

    if (!qiankunStarted) {
      start({
        prefetch: true,
        // 与 vite-plugin-qiankun 开发模式兼容（子应用不在严格 JS 沙箱内）
        sandbox: false,
      });
      qiankunStarted = true;
    }
  })();

  await qiankunLoading;
}

/**
 * 注册并启动 Qiankun（仅客户端、仅执行一次 start）
 */
export async function initQiankun(theme: string) {
  await ensureQiankun(theme);
}

/** 主题变更时仅更新全局状态 */
export function syncQiankunTheme(theme: string) {
  globalActions?.setGlobalState({
    theme: theme === 'dark' ? 'dark' : 'light',
  });
}
