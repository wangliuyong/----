import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import App from './App';
import 'antd/dist/reset.css';
import './index.scss';
import { mountReactApp, registerSubAppDevPort, unmountReactApp, type HostProps } from '../../_shared/mountApp';

registerSubAppDevPort(4007);

renderWithQiankun({
  bootstrap: async () => console.log('[app-admin] bootstrap'),
  mount: (props: HostProps) => mountReactApp(App, props),
  unmount: async () => unmountReactApp(),
  update: async () => {},
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  mountReactApp(App, {});
}
