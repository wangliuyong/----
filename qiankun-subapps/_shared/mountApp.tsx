import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupQiankunHmr } from './dev/qiankunHmrClient';
import { applyTheme, type GlobalState } from './theme';

/** 子应用 mount 时基座传入的 props */
export interface HostProps {
  container?: HTMLElement;
  theme?: string;
  apiBase?: string;
  onGlobalStateChange?: (
    callback: (state: GlobalState, prev: GlobalState) => void,
    fireImmediately?: boolean,
  ) => void;
  onMessageSuccess?: (msg: string) => void;
}

/** 每个 #root 节点独立维护 React Root，避免多子应用共享模块级变量互相卸载 */
interface MountEntry {
  root: ReactDOM.Root;
  offGlobalState: (() => void) | null;
}

const mountRegistry = new WeakMap<HTMLElement, MountEntry>();

/** 在 main.tsx 中调用，与 vite.config 里 PORT 保持一致 */
export function registerSubAppDevPort(port: number) {
  setupQiankunHmr(port);
}

/**
 * 解析 Qiankun 容器内的 #root 挂载点
 * @returns 实际挂载的 DOM 节点；找不到时返回 null
 */
export function resolveMountElement(props: HostProps): HTMLElement | null {
  const { container } = props;
  let el: HTMLElement | null = null;

  if (container) {
    el = container.querySelector('#root') as HTMLElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = 'root';
      container.appendChild(el);
    }
  } else {
    el = document.querySelector('#root') as HTMLElement | null;
  }

  return el;
}

/**
 * 统一挂载 React 子应用到 Qiankun 容器或独立 #root
 * @returns 挂载 DOM，供 unmount 时精确卸载本应用
 */
export function mountReactApp(
  App: React.ComponentType<{ apiBase: string; hostProps?: HostProps }>,
  props: HostProps,
): HTMLElement | null {
  const { theme, apiBase, onGlobalStateChange } = props;
  const el = resolveMountElement(props);

  if (!el) {
    console.error('子应用挂载容器不存在');
    return null;
  }

  applyTheme(theme);

  // 同一 #root 重复 mount 时先清理旧实例
  unmountReactApp(el);

  let offGlobalState: (() => void) | null = null;
  if (onGlobalStateChange) {
    const off = onGlobalStateChange((state) => {
      applyTheme(state.theme);
    }, true);
    if (typeof off === 'function') {
      offGlobalState = off;
    }
  }

  const root = ReactDOM.createRoot(el);
  mountRegistry.set(el, { root, offGlobalState });

  const base = apiBase || 'http://localhost:3001/api';
  root.render(<App apiBase={base} hostProps={props} />);

  return el;
}

/**
 * 卸载指定 #root 上的 React 实例
 * @param mountEl mount 返回的 DOM；不传则无法安全卸载（避免误伤其他子应用）
 */
export function unmountReactApp(mountEl?: HTMLElement | null) {
  if (!mountEl) return;

  const entry = mountRegistry.get(mountEl);
  if (!entry) return;

  entry.offGlobalState?.();
  entry.root.unmount();
  mountRegistry.delete(mountEl);
}
