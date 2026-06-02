import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { setApiBase } from '../api/client';

const ApiBaseContext = createContext('');

/** 子应用 mount 时由 App 注入 API 基地址，并同步到 request 客户端 */
export function ApiBaseProvider({
  apiBase,
  children,
}: {
  apiBase: string;
  children: ReactNode;
}) {
  // 同步写入，避免子组件 effect 早于 setApiBase 发起请求
  setApiBase(apiBase);

  useEffect(() => {
    setApiBase(apiBase);
  }, [apiBase]);

  return (
    <ApiBaseContext.Provider value={apiBase}>{children}</ApiBaseContext.Provider>
  );
}

/** 页面与 hooks 读取 Nest API 前缀 */
export function useApiBase(): string {
  return useContext(ApiBaseContext);
}
