import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ApiBaseProvider } from './context/ApiBaseContext';
import AdminRouter from './router';

interface AppProps {
  apiBase: string;
}

/** 管理后台根组件：全局 Provider + 路由 */
export default function App({ apiBase }: AppProps) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <ApiBaseProvider apiBase={apiBase}>
        <AdminRouter />
      </ApiBaseProvider>
    </ConfigProvider>
  );
}
