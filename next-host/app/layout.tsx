import type { Metadata } from 'next';
import { MainNav } from '@/components/MainNav';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: '个人全能站点',
  description: 'Next.js + NestJS + Qiankun 微前端个人站',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      {/* suppressHydrationWarning：避免 next-themes / 浏览器翻译扩展改写 body class 导致水合告警 */}
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors"
      >
        <Providers>
          <MainNav />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <footer className="border-t dark:border-gray-700 py-6 text-center text-sm text-gray-500">
            © 2026 个人站点 | Next.js + NestJS + Qiankun
          </footer>
        </Providers>
      </body>
    </html>
  );
}
