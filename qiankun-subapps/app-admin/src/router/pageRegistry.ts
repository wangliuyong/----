import type { ComponentType } from 'react';

/** 不参与动态路由的 pages 子目录 */
const EXCLUDED_PAGE_DIRS = new Set(['login', 'forbidden']);

type PageModule = { default: ComponentType };

/**
 * 自动扫描 pages/**\/index.tsx，按目录路径建立 path → 组件映射
 * 例：pages/site/index.tsx → path: site；pages/system/modules/index.tsx → system/modules
 */
const pageModules = import.meta.glob('../pages/**/index.tsx', {
  eager: true,
}) as Record<string, PageModule>;

/** 从 glob 文件路径解析路由 path */
function pathFromPageModule(filePath: string): string | null {
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/\/pages\/(.+)\/index\.tsx$/);
  if (!match) return null;
  const path = match[1];
  if (EXCLUDED_PAGE_DIRS.has(path.split('/')[0] ?? path)) return null;
  return path;
}

/** path → 页面组件 */
export const PAGE_BY_PATH: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(pageModules)
    .map(([filePath, mod]) => {
      const path = pathFromPageModule(filePath);
      if (!path) return null;
      return [path, mod.default] as const;
    })
    .filter((entry): entry is [string, ComponentType] => entry !== null),
);

/** 根据路由 path 获取页面组件 */
export function getPageByPath(path: string | null | undefined): ComponentType | null {
  if (!path) return null;
  return PAGE_BY_PATH[path] ?? null;
}

/** 已注册的 path 列表（模块管理页校验用） */
export function listRegisteredPaths(): string[] {
  return Object.keys(PAGE_BY_PATH).sort();
}

/** path 是否已在 pages 目录中找到对应页面 */
export function isPathRegistered(path: string | null | undefined): boolean {
  return Boolean(path && PAGE_BY_PATH[path]);
}
