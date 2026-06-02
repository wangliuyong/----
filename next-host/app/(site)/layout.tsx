import { MainNav } from '@/components/MainNav';
import { QiankunProvider } from '@/components/QiankunProvider';

/** 前台站点布局：顶栏 + 微前端容器 + 页脚 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell">
      <MainNav />
      <main className="site-main">
        <QiankunProvider>{children}</QiankunProvider>
      </main>
      <footer className="site-footer">
        © 2026 | 本项目基于 Next.js + NestJS + Qiankun + Docker + Nginx 搭建
      </footer>
    </div>
  );
}
