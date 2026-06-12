import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { SubApp } from '../../_shared/components/Layout';
import { techAdminAntdTheme } from './theme/techAdminAntdTheme';
import { ApiBaseProvider } from './context/ApiBaseContext';
import { AuthProvider } from './context/AuthContext';
import AdminRouter from './router';

interface AppProps {
  apiBase: string;
}

/** 管理后台根组件：Tech Admin 深色科技风 + 全局 Provider */
export default function App({ apiBase }: AppProps) {
  return (
    <ConfigProvider locale={zhCN} theme={techAdminAntdTheme}>
      <SubApp className="app-admin dark" style={{ height: '100%' }}>
        <ApiBaseProvider apiBase={apiBase}>
          <AuthProvider>
            <AdminRouter />
          </AuthProvider>
        </ApiBaseProvider>
      </SubApp>
    </ConfigProvider>
  );
}
