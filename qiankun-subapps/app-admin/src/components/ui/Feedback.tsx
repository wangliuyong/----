import type { ReactNode } from 'react';
import './ui.scss';

export interface UiSpinProps {
  description?: ReactNode;
  className?: string;
}

/** 加载旋转指示器 */
export function UiSpin({ description, className }: UiSpinProps) {
  return (
    <div className={['ui-spin-block', className].filter(Boolean).join(' ')} role="status">
      <span className="ui-spin" />
      {description ? <span className="ui-spin-block__text">{description}</span> : null}
    </div>
  );
}

export interface UiAlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: ReactNode;
  className?: string;
}

/** 内联提示条 */
export function UiAlert({ type = 'info', message, className }: UiAlertProps) {
  return (
    <div className={['ui-alert', `ui-alert--${type}`, className].filter(Boolean).join(' ')} role="alert">
      {message}
    </div>
  );
}

export interface UiEmptyProps {
  description?: ReactNode;
}

/** 空状态占位 */
export function UiEmpty({ description = '暂无数据' }: UiEmptyProps) {
  return (
    <div className="ui-empty">
      <div className="ui-empty__orb" aria-hidden />
      <p className="ui-empty__text">{description}</p>
    </div>
  );
}

export interface UiResultProps {
  status?: '403' | '404' | '500' | 'success' | 'info';
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
}

/** 结果页（403 / 404 等） */
export function UiResult({ status = 'info', title, subTitle, extra }: UiResultProps) {
  return (
    <div className={`ui-result ui-result--${status}`}>
      <div className="ui-result__code" aria-hidden>
        {status}
      </div>
      {title ? <h1 className="ui-result__title">{title}</h1> : null}
      {subTitle ? <p className="ui-result__subtitle">{subTitle}</p> : null}
      {extra ? <div className="ui-result__extra">{extra}</div> : null}
    </div>
  );
}

/** 水平间距容器 */
export function UiSpace({
  children,
  size = 8,
  wrap = false,
  className,
}: {
  children: ReactNode;
  size?: number;
  wrap?: boolean;
  className?: string;
}) {
  return (
    <div
      className={['ui-space', wrap && 'ui-space--wrap', className].filter(Boolean).join(' ')}
      style={{ gap: size }}
    >
      {children}
    </div>
  );
}
