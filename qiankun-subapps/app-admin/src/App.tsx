import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { SubApp } from '../../_shared/components/Layout';
import { inkSandAntdTheme } from './theme/inkSandAntdTheme';
import { ApiBaseProvider } from './context/ApiBaseContext';
import { AuthProvider } from './context/AuthContext';
import AdminRouter from './router';

interface AppProps {
  apiBase: string;
}

/** 管理后台根组件：全局 Provider + 路由 */
export default function App({ apiBase }: AppProps) {
  return (
    <ConfigProvider locale={zhCN} theme={inkSandAntdTheme}>
      <SubApp style={{ height: '100%' }}>
        <ApiBaseProvider apiBase={apiBase}>
          <AuthProvider>
            <AdminRouter />
          </AuthProvider>
        </ApiBaseProvider>
      </SubApp>
    </ConfigProvider>
  );
}
