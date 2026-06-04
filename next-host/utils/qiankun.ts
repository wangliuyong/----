'use client';

import { isAdminPath, isQiankunSitePath } from '@/router';
import { API_BASE } from './api';

/** 前台统一子应用 entry（生产环境通过环境变量覆盖） */
const WEB_ENTRY = process.env.NEXT_PUBLIC_MICRO_WEB ?? 'http://localhost:4001';
const ADMIN_ENTRY = process.env.NEXT_PUBLIC_MICRO_ADMIN ?? 'http://localhost:4007';

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

/** 路由驱动的子应用：app-web / app-admin */
const microApps = [
  {
    name: 'app-web',
    entry: WEB_ENTRY,
    container: '#micro-container',
    activeRule: (location: Location) => isQiankunSitePath(location.pathname),
    props: {
      get onMessageSuccess() {
        return window.__HOST_CALLBACKS__?.onMessageSuccess;
      },
    },
  },
  {
    name: 'app-admin',
    entry: ADMIN_ENTRY,
    container: '#micro-container',
    activeRule: (location: Location) => isAdminPath(location.pathname),
  },
];

function resolveTheme(theme: string) {
  return theme === 'dark' ? 'dark' : 'light';
}

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
    const resolved = resolveTheme(theme);

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
        singular: false,
        sandbox: false,
      });
      qiankunStarted = true;
    }
  })();

  await qiankunLoading;
}

/** 注册并启动 Qiankun（仅客户端、仅执行一次 start） */
export async function initQiankun(theme: string) {
  await ensureQiankun(theme);
}

/** 主题变更时同步 Qiankun 全局状态 */
export function syncQiankunTheme(theme: string) {
  const resolved = resolveTheme(theme);
  globalActions?.setGlobalState({ theme: resolved });
}
