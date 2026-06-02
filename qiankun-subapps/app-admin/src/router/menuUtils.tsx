import type { MenuProps } from 'antd';
import type { AdminMenuNode } from '../types/rbac';
import { resolveIcon } from './iconRegistry';

/** 扁平化可访问的叶子菜单（type=menu 且有 path） */
export function flattenLeafMenus(nodes: AdminMenuNode[]): AdminMenuNode[] {
  const result: AdminMenuNode[] = [];
  const walk = (list: AdminMenuNode[]) => {
    for (const node of list) {
      if (node.type === 'menu' && node.path) {
        result.push(node);
      }
      if (node.children?.length) walk(node.children);
    }
  };
  walk(nodes);
  return result;
}

/** 默认首页：第一个可访问叶子菜单 path */
export function getDefaultMenuPath(menus: AdminMenuNode[]): string {
  const leaf = flattenLeafMenus(menus)[0];
  return leaf?.path ?? 'site';
}

/** 从 pathname 解析当前菜单 path（支持 system/modules 等多段路径） */
export function resolveMenuPath(pathname: string, menus: AdminMenuNode[]): string {
  const normalized = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  const leaves = flattenLeafMenus(menus);
  const match = leaves
    .filter((m) => m.path)
    .sort((a, b) => (b.path!.length - a.path!.length))
    .find((m) => normalized === m.path || normalized.startsWith(`${m.path}/`));
  return match?.path ?? getDefaultMenuPath(menus);
}

/** 查找 path 所属一级目录 code（SubMenu openKeys） */
export function findDirCodeByPath(path: string, menus: AdminMenuNode[]): string {
  let found = menus[0]?.code ?? '';
  const walk = (nodes: AdminMenuNode[], dirCode: string) => {
    for (const node of nodes) {
      const currentDir = node.type === 'dir' ? node.code : dirCode;
      if (node.type === 'menu' && node.path === path) {
        found = currentDir;
        return true;
      }
      if (node.children?.length && walk(node.children, currentDir)) return true;
    }
    return false;
  };
  walk(menus, '');
  return found;
}

/** 动态菜单 -> Ant Design Menu items */
export function buildMenuItems(menus: AdminMenuNode[]): MenuProps['items'] {
  return menus.map((node) => {
    const Icon = resolveIcon(node.icon);
    if (node.type === 'dir') {
      return {
        key: node.code,
        icon: <Icon />,
        label: node.name,
        children: node.children?.length ? buildMenuItems(node.children) : [],
      };
    }
    return {
      key: node.path ?? node.code,
      icon: <Icon />,
      label: node.name,
    };
  });
}

/** 扁平模块列表转树（模块管理页） */
export function buildModuleTree<T extends { id: number; parentId: number | null }>(
  items: T[],
): (T & { children?: T[] })[] {
  const map = new Map<number, T & { children?: T[] }>();
  items.forEach((item) => map.set(item.id, { ...item, children: [] }));
  const roots: (T & { children?: T[] })[] = [];
  for (const item of map.values()) {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(item);
    } else if (!item.parentId) {
      roots.push(item);
    }
  }
  return roots;
}
