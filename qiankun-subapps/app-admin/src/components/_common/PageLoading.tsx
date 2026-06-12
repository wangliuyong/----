import { Spin } from 'antd';

/** 管理页首屏加载占位 */
export default function PageLoading() {
  return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <Spin description="加载中..." />
    </div>
  );
}
