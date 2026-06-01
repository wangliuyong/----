import React from 'react';
import ReactDOM from 'react-dom/client';
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

let root: ReactDOM.Root | null = null;
let offGlobalState: (() => void) | null = null;

/**
 * 统一挂载 React 子应用到 Qiankun 容器或独立 #root
 */
export function mountReactApp(
  App: React.ComponentType<{ apiBase: string; hostProps?: HostProps }>,
  props: HostProps,
) {
  const { container, theme, apiBase, onGlobalStateChange } = props;
  applyTheme(theme);

  if (onGlobalStateChange) {
    offGlobalState?.();
    const off = onGlobalStateChange((state) => {
      applyTheme(state.theme);
    }, true);
    if (typeof off === 'function') {
      offGlobalState = off;
    }
  }

  const el =
    container ??
    (document.querySelector('#root') as HTMLElement | null);
  if (!el) {
    console.error('子应用挂载容器不存在');
    return;
  }

  const base = apiBase || 'http://localhost:3001/api';
  root = ReactDOM.createRoot(el);
  root.render(<App apiBase={base} hostProps={props} />);
}

/** 卸载子应用根节点 */
export function unmountReactApp() {
  offGlobalState?.();
  offGlobalState = null;
  root?.unmount();
  root = null;
}
