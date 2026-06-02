import type { HostProps } from '../../_shared/mountApp';
import { ApiBaseProvider } from './context/ApiBaseContext';
import { HostPropsProvider } from './context/HostPropsContext';
import WebRouter from './router';

interface AppProps {
  apiBase: string;
  hostProps?: HostProps;
}

/** 前台统一子应用：Provider + React Router Data Router */
export default function App({ apiBase, hostProps }: AppProps) {
  return (
    <ApiBaseProvider apiBase={apiBase}>
      <HostPropsProvider hostProps={hostProps}>
        <WebRouter />
      </HostPropsProvider>
    </ApiBaseProvider>
  );
}
