import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AdminMenuNode {
  id: number;
  code: string;
  name: string;
  type: string;
  path: string | null;
  icon: string | null;
  component: string | null;
  sort: number;
  children?: AdminMenuNode[];
}

/** 聚合 RBAC 查询：用户权限码、菜单树过滤 */
@Injectable()
export class RbacQueryService {
  constructor(private readonly prisma: PrismaService) {}

  /** 获取用户权限上下文 */
  async getUserPermissionContext(userId: number) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== 1) {
      return { isSuper: false, permissionCodes: [] as string[] };
    }

    const isSuper = user.roles.some((ur) => ur.role.isSuper && ur.role.status === 1);
    if (isSuper) {
      const all = await this.prisma.adminPermission.findMany({ select: { code: true } });
      return { isSuper: true, permissionCodes: all.map((p) => p.code) };
    }

    const codes = new Set<string>();
    for (const ur of user.roles) {
      if (ur.role.status !== 1) continue;
      for (const rp of ur.role.permissions) {
        codes.add(rp.permission.code);
      }
    }
    return { isSuper: false, permissionCodes: [...codes] };
  }

  /** 构建完整模块树（管理端用，含禁用项） */
  async getFullModuleTree() {
    const modules = await this.prisma.adminModule.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
      include: { permissions: { orderBy: { sort: 'asc' } } },
    });
    return this.buildTree(modules);
  }

  /** 按用户权限过滤后的侧栏菜单树 */
  async getUserMenuTree(userId: number): Promise<AdminMenuNode[]> {
    const { isSuper, permissionCodes } = await this.getUserPermissionContext(userId);
    const modules = await this.prisma.adminModule.findMany({
      where: { status: 1 },
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });

    const viewableMenuIds = new Set<number>();
    if (isSuper) {
      modules.filter((m) => m.type === 'menu').forEach((m) => viewableMenuIds.add(m.id));
    } else {
      const menuPerms = await this.prisma.adminPermission.findMany({
        where: { code: { in: permissionCodes }, type: 'menu' },
        select: { moduleId: true },
      });
      menuPerms.forEach((p) => viewableMenuIds.add(p.moduleId));
    }

    const visibleIds = new Set<number>();
    const byId = new Map(modules.map((m) => [m.id, m]));

    for (const id of viewableMenuIds) {
      let cur = byId.get(id);
      while (cur) {
        visibleIds.add(cur.id);
        cur = cur.parentId ? byId.get(cur.parentId) : undefined;
      }
    }

    const filtered = modules.filter((m) => visibleIds.has(m.id));
    return this.buildTree(filtered);
  }

  /** 权限分配树：目录/菜单 + 权限点 */
  async getPermissionAssignTree() {
    const modules = await this.prisma.adminModule.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
      include: { permissions: { orderBy: { sort: 'asc' } } },
    });
    return modules.map((m) => ({
      id: m.id,
      code: m.code,
      name: m.name,
      type: m.type,
      parentId: m.parentId,
      permissions: m.permissions.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        type: p.type,
      })),
    }));
  }

  private buildTree<T extends { id: number; parentId: number | null; children?: T[] }>(
    items: T[],
  ): T[] {
    const map = new Map<number, T>();
    items.forEach((item) => map.set(item.id, { ...item, children: [] as T[] }));

    const roots: T[] = [];
    for (const item of map.values()) {
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children!.push(item);
      } else if (!item.parentId) {
        roots.push(item);
      }
    }
    return roots;
  }
}
