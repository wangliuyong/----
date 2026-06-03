import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import App from './App';
import './index.scss';
import 'prismjs/themes/prism-tomorrow.css';
import {
  mountReactApp,
  registerSubAppDevPort,
  unmountReactApp,
  type HostProps,
} from '../../_shared/mountApp';
import { getStandaloneHostProps } from './utils/runtime';

registerSubAppDevPort(4001);

/** 当前实例挂载的 #root，unmount 时精确卸载，避免误伤其他子应用 */
let appMountEl: HTMLElement | null = null;

renderWithQiankun({
  bootstrap: async () => console.log('[app-web] bootstrap'),
  mount: (props: HostProps) => {
    appMountEl = mountReactApp(App, props);
  },
  unmount: async () => {
    unmountReactApp(appMountEl);
    appMountEl = null;
  },
  update: async () => {},
});

/** 非 Qiankun 环境：单独启动（pnpm dev:standalone / vite preview） */
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  mountReactApp(App, getStandaloneHostProps());
}
