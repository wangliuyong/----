import { MainNav } from '@/components/MainNav';
import { QiankunProvider } from '@/components/QiankunProvider';

/** 前台站点布局：顶栏 + 微前端容器 + 页脚 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <QiankunProvider>{children}</QiankunProvider>
      </main>
      <footer className="border-t dark:border-gray-700 py-6 text-center text-sm text-gray-500">
        © 2026 | 本项目基于 Next.js + NestJS + Qiankun + Docker + Nginx 搭建
      </footer>
    </div>
  );
}
