import type { TreeSelectProps } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { AdminModuleRecord, PermissionAssignNode } from '../types/rbac';
import { buildModuleTree } from './menuUtils';

/** 模块管理树节点：菜单（可展开）+ 权限点（叶子，不可展开） */
export interface ModuleAdminTreeNode {
  /** 菜单用数字 id，权限点用 `perm-{id}` */
  rowKey: string;
  name: string;
  code: string;
  type: 'menu' | 'permission';
  path?: string | null;
  icon?: string | null;
  sort?: number;
  status?: number;
  moduleId?: number;
  permissionId?: number;
  children?: ModuleAdminTreeNode[];
}

/** 是否为分组菜单（无路由，兼容旧 dir 类型） */
export function isMenuGroup(module: { type: string; path?: string | null }) {
  return module.type === 'dir' || (module.type === 'menu' && !module.path);
}

/** 是否为可访问页面菜单 */
export function isPageMenu(module: { type: string; path?: string | null }) {
  return module.type === 'menu' && Boolean(module.path);
}

/** 收集某节点及其全部子孙 id（编辑时排除，防止循环引用） */
export function collectDescendantIds(modules: AdminModuleRecord[], rootId: number): Set<number> {
  const byParent = new Map<number, number[]>();
  for (const m of modules) {
    if (m.parentId != null) {
      const list = byParent.get(m.parentId) ?? [];
      list.push(m.id);
      byParent.set(m.parentId, list);
    }
  }
  const ids = new Set<number>([rootId]);
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop()!;
    for (const childId of byParent.get(id) ?? []) {
      if (!ids.has(childId)) {
        ids.add(childId);
        stack.push(childId);
      }
    }
  }
  return ids;
}

/** 上级菜单 TreeSelect 数据：完整菜单树，仅分组菜单可选 */
export function buildMenuParentTreeData(
  modules: AdminModuleRecord[],
  excludeId?: number,
): NonNullable<TreeSelectProps['treeData']> {
  const excludeIds = excludeId ? collectDescendantIds(modules, excludeId) : new Set<number>();
  const menus = modules.filter(
    (m) => (m.type === 'menu' || m.type === 'dir') && !excludeIds.has(m.id),
  );
  const tree = buildModuleTree(menus);

  const mapNode = (
    node: AdminModuleRecord & { children?: AdminModuleRecord[] },
  ): NonNullable<TreeSelectProps['treeData']>[number] => {
    const group = isMenuGroup(node);
    return {
      title: node.name,
      value: node.id,
      key: node.id,
      /** 页面菜单展示在树中但不可选为上级 */
      disabled: !group,
      selectable: group,
      children: node.children?.length ? node.children.map(mapNode) : undefined,
    };
  };

  return tree.map(mapNode);
}

/** 菜单 + 权限点合并为同一棵树（权限点挂在所属菜单下，无子节点） */
export function buildModuleAdminTree(modules: AdminModuleRecord[]): ModuleAdminTreeNode[] {
  const menuOnly = modules.filter((m) => m.type === 'menu' || m.type === 'dir');
  const menuTree = buildModuleTree(menuOnly);

  const attach = (nodes: (AdminModuleRecord & { children?: AdminModuleRecord[] })[]): ModuleAdminTreeNode[] =>
    nodes.map((node) => {
      const menuChildren = node.children?.length ? attach(node.children) : [];
      const permChildren: ModuleAdminTreeNode[] = (node.permissions ?? []).map((p) => ({
        rowKey: `perm-${p.id}`,
        name: p.name,
        code: p.code,
        type: 'permission' as const,
        sort: p.sort,
        permissionId: p.id,
        moduleId: node.id,
      }));
      const merged = [...menuChildren, ...permChildren];
      return {
        rowKey: String(node.id),
        name: node.name,
        code: node.code,
        type: 'menu' as const,
        path: node.path,
        icon: node.icon,
        sort: node.sort,
        status: node.status,
        moduleId: node.id,
        ...(merged.length ? { children: merged } : {}),
      };
    });

  return attach(menuTree as (AdminModuleRecord & { children?: AdminModuleRecord[] })[]);
}

/** 角色权限分配树：菜单 + 权限点（权限点为叶子） */
export function buildPermissionAssignTreeData(flat: PermissionAssignNode[]): DataNode[] {
  const menus = flat.filter((n) => n.type === 'menu' || n.type === 'dir');
  type Node = PermissionAssignNode & { children?: Node[] };
  const tree = buildModuleTree(menus) as Node[];

  const mapNode = (node: Node): DataNode => {
    const childMenus = (node.children ?? []).map(mapNode);
    const permLeaves: DataNode[] = node.permissions.map((p) => ({
      key: p.id,
      title: `${p.name} (${p.code})`,
      isLeaf: true,
    }));
    return {
      key: `menu-${node.id}`,
      title: node.name,
      children: [...childMenus, ...permLeaves],
    };
  };

  return tree.map(mapNode);
}
