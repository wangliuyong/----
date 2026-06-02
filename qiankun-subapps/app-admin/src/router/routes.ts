import { isAdminStandalone } from '../utils/runtime';

/** React Router basename：独立 /，基座 /admin */
export function getRouterBasename(): string {
  return isAdminStandalone() ? '/' : '/admin';
}
