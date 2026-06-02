import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getProfile } from '../api/auth.api';
import { clearAuth, isLoggedIn } from '../utils/auth';
import type { AdminProfile } from '../types/rbac';

interface AuthContextValue {
  profile: AdminProfile | null;
  loading: boolean;
  reloadProfile: () => Promise<AdminProfile | null>;
  hasPermission: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** 全局鉴权上下文：登录后拉取 profile（菜单 + 权限码） */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(isLoggedIn());

  const reloadProfile = useCallback(async (): Promise<AdminProfile | null> => {
    if (!isLoggedIn()) {
      setProfile(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    try {
      const data = await getProfile({ skipErrorMessage: true });
      setProfile(data);
      return data;
    } catch {
      clearAuth();
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  const hasPermission = useCallback(
    (code: string) => {
      if (!profile) return false;
      if (profile.isSuper) return true;
      return profile.permissionCodes.includes(code);
    },
    [profile],
  );

  const value = useMemo(
    () => ({ profile, loading, reloadProfile, hasPermission }),
    [profile, loading, reloadProfile, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return ctx;
}

/** 权限判断 hook */
export function usePermission(code: string) {
  const { hasPermission } = useAuth();
  return hasPermission(code);
}
