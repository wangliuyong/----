import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultMenuPath } from '../../router/menuUtils';

/** 403 无权限页 */
export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const home = profile ? `/${getDefaultMenuPath(profile.menus)}` : '/dashboard';

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问此页面"
      extra={
        <Button type="primary" onClick={() => navigate(home, { replace: true })}>
          返回首页
        </Button>
      }
    />
  );
}
