'use client';

import { useParams } from 'next/navigation';
import { WcPage } from '@/components/WcPage';

export default function BlogDetailPage() {
  const params = useParams();
  const id = String(params.id || '');

  return (
    <WcPage
      scriptName="wc-blog"
      tag="wc-blog"
      attrs={{ mode: 'detail', 'article-id': id }}
    />
  );
}
