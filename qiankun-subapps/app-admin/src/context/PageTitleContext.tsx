import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_PAGE_TITLE } from '../router/pageTitle';

const PageTitleContext = createContext(DEFAULT_PAGE_TITLE);

/** 由 PageTitleGuard 注入当前路由对应的页面标题 */
export function PageTitleProvider({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <PageTitleContext.Provider value={title}>{children}</PageTitleContext.Provider>
  );
}

/** 布局顶栏等读取当前页面标题 */
export function usePageTitle(): string {
  return useContext(PageTitleContext);
}
