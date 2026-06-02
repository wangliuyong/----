import { createContext, useContext, type ReactNode } from 'react';

const ApiBaseContext = createContext('');

/** 子应用 mount 时由 App 注入 Nest API 前缀 */
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

/** feature hooks 读取公开 API 基地址 */
export function useApiBase(): string {
  return useContext(ApiBaseContext);
}
