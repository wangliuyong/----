'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface ContactCallbacksProps {
  children?: ReactNode;
}

/**
 * 联系页：向 Qiankun 子应用注册留言成功回调，并展示基座 Toast
 */
export function ContactCallbacks({ children }: ContactCallbacksProps) {
  const [toast, setToast] = useState('');

  useEffect(() => {
    const callbacks = {
      onMessageSuccess: (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 4000);
      },
    };
    window.__HOST_CALLBACKS__ = callbacks;
    return () => {
      if (window.__HOST_CALLBACKS__ === callbacks) {
        delete window.__HOST_CALLBACKS__;
      }
    };
  }, []);

  return (
    <>
      {toast && (
        <div
          role="status"
          className="mb-4 px-4 py-2 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm"
        >
          {toast}
        </div>
      )}
      {children}
    </>
  );
}
