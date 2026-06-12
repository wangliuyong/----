import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './ui.scss';

type ButtonVariant = 'primary' | 'default' | 'ghost' | 'link' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface UiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  href?: string;
  target?: string;
}

/** 自定义按钮：科技风渐变主按钮 + 玻璃次要按钮 */
export function UiButton({
  variant = 'default',
  size = 'md',
  block = false,
  loading = false,
  icon,
  children,
  className,
  disabled,
  href,
  target,
  ...rest
}: UiButtonProps) {
  const cls = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    block && 'ui-btn--block',
    loading && 'ui-btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? <span className="ui-btn__spinner" aria-hidden /> : null}
      {icon && !loading ? <span className="ui-btn__icon">{icon}</span> : null}
      {children ? <span className="ui-btn__label">{children}</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        className={cls}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled || loading}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={cls} disabled={disabled || loading} type="button" {...rest}>
      {content}
    </button>
  );
}
