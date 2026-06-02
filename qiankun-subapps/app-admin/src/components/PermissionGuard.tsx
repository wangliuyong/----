import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface PermissionGuardProps {
  code: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/** 按权限码控制子节点渲染（code 为空则始终显示） */
export default function PermissionGuard({
  code,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission } = useAuth();
  if (!code) return <>{children}</>;
  if (!hasPermission(code)) return <>{fallback}</>;
  return <>{children}</>;
}
