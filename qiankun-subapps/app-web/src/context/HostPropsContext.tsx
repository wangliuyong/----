import { createContext, useContext, type ReactNode } from 'react';
import type { HostProps } from '../../../_shared/mountApp';

const HostPropsContext = createContext<HostProps | undefined>(undefined);

/**
 * 基座 mount props（留言成功回调等）
 * 仅 contact feature 需要，避免 apiBase 之外的 props 层层下传
 */
export function HostPropsProvider({
  hostProps,
  children,
}: {
  hostProps?: HostProps;
  children: ReactNode;
}) {
  return (
    <HostPropsContext.Provider value={hostProps}>{children}</HostPropsContext.Provider>
  );
}

export function useHostProps(): HostProps | undefined {
  return useContext(HostPropsContext);
}
