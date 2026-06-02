import { AppSkeleton, SubApp } from '../../../../_shared/components';

/** 通用页面加载占位（对齐首页 home-skeleton 动效） */
export default function PageLoading() {
  return (
    <SubApp>
      <AppSkeleton lines={4} />
      <AppSkeleton lines={3} />
    </SubApp>
  );
}
