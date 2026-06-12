import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { UiButton } from './Button';
import './ui.scss';

export interface UiModalProps {
  open: boolean;
  title?: ReactNode;
  width?: number;
  confirmLoading?: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  footer?: ReactNode | null;
}

/** 模态对话框：玻璃拟态面板 + 焦点陷阱 */
export function UiModal({
  open,
  title,
  width = 560,
  confirmLoading = false,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  children,
  footer,
}: UiModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onCancel]);

  if (!open) return null;

  const defaultFooter = (
    <>
      <UiButton variant="default" onClick={onCancel}>
        {cancelText}
      </UiButton>
      <UiButton variant="primary" loading={confirmLoading} onClick={onOk}>
        {okText}
      </UiButton>
    </>
  );

  return createPortal(
    <div
      ref={overlayRef}
      className="ui-modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === overlayRef.current) onCancel?.();
      }}
    >
      <div
        className="ui-modal"
        style={{ width: Math.min(width, window.innerWidth - 32) }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-modal-title"
      >
        {title ? (
          <header className="ui-modal__header">
            <h2 id="ui-modal-title" className="ui-modal__title">
              {title}
            </h2>
            <button type="button" className="ui-modal__close" onClick={onCancel} aria-label="关闭">
              ×
            </button>
          </header>
        ) : null}
        <div className="ui-modal__body">{children}</div>
        {footer !== null ? (
          <footer className="ui-modal__footer">{footer === undefined ? defaultFooter : footer}</footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
