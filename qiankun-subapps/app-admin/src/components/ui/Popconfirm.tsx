import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { UiButton } from './Button';
import './ui.scss';

export interface UiPopconfirmProps {
  title: ReactNode;
  okText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  children: ReactNode;
}

/** 气泡确认框 */
export function UiPopconfirm({
  title,
  okText = '确定',
  cancelText = '取消',
  onConfirm,
  children,
}: UiPopconfirmProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        popRef.current?.contains(e.target as Node) ||
        anchorRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm?.();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const rect = anchorRef.current?.getBoundingClientRect();

  return (
    <>
      <span ref={anchorRef} className="ui-popconfirm-anchor" onClick={() => setOpen((v) => !v)}>
        {children}
      </span>
      {open && rect
        ? createPortal(
            <div
              ref={popRef}
              className="ui-popconfirm"
              style={{ top: rect.bottom + 8, left: Math.max(8, rect.left) }}
              role="dialog"
            >
              <p className="ui-popconfirm__title">{title}</p>
              <div className="ui-popconfirm__actions">
                <UiButton size="sm" variant="default" onClick={() => setOpen(false)}>
                  {cancelText}
                </UiButton>
                <UiButton size="sm" variant="primary" loading={loading} onClick={() => void handleConfirm()}>
                  {okText}
                </UiButton>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
