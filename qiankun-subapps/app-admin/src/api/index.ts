export { ApiError, getApiBase, parseErrorMessage, request, setApiBase } from './client';
export type { RequestConfig } from './client';

export { getProfile, login } from './auth.api';
export {
  getSite,
  updateAbout,
  updateContact,
  updateNav,
  updateSite,
} from './site.api';
export {
  createArticle,
  deleteArticle,
  listArticles,
  updateArticle,
} from './articles.api';
export {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from './projects.api';
export { createLink, deleteLink, listLinks, updateLink } from './links.api';
export { deleteMessage, listMessages } from './messages.api';
export { listAppLogs, listAuditLogs } from './logs.api';
export type { AppLog, AuditLog, PaginatedResult } from './logs.api';
export {
  createModule,
  createPermission,
  deleteModule,
  deletePermission,
  listModulePermissions,
  listModules,
  updateModule,
  updatePermission,
} from './rbac/modules.api';
export {
  assignRolePermissions,
  createRole,
  deleteRole,
  getPermissionTree,
  listRoles,
  updateRole,
} from './rbac/roles.api';
export {
  assignUserRoles,
  createUser,
  deleteUser,
  listUsers,
  resetUserPassword,
  updateUser,
} from './rbac/users.api';
