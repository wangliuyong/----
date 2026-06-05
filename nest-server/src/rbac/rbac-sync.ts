import type { PrismaClient } from '@prisma/client';
import { RBAC_MODULE_TREE, type RbacModuleDef } from './rbac-module-tree';

/** 已合并或废弃的菜单 code，同步时标记为禁用 */
const DEPRECATED_MODULE_CODES = ['site-config', 'site', 'nav', 'about', 'contact'];

/** 递归 upsert 模块与权限点 */
async function seedModuleTree(
  prisma: PrismaClient,
  modules: RbacModuleDef[],
  parentId?: number,
) {
  for (const mod of modules) {
    const record = await prisma.adminModule.upsert({
      where: { code: mod.code },
      update: {
        name: mod.name,
        type: mod.type,
        path: mod.path ?? null,
        icon: mod.icon ?? null,
        sort: mod.sort,
        parentId: parentId ?? null,
      },
      create: {
        code: mod.code,
        name: mod.name,
        type: mod.type,
        path: mod.path ?? null,
        icon: mod.icon ?? null,
        sort: mod.sort,
        parentId: parentId ?? null,
      },
    });

    if (mod.permissions?.length) {
      for (const perm of mod.permissions) {
        await prisma.adminPermission.upsert({
          where: { code: perm.code },
          update: {
            name: perm.name,
            type: perm.type,
            sort: perm.sort ?? 0,
            moduleId: record.id,
          },
          create: {
            code: perm.code,
            name: perm.name,
            type: perm.type,
            sort: perm.sort ?? 0,
            moduleId: record.id,
          },
        });
      }
    }

    if (mod.children?.length) {
      await seedModuleTree(prisma, mod.children, record.id);
    }
  }
}

/**
 * 初始化 RBAC 数据（仅在 AdminModule 表为空时执行，不覆盖已有权限配置）
 */
export async function seedRbac(prisma: PrismaClient, adminUserId: number) {
  const moduleCount = await prisma.adminModule.count();
  if (moduleCount > 0) {
    return;
  }

  await seedModuleTree(prisma, RBAC_MODULE_TREE);

  const allPermissions = await prisma.adminPermission.findMany();
  const superRole = await prisma.adminRole.upsert({
    where: { code: 'super_admin' },
    update: { isSuper: true, status: 1 },
    create: {
      name: '超级管理员',
      code: 'super_admin',
      description: '拥有全部菜单与权限点',
      isSuper: true,
      status: 1,
    },
  });

  for (const perm of allPermissions) {
    await prisma.adminRolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: superRole.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: superRole.id, permissionId: perm.id },
    });
  }

  await prisma.adminUserRole.upsert({
    where: { userId_roleId: { userId: adminUserId, roleId: superRole.id } },
    update: {},
    create: { userId: adminUserId, roleId: superRole.id },
  });
}

/** 确保指定用户绑定超管角色（升级兼容：已有 RBAC 数据时也保证 admin 可登录） */
export async function ensureAdminSuperRole(prisma: PrismaClient, adminUserId: number) {
  const superRole = await prisma.adminRole.findUnique({ where: { code: 'super_admin' } });
  if (!superRole) return;
  await prisma.adminUserRole.upsert({
    where: { userId_roleId: { userId: adminUserId, roleId: superRole.id } },
    update: {},
    create: { userId: adminUserId, roleId: superRole.id },
  });
}

/**
 * 增量同步 RBAC 菜单树（upsert 模块与权限点，并为超管角色补全新权限）。
 * 用于已有数据库升级时追加新菜单（如日志管理）。
 */
export async function syncRbacModules(prisma: PrismaClient) {
  await seedModuleTree(prisma, RBAC_MODULE_TREE);

  // 下线已合并的旧菜单（站点配置四页合一后）
  await prisma.adminModule.updateMany({
    where: { code: { in: DEPRECATED_MODULE_CODES } },
    data: { status: 0 },
  });

  const superRole = await prisma.adminRole.findUnique({ where: { code: 'super_admin' } });
  if (!superRole) return;

  const allPermissions = await prisma.adminPermission.findMany();
  for (const perm of allPermissions) {
    await prisma.adminRolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: superRole.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: superRole.id, permissionId: perm.id },
    });
  }
}
