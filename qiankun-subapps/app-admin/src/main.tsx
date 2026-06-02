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

renderWithQiankun({
  bootstrap: async () => console.log('[app-admin] bootstrap'),
  mount: (props: HostProps) => mountReactApp(App, props),
  unmount: async () => unmountReactApp(),
  update: async () => {},
});

/** 非 Qiankun 环境：单独启动（pnpm dev / vite preview） */
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  mountReactApp(App, getStandaloneHostProps());
}
