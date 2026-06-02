import { useMemo } from 'react';
import { usePathname } from '../../_shared/hooks';
import type { HostProps } from '../../_shared/mountApp';
import { ApiBaseProvider } from './context/ApiBaseContext';
import { HostPropsProvider } from './context/HostPropsContext';
import { WEB_PAGE_MAP, resolveWebPage } from './router';

interface AppProps {
  apiBase: string;
  hostProps?: HostProps;
}

/** 前台统一子应用：监听基座 pathname，按 pageMap 渲染对应 feature 页面 */
export default function App({ apiBase, hostProps }: AppProps) {
  const pathname = usePathname();
  const pageKey = useMemo(() => resolveWebPage(pathname), [pathname]);
  const Page = WEB_PAGE_MAP[pageKey];

  return (
    <ApiBaseProvider apiBase={apiBase}>
      <HostPropsProvider hostProps={hostProps}>
        <Page />
      </HostPropsProvider>
    </ApiBaseProvider>
  );
}
