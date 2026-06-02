import { createContext, useContext, type ReactNode } from 'react';

const ApiBaseContext = createContext('');

/** 子应用 mount 时由 App 注入 API 基地址 */
export function ApiBaseProvider({
  apiBase,
  children,
}: {
  apiBase: string;
  children: ReactNode;
}) {
  return (
    <ApiBaseContext.Provider value={apiBase}>{children}</ApiBaseContext.Provider>
  );
}

/** 页面与 hooks 读取 Nest API 前缀 */
export function useApiBase(): string {
  return useContext(ApiBaseContext);
}
