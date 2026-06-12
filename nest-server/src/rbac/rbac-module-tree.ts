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
    code: 'dashboard',
    name: '首页',
    type: 'menu',
    path: 'dashboard',
    icon: 'HomeOutlined',
    sort: 0,
    permissions: viewOnlyPermissions('admin:dashboard', '首页'),
  },
  {
    code: 'content',
    name: '内容管理',
    type: 'menu',
    icon: 'AppstoreOutlined',
    sort: 1,
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
    sort: 2,
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
    sort: 3,
    children: [
      {
        code: 'system-site-config',
        name: '站点配置',
        type: 'menu',
        path: 'system/site-config',
        icon: 'SettingOutlined',
        sort: 0,
        permissions: [
          { code: 'admin:site:view', name: '站点配置查看', type: 'menu', sort: 0 },
          { code: 'admin:site:update', name: '站点设置编辑', type: 'button', sort: 1 },
          { code: 'admin:nav:view', name: '导航管理查看', type: 'menu', sort: 2 },
          { code: 'admin:nav:update', name: '导航管理编辑', type: 'button', sort: 3 },
          { code: 'admin:about:view', name: '关于我查看', type: 'menu', sort: 4 },
          { code: 'admin:about:update', name: '关于我编辑', type: 'button', sort: 5 },
          { code: 'admin:contact:view', name: '联系我查看', type: 'menu', sort: 6 },
          { code: 'admin:contact:update', name: '联系我编辑', type: 'button', sort: 7 },
        ],
      },
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
    sort: 4,
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
      {
        code: 'ai-assistant-qa',
        name: '用户问答管理',
        type: 'menu',
        path: 'ai-assistant/qa',
        icon: 'CommentOutlined',
        sort: 3,
        permissions: [
          { code: 'admin:ai-qa:view', name: '用户问答查看', type: 'menu', sort: 0 },
          { code: 'admin:ai-qa:delete', name: '用户问答删除', type: 'button', sort: 1 },
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
  {
    code: 'convenience',
    name: '便民管理',
    type: 'menu',
    icon: 'ShopOutlined',
    sort: 5,
    children: [
      {
        code: 'conv-dashboard',
        name: '业务概览',
        type: 'menu',
        path: 'convenience/dashboard',
        icon: 'DashboardOutlined',
        sort: 0,
        permissions: viewOnlyPermissions('admin:conv:dashboard', '便民业务概览'),
      },
      {
        code: 'conv-city-info',
        name: '信息审核',
        type: 'menu',
        path: 'convenience/city-info',
        icon: 'AuditOutlined',
        sort: 1,
        permissions: [
          { code: 'admin:conv:city-info:view', name: '便民信息查看', type: 'menu', sort: 0 },
          { code: 'admin:conv:city-info:audit', name: '便民信息审核', type: 'button', sort: 1 },
          { code: 'admin:conv:city-info:delete', name: '便民信息删除', type: 'button', sort: 2 },
        ],
      },
      {
        code: 'conv-categories',
        name: '分类管理',
        type: 'menu',
        path: 'convenience/categories',
        icon: 'AppstoreOutlined',
        sort: 2,
        permissions: crudPermissions('admin:conv:categories', '便民分类'),
      },
      {
        code: 'conv-banners',
        name: '轮播图管理',
        type: 'menu',
        path: 'convenience/banners',
        icon: 'PictureOutlined',
        sort: 3,
        permissions: crudPermissions('admin:conv:banners', '便民轮播图'),
      },
      {
        code: 'conv-notices',
        name: '公告管理',
        type: 'menu',
        path: 'convenience/notices',
        icon: 'NotificationOutlined',
        sort: 4,
        permissions: crudPermissions('admin:conv:notices', '便民公告'),
      },
      {
        code: 'conv-users',
        name: 'C端用户',
        type: 'menu',
        path: 'convenience/users',
        icon: 'UserOutlined',
        sort: 5,
        permissions: [
          { code: 'admin:conv:users:view', name: 'C端用户查看', type: 'menu', sort: 0 },
          { code: 'admin:conv:users:update', name: 'C端用户编辑', type: 'button', sort: 1 },
          {
            code: 'admin:conv:users:reset-password',
            name: '重置密码',
            type: 'button',
            sort: 2,
          },
        ],
      },
      {
        code: 'conv-reports',
        name: '举报管理',
        type: 'menu',
        path: 'convenience/reports',
        icon: 'WarningOutlined',
        sort: 6,
        permissions: viewDeletePermissions('admin:conv:reports', '便民举报'),
      },
    ],
  },
];
