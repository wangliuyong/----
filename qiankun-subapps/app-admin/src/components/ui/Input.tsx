import type { InputHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';
import './ui.scss';

export interface UiInputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: ReactNode;
}

/** 单行输入框 */
export function UiInput({ prefix, className, ...rest }: UiInputProps) {
  return (
    <div className={['ui-input-wrap', className].filter(Boolean).join(' ')}>
      {prefix ? <span className="ui-input-wrap__prefix">{prefix}</span> : null}
      <input className="ui-input" {...rest} />
    </div>
  );
}

export interface UiPasswordProps extends Omit<UiInputProps, 'type'> {}

/** 密码输入框，带可见性切换 */
export function UiPassword({ prefix, className, ...rest }: UiPasswordProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={['ui-input-wrap', 'ui-input-wrap--password', className].filter(Boolean).join(' ')}>
      {prefix ? <span className="ui-input-wrap__prefix">{prefix}</span> : null}
      <input className="ui-input" type={visible ? 'text' : 'password'} {...rest} />
      <button
        type="button"
        className="ui-input-wrap__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? '隐藏密码' : '显示密码'}
        tabIndex={-1}
      >
        {visible ? '隐藏' : '显示'}
      </button>
    </div>
  );
}
