import { Alert } from 'antd';

/** 路由页加载失败时的统一错误提示 */
export default function PageError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <Alert type="error" message={message} showIcon style={{ marginBottom: 16 }} />
  );
}
