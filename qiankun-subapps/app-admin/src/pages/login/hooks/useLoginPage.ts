import { useState } from 'react';
import { login } from '../../../api/auth.api';
import { saveAuth } from '../../../utils/auth';
import type { LoginFormValues } from '../types';

/** 登录页：提交与错误状态 */
export function useLoginPage(onSuccess: (username: string) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError('');
    try {
      const res = await login(values.username, values.password, {
        skipErrorMessage: true,
      });
      saveAuth(res.accessToken, res.username);
      onSuccess(res.username);
    } catch {
      setError('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, onFinish };
}
