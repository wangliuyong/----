/**
 * RBAC 初始菜单与权限点定义（path 与 app-admin pages 目录对齐）
 */

export interface RbacPermissionDef {
  code: string;
  name: string;
  type: 'menu' | 'button' | 'api';
  sort?: number;
}

export interface RbacModuleDef {
  code: string;
  name: string;
  /** 均为 menu：无 path 为分组菜单，有 path 为页面菜单 */
  type: 'menu';
  path?: string;
  icon?: string;
  sort: number;
  permissions?: RbacPermissionDef[];
  children?: RbacModuleDef[];
}

/** 标准 CRUD 权限点（view 为 menu 类型，其余为 button/api） */
export function crudPermissions(prefix: string, label: string): RbacPermissionDef[] {
  return [
    { code: `${prefix}:view`, name: `${label}查看`, type: 'menu', sort: 0 },
    { code: `${prefix}:create`, name: `${label}新建`, type: 'button', sort: 1 },
    { code: `${prefix}:update`, name: `${label}编辑`, type: 'button', sort: 2 },
    { code: `${prefix}:delete`, name: `${label}删除`, type: 'button', sort: 3 },
  ];
}

/** 仅查看 + 删除（留言） */
export function viewDeletePermissions(prefix: string, label: string): RbacPermissionDef[] {
  return [
    { code: `${prefix}:view`, name: `${label}查看`, type: 'menu', sort: 0 },
    { code: `${prefix}:delete`, name: `${label}删除`, type: 'button', sort: 1 },
  ];
}

/** 仅查看 + 更新（站点类配置页） */
export function viewUpdatePermissions(prefix: string, label: string): RbacPermissionDef[] {
  return [
    { code: `${prefix}:view`, name: `${label}查看`, type: 'menu', sort: 0 },
    { code: `${prefix}:update`, name: `${label}编辑`, type: 'button', sort: 1 },
  ];
}

/** 仅查看（日志类只读页面） */
export function viewOnlyPermissions(prefix: string, label: string): RbacPermissionDef[] {
  return [
    { code: `${prefix}:view`, name: `${label}查看`, type: 'menu', sort: 0 },
  ];
}

