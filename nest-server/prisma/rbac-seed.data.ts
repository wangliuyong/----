/**
 * RBAC 初始菜单与权限点定义（与 app-admin pageRegistry 对齐）
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
  type: 'dir' | 'menu';
  path?: string;
  icon?: string;
  component?: string;
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

export const RBAC_MODULE_TREE: RbacModuleDef[] = [
  {
    code: 'site-config',
    name: '站点配置',
    type: 'dir',
    icon: 'SettingOutlined',
    sort: 1,
    children: [
      {
        code: 'site',
        name: '站点设置',
        type: 'menu',
        path: 'site',
        icon: 'SettingOutlined',
        component: 'SitePage',
        sort: 1,
        permissions: viewUpdatePermissions('admin:site', '站点设置'),
      },
      {
        code: 'nav',
        name: '导航管理',
        type: 'menu',
        path: 'nav',
        icon: 'MenuOutlined',
        component: 'NavPage',
        sort: 2,
        permissions: viewUpdatePermissions('admin:nav', '导航管理'),
      },
      {
        code: 'about',
        name: '关于我',
        type: 'menu',
        path: 'about',
        icon: 'InfoCircleOutlined',
        component: 'AboutPage',
        sort: 3,
        permissions: viewUpdatePermissions('admin:about', '关于我'),
      },
      {
        code: 'contact',
        name: '联系我',
        type: 'menu',
        path: 'contact',
        icon: 'MailOutlined',
        component: 'ContactPage',
        sort: 4,
        permissions: viewUpdatePermissions('admin:contact', '联系我'),
      },
    ],
  },
  {
    code: 'content',
    name: '内容管理',
    type: 'dir',
    icon: 'AppstoreOutlined',
    sort: 2,
    children: [
      {
        code: 'articles',
        name: '博客管理',
        type: 'menu',
        path: 'articles',
        icon: 'FileTextOutlined',
        component: 'ArticlesPage',
        sort: 1,
        permissions: crudPermissions('admin:articles', '博客'),
      },
      {
        code: 'projects',
        name: '项目管理',
        type: 'menu',
        path: 'projects',
        icon: 'ProjectOutlined',
        component: 'ProjectsPage',
        sort: 2,
        permissions: crudPermissions('admin:projects', '项目'),
      },
      {
        code: 'links',
        name: '友链管理',
        type: 'menu',
        path: 'links',
        icon: 'LinkOutlined',
        component: 'LinksPage',
        sort: 3,
        permissions: crudPermissions('admin:links', '友链'),
      },
    ],
  },
  {
    code: 'interaction',
    name: '互动管理',
    type: 'dir',
    icon: 'CommentOutlined',
    sort: 3,
    children: [
      {
        code: 'messages',
        name: '留言管理',
        type: 'menu',
        path: 'messages',
        icon: 'CommentOutlined',
        component: 'MessagesPage',
        sort: 1,
        permissions: viewDeletePermissions('admin:messages', '留言'),
      },
    ],
  },
  {
    code: 'system',
    name: '系统管理',
    type: 'dir',
    icon: 'SafetyOutlined',
    sort: 4,
    children: [
      {
        code: 'system-modules',
        name: '模块管理',
        type: 'menu',
        path: 'system/modules',
        icon: 'BlockOutlined',
        component: 'ModulesPage',
        sort: 1,
        permissions: crudPermissions('admin:system:modules', '模块'),
      },
      {
        code: 'system-roles',
        name: '角色管理',
        type: 'menu',
        path: 'system/roles',
        icon: 'TeamOutlined',
        component: 'RolesPage',
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
        component: 'UsersPage',
        sort: 3,
        permissions: [
          ...crudPermissions('admin:system:users', '用户'),
          { code: 'admin:system:users:assign', name: '用户分配角色', type: 'button', sort: 4 },
          { code: 'admin:system:users:reset-password', name: '重置密码', type: 'button', sort: 5 },
        ],
      },
    ],
  },
];
