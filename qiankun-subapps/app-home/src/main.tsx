import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import App from './App';
import './index.scss';
import {
  mountReactApp,
  unmountReactApp,
  type HostProps,
} from '../../_shared/mountApp';

async function bootstrap() {
  console.log('[app-home] bootstrap');
}

async function mount(props: HostProps) {
  mountReactApp(App, props);
}

async function unmount() {
  unmountReactApp();
}

renderWithQiankun({ bootstrap, mount, unmount, update: async () => {} });

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  mountReactApp(App, {});
}
