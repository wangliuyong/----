import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import App from './App';
import 'antd/dist/reset.css';
import './index.scss';
import {
  mountReactApp,
  registerSubAppDevPort,
  unmountReactApp,
  type HostProps,
} from '../../_shared/mountApp';
import { getStandaloneHostProps } from './utils/runtime';

registerSubAppDevPort(4007);

/** 当前实例挂载的 #root，unmount 时精确卸载 */
let appMountEl: HTMLElement | null = null;

renderWithQiankun({
  bootstrap: async () => console.log('[app-admin] bootstrap'),
  mount: (props: HostProps) => {
    appMountEl = mountReactApp(App, props);
  },
  unmount: async () => {
    unmountReactApp(appMountEl);
    appMountEl = null;
  },
  update: async () => {},
});

/** 非 Qiankun 环境：单独启动（pnpm dev / vite preview） */
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  mountReactApp(App, getStandaloneHostProps());
}
