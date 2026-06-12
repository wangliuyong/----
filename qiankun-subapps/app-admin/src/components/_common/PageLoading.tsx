import { UiSpin } from '../ui';

/** 管理页首屏加载占位 */
export default function PageLoading() {
  return (
    <div className="page-loading">
      <UiSpin description="加载中..." />
    </div>
  );
}
