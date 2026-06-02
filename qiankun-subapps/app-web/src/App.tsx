import { useMemo } from 'react';
import { usePathname } from '../../_shared/hooks';
import type { HostProps } from '../../_shared/mountApp';
import { resolveWebPage } from './routes';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import LinksPage from './pages/LinksPage';
import ProjectsPage from './pages/ProjectsPage';

interface AppProps {
  apiBase: string;
  hostProps?: HostProps;
}

/** 前台统一子应用：监听基座 pathname，渲染对应页面（保留各页原有样式与逻辑） */
export default function App({ apiBase, hostProps }: AppProps) {
  const pathname = usePathname();
  const page = useMemo(() => resolveWebPage(pathname), [pathname]);

  switch (page) {
    case 'home':
      return <HomePage apiBase={apiBase} />;
    case 'about':
      return <AboutPage apiBase={apiBase} />;
    case 'blog':
      return <BlogPage apiBase={apiBase} />;
    case 'projects':
      return <ProjectsPage apiBase={apiBase} />;
    case 'contact':
      return <ContactPage apiBase={apiBase} hostProps={hostProps} />;
    case 'links':
      return <LinksPage apiBase={apiBase} />;
    default:
      return <HomePage apiBase={apiBase} />;
  }
}
