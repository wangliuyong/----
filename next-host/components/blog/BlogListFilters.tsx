'use client';

import { AppButton, AppInput } from '@shared/components';
import { cn } from '@shared/utils/cn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export interface BlogListFiltersProps {
  categories: string[];
  className?: string;
}

/**
 * 博客列表筛选栏（客户端）
 * 通过 URL searchParams 驱动，配合服务端重新渲染列表
 */
export default function BlogListFilters({
  categories,
  className,
}: BlogListFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const filterCategory = searchParams.get('category') ?? '';
  const filterTag = searchParams.get('tag') ?? '';

  /** 更新 URL 查询参数并触发服务端重新拉取 */
  const applyFilters = useCallback(
    (next: { category?: string; tag?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const category = next.category ?? filterCategory;
      const tag = next.tag ?? filterTag;

      if (category) params.set('category', category);
      else params.delete('category');

      if (tag) params.set('tag', tag);
      else params.delete('tag');

      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/blog?${qs}` : '/blog');
      });
    },
    [filterCategory, filterTag, router, searchParams],
  );

  return (
    <div className={cn('flex flex-wrap gap-3 mb-6 app-toolbar', className)}>
      <select
        className="app-input w-auto min-w-[140px]"
        value={filterCategory}
        disabled={pending}
        onChange={(e) => applyFilters({ category: e.target.value })}
      >
        <option value="">全部分类</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <AppInput
        className="w-auto min-w-[140px]"
        placeholder="按标签筛选"
        defaultValue={filterTag}
        disabled={pending}
        onBlur={(e) => {
          const value = e.target.value.trim();
          if (value !== filterTag) applyFilters({ tag: value });
        }}
      />
      <AppButton
        disabled={pending}
        onClick={() => {
          startTransition(() => router.push('/blog'));
        }}
      >
        {pending ? '筛选中…' : '重置'}
      </AppButton>
    </div>
  );
}