export const RBAC_MODULE_TREE: RbacModuleDef[] = [
  {
    code: 'site-config',
    name: '站点配置',
    type: 'menu',
    icon: 'SettingOutlined',
    sort: 1,
    children: [
      {
        code: 'site',
        name: '站点设置',
        type: 'menu',
        path: 'site',
        icon: 'SettingOutlined',
        sort: 1,
        permissions: viewUpdatePermissions('admin:site', '站点设置'),
      },
      {
        code: 'nav',
        name: '导航管理',
        type: 'menu',
        path: 'nav',
        icon: 'MenuOutlined',
        sort: 2,
        permissions: viewUpdatePermissions('admin:nav', '导航管理'),
      },
      {
        code: 'about',
        name: '关于我',
        type: 'menu',
        path: 'about',
        icon: 'InfoCircleOutlined',
        sort: 3,
        permissions: viewUpdatePermissions('admin:about', '关于我'),
      },
      {
        code: 'contact',
        name: '联系我',
        type: 'menu',
        path: 'contact',
        icon: 'MailOutlined',
        sort: 4,
        permissions: viewUpdatePermissions('admin:contact', '联系我'),
      },
    ],
  },
  {
    code: 'content',
    name: '内容管理',
    type: 'menu',
    icon: 'AppstoreOutlined',
    sort: 2,
    children: [
      {
        code: 'articles',
        name: '博客管理',
        type: 'menu',
        path: 'articles',
        icon: 'FileTextOutlined',
        sort: 1,
        permissions: crudPermissions('admin:articles', '博客'),
      },
      {
        code: 'projects',
        name: '项目管理',
        type: 'menu',
        path: 'projects',
        icon: 'ProjectOutlined',
        sort: 2,
        permissions: crudPermissions('admin:projects', '项目'),
      },
      {
        code: 'links',
        name: '友链管理',
        type: 'menu',
        path: 'links',
        icon: 'LinkOutlined',
        sort: 3,
        permissions: crudPermissions('admin:links', '友链'),
      },
    ],
  },
  {
    code: 'interaction',
    name: '互动管理',
    type: 'menu',
    icon: 'CommentOutlined',
    sort: 3,
    children: [
      {
        code: 'messages',
        name: '留言管理',
        type: 'menu',
        path: 'messages',
        icon: 'CommentOutlined',
        sort: 1,
        permissions: viewDeletePermissions('admin:messages', '留言'),
      },
    ],
  },
  {
    code: 'system',
    name: '系统管理',
    type: 'menu',
    icon: 'SafetyOutlined',
    sort: 4,
    children: [
      {
        code: 'system-modules',
        name: '模块管理',
        type: 'menu',
        path: 'system/modules',
        icon: 'BlockOutlined',
        sort: 1,
        permissions: crudPermissions('admin:system:modules', '模块'),
      },
      {
        code: 'system-roles',
        name: '角色管理',
        type: 'menu',
        path: 'system/roles',
        icon: 'TeamOutlined',
        sort: 2,
        permissions: [
          ...crudPermissions('admin:system:roles', '角色'),
          { code: 'admin:system:roles:assign', name: '角色分配权限', type: 'button', sort: 4 },
        ],
      },
      {
        code: 'system-users',
        name: '用户管理',
        type: 'menu',
        path: 'system/users',
        icon: 'UserOutlined',
        sort: 3,
        permissions: [
          ...crudPermissions('admin:system:users', '用户'),
          { code: 'admin:system:users:assign', name: '用户分配角色', type: 'button', sort: 4 },
          { code: 'admin:system:users:reset-password', name: '重置密码', type: 'button', sort: 5 },
        ],
      },
    ],
  },
  {
    code: 'ai-assistant',
    name: 'AI小助手管理',
    type: 'menu',
    icon: 'RobotOutlined',
    sort: 5,
    children: [
      {
        code: 'system-ai-assistant',
        name: '数据配置管理',
        type: 'menu',
        path: 'system/ai-assistant',
        icon: 'DatabaseOutlined',
        sort: 1,
        permissions: [
          { code: 'admin:ai-assistant:view', name: '数据配置查看', type: 'menu', sort: 0 },
          { code: 'admin:ai-assistant:update', name: 'AI配置编辑', type: 'button', sort: 1 },
          { code: 'admin:ai-assistant:sync', name: '同步数据源', type: 'button', sort: 2 },
        ],
      },
      {
        code: 'ai-assistant-knowledge',
        name: '知识库管理',
        type: 'menu',
        path: 'ai-assistant/knowledge',
        icon: 'BookOutlined',
        sort: 2,
        permissions: [
          { code: 'admin:ai-knowledge:view', name: '知识库查看', type: 'menu', sort: 0 },
          { code: 'admin:ai-knowledge:delete', name: '知识库删除', type: 'button', sort: 1 },
        ],
      },
    ],
  },
  {
    code: 'logs',
    name: '日志管理',
    type: 'menu',
    icon: 'FileSearchOutlined',
    sort: 6,
    children: [
      {
        code: 'logs-audit',
        name: '操作审计日志',
        type: 'menu',
        path: 'logs/audit',
        icon: 'AuditOutlined',
        sort: 1,
        permissions: viewOnlyPermissions('admin:logs:audit', '操作审计日志'),
      },
      {
        code: 'logs-app',
        name: '应用错误日志',
        type: 'menu',
        path: 'logs/app',
        icon: 'BugOutlined',
        sort: 2,
        permissions: viewOnlyPermissions('admin:logs:app', '应用错误日志'),
      },
    ],
  },
];
