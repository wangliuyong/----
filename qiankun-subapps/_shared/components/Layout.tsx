import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

/** 子应用根容器，注入 sub-app 排版与主题 Token */
export function SubApp({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('sub-app', className)} {...props}>
      {children}
    </div>
  );
}

/** 页面主标题 */
export function PageTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn('text-3xl font-bold font-serif', className)} {...props}>
      {children}
    </h1>
  );
}

/** 区块二级标题 */
export function SectionTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('text-2xl font-bold mb-4 font-serif', className)} {...props}>
      {children}
    </h2>
  );
}

/** 加载骨架占位 */
export function AppSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="app-skeleton" style={{ padding: '24px 0' }}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={cn(
            'app-skeleton-line',
            i === 0 && 'app-skeleton-line--lg',
            i === 1 && 'app-skeleton-line--md',
          )}
        />
      ))}
    </div>
  );
}

/** 错误提示 */
export function AppError({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div className={cn('app-error', className)} role="alert">
      {message}
    </div>
  );
}

/** 空态文案 */
export function AppEmpty({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn('app-empty', className)}>{children}</p>;
}
