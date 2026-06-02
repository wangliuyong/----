import { Alert } from 'antd';

/** 路由页加载失败时的统一错误提示 */
export default function PageError({
  message,
  onClose,
}: {
  message: string;
  onClose?: () => void;
}) {
  if (!message) return null;

  return (
    <Alert
      type="error"
      message={message}
      showIcon
      closable={!!onClose}
      onClose={onClose}
      style={{ marginBottom: 16 }}
    />
  );
}
