'use client';

import { useState } from 'react';
import { MicroPage } from '@/components/MicroPage';

export default function ContactPage() {
  const [toast, setToast] = useState('');

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
      <MicroPage
        hostCallbacks={{
          onMessageSuccess: (msg) => {
            setToast(msg);
            setTimeout(() => setToast(''), 4000);
          },
        }}
      />
    </>
  );
}
