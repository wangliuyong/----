'use client';

import { initGlobalState, registerMicroApps, start } from 'qiankun';
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

/** 基座向联系子应用暴露的回调（由 MicroPage 写入） */
export type HostCallbacks = {
  onMessageSuccess?: (msg: string) => void;
};

declare global {
  interface Window {
    __HOST_CALLBACKS__?: HostCallbacks;
  }
}

/** Qiankun 全局状态：主题同步 */
export const globalActions = initGlobalState({ theme: 'light' });

let qiankunStarted = false;
let qiankunRegistered = false;

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
 * 注册并启动 Qiankun（仅执行一次 start）
 * @param theme 当前明暗主题，同步至全局状态与子应用 props
 */
export function initQiankun(theme: string) {
  const resolved = theme === 'dark' ? 'dark' : 'light';
  globalActions.setGlobalState({ theme: resolved });

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
      sandbox: {
        experimentalStyleIsolation: true,
      },
    });
    qiankunStarted = true;
  }
}

/** 主题变更时仅更新全局状态（避免重复 register/start） */
export function syncQiankunTheme(theme: string) {
  globalActions.setGlobalState({
    theme: theme === 'dark' ? 'dark' : 'light',
  });
}
