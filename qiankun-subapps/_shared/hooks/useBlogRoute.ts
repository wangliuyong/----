import { useMemo } from 'react';
import { usePathname } from './usePathname';

/** 解析博客列表 / 详情路由 */
export function useBlogRoute() {
  const pathname = usePathname();
  return useMemo(() => {
    const match = pathname.match(/\/blog\/(\d+)/);
    const articleId = match?.[1] ?? '';
    return {
      mode: articleId ? ('detail' as const) : ('list' as const),
      articleId,
    };
  }, [pathname]);
}
