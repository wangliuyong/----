'use client';

import { WcPage } from '@/components/WcPage';

export default function BlogListPage() {
  return (
    <WcPage
      scriptName="wc-blog"
      tag="wc-blog"
      attrs={{ mode: 'list' }}
    />
  );
}
