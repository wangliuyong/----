import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

type LinkVariant = 'default' | 'ghost' | 'back';

/** 文字链（带箭头 / 返回变体） */
export function AppLink({
  variant = 'default',
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: LinkVariant }) {
  return (
    <a
      className={cn(
        'app-link',
        variant === 'ghost' && 'app-link--ghost',
        variant === 'back' && 'app-link--back',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/** 下划线链接行容器 */
export function AppLinkRow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('app-link-row', className)} {...props}>
      {children}
    </div>
  );
}

/** 行内强调链接（邮箱 / GitHub 等） */
export function AppAccentLink({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'text-accent ml-1 border-b border-line hover:border-accent transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/** 实心按钮 */
export function AppButton({
  className,
  children,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn('app-btn', className)} {...props}>
      {children}
    </button>
  );
}

/** 线框按钮 / 外链 */
export function AppButtonGhost({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn('app-btn-ghost', className)} {...props}>
      {children}
    </a>
  );
}

/** 技能 / 认证标签 */
export function AppTag({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('app-tag', className)} {...props}>
      {children}
    </span>
  );
}

/** 列表项前缀标记 */
export function AppMark({ className }: { className?: string }) {
  return <span className={cn('app-mark shrink-0', className)}>▸</span>;
}

/** 可悬停卡片容器 */
export function AppCard({
  as: Tag = 'div',
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: 'div' | 'article' }) {
  return (
    <Tag className={cn('app-card border border-line rounded-lg bg-surface', className)} {...props}>
      {children}
    </Tag>
  );
}

/** 列表项卡片（博客列表等） */
export function AppListItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('app-card app-list-item p-4', className)} {...props}>
      {children}
    </div>
  );
}

/** 表单输入框 / 下拉 */
export function AppInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  return <input className={cn('app-input', className)} {...props} />;
}

/** 表单字段：标签 + 控件 */
export function AppField({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block text-sm text-muted', className)}>
      {label}
      {required ? ' *' : ''}
      <div className="mt-1">{children}</div>
    </label>
  );
}

/** Markdown 正文容器 */
export function ArticleBody({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn('article-body max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
