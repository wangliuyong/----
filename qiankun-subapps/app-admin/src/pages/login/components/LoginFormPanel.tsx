import type { ReactNode } from 'react';

export interface LoginFormPanelProps {
  children: ReactNode;
}

/** 登录页右侧：表单标题区 + 卡片容器 */
export default function LoginFormPanel({ children }: LoginFormPanelProps) {
  return (
    <main className="admin-login-panel">
      <div className="admin-login-panel__inner">
        <header className="admin-login-panel__header">
          <h2 className="admin-login-panel__title">欢迎回来</h2>
          <p className="admin-login-panel__subtitle">使用管理员账号登录以继续。</p>
        </header>

        <div className="admin-login-panel__card">{children}</div>

        <p className="admin-login-panel__footer">
          仅限站点所有者与授权管理员访问
        </p>
      </div>
    </main>
  );
}
