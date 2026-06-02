import { SubApp } from '../../../../_shared/components';

/** 通用页面加载占位 */
export default function PageLoading({ label = '加载中...' }: { label?: string }) {
  return (
    <SubApp>
      <p className="text-faint">{label}</p>
    </SubApp>
  );
}
