import type { Metadata } from 'next';
import { AdminQiankunProvider } from '@/components/AdminQiankunProvider';

export const metadata: Metadata = {
  title: '管理后台',
  description: '个人站点内容管理',
};

/** 管理后台独立布局：全屏，不含前台导航与页脚 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen w-full bg-[#f0f2f5]">
      <AdminQiankunProvider>{children}</AdminQiankunProvider>
    </div>
  );
}
