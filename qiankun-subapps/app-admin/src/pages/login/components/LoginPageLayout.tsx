import type { ReactNode } from 'react';
import '../styles/login.scss';
import LoginFormPanel from './LoginFormPanel';
import LoginHeroPanel from './LoginHeroPanel';

export interface LoginPageLayoutProps {
  children: ReactNode;
}

/**
 * 登录页分栏布局
 * 左：摄影背景 + 能力说明；右：表单区
 * 移动端折叠为「背景头图 + 表单」单栏
 */
export default function LoginPageLayout({ children }: LoginPageLayoutProps) {
  return (
    <div className="app-admin admin-login">
      <LoginHeroPanel />
      <LoginFormPanel>{children}</LoginFormPanel>
    </div>
  );
}
